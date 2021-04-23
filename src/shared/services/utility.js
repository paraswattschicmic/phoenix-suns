import { scaleText as scale } from 'react-native-text';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePickerCommunity from 'react-native-image-picker';
import messaging from '@react-native-firebase/messaging';
import ImageResizer from 'react-native-image-resizer';
import { TYPE_IMAGE_JPEG } from '../constants/sendbird';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const _checkValidPhoneNumber = (code = 'US', number = '') => {
    if (number) {
        let phoneNumber = parsePhoneNumberFromString(number, code);
        return phoneNumber ? phoneNumber.isValid() : false;
    }
}

export const _scaleText = (fontSize) => {
    return scale({ fontSize });
}

export const OPEN_IMAGE_PICKER = ({ mediaType = 'photo' }) => {
    return ImagePicker.openPicker({
        mediaType,
    }).then(({ filename, mime, path, sourceURL }) => {
        return { filename, mime, path: sourceURL ? sourceURL : path }
    });
}

export const OPEN_IMAGE_AND_GALLERY_PICKER = (callback) => {
    var options = {
        title: 'Select Image',
        customButtons: [
        ],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };
    return ImagePickerCommunity.showImagePicker(options, response => {
        //console.log('Response = ', response);
        if (response.didCancel) {
            // console.log('User cancelled image picker');
        } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            //console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
        } else {
            let source = response;

            if (source.type == TYPE_IMAGE_JPEG) {
                let newHeight = response.height;
                let newWidth = response.width;

                if (newWidth > 400 && newWidth < 1000) {
                    newWidth = newWidth / 2
                    newHeight = newHeight / 2
                }
                else if (newWidth > 999 && newWidth < 2000) {
                    newWidth = newWidth / 4
                    newHeight = newHeight / 4
                }
                else if (newWidth > 1999) {
                    newWidth = newWidth / 8
                    newHeight = newHeight / 8
                }


                ImageResizer.createResizedImage(response.uri, newWidth, newHeight, 'JPEG', 50, 0)
                    .then(responseResize => {
                        // console.log('responseResize', responseResize);
                        callback({ filename: responseResize.name, mime: source.type, path: responseResize.uri ? responseResize.uri : source.uri })

                        // response.uri is the URI of the new image that can now be displayed, uploaded...
                        // response.path is the path of the new image
                        // response.name is the name of the new image with the extension
                        // response.size is the size of the new image
                    })
                    .catch(err => {
                        console.log(err)
                        // Oops, something went wrong. Check that the filename is correct and
                        // inspect err to get more details.
                    });
            }
            else {
                callback({ filename: source.fileName, mime: source.type, path: source.uri })
            }
            // this.setState({
            //     filePath: source,
            // });
        }
    });
    // return ImagePicker.openPicker({
    //     mediaType,
    // }).then(({ filename, mime, path, sourceURL }) => {
    //     return { filename, mime, path: sourceURL ? sourceURL : path }
    // });
}

export const OPEN_CAMERA = ({ mediaType = 'photo' }) => {
    return ImagePicker.openCamera({
        mediaType,
    }).then(({ filename, mime, path, sourceURL }) => {
        return { filename, mime, path: sourceURL ? sourceURL : path }
    });
}

export const GET_FCM_TOKEN = () => {

    return messaging().getToken().then(token => {
        console.log(">>>> FCM Token",token);
        return token;
    });
}