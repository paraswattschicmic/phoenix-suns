/* eslint-disable prettier/prettier */
import React, { Component, PureComponent } from 'react';
import { Image, View, ActivityIndicator, Platform, Dimensions, StyleSheet, Text, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import { JOIN_BUTTON_COLOR, TEXT_CONST, _scaleText } from '../../../shared';
import CountryPicker from 'react-native-country-picker-modal';
import { CustomButton } from '../../atoms';
import { StatusBar } from 'react-native';

class EnterMobileNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar animated barStyle={this.state.modalVisible ? 'dark-content' : 'light-content'} />
                <Text style={[styles.title, {
                    fontSize: _scaleText(25).fontSize,
                    fontWeight: '500'
                }]}>{TEXT_CONST.ENTER_MOBILE_TITLE}</Text>
                <Text style={[styles.subTitle, {
                    fontSize: _scaleText(18).fontSize,
                    fontWeight: '500'
                }]}>{TEXT_CONST.ENTER_MOBILE_SUB_TITLE}</Text>

                <View style={{ marginTop: _scaleText(25).fontSize, flexDirection: 'row' }}>
                    <View style={{ borderRadius: _scaleText(5).fontSize, borderWidth: _scaleText(1).fontSize, marginHorizontal: _scaleText(10).fontSize, paddingHorizontal: _scaleText(20).fontSize, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <CountryPicker
                            //visible={}
                            onOpen={() => this.setState({ modalVisible: true })}
                            onClose={() => this.setState({ modalVisible: false })}
                            withFlag
                            withFilter
                            countryCode={this.props.countryCode.country}
                            onSelect={(country) => {
                                if (country.callingCode && country.callingCode.length && country.callingCode[0]) {
                                    this.props.onCountryChange({ code: country.callingCode[0], country: country.cca2 })
                                    // setCountryCode({ code: country.callingCode && country.callingCode.length && country.callingCode[0] ? country.callingCode[0] : '', country: country.cca2 })
                                }
                            }}
                        />
                    </View>
                    <View style={{ borderRadius: _scaleText(5).fontSize, borderWidth: _scaleText(1).fontSize, flex: 1, marginHorizontal: _scaleText(10).fontSize }}>
                        <TextInput
                            autoCapitalize='words'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            onChangeText={this.props.onChangeNumber}
                            style={styles.input}
                            value={this.props.mobileNumber}
                            keyboardType='number-pad'
                        />
                    </View>

                </View>
                <View style={{ height: _scaleText(50).fontSize, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>

                </View>
                <View style={{ height: _scaleText(30).fontSize, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: _scaleText(14).fontSize, opacity: this.props.mobileNumber.error ? 1 : 0, color: '#f54e42', textAlignVertical: 'center' }}>{this.props.mobileNumber.error ? this.props.mobileNumber.error : ''}</Text>
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
        fontSize: _scaleText(23).fontSize
    },

});

export { EnterMobileNumber };
