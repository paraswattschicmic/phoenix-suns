import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { _scaleText, JOIN_BUTTON_COLOR } from '../../../shared';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomButton = ({
    activeOpacity = 0.7,
    buttonLeft,
    buttonRight,
    containerStyle = {},
    disabled,
    imgColor,
    imgSize,
    imgSrc,
    imgStyles,
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
            {!!buttonLeft && buttonLeft}

            {!!imgSrc && <Icon
                name={imgSrc}
                size={imgSize}
                color={imgColor}
                style={imgStyles}
            />}
            <Text style={[styles.label, labelStyle]}>{label}</Text>
            {!!imgSrc && <Icon
                name={imgSrc}
                size={imgSize}
                color={'transparent'}
                style={imgStyles}
            />}
            {!!buttonRight && buttonRight}
        </TouchableOpacity>
    );

export default CustomButton;

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
        flex: 1,
        textAlign: 'center',
        fontSize: _scaleText(14).fontSize
    }
});