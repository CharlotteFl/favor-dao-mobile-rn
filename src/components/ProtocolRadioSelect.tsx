import * as React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {Color, FontSize, FontFamily} from "../GlobalStyles";
import AgreeCheckBox from "./AgreeCheckbox";

type Props = {
    value: boolean
    setValue: (value: boolean) => void
}
const ProtocolRadioSelect = ({value, setValue}: Props) => {
    return (
        <View style={styles.controlstableViewrowxchecParent}>
            <AgreeCheckBox value={value} setValue={setValue}/>
            <Text style={styles.description}>
                <Text style={styles.iHaveCarefully}>{`I have carefully read and agree to `}</Text>
                <Text style={styles.theUserAgreement}>the user agreement</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    controlstableViewrowxchecIcon: {
        width: 16,
        height: 16,
    },
    iHaveCarefully: {
        color: Color.iOSSystemLabelsLightPrimary,
    },
    theUserAgreement: {
        color: Color.color,
    },
    description: {
        flex: 1,
        fontSize: FontSize.size_xs,
        letterSpacing: 0,
        lineHeight: 20,
        fontFamily: FontFamily.paragraphP313,
        textAlign: "left",
        marginLeft: 10,
    },
    controlstableViewrowxchecParent: {
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
});

export default ProtocolRadioSelect;
