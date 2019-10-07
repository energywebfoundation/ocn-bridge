import { IGeoLocation } from "./cdrs";
import { IDisplayText } from "./common";

export interface ILocation {
    country_code: string
    party_id: string
    id: string
    type: string
    name?: string
    address: string
    city: string
    postal_code?: string
    state?: string
    country: string
    coordinates: IGeoLocation
    related_locations?: IAdditionalGeoLocation[]
    evses?: IEvse[]
    directions?: IDisplayText[]
    operator?: IBusinessDetails
    suboperator?: IBusinessDetails
    owner?: IBusinessDetails
    facilities?: string[]
    time_zone?: string
    opening_times?: IHours
    charging_when_closed?: boolean
    images?: IImage[]
    energy_mix?: IEnergyMix
    last_updated: string
}

export interface IAdditionalGeoLocation {
    latitude: string
    longitude: string
    name?: string
}

export interface IEvse {
    uid: string
    evse_id?: string
    status: string
    status_schedule?: Array<{
        period_begin: string
        period_end: string
        status: string
    }>
    capabilities?: string[]
    connectors: IConnector[]
    floor_level?: string
    coordinates?: IGeoLocation
    physical_reference?: string
    directions?: IDisplayText[]
    parking_restrictions?: string[]
    images?: IImage[]
    last_updated: string
}

export interface IConnector {
    id: string
    standard: string
    format: string
    power_type: string
    max_voltage: number
    max_amperage: number
    max_electric_power?: number
    tariff_ids?: string[]
    terms_and_conditions?: string
    last_updated: string
}

export interface IBusinessDetails {
    name: string
    website?: string
    logo?: IImage
}

export interface IEnergyMix {
    is_green_energy: boolean
    energy_sources?: {
        source: string
        percentage: number
    }
    environ_impact?: {
        category: string
        amount: number
    }
    supplier_name?: string
    energy_product_name?: string
}

export interface IHours {
    twentyfourseven: boolean
    regular_hours?: {
        weekday: number
        period_begin: string
        period_end: string
    }
    expectional_openings?: {
        period_begin: string
        period_end: string
    }
    expectional_closings?: {
        period_begin: string
        period_end: string
    }
}

export interface IImage {
    url: string
    thumbnail: string
    category: string
    type: string
    width?: number
    height?: number
}
