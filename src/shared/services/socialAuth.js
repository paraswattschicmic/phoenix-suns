/* eslint-disable prettier/prettier */
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken,
} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import { store } from '../../redux/store';
import { startLoading } from '../../redux/actions';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from "jwt-decode";


export const _withFacebook = () => {
  return new Promise((resolve, reject) => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          reject('Login was cancelled');
        } else {
          store.dispatch(startLoading());
          AccessToken.getCurrentAccessToken().then(({ accessToken }) => {
            // console.log('access ', accessToken)
            getInfoFromToken(accessToken);
            const facebookCredential = auth.FacebookAuthProvider.credential(
              accessToken,
            );
            auth()
              .signInWithCredential(facebookCredential)
              .then(resolve)
              .catch(reject);
          });
        }
      },
      function (error) {
        console.log('errr', error);
        reject(error);
      },
    );
  });
};

export const _withApple = () => {
  return new Promise(async (resolve, reject) => {
    let appleAuthRequestResponse;
    await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then((success) => {
        appleAuthRequestResponse = success;
      })
      .catch((e) => reject('Error occurred.' + e));
    console.log('appleAuthRequestResponse', appleAuthRequestResponse);

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      //resolve(appleAuthRequestResponse);

      if (appleAuthRequestResponse && appleAuthRequestResponse.email && appleAuthRequestResponse.email != '') {
        resolve(appleAuthRequestResponse);
      }
      else {
        var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
        if (decoded.email) {
          appleAuthRequestResponse.email = decoded.email;
          resolve(appleAuthRequestResponse);
        }
        else {
          reject('Email not found.');
        }
      }

    } else {
      reject('User was not authorized.');
    }
  });
};

function getInfoFromToken(token) {
  const PROFILE_REQUEST_PARAMS = {
    fields: {
      string: 'name,email',
    },
  };
  const profileRequest = new GraphRequest(
    '/me',
    { token, parameters: PROFILE_REQUEST_PARAMS },
    (error, result) => {
      if (error) {
        console.log('Login Info has an error:', error);
      } else {
        if (result.isCancelled) {
          console.log('Login cancelled');
        }
        // if (result.bi === undefined) {
        //     Alert.alert("Error", "To contiune MyApp plase allow access to your email", "Ok")
        // }
        else {
          // console.log('result', result)
        }
      }
    },
  );
  new GraphRequestManager().addRequest(profileRequest).start();
}
