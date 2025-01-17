import React, {useState} from 'react';
import TextInputBlock from "./TextInputBlock";
import FavorDaoButton from "./FavorDaoButton";
import {Pressable} from "react-native";
import WalletController from "../libs/walletController";
import {SignatureData} from "../declare/api/DAOApi";

export type Props = {
    fn: (signatureData: SignatureData) => void
    btnText?: string
    type: number
}
const InputPassword = ({fn, btnText = 'Confirm', type}: Props) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const confirm = () => {
        try {
            setLoading(true);
            const privateKey = WalletController.exportPrivateKey(password);
            fn(WalletController.getSignatureData(privateKey, type));
        } catch (e) {
            console.error('Password Error')
        } finally {
            setLoading(false);
        }
    }

    return <>
        <TextInputBlock title={'Password'} placeholder={'Please enter password here'} value={password}
                        setValue={setPassword} secureTextEntry/>
        <Pressable disabled={loading} onPress={confirm} style={{marginTop: 20}}>
            <FavorDaoButton
              isLoading={loading}
              textValue={btnText}
              frame1171275771BackgroundColor="#ff8d1a"
              cancelColor="#fff"
            />
        </Pressable>
    </>
};

export default InputPassword;
