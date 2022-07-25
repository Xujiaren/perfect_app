import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	Modal,
	Platform,
    TouchableOpacity,
	TouchableHighlight,
	View,
	DatePickerIOS,
    DatePickerAndroid,
} from 'react-native';

import PropTypes from 'prop-types';

import theme from '../config/theme';

class DatePicker extends Component {

	constructor(props) {
		super(props);

        this.isReady = false;

        this.state = {
            selectedDate: this.props.initialDate ? this.props.initialDate : new Date(),
            minDate: null,
            maxDate: null,
            showModal: false
        };

        this.initComponent = this.initComponent.bind(this);
        this.openDatePicker = this.openDatePicker.bind(this);
        this.openIOSDatePicker = this.openIOSDatePicker.bind(this);
        this.openAndroidDatePicker = this.openAndroidDatePicker.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.renderModalIOS = this.renderModalIOS.bind(this);
        this.handlePressDone = this.handlePressDone.bind(this);
        this.handlePressCancel = this.handlePressCancel.bind(this);
	}

	componentDidMount() {
        this.initComponent();
    }

    initComponent() {
        const selectedDate = this.props.initialDate ? this.props.initialDate : new Date();
        const minDate = this.props.minDate ? this.props.minDate : new Date(1900, 1, 1);
        const maxDate = this.props.maxDate ? this.props.maxDate : new Date();

        this.setState({
            selectedDate,
            minDate,
            maxDate
        });

        this.isReady = true;
    }

    openIOSDatePicker() {
        this.setState({ showModal: true });
    }

    openAndroidDatePicker() {
        DatePickerAndroid.open({
            date: this.state.selectedDate,
            minDate: this.state.minDate,
            maxDate: this.state.maxDate
        })
        .then((result) => {
            if (result.action === DatePickerAndroid.dateSetAction) {
                const selectedDate = new Date(result.year, result.month, result.day);

                this.setState({ selectedDate });
                this.props.onDone && this.props.onDone(selectedDate);
            } else if (result.action === DatePickerAndroid.dismissedAction) {
                this.props.onCancel && this.props.onCancel();
            }
        });
    }

    openDatePicker() {
        if (!this.isReady) {
            return;
        }

        if (Platform.OS === 'ios') {
            this.openIOSDatePicker();
        } else if (Platform.OS === 'android') {
            this.openAndroidDatePicker();
        }
    }

    handlePressDone() {
        this.setState({ showModal: false });
        this.props.onDone && this.props.onDone(this.state.selectedDate);
    }

    handlePressCancel() {
        this.setState({ showModal: false });
        this.props.onCancel && this.props.onCancel();
    }

    handleDateChange(selectedDate) {
        this.setState({ selectedDate });
    }

    renderModalIOS() {
        if (Platform.OS === 'ios') {
            return (
                <Modal
                    transparent={true}
                    visible={this.state.showModal}
                >
                    <TouchableOpacity onPress={this.handlePressCancel} style={{flex:1}}></TouchableOpacity>
                    <View style={styles.modalContainer}>
                        
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <TouchableHighlight
                                    style={styles.cancel}
                                    underlayColor={'transparent'}
                                    onPress={this.handlePressCancel}
                                >
                                    <Text style={styles.text}>{this.props.cancelText}</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.btn}>
                                <TouchableHighlight
                                    style={styles.done}
                                    underlayColor={'transparent'}
                                    onPress={this.handlePressDone}
                                >
                                    <Text style={styles.text}>{this.props.doneText}</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <DatePickerIOS
                            style={styles.datePickerIOS}
                            date={this.state.selectedDate}
                            mode={'date'}
                            minimumDate={this.state.minDate}
                            maximumDate={this.state.maxDate}
                            onDateChange={(date) => this.handleDateChange(date)}
                        />
                    </View>
                </Modal>
            );
        }

        return null;
    }

	render() {
		return (
            <View>
                {this.renderModalIOS()}
            </View>
        );
	}
}

DatePicker.propTypes = {
    onDone: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    initialDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    cancelText: PropTypes.string,
    doneText: PropTypes.string
};

DatePicker.defaultProps = {
    cancelText: '取消',
    doneText: '确定'
};

const styles = StyleSheet.create({
	modalContainer: {
        width: theme.window.width,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
    },
    btnContainer: {
        width: theme.window.width,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: 'lightgray',
        paddingTop: 10
    },
    datePickerIOS: {
        backgroundColor: 'white'
    },
    btn: {
        flex: 1,
        paddingHorizontal: 15
    },
    cancel: {
        alignItems: 'flex-start'
    },
    done: {
        alignItems: 'flex-end'
    },
    text: {
        color: '#138BE4'
    }
});


export default DatePicker;