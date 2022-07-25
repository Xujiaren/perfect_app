import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	Image,
} from 'react-native';

import theme from '../config/theme';
import asset from '../config/asset';

export class CommentEmpty extends Component {

    render() {
        return (
            <View style={[styles.bg_white ,styles.fd_c ,styles.ai_ct ,styles.jc_ct ,styles.pt_15 ,styles.pb_20]}>
                <Image source ={asset.perfect_icon.pf_comment} style={[styles.comment_empty]}  />
                <Text style={[styles.mt_15 ,styles.sm_label ,styles.tip_label]}>还没有评论，快来抢沙发~</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	...theme.base,
    comment_empty:{
        width:156,
        height:123,
    },
});