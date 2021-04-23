/* eslint-disable prettier/prettier */
import React, { Component, PureComponent } from 'react';
import { Image, View, ActivityIndicator, Platform, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLLYDE_LIGHT_GRAY_COLOR, COLLYDE_PRIMARY_BLUE_COLOR, TEXT_CONST, _scaleText } from '../../../shared';

class ImageItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadError: false,
            width: _scaleText(160).fontSize,
            height: _scaleText(160).fontSize,
        };
    }

    componentDidMount() {
        // this.setState(
        //     {
        //         isMounted: true
        //     },
        //     () => {
        //         Image.getSize(this.props.message, (width, height) => {
        //             const { resizeWidth, resizeHeight } = this._imageResize(width, height);
        //             if (this.state.isMounted) this.setState({ width: resizeWidth, height: resizeHeight });
        //         });
        //     }
        // );
    }
    componentWillUnmount() {
        // this.setState({
        //     isMounted: false
        // });
    }

    _imageResize = (width, height) => {
        const IMAGE_MAX_SIZE = 160;
        const scaleWidth = IMAGE_MAX_SIZE / width;
        const scaleHeight = IMAGE_MAX_SIZE / height;

        let scale = scaleWidth <= scaleHeight ? scaleWidth : scaleHeight;
        if (scale > 1) {
            scale = 1;
        }

        const resizeWidth = width * scale;
        const resizeHeight = height * scale;
        this.setState({ width: resizeWidth, height: resizeHeight })
    };

    render() {
        return (
            <View style={{}}>
                <FastImage
                    style={{
                        borderRadius: _scaleText(20).fontSize,
                        height: this.state.height, width: this.state.width
                    }}
                    source={{ uri: this.props.localUriPath ? this.props.localUriPath : this.props.message }}
                    //resizeMode='cover'
                    onLoad={(event) => {
                        const { nativeEvent } = event
                        const { width, height } = nativeEvent
                        this._imageResize(width, height)
                    }}
                    onLoadStart={() => {
                        if (!this.props.localUriPath) {
                            this.setState({ loading: true });
                        }
                    }}
                    onError={() => {
                        if (!this.props.localUriPath) {
                            this.setState({ loading: false, loadError: true });
                        }
                    }}
                    onLoadEnd={() => { this.setState({ loading: false }); }}
                >
                    {
                        this.state.loading &&
                        <View style={{ width: this.state.width, height: this.state.height, backgroundColor: 'gray', borderRadius: 5, opacity: 0.2, justifyContent: 'center' }}>
                            <ActivityIndicator size={'large'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} animating={this.state.loading} />
                        </View>
                    }
                    {
                        ((!(this.props.localUriPath || this.props.message)) || this.state.loadError) &&
                        <View style={{ width: this.state.width, height: this.state.height, backgroundColor: COLLYDE_LIGHT_GRAY_COLOR, borderRadius: 5, opacity: 0.5, justifyContent: 'center' }}>
                            <Text style={{ color: 'red', alignSelf: 'center' }}>{TEXT_CONST.COULD_NOT_LOAD_IMAGE}</Text>
                        </View>
                    }
                </FastImage>
            </View>
        );
    }
}

export { ImageItem };
