import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import Score from '../../component/Score'
// import {Emoji, EmojiView} from '../../component/emoji';
import {textToEmoji} from '../../util/emoji';
import asset from '../../config/asset';

class CommentCell extends Component {

    render() {
        const {index, comment, onPraise, onPreview,lastIdx , onReport,onUserInfo,onComment} = this.props;

        return (
            <TouchableOpacity style={[styles.bg_white, styles.pl_15, styles.pr_15,styles.pt_10,styles.fd_r]}   onPress={()=> onComment && onComment(index)}>
                <TouchableOpacity  onPress={()=> onUserInfo && onUserInfo(index)}>
                    <Image source={{uri:comment.avatar}} style={[styles.avatar_small]} />
                </TouchableOpacity>
                <View style={[styles.fd_c  ,styles.pl_10 ,styles.col_1, styles.pb_15,  lastIdx&&styles.bd_bt]}>
                    <View style={[styles.fd_r ,styles.ai_ct ,styles.jc_sb]}>
                        <View style={[styles.fd_c ]}>
                            <Text style={[styles.default_label ,styles.c33_label]}>{comment.username}</Text>
                            <View style={[styles.fd_r ,styles.ai_ct ,styles.mt_5]}>
                                {/* <Score val={comment.score} /> */}
                                <Text style={[styles.sm_label ,styles.tip_label]}>{comment.pubTimeFt}</Text>
                            </View>
                        </View>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.jc_sb,styles.mr_10]} 
                                onPress={() => onReport && onReport(index)}
                            >
                                <Image source={asset.report} style={styles.report_icon} />
                                <Text style={[styles.sm_label ,styles.tip_label ,styles.ml_5, styles.tip_label]}>举报</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.jc_sb]} onPress={() => onPraise && onPraise(index)}>
                                <Text style={[styles.icon_comment, styles.tip_label, comment.like && styles.red_label]}>{iconMap('dianzan')}</Text>
                                <Text style={[styles.sm_label ,styles.tip_label ,styles.ml_5, styles.tip_label, comment.like && styles.red_label]}>{comment.praise}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.mt_5, styles.lh16_label]}>
                        <Text style={[styles.default_label ,styles.lh20_label ,styles.c33_label ,styles.mt_5]}>{comment.content}</Text>
                    </View>
                    {comment.galleryList.length > 0 ?
                    <View style={[styles.fd_r ,styles.mt_10 ,styles.mb_10 ,styles.f_wrap]}>
                        {
                            comment.galleryList.map((gallery, i)=>{
                                return (
                                    <TouchableOpacity onPress={() => onPreview && onPreview(comment.galleryList, i) } key={'gallery_' + comment.commentId + '_' + i}>
                                        <Image source={{uri:gallery.fpath}} style={[styles.thumb, styles.mr_10,styles.mb_10]}/>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>
                    : null}
                    {comment.childList.length > 0 ?
                    <View>
                        {
                            comment.childList.map((ccoment, idx)=>{
                                let replyList = textToEmoji(ccoment.content) 

                                return (
                                    <View style={[styles.reply ,styles.p_12 ,styles.mt_5]} key={'ccoment_' + ccoment.commentId}>
                                        <Text style={[styles.brown_label, styles.default_label]}>管理员回复：</Text>
                                        {
                                            replyList.map((rpy,idx)=>{
                                                return(
                                                    <View key={'rpy' + idx} style={[styles.chatmsg_txt]}>
                                                        {
                                                            rpy.msgType === 'text' ?
                                                            <Text style={[styles.default_label,styles.c33_label]}>{rpy.msgCont}</Text>
                                                            :
                                                            <Image source={{uri:rpy.msgImage}} style={{width:20,height:20}} />
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                );
                            })
                        }
                    </View>
                    : null}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    thumb:{
        width:67,
        height:67,
        backgroundColor:'#f5f5f5',
        borderRadius:5,
    },
    reply:{
        backgroundColor:'#F4F4F4',
        lineHeight:18,
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center'
    },
    bd_bt:{
        borderBottomWidth:1,
        borderStyle:'solid',
        borderBottomColor:'#E4E7ED'
    },
    chatmsg_txt:{
        flexDirection:'row',
    },
    report_icon:{
        width:12,
        height:12
    },
    icon_comment: {
        fontFamily: 'iconfont',
        fontSize: 12,
    },
});

export default CommentCell;
