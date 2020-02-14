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
import { connectorFormat, connectorPowerType, connectorStandard, IGeoLocation } from "./locations";
import { authMethod, ICdrToken, IChargingPeriod, IPrice } from "./session";
import { ITariff } from "./tariffs";

export interface IChargeDetailRecord {
    country_code: string
    party_id: string
    id: string
    start_date_time: string
    end_date_time: string
    session_id?: string
    cdr_token: ICdrToken
    auth_method: authMethod
    authorization_reference?: string
    cdr_location: ICdrLocation
    meter_id?: string
    currency: string
    tariffs?: ITariff[]
    charging_periods: IChargingPeriod[]
    signed_data?: ISignedData
    total_cost: IPrice
    total_fixed_cost?: IPrice
    total_energy: number
    total_energy_cost?: IPrice
    total_time: number
    total_time_cost?: IPrice
    total_parking_time?: number
    total_parking_cost?: IPrice
    total_reservation_cost?: IPrice
    remark?: string
    invoice_reference_id?: string
    credit?: boolean
    credit_reference_id?: string
    last_updated: string
}

export interface ISignedData {
    encoding_method: string
    encoding_method_version?: number
    public_key?: string
    signed_values: Array<{
        nature: string
        plain_data: string
        signed_data: string
    }>
    url: string
}

export interface ICdrLocation {
    id: string
    name?: string
    address: string
    city: string
    postal_code: string
    country: string
    coordinates: IGeoLocation
    evse_uid: string
    evse_id: string
    connector_id: string
    connector_standard: connectorStandard
    connector_format: connectorFormat
    connector_power_type: connectorPowerType
}
