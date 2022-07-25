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
	rank: {
		padding: 3,
	}
});

class Rank extends Component {

	constructor(props) {
		super(props);

		let value = props.value;
		let canChoose = false;
		if (props.onChoose) {
			canChoose = true;
		}

		this.state = {
			value: value,
			canChoose: canChoose,
		};

		this._onChoose = this._onChoose.bind(this);
	}

	_onChoose(value) {
		this.setState({
			value: value
		}, () => {
			this.props.onChoose && this.props.onChoose(value);
		})
	}

	render() {
		return (
			<View style={[styles.container, this.props.style]}>
				{
					[1, 2, 3, 4, 5].map((val, index) => {
						let on = val <= this.state.value;

						if (this.state.canChoose) {
							return (
								<TouchableOpacity key={index} style={styles.rank} onPress={() => this._onChoose(val)}>
									
									<Image source={on ? asset.fullstar : asset.star} style={{width:15,height:15}}></Image>
								</TouchableOpacity>
							)
						}

						return <View key={index} style={styles.srank}><Image source={on ? asset.fullstar : asset.star} style={{width:15,height:15}}></Image></View>
					})
				}
			</View>
		);
	}
}

Rank.defaultProps = {
	value: 5,
	fontSize: 14
};

export default Rank;