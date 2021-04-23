import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { _scaleText, JOIN_BUTTON_COLOR, OPEN_CAMERA, OPEN_IMAGE_PICKER, OPEN_IMAGE_AND_GALLERY_PICKER, STATUS_BAR_PRIMARY_COLOR } from '../../../shared';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';


const CustomProfileImagePicker = ({
    src = '',
    onChange = () => { },
    plusIcon,
    containerStyle = {},
    imageStyle = {},
    onImageLoadFinished = () => { },
    onImageLoadStart = () => { },
}) => {

    const [showModal, toggleModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const openCamera = () => {
        OPEN_CAMERA({}).then((data) => {
            toggleModal(false)
            onChange(data)
        }).catch((err) => {
            toggleModal(false);
            console.log(err);
        });
    }
    const openGallery = () => {
        OPEN_IMAGE_PICKER({}).then((data) => {
            toggleModal(false)
            onChange(data)
        }).catch((err) => {
            toggleModal(false);
            console.log(err);
        });
    }
    const openCameraANdGalleryCommunityPicker = () => {
        OPEN_IMAGE_AND_GALLERY_PICKER(data => {
            // console.log('Data Image========', JSON.stringify(data))
            onChange(data)
            // callback({ filename: responseResize.name, mime: source.type, path: responseResize.uri ? responseResize.uri : source.path })
        })
    }
    return (
        <View style={{ alignItems: 'center', ...containerStyle }}>
            {plusIcon ?
                <TouchableOpacity
                    // onPress={() => toggleModal(true)}
                    onPress={() => openCameraANdGalleryCommunityPicker()}
                    style={styles.plus}
                >
                    <Icon
                        name='plus'
                        color='white'
                        size={_scaleText(22).fontSize}
                    />
                </TouchableOpacity>
                :
                <View>
                    <View style={styles.imageContainer}>
                        <FastImage
                            source={src ? { uri: src } : require('../../../assets/icons/user.png')}
                            style={styles.image}
                            onLoadStart={() => {
                                setLoading(true)
                                onImageLoadStart()
                            }}
                            onLoadEnd={() => { 
                                setLoading(false) 
                                onImageLoadFinished()
                            }}
                        >
                            {
                                isLoading &&
                                <View style={{ width: _scaleText(120).fontSize, height: _scaleText(120).fontSize, backgroundColor: 'gray', borderRadius: 5, opacity: 0.2, justifyContent: 'center' }}>
                                    <ActivityIndicator size={'large'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} animating={isLoading} />
                                </View>
                            }
                        </FastImage>
                    </View>

                    <TouchableOpacity
                        onPress={() => openCameraANdGalleryCommunityPicker()}
                        // onPress={() => toggleModal(true)}
                        style={styles.camContainer}>
                        <Icon
                            name='camera'
                            size={_scaleText(22).fontSize}
                        />
                    </TouchableOpacity>
                </View>}
            <Modal
                transparent
                animated
                animationType='slide'
                visible={false}
                onRequestClose={() => toggleModal(false)}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => toggleModal(false)} style={styles.modalContainer}>
                    <TouchableOpacity style={styles.itemsContainer}>
                        <Text style={styles.title}>Choose an action</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                onPress={openCamera}
                                style={styles.iconCont}
                            >
                                <Icon
                                    name='camera'
                                    size={_scaleText(35).fontSize}
                                />
                                <Text style={styles.iconName}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={openGallery}
                                style={styles.iconCont}
                            >
                                <Icon
                                    name='image'
                                    size={_scaleText(35).fontSize}
                                />
                                <Text style={styles.iconName}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

export default CustomProfileImagePicker;

const styles = StyleSheet.create({
    image: {
        width: _scaleText(120).fontSize,
        height: _scaleText(120).fontSize,
        // borderRadius: 100,
    },
    imageContainer: {
        width: _scaleText(120).fontSize,
        height: _scaleText(120).fontSize,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: JOIN_BUTTON_COLOR,
        overflow: 'hidden'
    },
    plus: {
        backgroundColor: STATUS_BAR_PRIMARY_COLOR,
        padding: _scaleText(5).fontSize,
        borderRadius: 50
    },
    camContainer: {
        backgroundColor: JOIN_BUTTON_COLOR,
        width: _scaleText(45).fontSize,
        height: _scaleText(45).fontSize,
        borderRadius: 50,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        zIndex: 9999,
        alignItems: 'center',
        right: _scaleText(5).fontSize
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    itemsContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: _scaleText(10).fontSize,
        borderTopRightRadius: _scaleText(10).fontSize,
        padding: _scaleText(20).fontSize,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    iconCont: {
        padding: _scaleText(20).fontSize,
        alignItems: 'center'
    },
    title: {
        fontFamily: 'SFProText-Bold',
        paddingVertical: _scaleText(10).fontSize,
        fontSize: _scaleText(18).fontSize,
        textAlign: 'center'
    },
    iconName: {
        fontFamily: 'SFProText-Bold',
        fontSize: _scaleText(12).fontSize,
        marginTop: _scaleText(10).fontSize,
        textAlign: 'center'
    }
});