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
export interface IToken {
    country_code: string
    party_id: string
    uid: string
    type: ITokenType
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

export type ITokenType = "AD_HOC_USER" | "APP_USER" | "OTHER" | "RFID"
