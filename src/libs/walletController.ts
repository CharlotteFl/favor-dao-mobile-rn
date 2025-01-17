import {updateState} from "../store/wallet";
import Wallet, {hdkey} from "ethereumjs-wallet";
import UserApi from "../services/DAOApi/User";
import {SignatureData} from "../declare/api/DAOApi";

const bip39 = require('bip39');
const {ecsign, toRpcSig, hashPersonalMessage} = require('ethereumjs-util');
import {encrypt, decrypt} from '../utils/crypto'
import Favor from "./favor";
import _ from 'lodash'

export type State = {
    data?: string;
    token?: Record<number, string>
}

class WalletController {
    state: State;

    constructor() {
        this.state = {};
    }

    init(store: any) {
        const reduxState = store?.getState?.();
        const state = _.cloneDeep(reduxState?.wallet);
        this.state = new Proxy(state, {
            set(target: State, p: keyof State, newValue: any, receiver: any): boolean {
                target[p] = newValue;
                console.log(p, newValue)
                store.dispatch(updateState({key: p, value: newValue}));
                return true
            }
        })
    }

    get token() {
        return this.state.token?.[Favor.networkId!]
    }

    createMnemonic() {
        return bip39.generateMnemonic();
    }

    importMnemonic(password: string, mnemonic: string) {
        if (!password) {
            throw new Error('Password Invalid');
        }
        if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error('Private Key Invalid');
        }
        this.state.data = encrypt(mnemonic, password);
    }

    signMessage(message: string, privateKey: Buffer) {
        const messageBuffer = hashPersonalMessage(Buffer.from(message));
        const signature = ecsign(messageBuffer, privateKey);
        return toRpcSig(signature.v, signature.r, signature.s);
    }

    exportPrivateKey(password: string) {
        const mnemonic = this.exportMnemonic(password);
        const hdWallet = hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic));
        const wallet = hdWallet.derivePath("m/44'/60'/0'/0/0").getWallet()
        return wallet.getPrivateKey();
    }

    exportMnemonic(password: string) {
        const mnemonic = decrypt(this.state.data!, password);
        if (!mnemonic) {
            throw new Error('Password Invalid')
        }
        return mnemonic;
    }

    async login(url: string, sign: Buffer | SignatureData) {

        const {data} = await UserApi.signIn(url,
          Buffer.isBuffer(sign) ? this.getSignatureData(sign) : sign
        );
        this.state.token = Object.assign(this.state.token ?? {}, {
            [Favor.networkId!]: data.data.token
        })
    }

    getSignatureData(privateKey: Buffer, type = 0): SignatureData {
        const address = Wallet.fromPrivateKey(privateKey).getAddressString();
        const timestamp = Date.parse(new Date().toUTCString());
        let msg = '';
        if (type === 0) {
            msg = `${address} login FavorDAO at ${timestamp}`;
        } else if (type === 1) {
            msg = `${address} subscribe DAO at ${timestamp}`;
        } else if (type === 2) {
            msg = `delete ${address} account at ${timestamp}`;
        }
        const signature = this.signMessage(msg, privateKey);
        return {
            timestamp,
            signature,
            wallet_addr: address,
            type: 'meta_mask',
        }
    }

    logout() {
        Object.keys(this.state).map((item) => {
            this.state[item as keyof State] = undefined
        })
    }

    changePassword(newPassword: string, oldPassword: string) {
        const mnemonic = this.exportMnemonic(oldPassword);
        this.importMnemonic(newPassword, mnemonic);
    }
}

export default new WalletController();
