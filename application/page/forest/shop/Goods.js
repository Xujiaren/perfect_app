//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import HtmlView from '../../../component/HtmlView';
import theme from '../../../config/theme'

class Goods extends Component {

    static navigationOptions = {
        title:'商品详情',
        headerRight: <View/>,
    };

    goods = this.props.navigation.getParam('goods', {})

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Image style={[styles.cover, styles.bg_wred]} source={{uri: this.goods.goodsImg}}/>
                    <View style={[styles.p_15, styles.bg_white]}>
                        <Text style={[styles.lg18_label]}>{this.goods.goodsName}</Text>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                            <Text style={[styles.sred_label]}>{this.goods.cardNum}兑换券</Text>
                            <Text style={[styles.sm_label, styles.tip_label]}>已售出 {this.goods.saleNum}</Text>
                        </View>
                    </View>
                    <View style={[styles.p_15, styles.bg_white, styles.mt_15, styles.mb_10]}>
                        <Text>商品详情</Text>
                    </View>
                    <HtmlView html={this.goods.summary} />
                </ScrollView>
                <TouchableOpacity style={[styles.bg_sred, styles.p_15, styles.ai_ct, styles.jc_ct]}>
                    <Text style={[styles.white_label, styles.lg_label]}>兑换</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    cover: {
        width: theme.window.width,
        height: theme.window.width,
    }
});

export const LayoutComponent = Goods;

export function mapStateToProps(state) {
	return {
        
	};
}