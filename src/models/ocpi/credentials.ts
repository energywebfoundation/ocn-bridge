export interface ICredentials {
    token: string
    url: string
    roles: IRole[]
}

export interface IRole {
    role: string
    business_details: {
        name: string
        website?: string
        logo?: {
            url: string
            thumbnail?: string
            category: string
            type: string
            width: number
            height: number
        }
    }
    party_id: string,
    country_code: string
}
