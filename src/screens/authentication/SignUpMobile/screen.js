/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import { APP_MESSAGES, _checkValidPhoneNumber } from '../../../shared'
import { CustomButton, ScreenHOC } from '../../../components';
import { CommunityGuidelinesContent } from '../../../components/molecules/CommunityGuidelinesContent';
import { COLLYDE_LIGHT_GRAY_COLOR, COMPLETE_PROFILE_SCREEN, DASHBOARD_BOTTOM_TAB, JOIN_BUTTON_COLOR, LINE_COLOR, TEXT_CONST, _scaleText } from '../../../shared';
import { scaleSizeH, scaleSizeW, setSpText } from '../../../shared/services/screenStyle';
import CountryPicker from 'react-native-country-picker-modal';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import { EnterMobileNumber } from '../../../components/molecules/EnterMobileNumber';
import { EnterOTP } from '../../../components/molecules/EnterOTP';
import { EnterEmail } from '../../../components/molecules/EnterEmail';
import Toast from 'react-native-simple-toast';



const eDisplayMode = {
    EnterMobile: 'EnterMobile',
    VerifyMobile: 'VerifyMobile',
    EnterEmail: 'EnterEmail',
}

const SignUpMobile = ({
    /**
     * Props
     */
    navigation,
    netConnected,
    phoneLoginRequest,
    updateProfileRequest,
    verifyOTPLoginRequest,
    route: { params = {} },
}) => {

    const [countryCode, setCountryCode] = useState({ code: '1', country: 'US' });
    const [mobileNumber, setMobileNumber] = useState({ value: '', error: '' });
    const [verificationCode, setVerificationCode] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [firstName, setFirstName] = useState('');
    const [screenMode, setScreenMode] = useState(eDisplayMode.EnterMobile);
    const [resendCodeText, setResendCodeText] = useState('');
    const [resndCodeCount, setResndCodeCount] = useState(0);
    const [submitIsClicked, setSubmitIsClicked] = useState(false);

    const _onChangeText = (val = '') => {
        let isNum = /^\d+$/.test(val.replace(/[^A-Z0-9]/ig, ""));

        if (isNum) {
            let mobileNumberC = mobileNumber;
            mobileNumberC.value = val
            setMobileNumber(mobileNumberC)

        }
    }
    const _onCodeText = (val = '') => {
        let isNum = /^\d+$/.test(val.replace(/[^A-Z0-9]/ig, ""));

        if (isNum) {
            let verificationCodeC = verificationCode;
            verificationCodeC.value = val
            setVerificationCode(verificationCodeC);
        }
    }
    const _onEmailChanged = (val = '') => {
        let emailC = email;
        emailC.value = val
        setEmail(emailC);
    }
    const _onSubmitEmail = () => {
        setSubmitIsClicked(true)

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email.value) === false) {
            let emailC = Object.assign({}, email);
            emailC.error = 'Please Enter a valid Email Id.'
            setEmail(emailC);
            setSubmitIsClicked(false)
        }
        else {
            updateProfileRequest({
                fail: (error) => Toast.show(error, 3),
                netConnected,
                payload: { email: email.value },
                success: () => {
                    let payload = {
                        firstName: firstName,
                        pictureUrl: '',
                        email: email.value,
                    }
                    navigation.replace(
                        COMPLETE_PROFILE_SCREEN,
                        { ...payload },
                    );
                },
            });
            setSubmitIsClicked(false);

        }
        // if (isEmailValid(email.value)) {
        //     let payload = {
        //         firstName: firstName,
        //         pictureUrl: '',
        //         email: email.value,
        //     }
        //     navigation.replace(
        //         COMPLETE_PROFILE_SCREEN,
        //         { ...payload },
        //     );
        // }
        // else {
        //     let emailC = Object.assign({}, email);
        //     emailC.error = 'Please Enter a valid Email Id.'
        //     setEmail(emailC);
        // }

    }

    const _onRequestOTP = () => {
        var regex = /^[0]?[789]\d{9}$/;
        //setScreenMode(eDisplayMode.VerifyMobile)
        if (resndCodeCount >= 3) {
            Toast.show(APP_MESSAGES.TOO_MANY_ATTEMPTS, 3);
            navigation.goBack();
            // setScreenMode(eDisplayMode.EnterMobile);
            // setResndCodeCount(0);
        }
        else {
            // let mobileWithCountry = `${countryCode.code}${mobileNumber.value}`
            if (_checkValidPhoneNumber(countryCode.country, mobileNumber.value)) {
                console.log('1')
                let mobileNumberC = Object.assign({}, mobileNumber);
                mobileNumberC.error = ''
                setMobileNumber(mobileNumberC);

                let payload = {
                    countryCode: `+${countryCode.code}`,
                    phone: mobileNumber.value
                }

                phoneLoginRequest({
                    payload,
                    netConnected,
                    success: (message) => {
                        Toast.show(message, 3);
                        setResndCodeCount(val => val + 1);
                        setResendCodeText(TEXT_CONST.CODE_SENT);
                        setTimeout(() => {
                            setResendCodeText(TEXT_CONST.RESEND_CODE);
                        }, 30000);
                        setScreenMode(eDisplayMode.VerifyMobile)
                    },
                    fail: (error) => {
                        Toast.show(error, 3)
                    },
                })

                // Valid international phone number
            } else {
                let mobileNumberC = Object.assign({}, mobileNumber);
                mobileNumberC.error = 'Please enter a valid number'
                setMobileNumber(mobileNumberC)
                // Invalid international phone number

            }
        }
    }
    const _onSubmitCode = () => {
        if (verificationCode.value && verificationCode.value.length && verificationCode.value.length == 4) {
            let verificationCodeC = Object.assign({}, verificationCode);
            verificationCodeC.error = ''
            setVerificationCode(verificationCodeC);

            let payload = {
                otp: verificationCode.value,
                countryCode: `+${countryCode.code}`,
                phone: mobileNumber.value
            }
            verifyOTPLoginRequest({
                payload,
                netConnected,
                success: (isNewUser, firstName, email) => {
                    if (isNewUser) {
                        if (email) {
                            let payload = {
                                firstName: firstName,
                                pictureUrl: '',
                                email: email,
                            }
                            navigation.replace(
                                COMPLETE_PROFILE_SCREEN,
                                { ...payload },
                            );
                        } else {
                            setScreenMode(eDisplayMode.EnterEmail);
                        }
                        setFirstName(firstName)
                    }
                    else {
                        navigation.replace(
                            DASHBOARD_BOTTOM_TAB,
                        );
                    }
                    // Toast.show(message, 3);
                    // setScreenMode(eDisplayMode.EnterEmail)
                },
                fail: (error) => {
                    let verificationCodeC = Object.assign({}, verificationCode);
                    verificationCodeC.error = 'Please enter a valid code.'
                    setVerificationCode(verificationCodeC);
                    Toast.show(error, 3)
                },
            })

            //     // Valid international phone number
            // } else {
            //     console.log('2', JSON.stringify(mobileWithCountry), isMobilePhone(mobileWithCountry, 'any', { strictMode: false }))

            //     let mobileNumberC = Object.assign({}, mobileNumber);
            //     mobileNumberC.error = 'Please enter a valid number'
            //     setMobileNumber(mobileNumberC)
            //     // Invalid international phone number

            // }
        }
        else {
            let verificationCodeC = Object.assign({}, verificationCode);
            verificationCodeC.error = 'Please enter a four digit code'
            setVerificationCode(verificationCodeC);
        }
    }


    useEffect(() => {
    }, []);
    return (
      <ScreenHOC>
        <TouchableOpacity
          onPress={() => {
            if (screenMode == eDisplayMode.VerifyMobile) {
              setScreenMode(eDisplayMode.EnterMobile);
            } else {
              navigation.goBack();
            }
          }}
          style={{
            width: scaleSizeW(80),
            height: scaleSizeW(80),
            justifyContent: "center",
            position: "absolute",
            marginTop: -scaleSizeH(75),
          }}
        >
          {/* <Icon
            name={ICONS_NAMES.ICON_BACK}
            color={JOIN_BUTTON_COLOR}
            style={{
              alignSelf: "flex-start",
              padding: 0,
              marginLeft: scaleSizeW(15),
            }}
            size={setSpText(50)}
          /> */}
          <Image
            resizeMode="contain"
            style={{
              alignSelf: "flex-start",
              padding: 0,
              marginLeft: scaleSizeW(15),
            }}
            source={require("../../../assets/icons/back_button.png")}
          ></Image>
        </TouchableOpacity>
        <SafeAreaView style={styles.safeArea}>
          {screenMode == eDisplayMode.EnterMobile ? (
            <EnterMobileNumber
              mobileNumber={mobileNumber}
              countryCode={countryCode}
              onCountryChange={setCountryCode}
              onChangeNumber={_onChangeText}
              onSubmit={_onRequestOTP}
            ></EnterMobileNumber>
          ) : screenMode == eDisplayMode.VerifyMobile ? (
            <EnterOTP
              verificationCode={verificationCode}
              onCodeChanged={_onCodeText}
              onSubmit={_onSubmitCode}
              resendCodeText={resendCodeText}
              onResend={_onRequestOTP}
            ></EnterOTP>
          ) : screenMode == eDisplayMode.EnterEmail ? (
            <EnterEmail
              email={email}
              onEmailChange={_onEmailChanged}
              onSubmit={_onSubmitEmail}
              submitIsClicked={submitIsClicked}
            ></EnterEmail>
          ) : null}
        </SafeAreaView>
      </ScreenHOC>
    );
};

const communityObj = {
    title: 'Community Guidelines',
};




const ICONS_NAMES = {
    ICON_BACK: 'chevron-left',
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: _scaleText(20).fontSize,
        marginVertical: _scaleText(15).fontSize,
        paddingBottom: 0,
        flex: 1,
    },
    title: {
        color: JOIN_BUTTON_COLOR,
        fontWeight: 'bold',
    },
    subTitle: {
        color: 'gray',
        fontWeight: 'bold',
        marginTop: _scaleText(15).fontSize
    },
    input: {
        // marginBottom: _scaleText(10).fontSize,
        //borderBottomWidth: 1.65,
        //borderColor: LINE_COLOR,
        padding: _scaleText(12).fontSize,
        maxWidth: '95%',
        fontSize: _scaleText(23).fontSize
    },

});

export default SignUpMobile;

