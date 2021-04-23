/* eslint-disable prettier/prettier */
import React, { Component, PureComponent } from 'react';
import { Image, LayoutAnimation, View, ActivityIndicator, Platform, Dimensions, StyleSheet, Text, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLLYDE_GRAY_BACKGROUND_COLOR, COLLYDE_PRIMARY_BLUE_COLOR, JOIN_BUTTON_COLOR, TEXT_CONST, _scaleText } from '../../../shared';
import CountryPicker from 'react-native-country-picker-modal';
import { CustomButton } from '../../atoms';
import OtpInputs from 'react-native-otp-inputs';
import OTPInputView from '@twotalltotems/react-native-otp-input'

class EnterOTP extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({ show: true })
        }, 600)
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, {
                    fontSize: _scaleText(25).fontSize,
                    fontWeight: '500'
                }]}>{TEXT_CONST.VERIFY_MOBILE_TITLE}</Text>
                <Text style={[styles.subTitle, {
                    fontSize: _scaleText(18).fontSize,
                    fontWeight: '500'
                }]}>{TEXT_CONST.VERIFY_MOBILE_SUB_TITLE}</Text>

                <View style={{ marginTop: _scaleText(25).fontSize, }}>
                    {this.state.show && <View style={{ borderRadius: _scaleText(5).fontSize, alignItems: 'center', borderWidth: _scaleText(1).fontSize, width: '100%' }}>
                        {/* <OtpInputs
                            style={styles.input}
                            placeholder='-'
                            autoFocus

                            handleChange={this.props.onCodeChanged}
                            numberOfInputs={4}
                            inputStyles={{
                                color: COLLYDE_GRAY_BACKGROUND_COLOR,
                                fontSize: _scaleText(25).fontSize,
                                textAlign: "center",
                                paddingHorizontal: _scaleText(7).fontSize,
                            }}
                        /> */}
                        <OTPInputView
                            style={{ width: '50%', height: _scaleText(50).fontSize, }}
                            pinCount={4}
                            onCodeChanged={this.props.onCodeChanged}
                            autoFocusOnLoad
                            placeholderCharacter='-'
                            codeInputFieldStyle={{
                                color: COLLYDE_GRAY_BACKGROUND_COLOR,
                                borderWidth: 0,
                                fontSize: _scaleText(25).fontSize,
                                textAlign: "center",
                                padding: 0,
                            }}
                            placeholderTextColor={'#808080'}
                            codeInputHighlightStyle={{
                                color: COLLYDE_GRAY_BACKGROUND_COLOR,
                                fontSize: _scaleText(25).fontSize,
                                textAlign: "center",
                                padding: 0,
                            }}
                            onCodeFilled={(code => {
                                console.log(`Code is ${code}, you are good to go!`)
                            })}
                        />
                    </View>}

                </View>
                <View style={{ height: _scaleText(50).fontSize, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        onPress={() => {
                            if (this.props.resendCodeText == TEXT_CONST.RESEND_CODE) {
                                this.props.onResend()
                            }
                        }}
                        style={{ fontSize: _scaleText(20).fontSize, color: this.props.resendCodeText == TEXT_CONST.RESEND_CODE ? COLLYDE_PRIMARY_BLUE_COLOR : COLLYDE_GRAY_BACKGROUND_COLOR, textAlignVertical: 'center' }}>{this.props.resendCodeText}</Text>
                </View>
                <View style={{ height: _scaleText(30).fontSize, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: _scaleText(14).fontSize, opacity: this.props.verificationCode.error ? 1 : 0, color: '#f54e42', textAlignVertical: 'center' }}>{this.props.verificationCode.error ? this.props.verificationCode.error : ''}</Text>
                </View>
                <View style={{ marginTop: _scaleText(25).fontSize }}>
                    <CustomButton
                        label={TEXT_CONST.NEXT}
                        labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500' }}
                        containerStyle={{ backgroundColor: JOIN_BUTTON_COLOR, height: _scaleText(45).fontSize, width: '100%', borderRadius: _scaleText(10).fontSize }}
                        onPress={this.props.onSubmit}
                    />
                </View>

            </View>
        );
    }
}

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
        flexDirection: 'row',
        alignSelf: 'center',
    },

});

export { EnterOTP };
