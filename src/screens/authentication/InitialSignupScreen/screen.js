import React, { useEffect } from 'react';
import {
  Text,
  Linking,
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Platform,
  AppState,
  Image,
  ToastAndroid,
} from 'react-native';
import Video from 'react-native-video';
import { CustomButton } from '../../../components';
import {
  _withApple,
  _withFacebook,
  callPermitRequest,
  DASHBOARD_BOTTOM_TAB,
  TEXT_CONST,
  COLLYDE_LOGO,
  FACEBOOK_BUTTON_COLOR,
  COMPLETE_PROFILE_SCREEN,
  SIGN_UP_MOBILE,
  COLLYDE_PRIMARY_BLUE_COLOR,
  SIGNUP_BG,
} from "../../../shared";
import { _scaleText } from '../../../shared/services/utility';
import { setSpText, scaleSizeH, scaleSizeW } from '../../../shared/services/screenStyle';
import Toast from 'react-native-simple-toast';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import {
  FacebookGraphBaseUrl,
  FacebookGraphProfilePictureConfig,
} from '../../../shared/constants/facebook';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
Geocoder.init(Platform.OS == 'ios' ? "AIzaSyAuLxrKGZ-L0eDV78q9E6dxRGKFCXVjyKk" : 'AIzaSyDJu4McaL5WnLYi-GmFf1LKA-cS6mTWK4c');
import { FaceBookLogin } from 'react-native-fbsdk';
import SignUpButton from '../../../components/atoms/SignUpButton';

const { height, width } = Dimensions.get('window');
let authRequestResponse = null;

const SignUpScreen = ({
  navigation,
  netConnected,
  socialLoginRequest = () => { },
  stopLoading,
  updateAppleData,
  updateFacebookData,
  // updateProfileRequest,
  // getTimezoneRequest
}) => {
  /**
   * Sign Up with Facebook
   */
  const onSignupWithFacebook = () => {
    let deviceId = getUniqueId();
    if (netConnected) {
      _withFacebook()
        .then(({ additionalUserInfo = {}, user = {} }) => {
          let { displayName = '', email = '' } = user;
          let { id } = additionalUserInfo.profile;
          let payload = {
            deviceId,
            loginType: TEXT_CONST.FaceBookLogin,
            socialId: id,
            firstName: displayName ? displayName : '',
            pictureUrl: `${FacebookGraphBaseUrl}${id}${FacebookGraphProfilePictureConfig}`,
            email: email,
          };
          socialLoginRequest({
            payload,
            netConnected,
            success: (isNewUser, firstName) => {
              navigation.replace(
                isNewUser ? COMPLETE_PROFILE_SCREEN : DASHBOARD_BOTTOM_TAB,
                { ...payload },
              );
              updateFacebookData(displayName);
              updateAppleData('');

              // if (!isNewUser) {
              //   navigation.replace(
              //     DASHBOARD_BOTTOM_TAB,
              //     { ...payload },
              //   );
              // }
              // else {
              //   let pictureUrl = payload.pictureUrl;
              //   let zipcode = new Array(5);
              //   let hometown = '';
              //   let timezone = '';

              //   getTimezoneRequest({
              //     netConnected,
              //     success: (timezones = []) => {
              //       if (timezones && timezones.length) {
              //         let offset = -(new Date().getTimezoneOffset());
              //         let timezoneIndex = timezones.findIndex(item => item.value == offset)
              //         if (timezoneIndex && timezoneIndex >= 0) {
              //           timezone = timezones[timezoneIndex]._id;
              //           navigateUser(firstName, pictureUrl, zipcode, hometown, timezone);
              //         }
              //         else {
              //           navigateUser(firstName, pictureUrl, zipcode, hometown);
              //         }
              //       }
              //       else {
              //         navigateUser(firstName, pictureUrl, zipcode, hometown);
              //       }
              //     },
              //     fail: (error = '') => {
              //       navigateUser(firstName, pictureUrl, zipcode, hometown);
              //       Toast.show(error, 3)
              //     }
              //   })
              // }
            },
            fail: (error) => {
              Toast.show(error, 3)
            },
          });
        })
        .catch((err) => {
          stopLoading();
        });
    } else {
      Toast.show(TEXT_CONST.INTERNET_ERROR, 3);
    }
  };
  /**
   * Navigate & Update profile call for first time user
   * @param {*} firstName 
   * @param {*} pictureUrl 
   * @param {*} zipcode 
   * @param {*} hometown 
   * @param {*} timezone 
   */
  // const navigateUser = (firstName, pictureUrl, zipcode, hometown, timezone = TEXT_CONST.DEFAULT_TIMEZONE_ID) => {

  //   let payload = {
  //     firstName,
  //     pictureUrl,
  //     timezone,
  //     zipcode: zipcode.join(''),
  //     hometown: hometown
  //   }
  //   updateProfileRequest({
  //     fail: (error) => Toast.show(error, 3),
  //     netConnected,
  //     payload,
  //     success: () => {
  //       console.log('success')
  //       navigation.replace(
  //         DASHBOARD_BOTTOM_TAB,
  //         { ...payload },
  //       );
  //     },
  //   })
  // }
  /**
   * Sign Up with Apple
   */
  async function onAppleButtonPress() {
    let deviceId = getUniqueId();
    // performs login request
    if (netConnected) {
      _withApple()
        .then(({ email = '', fullName = {}, user = '' }) => {
          let payload = {
            deviceId,
            loginType: TEXT_CONST.AppleLogin,
            socialId: user,
            firstName: `${fullName.givenName ? fullName.givenName : ''} ${fullName.familyName ? fullName.familyName : ''}`,
            email: email,
          };

          socialLoginRequest({
            payload,
            netConnected,
            success: (isNewUser, firstName) => {
              navigation.replace(
                isNewUser ? COMPLETE_PROFILE_SCREEN : DASHBOARD_BOTTOM_TAB,
                { ...payload },
              );
              updateAppleData(firstName);
              updateFacebookData('');
            },
            fail: (error) => Toast.show(error, 3),
          });
        })
        .catch((err) => {
          stopLoading();
        });
    } else {
      Toast.show(TEXT_CONST.INTERNET_ERROR, 3);
    }
  }

  /**
   * Render
   */
  return (
    <View style={styles.container}>
      {/* <Video
        source={require("../../../assets/images/signUpBg.png")}
        style={styles.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode={"cover"}
        rate={1.0}
        ignoreSilentSwitch={"obey"}
      /> */}
      <Image resizeMode="stretch" source={SIGNUP_BG} style={styles.backgroundImage}/>
      {/* <View style={styles.logoContainer}>
        <Image resizeMode="contain" source={COLLYDE_LOGO} style={styles.logo} />
      </View>
      <Text style={styles.collydeSlogan}>Never Watch Sports Alone</Text> */}
      <View style={styles.buttonContainer}>
        <SignUpButton
          label={TEXT_CONST.SIGN_UP_FB}
          onPress={onSignupWithFacebook}
          imgSrc={"facebook"}
          imgSize={_scaleText(18).fontSize}
          imgColor={"white"}
          // imgStyles={{ alignSelf: 'center', marginLeft: _scaleText(10).fontSize }}
          labelStyle={{
            fontSize: _scaleText(16).fontSize,
            fontWeight: "500",
            fontFamily: "SFProText-Bold",
          }}
          containerStyle={styles.signupButton}
        />
        {Platform.OS === "ios" && (
          <SignUpButton
            label={TEXT_CONST.SIGN_UP_APPLE}
            onPress={onAppleButtonPress}
            imgSrc={"apple"}
            imgSize={_scaleText(18).fontSize}
            imgColor={"black"}
            imgStyles={{ alignSelf: "center", marginLeft: _scaleText(10).fontSize }}
            labelStyle={{
              fontSize: _scaleText(16).fontSize,
              fontWeight: "500",
              fontFamily: "SFProText-Bold",
              color: "black",
            }}
            containerStyle={styles.signupButtonApple}
          />
          // <AppleButton
          //   buttonStyle={AppleButton.Style.WHITE}
          //   buttonType={AppleButton.Type.CONTINUE}
          //   style={{
          //     width: _scaleText(250).fontSize,
          //     height: _scaleText(40).fontSize,
          //     marginVertical: _scaleText(5).fontSize,
          //     alignSelf: 'center',
          //   }}
          //   cornerRadius={_scaleText(5).fontSize}
          //   textStyle={{ alignSelf: 'flex-start' }}
          //   onPress={() => onAppleButtonPress()}
          // />
        )}
        {Platform.OS === "ios" ? (
          <Text
            style={styles.textStyleSignUpMobile}
            onPress={() => {
              navigation.navigate(SIGN_UP_MOBILE);
            }}
          >
            {TEXT_CONST.SIGN_UP_MOBILE}
          </Text>
        ) : (
          <SignUpButton
            label={TEXT_CONST.SIGN_UP_MOBILE}
            onPress={() => {
              navigation.navigate(SIGN_UP_MOBILE);
            }}
            imgSrc={"phone"}
            imgSize={_scaleText(18).fontSize}
            imgColor={"white"}
            imgStyles={{ alignSelf: "center", marginLeft: _scaleText(10).fontSize }}
            labelStyle={{
              fontSize: _scaleText(16).fontSize,
              fontWeight: "500",
              fontFamily: "SFProText-Bold",
              color: "white",
            }}
            containerStyle={styles.signupButtonPhone}
          />
        )}

        <Text style={styles.textStyle}>
          {TEXT_CONST.TermsAndConditions}
          <Text
            style={styles.underLineText}
            onPress={() => Linking.openURL("https://www.getcollyde.com/collyde-terms-and-conditions")}
          >
            {TEXT_CONST.TERMS}
          </Text>{" "}
          and{" "}
          <Text
            style={styles.underLineText}
            onPress={() => Linking.openURL("https://www.getcollyde.com/collyde-terms-and-conditions")}
          >
            {TEXT_CONST.PRIVACY}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;
const styles = StyleSheet.create({
  backgroundVideo: {
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
  },
  backgroundImage: {
    height: height,
    width: width,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: "10%",
    paddingHorizontal: "5%",
  },
  collydeSlogan: {
    color: "white",
    fontSize: setSpText(25),
    textAlign: "center",
    marginTop: -scaleSizeH(225),
    fontWeight: "600",
    fontStyle: "italic",
  },
  collydeSloganTogether: {
    color: "#64d2ff",
    textAlign: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: -scaleSizeH(120),
    marginBottom: "10%",
    alignItems: "center",
  },
  logo: {
    width: scaleSizeW(120),
    alignSelf: "center",
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginBottom: scaleSizeH(20),
    flex: 1,
  },
  signupButton: {
    //paddingHorizontal: _scaleText(30).fontSize,
    paddingVertical: _scaleText(0).fontSize,
    backgroundColor: FACEBOOK_BUTTON_COLOR,
    marginVertical: _scaleText(5).fontSize,
    width: "100%",
    height: _scaleText(40).fontSize,
    borderRadius: _scaleText(50).fontSize,
    alignSelf: "center",
  },
  signupButtonApple: {
    //paddingHorizontal: _scaleText(30).fontSize,
    paddingVertical: _scaleText(0).fontSize,
    backgroundColor: "white",
    marginVertical: _scaleText(5).fontSize,
    width: "100%",
    height: _scaleText(40).fontSize,
    borderRadius: _scaleText(50).fontSize,
    alignSelf: "center",
  },
  signupButtonPhone: {
    //paddingHorizontal: _scaleText(30).fontSize,
    paddingVertical: _scaleText(0).fontSize,
    backgroundColor: COLLYDE_PRIMARY_BLUE_COLOR,
    marginVertical: _scaleText(5).fontSize,
    width: "100%",
    height: _scaleText(40).fontSize,
    borderRadius: _scaleText(50).fontSize,
    alignSelf: "center",
  },
  textStyle: {
    fontSize: _scaleText(11).fontSize,
    marginTop: _scaleText(15).fontSize,
    textAlign: "center",
    color: "white",
  },
  textStyleSignUpMobile: {
    fontSize: _scaleText(18).fontSize,
    marginVertical: _scaleText(5).fontSize,
    textAlign: "center",
    color: "white",
  },
  underLineText: {
    textDecorationLine: "underline",
  },
});
