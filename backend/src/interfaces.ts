// This file speficies all the interfaces used in the backend of the application
// For agency
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

export interface reportParams {
    agencyIds: string[]
    reportType: string
    startDate: string
    endDate: string
    // TODO: Add more parameters and filters as needed (i.e., sort by which column, etc.)
}