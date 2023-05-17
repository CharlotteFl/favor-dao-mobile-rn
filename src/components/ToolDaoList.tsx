import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { FontSize, Color, Border, FontFamily, Padding } from "../GlobalStyles";
import DaoCommunityCard from "./DaoCommunityCard";
import {DaoInfo, Page, PostInfo} from "../declare/api/DAOApi";
import {useResourceUrl, useUrl} from "../utils/hook";
import PostApi from "../services/DAOApi/Post";
import {useNavigation} from "@react-navigation/native";
import Screens from "../navigation/RouteNames";

type Props = {};

const ToolDaoList: React.FC<Props> = (props) => {
  const navigation = useNavigation();
  const url = useUrl();
  const [pageData, setPageData] = useState<Page>({
    page: 1,
    page_size: 10,
  });
  const avatarsResUrl = useResourceUrl('avatars');

  const [daoListArr,setDaoListArr] = useState<DaoInfo[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = async () => {
    try {
      const request = (params: Page) => PostApi.getToolDao(url, params);
      const { data } = await request(pageData);
      const listArr: DaoInfo[] = data.data.list;
      setDaoListArr(() => [...daoListArr,...listArr]);
      setIsLoadingMore(data.data.pager.total_rows > pageData.page * pageData.page_size,);
      setPageData((pageData) => ({ ...pageData, page: ++pageData.page }));
    } catch (e) {
      if (e instanceof Error) console.error(e)
    }
  };

  const handleLoadMore = () => {
    if (isLoadingMore) {
      loadMore();
    }
  };

  const toDetail = (daoInfo: DaoInfo) => {
    // @ts-ignore
    navigation.navigate(Screens.ToolDaoDetail,{ daoInfo: daoInfo});
  }

  useEffect(  () => {
    loadMore();
  },[])

  return (
    <View style={styles.frameContainer}>
      <FlatList
        style={styles.postList}
        data={daoListArr}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toDetail(item)}>
            <View style={styles.daoBlock}>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={{uri: `${avatarsResUrl}/${item.avatar}`}}
              />
              <Text style={styles.text} numberOfLines={1}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal={true}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  postList: {
    // backgroundColor: Color.color1
  },
  daoBlock: {
    alignItems: 'center',
    marginRight: 10,
    marginVertical: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  text: {
    fontFamily: FontFamily.headingH613,
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    color: '#848488',
  },
  frameContainer: {
    paddingLeft: 16,
    alignSelf: "stretch",
    backgroundColor: '#f8f8f8',
  },
})

export default ToolDaoList