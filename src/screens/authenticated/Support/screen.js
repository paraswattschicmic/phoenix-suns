/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import qs from 'qs';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TextField,
  Linking,
  Image,
} from "react-native";
import { Picker } from '@react-native-community/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { sendGridEmail } from './sendEmail';
import { ScreenHOC } from '../../../components';
import { JOIN_BUTTON_COLOR, _scaleText } from '../../../shared';
import { setSpText, scaleSizeH, scaleSizeW } from '../../../shared/services/screenStyle';

const Support = ({
    /**
     * Props
     */
    navigation,
    route: { params = {} },
}) => {
    useEffect(() => {
    }, []);

    const [topicValue, setTopicValue] = useState('Technical issue');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [contentErr, setContentErr] = useState('');
    const [submitSuccessMessage, setSubmitSuccessMessage] = useState(false);

    const onSendEmail = () => {
        console.log('topicValue', topicValue);
        console.log('email', email);
        console.log('content', content);
        if (!isEmailValid(email)) {
            setEmailErr('Please enter a valid email address');
            setSubmitSuccessMessage('');
        }
        if (isEmailValid(email)) {
            setEmailErr('');
        }
        if (content.length <= 5) {
            setContentErr('Please enter a description greater than 5 words');
            setSubmitSuccessMessage('');
        }
        if (content.length > 5) {
            setContentErr('');
        }
        if (isEmailValid(email) && content.length > 5) {
            // setSubmitSuccessMessage(true);
            const SENDGRIDAPIKEY = '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';
            const FROMEMAIL = 'support@getcollyde.com';
            const TOMEMAIL = 'support@getcollyde.com';
            const SUBJECT = 'You have a new message';

            const ContactDetails =
            `You got a new support message from ${email}:

>>> Topic:
  ${topicValue}


>>> Email:
  ${email}


>>> Description:

${content}


- Collyde support team -
            `;

            const sendRequest = sendGridEmail(SENDGRIDAPIKEY, TOMEMAIL, FROMEMAIL, SUBJECT, ContactDetails);
            sendRequest.then((response) => {
                setSubmitSuccessMessage(true);
            }).catch((error) =>{
                console.log(error);
            });
        }
    };

    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    const isEmailValid = (emailValue) => {
        if (!emailValue)
            {return false;}

        if (emailValue.length > 254)
            {return false;}

        var valid = emailRegex.test(email);
        if (!valid)
            {return false;}

        // Further checking of some things regex can't handle
        var parts = email.split('@');
        if (parts[0].length > 64)
            {return false;}

        var domainParts = parts[1].split('.');
        if (domainParts.some(function(part) { return part.length > 63; }))
            {return false;}

        return true;
    };


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
          <View style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.supportTitle}>{supportObj.title}</Text>
            <Picker
              selectedValue={topicValue}
              style={{ width: scaleSizeW(400), marginTop: -scaleSizeH(20) }}
              onValueChange={(itemValue, itemIndex) => setTopicValue(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Technical issue" value="Technical issue" />
              <Picker.Item label="Suggest an idea" value="Suggest an idea" />
              <Picker.Item label="Ask a question" value="Ask a question" />
            </Picker>
            <TextInput
              style={{
                height: scaleSizeH(50),
                borderColor: "lightgray",
                borderWidth: 1,
                padding: scaleSizeH(10),
                marginLeft: scaleSizeH(20),
                marginRight: scaleSizeH(20),
              }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Email so we can response"
              placeholderTextColor="gray"
              textAlign="left"
              textContentType="emailAddress"
              autoCompleteType="email"
            />
            <TextInput
              style={{
                height: scaleSizeH(250),
                borderColor: "lightgray",
                borderWidth: 1,
                paddingLeft: scaleSizeH(10),
                marginTop: scaleSizeH(15),
                marginLeft: scaleSizeH(20),
                marginRight: scaleSizeH(20),
                // backgroundColor: 'red',
              }}
              onChangeText={(text) => setContent(text)}
              value={content}
              placeholder="Let us know what happened"
              placeholderTextColor="gray"
              textAlign="left"
              multiline
            />
            <Text
              style={{
                color: "red",
                // fontWeight: '600',
                fontSize: setSpText(16),
                textAlign: "left",
                marginLeft: scaleSizeH(20),
                marginTop: scaleSizeH(5),
              }}
            >
              {emailErr}
            </Text>
            <Text
              style={{
                color: submitSuccessMessage ? JOIN_BUTTON_COLOR : "red",
                // fontWeight: '600',
                fontSize: setSpText(16),
                textAlign: "left",
                marginLeft: scaleSizeH(20),
                marginTop: scaleSizeH(5),
              }}
            >
              {submitSuccessMessage ? "Thank you for your request we will response as soon as possible." : contentErr}
            </Text>
            <TouchableOpacity style={styles.supportSubmit} onPress={() => onSendEmail()}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: setSpText(25),
                  textAlign: "center",
                  lineHeight: scaleSizeH(40),
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenHOC>
    );
};

const supportObj = {
    title: 'We\'re here to help',
};

const ICONS_NAMES = {
    ICON_CLOSE_COPY_WIDGET: 'cross',
    ICON_BACK: 'chevron-left',
    ICON_COPY: 'copy',
};


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        marginTop: scaleSizeH(20),
        flex: 1,
        paddingTop: 40,
        alignItems: 'center',
      },
      scrollView: {
        marginHorizontal: scaleSizeW(20),
      },
      supportTitle: {
        color: JOIN_BUTTON_COLOR,
        fontWeight: '800',
        fontSize: setSpText(30),
        textAlign: 'center',
      },
      supportSubmit: {
        marginTop: scaleSizeH(20),
        marginLeft: scaleSizeW(120),
        backgroundColor: JOIN_BUTTON_COLOR,
        borderRadius: scaleSizeW(40),
        height: scaleSizeH(40),
        width: scaleSizeH(150),
      },
    //   contentTitle: {
    //     color: 'black',
    //     fontWeight: '600',
    //     fontSize: setSpText(20),
    //     marginTop: scaleSizeH(20),
    //     marginBottom: scaleSizeH(5),
    //   },
    //   contentText: {
    //     color: 'black',
    //     fontSize: setSpText(16),
    //   },
    //   text: {
    //     fontSize: 42,
    //   },
});

export default Support;

