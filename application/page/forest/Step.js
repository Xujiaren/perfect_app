//步数
//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {theme} from '../../config';

// create a component
class Step extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Step</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = Step;

export function mapStateToProps(state) {
	return {
        
	};
}