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

import Notary from "@shareandcharge/ocn-notary"
import { ISignableHeaders, IValuesToSign } from "@shareandcharge/ocn-notary/dist/ocpi-request.interface"

export class SignerService {

    constructor(private signer?: string) {
        if (!this.signer) {
            throw Error("No SIGNER_KEY provided. Cannot sign and verify messages.")
        }
    }

    public async validate(signature: string, values: IValuesToSign): Promise<void> {
        const notary = await Notary.deserialize(signature)
        const result = notary.verify(values)
        if (!result.isValid) {
            throw Error(result.error)
        }
    }

    public async getSignature({headers = {}, params, body}: { headers?: ISignableHeaders, params?: any, body?: any}): Promise<string> {
        try {
            const notary = new Notary()
            await notary.sign({headers, params, body}, this.signer!)

            return notary.serialize()
        } catch (err) {
            return err.message
        }
    }

}
