export enum registryListing {
    OK,
    UPDATE_REQUIRED,
    REGISTER_REQUIRED
}

export interface INodeInfo {
    url: string
    address: string
}
