import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import theme from '../../config/theme';
import asset from '../../config/asset';
import {learnNum} from '../../util/common'

class GraphicCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
        }
    }

    render() {
        const {course, onPress} = this.props;
        const {width} = this.state;

        return (
            <TouchableOpacity style={[styles.border_bt, styles.pb_10]}  onPress={() => onPress && onPress(course)} onLayout={(evt) => {
                this.setState({
                    width: evt.nativeEvent.layout.width
                })
            }}>
                {
                    course.ttype ===  2 ?
                    <View style={[styles.pt_15]}>
                        {
                            course.galleryList.length > 0 ?
                            <Image  style={[styles.grap_imgs_cover, {width: width}]} source={{uri: course.galleryList[0].fpath}}/>
                        :
                            <Image  style={[styles.grap_imgs_cover, {width: width}]} source={{uri: course.courseImg}}/>
                        }
                        
                    </View>
                : null}

                <Text style={[styles.lg_label,styles.c33_label,styles.fw_label,styles.pt_10]} numberOfLines={1}>{course.courseName}</Text>

                {
                    course.ttype === 0 ?
                    <Text style={[styles.lh20_label,styles.default_label,styles.gray_label,styles.mt_10]} numberOfLines={2}>{course.summary}</Text>
                : null}

                {
                    course.ttype === 0 || course.ttype === 2 ?
                    <View style={[styles.fd_r,styles.ai_ct,styles.mt_10]}>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Image source={asset.evals_icon}  style={styles.item_head_cover} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(course.comment)}</Text>
                        </View>
                        <View style={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                            {/* <Image source={asset.collect_icon}  style={styles.item_head_cover} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(course.collectNum)}</Text> */}
                             <Image source={{uri:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/v2/asset/view_icon.png'}}  style={styles.item_head_cover} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(course.hit)}</Text>
                        </View>
                    </View>
                : null}

                {
                    course.ttype === 1 ?
                    <View style={[styles.fd_r,styles.jc_sb,styles.mt_10,styles.pb_5]}>
                        {
                            course.galleryList && course.galleryList.map((gallery, i)=>{
                                return (
                                    <Image style={[styles.grap_img_cover,  {width: (width - 20) / 3}]}  key={'img' + i} source={{uri: gallery.fpath}}/>
                                );
                            })
                        }
                    </View>
                : null}

                {
                    course.ttype === 3 ?
                    <View style={[styles.fd_r,styles.mt_10]}>
                        <View style={[styles.fd_c,styles.col_1]}>
                            <Text style={[styles.default_label,styles.gray_label,styles.lh20_label]} numberOfLines={2}>{course.summary}</Text>
                            <View style={[styles.fd_r,styles.ai_ct,styles.mt_10]}>
                                <View style={[styles.fd_r,styles.ai_ct]}>
                                    <Image source={asset.evals_icon}  style={styles.item_head_cover} />
                                    <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(course.comment)}</Text>
                                </View>
                                <View style={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                    {/* <Image source={asset.collect_icon}  style={styles.item_head_cover} />
                                    <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(course.collectNum)}</Text> */}
                                    <Image source={{uri:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/v2/asset/view_icon.png'}}  style={styles.item_head_cover} />
                                    <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(course.hit)}</Text>
                                </View>
                            </View>
                        </View>
                        {
                            course.galleryList.length > 0 ?
                            <Image style={[styles.grap_per_img,styles.ml_15]} source={{uri: course.galleryList[0].fpath}}/>
                            :
                            <Image style={[styles.grap_per_img,styles.ml_15]} source={{uri: course.courseImg}}/>
                        }
                        
                    </View>
                : null}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    grap_imgs_cover:{
        height: 130,
        backgroundColor:'#fafafa',
        borderRadius:5,
    },
    grap_img_cover:{
        height:58,
        backgroundColor:'#fafafa',
        borderRadius:5,
    },
    grap_per_img:{
        width:100,
        height:63,
        borderRadius:5,
        backgroundColor:'#fafafa',
    },
    item_head_cover:{
        width:14,
        height:14,
    },
    view_icon:{
        width:14,
        height:14,
    },
    view_play:{
        marginLeft:10
    }
});

export default GraphicCell;
