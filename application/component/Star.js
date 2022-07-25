import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
} from 'react-native';

import theme from '../config/theme';
import asset from '../config/asset';


class Star extends Component {

	constructor(props) {
		super(props);

		let value = props.value;
		let canChoose = false;
		if (props.onChoose) {
			canChoose = true;
		}

		this.state = {
			value: 0,
			canChoose: canChoose,
		};

		this._onChoose = this._onChoose.bind(this);
	}

	_onChoose(value) {
		this.setState({
			value: value,
		}, () => {
			this.props.onChoose && this.props.onChoose(value);
		});
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
									<Image source={on ? asset.star_full : asset.star} style={{width:15,height:15}} />
								</TouchableOpacity>
							);
						}

						return <View key={index} style={styles.srank}><Image source={on ? asset.star_full : asset.star} style={{width:15,height:15}} /></View>;
					})
				}
			</View>
		);
	}
}



const styles = StyleSheet.create({
	...theme.base,
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	rank: {
		padding: 3,
	},
});

Star.defaultProps = {
	value: 5,
	fontSize: 14,
};

export default Star;
