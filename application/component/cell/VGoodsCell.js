import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme';


class VGoodsCell extends Component {

    
    render() {

        const {good, onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_r, styles.bg_white,styles.mb_12]} onPress={() => onPress && onPress(good)}>
                <View style={[styles.item_cover]}>
                    <Image source={{uri:good.goodsImg}} mode='aspectFit' style={[styles.item_cover]} />
                </View>
                <View style={[styles.p_15,styles.fd_c,styles.jc_sb,styles.col_1]}>
                    <Text style={[styles.c33_label,styles.default_label]} numberOfLines={1}>{good.goodsName}</Text>
                    <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct]}> 
                        {
                            good.gtype == 1 ?
                            <Text style={[styles.sred_label,styles.default_label,styles.fw_label]}>免费</Text>
                        :null}
                        {
                            good.gtype == 2 ?
                            <Text style={[styles.sred_label,styles.default_label,styles.fw_label]}>¥{good.goodsAmountDTO.goodsAmount?good.goodsAmountDTO.goodsAmount:good.goodsAmount}</Text>
                        :null}
                        {
                            good.gtype == 3 ?
                            <Text style={[styles.sred_label,styles.default_label,styles.fw_label]}>{good.goodsIntegral}学分</Text>
                        :null}
                        {
                            good.gtype == 4 ?
                            <Text style={[styles.sred_label,styles.default_label,styles.fw_label]}>¥{good.goodsAmount}+{good.goodsIntegral}学分</Text>
                        :null}
                        
                        <Text style={[styles.sm_label,styles.tip_label]}>热销{good.saleNum}件</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    item_cover:{
        width:120,
        height:120,
    }
})

export default VGoodsCell;
