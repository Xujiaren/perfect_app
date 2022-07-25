import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,ProgressViewIOS,Dimensions,ProgressBarAndroid, } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';
import {learnNum} from '../../util/common';

class PVodCell extends Component {
    
    render() {
        const {course, type ,onPress, style={}} = this.props;

        return (
            <TouchableOpacity style ={[style, styles.fd_r,styles.mt_10,,styles.pb_10,!type&&styles.border_bt]} onPress={() => onPress && onPress(course)}>
               <View style={[styles.c_item_cover]}>
                    <Image source={{uri:course.courseImg}}  style={[styles.c_item_img_cover]} />
                    {
                        course.isSeries === 1 ?
                            <View style={[styles.c_item_title ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]}>
                                <Text style={[styles.sm_label ,styles.white_label]}>系列课({course.study.currentChapter}/{course.study.totalChapter})</Text>
                            </View>
                    : null}
                </View>
                <View style={[styles.d_flex ,styles.fd_c ,styles.jc_sb ,styles.ml_10 ,styles.col_1]}>
                    <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1} >{course.courseName}</Text>
                    <View>
                        <View style={[styles.d_flex ,styles.fd_r ,styles.jc_sb ,styles.mb_5]}>
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.fw_label]}>{course.study.updateTimeFt}</Text>
                            <Text style={[styles.sm_label ,styles.tip_label]}>在学{course.study.progress}%</Text>
                        </View>
                        {
                            Platform.OS === 'android' ?
                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} progress={(course.study.progress / 100)} styleAttr="Horizontal"/>
                            :
                            <ProgressViewIOS progress={(course.study.progress / 100)}  style={{width: '100%'}} trackTintColor={'#FFDFDE'} progressTintColor={'#FF5047'} />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    c_item:{
        position:'relative',
    },
    c_item_cover:{
        position:'relative',
        height:80,
    },
    c_item_img_cover:{
        width:148,
        height:80,
        borderRadius:4,
    },
    c_item_title:{
        width:148,
        height:20,
        backgroundColor:'rgba(51,51,51,0.7)',
        position:'absolute',
        top:60,
        borderBottomLeftRadius:4,
        borderBottomRightRadius:4,
    },
});

export default PVodCell;
