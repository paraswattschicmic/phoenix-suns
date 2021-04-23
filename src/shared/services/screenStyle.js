import { Dimensions, PixelRatio } from 'react-native';

let screenW = Math.round(Dimensions.get('window').width);
let screenH = Math.round(Dimensions.get('window').height);

let fontScale = PixelRatio.getFontScale();
let pixelRatio = PixelRatio.get();

// Ipone 11 13.56
const designWidth = 414.0;
const designHeight = 896.0;

let screenPxW = PixelRatio.getPixelSizeForLayoutSize(screenW);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(screenH);

export function setSpText(size) {
    var scaleWidth = screenW / designWidth;
    var scaleHeight = screenH / designHeight;
    var scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round(size * scale/fontScale + 0.5);
    return size;
}

export function scaleSizeH(size) {
    var scaleHeight = size * screenPxH / designHeight;
    size = Math.round((scaleHeight / pixelRatio + 0.5));
    return size;
}

export function scaleSizeW(size) {
    var scaleWidth = size * screenPxW / designWidth;
    size = Math.round((scaleWidth/pixelRatio + 0.5));
    return size;
}

