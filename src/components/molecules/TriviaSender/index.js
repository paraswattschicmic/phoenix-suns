/* eslint-disable prettier/prettier */
import React from 'react';
import { Alert, Keyboard } from 'react-native';
import { Dimensions, FlatList, Image, Text, TextInput, TouchableHighlight, View } from 'react-native';
import {
    COLLYDE_GRAY_BACKGROUND_COLOR,
    COLLYDE_LIGHT_GRAY_COLOR, COLLYDE_PRIMARY_BLUE_COLOR, GIF_POWERED_BY, TEXT_CONST, _scaleText
} from '../../../shared';

const { width } = Dimensions.get('window');

const TriviaSender = props => {
    const styles = {
        keyboardIcon: {
            alignSelf: 'center',
            marginLeft: _scaleText(5).fontSize
        },
        sendIcon: {
            backgroundColor: COLLYDE_PRIMARY_BLUE_COLOR,
            padding: _scaleText(6).fontSize,
            borderRadius: 50
        },
        titleStyle: {
            fontWeight: 'bold', alignSelf: 'center', color: COLLYDE_GRAY_BACKGROUND_COLOR
        },
        verticalLine: {
            backgroundColor: COLLYDE_GRAY_BACKGROUND_COLOR, height: '100%', width: _scaleText(0.5).fontSize
        },
        itemContainer: {
            marginVertical: _scaleText(5).fontSize, marginHorizontal: _scaleText(5).fontSize, backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: _scaleText(5).fontSize,
            },
            shadowOpacity: 0.2,
            shadowRadius: _scaleText(6).fontSize,

            elevation: _scaleText(10).fontSize,
            padding: _scaleText(10).fontSize, marginVertical: _scaleText(4).fontSize,
        }
    };
    return (
        <View style={props.isHostTriviaEnable && props.isUserHost ? { height: 'auto', width: 'auto', opacity: 1 } : { height: 0, width: 0, opacity: 0 }}>

            <FlatList
                data={props.hostTriviaQuestions}
                showsVerticalScrollIndicator={false}
                style={{ height: _scaleText(200).fontSize, marginHorizontal: _scaleText(5).fontSize, marginTop: _scaleText(5).fontSize }}
                initialNumToRender={15}
                keyExtractor={(_, index) => `${index}`}
                maxToRenderPerBatch={15}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                renderItem={({ item, index }) => (
                    <TouchableHighlight underlayColor='transparent' style={[styles.itemContainer, { opacity: item.isFired ? 0.5 : 1 }]}
                        onPress={() => {
                            if (props.netConnected) {
                                if (item.isFired) {
                                }
                                else {
                                    props.SendTriviaQuestion(item)
                                }
                            }
                            else {
                                Alert.alert('No Internet');
                            }
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.titleStyle, { fontSize: _scaleText(15).fontSize }]}>{index + 1}</Text>
                            <Text style={[styles.titleStyle, { flex: 1, marginLeft: _scaleText(10).fontSize, marginRight: _scaleText(5).fontSize, }]}>{item.content.text}</Text>
                            <View style={styles.verticalLine}></View>
                            <Text style={[styles.titleStyle, { flex: 0.4, marginLeft: _scaleText(10).fontSize, fontSize: _scaleText(15).fontSize }]}>{item.answer.text}</Text>
                        </View>
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
                            {TEXT_CONST.NO_TRIVIA_QUESTIONS_TO_DISPLAY}
                        </Text>
                    </View>)
                }}
            />
        </View>

    );
};

export default TriviaSender;
