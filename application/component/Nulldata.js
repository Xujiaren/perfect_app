import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableOpacity
} from 'react-native';

import theme from '../config/theme';
import iconMap from '../config/icon';
import asset from '../config/asset';
const styles = StyleSheet.create({
	...theme.base,
	container: {
		flex: 1,
        backgroundColor: '#F7F7F7',
	},
	nullprint:{
        flexDirection:"column",
        justifyContent:"center",
        alignItems: 'center',
        marginTop: 120
    },
    nullImg:{
        width:66,
        height:66
    }
});

class Nulldata extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.nullprint}>
					<Image source={this.props.image} style={styles.nullImg} />
					<Text style={[styles.c99_label,styles.xl_label,styles.mt_25]}>{this.props.title}</Text>
				</View>
            </View>
        )
    }
}

export default Nulldata;