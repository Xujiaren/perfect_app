import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import {msgTime} from '../../util/common';

class AskCell extends Component {
    
    render() {
        const {ask, onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_c,styles.mt_10,,styles.pb_10,]} onPress={() => onPress && onPress()}>
                <Text style={[styles.c33_label,styles.lg_label]}>{ask.title}</Text>
                <View  style={[styles.fd_r,styles.col_1,styles.mt_10]}>
                    <View style={[styles.fd_r,styles.jc_sb,styles.col_1]}>
                        <Text style={[styles.sm_label,styles.c33_label,styles.lh18_label]} numberOfLines={3}>{ask.content}</Text>
                    </View>
                    {ask.gallery && ask.gallery.length > 0 ? 
                    <View style={[styles.pl_5]}>
                        <Image source={{uri: ask.gallery[0].fpath}}  style={[styles.bg_cover]} />
                    </View>
                    : null}
                </View>
                <Text style={[styles.tip_label,styles.sm_label]}>{ask.replyNum}个回答 · {ask.followNum}个关注 · {msgTime(ask.pubTime)}</Text>
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
    }
});

export default AskCell;
