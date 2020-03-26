import Notary from "@shareandcharge/ocn-notary"
import { ISignableHeaders, IValuesToSign } from "@shareandcharge/ocn-notary/dist/ocpi-request.interface"

export class SignerService {

    constructor() {
        if (!process.env.SIGNER_KEY) {
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
            await notary.sign({headers, params, body}, process.env.SIGNER_KEY!)
            return notary.serialize()
        } catch (err) {
            return err.message
        }
    }

}
