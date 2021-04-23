/* eslint-disable prettier/prettier */
import React from 'react';
import { Keyboard } from 'react-native';
import { Dimensions, FlatList, Image, Text, TextInput, TouchableHighlight, View } from 'react-native';
import {
    COLLYDE_LIGHT_GRAY_COLOR, COLLYDE_PRIMARY_BLUE_COLOR, GIF_POWERED_BY, TEXT_CONST, _scaleText
} from '../../../shared';
import { GifImageItem } from '../GifImageItem';

const { width } = Dimensions.get('window');

const GifSender = props => {
    const styles = {
        containerStyle: {
            flexDirection: 'row',
            padding: _scaleText(10).fontSize,
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: props.netConnected ? COLLYDE_GRAY_BACKGROUND_COLOR : 'gray'
        },
        keyboardIcon: {
            alignSelf: 'center',
            marginLeft: _scaleText(5).fontSize
        },
        sendIcon: {
            backgroundColor: COLLYDE_PRIMARY_BLUE_COLOR,
            padding: _scaleText(6).fontSize,
            borderRadius: 50
        },
    };
    return (
        <View style={props.isGifEnable ? { height: 'auto', width: 'auto', opacity: 1 } : { height: 0, width: 0, opacity: 0 }}>
            <View style={styles.containerStyle}>
                <View style={{
                    borderWidth: 1,
                    paddingHorizontal: _scaleText(10).fontSize,
                    paddingLeft: _scaleText(20).fontSize,
                    borderRadius: _scaleText(20).fontSize,
                    height: _scaleText(40).fontSize,
                    flex: 1,
                    backgroundColor: COLLYDE_LIGHT_GRAY_COLOR,
                    margin: _scaleText(5).fontSize,
                    flexDirection: 'row'
                }}>
                    <TextInput
                        placeholder="Search GIFs"
                        placeholderTextColor={'#737373'}
                        style={{
                            color: '#212529',
                            textAlignVertical: 'center',
                            flex: 1,
                            // textAlign: 'center',
                            fontSize: _scaleText(15).fontSize,
                        }}
                        onChangeText={(text) => props.gifTermChange(text)}
                    />
                    {/* <TouchableOpacity
                        onPress={props.onPressKeyboard}
                        style={styles.keyboardIcon}
                    >
                        <FontAwsomeIcon
                            name='keyboard'
                            color='gray'
                            size={_scaleText(15).fontSize}
                        />
                    </TouchableOpacity> */}
                </View>
            </View >
            <Image source={GIF_POWERED_BY} style={{ height: _scaleText(8).fontSize, width: _scaleText(80).fontSize, resizeMode: 'contain', marginLeft: _scaleText(10).fontSize, backgroundColor: 'gray', borderRadius: _scaleText(2.5).fontSize, padding: _scaleText(5).fontSize }}  ></Image>
            <FlatList
                data={props.gifsData}
                numColumns={3}
                style={{ height: _scaleText(200).fontSize, marginHorizontal: _scaleText(5).fontSize, marginTop: _scaleText(5).fontSize }}
                initialNumToRender={15}
                keyExtractor={(_, index) => `${index}`}
                maxToRenderPerBatch={15}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                onEndReached={() => {
                    props.gifNextPage()
                }
                }
                // columnWrapperStyle={{ justifyContent: 'space-around' }}
                renderItem={({ item }) => (
                    <TouchableHighlight style={{ marginVertical: _scaleText(5).fontSize, marginHorizontal: _scaleText(5).fontSize }} onPress={() => { props.SendGif(item.images.original.url) }}>
                        { item.images && item.images.original && item.images.original.url && <GifImageItem imageUrl={item.images.original.url}></GifImageItem>}
                    </TouchableHighlight>
                )}
                ListEmptyComponent={() => {
                    return (<View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: _scaleText(200).fontSize,
                        }}>
                        <Text style={{ fontSize: _scaleText(15).fontSize }}>
                            {TEXT_CONST.OOPS}
                        </Text>
                        <Text style={{ fontSize: _scaleText(12).fontSize }}>
                            {TEXT_CONST.NO_GIF_TO_DISPLAY}
                        </Text>
                    </View>)
                }}
            />
        </View>

    );
};

export default GifSender;
