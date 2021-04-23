/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Modal } from 'react-native';
import { _scaleText, JOIN_BUTTON_COLOR, OPEN_CAMERA, OPEN_IMAGE_PICKER } from '../../../shared';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const ImageFilePicker = ({
    src = '',
    onChange = () => { },
    containerStyle = {},
}) => {
    const [showModal, toggleModal] = useState(false);
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
    return (
        <View style={{ alignItems: 'center', ...containerStyle }}>
            <Modal
                transparent
                animated
                animationType='slide'
                visible={showModal}
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

export default ImageFilePicker;

const styles = StyleSheet.create({
    image: {
        width: _scaleText(130).fontSize,
        height: _scaleText(130).fontSize,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: JOIN_BUTTON_COLOR
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