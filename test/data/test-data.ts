import { IChargeDetailRecord } from "../../src/models/ocpi/cdrs";
import { ICredentials, IRole } from "../../src/models/ocpi/credentials";
import { ILocation } from "../../src/models/ocpi/locations";
import { ISession } from "../../src/models/ocpi/sessions";
import { ITariff } from "../../src/models/ocpi/tariffs";
import { IToken, IAuthorizationInfo } from "../../src/models/ocpi/tokens";

export const testRoles: IRole[] = [
    {
        role: "CPO",
        business_details: {
            name: "test CPO"
        },
        party_id: "CPO",
        country_code: "MSP"
    }
]

export const testToken: IToken = {
    country_code: "DE",
    party_id: "MSP",
    uid: "0102030405",
    type: "AD_HOC_USER",
    contract_id: "DE-123-XX",
    issuer: "test MSP",
    valid: true,
    whitelist: "ALWAYS",
    last_updated: (new Date()).toISOString()
}

export const testCredentials: ICredentials = {
    token: "token-b",
    url: "http://localhost:3000/ocpi/versions",
    roles: testRoles
}

export const testLocations: ILocation[] = [
    {
        "country_code": "BE",
        "party_id": "BEC",
        "id": "LOC1",
        "publish": true,
        "name": "Gent Zuid",
        "address": "F.Rooseveltlaan 3A",
        "city": "Gent",
        "postal_code": "9000",
        "country": "BEL",
        "coordinates": {
            "latitude": "51.047599",
            "longitude": "3.729944"
        },
        "evses": [{
            "uid": "3256",
            "evse_id": "BE*BEC*E041503001",
            "status": "AVAILABLE",
            "status_schedule": [],
            "capabilities": [
                "RESERVABLE"
            ],
            "connectors": [{
                "id": "1",
                "standard": "IEC_62196_T2",
                "format": "CABLE",
                "power_type": "AC_3_PHASE",
                "max_voltage": 220,
                "max_amperage": 16,
                "tariff_ids": ["11"],
                "last_updated": "2015-06-29T20:39:09Z"
            }],
            "physical_reference": "1",
            "floor_level": "-1",
            "last_updated": "2015-06-29T20:39:09Z"
        }],
        "operator": {
            "name": "BeCharged"
        },
        "last_updated": "2015-06-29T20:39:09Z"
    },
    {
        "country_code": "BE",
        "party_id": "BEC",
        "id": "LOC1",
        "publish": true,
        "name": "Gent Zuid",
        "address": "F.Rooseveltlaan 3A",
        "city": "Gent",
        "postal_code": "9000",
        "country": "BEL",
        "coordinates": {
            "latitude": "51.047599",
            "longitude": "3.729944"
        },
        "evses": [{
            "uid": "3256",
            "evse_id": "BE*BEC*E041503001",
            "status": "AVAILABLE",
            "status_schedule": [],
            "capabilities": [
                "RESERVABLE"
            ],
            "connectors": [{
                "id": "2",
                "standard": "IEC_62196_T2",
                "format": "SOCKET",
                "power_type": "AC_3_PHASE",
                "max_voltage": 220,
                "max_amperage": 16,
                "tariff_ids": ["13"],
                "last_updated": "2015-06-29T20:39:09Z"
            }],
            "physical_reference": "1",
            "floor_level": "-1",
            "last_updated": "2015-06-29T20:39:09Z"
        }],
        "operator": {
            "name": "BeCharged"
        },
        "last_updated": "2015-06-29T20:39:09Z"
    }
]

export const testTariffs: ITariff[] = [
    {
        country_code: "DE",
        party_id: "IGX",
        id: "dai_ac",
        currency: "DAI",
        elements: [{
            price_components: [{
                type: "ENERGY",
                price: 0.45,
                step_size: 1000
            }],
            restrictions: {
                max_kwh: 100
            }
        }],
        last_updated: new Date(2019, 10, 5, 12, 0, 0, 0).toISOString()
    },
    {
        country_code: "DE",
        party_id: "IGX",
        id: "dai_dc",
        currency: "DAI",
        elements: [{
            price_components: [{
                type: "FLAT",
                price: 9,
                step_size: 1
            }],
            restrictions: {
                max_duration: 10800
            }
        }],
        last_updated: new Date(2019, 10, 5, 12, 0, 0, 0).toISOString()
    }
]

export const testSession: ISession = {
    country_code: "DE",
    party_id: "CPO",
    id: "1234",
    start_date_time: new Date().toISOString(),
    kwh: 1.5,
    cdr_token: {
        uid: "1111",
        contract_id: "010203",
        type: "AD_HOC_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc1",
    evse_uid: "123",
    connector_id: "1",
    currency: "EUR",
    status: "ACTIVE",
    last_updated: new Date().toISOString()
}

export const testCdr: IChargeDetailRecord = {
    country_code: "DE",
    party_id: "CPO",
    id: "55",
    start_date_time: new Date(1571216038071).toISOString(),
    end_date_time: new Date(1571216086027).toISOString(),
    cdr_token: {
        uid: "1111",
        contract_id: "010203",
        type: "AD_HOC_USER"
    },
    auth_method: "COMMAND",
    cdr_location: {
        id: "loc1",
        address: "some-street 1",
        city: "Berlin",
        postal_code: "33333",
        country: "DE",
        coordinates: {
            latitude: "0.0",
            longitude: "0.0"
        },
        evse_uid: "123",
        evse_id: "123",
        connector_id: "1",
        connector_format: "SOCKET",
        connector_standard: "IEC_62196_T2",
        connector_power_type: "AC_3_PHASE"
    },
    currency: "EUR",
    charging_periods: [{
        start_date_time: new Date(1571216038071).toISOString(),
        dimensions: [{
            type: "ENERGY",
            volume: 2.5
        }]
    }],
    total_cost: {
        excl_vat: 6
    },
    total_energy: 2.5,
    total_time: 1.7,
    last_updated: new Date().toISOString()
}

export const testCdrList: IChargeDetailRecord[] = [
    {
        country_code: "DE",
        party_id: "IGX",
        id: "12345",
        auth_method: "COMMAND",
        start_date_time: new Date(1571216038071).toISOString(),
        end_date_time: new Date(1571216086027).toISOString(),
        cdr_token: {
            uid: "012345678",
            type: "APP_USER",
            contract_id: "DE-EMY-CJYW58YUJ-X"
        },
        cdr_location: {
            id: "LOC1",
            address: "Ruettenscheider Str. 120",
            city: "Essen",
            postal_code: "45131",
            country: "DE",
            coordinates: {
                latitude: "3.729944",
                longitude: "51.047599"
            },
            evse_uid: "BB-5983-3",
            evse_id: "BB-5983-3",
            connector_id: "1",
            connector_standard: "IEC_62196_T2",
            connector_format: "SOCKET",
            connector_power_type: "AC_1_PHASE"
        },
        currency: "EUR",
        charging_periods: [{
            start_date_time:  new Date(1571216038071).toISOString(),
            dimensions: [{
                "type": "TIME",
                "volume": 1.973
            }],
            tariff_id: "1"
        }],
        total_cost: {
            "excl_vat": 0.45,
            "incl_vat": 0.00
        },
        total_energy: 0.7,
        total_time: 0.016729166666666666,
        last_updated: new Date().toISOString()
    }
]

export const testSessionList: ISession[] = [{
    country_code: "DE",
    party_id: "CPO",
    id: "1234",
    start_date_time: new Date().toISOString(),
    kwh: 1.5,
    cdr_token: {
        uid: "1111",
        contract_id: "010203",
        type: "AD_HOC_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc1",
    evse_uid: "123",
    connector_id: "1",
    currency: "EUR",
    status: "ACTIVE",
    last_updated: new Date().toISOString()
}]

export const testTokens: IToken[] = [testToken, testToken, testToken]

export const testAuthorizationInfo: IAuthorizationInfo = {
    allowed: "ALLOWED",
    token: testToken
}