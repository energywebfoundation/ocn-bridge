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

    public async getNodeURL(countryCode: string, partyID: string): Promise<string> {
        return this.readOnlyRegistry.nodeURLOf(this.toHex(countryCode), this.toHex(partyID))
    }

    public async getNodeAddress(countryCode: string, partyID: string): Promise<string> {
        return this.readOnlyRegistry.nodeAddressOf(this.toHex(countryCode), this.toHex(partyID))
    }

    public async register(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        const signer = new ethers.Wallet(signerKey)
        let spender = new ethers.Wallet(spenderKey)
        spender = spender.connect(this.provider)
        const writableRegistry = new ethers.Contract(this.address, registryABI, spender)
        const countryHex = this.toHex(countryCode)
        const partyIdHex = this.toHex(partyID)
        const sig = await this.sign(countryHex, partyIdHex, nodeURL, nodeAddress, signer)
        const tx = await writableRegistry.register(countryHex, partyIdHex, nodeURL, nodeAddress, sig.v, sig.r, sig.s)
        await tx.wait()
        return true
    }

    public async update(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, signerKey: string, spenderKey: string): Promise<boolean> {
        const signer = new ethers.Wallet(signerKey)
        let spender = new ethers.Wallet(spenderKey)
        spender = spender.connect(this.provider)
        const writableRegistry = new ethers.Contract(this.address, registryABI, spender)
        const countryHex = this.toHex(countryCode)
        const partyIdHex = this.toHex(partyID)
        const sig = await this.sign(countryHex, partyIdHex, nodeURL, nodeAddress, signer)
        const tx = await writableRegistry.updateNodeInfo(countryHex, partyIdHex, nodeURL, nodeAddress, sig.v, sig.r, sig.s)
        await tx.wait()
        return true
    }

    private toHex(str: string): string {
        if (str.startsWith("0x")) {
            throw Error("got hex string, want utf-8 string")
        }
        return "0x" + Buffer.from(str).toString("hex")
    }

    private async sign(countryCode: string, partyID: string, nodeURL: string, nodeAddress: string, wallet: ethers.Wallet): Promise<Signature> {
        const msg = `${countryCode}${partyID}${nodeURL}${nodeAddress}`
        const msgHash = ethers.utils.keccak256(Buffer.from(msg))
        const msgHashBytes = ethers.utils.arrayify(msgHash)
        const flatSig = await wallet.signMessage(msgHashBytes)
        const sig = ethers.utils.splitSignature(flatSig)
        return sig
    }

}
