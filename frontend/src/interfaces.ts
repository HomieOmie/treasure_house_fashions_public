// This file speficies all the interfaces used in the frontend of the application
// For certificate pages

export interface CertificateEditParams {
    agencyId: string,
    amountToRedeem: number,
    dateCreated: string,
    discount: number,
    dateRedeemed?: string,
    description: string,
}

export interface CertificateEditorParams {
    onEdit: Function,
    certificate: certificate,
    onCancel: Function,
}

// For certificates page
export interface CertificatesAddParams {
    agencyId: string,
    amount: number,
    num: number,
}

export interface CertificateCreatorParams {
    onCreation: Function,
    onCancel: Function,
}

// I have decided to keep the dateCreated and dateRedeemed as strings for now,
// since type checking for dates in react-bootstrap components is too complicated to manage
export interface certificate {
    id: string,
    agency: certificateAgency,
    amount: number,
    percentageRedeemed: number, // sum(redeemedAmount / amount)
    clothingValueRedeemed: number, // calculated from sum(amount / (1 - discount))
    dateCreated: string, // Format: "YYYY-MM-DD"
    dateRedeemed?: string,
    description: string,
}

export interface certificateAgency {
    id: string,
    name: string,
}

// For agency pages
// TODO: Add a field for the contact person of the agency (string)
export interface AgencyParams {
    renderObject: agency,
    callback: Function
}

export interface AgencyEditParams {
    name: string,
    addressLine1: string,
    addressLine2?: string,
    phone: string,
    email: string,
    city: string,
    state: string,
    zip: string,
    active: boolean
}

export interface AgencyEditorParams {
    onEdit: Function,
    onCancel: Function,
    agency: agency,
}

// For agencies page
export interface AgencyAddParams {
    name: string,
    addressLine1: string,
    addressLine2?: string,
    phone: string,
    email: string,
    city: string,
    state: string,
    zip: string,
    active: boolean
}

export interface AgencyCreatorParams {
    onCreation: Function,
    onClose: Function,
    nameList: string[]
}

export interface agency {
    id: string,
    name: string,
    addressLine1: string,
    addressLine2?: string,
    phone: string,
    email: string,
    city: string,
    state: string,
    zip: string,
    active: boolean
}

// For user pages
export interface UserParams {
    renderObject: user,
    callback: Function
}

export interface UserAddParams {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: string
}

export interface UserCreatorParams {
    onCreation: Function
}

export interface UserEditParams {
    firstName: string,
    lastName: string,
    phone: string,
    role: string
    // password: string,
    /* TODO: Discuss with the client to determine if the role should be editable 
        (i.e., if there is a new hire/promotion/transfer/etc.) */
    // role: string
}

export interface UserEditorParams {
    onEdit: Function,
    user: user,
}

export interface user {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: string, // only includes [admin, user]
    status: boolean
    // TODO: add password-related fields and a password reset feature
}

// For helper components
// NOTE: I did not merge number inputs and text inputs just in case additional props
// are needed for each type of input
export interface NumberInputParams {
    id: string,
    label: string,
    value: number,
    setValue: Function,
}

export interface TextInputParams {
    id: string,
    label: string,
    value: string,
    setValue: Function,
}

export interface CheckboxSelectInputParams {
    id: string;
    label: string;
    options: { label: string, value: string }[];
    placeholder?: string;
}

// [id, label, value, setValue, defaultValue?]
export type TextInputFields = [string, string, string, React.Dispatch<React.SetStateAction<string>>, string?];
