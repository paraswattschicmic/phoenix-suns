import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { _scaleText, JOIN_BUTTON_COLOR } from '../../../shared';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpButton = ({
    activeOpacity = 0.7,
    containerStyle = {},
    disabled,
    imgColor,
    imgSize,
    imgSrc,
    label = '',
    labelStyle = {},
    onPress = () => { },
}) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={activeOpacity}
            style={[styles.container, containerStyle]}
        >
            <View style={{
                flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center', flex: 1
            }}>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    {!!imgSrc && imgSrc == 'phone' ?
                        <Image source={require('../../../assets/icons/phone_icon.png')} style={{ width: 20, height: 20 }}>
                        </Image>
                        :
                        imgSrc == 'facebook' ?
                            <Image source={require('../../../assets/icons/fb_round.png')} style={{ width: 20, height: 20 }}>
                            </Image>
                            :
                            <Icon
                                name={imgSrc}
                                size={imgSize}
                                color={imgColor}
                            //style={}
                            />}
                    <Text style={[styles.label, labelStyle]}>{label}</Text>
                </View>


            </View>
        </TouchableOpacity>
    );

export default SignUpButton;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: _scaleText(40).fontSize,
        borderRadius: 50,
        backgroundColor: JOIN_BUTTON_COLOR
    },
    label: {
        color: 'white',
        fontFamily: 'SFProText-Bold',
        textAlign: 'center',
        fontSize: _scaleText(14).fontSize,
        marginLeft: 10
    }
});