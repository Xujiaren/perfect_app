import React, { Component } from 'react';

import { StyleSheet, Text, View  } from 'react-native';

 class DashLine extends Component {
    render() {
        var len = this.props.len;
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        return <View style={[styles.dashLine, {width: this.props.width}]}>
            {
                arr.map((item, index) => {
                    return <Text style={[styles.dashItem, {backgroundColor: this.props.backgroundColor}]}
                                key={'dash' + index}> </Text>
                })
            }
        </View>
    }
}
const styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        flex: 1,
    }
})

export default  DashLine ;
