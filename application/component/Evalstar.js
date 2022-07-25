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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	starlist:{
		flexDirection: 'row',
	},
	starlist_item:{
		width:100,
		height:14
	},
});

class Evalstar extends Component {
    render() {
        return (
            <View style={styles.fivestar}>
                {this.props.refs == 1 ? <Image source={asset.starone} style={styles.starlist_item}></Image> : null}
				{this.props.refs == 2 ? <Image source={asset.startwo} style={styles.starlist_item}></Image> : null}
				{this.props.refs == 3 ? <Image source={asset.starthree} style={styles.starlist_item}></Image> : null}
				{this.props.refs == 4 ? <Image source={asset.starfour} style={styles.starlist_item}></Image> : null}
				{this.props.refs == 5 ? <Image source={asset.starfive} style={styles.starlist_item}></Image> : null}
            </View>
        )
    }
}

export default Evalstar;