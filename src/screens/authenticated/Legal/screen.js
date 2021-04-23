/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { ScreenHOC } from '../../../components';
import { JOIN_BUTTON_COLOR, _scaleText } from '../../../shared';
import { setSpText, scaleSizeH, scaleSizeW } from '../../../shared/services/screenStyle';


const Legal = ({
    /**
     * Props
     */
    navigation,
    route: { params = {} },
}) => {
    useEffect(() => {
    }, []);
    const generalTermsEle = generalTerms.map((item) => <Text key={`${item}-generalTerms`} style={styles.contentText}>{item}</Text>);
    const privacyEle = privacyContent.map((item) => <Text key={`${item}-privacy`} style={styles.contentText}>{item}</Text>);
    const startupEle = startupInfo.map((item) => <Text key={`${item}-startup`} style={styles.contentText}>{item}</Text>);
    const otherRulesEle = otherRules.map((item) => <Text key={`${item}-otherRule`} style={styles.contentText}>{item}</Text>);
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
            <Text style={styles.legalTitle}>{legalObj.title_1}</Text>
            <Text style={styles.legalTitle}>{legalObj.title_2}</Text>
            <Text style={styles.contentTitle}>General Terms</Text>
            {generalTermsEle}
            <Text style={styles.contentTitle}>Privacy</Text>
            {privacyEle}
            <Text style={styles.contentTitle}>Startup Info</Text>
            {startupEle}
            <Text style={styles.contentTitle}>Other Rules & Compliance</Text>
            {otherRulesEle}
          </ScrollView>
        </SafeAreaView>
      </ScreenHOC>
    );
};

const legalObj = {
    title_1: 'Terms of Service &',
    title_2: 'Privacy Policy',
};

const generalTerms = [
    `Collyde stores information such as passwords, logins, emails, for families, individuals and members of a household. Please read the terms carefully. Using our platform constitutes acceptance of these terms of use.`,
    `Collyde allows users to store passwords and login information in the United States. The site and all applications should only be used for legal purposes, you agree not to circumvent or break terms and conditions of services shared on Collyde. This includes sharing passwords with unauthorized users outside of the household, family, or any applicable scenario based on the applicable terms with service shared.`,
    `Collyde is unavailable to individuals under the age of 13 and using this software is an implicit representation that you are over the age of 13. If Collyde becomes aware that a user is under the age of 13, the account associated with such individual shall be removed without notice.`,
    `You agree to use Collyde at your own risk. Collyde is provided "as is" and is predicated on the basis of users sharing with other users. There is no guarantee services shared in groups are active. Users such as the group owner takes full responsibility to ensure this information is up to date.`,
    `By using Collyde, you agree to not upload any harmful site material intended to implant viruses, trojan horses, worms, files, or anything that will disrupt the user environment for other users or for Collyde as company. This includes hacking, translating, or cracking any portion of the software. You agree to adhering to local federal, state, city, and municipal laws.`,
    `You agree that you will use the Service for its intended purpose, and in compliance with all applicable laws and regulations: local, state, and national, and international, as applicable. You agree not to use the service in a fraudulent, disruptive, aggressive, manipulative, for money laundering, or any other inappropriate matter.Collyde reserves the right to make updates the app, fix bugs, enhance, or shut down the service for system issues; for the avoidance of doubt, each user's sole remedy for any failure of the platform shall be Collyde's guarantee to use reasonable best efforts to adjust or repair the software.`
];

const privacyContent = [
    "Collyde is dedicated to ensuring privacy for its users and we will put systems and processes in place to protect your information at all costs.Unless designated in your user settings, your pod activity of joining and paying pods will be shown on the home screen.If we make changes to our policy, cause that's what startups do, we'll notify you, and we'll post it here. If you contact us for support we will need to access your account information for support purposes.Collyde uses third party API's which allows other applications (i.e. Facebook, Apple, or Google) to have access you provided to them via Collyde. You are in control of this process and we do not disclose any of the data you use on Collyde unless you specify that you would like to use their application to connect on Collyde. We do not control third parties and Collyde is not responsible for any activity or lack thereof on these services. Collyde reserves the right to disclose personal information provided to us, including content of emails, messages, and data entered into the site, if required to by law or governmental request such as a warrant, or as specified in the Privacy Policy contained below. You must be 13 years or older to use this service. You are responsible for preventing unauthorized access to your account.",
    `Should there be any breach of the security or confidentiality of your personal data, we will make any required disclosures to you via email as expediently as possible and to the extent required (x) to comply with the legitimate needs of law enforcement or (ii) to determine the scope of the breach and restore the reasonable integrity of the data system.`
];

const startupInfo = [
    `By default your pods/group names are seen on the home screen by your the Collyde network. We're a new company and want to look cool and have a lot of users, in a bit, we'll let you go private if you want in account settings.We're likely to send you a message regarding product updates, terms of service changes, and any other correspondence relating to your pod (s). Collyde requires its users to represent themselves with honesty. Family means family, household means household.By using Collyde you agree not to share access to adult, pornographic, illegal, abusive websites is prohibited. Collyde reserves the right to remove such groups. As a startup, Collyde may have a glitch or error. The service provided is as is and available without warranty of any kind. You are using the service at your own risk.`
];

const otherRules = [
    `Users have the ability to delete or update all of their account information at all times. Should users have any concerns, this option is available via the help screen.
Collyde requires a Facebook account and an Internet connection available through various devices via a web browser.
Collyde reserves the right, to remove access to all users using the service without recourse if we believe you violated any of our policies.
If we determine that an entity or individual is using our services in a way to infiltrate or breach the service, we reserve the right to take appropriate legal action.
Collyde is only available to users in the United States. If you somehow get to use Collyde otherwise, we will be storing data on our computers in the US and complying US privacy laws.
Collyde does not endorse any services or third party software. To the extent Collyde mentions services shared on the platform, it is explicitly not promoting such service.
Collyde connects and may provide access to third party websites as a convenience. Collyde is not responsible for the content of any linked website, mobile application, or any connection with portals provided on Collyde. Collyde has no responsibility for services for passwords shared on their application.
Users are responsible for maintaining access to their password. Collyde at no point will have access to any of the pods logins and shared credentials.
If you believe any materials accessible on or from Collyde's website infringe your copyright, you may request removal of those materials from the website by contacting Collyde directly at help@getcollyde.com. Please provide your name address, telephone, number, and email address, and a statement of good faith belief that the complained of use of the materials is not authorized by Collyde as the copyright owner or on the copyright owner's behalf.
Any part or provision of this Agreement which is prohibited or is held to be void or unenforceable shall be ineffective to the extent of such prohibition or unenforceability without invalidating the remaining provisions hereof so that this Agreement will otherwise remain in full force, in effect and enforceable..
No agency, partnership, joint venture or employment is created by your use of Collyde. You do not have any authority of any kind to bind Collyde in any respect whatsoever.
Apple, the Apple logo and Mac are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc. Google Play is a trademark of Google Inc. Facebook and the Facebook logo is a trademark of Facebook Inc.
Collyde reserves the right to terminate your service at any time.
Collyde reserves the right to update this agreement at any time without notice or advance warning.
In the event of a business transfer, Collyde reserves the right to move, share, all company assets including your Identity Information.
Under no circumstances will Collyde or any affiliate or no-affiliate partners or services be liable to users or any other person for any money damages, whether direct, indirect, special incidental, cover, reliance or consequential damages, even if Collyde has been informed of the possibility of such damages, or for any claim by another party.
The Agreement shall be governed by the laws of the State of California in the United States of America. Jurisdiction for any legal actions in connection with the Agreement shall be brought in the state or federal courts located in San Francisco, California
    `
];

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
      legalTitle: {
        color: JOIN_BUTTON_COLOR,
        fontWeight: '800',
        fontSize: setSpText(30),
        textAlign: 'center',
      },
      contentTitle: {
        color: 'black',
        fontWeight: '600',
        fontSize: setSpText(20),
        marginTop: scaleSizeH(20),
        marginBottom: scaleSizeH(5),
      },
      contentText: {
        color: 'black',
        fontSize: setSpText(16),
      },
      text: {
        fontSize: 42,
      },
});

export default Legal;

