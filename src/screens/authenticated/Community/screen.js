/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import { ScreenHOC } from '../../../components';
import { CommunityGuidelinesContent } from '../../../components/molecules/CommunityGuidelinesContent';
import { JOIN_BUTTON_COLOR } from '../../../shared';
import { scaleSizeH, scaleSizeW, setSpText } from '../../../shared/services/screenStyle';


const Community = ({
    /**
     * Props
     */
    navigation,
    route: { params = {} },
}) => {
    useEffect(() => {
    }, []);
    return (
      <ScreenHOC>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: scaleSizeW(80),
            height: scaleSizeW(80),
            justifyContent: "center",
            position: "absolute",
            marginTop: -scaleSizeH(75),
          }}
        >
          {/* <Icon
            name={ICONS_NAMES.ICON_BACK}
            color={JOIN_BUTTON_COLOR}
            style={{
              alignSelf: "flex-start",
              padding: 0,
              marginLeft: scaleSizeW(15),
            }}
            size={setSpText(50)}
          /> */}
          <Image
            resizeMode="contain"
            style={{
              alignSelf: "flex-start",
              padding: 0,
              marginLeft: scaleSizeW(15),
            }}
            source={require("../../../assets/icons/back_button.png")}
          ></Image>
        </TouchableOpacity>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.communityTitle}>{communityObj.title}</Text>
            <Text
              style={{
                fontSize: setSpText(14),
                marginTop: scaleSizeH(15),
              }}
            >
              Last updated: 10-26-2020
            </Text>
            <CommunityGuidelinesContent></CommunityGuidelinesContent>
          </ScrollView>
        </SafeAreaView>
      </ScreenHOC>
    );
};

const communityObj = {
    title: 'Community Guidelines',
};




const ICONS_NAMES = {
    ICON_CLOSE_COPY_WIDGET: 'cross',
    ICON_BACK: 'chevron-left',
    ICON_COPY: 'copy',
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: scaleSizeH(20),
    },
    scrollView: {
        marginHorizontal: scaleSizeW(20),
    },
    communityTitle: {
        color: JOIN_BUTTON_COLOR,
        fontWeight: '800',
        fontSize: setSpText(30),
        textAlign: 'center',
    },
    text: {
        fontSize: 42,
    },
});

export default Community;

