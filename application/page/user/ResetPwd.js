import React, { Component } from 'react';
import { View, Text ,StyleSheet} from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';


class ResetPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text> ResetPwd </Text>
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = ResetPwd;

export function mapStateToProps(state) {
	return {
	};
}

