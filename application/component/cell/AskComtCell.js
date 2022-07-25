import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';

class AskComtCell extends Component {
    
    render() {
        const {ask, idx,type = 0 ,onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_r,styles.mt_10,,styles.pb_10,]} onPress={() => onPress && onPress(ask)}>
                <Image source={''} style={[styles.avatar]}  />
                <View style={[styles.fd_c,styles.pl_12,styles.col_1]}>
                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb]}>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Text style={[styles.default_label,styles.c33_label]}>韩钰</Text>
                            {
                                type === 0 ?
                                <View style={[styles.fd_r,styles.ai_ct]}>
                                    {
                                        idx % 2 === 0 ?
                                        <View style={[styles.fd_r,styles.ai_ct,styles.integal_btn,styles.ml_10]}>
                                            <Image source={asset.gold_icon} style={[styles.gold_cover]} />
                                            <Text style={[styles.cf5_label,styles.smm_label]}>已悬赏10学分</Text>
                                        </View>
                                        :
                                        <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.agree_btn,styles.ml_10]}>
                                            <Text style={[styles.sred_label,styles.sm_label]}>采纳</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            :null}
                            
                        </View>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <View style={[styles.fd_r,styles.ai_ct]}>
                                <Text style={[styles.tip_label,styles.sm_label]}>559</Text>
                            </View>
                            <View style={[styles.fd_r,styles.ai_ct,styles.ml_15]}>
                                <Text style={[styles.tip_label,styles.sm_label]}>559</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.sm_label,styles.tip_label,styles.mt_5]}>2019-10-18</Text>

                    <Text style={[styles.c33_label,styles.default_label,styles.mt_12,styles.lh18_label]}>我觉得课程不错，老师讲解很到位，通俗易懂，是今年最好的课程了。</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    bg_cover:{
        width:100,
        height:64,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    bg_ty_cover:{
        width: 115,
        height: 64,
    },
    avatar:{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#dddddd',
    },
    gold_cover:{
        width:10,
        height:8,
    },
    integal_btn:{
        minWidth: 80,
        height: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle:'solid',
        borderColor: '#F5A623',
        paddingLeft: 4,
        paddingRight: 4,
    },
    agree_btn:{
        width: 45,
        height: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEAE5',
        borderRadius: 5,
    }
});

export default AskComtCell;
