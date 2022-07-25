import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';

class SpecialCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const {special, onPress,type} = this.props;

        return(
            <TouchableOpacity 
                style={[styles.articleItems,!type&&styles.border_bt ,!type&&styles.mb_15]}
                onPress={() => onPress && onPress(special)}
            >
                <View style={[styles.arthead]}>
                    <Image style={[styles.arthead_cover]}  source={{uri:special.articleImg}} />
                </View>
                <View style={[styles.d_flex ,styles.fd_c  ,styles.jc_sb ,styles.mt_15]}>
                    <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label ,styles.col_1]} numberOfLines={1}>{special.title}</Text>
                    <Text style={[styles.tip_label ,styles.sm_label,styles.mt_5]} numberOfLines={1}>{special.summary}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    articleItems:{
        width:'100%',
        paddingBottom:15
    },
    arthead:{
        position:'relative',
        height:130,
    },
    arthead_cover:{
        width:'100%',
        height:130,
        borderRadius:5,
        backgroundColor:'#fafafa'
    },
    artbottom:{
        width:'100%',
        height:25,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        position:'absolute',
        bottom:0,
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        lineHeight:25
    },
    artbot:{
        fontSize:12,
        color:'#ffffff',
        paddingLeft:4
    }
});

export default SpecialCell;
