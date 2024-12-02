import { doc, getDoc, getDocs, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase_setup";
import { agencyArchiveParams, agencyUpdateParams } from "../../helpers/interfaces";
import { stateMap, phoneFormat, zipFormat, emailFormat } from "../../helpers/helpers";
import { User } from "./user";

export default class Agency {
    // TODO: Implement error handling wiht a list of things that need change
    static validateOnUpdate(agency: agencyUpdateParams | agencyArchiveParams) {
        if (!agency.id) {
            throw new Error("Agency ID must be present");
        } else if ((agency as agencyArchiveParams).archive) {
            return;
        } else {
            Agency.validateOnCreate(agency as agencyUpdateParams);
        }
        return true;
        
    }

    private static validateOnCreate(params: agencyUpdateParams) {
        if (!params.name) {
            throw new Error("Agency name must be present");
        } else if (!params.phone || !params.phone.match(phoneFormat)) {
            throw new Error("Agency phone number must be present and be 10 digits long (excluding separators like dashes and spaces)");
        } else if (params.email && !params.email.match(emailFormat)) {
            throw new Error("Agency email must be present and be a valid email address");
        } else if (!params.addressLine1) {
            throw new Error("Agency address line 1 must be present");
        } else if (!(params.state in stateMap) && !(params.state in Object.values(stateMap))) {
            throw new Error("Agency state must be present and be a valid state" + JSON.stringify(Object.values(stateMap)));
        } else if (!params.zip || !params.zip.match(zipFormat)) {
            throw new Error("Agency zip code must be present and be a valid zip code");
        }
        params.phone = params.phone.replace(/\D/g, '');
        return true;
    }

    // Get all agencies
    static getAll = async () => {
        try {
            return await getDocs(collection(db, 'agencies'));
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    // Get a specific agency by ID
    static getById = async (id: string) => {
        try {
            const docRef = doc(db, 'agencies', id);
            const agencySnapshot = await getDoc(docRef);
            if (agencySnapshot.exists()) {
                return agencySnapshot.data();
            } else {
                throw new Error("Agency not found");
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    // Create a new agency
    static create = async (agency: agencyUpdateParams) => {
        try {
            Agency.validateOnCreate(agency);
            await addDoc(collection(db, 'agencies'), agency);
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    // Update an existing agency
    static update = async (agency: agencyUpdateParams & { [x: string]: any }) => {
        try {
            Agency.validateOnUpdate(agency);
            await updateDoc(doc(db, 'agencies', agency.id as string), agency);
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
}
