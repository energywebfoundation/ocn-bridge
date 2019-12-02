import { IPrice } from "./session";

export interface ITariff {
    country_code: string
    party_id: string
    id: string
    currency: string
    type?: string
    tariff_alt_text?: Array<{
        language: string
        text: string
    }>
    tariff_alt_url?: string
    min_price?: IPrice
    max_price?: IPrice
    elements: ITariffElement[]
    start_date_time?: string
    end_date_time?: string
    energy_mix?: IEnergyMix
    last_updated: string
}

export interface ITariffElement {
    price_components: IPriceComponent[]
    restrictions?: {
        start_time?: string
        end_time?: string
        start_date?: string
        end_date?: string
        min_kwh?: number
        max_kwh?: number
        min_current?: number
        max_current?: number
        min_power?: number
        max_power?: number
        min_duration?: number
        max_duration?: number
        day_of_week?: string[]
        reservation?: string
    }
}

export interface IPriceComponent {
    type: "ENERGY" | "FLAT" | "PARKING_TIME" | "TIME"
    price: number
    vat?: number
    step_size: number
}

export interface IEnergyMix {
    is_green_energy: boolean
    energy_sources?: Array<{
        source: string
        percentage: number
    }>
    environ_impact?: Array<{
        category: string
        amount: number
    }>
    supplier_name?: string
    energy_product_name?: string
}
