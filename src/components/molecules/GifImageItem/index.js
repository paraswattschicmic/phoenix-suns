/* eslint-disable prettier/prettier */
import React, { Component, PureComponent } from 'react';
import { Image, View, ActivityIndicator, Platform, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { _scaleText } from '../../../shared';

class GifImageItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }


    render() {
        return (
            <FastImage
                resizeMode='cover'
                style={{ width: ((Dimensions.get('window').width / 3) - 13), height: ((Dimensions.get('window').width / 3) - 10) }}
                source={{ uri: this.props.imageUrl }}
                onLoadStart={() => {
                    this.setState({ loading: true });
                }}
                onLoadEnd={() => { this.setState({ loading: false }); }}
            >
                {
                    this.state.loading &&
                    <View style={{ width: ((Dimensions.get('window').width / 3) - 13), height: ((Dimensions.get('window').width / 3) - 10), backgroundColor: 'gray', borderRadius: 5, opacity: 0.2, justifyContent: 'center' }}>
                        <ActivityIndicator size={'large'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} animating={this.state.loading} />
                    </View>
                }
            </FastImage>
        );
    }
}

export { GifImageItem };
