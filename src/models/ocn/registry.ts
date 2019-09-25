export enum registryListing {
    OK,
    UPDATE_REQUIRED,
    REGISTER_REQUIRED
}

export interface IClientInfo {
    url: string
    address: string
}
