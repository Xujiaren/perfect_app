import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,Platform } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';
import {learnNum} from '../../util/common';

class VodCell extends Component {
    
    render() {
        const {course, exchange = false, onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_r, styles.pb_20]} onPress={() => onPress && onPress(course)}>
                <View>
                    <Image source={{uri:course.courseImg}} resizeMode='stretch' style ={[styles.item_cover]} />
                    
                    {
                        course.ctype !== 3 ?
                        <View style ={[Platform.OS=='ios'?styles.item_tips_hit:styles.item_tips_hits]}>
                            <Text style={[styles.icon, styles.sm8_label ,styles.white_label]}>{iconMap('youyinpin')}</Text>
                            <Text style ={[styles.sm8_label ,styles.white_label, styles.ml_5]}>{course.chapter}讲</Text>
                        </View>
                    :null}
                    
                    {
                        course.isNew === 1 ?
                        <View style={[styles.cate_new_cover]} >
                            <Image source={asset.cate_new_icon} style={[styles.cate_new_icon]}  />
                        </View>
                    : null}
                </View>
                <View style ={[styles.fd_c, styles.pl_10 ,styles.jc_sb ,styles.col_1]}>
                    <View style ={[styles.d_flex ,styles.fd_c]}>
                        <Text style ={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1}>{course.courseName}</Text>
                        <Text style ={[styles.sml_label ,styles.tip_label,styles.mt_5]} numberOfLines={1}>{course.summary}</Text>
                        <Text style={[styles.red_label,styles.sm_label,styles.mt_5]}>{course.integral > 0 ? course.integral + '学分' : '免费'}</Text>
                    </View>

                    {exchange ?
                    <View style ={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_5 ]}>
                        <View style={[styles.row, styles.ai_ct]}>
                            <TouchableOpacity style={[styles.p_3, styles.pl_5, styles.pr_5, styles.border_orange, styles.circle_20]}>
                                <Text style={[styles.smm_label, styles.sred_label]}>兑换</Text>
                            </TouchableOpacity>
                            <Text style={[styles.sred_label, styles.smm_label, styles.ml_5]}>200游学分</Text>
                        </View>
                        <Text style ={[styles.smm_label, styles.gray_label]}>100人兑换</Text>
                    </View>
                    :<View style ={[styles.fd_r ,styles.ai_ct ,styles.mt_5 ]}>
                        {
                            course.teacherId > 0 ?
                            <View style ={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mr_15]}>
                                <Text style={[styles.icon, styles.sm8_label ,styles.orange_label]}>{iconMap('jiangshitubiao')}</Text>
                                <Text style ={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{course.teacherName}</Text>
                            </View>
                        : null}
                        <View style ={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                            <Text style={[styles.icon, styles.sm8_label ,styles.orange_label]}>{iconMap('bofangtubiao')}</Text>
                            <Text style ={[styles.sm_label, styles.gray_label, styles.ml_5]}>{learnNum(course.hit)}</Text>
                        </View>
                    </View>}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    item_cover:{
        width:136,
        height:72,
        borderRadius:5,
        backgroundColor:'#fafafa',
    },
    item_tips_hit:{
        position:'absolute',
        bottom: 5,
        right: 5,
        height:14,
        width: 40,
        backgroundColor:'rgba(0,0,0,0.65)',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    item_tips_hits:{
        position:'absolute',
        bottom: 16,
        right: 5,
        height:14,
        width: 40,
        backgroundColor:'rgba(0,0,0,0.65)',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    cate_new_cover: {
        position:'absolute',
        top: -5,
        right: -5,
    },
    cate_new_icon: {
        width: 18,
        height: 12
    }
});

export default VodCell;
