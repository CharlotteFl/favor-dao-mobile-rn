import React, {useEffect, useMemo, useState, useRef} from 'react';
import {Image, StyleSheet, View, Text, Pressable, SafeAreaView, ScrollView} from "react-native";
import VideoDetailButton from "../components/VideoDetailButton";
import {useNavigation, useRoute} from "@react-navigation/native";
import {FontSize, FontFamily, Color, Border} from "../GlobalStyles";
import {useResourceUrl, useUrl} from "../utils/hook";
import PostApi from "../services/DAOApi/Post";
import {PostInfo} from "../declare/api/DAOApi";
import {getContent} from "../utils/util";
import Video from 'react-native-video';
import {Icon} from "@rneui/themed";
import Favor from "../libs/favor";
import SubscribeModal from "../components/SubscribeModal";

export type Props = {};
const VideoPlayScreen: React.FC<Props> = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const url = useUrl();
    const resourceUrl = useResourceUrl('images')
    const {postId} = route.params as { postId: string };
    const [videoData, setVideoData] = useState<PostInfo | null>(null);
    const [isReTransfer, setIsReTransfer] = useState<boolean>(false);
    const [subModal, setSubModal] = useState(false);

    const playable = useMemo(() => videoData?.member === 0 ? true : videoData?.dao.is_subscribed, [videoData])

    const getVideoById = async (id: string) => {
        try {
            const {data} = await PostApi.getPostById(url, id);
            const videoData = data.data;
            console.log(videoData)
            if (videoData) {
                setVideoData(videoData);
                if (videoData.author_dao.id) setIsReTransfer(true);
                if (videoData.member !== 0 && !videoData.dao.is_subscribed) setSubModal(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const info = useMemo(() => {
        if (!videoData) return {};
        const obj = getContent(videoData.type === 2 || videoData.type === 3 ? videoData.orig_contents : videoData.contents);
        return {
            title: obj[1][0].content,
            description: obj[2][0].content,
            thumbnail: obj[3][0].content,
            hash: obj[4][0].content
        }
    }, [videoData])

    useEffect(() => {
        if (postId) {
            getVideoById(postId);
        }
    }, [postId]);

    const subSuccess = async () => {
        await getVideoById(postId);
        setSubModal(false);
    }

    if (!videoData) return null;

    return (
      <View style={styles.container}>
          <Pressable
            style={styles.wrapper}
            onPress={() => navigation.goBack()}
          >
              <Icon type={'antdesign'} name={'left'} color={Color.color1}/>
          </Pressable>

          <View style={styles.box}>
              <View style={styles.videoBox}>
                  {
                    !playable &&
                      <Pressable onPress={() => {
                          setSubModal(true)
                      }} style={styles.playIcon}>
                          <Icon name={'play-circle'} type={'feather'} color={'#fff'} size={50}/>
                      </Pressable>
                  }
                  <Video
                    style={styles.video}
                    source={{
                        uri: `${Favor.api}/file/${info.hash}`
                    }}
                    controls={true}
                    resizeMode="contain"
                    poster={`${resourceUrl}/${info.thumbnail}`}
                  />
              </View>
          </View>
          <SubscribeModal visible={subModal} setVisible={setSubModal} daoCardInfo={videoData} subSuccess={subSuccess}/>
          <View style={styles.groupParent}>
              <Text style={[styles.name, styles.largeTypo]}>
                  @{isReTransfer ? videoData?.author_dao.name : videoData?.dao.name}
              </Text>
              <Text style={styles.description} numberOfLines={1}>{info.description}</Text>
              <View style={styles.tags}>
                  {
                      Object.keys(videoData.tags).map(item => (
                        item && <Text style={[styles.tag, styles.largeTypo]} key={item}>#{item}</Text>
                      ))
                  }
                  <Text style={[styles.tag, styles.largeTypo]}>
                      See more
                  </Text>
              </View>

          </View>
          <VideoDetailButton postInfo={videoData} vSrc={info.hash!}/>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.iOSSystemLabelsLightPrimary,
        flex: 1,
        // paddingHorizontal: 16,
    },
    wrapper: {
        marginTop: 50,
        marginLeft: 20,
        alignItems: 'flex-start',
    },
    box: {
        flex: 1,
        justifyContent: "center",
    },
    videoBox: {
        position: 'relative',
    },
    playIcon: {
        position: "absolute",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    },
    video: {
        height: 238,
    },
    groupParent: {
        width: '70%',
        bottom: 30,
        left: 16,
        position: "absolute",
    },
    name: {
        lineHeight: 23,
        letterSpacing: 0,
        fontSize: FontSize.bodyBody17_size,
    },
    description: {
        marginTop: 20,
        textAlign: "left",
        fontFamily: FontFamily.paragraphP313,
        fontSize: FontSize.paragraphP313_size,
        color: Color.color1,
        lineHeight: 18,
        fontWeight: "600",
    },
    tags: {
        flexDirection: 'row'
    },
    tag: {
        marginRight: 5,
        color: Color.color1,
        lineHeight: 18,
        fontSize: FontSize.size_mini,
    },

    largeTypo: {
        fontFamily: FontFamily.capsCaps310SemiBold,
        fontWeight: "600",
        textAlign: "left",
        color: Color.color1,
    },
});

export default VideoPlayScreen;
