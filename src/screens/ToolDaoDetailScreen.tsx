import * as React from "react";
import {StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { WebView } from 'react-native-webview';
import ExpandedDAOHeader from "../components/ExpandedDAOHeader";
import {Color, FontFamily, FontSize} from "../GlobalStyles";
import {useRoute} from "@react-navigation/native";
import {DaoInfo} from "../declare/api/DAOApi";
import {useEffect, useState} from "react";
type Props = {};

const ToolDaoDetailScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  // @ts-ignore
  const { daoInfo } = route.params as { daoInfo: DaoInfo};
  const [uri,setUri] = useState<string>('')

  useEffect(() => {
    setUri(daoInfo.home_page);
  },[])

  return (
    <View style={styles.feedsOfDao}>
      <ExpandedDAOHeader daoInfo={daoInfo} isShowBtnChatToggle={false}/>

      <View style={styles.urlBlock}>
        <WebView source={{ uri }}/>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  feedsOfDao: {
    backgroundColor: Color.color1,
    flex: 1,
    width: "100%",
  },
  urlBlock: {
    flex: 1,
    backgroundColor: 'red'
  }
});

export default ToolDaoDetailScreen;
