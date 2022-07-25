import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

import theme from '../config/theme';

import LinearGradient from 'react-native-linear-gradient';


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
	linearGradient: {
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
	},
});

class Linearbtn extends Component {

	constructor(props) {
		super(props);

		this.state = {
			lcolor1:this.props.lcolor1,
			lcolor2:this.props.lcolor2,
		};
	}


	render() {
		return (
			<View>
				<LinearGradient colors={[this.state.lcolor1, this.state.lcolor2]} style={[styles.linearGradient,{width:this.props.width,height:this.props.height,borderRadius:this.props.borderRadius}]} >
					<Text style={[styles.buttonText,{color:this.props.color}]}>
						{this.props.title}
					</Text>
				</LinearGradient>
			</View>
		);
	}
}

export default Linearbtn;