import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme';

class AskHotCell extends Component {
    
    render() {
        const {ask, type, onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_r, styles.mt_10, styles.pb_10, styles.pl_15, styles.pr_20, !type && styles.border_bt]} onPress={() => onPress && onPress()}>
                <View style={[styles.fd_c,styles.jc_sb,styles.col_1,styles.pl_5]}>
                    <Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>{ask.title}</Text>
                    <Text style={[styles.tip_label , styles.sm_label]}>{ask.replyNum}热度</Text>
                </View>
                {ask.gallery && ask.gallery.length > 0 ? 
                <View style={[styles.pl_10]}>
                    <Image source={{uri: ask.gallery[0].fpath}} style={[styles.bg_cover]} />
                </View>
                : null}
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
    }
});

export default AskHotCell;
