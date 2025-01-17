import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {Color, Padding} from "../../../GlobalStyles";
import PostList from "../../../components/PostList";
import DaoBriefCard from "../../../components/DaoBriefCard";
import DaoCommunityCard from "../../../components/DaoCommunityCard";
import {DaoInfo, Page, PostInfo} from "../../../declare/api/DAOApi";
import PostApi from "../../../services/DAOApi/Post";
import {useUrl} from "../../../utils/hook";
import {getDebounce, query, sleep} from "../../../utils/util";
import {useSelector} from "react-redux";
import Models from "../../../declare/storeTypes";
import NoDataShow from "../../../components/NoDataShow";
import DaoInfoHeader from "../../../components/DaoInfoHeader";
import PublishContainer from "../../../components/PublishContainer";
import Chats from "../../../components/Chats";
import BottomSheetModal from "../../../components/BottomSheetModal";

type Props = {};
const RecommendDAOListScreen: React.FC<Props> = (props) => {
  const url = useUrl();
  const { daoSearch } = useSelector((state: Models) => state.search);
  const [pageData, setPageData] = useState<Page>({
    page: 1,
    page_size: 20,
    type: -1,
    query: daoSearch,
  });

  const [postListArr,setPostListArr] = useState<PostInfo[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading,setLoading] = useState(false);
  const [isShow,setIsShow] = useState<boolean>(false);
  const [daoInfo, setDaoInfo] = useState<DaoInfo>();

  const loadMore = async () => {
    try {
      const request = (params: Page) => PostApi.getPostListByType(url, params);
      const { data } = await request(pageData);
      const listArr: PostInfo[] = data.data.list;
      setPostListArr(() => [...postListArr,...listArr]);
      setIsLoadingMore(
        data.data.pager.total_rows > pageData.page * pageData.page_size,
      );
      setPageData((pageData) => ({ ...pageData, page: ++pageData.page }));
    } catch (e) {
      if (e instanceof Error) console.error(e)
    }
  };

  const refreshPage = async () => {
    try {
      const pageInfo = { page: 1, page_size: 20, type:-1 , query: daoSearch};
      const request = (params: Page) => PostApi.getPostListByType(url, params);
      const { data } = await request(pageInfo);
      const listArr: PostInfo[] = data.data.list;
      setPostListArr([...listArr]);
      setIsLoadingMore(
        data.data.pager.total_rows > pageInfo.page * pageInfo.page_size,
      );
      setPageData((pageData) => ({ ...pageData, page: 2 }));
    } catch (e) {
      if (e instanceof Error) console.error(e)
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await refreshPage();
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore && !loading) {
      setLoading(true);
      await loadMore();
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   loadMore();
  // },[])

  const toFeedsOfDao = async (item: PostInfo) => {
    setDaoInfo(item.dao);
    setIsShow(true);
  }

  useEffect(() => {
    onRefresh()
  },[daoSearch])


  return (
    <View style={styles.container}>
      <FlatList
        data={postListArr}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => (toFeedsOfDao(item))} style={styles.daoCard}>
            <DaoBriefCard daoCardInfo={item.dao}/>
          </TouchableOpacity>
      }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.flautist}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={() => (
          <>
            {
              loading &&
                <View style={styles.footer}>
                    <ActivityIndicator size="large" />
                </View>
            }
          </>
        )}
        ListEmptyComponent={!postListArr.length && !refreshing ?
          <View style={styles.noData}>
            <NoDataShow/>
          </View>
          : null}
      />

      <BottomSheetModal height={'60%'} visible={isShow} setVisible={setIsShow}>
        {
          daoInfo &&
            <ScrollView>
                <DaoInfoHeader daoInfo={daoInfo}/>
                <View style={styles.channelDao}>
                    <PublishContainer daoInfo={daoInfo}
                    />
                    <Chats/>
                </View>
            </ScrollView>
        }
      </BottomSheetModal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 5,
    alignItems: 'center'
  },
  flautist: {

  },
  noData: {
    flex: 1,
    marginTop: '40%',
  },
  footer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  daoCard: {
    width: '47%',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  channelDao: {
    flex: 1,
    padding: Padding.p_xs,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: Color.color1,
  },
});

export default RecommendDAOListScreen;
