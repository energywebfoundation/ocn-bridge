import { ethers } from "ethers";
import { Signature } from "ethers/utils";
import { IPluggableRegistry } from "./pluggableRegistry";
import { registryABI } from "./registry.abi";

export class DefaultRegistry implements IPluggableRegistry {

    private provider: ethers.providers.JsonRpcProvider
    private readOnlyRegistry: ethers.Contract

    constructor(private jsonRpcProvider: string, private address: string) {
        this.provider = new ethers.providers.JsonRpcProvider(this.jsonRpcProvider)
        this.readOnlyRegistry = new ethers.Contract(this.address, registryABI, this.provider)
    }

    public async getClientURL(countryCode: string, partyID: string): Promise<string> {
        return this.readOnlyRegistry.clientURLOf(this.toHex(countryCode), this.toHex(partyID))
    }

    public async getClientAddress(countryCode: string, partyID: string): Promise<string> {
        return this.readOnlyRegistry.clientAddressOf(this.toHex(countryCode), this.toHex(partyID))
    }

    public async register(countryCode: string, partyID: string, clientURL: string, clientAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        const signer = new ethers.Wallet(signerKey)
        let spender = new ethers.Wallet(spenderKey)
        spender = spender.connect(this.provider)
        const writableRegistry = new ethers.Contract(this.address, registryABI, spender)
        const countryHex = this.toHex(countryCode)
        const partyIdHex = this.toHex(partyID)
        const sig = await this.sign(countryHex, partyIdHex, clientURL, clientAddress, signer)
        const tx = await writableRegistry.register(countryHex, partyIdHex, clientURL, clientAddress, sig.v, sig.r, sig.s)
        await tx.wait()
        return true
    }

    public async update(countryCode: string, partyID: string, clientURL: string, clientAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        const signer = new ethers.Wallet(signerKey)
        let spender = new ethers.Wallet(spenderKey)
        spender = spender.connect(this.provider)
        const writableRegistry = new ethers.Contract(this.address, registryABI, spender)
        const countryHex = this.toHex(countryCode)
        const partyIdHex = this.toHex(partyID)
        const sig = await this.sign(countryHex, partyIdHex, clientURL, clientAddress, signer)
        const tx = await writableRegistry.updateClientInfo(countryHex, partyIdHex, clientURL, clientAddress, sig.v, sig.r, sig.s)
        await tx.wait()
        return true
    }

    private toHex(str: string): string {
        if (str.startsWith("0x")) {
            throw Error("got hex string, want utf-8 string")
        }
        return "0x" + Buffer.from(str).toString("hex")
    }

    private async sign(countryCode: string, partyID: string, clientURL: string, clientAddress: string, wallet: ethers.Wallet): Promise<Signature> {
        const msg = `${countryCode}${partyID}${clientURL}${clientAddress}`
        const msgHash = ethers.utils.keccak256(msg)
        const msgHashBytes = ethers.utils.arrayify(msgHash)
        const flatSig = await wallet.signMessage(msgHashBytes)
        const sig = ethers.utils.splitSignature(flatSig)
        return sig
    }

}
