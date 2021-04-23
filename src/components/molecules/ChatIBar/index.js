/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { Dimensions, FlatList, Image, Text, TextInput, TouchableHighlight, View } from 'react-native';
import {
    COLLYDE_GRAY_BACKGROUND_COLOR,
    COLLYDE_LIGHT_GRAY_COLOR, COLLYDE_PRIMARY_BLUE_COLOR, GIF_POWERED_BY, TEXT_CONST, _scaleText
} from '../../../shared';
import Carousel from 'react-native-snap-carousel';
import moment from 'moment';
import { Linking } from 'react-native';
let finalFlashViewTimeOut, triviaItemViewTimeOut;
const { width } = Dimensions.get('window');
//iBarAnnoucements = { iBarAnnoucements } iBarQuestions = { iBarQuestions }
const ChatIBar = props => {
    // /iBarCurrentAnnoucement
    let carouselRefAnnoucements = useRef(null);
    let carouselRefTrivia = useRef(null);
    const [hasQuestion, setHasQuestions] = useState(false);
    const [loopIsInProcess, setLoopInProcess] = useState(false);
    const [hasLiveAnnoucement, setHasLiveAnnoucement] = useState(false);
    const [currentIndexAnn, setCurrentIndexAnn] = useState(-1);
    const [nextTriviaId, setNextTriviaId] = useState(-1);
    const [triviaList, setTriviaList] = useState([]);

    var refNextTriviaId = React.useRef(nextTriviaId);
    var refTriviaList = React.useRef(triviaList);


    useEffect(() => {
        refNextTriviaId.current = nextTriviaId;
    }, [nextTriviaId]);
    useEffect(() => {
        refTriviaList.current = triviaList;
    }, [triviaList]);


    var annoucementsIndex = -1;
    var triviaIndex = -1;

    const styles = {
        slide: {
            height: '100%', marginRight: _scaleText(20).fontSize
        },
        title: {
            fontSize: _scaleText(20).fontSize, fontWeight: 'bold', color: COLLYDE_GRAY_BACKGROUND_COLOR
        },
        mainContainer: {
            backgroundColor: 'white', padding: _scaleText(10).fontSize, height: _scaleText(112).fontSize, borderBottomColor: COLLYDE_LIGHT_GRAY_COLOR, borderBottomWidth: 3, paddingLeft: _scaleText(16).fontSize
        }
    };
    useEffect(() => {
        renderLiveAnnoucement()
    }, [props.iBarCurrentAnnoucement])
    // useEffect(() => {
    //     console.log('loopIsInProcess1', loopIsInProcess)

    //     if (refTriviaList.current && refTriviaList.current.length && !loopIsInProcess) {
    //         console.log('came use effect', refTriviaList.current[0].id)


    //         let firstitemID = refTriviaList.current[0].id;
    //         setNextTriviaId(firstitemID)
    //         //triviaLoop()
    //     }
    // }, [refTriviaList.current]);
    // useEffect(() => {
    //     console.log('loop', refTriviaList.current, refTriviaList.current.length, !loopIsInProcess, refNextTriviaId.current)
    //     if (refTriviaList.current && refTriviaList.current.length && !loopIsInProcess && refNextTriviaId.current && refNextTriviaId.current != -1) {
    //         console.log('INnnnnnnnnnnloop',)
    //         triviaLoop()
    //     }
    // }, [refNextTriviaId.current]);

    useEffect(() => {
        //component will unmount
        return () => {
            setLoopInProcess(false);
            setNextTriviaId(-1);
            //  setTriviaList([]);
            clearTimeout(triviaItemViewTimeOut);
        }
    }, []);

    useEffect(() => {
        // [{ "_id": "6038b88905c4b73185eb44d7", "answer": { "duration": 30, "text": "India won world cup in 2019" }, "content": { "duration": 60, "text": "who won world cup in 2019?" }, "endTime": "2021-02-26T16:00:27.183Z", "isFired": true, "redirect": "string", "startTime": "2021-02-26T15:58:57.183Z", "type": 2 }]
        if (props.iBarQuestions && props.iBarQuestions.length && props.iBarQuestions.length > 0) {
            console.log('iBarQuestions', props.iBarQuestions)

            let sortedList = props.iBarQuestions.sort((a, b) => { new Date(a.startTime).getTime() - new Date(b.startTime).getTime() });
            let sortedQuestionsAnswers = [], finalEndTime = 0;
            clearTimeout(finalFlashViewTimeOut);
            if (sortedList && sortedList.length) {
                let lastItem = {}
                lastItem = sortedList[sortedList.length - 1];
                let lastStartTime = new Date(lastItem.startTime);
                finalEndTime = new Date(lastStartTime.setUTCSeconds(lastStartTime.getUTCSeconds() + lastItem.content.duration + lastItem.answer.duration));
                finalEndTime = finalEndTime - new Date();
                //console.log('Final end time ', finalEndTime);
            }
            finalFlashViewTimeOut = setTimeout(() => {
                console.log('FInal timeout executed');
                setHasQuestions(false);
                clearTimeout(triviaItemViewTimeOut);
                setLoopInProcess(false);
                carouselRefTrivia.current.snapToItem(0);
                setTriviaList([]);
            }, finalEndTime)

            sortedList.forEach((element, index) => {
                if (index == 0) {
                    if (element.startTime) {

                        let diff = new Date().getTime() - new Date(element.startTime).getTime();
                        diff = diff / 1000;
                        // console.log('diff,new Date().getMilliseconds()', new Date().getMilliseconds(), '===new Date(element.startTime).getMilliseconds()=', new Date(element.startTime).getMilliseconds(), 'new Date().getTime()', new Date().getTime(), 'new Date(element.startTime).getTime()', new Date(element.startTime).getTime(), 'new Date', new Date(), 'startTime', new Date(element.startTime))
                        // console.log('diff,diff', diff, '====', JSON.stringify(element))
                        let diffAnswer = diff - (element.content.duration)
                        if (diff && element.content.duration && diff < element.content.duration) {
                            let item = {};
                            item.title = element.content.text;
                            item.duration = element.content.duration - diff;
                            item.id = element._id + 'Q';
                            item.type = 'Question'
                            sortedQuestionsAnswers.push(item)
                        }
                        if (diff && element.answer.duration) {
                            let item = {};
                            item.title = element.answer.text;
                            item.duration = diffAnswer >= 0 ? element.answer.duration - diffAnswer : element.answer.duration;
                            item.id = element._id + 'A';
                            item.type = 'Answer'
                            sortedQuestionsAnswers.push(item)
                        }
                    }
                }
                else {
                    if (element.content && element.content.text && element.content.duration) {
                        let item = {};
                        item.title = element.content.text;
                        item.duration = element.content.duration;
                        item.type = 'Question';
                        item.id = element._id + 'Q';
                        sortedQuestionsAnswers.push(item)
                    }
                    if (element.answer && element.answer.text && element.answer.duration) {
                        let item = {};
                        item.title = element.answer.text;
                        item.duration = element.answer.duration;
                        item.type = 'Answer';
                        item.id = element._id + 'A';
                        sortedQuestionsAnswers.push(item)
                    }
                }
            });
            //console.log('sortedQuestionsAnswers', sortedQuestionsAnswers);
            triviaIndex = -1;
            setHasQuestions(true);
            setTriviaList(sortedQuestionsAnswers);
            if (sortedQuestionsAnswers && sortedQuestionsAnswers.length && !loopIsInProcess) {
                // console.log('came use effect', refTriviaList.current[0].id)
                let firstitemID = sortedQuestionsAnswers[0].id;
                setNextTriviaId(firstitemID);
                triviaLoop(firstitemID, sortedQuestionsAnswers)
                //triviaLoop()
            }
        }
    }, [props.iBarQuestions])

    const _renderAnnoucementItem = ({ item, index }) => {
        return (
            <TouchableHighlight underlayColor='transparent'
                onPress={() => {
                    if (item && item.redirect) {
                        Linking.canOpenURL(item.redirect).then(supported => {
                            if (supported) {
                                Linking.openURL(item.redirect);
                            } else {
                                console.log("Don't know how to open URI: " + item.redirect);
                            }
                        });
                    }
                }}
                style={styles.slide} >
                <>
                    <Text style={{ color: COLLYDE_PRIMARY_BLUE_COLOR, fontSize: _scaleText(20).fontSize, fontWeight: 'bold' }}>{'Announcement'}</Text>
                    <Text style={styles.title}>{item.content && item.content.text ? item.content.text : ''}</Text>
                </>
            </TouchableHighlight >
        );
    }
    const _renderTriviaItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <Text style={{ color: COLLYDE_PRIMARY_BLUE_COLOR, fontSize: _scaleText(20).fontSize, fontWeight: 'bold' }}>{item.type == 'Question' ? 'Trivia Question' : 'Trivia Answer'}</Text>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    }
    const renderLiveAnnoucement = () => {
        let currentRunningindex = -1
        if (props.iBarCurrentAnnoucement && props.iBarCurrentAnnoucement.length > 0) {
            if (props.iBarCurrentAnnoucement[0] && props.iBarCurrentAnnoucement[0]._id && props.iBarAnnoucements && props.iBarAnnoucements.length) {
                // console.log('yoooouou', props.iBarAnnoucements)
                props.iBarAnnoucements.forEach((item, index) => {
                    if (item._id === props.iBarCurrentAnnoucement[0]._id) {
                        currentRunningindex = index;
                    }
                });
            }
        }
        if (currentRunningindex != -1) {
            if (currentIndexAnn != currentRunningindex) {
                console.log('snapToItem', currentRunningindex, props.iBarAnnoucements[currentRunningindex])
                /**
                 * carousel is taking its own time to mount the list so without timeout of half second it was directly sending live annoucemnt to the first index. and carousel is giving any callback on the list mount
                 * Needs to optimize in future
                 */
                if (hasLiveAnnoucement) {
                    //Post First Render
                    carouselRefAnnoucements.current.snapToItem(currentRunningindex, animated = true);
                }
                else {
                    //First Render
                    setTimeout(() => {
                        carouselRefAnnoucements.current.snapToItem(currentRunningindex, animated = true);
                    }, 500)
                }
                setHasLiveAnnoucement(true);
                setCurrentIndexAnn(currentRunningindex)
            }
        }
        else {
            console.log('CAME+=======df=d=4==============')
            setHasLiveAnnoucement(false)
            setCurrentIndexAnn(-1)
        }
        // setTimeout(function () {
        //     if (annoucementsIndex == props.iBarAnnoucements.length - 1) annoucementsIndex = -1;
        //     annoucementsIndex++;
        //     if (carouselRefAnnoucements.current) {
        //         carouselRefAnnoucements.current.snapToItem(annoucementsIndex, animated = true)
        //     }
        //     if (annoucementsIndex < props.iBarAnnoucements.length) {
        //         annoucementLoop();
        //     }
        // }, annoucementsIndex == -1 ? 0 : (props.iBarAnnoucements[annoucementsIndex].content.duration * 1000))
    }

    const triviaLoop = (nextTriviaId = 0, sortedQuestionsAnswers = []) => {
        let nextTriviaID = nextTriviaId ? nextTriviaId : refNextTriviaId.current
        let triviaSortedQuestionsAnswers = sortedQuestionsAnswers.length ? sortedQuestionsAnswers : refTriviaList.current;

        if (nextTriviaID == -1) {
            //console.log('Empty List')
            clearTimeout(triviaItemViewTimeOut);
            setLoopInProcess(false);
            setTriviaList([]);

        }
        else {
            if (triviaSortedQuestionsAnswers && triviaSortedQuestionsAnswers.length) {
                triviaSortedQuestionsAnswers.forEach((item, index) => {
                    if (nextTriviaID && carouselRefTrivia.current && item.id === nextTriviaID) {
                        console.log('itemitemitemitemitemitemitem', item);
                        if (!loopIsInProcess) {
                            setTimeout(() => {
                                carouselRefTrivia.current.snapToItem(index);
                            }, 500)
                        }
                        else {
                            carouselRefTrivia.current.snapToItem(index);
                        }
                        setLoopInProcess(true);

                        if (index == (triviaSortedQuestionsAnswers.length - 1)) {
                            setNextTriviaId(-1);
                            setLoopInProcess(false);
                        }
                        else {
                            //console.log(triviaSortedQuestionsAnswers[1].id)
                            setNextTriviaId(triviaSortedQuestionsAnswers[index + 1].id)
                            triviaItemViewTimeOut = setTimeout(() => {
                                triviaLoop()
                            }, item.duration * 1000)

                        }
                    }
                });
            }
        }


        // let triviaTimeOut;
        // loopIsInProcess = true;
        // console.log('triviaIndextriviaList.length', triviaIndex, '===', triviaList.length)
        // if (triviaIndex >= triviaList.length) {
        //     console.log('enteredtriviaIndextriviaList.length', triviaIndex, '===', triviaList.length)

        //     clearTimeout(triviaTimeOut)
        //     //setHasQuestions(false);
        //     //setTriviaList([]);

        // }
        // else {

        //     triviaTimeOut = setTimeout(function () {
        //         triviaIndex++;
        //         if (carouselRefTrivia.current && triviaIndex && triviaList.length && triviaList[triviaIndex]) {

        //             carouselRefTrivia.current.snapToItem(triviaIndex, animated = true)
        //         }
        //         if (triviaList && triviaList.length) {
        //             //triviaList.splice(0, 1);
        //             triviaLoop();
        //         }

        //     }, triviaIndex == -1 ? 0 : triviaList[triviaIndex] && triviaList[triviaIndex].duration ? (triviaList[triviaIndex].duration * 1000) : 0)
        // }
    }
    let hasRunningAnnoucement = currentIndexAnn != null && currentIndexAnn != undefined && currentIndexAnn >= 0;
    return (
        <View style={(hasQuestion || (hasLiveAnnoucement && hasRunningAnnoucement)) ? styles.mainContainer : { height: 0, width: 0, opacity: 0 }}>
            <View style={(hasQuestion || (!(props.iBarAnnoucements && props.iBarAnnoucements.length))) ? { height: 0, width: 0, opacity: 0 } : (hasLiveAnnoucement && hasRunningAnnoucement) ? { height: 'auto', width: 'auto', opacity: 1 } : { height: 0, width: 0, opacity: 0 }}>
                <Carousel
                    ref={carouselRefAnnoucements}
                    data={props.iBarAnnoucements}
                    scrollEnabled={false}
                    renderItem={_renderAnnoucementItem}
                    sliderWidth={width}
                    itemWidth={width}
                />
            </View>
            <View style={hasQuestion ? { height: 'auto', width: 'auto', opacity: 1 } : { height: 0, width: 0, opacity: 0 }}>
                <Carousel
                    ref={carouselRefTrivia}
                    data={triviaList}
                    scrollEnabled={false}
                    renderItem={_renderTriviaItem}
                    sliderWidth={width}
                    itemWidth={width}
                />
            </View>

        </View>
    );
};


export default ChatIBar;