/* eslint-disable prettier/prettier */
import React, { Component, PureComponent } from 'react';
import { Image, View, ActivityIndicator, Platform, Dimensions, StyleSheet, Text, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import { JOIN_BUTTON_COLOR, TEXT_CONST, _scaleText } from '../../../shared';
import CountryPicker from 'react-native-country-picker-modal';
import { CustomButton } from '../../atoms';

class EnterEmail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, {
                    fontSize: _scaleText(25).fontSize,
                    fontWeight: '500'
                }]}>{TEXT_CONST.ENTER_EMAIL_TITLE}</Text>
                <Text style={[styles.subTitle, {
                    fontSize: _scaleText(18).fontSize,
                    fontWeight: '500'
                }]}>{TEXT_CONST.ENTER_EMAIL_SUB_TITLE}</Text>

                <View style={{ marginTop: _scaleText(25).fontSize, flexDirection: 'row' }}>
                    <View style={{ borderRadius: _scaleText(5).fontSize, borderWidth: _scaleText(1).fontSize, flex: 1, marginHorizontal: _scaleText(10).fontSize }}>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            onChangeText={this.props.onEmailChange}
                            style={styles.input}
                            value={this.props.email}
                        //keyboardType='number-pad'
                        />
                    </View>

                </View>
                <View style={{ height: _scaleText(50).fontSize, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>

                </View>
                <View style={{ height: _scaleText(30).fontSize, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: _scaleText(14).fontSize, opacity: this.props.email.error ? 1 : 0, color: '#f54e42', textAlignVertical: 'center' }}>{this.props.email.error ? this.props.email.error : ''}</Text>
                </View>
                <View style={{ marginTop: _scaleText(25).fontSize }}>
                    <CustomButton
                        label={TEXT_CONST.NEXT}
                        disabled={this.props.submitIsClicked}
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

export { EnterEmail as EnterEmail };
