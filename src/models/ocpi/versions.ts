interface IVersion {
    version: string,
    url: string
}

export interface IVersions extends Array<IVersion> {}

export interface IVersionDetail {
    version: string,
    endpoints: Array<{
        identifier: string,
        role: string,
        url: string
    }>
}
