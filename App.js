import React, { useEffect } from 'react';
import { View, AppState } from 'react-native';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './src/redux/store';
import { Provider } from 'react-redux';
import { LoaderHOC } from './src/components/hoc';
import RootNavigator from './src/navigator';
import SendBird from 'sendbird';
import appStateChangeHandler from './src/shared/services/appStateChangeHandler';
// import firebase from 'react-native-firebase'
import messaging from '@react-native-firebase/messaging';
import InternetCheckWrapper from './src/components/hoc/InternetCheckWrapper';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { BOTTOM_TABS, CHAT_SCREEN, navigationRef } from './src/shared';
import { StackActions } from '@react-navigation/native';
import OfflineNotice from './src/components/hoc/OfflineNotice';

const App = () => {
  let appStateHandler = appStateChangeHandler.getInstance();
  const _handleAppStateChange = nextAppState => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
        sb.setForegroundState();
        appStateHandler.notify();
      } else if (nextAppState === 'background') {
        sb.setBackgroundState();
      }
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    registerAppWithFCM()
  }, [])

  useEffect(() => {
    PushNotificationIOS.addEventListener('localNotification', onRemoteNotification);
  });

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage && remoteMessage.data && remoteMessage.data.channelUrl && remoteMessage.data.channelName) {
        const data = {
          channelUrl: remoteMessage.data.channelUrl,
          title: remoteMessage.data.channelName,
          memberCount: 'NA',
          isOpenChannel: false
        }
        navigationRef.current?.navigate(BOTTOM_TABS.ROOMS);
        navigationRef.current?.dispatch(StackActions.push(CHAT_SCREEN, data));
      }
    });
  }, []);

  async function registerAppWithFCM() {
    console.log(">>>> registerAppWithFCM")
    await messaging().registerDeviceForRemoteMessages();
  }

  const onRemoteNotification = (notification) => {
    //console.log('iOS on CLick Notification Data=============>', JSON.stringify(notification))

    if (notification && notification._data && notification._data.sendbird && notification._data.sendbird.channel && notification._data.sendbird.channel.channel_url && notification._data.sendbird.channel.name) {
      //  console.log('came in if')
      const data = {
        channelUrl: notification._data.sendbird.channel.channel_url,
        title: notification._data.sendbird.channel.name,
        memberCount: 'NA',
        isOpenChannel: false
      }
      navigationRef.current?.navigate(BOTTOM_TABS.ROOMS);
      navigationRef.current?.dispatch(StackActions.push(CHAT_SCREEN, data));
    }
    else if (notification._data && notification._data.channelUrl && notification._data.channelName) {
      const data = {
        channelUrl: notification._data.channelUrl,
        title: notification._data.channelName,
        memberCount: 'NA',
        isOpenChannel: false
      }
      navigationRef.current?.navigate(BOTTOM_TABS.ROOMS);
      navigationRef.current?.dispatch(StackActions.push(CHAT_SCREEN, data));
    }


    //const isClicked = notification.getData().userInteraction === 1

    // if (isClicked) {
    //   navigationRef.current?.dispatch(StackActions.push(CHAT_SCREEN, notification.data));
    // }
  };

  return (

    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View style={{ flex: 1, }}>
          <OfflineNotice >
            <LoaderHOC>
              <RootNavigator />
            </LoaderHOC>
          </OfflineNotice>
        </View>
      </PersistGate>
    </Provider>

  );
};

export default App;
