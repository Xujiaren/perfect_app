import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';

class GoodsCell extends Component {
    
    render() {
        const {good, onPress, style={},type,btype,etype,itype} = this.props;

        // type  0 会员专享礼   1 讲师专享  2 新品推荐
        // btype 0 无白色背景   1 有
        // etype 0 无热销      1  有
        // itype 0 无图片背景   1 有

        return (
            <TouchableOpacity style ={[style, styles.fd_c, styles.pb_15,(btype === 1)&&styles.bg_white,styles.mb_12]} onPress={() => onPress && onPress(good)}>
                <View style={[styles.imgBox,{width:style.width,height:style.width,paddingLeft:8,paddingRight:8,paddingTop:8}]}>
                    <Image source={{uri:good.goodsImg}} mode='aspectFit' style ={[styles.item_cover,(itype===1)&&styles.bgImg,{width:style.width-16,height:style.width-16}]} />
                    {/* {
                        type === 0 ?
                        <View style={[styles.tips,styles.vip_tips]}>
                            <Text style={[styles.smm_label ,styles.c33_label,styles.fw_label]}>Lv.{good.ulevel}</Text>
                        </View>
                    :null} */}
                    {
                        type === 1 ?
                        <View style={[styles.tips,styles.lect_tips]}>
                            <Text style={[styles.smm_label ,styles.white_label,styles.fw_label]}>{good.tlevel == 1 ? '讲师' : good.tlevel == 2 ? '初级' : good.tlevel == 3 ? '中级' : good.tlevel == 4 ? '高级' : '讲师'}</Text>
                        </View>
                    :null}

                    {
                        type === 2 ?
                        <View style={[styles.limit_tips]}>
                            <Text style={[styles.smm_label ,styles.white_label,styles.fw_label]}>限时抢购</Text>
                        </View>
                    :null}

                    {
                        type === 4 &&  good.tagList.length > 0 && good.tagList[0].tagName.length > 0 ?
                        <LinearGradient colors={['#EC008C', '#FC8068']} style={[styles.popu_tips]} >
                            <Text style={[styles.smm_label ,styles.white_label,styles.fw_label]}>{good.tagList[0].tagName}</Text>
                        </LinearGradient>
                    :null}

                </View>
                <View style ={[styles.fd_c, styles.pl_10 ,styles.jc_sb ,styles.col_1,styles.mt_8]}>
                    <Text style ={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1}>{good.goodsName}</Text>
                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pr_10,styles.mt_5]}>
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
                            <Text style={[styles.sred_label,styles.default_label,styles.fw_label]} numberOfLines={1}>{good.goodsIntegral}学分</Text>
                        :null}
                         {
                            good.gtype == 4 ?
                            <Text style={[styles.sred_label,styles.default_label,styles.fw_label]} numberOfLines={1}>¥{good.goodsAmount}+{good.goodsIntegral}学分</Text>
                        :null}
                        {
                            etype === 1 ?
                            <Text style={[styles.sml_label,styles.tip_label]}>热销{good.saleNum}件</Text>
                        :null}
                    </View>
                    
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    imgBox:{
        position:'relative',
    },
    tips:{
        position:'absolute',
        top:12,
        right:12,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
    },
    vip_tips:{
        height:15,
        width:43,
        backgroundColor:'#FFEB3B',
    },
    lect_tips:{
        height:15,
        paddingLeft:2,
        paddingRight:2,
        backgroundColor:'#FF635B'
    },
    limit_tips:{
        position:'absolute',
        top:4,
        left:4,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
        height:15,
        paddingLeft:2,
        paddingRight:2,
        backgroundColor:'#FF635B'
    },  
    popu_tips:{
        position:'absolute',
        top:4,
        left:4,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:15,
        width:26,
        borderTopLeftRadius:3,
        borderBottomRightRadius:3
    },
    bgImg:{
        backgroundColor:'#F8F8F8'
    }
});

export default GoodsCell;
