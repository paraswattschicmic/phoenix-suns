import React from 'react';
import { StyleSheet, View } from 'react-native';
import { _scaleText, JOIN_BUTTON_COLOR } from '../../../shared';
import { fill } from 'lodash';

const CustomProgressBar = ({
    filled = 0,
    total = 0,
    containerStyle
}) => (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.filled(total, filled)} />
        </View>
    );

export default CustomProgressBar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e3e6e8',
        borderRadius: 50,
        height: _scaleText(14).fontSize,
        overflow: 'hidden',
    },
    filled: (total, filled, color = JOIN_BUTTON_COLOR) => ({
        backgroundColor: color,
        borderRadius: 50,
        height: '100%',
        width: `${(filled * 100) / total}%`,
    })
});