import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';

import theme from '../config/theme';

class CountDownButton extends Component {
	constructor(props) {
		super(props);

		const {time = 60} = props;
		this.time = time;

		this.timer = null;
		this.state = {
			time: time,
			sended: false,
			count: false,
			canSend: props.canSend,
		};

		this._onPress = this._onPress.bind(this);
		this._countdown = this._countdown.bind(this);
	}

	componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	componentWillReceiveProps(nextProps) {
		const {canSend} = nextProps;
		if (canSend !== this.props.canSend) {
			this.setState({
				canSend: canSend,
			});
		}
	}


	_onPress() {
		if (this.state.canSend) {
			this.timer = setTimeout(() => this._countdown(this.time), 1000);

			this.props.onPress && this.props.onPress();
		}
	}

	_countdown(time) {

		if (time > 1) {
			time--;
			this.setState({
				count: true,
				time: time,
			}, () => {
	    		this.timer = setTimeout(() => this._countdown(this.state.time), 1000);
	    		this.setState({
					sended: true,
				});
	    	});

		} else {
			this.setState({
				count: false,
			});
			clearTimeout(this.timer);
		}
	}

	render() {
		return (
			<TouchableOpacity onPress={this._onPress} disabled={(!this.state.count && !this.state.canSend)|| (this.state.count && this.state.canSend)}>
				<View style={[styles.container, this.props.style, !this.state.canSend && styles.disabledContainer, this.state.count && styles.onContainer]}>
					<Text style={[styles.sm_label,styles.countLabel, this.state.count && styles.onCountLabel]}>{this.state.count ? this.state.time : this.state.sended ? '重新发送' : '获取验证码'}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}


const styles = StyleSheet.create({
	...theme.base,
	container: {
		width:74,
		height:24,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
		opacity: 1,
		borderColor:'rgba(244,98,63,1)',
		borderWidth: 1,
		borderStyle:'solid',
		backgroundColor:'#F4623F',
	},
	onContainer: {
		borderColor: '#E73333',
	},
	countLabel: {
		color:'#FFFFFF',
	},
	onCountLabel: {
		color: '#FFFFFF',
	},
});


export default CountDownButton;
