import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import {formatTimeStampToTime} from '../../util/common'

class ProjectCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
        }
    }

    render() {
        const {project, onPress,type,ctype} = this.props;
        const {width} = this.state;


        return(
            <TouchableOpacity 
                style={[styles.articleItems,!type&&styles.border_bt ,!type&&styles.mb_15]}
                onPress={() => onPress && onPress(project)}
            >
                <View style={[styles.arthead]}>
                    <Image style={[styles.arthead_cover]}  source={{uri:project.articleImg}} />
                </View>
                {
                    ctype === 0 || ctype === 1 ?
                    <View style={[styles.fd_c  ,styles.mt_15]}>
                        <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label ,styles.col_1]} numberOfLines={1}>{project.title}</Text>
                        {
                            ctype === 0 ?
                            <View style={[styles.mt_5]}>
                                <Text style={[styles.gray_label , styles.sm_label]} numberOfLines={2}>{project.summary}</Text>
                            </View>
                            :
                            <View style={[styles.mt_5]}>
                                <Text style={[styles.gray_label , styles.sm_label]} >发布时间：{formatTimeStampToTime(project.pubTime * 1000)}</Text>
                            </View>
                        }
                        
                    </View>
                    :
                    <View style={[styles.mt_15,{width:'100%'}]}>
                        <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label ,styles.col_1]} numberOfLines={1}>{project.title}</Text>
                        <Text style={[styles.gray_label , styles.sm_label,styles.mt_5]} >{project.summary}</Text>                        
                    </View>
                }
                
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
    artbot:{
        fontSize:12,
        color:'#ffffff',
        paddingLeft:4
    },
});

export default ProjectCell;
