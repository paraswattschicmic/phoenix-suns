import SendBird from 'sendbird';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { CONFIG_APP_ID } from '../../../shared/constants/sendbird';



export const sbRegisterPushToken = () => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (Platform.OS === 'ios') {
        // WARNING! FCM token doesn't work in request to APNs.
        // Use APNs token here instead.
        messaging()
          .getAPNSToken()
          .then(token => {
            if (token) {
              sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
                if (!error) {
                  resolve();
                } else {
                  reject(error);
                }
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            console.log('error ios', error)
            reject(error);
          });
      } else {
        messaging()
          .getToken()
          .then(token => {
            if (token) {
              sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
                if (!error) {
                  resolve();
                } else reject(error);
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      }
    } else {
      reject('SendBird is not initialized');
    }
  });
};
export const sbUnRegisterPushToken = () => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (Platform.OS === 'ios') {
        // WARNING! FCM token doesn't work in request to APNs.
        // Use APNs token here instead.
        messaging()
          .getAPNSToken()
          .then(token => {
            if (token) {
              messaging().deleteToken().then((success) => {
                console.log(success)
              }).catch((err) => {
                console.log(err)
              })
              sb.unregisterAPNSPushTokenForCurrentUser(token, (result, error) => {
                if (!error) {
                  resolve();
                } else {
                  reject(error);
                }
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            console.log('error ios', error)
            reject(error);
          });
      } else {
        messaging()
          .getToken()
          .then(token => {
            if (token) {
              messaging().deleteToken().then((success) => {
                console.log(success)
              }).catch((err) => {
                console.log(err)
              })
              sb.unregisterGCMPushTokenForCurrentUser(token, (result, error) => {
                if (!error) {
                  resolve();
                } else reject(error);
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      }
    } else {
      reject('SendBird is not initialized');
    }
  });
};

export const sbConnect = (userId, nickname) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject('UserID is required.');
      return;
    }
    if (!nickname) {
      reject('Nickname is required.');
      return;
    }
    const sb = new SendBird({ appId: CONFIG_APP_ID });
    sb.connect(userId, (user, error) => {
      if (error) {
        reject('SendBird Login Failed.');
      } else {
        resolve(sbUpdateProfile(nickname));
      }
    });
  });
};

export const sbUpdateProfile = nickname => {
  return new Promise((resolve, reject) => {
    if (!nickname) {
      reject('Nickname is required.');
      return;
    }
    let sb = SendBird.getInstance();
    if (!sb) sb = new SendBird({ appId: CONFIG_APP_ID });
    sb.updateCurrentUserInfo(nickname, null, (user, error) => {
      if (error) {
        reject('Update profile failed.');
      } else {
        AsyncStorage.setItem('user', JSON.stringify(user), () => {
          resolve(user);
        });
      }
    });
  });
};

