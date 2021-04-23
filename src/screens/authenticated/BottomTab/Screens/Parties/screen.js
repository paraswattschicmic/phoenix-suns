import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  InteractionManager, Modal, RefreshControl,
  StyleSheet,
  Text,
  View, ScrollView
} from 'react-native';
import PushNotification from "react-native-push-notification";
import Toast from 'react-native-simple-toast';
import SendBird from 'sendbird';
import { CustomButton, ScreenHOC, WatchPartyItem } from '../../../../../components';
import {
  sbConnect,
  sbRegisterPushToken
} from '../../../../../redux/actions/sendbirdActions/user';
import {
  CHAT_SCREEN,
  JOIN_BUTTON_COLOR,
  PARTIES_TAB_COLOR,
  STATUS_BAR_PRIMARY_COLOR,
  TEXT_CONST,
  _scaleText
} from '../../../../../shared';
import { SENDBIRD_CONNECTION_HANDLER } from '../../../../../shared/constants/sendbird';
import messaging from '@react-native-firebase/messaging';
import { CommunityGuidelinesContent } from '../../../../../components/molecules/CommunityGuidelinesContent';
import FontAwsomeIcon from 'react-native-vector-icons/FontAwesome5';
import JoinPasswordModal from '../../../../../components/molecules/JoinPasswordModal';
import { Button } from 'react-native';

const THRESHOLD = 100;

const Parties = ({
  updateProfileRequest,
  userData,
  getWatchPartiesRequest,
  navigation,
  joinChatRoom,
  netConnected,
  authToken,
  watchParties,
  updateSendbirdConnectionStatus,
}) => {
  /**
   * State
   */
  const [refreshing, toggleRefreshing] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [totalCount, updateTotalCount] = useState(0);
  const [currentPlayVideoIndex, setCurrentPlayVideoIndex] = useState(0);
  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(
    false,
  );
  const [countLoadedWatchParties, setCountLoadedWatchParties] = useState(0);
  const [loadedFlagComplete, setLoadedFlagComplete] = useState(true);
  const [sendBirdConnectionStatus, setSendBirdConnectionStatus] = useState(false);
  const [joinRoomIncorrectPassword, setJoinRoomIncorrectPassword] = useState(false);
  const [joinPasswordModalVisibility, setJoinPasswordModalVisibility] = useState(false);
  const [guidelinesmodalVisibility, setGuidelinemodalVisibility] = useState(false);
  const [guidelinesmoreInfoVisibile, setGuidelinesmoreInfoVisibile] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  var refReloadFlag = React.useRef(reloadFlag);
 

  //const socket = socketIO(`${PREFIX_URL}${'/?authToken='}${authToken}`);
  //const socket = io(`${PREFIX_URL}${'/?authToken='}${authToken}`);
  /**
   * Update refChatRooms ( Reffrence of State chatRooms )
   */
  useEffect(() => {
    
    refReloadFlag.current = reloadFlag;
  }, [reloadFlag]);

  /**
   * Get Watch Parties Use Effect
   */
  useEffect(() => {

    /*   // 1: Component is mounted off-screen */
    InteractionManager.runAfterInteractions(() => {
      /*     // 2: Component is done animating */
      /*     // 3: Start fetching watch parties */
      getWatchParties(false, true);
      setDidFinishInitialAnimation(true);
    });
  }, []);

  /**
   * Sendbird Connection Setup & Register Push Notification Token ( "Firebase" & "Firebase Token Registration on Sendbird" )
   */
  useEffect(() => {
    /**
     * Sendbird Connect
     */
    if (userData && userData._id && userData.firstName && !sendBirdConnectionStatus) {
      sbConnect(userData._id, userData.firstName)
        .then(() => {
          //console.log('Yooooo', authToken);
          setSendBirdConnectionStatus(true)
          /**
           * Update Sendbird Connection Status
           */
          updateSendbirdConnectionStatus(true);
          /**
           * "Firebase" & "Firebase Token Registration on Sendbird"
           */
          if (userData.notification) {
            sbRegisterPushToken()
              .then(() => {
                // console.log('registration')
              })
              .catch((err) => {
                // console.log('connect error tokenn ', err)
              });
          }
          /**
           *  Sendbird Connection Handlers
           */
          const sendbirdConnection = SendBird.getInstance();
          var connectionHandler = new sendbirdConnection.ConnectionHandler();

          connectionHandler.onReconnectStarted = () => {
            updateSendbirdConnectionStatus(false);
            setSendBirdConnectionStatus(false)
          };
          connectionHandler.onReconnectSucceeded = function () { };
          connectionHandler.onReconnectFailed = function () { };

          sendbirdConnection.addConnectionHandler(
            SENDBIRD_CONNECTION_HANDLER,
            connectionHandler,
          );
        })
        .catch((err) => {
          /**
           * Update Sendbird Connection Status
           */
          updateSendbirdConnectionStatus(false);
          // Toast.show(TEXT_CONST.SENDBIRD_ERROR, 3);
          console.log('connect error', err);
        });
    }

  }, [userData, sendBirdConnectionStatus]);

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
   * Remove Sendbird Connection Handlers
   */
  useEffect(() => {
    return () => {
      try {
        let sb = new SendBird.getInstance();
        sb.removeConnectionHandler(SENDBIRD_CONNECTION_HANDLER);
      } catch {
        (error) => console.log('remove handler error');
      }
    };
  }, []);

  /**
   * Funtion On Focus
   */
  function onFocus() {
    /**
     * Get Watch Parties
     * --- If user join group then refreshing feed
     */
    if (refReloadFlag.current) {
      getWatchParties(false, true);
    }
  }

  /**
   * Handle Images Loader
   */
  const handlePartiesLoaderLoader = () => {
    let loadedWatchPartiesCount = countLoadedWatchParties;
    loadedWatchPartiesCount = loadedWatchPartiesCount + 1;
    setCountLoadedWatchParties(loadedWatchPartiesCount);

    if (
      loadedWatchPartiesCount == watchParties.length ||
      loadedWatchPartiesCount >= 2
    ) {
      setLoadedFlagComplete(true);
    }
  };

  const openGuideLinesModal = () => {
    setGuidelinemodalVisibility(true)
  }

  const closeGuideLinesModal = () => {
    setGuidelinemodalVisibility(false);
    setGuidelinesmoreInfoVisibile(false)
  }

  /**
   * Get Watch Parties
   * @param {*} refreshing
   */
  const getWatchParties = (refreshing = false, intialLoad = false) => {
    toggleRefreshing(refreshing);
    toggleLoading(!refreshing);
    getWatchPartiesRequest({
      skip: refreshing ? 0 : intialLoad ? 0 : watchParties.length,
      netConnected,
      success: (totalCount) => {
        updateTotalCount(totalCount);
        toggleRefreshing(false);
        toggleLoading(false);
        setReloadFlag(false);
        if (totalCount == 0) {
          setLoadedFlagComplete(true);
        }
      },
      fail: (error) => {
        toggleRefreshing(false);
        toggleLoading(false);
        setReloadFlag(false);
        Toast.show(error, 3);
      },
    });
  };
  /**
   * chatRoomJoinAPI
   * @param {*} item 
   */
  const chatRoomJoinAPI = (item, password = '') => {
    //      setJoinPasswordModalVisibility(true);
    setJoinRoomIncorrectPassword(false)
    setReloadFlag(true);
    let payLoadData = { watchPartyId: item._id }
    if (password) {
      payLoadData.password = password;
    }
    joinChatRoom({
      netConnected,
      body: payLoadData,
      success: (data) => {
        setJoinPasswordModalVisibility(false)
        console.log('datatata', data)
        let isAlreadyjoined = false;
        if (data && data.alreadyJoin) {
          isAlreadyjoined = data.alreadyJoin;
        }
        if (userData.notification) {
          messaging()
            .subscribeToTopic(data.channel_url)
            .then(() => console.log('Subscribed to topic!', data.channel_url));
        }

        navigation.navigate(CHAT_SCREEN, {
          channelUrl: data.channel_url,
          title: data.name,
          memberCount: data.joined_member_count,
          isOpenChannel: false,
          watchPartyId: item._id,
          leagueInfo: item.leagueInfo && item.leagueInfo.name ? item.leagueInfo.name : '',
          defaultGifKeyword: item.defaultGifKeyword,
          inviteText: item.inviteText ? item.inviteText : '',
          shareDialogTitle: item.shareDialogTitle ? item.shareDialogTitle : '',
          shareDialogUrl: item.shareDialogUrl ? item.shareDialogUrl : '',
        });
      },
      fail: (error) => {
        if (error && error == 'Password required' && !joinPasswordModalVisibility) {
          setSelectedItem(item)
          setJoinPasswordModalVisibility(true);
        }
        else if (error && error == 'Invalid password.') {
          setJoinRoomIncorrectPassword(true)
        }
        else {
          console.log(JSON.stringify(error));
          toggleRefreshing(false);
          toggleLoading(false);
          Toast.show(error, 3);
        }
      },
    });

  }
  /**
   * Action Join ChatRoom
   * @param {*} item (Watch Item)
   */
  const actionjoinChatRoom = (item, password = '') => {
    if (password) {
      chatRoomJoinAPI(item, password)
    }
    else if (userData && userData.areGuidelinesChecked) {
      chatRoomJoinAPI(item)
    }
    else {
      openGuideLinesModal();
      setSelectedItem(item)
    }
  };

  const actionGuideLineModalGotIt = () => {
    let payload = {
      areGuidelinesChecked: true
    };
    updateProfileRequest({
      fail: (error) => {
        console.log('errr', error);
        Toast.show(error, 3);
      },
      netConnected,
      payload,
      success: (data) => {
        console.log('succes successsssssssssss')
        chatRoomJoinAPI(selectedItem);
        closeGuideLinesModal();
      },
    })
  }

  const onViewRef = React.useRef((viewabledata) => {
    if (viewabledata.viewableItems && viewabledata.viewableItems.length > 0) {
      setCurrentPlayVideoIndex(viewabledata.viewableItems[0].index);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 65 });

  /**
   * Render
   * 1.) In RefreshControl "() => { watchParties && watchParties.length && watchParties.length > 0 ? getWatchParties(true) : getWatchParties(false)" represents that if the list is empty then show only main loader and if list has data then show refresing loader
   */
  return (
   
    <ScreenHOC>
      <Text style={styles.title}>{TEXT_CONST.WATCH_PARTIES}</Text>
      {(!loadedFlagComplete || !didFinishInitialAnimation) && (
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
            // height: loadedFlagComplete
            //   ? Platform.OS === 'ios'
            //     ? 'auto'
            //     : '100%'
            //   : 0,
            // width: loadedFlagComplete
            //   ? Platform.OS === 'ios'
            //     ? 'auto'
            //     : '100%'
            //   : 0,
          }
        }>
        <FlatList
          data={watchParties}
          keyExtractor={(item) => item._id + ''}
          style={{
            opacity: loadedFlagComplete ? 1 : 0,
            // height: loadedFlagComplete
            //   ? Platform.OS === 'ios'
            //     ? 'auto'
            //     : '100%'
            //   : 0,
            // width: loadedFlagComplete
            //   ? Platform.OS === 'ios'
            //     ? 'auto'
            //     : '100%'
            //   : 0,
          }}
          initialNumToRender={2}
          windowSize={3}
          maxToRenderPerBatch={6}
          //style={{opacity:1}}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                watchParties && watchParties.length && watchParties.length > 0
                  ? getWatchParties(true)
                  : getWatchParties(false);
              }}
              refreshing={refreshing}
              title={TEXT_CONST.PULL_TO_REFRESH}
            />
          }
          contentContainerStyle={{
            marginTop: _scaleText(7).fontSize,
            paddingBottom: _scaleText(37).fontSize,
          }}
          // ListFooterComponent={
          //     loading
          //     &&
          //     <ActivityIndicator size='large' style={{ padding: _scaleText(20).fontSize }} />
          // }
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          onEndReached={() =>
            !loading &&
            !refreshing &&
            totalCount > watchParties.length &&
            getWatchParties()
          }
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !loading && !refreshing ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: _scaleText(200).fontSize,
                }}>
                <Text style={{ fontSize: _scaleText(15).fontSize }}>
                  {TEXT_CONST.OOPS}
                </Text>
                <Text style={{ fontSize: _scaleText(12).fontSize }}>
                  {TEXT_CONST.NO_WATCH_PARTY_TEXT}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignContent: 'center',
                  height: _scaleText(300).fontSize,
                }}>
                <ActivityIndicator
                  style={{ flex: 1, alignSelf: 'center' }}
                  color="gray"
                  size="large"
                />
              </View>
            )
          }
          renderItem={({ item, index }) => (
            <WatchPartyItem
              showPlayVideo={currentPlayVideoIndex === index}
              item={item}
              isInIntialRender={index == 0 || index == 1 ? true : false}
              indexNum={index}
              userData={userData}
              onJoinPress={() => actionjoinChatRoom(item)}
              onLoadComplete={() => {
                if (!loadedFlagComplete) {
                  handlePartiesLoaderLoader();
                }
              }}
            />
          )}
        />
      </View>
      <Modal
        visible={guidelinesmodalVisibility}
        onRequestClose={closeGuideLinesModal}
        transparent
      >
        {/* <TouchableHighlight
          style={styles.modalContainer}
          onPress={closeGuideLinesModal}
        > */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContainerInner}>
            {guidelinesmoreInfoVisibile ?
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <TouchableHighlight
                  onPress={closeGuideLinesModal}
                  style={styles.closeButtonModal}
                >
                  <FontAwsomeIcon
                    name='times'
                    color='gray'
                    size={_scaleText(20).fontSize}
                    style={{ alignSelf: 'flex-end' }}
                  />
                </TouchableHighlight>
                <Text style={styles.modalTitle}>{TEXT_CONST.COMMUNITY_GUIDELINE_TITLE}</Text>
                <CommunityGuidelinesContent></CommunityGuidelinesContent>
                <View style={{ flexDirection: 'row', marginTop: _scaleText(8).fontSize, height: _scaleText(50).fontSize, marginBottom: _scaleText(8).fontSize, }}>
                  <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <CustomButton
                      label={TEXT_CONST.GOT_IT}
                      labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500' }}
                      containerStyle={{ backgroundColor: JOIN_BUTTON_COLOR, height: _scaleText(45).fontSize, width: _scaleText(150).fontSize, borderRadius: _scaleText(10).fontSize }}
                      onPress={() => { actionGuideLineModalGotIt() }}
                    />
                  </View>
                </View>
              </ScrollView>
              :
              <>
                <TouchableHighlight
                  onPress={closeGuideLinesModal}
                  style={styles.closeButtonModal}
                >
                  <FontAwsomeIcon
                    name='times'
                    color='gray'
                    size={_scaleText(20).fontSize}
                    style={{ alignSelf: 'flex-end' }}
                  />
                </TouchableHighlight>
                <Text style={styles.modalTitle}>{TEXT_CONST.FAN_GUIDELINES_TITLE}</Text>
                <Text style={styles.shortguidelinesText}>{TEXT_CONST.SHORT_FLAG_TEXT}</Text>
                <View style={{ flexDirection: 'row', marginTop: _scaleText(8).fontSize, height: _scaleText(50).fontSize, marginBottom: _scaleText(8).fontSize, }}>
                  <View style={{ flex: 1 }}>
                    <CustomButton
                      label={TEXT_CONST.GOT_IT}
                      labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500' }}
                      containerStyle={{ backgroundColor: JOIN_BUTTON_COLOR, height: _scaleText(45).fontSize, width: _scaleText(150).fontSize, borderRadius: _scaleText(10).fontSize }}
                      onPress={() => { actionGuideLineModalGotIt() }}
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <CustomButton
                      label={TEXT_CONST.MORE_INFO}
                      labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500', color: JOIN_BUTTON_COLOR }}
                      containerStyle={{ backgroundColor: 'white', height: _scaleText(45).fontSize, width: _scaleText(150).fontSize, borderRadius: _scaleText(10).fontSize, borderColor: JOIN_BUTTON_COLOR, borderWidth: 0.8 }}
                      onPress={() => { setGuidelinesmoreInfoVisibile(true) }}
                    />
                  </View>
                </View>
              </>}
          </View>
        </View>
      </Modal>
      { joinPasswordModalVisibility && <JoinPasswordModal
        incorrectPassword={joinRoomIncorrectPassword}
        isVisible={joinPasswordModalVisibility}
        onClose={() => { setJoinPasswordModalVisibility(false) }} title={selectedItem && selectedItem.contentName ? selectedItem.contentName : ''} onJoin={(value) => { actionjoinChatRoom(selectedItem, value) }}></JoinPasswordModal>}
      <View
        style={styles.upperContainer}
      />
      <View
        style={styles.lowerContainer}
      />
    </ScreenHOC>
  );
};

export default Parties;

/**
 * Styles
 */
const styles = StyleSheet.create({
  title: {
    paddingHorizontal: _scaleText(10).fontSize,
    paddingVertical: _scaleText(5).fontSize,
    backgroundColor: PARTIES_TAB_COLOR,
    color: STATUS_BAR_PRIMARY_COLOR,
    fontWeight: '800',
    fontSize: _scaleText(18).fontSize,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignContent: 'center',
    alignItems: 'center'
  },
  modalContainerInner: {
    flexDirection: 'column',
    height: 'auto',
    width: '95%',
    backgroundColor: 'white',
    borderRadius: _scaleText(15).fontSize,
    padding: _scaleText(15).fontSize,
    marginVertical: _scaleText(80).fontSize
  },
  shortguidelinesText: {
    fontSize: _scaleText(14).fontSize,
    lineHeight: _scaleText(16).fontSize,
    color: '#444444',
    //fontWeight: 'bold',
    fontFamily: 'SFProText-Regular',
    marginBottom: _scaleText(13).fontSize
  },
  modalTitle: {
    color: JOIN_BUTTON_COLOR,
    fontSize: _scaleText(23).fontSize,
    fontWeight: '400',
    marginBottom: _scaleText(20).fontSize,
  },
  closeButtonModal: {
    width: '100%',
  },
});
