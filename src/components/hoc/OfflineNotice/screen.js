import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

/**
 * Component
 * - Offline Notice bar
 * - this component render the exact children and then at the bottom most of the screen add a bar if internet is not connected
 */
class OfflineNotice extends PureComponent {
    render() {
        return (
            <View style={{ height: '100%', width: '100%' }}>
                {this.props.children}
                {!this.props.isNetConnected && <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>No Internet Connection</Text>
                </View>}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        // position: 'absolute',
        //top: 30
    },
    offlineText: {
        color: '#fff'
    }
});
export default OfflineNotice;