import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import {learnNum} from '../../util/common';

class VVodCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0
        }
    }

    render() {
        const {course, style={}, onPress} = this.props;
        const {width} = this.state;

        return (
            <TouchableOpacity style={[style, styles.fd_c, styles.pb_20]} onPress={() => onPress && onPress(course)} onLayout={(evt) => {
                this.setState({
                    width: evt.nativeEvent.layout.width
                })
            }}>
                <View style={[styles.item_cover_box]} >
                    <Image source={{uri:course.courseImg}} resizeMode='stretch' style={[styles.item_cover_b, {width: width}]} />
                    <View style={[styles.item_tips_hit]}>
                        <Text style={[styles.icon, styles.sm8_label ,styles.white_label]}>{iconMap('youyinpin')}</Text>
                        <Text style={[styles.sm8_label ,styles.white_label ,styles.mt_3,styles.ml_5]}>{course.chapter}讲</Text>
                    </View>
                </View>
                <View style={[styles.fd_c, styles.jc_sb ,styles.col_1]}>
                    <View style={[styles.fd_c, styles.mt_10]}>
                        <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1}>{course.courseName}</Text>
                        <Text style={[styles.sml_label ,styles.tip_label,styles.mt_5]} numberOfLines={1}>{course.summary}</Text>
                    </View>
                    {/* <Text style={[styles.red_label,styles.sm_label,styles.mt_5]}>{course.intrgral > 0 ? course.intrgral + '学分' : '免费'}</Text> */}
                    <View style={[styles.fd_r ,styles.ai_ct ,styles.mt_10 ,styles.jc_sb]}>
                        {
                            course.teacherId > 0 ?
                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                <Text style={[styles.icon, styles.sm8_label ,styles.orange_label]}>{iconMap('jiangshitubiao')}</Text>
                                <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{course.teacherName}</Text>
                            </View>
                        : null}
                        <View style={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                        <Text style={[styles.icon, styles.sm8_label ,styles.orange_label]}>{iconMap('bofangtubiao')}</Text>
                            <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_5]}>{learnNum(course.hit)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    item_cover_b: {
        height:92,
        backgroundColor:'#fafafa',
        borderRadius:4,
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
});

//make this component available to the app
export default VVodCell;
