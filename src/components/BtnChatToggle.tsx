import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Color, Border } from "../GlobalStyles";

type Props = {};

const BtnChatToggle: React.FC<Props> = (props) => {
  return (
    <View style={styles.btnchattoggle}>
      <View style={styles.btnfeedsFlexBox}>
        <Image
          style={styles.alertCircleIcon}
          resizeMode="cover"
          source={require("../assets/alertMore.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnfeedsFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    backgroundColor: Color.color1,
    borderRadius: Border.br_xl,
    flexDirection: "row",
  },
  alertCircleIcon: {
    width: 22,
    height: 22,
    overflow: "hidden",
  },
  btnchats: {
    // display: "none",
  },
  btnchattoggle: {
    borderRadius: Border.br_29xl,
    flexDirection: "row",
  },
});

export default BtnChatToggle;
