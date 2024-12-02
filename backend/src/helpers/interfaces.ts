import { DocumentData, DocumentReference } from "firebase/firestore";

// This file stores all the interfaces used in the backend
export interface agencyUpdateParams {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    zip: string;
    active: boolean;
}

export interface userUpdateParams {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    status: boolean;
}

export interface userParams {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: number;
    status: boolean;
}

export interface agencyArchiveParams {
    id: string;
    active: boolean;
    archive: boolean;
}

export interface giftCertificateCreateParams {
    amount: number;
    agencyId: string;
    dateCreated: Date;
}

export interface giftCertificateUpdateParams {
    id: string;
    amountToRedeem: number;
    discount: number;
    agencyId: string;
    dateCreated: Date;
    dateRedeemed?: Date | null;
    description: string;
}

export interface giftCertificateDataParams {
    amount: number;
    agency: DocumentReference<DocumentData, DocumentData>;
    dateCreated: Date;
    dateRedeemed: Date | null;
    percentageRedeemed: number;
    clothingValueRedeemed: number;
    description: string;
}

export interface UserSignInParams {
    email: string;
    password: string;
}

type agencyRef = DocumentReference<DocumentData, DocumentData>

export interface giftCertificateAggregate {
    amount: number;
    id: string;
    clothingValueRedeemed: number;
}
