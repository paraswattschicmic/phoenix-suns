/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Clipboard,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Share,
  TouchableHighlight,
  Image,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import SendBird from 'sendbird';
import ChatList from '../../../components/molecules/ChatList';
import ChatSender from '../../../components/molecules/ChatSender';
import {
  sbConnect,
  sbCreatePreviousMessageListQuery,
  sbGetGroupChannel,
  sbGetOpenChannel,
  sbMarkAsRead,
} from '../../../redux/actions/sendbirdActions';
import {
  BOTTOM_TABS,
  JOIN_BUTTON_COLOR,
  PARTIES_TAB_COLOR,
} from '../../../shared';
import {
  STATUS_BAR_PRIMARY_COLOR,
  COLLYDE_GRAY_BACKGROUND_COLOR,
  COLLYDE_LIGHT_GRAY_COLOR,
  COLLYDE_PRIMARY_BLUE_COLOR,
  TEXT_CONST,
} from '../../../shared/constants';
import {
  JPEG_FILE_EXTENSION,
  SENDBIRD_CHANNEL_CHANGE_HANDLER_CHAT_SCREEN,
} from '../../../shared/constants/sendbird';
import { GET_FCM_TOKEN, _scaleText } from '../../../shared/services/utility';
import {
  setSpText,
  scaleSizeW,
  scaleSizeH,
} from '../../../shared/services/screenStyle';
import { SocketManager } from '../../../shared/services/socketManager';
import GifSender from '../../../components/molecules/GifSender';
import {
  CONFIG_API_ROOT_KEY_GIPHY as CONFIG_API_ROOT_URL_GIPHY,
  CONFIG_APP_KEY_GIPHY,
} from '../../../shared/constants/giphy';
import { scaleText } from 'react-native-text/lib/commonjs';
import TriviaSender from '../../../components/molecules/TriviaSender';
import ChatIBar from '../../../components/molecules/ChatIBar';

const DATA = [];
const leagueInfo = '';

const Chat = ({
  /**
   * Props
   */
  route,
  navigation,
  netConnected,
  updateSendbirdConnectionStatus,
  sendbirdConenctionStatus,
  chatList,
  userData,
  messageRecieved,
  updateReactions,
  saveOnSendSuccess,
  saveOnSendFailure,
  emptyChatList,
  getChatListSuccess,
  updateFlagCameOnChat,
  requestBanUser,
  requestFlagMessage,
}) => {
  /**
   * State
   */
  const SOCKET_EVENTS = {
    JOIN_EVENT: 'joinEvent',
    SEND_ANNOUNCEMENTS: 'sendAnnouncements',
    LIVE_OPERATION_EVENT: 'liveOperatorEvent',
    LIVE_DATA_EVENT: 'liveDataEvent',
    BAN_EVENT: 'banEvent',
    SEND_QUESTIONS: 'sendQuestions',
    GET_QUESTIONS: 'getQuestions',
    FIRE_QUESTION: 'fireQuestion',
    GET_ANNOUNCEMENTS: 'announcements',
    LIVE_ANNOUNCEMENTS: 'liveAnnouncements',
    CONNECT: 'connect',
    LEAVE_EVENT: 'leaveEvent',
  }

  const [messageSelectedWidget, setMessageSelectedWidget] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [scrollTOBottom, setScrollToBottom] = useState(false);
  const [stateMemberCount, changeMemberCount] = useState(
    route.params.memberCount,
  );
  const [stateTitle, changeTitle] = useState(route.params.title);
  const [memberCountLoader, setLoaderMemberCount] = useState(true);
  const [textMessage, setTextMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState(route.params);
  const [channelUrl, setChannelUrl] = useState('');
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);
  const [isUserHost, setIsUserHost] = useState(false);
  const [isUserBanned, setIsUserBanned] = useState(false);
  const [previousMessageQuery, setPreviousMessageQuery] = useState(null);
  const [cachedFileItems, setCachedFileItems] = useState({});
  const [cachedUserProfiles, setCachedUserProfiles] = useState({});
  const [cachedHostBadge, setCachedHostBadge] = useState({});
  const [strScoreLive, setStrScoreLive] = useState('');
  const [gifs, setGifs] = useState([]);
  const [isGifEnable, setIsGifEnable] = useState(false);
  const [iBarAnnoucements, setIBarAnnoucements] = useState([]);
  const [iBarCurrentAnnoucement, setIBarCurrentAnnoucement] = useState([]);
  const [iBarQuestions, setIBarQuestions] = useState([]);
  const [hostTriviaQuestions, setHostTriviaQuestions] = useState([]);
  const [isHostTriviaEnable, setIsHostTriviaEnabled] = useState(false);
  const [selectedTriviaQuestion, setSelectedTriviaQuestion] = useState('');
  const [term, updateTerm] = useState(
    route.params.defaultGifKeyword
      ? route.params.defaultGifKeyword
      : route.params.leagueInfo
        ? route.params.leagueInfo
        : 'NBA',
  );
  const [gifLoadStartPosition, updateGifLoadStartPosition] = useState(0);

  const [scoreObj, setScoreObj] = useState({
    // contentName: “Heat at Lakers”,
    awayTeamScore: null, // 0,
    awayTeam: '', // LAL
    HomeTeam: '', //
    homeTeamScore: null, // 0,
    quarter: 'N.A',
    timeRemainingMinutes: 0,
    timeRemainingSeconds: 0,
    // joined: 50,
  });
  const [flatListForceUpdateToggle, setFlatListForceUpdateToggle] = useState(
    false,
  );
  const [scoreTitleHeightLeft, setScoreTitleHeightLeft] = useState(30);
  const [scoreTitleHeightRight, setScoreTitleHeightRight] = useState(30);
  const [menuVisible, setMenuVisible] = useState(false);
  var refCachedUserProfiles = React.useRef(cachedUserProfiles);
  var refCachedHostBadge = React.useRef(cachedHostBadge);
  var refFlatListForceUpdateToggle = React.useRef(flatListForceUpdateToggle);
  _menu = null;

  /**
   * Screen Const
   */
  const emojiKey = 'Like';
  const HARDWARE_BACKPRESS = 'hardwareBackPress';
  /**
   * Update refCachedUserProfiles ( Reffrence of State cameOnChatScreenFlag )
   */
  useEffect(() => {
    refCachedUserProfiles.current = cachedUserProfiles;
  }, [cachedUserProfiles]);
  /**
   * Update
   */
  useEffect(() => {
    refCachedHostBadge.current = cachedHostBadge;
  }, [cachedHostBadge]);
  /**
   * Update refFlatListForceUpdateToggle ( Reffrence of State cameOnChatScreenFlag )
   */
  useEffect(() => {
    refFlatListForceUpdateToggle.current = flatListForceUpdateToggle;
  }, [flatListForceUpdateToggle]);
  /**
   * UseEffect
   * 1.) Update Flag that user came on this chat. ( On the basic of this we are deciding that we need to load the chat screen or not )
   * 2.) Create Channel Handler Function Call
   */
  useEffect(() => {
    /**
     * Update Flag that user came on the chat screen
     */
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(
      route.params.channelUrl,
      (groupChannel, error) => {
        if (error) {
          return;
        }
        setIsUserHost(
          groupChannel.myRole &&
            groupChannel.myRole === TEXT_CONST.IS_GROUP_HOST
            ? true
            : false,
        );
        setChannelUrl(groupChannel.url);
        updateFlagCameOnChat(groupChannel);
        // console.log('===p[-=p-', JSON.stringify(groupChannel))
        if (route.params.watchPartyId && route.params.watchPartyId != '') {
          SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.JOIN_EVENT, {
            watchPartyId: route.params.watchPartyId,
          });
          SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.SEND_ANNOUNCEMENTS, {
            watchPartyId: route.params.watchPartyId,
          });
          groupChannel.myRole
            &&
            groupChannel.myRole === TEXT_CONST.IS_GROUP_HOST
            &&
            SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.SEND_QUESTIONS, {
              watchPartyId: route.params.watchPartyId,
            });
        } else {
          SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.JOIN_EVENT, {
            channelUrl: groupChannel.url,
          });
          SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.SEND_ANNOUNCEMENTS, {
            channelUrl: groupChannel.url,
          });
          groupChannel.myRole
            &&
            groupChannel.myRole === TEXT_CONST.IS_GROUP_HOST
            &&
            SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.SEND_QUESTIONS, {
              channelUrl: groupChannel.url,
            });
        }
        SocketManager.sharedManager.onJoinEvent(SOCKET_EVENTS.JOIN_EVENT, (val) => {
          if (val.data && (val.data.awayTeamScore || val.data.homeTeamScore)) {
            setFucStrScore(val);
          }
        });

        SocketManager.sharedManager.onJoinEvent(SOCKET_EVENTS.LIVE_OPERATION_EVENT, (val) => {
          if (val && val.channelUrl && val.channelUrl == groupChannel.url) {
            if (val.status == 1) {
            //  console.log('came1');
              setIsUserHost(true);
              getMessageList(true, 'hotReload');
            } else if (val.status == 0) {
              //console.log('came2');
              setIsUserHost(false);
              getMessageList(true, 'hotReload');
            }
          }
        });
        SocketManager.sharedManager.onJoinEvent(SOCKET_EVENTS.BAN_EVENT, (val) => {
          if (val && val.channelUrl && val.channelUrl == groupChannel.url) {
            getMessageList(true, 'hotReload');
            setIsUserBanned(true);
          }
        });
        SocketManager.sharedManager.onListenEvent(SOCKET_EVENTS.LIVE_DATA_EVENT, (val) => {
          if (val.data && (val.data.awayTeamScore || val.data.homeTeamScore)) {
            setFucStrScore(val);
          }
        });
        SocketManager.sharedManager.onListenEvent(SOCKET_EVENTS.GET_QUESTIONS, (val) => {
          if (val && val.questions && val.questions.length && val.questions.length > 0) {
            //console.log('GET_QUESTIONSGET_QUESTIONS',JSON.stringify(val.questions))
            setHostTriviaQuestions(val.questions)
          }
        });
        SocketManager.sharedManager.onListenEvent(SOCKET_EVENTS.GET_ANNOUNCEMENTS, (val) => {
          //console.log('GET_ANNOUNCEMENTS',JSON.stringify(val))
          if (val && val.data) {
            setIBarAnnoucements(val.data.announcements)
          }
          if (val && val.data) {
            setIBarQuestions(val.data.questions)
          }
        });
        SocketManager.sharedManager.onListenEvent(SOCKET_EVENTS.LIVE_ANNOUNCEMENTS, (val) => {
          //console.log('LIVE_ANNOUNCEMENTSLIVE_ANNOUNCEMENTS',JSON.stringify(val))
          if (val && val.data) {
            setIBarCurrentAnnoucement(val.data.announcements)
          }
        });
        SocketManager.sharedManager.onConnect((val) => {
         // console.log('Reconnect Chat');
          if (route.params.watchPartyId && route.params.watchPartyId != '') {
            SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.JOIN_EVENT, {
              watchPartyId: route.params.watchPartyId,
            });
          } else {
            SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.JOIN_EVENT, {
              channelUrl: groupChannel.url,
            });
          }
          // SocketManager.sharedManager.onJoinEvent('joinEvent', (val) => {
          //     setFucStrScore(val);
          // });
          // SocketManager.sharedManager.onLiveDataEvent('liveDataEvent', (val) => {
          //     setFucStrScore(val);
          // });
        });
      },
    );


    /**
     * Create Channel Handler Call
     */
    createChannelHandler();
    /**
     * Get Message List Call
     */
    getMessageList(true);
    fetchGifs();
    return () => {
      /**
       * Empty Chat List
       */
      emptyChatList();
      /**
       * Set Previous Message Query null on unmount
       */
      setPreviousMessageQuery(null);
      /**
       * Remove Message Handler
       */
      try {
        let sb = new SendBird.getInstance();
        sb.removeChannelHandler(route.params.channelUrl);
      } catch {
        (error) => console.log('remove handler error');
      }
    };
  }, []);

  /**
   * Use Effect
   * 1.) State Set ( setChannel )
   * 2.) addEventListener handleBackButtonClick
   */
  useEffect(() => {
    setChannel(route.params.channelUrl);
    BackHandler.addEventListener(HARDWARE_BACKPRESS, handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        HARDWARE_BACKPRESS,
        handleBackButtonClick,
      );
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.JOIN_EVENT);
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.LIVE_DATA_EVENT);
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.LIVE_OPERATION_EVENT);
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.BAN_EVENT);
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.CONNECT);
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.GET_ANNOUNCEMENTS);
      SocketManager.sharedManager.dissconnectEvent(SOCKET_EVENTS.GET_QUESTIONS);
      if (route.params.watchPartyId && route.params.watchPartyId != '') {
        SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.LEAVE_EVENT, {
          watchPartyId: route.params.watchPartyId,
        });
      } else {
        const sb = SendBird.getInstance();

        sb.GroupChannel.getChannel(
          route.params.channelUrl,
          (groupChannel, error) => {
            if (error) {
              return;
            }
            SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.LEAVE_EVENT, {
              channelUrl: groupChannel.url,
            });
          },
        );
      }
    };
  }, []);

  /**
   * UseEffect ( Reconnect Sendbird function call )
   * Dependency: [netConnected, sendbirdConenctionStatus]
   */
  useEffect(() => {
    if (netConnected && !sendbirdConenctionStatus) {
      setTimeout(() => {
        funReconnectionSendbird(sendbirdConenctionStatus);
      }, 1000);
    }
  }, [netConnected, sendbirdConenctionStatus]);

  /**
   * UseEffect
   * TODO: NEED TO RECHECK BECAUSE I DON'T THINK IT IS MAKING ANY RELEVENCE HERE
   */
  useEffect(() => {
    init();
    GET_FCM_TOKEN();

    return () => {
      getChatListSuccess([]);
    };
  }, []);

  /**
   * UseEffect ( Setting Member count on mounting )
   * Dependency: No Dependency
   * State Changes ( setLoaderMemberCount,changeMemberCount )
   */
  useEffect(() => {
    setLoaderMemberCount(true);
    const channelUrl = route.params.channelUrl;
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        return;
      } else {
        changeMemberCount(channel.joinedMemberCount);
        setLoaderMemberCount(false);
      }
    });
  }, []);

  /**
   * Function Handle Back Button
   */
  const handleBackButtonClick = () => {
    navigation.navigate(BOTTOM_TABS.ROOMS);
    return true;
  };

  /**
   * Init TODO: RECHECK IT IS NOT MAKING ANY REFRENCE HERE BUT STILL WE NEED TO RECHECK BEFORE REMOVING BELOW CODE
   */
  const init = () => {
    const channelUrl = route.params.channelUrl;
    const isOpenChannel = route.params.isOpenChannel;
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl).then((channel) => {
        setChannel({ channel });
        componentInit();
      });
    } else {
      sbGetGroupChannel(channelUrl).then((channel) => {
        setChannel({ channel });
        componentInit();
      });
    }
  };

  const componentInit = () => {
    const isOpenChannel = route.params.isOpenChannel;
    const channelUrl = route.params.channelUrl;
  };
  /**
   * fetch Gifs
   * TODO: Code Optimization Pending
   */
  async function fetchGifs(init = false, newTerm = '') {
    try {
      console.log(
        '===========-=-=-=-=-=-=-=-=-=-================-=--=-==-==========',
        newTerm,
      );
      const API_KEY = CONFIG_APP_KEY_GIPHY;
      const BASE_URL = CONFIG_API_ROOT_URL_GIPHY;
      const resJson = await fetch(
        `${BASE_URL}?api_key=${API_KEY}&q=${newTerm && newTerm != '' ? newTerm : term
        }&limit=15&offset=${gifLoadStartPosition}`,
      );
      const res = await resJson.json();
      // console.log("res", res)
      if (init) {
        setGifs(res.data);
      } else {
        setGifs([...gifs, ...res.data]);
      }
      updateGifLoadStartPosition((previousCount) => previousCount + 10);
    } catch (error) {
      console.warn(error);
    }
  }
  /**
   * onEdit Gifs
   * TODO: Code Optimization Pending
   */
  function onEdit(newTerm) {
    if (newTerm == '') {
      let defaultTerm = route.params.defaultGifKeyword
        ? route.params.defaultGifKeyword
        : route.params.leagueInfo
          ? route.params.leagueInfo
          : 'NBA';
      updateTerm(defaultTerm);
      fetchGifs(true, defaultTerm);
    } else {
      updateTerm(newTerm);
      fetchGifs(true, newTerm);
    }
  }

  /**
   * setFucStrScore
   */
  const setFucStrScore = (val) => {
    setStrScoreLive(
      `${val.data.awayTeam ? val.data.awayTeam.toUpperCase() : 'AWAYTEAM'} ${val.data.awayTeamScore ? val.data.awayTeamScore : 0
      } at ${val.data.HomeTeam ? val.data.HomeTeam.toUpperCase() : 'HOMETEAM'
      } ${val.data.homeTeamScore ? val.data.homeTeamScore : 0}\n${val.data.quarter ? val.data.quarter : 'N.A'
      } ${val.data.timeRemainingMinutes && val.data.timeRemainingSeconds
        ? val.data.timeRemainingMinutes + ':' + val.data.timeRemainingSeconds
        : ''
      }|`,
    );
    setScoreObj({
      // contentName: “Heat at Lakers”,
      awayTeamScore: val.data.awayTeamScore ? val.data.awayTeamScore : 0,
      awayTeam: val.data.awayTeam ? val.data.awayTeam.toUpperCase() : 'N.A',
      HomeTeam: val.data.HomeTeam ? val.data.HomeTeam.toUpperCase() : 'N.A',
      homeTeamScore: val.data.homeTeamScore ? val.data.homeTeamScore : 0,
      quarter: val.data.quarter ? val.data.quarter : 'N.A',
      timeRemainingMinutes: val.data.timeRemainingMinutes
        ? val.data.timeRemainingMinutes >= 10
          ? val.data.timeRemainingMinutes
          : `0${val.data.timeRemainingMinutes}`
        : `00`,
      timeRemainingSeconds: val.data.timeRemainingSeconds
        ? val.data.timeRemainingSeconds >= 10
          ? val.data.timeRemainingSeconds
          : `0${val.data.timeRemainingSeconds}`
        : `00`,
      // joined: 50,
    });
  };

  /**
   * Function Channel Handler
   * 1.) Channel Handler
   * - onMessageReceived ( on Lishner Actions- messageRecieved, sbMarkAsRead )
   * - onReactionUpdated ( on Lishner Actions- funUpdateReactions )
   * - onChannelChanged ( on Lishner Actions- changeMemberCount, changeTitle )
   * - onUserJoined ( Not in use Right Now )
   * 2.)
   */
  const createChannelHandler = () => {
    /**
     * Channel Handlers
     */
    const sb = SendBird.getInstance();
    let channelHandler = new sb.ChannelHandler();
    const channelUrl = route.params.channelUrl;
    channelHandler.onMessageReceived = (channel, message) => {
      if (channel.url === channelUrl) {
        if (channel.isGroupChannel()) {
          sbMarkAsRead({ channel });
        }

        if (
          message &&
          message._sender &&
          message._sender.userId &&
          message._sender &&
          message._sender.plainProfileUrl &&
          message._sender.nickname
        ) {
          let senderRole = message._sender.role
            ? `${message._sender.role}`
            : '';
          if (
            (refCachedUserProfiles.current &&
              refCachedUserProfiles.current[message._sender.userId] &&
              refCachedUserProfiles.current[message._sender.userId] !=
              `${message._sender.plainProfileUrl}${message._sender.nickname}`) ||
            (refCachedHostBadge.current &&
              refCachedHostBadge.current[message._sender.userId] &&
              refCachedHostBadge.current[message._sender.userId] != senderRole)
          ) {
            console.log('cm');
            getMessageList(true, 'hotReload');
          } else {
            messageRecieved(message);
          }

          let cachedUserProfileList = refCachedUserProfiles.current;
          cachedUserProfileList[
            message._sender.userId
          ] = `${message._sender.plainProfileUrl}${message._sender.nickname}`;
          setCachedUserProfiles(cachedUserProfileList);

          let cachedUserBadge = refCachedHostBadge.current;
          cachedUserBadge[message._sender.userId] = message._sender.role
            ? `${message._sender.role}`
            : '';
          setCachedHostBadge(cachedUserBadge);
        }
      }
    };
    channelHandler.onReactionUpdated = (channel, reactionEvent) => {
      if (channel.url === channelUrl) {
        funUpdateReactions(reactionEvent);
      }
    };
    channelHandler.onChannelChanged = function (channel) {
      if (channel.url === channelUrl) {
        changeMemberCount(channel.joinedMemberCount);
        changeTitle(channel.name);
        setLoaderMemberCount(false);
        //updateChannel(channel);
      }
    };
    channelHandler.onMessageDeleted = function (channel) {
      if (channel.url === channelUrl) {
        getMessageList(true, 'hotReload');
      }
    };
    sb.addChannelHandler(
      SENDBIRD_CHANNEL_CHANGE_HANDLER_CHAT_SCREEN,
      channelHandler,
    );

    // channelHandler.onUserJoined = function (channel) {
    //     if (channel.url === channelUrl) {
    //         //  funChangeMemberCount()
    //     }
    // };
  };

  /**
   * Function Update Reaction in store
   * @param {*} reactionEvent
   */
  const funUpdateReactions = (reactionEvent) => {
    updateReactions(reactionEvent);
  };

  /**
   * Function Reconnect Sendbird
   * @param {*} conenctionStatus
   */
  const funReconnectionSendbird = (conenctionStatus) => {
    if (conenctionStatus) {
      //TOdo:
    } else {
      if ((userData && userData._id, userData.firstName)) {
        sbConnect(userData._id, userData.firstName)
          .then(() => {
            updateSendbirdConnectionStatus(true);
            if (!photoPickerVisible) {
              getMessageList(true);
            }

            //Success
          })
          .catch((err) => {
            updateSendbirdConnectionStatus(false);
            console.log('connect error', err);
          });
      }
    }
  };

  /**
   * Function Get Message List
   * Dependency: chatList.length
   * --useCallback is used so that ReactMemo in its child component could work perfectly
   * 1.) Get Chat Messages
   * 2.) State Changes (setPreviousMessageQuery, setIsLoading)
   * 3.) Dispatch (getChatListSuccess)
   * 4.) markAsRead
   */
  const getMessageList = useCallback(
    (init, tempMessage = null) => {
      return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        const channelUrl = route.params.channelUrl;
        /**
         * For First Init Call
         */
        if (init) {
          sbCreatePreviousMessageListQuery(channelUrl, false)
            .then((previousMessageListQuery) => {
              previousMessageListQuery.limit = 20;
              previousMessageListQuery.reverse = true; // Retrieve a list of messages along with their metaarrays.
              previousMessageListQuery.includeReactions = true;
              previousMessageListQuery.load(function (messages, error) {
                if (error) {
                  reject(false);
                  return;
                }
                setPreviousMessageQuery(previousMessageListQuery);
                setIsLoading(false);

                if (tempMessage && tempMessage !== 'hotReload') {
                  getChatListSuccess([tempMessage, ...messages], false, true);
                } else {
                  getChatListSuccess(messages, false, true);
                  if (tempMessage && tempMessage == 'hotReload') {
                    setFlatListForceUpdateToggle(
                      !refFlatListForceUpdateToggle.current,
                    );
                  } else if (
                    refCachedUserProfiles &&
                    refCachedUserProfiles.current &&
                    !(Object.keys(refCachedUserProfiles.current).length > 0)
                  ) {
                    let cachedUserProfileList = refCachedUserProfiles.current;
                    let cachedHostBadge = refCachedHostBadge.current;

                    messages.forEach((message) => {
                      let senderRole = message._sender.role
                        ? `${message._sender.role}`
                        : '';
                      cachedUserProfileList[
                        message._sender.userId
                      ] = `${message._sender.plainProfileUrl}${message._sender.nickname}`;
                      cachedHostBadge[message._sender.userId] = senderRole;
                    });
                    setCachedUserProfiles(cachedUserProfileList);
                    setCachedHostBadge(cachedHostBadge);
                  }
                }
                resolve(true);
              });
            })
            .catch((error) => {
              reject(false);
            });
        } else {
          /**
           * For Next Calls
           */
          sb.GroupChannel.getChannel(channelUrl, (channel, err) => {
            if (previousMessageQuery && previousMessageQuery.hasMore) {
              let MESSAGE_ID =
                (chatList[chatList.length - 1] &&
                  chatList[chatList.length - 1].messageId) ||
                '';
              channel.getPreviousMessagesByID(
                MESSAGE_ID,
                false,
                20,
                true,
                '',
                '',
                [],
                false,
                true,
                (messages, error) => {
                  if (error) {
                    reject(false);
                    console.log('error', error);
                    return;
                  }
                  if (messages && messages.length <= 0) {
                    setPreviousMessageQuery({
                      ...previousMessageQuery,
                      hasMore: false,
                    });
                    return;
                  }
                  getChatListSuccess(messages, true);
                  resolve(true);
                },
              );
            }
            channel.markAsRead();
          });
        }
        sb.GroupChannel.getChannel(channelUrl, (channel, err) => {
          changeMemberCount(channel.memberCount);
          setLoaderMemberCount(false);
          channel.markAsRead();
        });
      });
    },
    [chatList.length],
  );

  /**
   * Action On Send Press
   * 1.) Adding Temp Message
   * 2.) dispatch (saveOnSendSuccess(tempMessage){Add Temp Message}, saveOnSendSuccess(message, tempMessageID){Replace Temp Message})
   * 3.) State Change ( setTextMessage )
   * 4.) Call Scroll to bottom on sending new message
   * 5.) Send User Message
   */
  const onSendPress = () => {
    /**
     * If Text is Not Empty
     */
    if (textMessage.trim().length) {
      /**
       * 1.) Add Temp Message
       */
      let tempMessage = JSON.parse(
        `{"_sender": {"_preferredLanguages": null, "connectionStatus": "nonavailable", "friendDiscoveryKey": null, "friendName": null, "isActive": true, "isBlockedByMe": false, "lastSeenAt": 0, "metaData": {}, "nickname": "", "plainProfileUrl": "", "requireAuth": false, "userId": "5f4ceeb6d656c50e95e8fdbd"}, "channelType": "group", "channelUrl": "sendbird_group_channel_7608_f434053d3b85b70b407a741623600474339012bb", "createdAt": 1599234524323, "customType": "", "data": "", "errorCode": 0, "mentionType": "users", "mentionedUsers": [], "message": "ui", "messageId": 6571800578, "messageSurvivalSeconds": -1, "messageType": "user", "metaArrays": [], "ogMetaData": null, "parentMessageId": 0, "parentMessageText": null, "reactions": [], "reqId": "1599234512275", "requestState": "succeeded", "requestedMentionUserIds": [], "sendingStatus": "succeeded", "silent": false, "threadInfo": {"lastRepliedAt": 0, "mostRepliedUsers": [], "replyCount": 0, "updatedAt": 0}, "translations": {}, "updatedAt": 0}`,
      );
      let tempMessageID = Math.floor(100000000 + Math.random() * 900000000);
      tempMessage._sender.nickname = userData.firstName + ' ';
      tempMessage._sender.plainProfileUrl = userData.pictureUrl;
      tempMessage._sender.userId = userData.userId;
      tempMessage.channelUrl = channelUrl;
      tempMessage.message = textMessage;
      tempMessage.messageId = tempMessageID;
      tempMessage.reqId = Math.floor(
        100000000 + Math.random() * 9000000000,
      ).toString();
      tempMessage.isSending = true;
      /**
       * 2.) saveOnSendSuccess
       */
      saveOnSendSuccess(tempMessage);

      /**
       * 3.) Empty Message in state
       */
      setTextMessage('');
      /**
       * 4.) Scroll to Bottom
       */
      setScrollToBottom(true);

      /**
       * 5.) Send User Message
       */
      const channelUrl = route.params.channelUrl;
      const isOpenChannel = route.params.isOpenChannel;
      const sb = SendBird.getInstance();
      sb.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
        if (error) {
          return;
        }
        const params = new sb.UserMessageParams();
        params.message = textMessage;

        params.customType = 'MESG';
        params.mentionType = 'users'; // French and German
        params.pushNotificationDeliveryOption = 'default';

        groupChannel.sendUserMessage(textMessage, (message, error) => {
          if (error) {
            if (error.code == 900100) {
              Alert.alert('You have been removed from this group');
            } else {
              Alert.alert(
                error.message ? `${error.message}` : 'Message not sent',
              );
            }
            saveOnSendFailure(message, tempMessageID);
            return;
          }
          /**
           * 2.) Replace Temp Message
           */
          saveOnSendSuccess(message, tempMessageID);
        });
      });
    }
  };

  /**
      * Action on Sending Photo Message
      * @param {*} uri 
      * 1.) State Changes 
      (
      - setPhotoPickerVisible (true when task started and false on task end),
       - cachedFileItems{ We are keeping 20 file paths of latest sent images so that images should not be loading on everyaction})
      * 2.) getMessageList(true, tempMessage) ( Getting Message list because we came from background and then in the same call adding Temp Message)
      * 3.) Add Temp Photo Message
      * 4.) Replace Temp Message on Callback
      * 5.) Dispatch(saveOnSendSuccess)
      * 6.) Scroll To Bottom
      */
  const onPhotoAddPress = async (uri) => {
    setPhotoPickerVisible(true);
    const channelUrl = route.params.channelUrl;
    let source = {
      uri: uri.path,
      name: Date.now() + JPEG_FILE_EXTENSION,
      type: uri.mime,
    };

    //<======= 3.) temp photo ========>
    let tempMessage = JSON.parse(
      `{"_sender": {"_preferredLanguages": null, "connectionStatus": "nonavailable", "friendDiscoveryKey": null, "friendName": null, "isActive": true, "isBlockedByMe": false, "lastSeenAt": 0, "metaData": {}, "requireAuth": false, "role": "none"}, "channelType": "group",  "createdAt": 1599239211045, "customType": "", "data": "", "errorCode": 0, "isOperatorMessage": false, "mentionType": "users", "mentionedUsers": [],"messageType": "file", "messageId": 6571846615, "messageSurvivalSeconds": -1,  "metaArrays": [], "name": "1599239207327.jpeg", "ogMetaData": null, "parentMessageId": 0, "parentMessageText": null, "reactions": [], "reqId": "1599239180699", "requestState": "succeeded", "requestedMentionUserIds": [], "requireAuth": true, "sendingStatus": "succeeded", "silent": false, "size": 0, "threadInfo": {"lastRepliedAt": 0, "mostRepliedUsers": [], "replyCount": 0, "updatedAt": 0}, "thumbnails": [], "type": "image/jpeg", "updatedAt": 0}`,
    );
    let tempPhotoMessageID = Math.floor(100000000 + Math.random() * 900000000);
    tempMessage._sender.nickname = userData.firstName + ' ';
    tempMessage._sender.plainProfileUrl = userData.pictureUrl;
    tempMessage._sender.userId = userData.userId;
    tempMessage.channelUrl = channelUrl;
    tempMessage.plainUrl = uri.path;
    tempMessage.tempUri = uri.path;
    tempMessage.url = uri.path;
    tempMessage.messageId = tempPhotoMessageID;
    tempMessage.type = uri.mime;
    tempMessage.reqId = Math.floor(
      100000000 + Math.random() * 9000000000,
    ).toString();
    tempMessage.isSending = true;

    /**
     * 2.) Get Message List and addig Temp Message
     */
    await getMessageList(true, tempMessage);
    /**
     * 6.) & 1.) Scroll TO Bottom
     */
    setScrollToBottom(true);

    /**
     * Send Photo Message
     */
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        return;
      } else {
        const params = new sb.FileMessageParams();
        params.file = source;
        params.thumbnailSizes = [
          { maxWidth: 100, maxHeight: 100 },
          { maxWidth: 200, maxHeight: 200 },
        ]; // Add the maximum sizes of thumbnail images (allowed number of thumbnail images: 3).
        channel.sendFileMessage(params, (fileMessage, error) => {
          if (error) {
            console.log('error', error);
            // return;
          }
          if (Object.keys(cachedFileItems).length > 2) {
            let objectKeys = Object.keys(cachedFileItems);
            delete cachedFileItems[objectKeys[0]];
          }
          /**
           * Set Path in State
           */
          let cachedFileItemlistData = cachedFileItems;
          cachedFileItemlistData[fileMessage.messageId] = uri.path;
          setCachedFileItems(cachedFileItemlistData);

          fileMessage.tempUri = uri.path;
          /**
           * Replace Temp Message
           */
          saveOnSendSuccess(fileMessage, tempPhotoMessageID);

          setPhotoPickerVisible(false);
        });
      }
    });
  };

  const onGifAddPress = async (url) => {
    console.log('came   ', url);
    //setIsGifEnable(false)
    const channelUrl = route.params.channelUrl;
    let source = {
      uri: url,
      name: Date.now() + JPEG_FILE_EXTENSION,
      type: 'image/jpeg',
    };
    let tempMessage = JSON.parse(
      `{"_sender": {"_preferredLanguages": null, "connectionStatus": "nonavailable", "friendDiscoveryKey": null, "friendName": null, "isActive": true, "isBlockedByMe": false, "lastSeenAt": 0, "metaData": {}, "requireAuth": false, "role": "none"}, "channelType": "group",  "createdAt": 1599239211045, "customType": "", "data": "", "errorCode": 0, "isOperatorMessage": false, "mentionType": "users", "mentionedUsers": [],"messageType": "file", "messageId": 6571846615, "messageSurvivalSeconds": -1,  "metaArrays": [], "name": "1599239207327.jpeg", "ogMetaData": null, "parentMessageId": 0, "parentMessageText": null, "reactions": [], "reqId": "1599239180699", "requestState": "succeeded", "requestedMentionUserIds": [], "requireAuth": true, "sendingStatus": "succeeded", "silent": false, "size": 0, "threadInfo": {"lastRepliedAt": 0, "mostRepliedUsers": [], "replyCount": 0, "updatedAt": 0}, "thumbnails": [], "type": "image/jpeg", "updatedAt": 0}`,
    );
    let tempPhotoMessageID = Math.floor(100000000 + Math.random() * 900000000);
    tempMessage._sender.nickname = userData.firstName + ' ';
    tempMessage._sender.plainProfileUrl = userData.pictureUrl;
    tempMessage._sender.userId = userData._id;
    tempMessage.channelUrl = channelUrl;
    tempMessage.plainUrl = source.uri;
    tempMessage.tempUri = source.uri;
    tempMessage.url = source.uri;
    tempMessage.messageId = tempPhotoMessageID;
    tempMessage.type = 'image/jpeg';
    tempMessage.reqId = Math.floor(
      100000000 + Math.random() * 9000000000,
    ).toString();
    tempMessage.isSending = true;
    saveOnSendSuccess(tempMessage);

    /**
     * 2.) Get Message List and addig Temp Message
     */
    //await getMessageList(true, tempMessage);

    /**
     * Send Gif  Message
     */
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        return;
      } else {
        const params = new sb.FileMessageParams();
        params.file = source;
        params.thumbnailSizes = [
          { maxWidth: 100, maxHeight: 100 },
          { maxWidth: 200, maxHeight: 200 },
        ]; // Add the maximum sizes of thumbnail images (allowed number of thumbnail images: 3).
        channel.sendFileMessage(params, (fileMessage, error) => {
          if (error) {
            console.log('error', error);
            saveOnSendFailure(message, tempMessageID);
            return;
          }
          if (Object.keys(cachedFileItems).length > 20) {
            let objectKeys = Object.keys(cachedFileItems);
            delete cachedFileItems[objectKeys[0]];
          }
          /**
           * Set Path in State
           */
          let cachedFileItemlistData = cachedFileItems;
          cachedFileItemlistData[fileMessage.messageId] = source.uri;
          setCachedFileItems(cachedFileItemlistData);

          fileMessage.tempUri = source.uri;
          /**
           * Replace Temp Message
           */
          saveOnSendSuccess(fileMessage, tempPhotoMessageID);
        });
      }
    });
  };

  /**
   * 
   * @param {*} id Fire Trivia Question
   */
  const onSendTriviaQuestion = () => {
    if (selectedTriviaQuestion && selectedTriviaQuestion._id) {
      if (route.params.watchPartyId && route.params.watchPartyId != '') {
        SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.FIRE_QUESTION, {
          watchPartyId: route.params.watchPartyId,
          id: selectedTriviaQuestion._id
        });
        setSelectedTriviaQuestion('')
      }
      else {
        SocketManager.sharedManager.emitEvent(SOCKET_EVENTS.FIRE_QUESTION, {
          channelUrl: channelUrl,
          id: selectedTriviaQuestion._id
        });
        setSelectedTriviaQuestion('')
      }
    }
  }
  const setTriviaQuestion = (item) => {
    setSelectedTriviaQuestion(item)
  }
  /**
   * Action On Like Press
   *  --useCallback is used so that ReactMemo in its child component could work perfectly
   */

  const onLikePress = useCallback((item) => {
    const channelUrl = route.params.channelUrl;
    const messageID = item.message_id;
    const reactions = item.reactions;
    const sb = SendBird.getInstance();
    /**
     * Removing tempUri from message object which we added for adding temp image message
     * --Without removing you will get the error "Invalid Params"
     */
    if (item.tempUri) {
      delete item.tempUri;
    }
    /**
     * Toogle Like
     * --If Own Like Exist then Delete Like
     * --If Own Like Not Exist then Add Like
     */
    if (
      reactions &&
      reactions[0] &&
      reactions[0].userIds &&
      reactions[0].userIds.includes(userData._id)
    ) {
      sb.GroupChannel.getChannel(route.params.channelUrl, (channel, err) => {
        channel.deleteReaction(item, emojiKey, function (reactionEvent, error) {
          if (!error) {
            item.applyReactionEvent(reactionEvent);
          }
        });
      });
    } else {
      sb.GroupChannel.getChannel(route.params.channelUrl, (channel, err) => {
        channel.addReaction(item, emojiKey, function (reactionEvent, error) {
          if (!error) {
            item.applyReactionEvent(reactionEvent);
          }
        });
      });
    }
  }, []);

  /**
   * Action On Message Selected
   */
  const onMessageSelected = useCallback((item) => {
    // setMessageSelectedWidget(true);
    // setSelectedMessage(item);
    setMessageSelectedWidget(false);
    Clipboard.setString(item && item.message ? item.message : '');
    setTimeout(() => Toast.show('Message Copied', 3), 500);
  }, []);

  /**
   * Action on Select Message Widget close press
   */
  const onWidgetClosePress = () => {
    setMessageSelectedWidget(false);
    setSelectedMessage({});
  };

  /**
   * Action On Press Copy Message
   */
  const onPressCopyMessageAction = () => {
    setMessageSelectedWidget(false);
    Clipboard.setString(
      selectedMessage && selectedMessage.message ? selectedMessage.message : '',
    );
    Toast.show('Message Copied', 3);
    setSelectedMessage({});
  };

  /**
   * Action Set Scroll to bottom action completed
   */
  const actionSetScrollToBottomFalse = () => {
    setScrollToBottom(false);
  };
  /**
   * on Press Input box Trophy
   */
  const toggleInputBoxTrophyHost = () => {
    if (!isHostTriviaEnable) {
      Keyboard.dismiss()
      setIsGifEnable(false)
      setIsHostTriviaEnabled(true)
    }
    else {
      setIsHostTriviaEnabled(false)
    }
  };
  /**
   * Handle Images Loader
   */
  const handleImageLoader = () => {
    // let loadedImagesCount = loadedCountImages;
    // loadedImagesCount = loadedImagesCount + 1
    // setLoadedCountImages(loadedImagesCount)
    // if (loadedImagesCount == countImages) {
    //     setLoadedFlagComplete(true);
    //     onLoadComplete();
    // }
  };
  /**
   * Report A Message
   */
  const reportMessage = useCallback((item) => {
    requestFlagMessage({
      netConnected,
      body: {
        messageId: item.messageId,
        channelUrl: item.channelUrl,
      },
      success: (data) => {
        alert('Message flagged successfully');
      },
      fail: (error) => {
        console.log(JSON.stringify(error));
      },
    });
  }, []);
  const banUser = useCallback((item) => {
    requestBanUser({
      netConnected,
      body: {
        userId: item._sender.userId,
        channelUrl: item.channelUrl,
        agentId: userData._id,
      },
      success: (data) => {
        alert('User removed successfully');
      },
      fail: (error) => {
        alert(JSON.stringify(error));
      },
    });
    // Alert.alert(
    //     'Alert Title',
    //     'My Alert Msg',
    //     [
    //         { text: 'OK', onPress: () => console.log('OK Pressed') },
    //     ],
    //     //{ cancelable: false },
    // );
    // alert('HI')
  }, []);
  const onShare = async () => {
    try {
      let payload = {};
      if (Platform.OS == 'android') {
        payload = {
          dialogTitle: route.params.shareDialogTitle
            ? route.params.shareDialogTitle
            : 'Invite Fans',
          message: route.params.shareDialogUrl
            ? route.params.shareDialogUrl
            : TEXT_CONST.ANDROID_APP_URL,
        };
      } else {
        payload = {
          title: route.params.shareDialogTitle
            ? route.params.shareDialogTitle
            : 'Invite Fans',
          url: route.params.shareDialogUrl
            ? route.params.shareDialogUrl
            : TEXT_CONST.IOS_APP_URL,
        };
      }

      const result = await Share.share(payload);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * Render
   */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: menuVisible ? 'rgba(0,0,0,0.5)' : 'white',
          opacity: menuVisible ? 1 : 1,
        }}>
        <SafeAreaView style={{ backgroundColor: STATUS_BAR_PRIMARY_COLOR }} />
        <StatusBar
          backgroundColor={STATUS_BAR_PRIMARY_COLOR}
          animated
          barStyle={'light-content'}
        />
        <View
          style={
            strScoreLive && strScoreLive != ''
              ? styles.containerWithScore
              : [styles.container]
          }>
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              navigation.goBack();
            }}
            style={[
              { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
            ]}>
            <Image
              resizeMode="contain"
              source={require('../../../assets/icons/back_button.png')}></Image>
          </TouchableOpacity>
          {messageSelectedWidget ? (
            <Text
              numberOfLines={1}
              style={[
                styles.textStyle,
                {
                  flex: 1,
                  textAlign: 'left',
                  fontWeight: '800',
                  marginLeft: _scaleText(10).fontSize,
                  marginBottom: _scaleText(5).fontSize,
                },
              ]}>
              {SCREEN_TEXT_CONST.COPY}
            </Text>
          ) : strScoreLive && strScoreLive != '' ? (
            <>
              <View style={[styles.scoreWrap]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.scoreTitle}>{scoreObj.awayTeam}</Text>

                    <Text style={styles.scoreTitle}>{scoreObj.HomeTeam}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 0.9,
                    }}>
                    <Text
                      style={[styles.scoreTitle, { alignSelf: 'flex-start' }]}>
                      {scoreObj.awayTeamScore}
                    </Text>

                    <Text
                      style={[styles.scoreTitle, { alignSelf: 'flex-start' }]}>
                      {scoreObj.homeTeamScore}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.scoreWrap]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={[styles.scoreTitle, { alignSelf: 'flex-end' }]}>
                      {`${scoreObj.quarter} ${scoreObj.timeRemainingMinutes}:${scoreObj.timeRemainingSeconds}`}
                    </Text>

                    <Text style={[styles.scoreTitle, { alignSelf: 'flex-end' }]}>
                      {' '}
                      {stateMemberCount && !memberCountLoader
                        ? stateMemberCount
                        : ''}
                      {SCREEN_TEXT_CONST.WATCHING}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginRight: _scaleText(15).fontSize,
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.textStyle,
                  { textAlignVertical: 'center', alignSelf: 'center' },
                ]}>
                {stateTitle}
              </Text>
            </View>
          )}
          {messageSelectedWidget && (
            <FontAwesome
              name={ICONS_NAMES.ICON_COPY}
              onPress={onPressCopyMessageAction}
              color={'white'}
              style={{
                alignSelf: 'center',
                marginTop: _scaleText(7).fontSize,
                padding: 0,
              }}
              size={_scaleText(25).fontSize}
            />
          )}
        </View>
        {/* {(!((route.params.leagueInfo === 'NFL' || route.params.leagueInfo === 'NCAAF') && strScoreLive && strScoreLive != '')) && <View style={styles.titleContainer}>
                    <Text>
                        {memberCountLoader && (
                            <View>
                                <ActivityIndicator
                                    size="small"
                                    color={STATUS_BAR_PRIMARY_COLOR}></ActivityIndicator>
                            </View>
                        )}
                        <Text style={styles.title}>
                            {stateMemberCount && !memberCountLoader ? stateMemberCount : ''}
                            {SCREEN_TEXT_CONST.WATCHING}
                        </Text>
                    </Text>
                </View>} */}
        <TouchableHighlight
          underlayColor={PARTIES_TAB_COLOR}
          onPress={() => {
            onShare();
          }}
          style={[
            styles.titleContainer,
            {
              paddingHorizontal: _scaleText(10).fontSize,
              paddingLeft: _scaleText(15).fontSize,
              alignItems: 'center',
              alignContent: 'center',
            },
          ]}>
          <>
            <Image
              source={require('../../../assets/icons/share_button.png')}
              style={{
                height: scaleText(14.82).fontSize,
                width: scaleText(19).fontSize,
                alignSelf: 'center',
              }}></Image>
            {/* <FontAwesome
                            name={ICONS_NAMES.ICON_SHARE}
                            color={COLLYDE_PRIMARY_BLUE_COLOR}
                            style={{
                                alignSelf: 'center',
                                marginTop: _scaleText(7).fontSize,
                                padding: 0,
                            }}
                            size={_scaleText(18).fontSize}
                        /> */}
            <Text style={[styles.title]}>
              {route.params.inviteText
                ? route.params.inviteText
                : 'Invite Fans'}
            </Text>
            <View style={{ flex: 1 }}></View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: STATUS_BAR_PRIMARY_COLOR,
                  fontSize: _scaleText(17).fontSize,
                  marginRight: _scaleText(6).fontSize,
                }}>
                |
              </Text>
              <Image
                source={require('../../../assets/icons/group_icon.png')}
                style={{
                  height: scaleText(22).fontSize,
                  width: scaleText(25).fontSize,
                  alignSelf: 'center',
                }}></Image>
              {memberCountLoader && (
                <View style={{ marginLeft: 4, marginTop: 2 }}>
                  <ActivityIndicator
                    size="small"
                    color={STATUS_BAR_PRIMARY_COLOR}></ActivityIndicator>
                </View>
              )}
              <Text
                style={[
                  styles.title,
                  { color: COLLYDE_PRIMARY_BLUE_COLOR, marginLeft: 4 },
                ]}>
                {stateMemberCount && !memberCountLoader ? stateMemberCount : ''}
              </Text>
            </View>
          </>
        </TouchableHighlight>
        {
          ((iBarAnnoucements && iBarAnnoucements.length) || (iBarQuestions && iBarQuestions.length))
            ?
            <ChatIBar iBarCurrentAnnoucement={iBarCurrentAnnoucement} iBarAnnoucements={iBarAnnoucements} iBarQuestions={iBarQuestions}></ChatIBar>
            :
            <></>
        }

        <ChatList
          chatList={chatList}
          getMessageList={getMessageList}
          channel={channel}
          forceUpdate={flatListForceUpdateToggle}
          cachedFileItems={cachedFileItems}
          scrollToBottom={scrollTOBottom}
          setFalseScrollToBottom={actionSetScrollToBottomFalse}
          hasMore={
            previousMessageQuery && previousMessageQuery.hasMore ? true : false
          }
          isUserHost={isUserHost}
          userData={userData}
          isUserBanned={isUserBanned}
          selectedMessage={selectedMessage}
          isIntialLoading={isLoading}
          onLikePress={onLikePress}
          onClickRemove={banUser}
          onClickReport={reportMessage}
          onMessageSelected={onMessageSelected}></ChatList>

        <ChatSender
          onLeftPress={() => { }}
          onRightPress={() => {
            if (selectedTriviaQuestion && selectedTriviaQuestion._id) {
              onSendTriviaQuestion()
            }
            else {
              onSendPress()
            }
          }}
          editing={false}
          isUserBanned={isUserBanned}
          netConnected={netConnected}
          onPlusPress={onPhotoAddPress}
          selectedTriviaQuestion={selectedTriviaQuestion}
          onDiscardTrivia={() => {
            setSelectedTriviaQuestion('')
          }}
          isUserHost={isUserHost}
          isHostTriviaEnable={isHostTriviaEnable}
          onPressGif={() => {
            setIsGifEnable(true);
            Keyboard.dismiss();
            setIsHostTriviaEnabled(false);
          }}
          onPressKeyboard={() => {
            setIsGifEnable(false);
            setIsHostTriviaEnabled(false);
          }}
          onPressInputTrophy={() => {
            toggleInputBoxTrophyHost()
          }}
          isGifEnable={isGifEnable}
          textMessage={textMessage}
          onChangeText={(text) => setTextMessage(text)}
        />
        <GifSender
          onLeftPress={() => { }}
          onRightPress={() => onSendPress()}
          editing={false}
          netConnected={netConnected}
          onPlusPress={onPhotoAddPress}
          SendGif={onGifAddPress}
          isUserHost={isUserHost}
          textMessage={term}
          onPressKeyboard={() => {
            setIsGifEnable(false);
            setIsHostTriviaEnabled(false);
            updateTerm(
              route.params.defaultGifKeyword
                ? route.params.defaultGifKeyword
                : route.params.leagueInfo
                  ? route.params.leagueInfo
                  : 'NBA',
            );
            updateGifLoadStartPosition(0);
          }}
          isGifEnable={isGifEnable && !isUserBanned ? true : false}
          gifTermChange={onEdit}
          gifNextPage={() => fetchGifs()}
          gifsData={gifs}
          onChangeText={(text) => setTextMessage(text)}
        />
        <TriviaSender
          isUserHost={isUserHost}
          isHostTriviaEnable={isHostTriviaEnable}
          hostTriviaQuestions={hostTriviaQuestions}
          SendTriviaQuestion={setTriviaQuestion}
          netConnected={netConnected}
        />
      </View>
      <SafeAreaView style={{ backgroundColor: 'white' }} />
    </KeyboardAvoidingView>
  );
};
/**
 * Screen Const
 */
const ICONS_NAMES = {
  ICON_CLOSE_COPY_WIDGET: 'cross',
  ICON_BACK: 'chevron-left',
  ICON_COPY: 'copy',
  ICON_SHARE: 'external-link-alt',
};
const SCREEN_TEXT_CONST = {
  COPY: 'Copy',
  WATCHING: ' WATCHING',
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  containerWithScore: {
    width: '100%',
    height: _scaleText(56).fontSize,
    backgroundColor: STATUS_BAR_PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: _scaleText(8).fontSize,
    paddingHorizontal: _scaleText(10).fontSize,
  },
  container: {
    width: '100%',
    height: _scaleText(56).fontSize,
    backgroundColor: STATUS_BAR_PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'flex-end',
    //paddingVertical: _scaleText(8).fontSize,
    paddingHorizontal: _scaleText(10).fontSize,
    paddingLeft: _scaleText(15).fontSize,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 0,
    marginRight: _scaleText(10).fontSize,
    // marginTop: _scaleText(4).fontSize,
  },

  backButtonWithScore: {
    // marginBottom: scaleSizeH(10),
    //marginTop: scaleSizeH(5),
  },
  textStyle: {
    color: 'white',
    ..._scaleText(19),
    marginLeft: _scaleText(7).fontSize,
    // fontWeight: 'bold',
    alignSelf: 'center',
    //marginTop: _scaleText(5).fontSize,
  },
  roomText: {
    textAlign: 'center',
    color: JOIN_BUTTON_COLOR,
    paddingHorizontal: _scaleText(10).fontSize,
    paddingVertical: _scaleText(5).fontSize,
    fontWeight: '900',
    fontSize: _scaleText(18).fontSize,
  },
  messageListViewStyle: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  messageInputViewStyle: {
    marginBottom: 0,
    flexDirection: 'column',
  },
  memberCountTitle: {
    color: STATUS_BAR_PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: _scaleText(20).fontSize,
    marginTop: _scaleText(10).fontSize,
  },
  title: {
    color: STATUS_BAR_PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: _scaleText(17).fontSize,
    marginLeft: _scaleText(3).fontSize,
    marginBottom: _scaleText(1).fontSize,
  },
  partyLogo: {
    color: STATUS_BAR_PRIMARY_COLOR,
    fontWeight: '800',
    marginLeft: _scaleText(7).fontSize,
    marginTop: _scaleText(3).fontSize,
  },
  titleContainer: {
    //  paddingHorizontal: _scaleText(10).fontSize,
    paddingVertical: _scaleText(3).fontSize,
    backgroundColor: PARTIES_TAB_COLOR,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // paddingLeft: _scaleText(7).fontSize,
  },
  scoreWrap: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: _scaleText(10).fontSize,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreRight: {
    flex: 1,
  },
  scoreTitle: {
    color: 'white',
    textAlign: 'left',
    fontWeight: '500',
    //marginVertical: _scaleText(2).fontSize,
    fontSize: _scaleText(16).fontSize,
  },
  scoreNum: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: setSpText(16),
    marginTop: scaleSizeH(5),
  },
  scoreFooterWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSizeH(10),
  },
  scoreFooterBody: {
    backgroundColor: COLLYDE_PRIMARY_BLUE_COLOR,
    borderRadius: 50,
  },
  scoreFooterContent: {
    color: 'white',
    fontWeight: '500',
    fontSize: setSpText(16),
    padding: scaleSizeH(8),
    paddingLeft: scaleSizeH(12),
    paddingRight: scaleSizeH(12),
  },
});
export default Chat;
