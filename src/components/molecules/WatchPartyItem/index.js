import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Video from "react-native-video";
import { CustomButton } from "../../atoms";
import {
  _scaleText,
  STATUS_BAR_PRIMARY_COLOR,
  LINE_COLOR,
  JOIN_BUTTON_COLOR,
  JOIN_BUTTON_NEW_COLOR,
  TIME_CONTENT_COLOR,
  DEFUALT_PROFILE,
  DEFUALT_PROFILE_FACEBOOK,
  TEXT_CONST,
  SHOW_COVER,
  WATCH_PAGE_VIDEO_LIST,
  WATCH_PAGE_POST_LIST,
  WATCH_PAGE_VIDEO_GIF_LIST,
} from "../../../shared";
import moment from "moment";
import { scaleText } from "react-native-text/lib/commonjs";
import FastImage from "react-native-fast-image";

const DEFAULT_PROFILE_IMAGES = [
  require("../../../assets/images/watchParty/beer_00.png"),
  require("../../../assets/images/watchParty/woman_00.png"),
  require("../../../assets/images/watchParty/man_00.png"),
  require("../../../assets/images/watchParty/basketball_00.png"),
];

const DEFAULT_PROFILE_IMAGES_FOR_NBA = [
  require("../../../assets/images/watchParty/NBA/NBA_GIF_01.gif"),
  require("../../../assets/images/watchParty/NBA/NBA_GIF_02.gif"),
  require("../../../assets/images/watchParty/NBA/NBA_GIF_03.gif"),
  require("../../../assets/images/watchParty/NBA/NBA_GIF_04.gif"),
];

const WatchPartyItem = ({
  item,
  indexNum,
  userData,
  showPlayVideo,
  isInIntialRender,
  onLoadComplete = () => {},
  onJoinPress = () => {},
}) => {
  let {
    contentLength = 0,
    contentName = "",
    contentPicture = "https://collyde.s3.ap-south-1.amazonaws.com/files/upload_1597988274041.11",
    host = "",
    joined = 0,
    leagueInfo: { name: leagueName = "" } = {},
    platformInfo: { name: platformName = "" } = {},
    startTime,
  } = item;

  const [imageIsLoading, setImageLoading] = useState(false);
  const [loadedCountImages, setLoadedCountImages] = useState(0);
  const [loadedFlagComplete, setLoadedFlagComplete] = useState(false);

  var countImages = 0;

  const getJoinedUserImageUrls = () => {
    let arrImageUrls = [];
    DEFAULT_PROFILE_IMAGES.forEach((pictureUrl) => {
      arrImageUrls.push({
        pictureUrl,
        showDefault: true,
      });
    });
    return arrImageUrls;
  };

  const getTimeString = () => {
    /**
     * Backend Time is always UtC
     */
    let userTimeZoneOffset = 0;
    if (userData && userData.timezone && userData.timezone.value) {
      userTimeZoneOffset = userData.timezone.value;
    }

    let strTime = "";
    if (new Date(startTime) <= new Date() && moment(new Date(startTime)).add(contentLength, "minutes") > new Date()) {
      strTime = "NOW";
    } else {
      let dateAsSelectedTimeZone = moment(new Date(startTime))
        .add(userTimeZoneOffset, "minutes")
        .utc()
        .format("h:mm A");
      dateAsSelectedTimeZone = dateAsSelectedTimeZone.split(" ");
      let timeFormat = dateAsSelectedTimeZone[1] == "AM" ? "A" : "P";
      strTime = `${dateAsSelectedTimeZone[0]}${timeFormat[0]}`;
    }
    return strTime;
  };
  const getDateString = () => {
    /**
     * Backend Time is always EST
     */
    let userTimeZoneOffset = 0;
    if (userData && userData.timezone && userData.timezone.value) {
      userTimeZoneOffset = userData.timezone.value;
    }
    let strMonth = "";

    let dateAsSelectedTimeZone = moment(new Date(startTime)).add(userTimeZoneOffset, "minutes").utc().format("ddd");
    strMonth = dateAsSelectedTimeZone;
    return strMonth;
  };
  const getMonthYearString = () => {
    /**
     * Backend Time is always EST
     */
    let userTimeZoneOffset = 0;
    if (userData && userData.timezone && userData.timezone.value) {
      userTimeZoneOffset = userData.timezone.value;
    }
    let strMonth = "";

    let dateAsSelectedTimeZone = moment(new Date(startTime)).add(userTimeZoneOffset, "minutes").utc().format("MMM DD");
    strMonth = dateAsSelectedTimeZone;
    return strMonth;
  };
  /**
   * Handle Images Loader
   */
  const handleImageLoader = () => {
    let loadedImagesCount = loadedCountImages;
    loadedImagesCount = loadedImagesCount + 1;
    setLoadedCountImages(loadedImagesCount);
    if (loadedImagesCount == countImages) {
      setLoadedFlagComplete(true);
      onLoadComplete();
    }
  };

  // let now = new Date(startTime) <= new Date() && moment(new Date(startTime)).add(contentLength, 'minutes') > new Date();
  // let hours = moment(new Date(startTime)).format('hh:mm A').toLocaleUpperCase();
  // hours = hours.split(' ');

  // // /let timeFormat = hours[1];
  // let timeFormat = hours[1] == 'AM' ? 'A' : 'P';
  // hours = hours[0];
  //setCountImages(0)
  countImages = 0;
  return (
    <View style={{ marginBottom: _scaleText(15).fontSize, paddingHorizontal: _scaleText(5).fontSize }}>
      <View>
        <Video
          source={
            item.videoInfo && item.videoInfo.url ? { uri: item.videoInfo.url } : WATCH_PAGE_VIDEO_LIST[indexNum % 4]
          }
          // source={{ uri: WATCH_PAGE_VIDEO_LIST[indexNum % 4] }}
          posterResizeMode={"cover"}
          poster={WATCH_PAGE_POST_LIST[indexNum % 4]}
          style={styles.watchPartyTopVideo}
          muted={true}
          paused={!showPlayVideo}
          repeat={true}
          resizeMode={"cover"}
          rate={1.0}
          ignoreSilentSwitch={"obey"}
        />
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1.37 }}>
          {!!startTime && (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.time}>{getTimeString()}</Text>
              {/* <Text style={styles.time}>{now ? '' : ` ${timeFormat}`}</Text> */}
            </View>
          )}
          {!!startTime && (
            <Text style={[styles.date, { fontFamily: "SFProText-Bold", lineHeight: _scaleText(14).lineHeight }]}>
              {getDateString()}
            </Text>
          )}
          {!!startTime && (
            <Text style={[styles.date, { fontSize: _scaleText(14).fontSize, color: "#818596" }]}>
              {getMonthYearString()}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.lineContainer,
            {
              marginTop: !!joined ? _scaleText(75).fontSize : _scaleText(55).fontSize,
            },
          ]}
        />
        <View style={{ flex: 5 }}>
          <Text style={{ fontFamily: "SFProText-Bold", fontSize: _scaleText(23).fontSize }}>{contentName}</Text>
          <Text
            style={{
              fontFamily: "SFProText-Regular",
              fontSize: _scaleText(17).fontSize,
              lineHeight: _scaleText(14).lineHeight,
            }}
          >
            {leagueName} ON {platformName}
          </Text>
          <Text
            style={{
              fontFamily: "SFProText-Regular",
              color: "#818596",
              fontWeight: "400",
              fontSize: _scaleText(14).fontSize,
            }}
          >
            {joined >= 0 && joined < 4 ? `Join The Party!` : `${joined} Joined`}{" "}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: 10 }}>
            {item.defaultGifs && item.defaultGifs.length > 0
              ? item.defaultGifs.map((item, index) => {
                  countImages = countImages + 1;
                  return (
                    <View key={index} style={styles.profileImgContainer}>
                      <FastImage
                        style={styles.profileImg}
                        source={{ uri: item }}
                        onLoadStart={() => {
                          setImageLoading(true);
                        }}
                        onLoadEnd={() => {
                          setImageLoading(false);
                          if (!loadedFlagComplete && isInIntialRender) {
                            handleImageLoader();
                          }
                        }}
                      >
                        {imageIsLoading && (
                          <View
                            style={{
                              height: "100%",
                              width: "100%",
                              backgroundColor: "gray",
                              borderRadius: 5,
                              opacity: 0.2,
                              justifyContent: "center",
                            }}
                          >
                            <ActivityIndicator size={"small"} color={Platform.OS === "ios" ? "black" : "#66756a"} />
                          </View>
                        )}
                      </FastImage>
                    </View>
                  );
                })
              : getJoinedUserImageUrls().map((item, index) => {
                  countImages = countImages + 1;
                  return (
                    <View key={index} style={styles.profileImgContainer}>
                      <FastImage
                        style={styles.profileImg}
                        // source={item.showDefault ? item.pictureUrl : (item.showDefault == false && item.pictureUrl != '') ? { uri: item.pictureUrl } : DEFUALT_PROFILE}
                        // source={joined >= 0 && joined < 4 ? item.pictureUrl : (item.showDefault == false && item.pictureUrl != '') ? { uri: item.pictureUrl } : DEFUALT_PROFILE}
                        source={
                          item.showDefault
                            ? item.pictureUrl
                            : item.showDefault == false && item.pictureUrl != ""
                            ? { uri: item.pictureUrl }
                            : DEFUALT_PROFILE_FACEBOOK
                        }
                        // source={item.showDefault ? item.pictureUrl : { uri: item.pictureUrl }}
                        // source={item.showDefault ? item.pictureUrl : (item.showDefault == false && item.pictureUrl != '') ? { uri: item.pictureUrl } : DEFUALT_PROFILE}
                        onLoadStart={() => {
                          setImageLoading(true);
                        }}
                        onLoadEnd={() => {
                          setImageLoading(false);
                          if (!loadedFlagComplete && isInIntialRender) {
                            handleImageLoader();
                          }
                        }}
                      >
                        {imageIsLoading && (
                          <View
                            style={{
                              height: "100%",
                              width: "100%",
                              backgroundColor: "gray",
                              borderRadius: 5,
                              opacity: 0.2,
                              justifyContent: "center",
                            }}
                          >
                            <ActivityIndicator size={"small"} color={Platform.OS === "ios" ? "black" : "#66756a"} />
                          </View>
                        )}
                      </FastImage>
                    </View>
                  );
                })}
            {/* return <ImageItem isUser={this.props.isUser} message={message.tempUri ? message.tempUri.replace('http://', 'https://') : message.url.replace('http://', 'https://')} />; */}

            {/* {IMAGES.map((src, index) => {
                            if (index < joined) {
                                return <View key={src} style={styles.profileImgContainer}>
                                    <Image source={src} style={styles.profileImg} />
                                </View>
                            }
                        })} */}
          </View>
          <View style={{ flexDirection: "row", marginTop: _scaleText(8).fontSize }}>
            <View style={{ width: "100%" }}>
              <CustomButton
                label={TEXT_CONST.JOIN}
                labelStyle={{ fontSize: _scaleText(22).fontSize, fontWeight: "500" }}
                containerStyle={{ backgroundColor: JOIN_BUTTON_NEW_COLOR, height: _scaleText(45).fontSize, flex: 1 }}
                onPress={onJoinPress}
              />
            </View>
            {/* <View style={{ width: _scaleText(120).fontSize }}>
                            <CustomButton
                                label={TEXT_CONST.MAY_BE}
                                labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '400' }}
                                containerStyle={{ backgroundColor: STATUS_BAR_PRIMARY_COLOR, height: _scaleText(45).fontSize, width: _scaleText(115).fontSize }}
                                onPress={() => { }}
                            />
                        </View> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default WatchPartyItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: _scaleText(10).fontSize,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: _scaleText(10).fontSize,
    marginTop: _scaleText(3).fontSize,
  },
  watchPartyTopVideo: {
    flex: 1,
    height: _scaleText(188).fontSize,
    width: "95%",
    alignSelf: "center",
    marginHorizontal: _scaleText(10).fontSize,
  },
  time: {
    fontFamily: "SFProText-Bold",
    color: TIME_CONTENT_COLOR,
    fontSize: _scaleText(19).fontSize,
  },
  timeFormat: {
    fontFamily: "SFProText-Bold",
    color: TIME_CONTENT_COLOR,
    fontSize: _scaleText(10).fontSize,
    marginTop: _scaleText(10).fontSize,
  },
  profileImgContainer: {
    height: _scaleText(60).fontSize,
    width: _scaleText(60).fontSize,
    borderRadius: _scaleText(30).fontSize,
    overflow: "hidden",
  },
  profileImg: {
    height: "100%",
    width: "100%",
  },
  lineContainer: {
    height: "70%",
    width: 1,
    alignSelf: "center",
    backgroundColor: "#e3e5e8",
    marginHorizontal: _scaleText(10).fontSize,
  },
  date: {
    color: LINE_COLOR,
    fontSize: _scaleText(17).fontSize,
    fontFamily: "SFProText-Regular",
  },
});
