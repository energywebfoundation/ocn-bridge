/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { IBusinessDetails, IDisplayText, IImage } from "./common";

export interface ILocation {
    country_code: string
    party_id: string
    id: string
    publish: boolean
    publish_allowed_to?: IPublishTokenType[]
    name?: string
    address: string
    city: string
    postal_code?: string
    state?: string
    country: string
    coordinates: IGeoLocation
    related_locations?: IAdditionalGeoLocation[]
    parking_type?: parkingType
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

export interface IGeoLocation {
    latitude: string
    longitude: string
}

export interface IAdditionalGeoLocation {
    latitude: string
    longitude: string
    name?: string
}

export interface IEvse {
    uid: string
    evse_id?: string
    status: evseStatus
    status_schedule?: Array<{
        period_begin: string
        period_end: string
        status: evseStatus
    }>
    capabilities?: capabilities[]
    connectors: IConnector[]
    floor_level?: string
    coordinates?: IGeoLocation
    physical_reference?: string
    directions?: IDisplayText[]
    parking_restrictions?: string[]
    images?: IImage[]
    last_updated: string
}

export type evseStatus =
    "AVAILABLE" |
    "BLOCKED" |
    "CHARGING" |
    "INOPERATIVE" |
    "OUTOFORDER" |
    "PLANNED" |
    "REMOVED" |
    "RESERVED" |
    "UNKNOWN"

export interface IConnector {
    id: string
    standard: connectorStandard
    format: connectorFormat
    power_type: connectorPowerType
    max_voltage: number
    max_amperage: number
    max_electric_power?: number
    tariff_ids?: string[]
    terms_and_conditions?: string
    last_updated: string
}

export type connectorFormat = "SOCKET" | "CABLE"

export type connectorStandard =
    "CHADEMO" |
    "DOMESTIC_A" |
    "DOMESTIC_B" |
    "DOMESTIC_C" |
    "DOMESTIC_D" |
    "DOMESTIC_E" |
    "DOMESTIC_F" |
    "DOMESTIC_G" |
    "DOMESTIC_H" |
    "DOMESTIC_I" |
    "DOMESTIC_J" |
    "DOMESTIC_K" |
    "DOMESTIC_L" |
    "IEC_60309_2_single_16" |
    "IEC_60309_2_three_16" |
    "IEC_60309_2_three_32" |
    "IEC_60309_2_three_64" |
    "IEC_62196_T1" |
    "IEC_62196_T1_COMBO" |
    "IEC_62196_T2" |
    "IEC_62196_T2_COMBO" |
    "IEC_62196_T3A" |
    "IEC_62196_T3C" |
    "PANTOGRAPH_BOTTOM_UP" |
    "PANTOGRAPH_TOP_DOWN" |
    "TESLA_R" |
    "TESLA_S"

export type connectorPowerType = "AC_1_PHASE" | "AC_3_PHASE" | "DC"

export interface IEnergyMix {
    is_green_energy: boolean
    energy_sources?: Array<{
        source: string;
        percentage: number;
    }>;
    environ_impact?: Array<{
        category: string;
        amount: number;
    }>;
    supplier_name?: string
    energy_product_name?: string
}

export interface IHours {
    twentyfourseven: boolean
    regular_hours?: Array<{
        weekday: number
        period_begin: string
        period_end: string
    }>
    expectional_openings?: Array<{
        period_begin: string
        period_end: string
    }>
    expectional_closings?: Array<{
        period_begin: string
        period_end: string
    }>
}

export interface IPublishTokenType {
    uid?: string,
    type?: tokenType,
    visual_number?: string,
    issuer?: string,
    group_id?: string
}

export type tokenType = "AD_HOC_USER" | "APP_USER" | "OTHER" | "RFID"
export type parkingType = "ALONG_MOTORWAY" | "PARKING_GARAGE" | "PARKING_LOT" | "ON_DRIVEWAY" | "ON_STREET" | "UNDERGROUND_GARAGE"

export type capabilities =
    "CHARGING_PROFILE_CAPABLE" |
    "CHARGING_PREFERENCES_CAPABLE" |
    "CHIP_CARD_SUPPORT" |
    "CONTACTLESS_CARD_SUPPORT" |
    "CREDIT_CARD_PAYABLE" |
    "DEBIT_CARD_PAYABLE" |
    "PED_TERMINAL" |
    "REMOTE_START_STOP_CAPABLE" |
    "RESERVABLE" |
    "RFID_READER" |
    "TOKEN_GROUP_CAPABLE" |
    "UNLOCK_CAPABLE"
