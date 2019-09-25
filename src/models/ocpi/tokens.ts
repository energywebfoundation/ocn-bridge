export interface IToken {
    country_code: string
    party_id: string
    uid: string
    type: string
    contract_id: string
    visual_number?: string
    issuer: string
    group_id?: string
    valid: boolean
    whitelist: string
    language?: string
    default_profile_type?: string
    energy_contract?: {
        supplier_name: string
        contract_id?: string
    }
    last_updated: string
}
