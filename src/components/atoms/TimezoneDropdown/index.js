import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Modal, TouchableOpacity, View, Image } from 'react-native';
import { _scaleText } from '../../../shared';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const componentName = ({
    placeholder,
    data = [],
    onChangeItem = () => { },
    toggleList = () => { },
    showList,
    route = '',
    value_key = '_id',
    selected = '',
    dropDownstyle = {},
}) => {
    let val = data.findIndex(item => item[value_key] == selected);
    val = ((val >= 0) ? data[val].label : '')
    return (
        <View style={{ flex: 1, ...dropDownstyle }}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => { toggleList(!showList); }}
                style={styles.container(showList)}
            >
                {!!selected ? <Text numberOfLines={1} style={[{
                    flex: 1,
                    fontSize: _scaleText(14).fontSize,
                    fontFamily: 'SFProText-Regular',
                }, route && route == 'profile' ? styles.editProfileToucble : {}]}>{val}</Text> : <Text style={styles.placeholder}>{placeholder}</Text>}
                <Image
                    source={require('../../../assets/icons/up-and-down.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
            {(showList) && <Modal transparent={true} animated={true} animationType={'none'}>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => toggleList(!showList)}>
                    <ScrollView nestedScrollEnabled style={styles.listContainer} >
                        <Text style={{ marginLeft: _scaleText(10).fontSize }}>{'Select Timezone'}</Text>

                        {data.map((item, index) => {
                            let sel = item[value_key] == selected;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        onChangeItem(index, item)
                                        toggleList(!showList)
                                    }}
                                    style={styles.itemContainer}
                                >
                                    <Text style={{ fontSize: _scaleText(15).fontSize }}>{item.label}</Text>
                                    {sel && <Icon size={_scaleText(20).fontSize} name='check' />}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView></TouchableOpacity></Modal>}
        </View>
    );
}

export default componentName;

const styles = StyleSheet.create({
    container: showList => ({
        borderWidth: 0,
        borderColor: '#e3e5e8',
        paddingHorizontal: _scaleText(10).fontSize,
        paddingVertical: 0,
        borderRadius: 5,
        width: '100%',
        justifyContent: 'flex-end',
        height: _scaleText(36).fontSize,
        marginLeft: _scaleText(5).fontSize,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: showList ? 0 : 5,
        borderBottomRightRadius: showList ? 0 : 5
    }),
    editProfileToucble: {
        textAlign: 'right',
        marginRight: _scaleText(5).fontSize,
    },
    placeholder: {
        color: '#6D7075',
        fontSize: _scaleText(18).fontSize
    },
    icon: {
        width: _scaleText(15).fontSize,
        height: _scaleText(15).fontSize,
    },
    listContainer: {
        flex: 0.5,
        alignSelf: 'center',
        // marginTop: _scaleText(250).fontSize,
        // marginLeft: _scaleText(40).fontSize,
        zIndex: 999999999,
        backgroundColor: 'white',
        borderTopWidth: 0,
        maxHeight: _scaleText(250).fontSize,
        borderColor: '#e3e5e8',
        paddingVertical: _scaleText(5).fontSize,
        borderWidth: 1,
        width: '80%',
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