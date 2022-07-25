//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import theme from '../../../../config/theme';

// create a component
class Copyright extends Component {

    static navigationOptions = {
        title:'版权声明',
        headerRight: <View/>,
    };

    render() {
        return (
            <View style={[styles.container, styles.p_20]}>
                <Text style={styles.lh20_label}>
                版权号：*****；软件版权归属完美（广东）教育科技有限公司所有，专用于油葱学堂系统使用；在未得到完美（广东）教育科技有限公司书面允许的情况下，任何人不得以任何形式引用、复制、伪造和传播本文档的内容。
                </Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base
});

//make this component available to the app
export default Copyright;
