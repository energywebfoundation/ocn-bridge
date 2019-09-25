export interface IVersions {
    versions: Array<{
        version: string,
        url: string
    }>
}

export interface IVersionDetail {
    version: string,
    endpoints: Array<{
        identifier: string,
        role: string,
        url: string
    }>
}
