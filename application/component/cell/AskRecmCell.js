import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';
class AskRecmCell extends Component {
    
    render() {
        const {ask,type ,onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_c,styles.mt_10,,styles.pb_10,styles.pl_15,styles.pr_20,!type&&styles.border_bt]} onPress={() => onPress && onPress()}>
                <View style={[styles.title, styles.row, styles.ai_ct]}>
                {ask.integral > 0 ? 
                    <View style={[styles.fd_r,styles.gold_btn, styles.mr_5]}>
                        <Image source={asset.gold_icon} style={[styles.gold_cover]} />
                        <Text style={[styles.cf5_label,styles.smm_label]}>{ask.integral}学分</Text>
                    </View> : null}
                    <Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>{ask.title.length>18?ask.title.slice(0,18)+'...':ask.title}</Text>
                    {ask.isTop == 1 ? <View style={[styles.fd_r,styles.gold_btns, styles.ml_5]}><Text style={[styles.sm_label,styles.white_label,styles.tip_btn]}>置顶</Text></View>: null}
                </View>
                {
                    ask.gallery && ask.gallery.length > 0 ?
                    <View style={[styles.fd_r,styles.mt_5,styles.pb_5]}>
                        <View style={[styles.col_1,styles.mr_5]}>
                            {
                                ask.isAdmin?
                                <Text style={[styles.sm_label,styles.c33_label,styles.lh18_label]} numberOfLines={3}>{ask.title.length>32?ask.content.slice(0,32)+'...':ask.title}</Text>
                                :
                                <Text style={[styles.sm_label,styles.c33_label,styles.lh18_label]} numberOfLines={3}>{ask.content.length>32?ask.content.slice(0,32)+'...':ask.content}</Text>
                            } 
                        </View>
                        <Image source={{uri: ask.gallery[0].fpath}}  style={[styles.sum_img]} />
                    </View>
                    :
                    <View style={[styles.mt_5,styles.pb_10]}>
                        {
                           ask.isAdmin?
                           <Text style={[styles.sm_label,styles.c33_label,styles.lh18_label]} numberOfLines={3}>{ask.title.length>40?ask.content.slice(0,40)+'...':ask.title}</Text>
                           :
                           <Text style={[styles.sm_label,styles.c33_label,styles.lh18_label]} numberOfLines={3}>{ask.content.length>40?ask.content.slice(0,40)+'...':ask.content}</Text> 
                        }
                       
                    </View>
                }

                <View style={[styles.fd_r,styles.ai_ct]}>
                    <View style={[styles.fd_r,styles.ai_ct]}>
                        <Image source={{uri: ask.avatar}} style={[styles.cell_cover]} />
                        <Text style={[styles.c33_label,styles.sm_label,styles.pl_5]}>{ask.nickname}</Text>
                    </View>
                    <Text style={[styles.tip_label,styles.sm_label,styles.pl_15]}>{ask.replyNum}个回答 · {ask.comment}个评论</Text>
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
    sum_img:{
        width: 115,
        height: 64,
        borderRadius: 5,
        backgroundColor: '#666666',
    },
    gold_cover:{
        width:10,
        height:8,
    },
    gold_btn:{
        width: 50,
        height:16,
        borderRadius: 12,
        paddingLeft: 2,
        paddingRight: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle:'solid',
        borderColor: '#F5A623',
    },
    gold_btns:{
        paddingLeft: 2,
        paddingRight: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    tip_btn:{
        width:30,
        height:16,
        borderRadius:1,
        display:'flex',
        textAlign:'center',
        lineHeight:16,
        backgroundColor: '#F4623F',
    },
    title:{

    },
    cell_cover:{
        width:22,
        height:22,
        borderRadius: 11,
        backgroundColor: '#dddddd',
    }
});

export default AskRecmCell;
