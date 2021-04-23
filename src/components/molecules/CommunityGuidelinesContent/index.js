/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { scaleSizeH, setSpText } from '../../../shared/services/screenStyle';

const CommunityGuidelinesContent = ({
    /**
     * Props
     */
    navigation,
}) => {
  
    const communityContentTopEle = communityContentTop.map((item) => <Text key={`${item}-contentTop`} style={styles.contentText}>{item}</Text>);
    const communityZeroToleranceContentEle = communityZeroToleranceContent.map((item) => <Text
        key={`${item}-communityZeroToleranceContent`}
        style={styles.contentText}
    >
        <Octicons
            name="primitive-dot"
        /><Text>{`  `}</Text>{item}
    </Text>);

    return (
        <>
            {communityContentTopEle}
            <Text style={styles.contentTitle}>Collyde has zero-tolerance for these behaviors:</Text>
            {communityZeroToleranceContentEle}
            <Text style={{ marginTop: scaleSizeH(20), marginBottom: scaleSizeH(50) }}>
                <Text style={styles.contentTitle}>In Summary: </Text>Inconsiderate individuals are not welcomed! Content on Collyde should be light-hearted and centered on sports.
                    </Text>
        </>
    );

}
const communityContentTop = [
    `Collyde’s mission is to create an inclusive community for sports fans to chat and interact while watching their favorite teams play. We created these Community Guidelines to outline what isn’t acceptable on Collyde. You will be kicked off of our app if you violate any of these guidelines. `,
    `Collyde is a diverse and accepting space that supports every individual. Our goal is for users to be themselves, live in the moment, and express their diverse points of view freely. `,
    `We will be updating our Guidelines as our community expands and evolves. We want to ensure that Collyde is an enjoyable and safe space for all. `
];

const communityZeroToleranceContent = [
    `Any forms of discrimination, marginalization, or bullying`,
    `Posting content that encourages criminal activities, violence, hate-based conspiracy theories, or dangerous behavior`,
    `Using Collyde for any illegal activities (buying/selling drugs or weapons)`,
    `Sharing sexually explicit content `,
    `Spamming`,
    `Posting content that violates intellectual property rights`,
    `Storing personally identifiable information from users on Collyde without permission`,
    `Deception and pretending to be someone you’re not`,
    `Derogatory slurs and negative stereotypes `,
    `Dehumanizing individuals or groups of people based on their race, religious affiliation, national origin, sexual orientation, sex, gender, and disability`
];
const styles = StyleSheet.create({

    contentTitle: {
        color: 'black',
        fontWeight: '600',
        fontSize: setSpText(15),
        marginTop: scaleSizeH(20),
        marginBottom: scaleSizeH(5),
    },
    contentText: {
        color: 'black',
        fontSize: setSpText(14),
        marginTop: scaleSizeH(20),
    },
});
export { CommunityGuidelinesContent };
