import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, Switch, TextInput, Linking } from 'react-native'
import { COLLYDE_PRIMARY_BLUE_COLOR, _scaleText } from '../../../shared';
import { JOIN_BUTTON_COLOR, LINE_COLOR } from '../../../shared'
import { CustomDropDown, TimezoneDropdown } from '../index'
import { TouchableOpacity } from 'react-native-gesture-handler';
const CustomListBox = ({
    label = '',
    value = '',
    linkedUrl = '',
    sublabel = '',
    lineStyle = {},
    labelStyle = {},
    containerStyle = {},
    active = '',
    subscription = '',
    editMode = '',
    customUI,
    dropdown,
    timezones,
    timezone,
    placeholder,
    maxStringLength = 15,
    onChange = () => { },
    keyboardType,
    ontoggleModal = () => { },
    error,
}) => {
    const [showList, toggleList] = useState(false)
    return (
        <View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: _scaleText(15).fontSize,
                alignItems: 'center',
                marginTop: subscription ? null : label == 'Subscriptions' ? _scaleText(8).fontSize : label == 'Facebook' ? _scaleText(17).fontSize : null,
                marginBottom: subscription ? null : label == 'Subscriptions' ? _scaleText(8).fontSize : label == 'Facebook' ? _scaleText(20).fontSize : null,
                ...containerStyle
            }} >
                <View >
                    <Text
                        style={{
                            fontSize: label == 'Subscriptions' ? _scaleText(12).fontSize : _scaleText(15).fontSize,
                            fontWeight: label == 'Subscriptions' ? '600' : '400',
                            fontFamily: 'SFProText-Regular',
                            color: label == 'Subscriptions' ? LINE_COLOR : 'black'
                            , ...labelStyle
                        }}
                    >{label}
                    </Text>
                    {!!sublabel ? <Text
                        style={{
                            color: '#A7A7A7',
                            fontSize: _scaleText(12).fontSize,
                            fontFamily: 'SFProText-Regular',
                            fontWeight: '500'
                        }}
                    >{sublabel}</Text> : null}
                </View>

                {!!customUI && <View style={{ flex: 1, alignItems: 'flex-end' }}>{customUI}</View>}
                {!!editMode && !subscription ? <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <TextInput value={value} onChangeText={(text) => onChange(text)} placeholder={placeholder ? placeholder : ''}
                        keyboardType={keyboardType}
                        style={{ width: '100%', textAlign: 'right' }}
                        autoCompleteType='off'
                        // maxLength={15}
                        maxLength={maxStringLength}
                    />
                </View>
                    :
                    !!subscription ?
                        <Switch
                            trackColor={{ false: LINE_COLOR, true: `${JOIN_BUTTON_COLOR}` }}
                            thumbColor={active == true ? 'white' : 'white'}
                            value={active == true ? true : false}
                            disabled={!editMode}
                            onValueChange={(value) => onChange(value)}
                            style={{
                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                //marginRight: _scaleText(23).fontSize
                            }} />
                        :
                        dropdown ?
                            <TimezoneDropdown
                                data={timezones}
                                onChangeItem={onChange}
                                //  placeholder={placeholder}
                                selected={timezone}
                                route={'profile'}
                                showList={showList}
                                toggleList={() => toggleList(!showList)}
                                ontoggleModal={ontoggleModal}
                                dropDownstyle={{
                                    marginLeft: _scaleText(10).fontSize
                                }}
                            />
                            :
                            <Text
                                onPress={() => {
                                    if (linkedUrl && (value != '' || value != 'NA')) {
                                        Linking.canOpenURL(linkedUrl).then(supported => {
                                            if (supported) {
                                                Linking.openURL(linkedUrl);
                                            } else {
                                                console.log("Don't know how to open URI: " + linkedUrl);
                                            }
                                        });
                                    }
                                }}
                                style={{
                                    color: linkedUrl && (value != '' || value != 'NA') ? COLLYDE_PRIMARY_BLUE_COLOR : '#A7A7A7',
                                    fontWeight: '600',
                                    zIndex: 1
                                }}
                            >{value}</Text>
                }
            </View>
            <Text style={{
                color: 'red', fontSize: _scaleText(12).fontSize,
                textAlign: 'right',
                marginRight: _scaleText(15).fontSize,
                marginTop: _scaleText(-15).fontSize,
                marginBottom: _scaleText(6).fontSize
            }}>{!!error ? error : ' '}</Text>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: _scaleText(0.9).fontSize,
                // opacity: subscription || label == 'Subscriptions' || label == 'Age' ? 1 : 0.2,
                opacity: subscription || label == 'Subscriptions' ? 0.2 : 0.2,
                // marginLeft: subscription ? _scaleText(15).fontSize : 0,
                ...lineStyle
            }}></View>

        </View >
    );
}

export default CustomListBox;