import { getDocs, collection, QueryDocumentSnapshot, DocumentData, query, where } from "firebase/firestore";
import { db } from "../../config/firebase_setup";
import { giftCertificateAggregate } from "../../helpers/interfaces";
import { User } from "./user";

const getCertificateForAgency = (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
    const data = doc.data();
    return {
        id: data.agency.id,
        amount: data.amount * data.percentageRedeemed / 100,
        clothingValueRedeemed: data.clothingValueRedeemed
    }
}

function validateParams(startDate: Date, endDate: Date) {
    if (startDate.toString() === 'Invalid Date') {
        throw new Error('Invalid start date');
    } else if (endDate.toString() === 'Invalid Date') {
        throw new Error('Invalid end date');
    } else if (endDate > new Date() || endDate < startDate) {
        throw new Error('End date must be on or before today and on or after the start date');
    }
}

/**
 * Get all gift certificates that were created within the given date range
*/
function getQueryResult(startDate: string, endDate: string) {
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    validateParams(sd, ed);
    return getDocs(
        query(collection(db, 'gift_certificates'), 
            where('dateCreated', '>=', sd),
            where('dateCreated', '<=', ed)
        )
    );
}

// columns: number distributed, amount redeemed, number redeemed, value of clothing redeemed
export async function getAgencyReport (agencyIds: string[], startDate: string, endDate: string, agencies: {id: string, name: string}[]) {
    const queryResult = await getQueryResult(startDate, endDate);
    const certificates: giftCertificateAggregate[] = queryResult.docs.map(getCertificateForAgency)
    // filter out duplicates in array
    const result = certificates.map((certificate) => certificate.id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter((id) => agencyIds.length === 0 || agencyIds.includes(id))
        .map((id) => {
            return {
                'Agency Name': agencies.find((agency) => agency.id === id)?.name || 'Unknown',
                '# Distributed': certificates.filter((certificate) => certificate.id === id).length.toString(),
                '# Redeemed': certificates.filter((certificate) => certificate.id === id)
                    .filter((certificate) => certificate.clothingValueRedeemed > 0).length.toString(),
                'Amount Redeemed': certificates.filter((certificate) => certificate.id === id)
                    .reduce((acc, certificate) => acc + certificate.amount, 0).toString(),
                'Clothing Value Redeemed': certificates.filter((certificate) => certificate.id === id)
                    .reduce((acc, certificate) => acc + certificate.clothingValueRedeemed, 0).toString()
            }
        }
    )
    // add agencies that have no certificates distributed or redeemed given the date range
    agencies.forEach((agency) => {
        if ((!result.find((row) => row['Agency Name'] === agency.name)) 
            && (agencyIds.length === 0 || agencyIds.includes(agency.id))){
            result.push({
                'Agency Name': agency.name,
                '# Distributed': '0',
                '# Redeemed': '0',
                'Amount Redeemed': '0',
                'Clothing Value Redeemed': '0'
            })}
        }
    )
    result.sort((a, b) => a['Agency Name'].localeCompare(b['Agency Name']));
    return result;
}

export async function getCertificateReport(agencyIds: string[], startDate: string, endDate: string, agencies: {id: string, name: string}[]) {
    const queryResult = await getQueryResult(startDate, endDate);
    const certificates: DocumentData[] = queryResult.docs
        .filter((doc) => agencyIds.length === 0 || agencyIds.includes(doc.data().agency.id)) // include all or only selected agencies
        .map(doc => {
            const fields = doc.data();
            return {
                'ID': doc.id,
                'Agency': agencies.find((agency) => agency.id === fields.agency.id)?.name || 'Unknown',
                'Amount': fields.amount,
                'Date Created': fields.dateCreated.toDate().toISOString().split('T')[0],
                'Date Redeemed': fields.dateRedeemed ? fields.dateRedeemed.toDate().toISOString().split('T')[0] : 'N/A',
                'Amount Redeemed': fields.percentageRedeemed * fields.amount / 100,
                'Clothing Value Redeemed': fields.clothingValueRedeemed
            };
        })
        .sort((a, b) => a['Agency'].localeCompare(b['Agency'] || a['Date Created'].localeCompare(b['Date Created'])))
    return certificates;
}
