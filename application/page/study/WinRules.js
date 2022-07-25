import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import theme from '../../config/theme';
import request from '../../util/net'
class WinRules extends Component {

    static navigationOptions = {
        title: '规则',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.state = {
            rules: [],
            rule: ''
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        request.get('/config')
            .then(res => {
                let list = res.teacher_ranks_text.split(';')
                this.setState({
                    rules: list,
                    rule: res.teacher_ranks_text
                })
            })
    }

    render() {
        const { status } = this.state;


        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={[styles.pl_25, styles.pr_25, styles.mt_30]}>
                        <Text style={[styles.black_label, styles.default_label, styles.lh20_label]}>{this.state.rule}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,

});


export const LayoutComponent = WinRules;


export function mapStateToProps(state) {
    return {

    };
}