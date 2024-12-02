// This is the serializer extracting agency information from the response object
import { agencyUpdateParams } from '../../helpers/interfaces';

export default class AgencySerializer {
    /**
     * Extracts the agency data (as an array of agencies) from the response object
     */
    static getAgenciesFromData(data: any) {
        const docChanges = data._snapshot.docChanges;
        const res: agencyUpdateParams[] = [];
        docChanges.forEach((docChange: any) => {
            const fields = docChange.doc.data.value.mapValue.fields;
            const id = docChange.doc.key.path.segments[docChange.doc.key.path.segments.length - 1];
            // Flatten the fields
            for (let key in fields) {
                for (let key2 in fields[key]) {
                    fields[key] = fields[key][key2];
                }
            }
            fields['id'] = id;
            res.push(fields);
        });
        return res;
    }
}