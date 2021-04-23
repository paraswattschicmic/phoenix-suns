import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { STATUS_BAR_PRIMARY_COLOR, COLLYDE_LOGO } from '../../../shared';
import { _scaleText } from '../../../shared/services/utility'
import { setSpText, scaleSizeH, scaleSizeW } from '../../../shared/services/screenStyle';

const Header = ({
    headerContainer = {},
}) => (
        <View style={[styles.container, headerContainer]}>
            <Image source={COLLYDE_LOGO} resizeMode={'contain'} style={{
                marginTop: scaleSizeH(10),
                height: scaleSizeH(50),
                width: scaleSizeW(50),
            }} />
        </View>
    );

export default Header;


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: _scaleText(75).fontSize,
        backgroundColor: STATUS_BAR_PRIMARY_COLOR,
        flexDirection: 'row',
        paddingVertical: _scaleText(10).fontSize,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: 'white',
    }
});