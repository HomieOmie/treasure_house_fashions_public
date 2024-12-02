// This is the serializer extracting gift certificate information from the response object
import { giftCertificateCreateParams } from '../../helpers/interfaces';

export default class GiftCertificateSerializer {
    /**
     * Extracts the gift certificate data (as an array of gift certificates) from the response object
     */
    static getCertificatesFromData(certificateData: any, agencyData: any) {
        const docChanges = certificateData._snapshot.docChanges;
        const res: giftCertificateCreateParams[] = [];
        docChanges.forEach((docChange: any) => {
            // Flatten the fields
            const fields = docChange.doc.data.value.mapValue.fields;
            for (let key in fields) {
                for (let key2 in fields[key]) {
                    fields[key] = fields[key][key2];
                }
            }

            // Finds the ID of gift certificate
            // const pathSegment = docChange.doc._key.path.segments;
            // fields['id'] = pathSegment[pathSegment.length - 1];

            // // Finds the agency ID and agency name for gift certificate
            // const agencyPathSegment = fields['agency']._key.path.segments;
            // const aid = agencyPathSegment[agencyPathSegment.length - 1];
            // const agency = agencyData.find((agency: any) => agency.id === aid);
            // if (!agency) {
            //     throw new Error(`Agency not found for id: ${aid}`);
            // }
            // fields['agency'] = {id: aid, name: agency.name};

            res.push(fields);
        });
        return res;
    }
}