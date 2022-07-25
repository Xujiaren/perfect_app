//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

import theme from '../../../config/theme'
import iconMap from '../../../config/font'

// create a component
class Order extends Component {

    static navigationOptions = {
        title:'兑换',
        headerRight: <View/>,
    };

    state = {
        num: 1,
    }

    render() {
        const {num} = this.state

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={[styles.p_15, styles.bg_white, styles.mt_10, styles.row, styles.ai_ct, styles.jc_sb]}>
                        <View style={[styles.row, styles.ai_ct]}>
                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('didian')}</Text>
                            <View style={[styles.ml_5]}>
                                <Text>李文 1381233333</Text>
                                <Text>上海市普陀区关安路233弄223号</Text>
                            </View>
                        </View>
                        <Text style={[styles.icon, styles.tip_label]}>{iconMap('right')}</Text>
                    </View>
                    <View style={[styles.p_15, styles.bg_white, styles.mt_10, styles.row, styles.ai_ct]}>
                        <View style={[styles.cover, styles.bg_sred]}/>
                        <View style={[styles.info, styles.ml_10, styles.jc_sb]}>
                            <Text style={[styles.lh20_label]}>完美王牌产品芦荟胶补水保湿美白祛痘祛斑</Text>
                            <Text style={[styles.sred_label]}>300兑换券</Text>
                        </View>
                    </View>
                    <View style={[styles.mt_10, styles.p_15, styles.bg_white, styles.row, styles.ai_ct, styles.jc_sb, styles.border_bt]}>
                        <Text>数量选择：</Text>
                        <View style={[styles.row, styles.ai_ct]}>
                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('cart-min')}</Text>
                            <Text style={[styles.ml_10]}>{num}</Text>
                            <Text style={[styles.icon, styles.sred_label, styles.ml_10]}>{iconMap('cart-plus')}</Text>
                        </View>
                    </View>
                    <View style={[styles.p_15, styles.bg_white, styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text>拥有兑换券：</Text>
                        <Text style={[styles.sred_label]}>3000</Text>
                    </View>
                </ScrollView>
                <View style={[styles.bg_white, styles.p_10, styles.row, styles.ai_ct]}>
                    <View style={[styles.col_1]}>
                        <Text>小计：<Text style={[styles.sred_label]}>300</Text></Text>
                    </View>
                    <View style={[styles.col_1]}>
                        <Text>余：200</Text>
                    </View>
                    <TouchableOpacity style={[styles.col_2, styles.p_10, styles.bg_sred, styles.ai_ct, styles.jc_ct, styles.circle_5]}>
                        <Text style={[styles.white_label]}>兑换</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    cover: {
        width: 75,
        height: 75,
    },
    info: {
        width: theme.window.width - 115,
        height: 75,
    }
});

export const LayoutComponent = Order;

export function mapStateToProps(state) {
	return {
        
	};
}