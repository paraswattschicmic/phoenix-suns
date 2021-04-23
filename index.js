import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { BOTTOM_TABS, CHAT_SCREEN, navigationRef } from './src/shared';
import { StackActions } from '@react-navigation/native';
// import backgroundPush from './src/shared/services/push';
var PushNotification = require("react-native-push-notification");




messaging().setBackgroundMessageHandler(async remoteMessage => {
  //console.log(remoteMessage)
  //console.log(JSON.stringify(remoteMessage));
  let payload = {}
  let data = {}
  if (remoteMessage.data.sendbird) {
    payload = JSON.parse(remoteMessage.data.sendbird);
    data = {
      channelUrl: payload.channel.channel_url,
      title: payload.channel.name,
      memberCount: 'NA',
      isOpenChannel: false
    }
  }
  // else if (remoteMessage.data.channelUrl && remoteMessage.data.channelName) {
  //   payload = remoteMessage.data;
  //   data = {
  //     channelUrl: remoteMessage.data.channelUrl,
  //     title: remoteMessage.data.channelName,
  //     memberCount: 'NA',
  //     isOpenChannel: false
  //   }
  // }
  //  console.log('Message handled in the background!', remoteMessage);

  if (payload && payload.channel) {
    // console.log('payload maessage', JSON.stringify(payload))

    PushNotification.configure({
      onNotification: function (notification) {
        //  console.log('LOCAL NOTIFICATION ==>', notification)
        //  navigationRef.current?.navigate(CHAT_SCREEN, notification.data);

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        }
        if (notification.userInteraction == true) {
          navigationRef.current?.navigate(BOTTOM_TABS.ROOMS);
          navigationRef.current?.dispatch(StackActions.push(CHAT_SCREEN, notification.data));
        }

      },
      popInitialNotification: true,
      requestPermissions: true
    })
    let strMessage = ''
    if (payload.type && payload.type == 'FILE') {
      strMessage = `${payload.sender && payload.sender.name ? payload.sender.name : 'User'} just sent a photo`
    }
    else {
      strMessage = `${payload.sender && payload.sender.name ? payload.sender.name : 'User'}:${payload.message}`;
    }

    // if (Platform.OS === 'ios') {
    //   console.log('Came iOS check Local Notificcation')
    //   const iosNotification = {
    //     id: payload.message_id + '',
    //     alertTitle: payload.channel && payload.channel.name ? payload.channel.name : 'Chat',
    //     //fireDate: new Date(Date.now() + 1 * 20),
    //     userInfo: { id: payload.message_id + '' },
    //     alertBody: strMessage,
    //     data: data,
    //     applicationIconBadgeNumber: 0
    //   };
    //   PushNotificationIOS.presentLocalNotification(iosNotification);
    // }
    // console.log('Came iOS check Local Notificcation 222')

    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      title: payload.channel && payload.channel.name ? payload.channel.name : 'Chat',
      message: strMessage,
      //smallIcon: "ic_notification",
      color: 'black',
      date: new Date(Date.now() + 1 * 20), // in 20 milisecond
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      data: data,
      // bigPictureUrl: payload.type && 'FILE' && payload.files && payload.files[0] && payload.files[0].url ? payload.files[0].url : undefined
    });
  }

});

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundPush) //add this line after appRegistry Component and this is a key to be added to get notitification in background when using sendbird, whicch is nowhere mentioned in its official doc. It is in the sample App I have also added link to it.