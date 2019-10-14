import { ICredentials, IRole } from "../../src/models/ocpi/credentials"
import { ILocation } from "../../src/models/ocpi/locations"
import { IToken } from "../../src/models/ocpi/tokens";

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
        "type": "ON_STREET",
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
        "type": "ON_STREET",
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

export const testTariffs: any[] = [
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
        last_updated: new Date(2019, 10, 5, 12, 0, 0, 0).toDateString()
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
        last_updated: new Date(2019, 10, 5, 12, 0, 0, 0).toDateString()
    }
]
