import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { _scaleText } from '../../../shared';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const componentName = ({
    placeholder,
    data = [],
    onChangeItem = () => { },
    toggleList = () => { },
    showList,
    value_key = '_id',
    selected = '',
    dropDownstyle = {},
    containterStyle = {},
    ontoggleModal = () => { },
    labelStyle = {}
}) => {
    let val = data.findIndex(item => item[value_key] == selected);
    val = ((val >= 0) ? data[val].label : '')
    return (
        <View style={{ flex: 1, marginTop: _scaleText(15).fontSize, ...dropDownstyle }}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { toggleList(!showList); }}
                style={styles.container(showList)}
            >
                {!!selected ? <Text numberOfLines={1} style={{
                    flex: 1, color: 'black',
                    fontSize: _scaleText(18).fontSize,
                    ...labelStyle
                }}>{val}</Text> : <Text style={styles.placeholder}>{placeholder}</Text>}
                <Image
                    source={require('../../../assets/icons/up-and-down.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            {(showList) && <ScrollView nestedScrollEnabled style={styles.listContainer} >
                {data.map((item, index) => {
                    let sel = item[value_key] == selected;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                onChangeItem(index, item)
                            }}
                            style={styles.itemContainer}
                        >
                            <Text style={{ fontSize: _scaleText(15).fontSize }}>{item.label}</Text>
                            {sel && <Icon size={_scaleText(20).fontSize} name='check' />}
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>}
        </View>
    );
}

export default componentName;

const styles = StyleSheet.create({
    container: showList => ({
        borderWidth: 1,
        borderColor: '#e3e5e8',
        paddingHorizontal: _scaleText(10).fontSize,
        paddingVertical: 0,
        borderRadius: 5,
        height: _scaleText(36).fontSize,
        maxWidth: '95%',
        marginTop: _scaleText(5).fontSize,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: showList ? 0 : 5,
        borderBottomRightRadius: showList ? 0 : 5
    }),
    placeholder: {
        color: '#6D7075',
        fontSize: _scaleText(18).fontSize
    },
    icon: {
        width: _scaleText(15).fontSize,
        height: _scaleText(15).fontSize,
    },
    listContainer: {
        position: 'absolute',
        left: 0,
        zIndex: 999999999,
        backgroundColor: 'white',
        maxWidth: '98.3%',
        right: 0,
        top: _scaleText(40).fontSize,
        borderTopWidth: 0,
        maxHeight: _scaleText(150).fontSize,
        borderColor: '#e3e5e8',
        paddingVertical: _scaleText(5).fontSize,
        borderWidth: 1,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    itemContainer: {
        padding: _scaleText(10).fontSize,
        paddingHorizontal: _scaleText(10).fontSize,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});