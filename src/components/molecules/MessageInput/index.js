/* eslint-disable prettier/prettier */
import React from 'react';
import { View, TextInput, Dimensions, Platform, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { _scaleText, STATUS_BAR_PRIMARY_COLOR } from '../../../shared';
import VectorIcon from 'react-native-vector-icons/AntDesign';
import CustomProfileImagePicker from '../CustomProfileImagePicker';


const { width } = Dimensions.get('window');

const MessageInput = props => {
    return (
        <View style={styles.containerStyle}>
            <View style={{ alignSelf: 'center', marginRight: _scaleText(10).fontSize }}>
                <CustomProfileImagePicker
                    plusIcon
                    onChange={props.onPlusPress}
                />
            </View>
            <TextInput
                style={{
                    borderColor: '#e3e5e8',
                    borderWidth: 1,
                    color: '#212529',
                    textAlignVertical: 'center',
                    paddingHorizontal: _scaleText(10).fontSize,
                    fontSize: _scaleText(15).fontSize,
                    borderRadius: _scaleText(3).fontSize,
                    height: _scaleText(44).fontSize,
                    flex: 1
                }}
                spellCheck={true}
                placeholder={'Write message'}
                autoCapitalize="none"
                placeholderTextColor={'#7d859e'}
                selectionColor={'#212529'}
                underlineColorAndroid="transparent"
                value={props.textMessage}
                onChangeText={props.onChangeText}
            />
            <View style={{
                backgroundColor: props.netConnected ? STATUS_BAR_PRIMARY_COLOR : 'gray',
                borderRadius: _scaleText(3).fontSize,
                height: _scaleText(45).fontSize,
                justifyContent: 'center',
                width: 100,
            }}>
                {
                    props.netConnected
                        ?
                        <Text onPress={props.onRightPress} style={{ paddingVertical: 10, fontSize: _scaleText(16).fontSize, fontWeight: '400', color: 'white', textAlignVertical: 'center', textAlign: 'center' }}>{'Send'}</Text>
                        :
                        <Text style={{ paddingVertical: 10, fontSize: _scaleText(12).fontSize, fontWeight: '400', color: 'white', textAlignVertical: 'center', textAlign: 'center' }}>{'Not connected'}</Text>
                }
            </View>

        </View>
    );
};

const styles = {
    containerStyle: {
        flexDirection: 'row',
        padding: _scaleText(10).fontSize,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    inputViewStyle: {
    },
    inputStyle: {
        fontSize: 13,
        backgroundColor: '#fff'
    }
};

export default MessageInput;
