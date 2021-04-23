import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SendBird from 'sendbird';
import { CustomButton, RoomListItem, ScreenHOC } from '../../../../../components';
import {
  BOTTOM_TABS,
  CHAT_SCREEN,
  JOIN_BUTTON_COLOR,
  TEXT_CONST,
} from '../../../../../shared';
import { SENDBIRD_CHANNEL_CHANGE_HANDLER } from '../../../../../shared/constants/sendbird';
import { _scaleText } from '../../../../../shared/services/utility';

const Rooms = ({
  /**
   * Props
   */
  chatRooms,
  cameOnChatScreenFlag,
  lastChatOpened,
  navigation,
  netConnected,
  nextPageToken,
  getUserRoomList,
  updateChannel,
  userData,
}) => {
  /**
   * State
   */
  const [refreshing, toggleRefreshing] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [totalCount, updateTotalCount] = useState(0);
  const [isRenderReady, setRenderReady] = useState(true);
  const [arrImageLoadSuccess, setArrImageLoadSuccess] = useState([]);
  var refCameOnChatScreenFlag = React.useRef(cameOnChatScreenFlag);
  var refLastChatOpened = React.useRef(lastChatOpened);
  var refChatRooms = React.useRef(chatRooms);

  /**
   * Update refCameOnChatScreenFlag ( Reffrence of State cameOnChatScreenFlag )
   */
  useEffect(() => {
    refCameOnChatScreenFlag.current = cameOnChatScreenFlag;
  }, [cameOnChatScreenFlag]);

  /**
   * Update refLastChatOpened ( Reffrence of State lastChatOpened )
   */
  useEffect(() => {
    refLastChatOpened.current = lastChatOpened;
  }, [lastChatOpened]);

  /**
   * Update refChatRooms ( Reffrence of State chatRooms )
   */
  useEffect(() => {
    refChatRooms.current = chatRooms;
  }, [chatRooms]);

  /**
   * Use Effect
   * 1) Get Chat Rooms Call
   * 2) Channel Change Handler ( To Update Unread Message Count )
   */
  useEffect(() => {
    /**
     * Get Chat Rooms Call
     */
    getChatRooms(false);
    /**
     * Attaching ChannelChangeHandler for updating unread message count
     */
    const sb = SendBird.getInstance();
    if (sb) {
      //TODO:Move Event Handlers to a diffrent file....Place of below code is not correct
      //and place of unmounting this lisher yet to decide....and all lishners including in chat screen should be there in one handler file

      var ChannelHandler = new sb.ChannelHandler();
      ChannelHandler.onChannelChanged = function (channel) {
        if (channel) {
          updateChannel(channel);
        }
      };

      sb.addChannelHandler(SENDBIRD_CHANNEL_CHANGE_HANDLER, ChannelHandler);
    }
  }, []);

  /**
   * On Focus Use Effect with help of Navigation
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onFocus();
    });
    return unsubscribe;
  }, [navigation]);
  /**
   * Funtion On Focus
   */
  function onFocus() {
    /**
     * Get Chat Rooms
     * --- If user go directly on chat screen and that chat group doesn't exist in rooms screen
     */
    /**
     * TODO: Change logic because now last message didn't exist in object so it might be possible that api is being called everytime user focus on screen now
     */
    if (refCameOnChatScreenFlag.current) {
      let bChatExistInList = false;
      refChatRooms.current.map((room) => {
        if (
          room &&
          room.channel_url &&
          room.channel_url == (refLastChatOpened.current &&
            refLastChatOpened.current.url &&
            refLastChatOpened.current.url)
        ) {
          bChatExistInList = true;
        }
      });
      if (!bChatExistInList) {
        getChatRooms(true);
      }
    }
  }

  /**
   * Funtion Get Chat Rooms
   * @param {*} refreshing
   */
  const getChatRooms = (refreshing = false) => {
    toggleRefreshing(refreshing);
    toggleLoading(!refreshing);
    getUserRoomList({
      netConnected,
      nextPageToken: refreshing ? '' : nextPageToken,
      success: (totalCount) => {
        updateTotalCount(totalCount);
        toggleRefreshing(false);
        toggleLoading(false);
        if (totalCount == 0) {
          setRenderReady(true);
        }
      },
      fail: (error) => {
        toggleRefreshing(false);
        toggleLoading(false);
        // Toast.show(error, 3);
      },
    });
  };

  const handleLoader = (channelUrl) => {
    if (channelUrl) {
      let arrImageLoaded = arrImageLoadSuccess;
      arrImageLoaded.push(channelUrl);
      setArrImageLoadSuccess(arrImageLoaded);
      if (
        arrImageLoaded &&
        arrImageLoaded.length &&
        (arrImageLoaded.length >= 4 ||
          arrImageLoaded.length == chatRooms.length)
      ) {
        setRenderReady(true);
      }
    }
  };
  /**
   * Render
   */
  // console.log('yooooo',JSON.stringify(chatRooms))

  return (
    <ScreenHOC>
      <View style={styles.container}>
        <Text style={[styles.title, styles.roomText]}>Rooms Joined</Text>
      </View>
      {!isRenderReady && (
        <View
          style={{
            flex: 1,
            height: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            style={{ flex: 1, alignSelf: 'center', position: 'absolute' }}
            size="large"
            color="gray"
            animating={true}></ActivityIndicator>
        </View>
      )}
      <View
        style={
          {
            // height: isRenderReady ? 'auto' : 0,
            // width: isRenderReady ? 'auto' : 0,
          }
        }>
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.channel_url}
          style={{ opacity: isRenderReady ? 1 : 0 }}
          initialNumToRender={4}
          windowSize={3}
          maxToRenderPerBatch={10}
          // contentContainerStyle={!DATA.length && { flex: 1 }}
          onEndReached={() => {
            !loading && !refreshing && nextPageToken && getChatRooms()
          }
          }
          onEndReachedThreshold={0.5}
          maxToRenderPerBatch={5}
          contentContainerStyle={{
            //   marginTop: _scaleText(7).fontSize,
            paddingBottom: _scaleText(37).fontSize,
          }}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                getChatRooms(true);
              }}
              refreshing={false}
              title={TEXT_CONST.PULL_TO_REFRESH}
            />
          }
          ListEmptyComponent={
            true && true ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>{TEXT_CONST.NO_ROOM_JOINED}</Text>
                <CustomButton
                  label={TEXT_CONST.EXPLORE_PARTIES}
                  onPress={() => navigation.navigate(BOTTOM_TABS.PARTIES)}
                  containerStyle={{
                    width: '50%',
                    height: _scaleText(40).fontSize,
                    marginTop: _scaleText(20).fontSize,
                  }}
                />
              </View>
            ) : (
                <View
                  style={{
                    flex: 1,
                    alignContent: 'center',
                    height: _scaleText(500).fontSize,
                  }}></View>
              )
          }
          renderItem={({ item, index }) => {
            // console.log('JSON.stringify(item)', item)
            return (
              <TouchableOpacity
                key={item && item.last_message && item.last_message.channel_url}
                onPress={() => {
                  navigation.navigate(CHAT_SCREEN, {
                    channelUrl: item.channel_url,
                    title: item.name,
                    memberCount: item.joined_member_count,
                    isOpenChannel: false,
                    leagueInfo: item.leagueInfo && item.leagueInfo.name ? item.leagueInfo.name : "",
                    inviteText: item.inviteText ? item.inviteText : '',
                    shareDialogTitle: item.shareDialogTitle ? item.shareDialogTitle : '',
                    shareDialogUrl: item.shareDialogUrl ? item.shareDialogUrl : '',
                  });
                }}>
                <RoomListItem
                  item={item}
                  isInIntialRender={index <= 3 ? true : false}
                  onImageLoadFinished={(channelUrl) => {
                    if (!isRenderReady) {
                      handleLoader(channelUrl);
                    }
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScreenHOC>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  title: {
    paddingHorizontal: _scaleText(10).fontSize,
    paddingTop: _scaleText(8).fontSize,
    fontWeight: 'bold',
  },
  roomText: {
    textAlign: 'center',
    textAlignVertical: 'bottom',
    color: JOIN_BUTTON_COLOR,
    paddingHorizontal: _scaleText(10).fontSize,
    fontWeight: '800',
    fontFamily: 'SFProText-Bold',
    fontSize: _scaleText(21).fontSize,
  },
  container: {
    borderBottomWidth: 1,
    borderColor: '#f0f0f2',
  },
});

export default Rooms;
