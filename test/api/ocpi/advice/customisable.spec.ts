import { assert } from "chai"
import "mocha"
import { CustomisableController } from "../../../../src/api/ocpi/advice/customisable"
import { IModules, ModuleImplementation } from "../../../../src/models/bridgeConfigurationOptions"
import { IEndpoint } from "../../../../src/models/ocpi/common"
import { PluggableAPIStub } from "../../../stubs/pluggableAPI.stub"

describe("Customisable Controller Advice", () => {

    const cases: Array<{
        name: string
        ip: string
        modules: IModules
        expectedEndpoints: IEndpoint[]
    }> = [
            {
                name: "all",
                ip: "http://localhost:8080",
                modules: { implementation: ModuleImplementation.ALL },
                expectedEndpoints: [
                    {
                        identifier: "commands",
                        role: "SENDER",
                        url: "http://localhost:8080/ocpi/sender/2.2/commands"
                    },
                    {
                        identifier: "locations",
                        role: "SENDER",
                        url: "http://localhost:8080/ocpi/sender/2.2/locations"
                    },
                    {
                        identifier: "tariffs",
                        role: "SENDER",
                        url: "http://localhost:8080/ocpi/sender/2.2/tariffs"
                    },
                    {
                        identifier: "commands",
                        role: "RECEIVER",
                        url: "http://localhost:8080/ocpi/receiver/2.2/commands"
                    },
                    {
                        identifier: "sessions",
                        role: "RECEIVER",
                        url: "http://localhost:8080/ocpi/receiver/2.2/sessions"
                    },
                    {
                      identifier: "cdrs",
                      role: "RECEIVER",
                      url: "http://localhost:8080/ocpi/receiver/2.2/cdrs"
                    }
                ]
            },
            {
                name: "cpo",
                ip: "http://cool.startup.io",
                modules: { implementation: ModuleImplementation.CPO },
                expectedEndpoints: [
                    {
                        identifier: "locations",
                        role: "SENDER",
                        url: "http://cool.startup.io/ocpi/sender/2.2/locations"
                    },
                    {
                        identifier: "tariffs",
                        role: "SENDER",
                        url: "http://cool.startup.io/ocpi/sender/2.2/tariffs"
                    },
                    {
                        identifier: "commands",
                        role: "RECEIVER",
                        url: "http://cool.startup.io/ocpi/receiver/2.2/commands"
                    },
                ]
            },
            {
                name: "msp",
                ip: "https://big.company.com",
                modules: { implementation: ModuleImplementation.MSP },
                expectedEndpoints: [
                    {
                        identifier: "commands",
                        role: "SENDER",
                        url: "https://big.company.com/ocpi/sender/2.2/commands"
                    },
                    {
                        identifier: "sessions",
                        role: "RECEIVER",
                        url: "https://big.company.com/ocpi/receiver/2.2/sessions"
                    },
                    {
                        identifier: "cdrs",
                        role: "RECEIVER",
                        url: "https://big.company.com/ocpi/receiver/2.2/cdrs"
                    }
                ]
            },
            {
                name: "custom",
                ip: "http://1.2.3.4",
                modules: {
                    implementation: ModuleImplementation.CUSTOM,
                    sender: ["commands"], receiver: ["commands"]
                },
                expectedEndpoints: [
                    {
                        identifier: "commands",
                        role: "SENDER",
                        url: "http://1.2.3.4/ocpi/sender/2.2/commands"
                    },
                    {
                        identifier: "commands",
                        role: "RECEIVER",
                        url: "http://1.2.3.4/ocpi/receiver/2.2/commands"
                    },
                ]
            }
        ]

    context("getNeededEndpoints", () => {

        for (const test of cases) {
            it(test.name, () => {
                const got = CustomisableController.getNeededEndpoints(test.ip, test.modules)
                assert.deepEqual(got, test.expectedEndpoints)
            })
        }

    })

    it("isIncluded", () => {
        const got = CustomisableController.isIncluded("commands", "RECEIVER", cases[0].modules, new PluggableAPIStub())
        assert.equal(got, true)
    })

})
