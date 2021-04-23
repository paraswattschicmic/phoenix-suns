/* eslint-disable prettier/prettier */
import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import EditIcon from 'react-native-vector-icons/FontAwesome5';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import {
  CustomButton,
  CustomDropDown,
  CustomListBox,
  CustomProfileImagePicker,
  ScreenHOC,
} from '../../../../../components';
import {
  JOIN_BUTTON_COLOR,
  PARTIES_TAB_COLOR,
  STATUS_BAR_PRIMARY_COLOR,
  TEXT_CONST,
  LEGAL_SCREEN,
  COMMUNITY_SCREEN,
  SUPPORT_SCREEN,
} from '../../../../../shared';
import {
  TYPE_IMAGE_JPEG,
  JPEG_FILE_EXTENSION,
} from '../../../../../shared/constants/sendbird';
import { _checkValidPhoneNumber, _scaleText } from '../../../../../shared/services/utility';
import { setSpText, scaleSizeH, scaleSizeW } from '../../../../../shared/services/screenStyle';
import {
  sbRegisterPushToken,
  sbUnRegisterPushToken
} from '../../../../../redux/actions/sendbirdActions/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import messaging from '@react-native-firebase/messaging';
import { update } from 'lodash';
const Profile = ({
  /**
   * props
   */
  updateProfileRequest,
  logoutRequest = () => { },
  navigation,
  netConnected,
  uploadFileRequest,
  getProfileRequest = () => { },
  authToken,
  getTimezoneRequest,
  userData,
  facebookData,
  appleData,
}) => {
  /**
   * State
   */
  const [pictureUrl, updatePictureUrl] = useState();
  const [editMode, updateEditMode] = useState(false);
  const [notification, updateNotification] = useState(false);
  const [timezones, updateTimezones] = useState([]);
  const [timezone, updateTimezone] = useState('');
  const [firstName, updateFirstName] = useState('');
  const [hometown, updateHometown] = useState('');
  const [university, updateUniversity] = useState('');
  const [phone, updatePhoneNumber] = useState();
  const [countryCode, updateCountryCode] = useState({ code: '1', country: 'US' });
  const [editIcon, updateEditIcon] = useState(true);
  const [age, updateAge] = useState();
  const [instagramUserName, updateInstagramUserName] = useState('');
  const [twitterUserName, updateTwitterUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, updateErrors] = useState({ firstName: '', age: '' });
  const [isLoading, setLoading] = useState({
    profileLoaded: false,
    imageLoaded: false,
    isFirstRender: true,
  });
  let { ACCOUNT_INFO, SETTINGS, LEGAL_INFO, COMMUNITY_INFO, APP_SETTING } = TEXT_CONST;

  /**
   * Use Effect
   * Dependencies: No Dependency
   * get Profile & get Time zones
   */
  useEffect(() => {
    getProfile();
    getTimeZones();
    updateEditStates();
  }, []);

  /**
   * Get Time Zones
   */
  const getTimeZones = () => {
    getTimezoneRequest({
      netConnected,
      success: (timezones = []) => {
        /**
         * set state timezones
         */
        updateTimezones([...timezones]);
      },
      fail: (error = '') => {
        Toast.show(error, 3);
      },
    });
  };

  /**
   * Get Profile
   * 1.) Get Profile
   * 2.) Update Picture Url
   */
  const getProfile = () => {
    getProfileRequest({
      netConnected,
      headers: {
        Authorization: authToken,
      },
      success: (data) => {
        /**
         * set state picture url
         */
        /**
         * TODO: Wrong Implementation ( you can't use user data from redux here because you just get the data and using it but redux might take some time to update store because it updates after a complete thread so you should set data in redux but here use data which we are getting in success (if not getting data here then paas data from saga ))  -- Ankit Minhas
         */
        console.log('printConsole',data)
        updatePictureUrl(userData.pictureUrl);
        setFirstName();
        setLoading({ ...isLoading, profileLoaded: true });

        if (userData.pictureUrl && userData.pictureUrl == '') {
          console.log('printConsole',"entered")
          setLoading({
            ...isLoading,
            profileLoaded: true,
            imageLoaded: true,
            isFirstRender: false,
          });
        }
      },
      fail: (error) => {
        Toast.show(error, 3);
      },
    });
  };
  /**
   * Logout
   */
  const onLogout = () => {
    let { SIGN_OUT, LogoutContent, CANCEL, CONFIRM } = TEXT_CONST;
    Alert.alert(SIGN_OUT, LogoutContent, [
      {
        text: CANCEL,
        onPress: () => { },
      },
      {
        text: CONFIRM,
        onPress: () => {
          sbUnRegisterPushToken()
            .then(() => {
              // console.log('registration')
              logoutRequest()
            })
            .catch((err) => {
              logoutRequest()
              // console.log('connect error tokenn ', err)
            });
        }
      },
    ]);
  };
  /**
   * Border Line
   * @param {*} param0
   */
  const Border_Line = ({ lineStyle = {} }) => {
    return (
      <View
        style={{
          height: 0.4,
          backgroundColor: 'black',
          opacity: 0.3,
          ...lineStyle,
        }}></View>
    );
  };
  /**
   * Upload File Path
   * @param {*} pictureUrl
   */
  const uploadFilePath = (pictureUrl) => {
    NetInfo.fetch().then(({ isConnected }) => {
      uploadFileRequest({
        payload: {
          name: Date.now() + JPEG_FILE_EXTENSION,
          type: TYPE_IMAGE_JPEG,
          uri: pictureUrl,
        },
        netConnected: isConnected,
        success: (pictureUrl) => {
          updateProfileRequest({
            netConnected,
            payload: {
              pictureUrl,
            },
            fail: (error) => {
              Toast.show(error, 3);
            },
            success: (data) => updatePictureUrl(pictureUrl),
          });
        },
        fail: (error) => {
          Toast.show(error, 3);
        },
      });
    });
  };
  /**
   * Update Edit States
   */
  const updateEditStates = () => {
    updatePictureUrl(userData.pictureUrl);
    updateTimeZoneId();
    updateAge(userData.age);
    updateNotification(userData.notification ? userData.notification : false);
    updateFirstName(userData.firstName);
    updateUniversity(userData.university);
    updateInstagramUserName(userData.instagramUserName);
    updateTwitterUserName(userData.twitterUserName);
    updateUniversity(userData.university);
    updateHometown(userData.hometown);
    updatePhoneNumber(userData.phone);
    updateCountryCode({ code: userData.countryCode + '' });
    setFirstName();
    getAllCountries().then((data) => {
      let country = data.filter(item => item.callingCode && item.callingCode.length && (item.callingCode[0] == userData.countryCode || ('+' + item.callingCode[0]) == userData.countryCode))
      if (country.length) {
        country = country[0]
        updateCountryCode({ code: country.callingCode && country.callingCode.length && country.callingCode[0] ? country.callingCode[0] : '', country: country.cca2 })
      }
    })

  };
  /**
   * Set First Name
   */
  const setFirstName = () => {
    let name = userData.firstName ? userData.firstName.split(' ') : '';
    name =
      name && name[0] && name[0].length == 1 ? userData.firstName : name[0];
    updateFirstName(name);
  };
  /**
   * update time zone id
   */
  const updateTimeZoneId = () => {
    label = 'label';
    if (userData && userData.timezone && userData.timezone.label) {
      let val = timezones.findIndex(
        (item) => item[label] == userData.timezone.label,
      );
      val = val >= 0 ? timezones[val]._id : '';
      updateTimezone(val);
    }
  };
  /**
   * Action on edit click
   */
  const onEditIconClick = () => {
    updateEditMode(true);
    updateEditIcon(false);
    updateEditStates();
  };
  /**
   * Action on Done Click
   */

  const onDoneClick = () => {
    /**
     * TODO: No Error Messages for University right now
     */
    if (!(errors.age || errors.phone || errors.hometown || errors.firstName)) {
      updateHometown(!!hometown ? hometown.trim() : '');
      updatePhoneNumber(!!phone ? phone.trim() : '');
      let payload = {
        firstName,
        age,
        hometown,
        phone,
        countryCode: '+' + countryCode.code,
        university,
        timezone,
        notification,
        instagramUserName,
        twitterUserName
      };
      console.log(JSON.stringify(payload));
      updateProfileRequest({
        fail: (error) => {

          // updateEditMode(false);
          // updateEditIcon(true);
          console.log('errr', error);
          Toast.show(error, 3);
        },
        netConnected,
        payload,
        success: (data) => {
          if (notification) {
            sbRegisterPushToken()
              .then(() => {
                // console.log('registration')
              })
              .catch((err) => {
                // console.log('connect error tokenn ', err)
              });
          }
          else {
            sbUnRegisterPushToken()
              .then(() => {
                console.log('un registration')
                //logoutRequest()
              })
              .catch((err) => {
                //logoutRequest()
                // console.log('connect error tokenn ', err)
              });
          }
          updateEditMode(false);
          updateEditIcon(true);
        },
      });
    } else {
      console.log('not done');
    }
  };

  /**
   * Action on Cancel click
   */
  const onCancelClick = () => {
    updateEditMode(false);
    updateEditIcon(true);
    setFirstName();
    updateErrors({});
  };
  /**
   * Action on ImageLoaded
   */
  const onImageLoaded = () => {
    setLoading({ ...isLoading, imageLoaded: true, isFirstRender: false });
  };
  /**
   * Action on ImageStartLoading
   */
  const onStartImageLoading = () => {
    setLoading({ ...isLoading, imageLoaded: false });
  };

  /**
   * handle Change
   * @param {*} text
   * @param {*} label
   */
  const handleChange = (text, label, code) => {
    switch (label) {
      case FORM_FIELD_CONST.FIRST_NAME:
        text = text.trim();
        if (!text) {
          updateFirstName(text);
          updateErrors({
            ...errors,
            firstName: ERROR_TEXTS.FIRST_NAME_EMPTY_ERROR,
          });
          return;
        }
        if (!/^(\s?\.?[a-zA-Z]+)+$/.test(text)) {
          updateFirstName(text);
          updateErrors({
            ...errors,
            firstName: ERROR_TEXTS.FIRST_NAME_ALPHABETS_ERROR,
          });
          return;
        }
        updateErrors({ ...errors, firstName: '' });
        updateFirstName(text);
        return;
      case FORM_FIELD_CONST.HOME_TOWN:
        if (!/^[a-zA-Z ]*$/.test(text)) {
          updateErrors({
            ...errors,
            hometown: ERROR_TEXTS.HOME_TOWN_ONLY_ALPHABETS_ERROR,
          });
          updateHometown(text);
          return;
        }
        updateErrors({ ...errors, hometown: '' });
        updateHometown(text);
        return;
      case FORM_FIELD_CONST.UNIVERSITY:
        if (!/^[a-zA-Z ]*$/.test(text)) {
          // updateErrors({ ...errors, hometown: ERROR_TEXTS.HOME_TOWN_ONLY_ALPHABETS_ERROR })
          updateUniversity(text);
          return;
        }
        //updateErrors({ ...errors, hometown: '' })
        updateUniversity(text);
        return;
      case FORM_FIELD_CONST.INSTAGRAM_USERNAME:
        updateInstagramUserName(text);
        return;
      case FORM_FIELD_CONST.TWITTER_USERNAME:
        updateTwitterUserName(text);
        return;
      case FORM_FIELD_CONST.AGE:
        text = text.trim();
        let reg = /^[0-9]*$/;
        if (!text && userData.age != text) {
          updateErrors({ ...errors, age: ERROR_TEXTS.AGE_EMPTY_ERROR });
          updateAge(text);
          return;
        }
        if (!reg.test(text) || text == 0) {
          updateErrors({ ...errors, age: ERROR_TEXTS.AGE_INCORRECT_ERROR });
          updateAge(text);
          return;
        }
        if (!(text >= 15)) {
          updateErrors({ ...errors, age: ERROR_TEXTS.AGE_MUST_ABOVE_15_ERROR });
          updateAge(text);
          return;
        }
        updateErrors({ ...errors, age: '' });
        updateAge(text);
        return;
      case FORM_FIELD_CONST.PHONE:
        text = text.trim();
        // let regex = /^[0-9]*$/;
        if (!_checkValidPhoneNumber(code.country, text)) {
          updateErrors({
            ...errors,
            phone: ERROR_TEXTS.PHONE_NUMBER_INVALID_ERROR,
          });
          updatePhoneNumber(text);
          return;
        }
        if (!(text.length >= 8 && text.length <= 15)) {
          updateErrors({
            ...errors,
            phone: ERROR_TEXTS.PHONE_NUMBER_INVALID_ERROR,
          });
          updatePhoneNumber(text);
          return;
        }
        updateErrors({ ...errors, phone: '' });
        updatePhoneNumber(text);
        return;
      default:
        return;
    }
  };

  /**
   * Render
   */
  return (
    <ScreenHOC>
      <Text style={styles.heading}>{SETTINGS}</Text>
      {isLoading && isLoading.imageLoaded == false && isLoading.isFirstRender && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}>
          <ActivityIndicator
            style={{ flex: 1 }}
            color="gray"
            size="large"
            animating={true}></ActivityIndicator>
        </View>
      )}
      <View
        style={{
          height:
            isLoading &&
              isLoading.imageLoaded == false &&
              isLoading.isFirstRender
              ? 0
              : 'auto',
          width:
            isLoading &&
              isLoading.imageLoaded == false &&
              isLoading.isFirstRender
              ? 0
              : 'auto',
        }}>
        <KeyboardAwareScrollView
          // contentContainerStyle={{
          //     marginTop: _scaleText(-40).fontSize,
          //   //paddingBottom: _scaleText(37).fontSize,
          // }}
          // extraHeight={-100}
          extraScrollHeight={100}
          //scrollToOverflowEnabled={true}
          viewIsInsideTabBar={true}
          contentContainerStyle={{ paddingBottom: _scaleText(Platform.OS == 'ios' ? 0 : 50).fontSize }}
          style={{
            opacity: !!modalVisible ? 0.1 : 1,
          }}>
          <View
            //behavior={Platform.OS === 'ios' ? 'padding' : ''}
            // keyboardVerticalOffset={
            //   Platform.OS === 'ios' ? _scaleText(-15).fontSize : 0
            // }
            style={{
              flex: 1,
              opacity:
                isLoading &&
                  isLoading.imageLoaded == false &&
                  isLoading.isFirstRender
                  ? 0
                  : 1,
            }}>
            {!!editIcon ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  height: _scaleText(40).fontSize,
                }}>
                <TouchableOpacity onPress={() => onEditIconClick()}>
                  <EditIcon
                    name={ICONS_NAMES.ICON_EDIT}
                    size={25}
                    style={styles.Icon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: _scaleText(40).fontSize,
                  }}>
                  <TouchableOpacity onPress={() => onCancelClick()}>
                    <Icon
                      name={ICONS_NAMES.ICON_CANCEL}
                      size={30}
                      style={styles.CancelIcon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onDoneClick()}>
                    <Icon
                      name={ICONS_NAMES.ICON_DONE}
                      size={30}
                      style={styles.Icon}
                    />
                  </TouchableOpacity>
                </View>
              )}

            <View>
              {isLoading && isLoading.profileLoaded && (
                <CustomProfileImagePicker
                  onChange={({ path }) => uploadFilePath(path)}
                  src={pictureUrl ? pictureUrl : ''}
                  onImageLoadFinished={() => {
                    onImageLoaded();
                  }}
                  onImageLoadStart={() => {
                    onStartImageLoading();
                  }}
                />
              )}
            </View>
            <Text style={styles.title}>{ACCOUNT_INFO}</Text>
            <Border_Line lineStyle={{ opacity: 0.1 }} />

            <CustomListBox
              label={TITLE_LABELS.FIRST_NAME}
              value={!!editMode ? firstName : firstName ? firstName : 'NA'}
              editMode={editMode}
              onChange={(text) =>
                handleChange(text, FORM_FIELD_CONST.FIRST_NAME)
              }
              error={!!errors.firstName ? errors.firstName : null}
            />

            <CustomListBox
              label={TITLE_LABELS.EMAIL}
              value={userData && userData.email ? userData.email : 'NA'}
            />
            <CustomListBox
              label={TITLE_LABELS.PHONE_NUMBER}
              value={
                !!editMode
                  ? phone
                  : userData && userData.phone
                    ? userData.phone
                    : 'NA'
              }
              editMode={editMode}
              customUI={editMode && <CountryPicker
                withFlag
                withFilter
                countryCode={countryCode.country || 'US'}
                onSelect={(country) => {
                  if (country.callingCode && country.callingCode.length && country.callingCode[0]) {
                    updateCountryCode({ code: country.callingCode && country.callingCode.length && country.callingCode[0] ? country.callingCode[0] : '', country: country.cca2 });
                    handleChange(phone, FORM_FIELD_CONST.PHONE, { code: country.callingCode && country.callingCode.length && country.callingCode[0] ? country.callingCode[0] : '', country: country.cca2 })
                    // this.props.onCountryChange({ code: country.callingCode[0], country: country.cca2 })
                    // setCountryCode({ code: country.callingCode && country.callingCode.length && country.callingCode[0] ? country.callingCode[0] : '', country: country.cca2 })
                  }
                }}
              />}
              keyboardType="phone-pad"
              onChange={(text) => handleChange(text, FORM_FIELD_CONST.PHONE, countryCode)}
              error={!!errors.phone ? errors.phone : null}
            />
            {/* <CustomListBox
                        label={TITLE_LABELS.HOME_TOWN}
                        value={!!editMode ? hometown : userData && userData.hometown ? userData.hometown : 'NA'}
                        editMode={editMode}
                        onChange={(text) => handleChange(text, FORM_FIELD_CONST.HOME_TOWN)}
                        error={!!errors.hometown ? errors.hometown : null}
                    />
                    <CustomListBox
                        label={TITLE_LABELS.UNIVERSITY}
                        value={!!editMode ? university : userData && userData.university ? userData.university : 'NA'}
                        editMode={editMode}
                        onChange={(text) => handleChange(text, FORM_FIELD_CONST.UNIVERSITY)}
                    //error={!!errors.hometown ? errors.hometown : null}
                    /> */}

            {/* {!!modalVisible ? <TimezoneModal /> : null} */}

            <CustomListBox
              label={TITLE_LABELS.AGE}
              value={
                !!editMode
                  ? age
                    ? age.toString()
                    : ''
                  : userData && userData.age
                    ? userData.age
                    : 'NA'
              }
              editMode={editMode}
              onChange={(text) => handleChange(text, FORM_FIELD_CONST.AGE)}
              keyboardType="phone-pad"
              maxStringLength={2}
              error={!!errors.age ? errors.age : null}
            />
            <CustomListBox
              label={TITLE_LABELS.INSTAGRAM}
              linkedUrl={userData.instagramUserName ? `${TEXT_CONST.INSTAGRAM_ROUTE_URL}${userData.instagramUserName}` : ''}
              value={
                !!editMode
                  ? instagramUserName
                    ? instagramUserName.toString()
                    : ''
                  : userData && userData.instagramUserName
                    ? userData.instagramUserName
                    : 'NA'
              }
              placeholder={'username'}
              editMode={editMode}
              onChange={(text) => handleChange(text, FORM_FIELD_CONST.INSTAGRAM_USERNAME)}
            />
            <CustomListBox
              label={TITLE_LABELS.TWITTER}
              linkedUrl={userData.twitterUserName ? `${TEXT_CONST.TWITTER_ROUTE_URL}${userData.twitterUserName}` : ''}
              value={
                !!editMode
                  ? twitterUserName
                    ? twitterUserName.toString()
                    : ''
                  : userData && userData.twitterUserName
                    ? userData.twitterUserName
                    : 'NA'
              }
              placeholder={'username'}
              editMode={editMode}
              onChange={(text) => handleChange(text, FORM_FIELD_CONST.TWITTER_USERNAME)}
            />
            <Text style={styles.title}>{APP_SETTING}</Text>
            <Border_Line lineStyle={{ opacity: 0.1 }} />
            <CustomListBox
              label={TITLE_LABELS.TIME_ZONE}
              timezones={timezones}
              timezone={timezone}
              dropdown={editMode}
              onChange={(index, item) => updateTimezone(item._id)}
              ontoggleModal={() => setModalVisible(!modalVisible)}
              placeholder={'username'}
              value={
                userData && userData.timezone && userData.timezone.label
                  ? userData.timezone.label
                  : 'NA'
              }
            />
            {!editMode && <CustomListBox editMode={true} label={TITLE_LABELS.NOTIFICATIONS}
              active={notification}
              subscription={true} onChange={(val) => {
                updateNotification(val);

                let payload = {
                  notification: val
                };
                updateProfileRequest({
                  fail: (error) => {
                    console.log('errr', error);
                    Toast.show(error, 3);
                    updateNotification(userData.notification ? userData.notification : false)
                  },
                  netConnected,
                  payload,
                  success: (data) => {
                    if (val) {
                      sbRegisterPushToken()
                        .then(() => {
                          console.log('registration')
                        })
                        .catch((err) => {
                          // console.log('connect error tokenn ', err)
                        });
                    }
                    else {
                      sbUnRegisterPushToken()
                        .then(() => {
                          console.log('un registration')
                          //logoutRequest()
                        })
                        .catch((err) => {
                          //logoutRequest()
                          // console.log('connect error tokenn ', err)
                        });
                    }
                  },
                })
              }} />}
            {appleData || facebookData
              ?
              <CustomListBox
                label={
                  appleData
                    ? TITLE_LABELS.APPLE_TITLE
                    : TITLE_LABELS.FACEBOOK_TITLE
                }
                sublabel={TITLE_LABELS.FACEBOOK_SUBTITLE}
              //value={facebookData ? facebookData : appleData ? appleData : 'NA'}
              />
              :
              null
            }
            <Text style={styles.title}>{LEGAL_INFO}</Text>
            <Border_Line lineStyle={{ opacity: 0.1 }} />
            <CustomButton
              label={TITLE_LABELS.LEGAL_TITLE}
              onPress={() => navigation.navigate(LEGAL_SCREEN)}
              labelStyle={{
                // color: '#83899f',
                color: 'black',
                // fontWeight: '500',
                fontSize: setSpText(16),
                fontFamily: 'SFProText-Regular',
                textAlign: 'left'
              }}
              containerStyle={{
                backgroundColor: 'white',
                paddingLeft: scaleSizeW(15),
                height: scaleSizeH(60),
              }}
            />
            <Text style={styles.title}>{COMMUNITY_INFO}</Text>
            <Border_Line lineStyle={{ opacity: 0.1 }} />
            <CustomButton
              label={TITLE_LABELS.COMMUNITY_TITLE}
              onPress={() => navigation.navigate(COMMUNITY_SCREEN)}
              labelStyle={{
                // color: '#83899f',
                color: 'black',
                // fontWeight: '500',
                fontSize: setSpText(16),
                fontFamily: 'SFProText-Regular',
                textAlign: 'left'
              }}
              containerStyle={{
                backgroundColor: 'white',
                paddingLeft: scaleSizeW(15),
                height: scaleSizeH(60),
              }}
            />
            <Text style={{ height: scaleSizeW(5) }}>{' '}</Text>
            <Border_Line lineStyle={{ opacity: 0.1 }} />
            <CustomButton
              label={TITLE_LABELS.SUPPORT}
              onPress={() => navigation.navigate(SUPPORT_SCREEN)}
              labelStyle={{
                // color: '#83899f',
                color: 'black',
                // fontWeight: '500',
                fontSize: setSpText(16),
                fontFamily: 'SFProText-Regular',
                textAlign: 'left'
              }}
              containerStyle={{
                backgroundColor: 'white',
                paddingLeft: scaleSizeW(15),
                height: scaleSizeH(60),
              }}
            />
            {/* <Border_Line lineStyle={{opacity: 0.5}} /> */}
            <View style={{ marginTop: _scaleText(10).fontSize }}>
              <CustomButton
                label={TEXT_CONST.SIGN_OUT}
                onPress={onLogout}
                labelStyle={{
                  color: '#83899f',
                  fontWeight: '500',
                  fontSize: _scaleText(15).fontSize,
                  fontFamily: 'SFProText-Regular',
                }}
                containerStyle={{
                  backgroundColor: 'white',
                  borderRadius: 0,
                  borderWidth: 0.9,
                  borderColor: 'gray',
                  paddingTop: _scaleText(20).fontSize,
                  paddingBottom: _scaleText(20).fontSize,
                  height: _scaleText(60).fontSize,
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ScreenHOC>
  );
};
/**
 * Styles
 */
const styles = StyleSheet.create({
  title: {
    color: JOIN_BUTTON_COLOR,
    fontSize: _scaleText(23).fontSize,
    fontWeight: '700',
    marginLeft: _scaleText(15).fontSize,
    marginRight: _scaleText(15).fontSize,
    marginTop: _scaleText(20).fontSize,
  },
  heading: {
    paddingHorizontal: _scaleText(10).fontSize,
    paddingVertical: _scaleText(5).fontSize,
    backgroundColor: PARTIES_TAB_COLOR,
    color: STATUS_BAR_PRIMARY_COLOR,
    fontWeight: '800',
    fontSize: _scaleText(18).fontSize,
    textAlign: 'center',
  },
  Icon: {
    textAlign: 'right',
    marginRight: _scaleText(12).fontSize,
    marginTop: _scaleText(12).fontSize,
    //position: 'absolute'
  },
  CancelIcon: {
    marginLeft: _scaleText(12).fontSize,
    marginTop: _scaleText(12).fontSize,
    // position: 'absolute'
  },
  modalCancelIcon: {
    alignSelf: 'flex-end',
    marginRight: _scaleText(14).fontSize,
  },
  modalView: {
    backgroundColor: 'white',
    marginTop: _scaleText(400).fontSize,
    marginLeft: _scaleText(16).fontSize,
  },
  BlurDoneIcon: {
    textAlign: 'right',
    marginRight: _scaleText(12).fontSize,
    marginTop: _scaleText(12).fontSize,
    color: 'gray',
  },
});
/**
 * Screen text constants
 */
const FORM_FIELD_CONST = {
  FIRST_NAME: 'FirstName',
  HOME_TOWN: 'HomeTown',
  UNIVERSITY: 'University',
  AGE: 'Age',
  PHONE: 'phone',
  INSTAGRAM_USERNAME: 'instagramUserName',
  TWITTER_USERNAME: 'twitterUserName',
};
const ERROR_TEXTS = {
  FIRST_NAME_EMPTY_ERROR: 'First name cannot be empty',
  FIRST_NAME_ALPHABETS_ERROR: 'First name only allow alphabets',
  HOME_TOWN_ONLY_ALPHABETS_ERROR: 'Only alphabets allowed',
  AGE_EMPTY_ERROR: 'Age cannot be empty',
  AGE_INCORRECT_ERROR: 'Please enter correct age',
  AGE_MUST_ABOVE_15_ERROR: 'Age must be above 15',
  PHONE_NUMBER_INVALID_ERROR: 'Please enter a valid phone number',
};
const ICONS_NAMES = {
  ICON_EDIT: 'edit',
  ICON_DONE: 'check-circle',
  ICON_CANCEL: 'times-circle',
};
const TITLE_LABELS = {
  FIRST_NAME: 'First Name (Displayed in Chat)',
  EMAIL: 'Email',
  PHONE_NUMBER: 'Phone Number',
  HOME_TOWN: 'Home Town',
  UNIVERSITY: 'University',
  TIME_ZONE: 'Time Zone',
  NOTIFICATIONS: 'Notifications',
  AGE: 'Age',
  FACEBOOK_TITLE: 'Facebook',
  APPLE_TITLE: 'Apple',
  FACEBOOK_SUBTITLE: 'Connected',
  LEGAL_TITLE: 'Terms of Service and Privacy Policy',
  COMMUNITY_TITLE: 'Community Guidelines',
  SUPPORT: 'Support',
  INSTAGRAM: 'Instagram',
  TWITTER: 'Twitter',
};
export default Profile;
