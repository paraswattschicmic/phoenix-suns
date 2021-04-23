import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { _scaleText, JOIN_BUTTON_COLOR } from '../../../shared';

const CustomOTP = ({
    n,
    value = [],
    onChangeText = () => { }
}) => {
    let inputsRefs = [];
    const [active, toggleActive] = useState(-1)
    const onChange = (val, index) => {
        if (val && index + 1 < n) {
            inputsRefs[index + 1].focus();
        }
        let otp = value;
        otp[index] = val
        onChangeText([...otp])
    }

    const onKeyPress = (e, index) => {
        if (e.nativeEvent.key == 'Backspace') {
            if (value[index]) {
                onChange('', index);
            } else {
                if (index) {
                    inputsRefs[index - 1].focus();
                    onChange('', index - 1)
                }
            }
        }
    }

    return (
        <View style={styles.container}>
            {(new Array(n).fill(1, 0, n)).map((item, index) => {
                return (<TextInput
                    key={index}
                    keyboardType='number-pad'
                    maxLength={1}
                    onFocus={() => toggleActive(index)}
                    onBlur={() => toggleActive(-1)}
                    autoCapitalize='characters'
                    onChangeText={(val) => onChange(val, index)}
                    onKeyPress={e => onKeyPress(e, index)}
                    ref={(ref) => (inputsRefs[index] = ref)}
                    style={styles.input(active == index)}
                    value={value[index] || ''}
                />)
            })}
        </View>
    );
}

export default CustomOTP;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        height: _scaleText(35).fontSize
    },
    input: (active) => ({
        borderBottomWidth: 0.65,
        textAlign: 'center',
        width: '12%',
        padding: 0,
        margin: 0,
        alignSelf: 'flex-end',
        fontSize: _scaleText(20).fontSize,
        marginHorizontal: _scaleText(5).fontSize,
        borderColor: active ? JOIN_BUTTON_COLOR : '#7a7979'
    })
});