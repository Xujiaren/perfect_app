import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import {formatTimeStampToTime} from '../../util/common'

class ActivityCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
        }
    }

    render() {
        const {activity, onPress,type} = this.props;
        const {width} = this.state;

        let tip = '未开始'
        var nowTime = new Date();
        let nowdate = nowTime.getTime();

        if(nowdate < activity.startTime * 1000){
            tip = '未开始'
        } else if(nowdate > activity.startTime * 1000 && nowdate < activity.endTime * 1000){
            tip = '进行中'
        } else {
            tip = '已结束'
        }


        return(
            <TouchableOpacity 
                style={[styles.articleItems,!type&&styles.border_bt ,!type&&styles.mb_15]}
                onPress={() => onPress && onPress(activity)}
            >
                <View style={[styles.arthead]}>
                    <Image style={[styles.arthead_cover]}  source={{uri:activity.stype==8?activity.squadImg:activity.activityImg}} />
                    <View style={[styles.topright]}>
                        <Text style={[styles.sm_label,styles.white_label]}>{tip}</Text>
                    </View>
                    <View style={[styles.artbottom]}>
                        <Text style={[styles.artbot]}>{formatTimeStampToTime(activity.beginTime * 1000)} - {formatTimeStampToTime(activity.endTime * 1000)}</Text>
                    </View>
                </View>
                <View style={[styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.mt_15]}>
                    <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label ,styles.col_1]} numberOfLines={1}>{activity.stype==8?activity.squadName:activity.title}</Text>
                    <Text style={[styles.tip_label ,styles.sm_label]}>{activity.stype==8?activity.registeryNum:activity.num}人参与</Text>
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
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    artbot:{
        fontSize:12,
        color:'#ffffff',
        paddingLeft:4
    },
    topright:{
        position:'absolute',
        top: 10,
        right: 10,
        width: 48,
        height: 19,
        backgroundColor: '#000000',
        borderRadius:5,
        opacity:0.49,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#FFFFFF',
    },
});

export default ActivityCell;
