import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList,Linking, Alert} from 'react-native';

import * as WeChat from 'react-native-wechat-lib';

import VodCell from '../../component/cell/VodCell';
import VVodCell from '../../component/cell/VVodCell';

import {theme, iconMap} from '../../config';

class VodChannel extends Component {

    static navigationOptions = ({navigation}) => {
        const channel = navigation.getParam('channel', {});
        return {
            title:channel.channelName,
            headerRight: <View/>,
        };
    };

    constructor(props){
        super(props);

        const {navigation} = props;
        this.channel = navigation.getParam('channel', {});

        this.tabs = ['最新','最热'];
        this.items = [];

        this.state = {
            sort: 0,
            mode: false,
        };

        this._onRefresh = this._onRefresh.bind(this);
        this._onSort = this._onSort.bind(this);
        this._onMode = this._onMode.bind(this);

        this._renderItem = this._renderItem.bind(this);

        this._onLink = this._onLink.bind(this)
        this._toWxchat = this._toWxchat.bind(this)
    }

    componentDidMount(){
        this._onRefresh();
    }

    componentWillReceiveProps (nextProps){
        const {channel} = nextProps;
        if (channel !== this.props.channel){
            this.items = channel;
        }
    }

    _onRefresh() {
        const {actions} = this.props;
        actions.course.channel(this.channel.channelId, this.state.sort);
    }

    _onSort(sort) {
        this.setState({
            sort: sort,
        },()=> {
            this._onRefresh();
        });
    }

    _onMode() {
        this.setState({
            mode: !this.state.mode,
        });
    }

    _onLink(courseId,courseName,ctype){

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                if(ctype === 0 ){
                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/courseDesc?course_id=' + courseId +'&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                } else if(ctype === 1){
                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/audioDesc?course_id=' + courseId +'&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                }
            } else {
                Alert.alert('温馨提示', '请先安装微信');
            }
        })
    }

    _toWxchat(courseId,courseName,ctype){
        Alert.alert('课程提示','此课程只能在微信小程序观看',[
            { text: '取消', onPress: () => {
                
            }
        },{
            text: '跳转', onPress: () => {
                this._onLink(courseId,courseName,ctype)

            }
        }])
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;
        const index = item.index
        const {mode} = this.state;

        if (mode) {
            return <VVodCell style={[styles.item, styles.mr_20]} course={course} 
                    onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName,course.ctype) : navigation.navigate('Vod', {course: course})}
                />

        }

        return <VodCell course={course} key={'recomm_' + course.courseId}  
                onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName,course.ctype) : navigation.navigate('Vod', {course: course})}
            />
    }

    render() {
        const {sort, mode} = this.state;

        console.info(sort);

        return (
            <View style={[styles.container, styles.bg_white]}>
                <View style={[styles.coursehead]}>
                    <View style={[styles.fd_r ,styles.pt_10 ,styles.course_box ,styles.jc_sb]}>
                        <View style={[styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.head_box ,styles.col_1]}>
                            {
                                this.tabs.map((tab, index)=>{
                                    const on = index === sort;
                                    return (
                                        <TouchableOpacity key={'tab' + index} style={[styles.head_box_item ,styles.d_flex ,styles.fd_c ,styles.ai_ct]}
                                            onPress={()=> this._onSort(index)}
                                        >
                                            <Text style={[styles.default_label , on ? styles.c33_label : styles.gray_label , on ? styles.fw_label : null]} >{tab}</Text>
                                            <View style={[styles.border_btn,on ? styles.bg_sred : styles.bg_white]}></View>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                        <TouchableOpacity style={[styles.course_sty  ,styles.fd_r ,styles.ai_ct ,styles.jc_fe ,styles.mb_5]} onPress={this._onMode}>
                            <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap(mode ? 'shuangpaibanshi' : 'danpai')}</Text>
                            <Text style={[styles.default_label, styles.ml_5, styles.tip_label]}>{mode ? '双排模式' : '单排模式'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <FlatList
                    contentContainerStyle={styles.p_20}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) => {
                        return index + ''
                    }}
                    renderItem={this._renderItem}
                    numColumns={mode ? 2 : 1}
                    key={(mode ? 'h' : 'v')}
                />
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    course_box:{
        paddingLeft:20,
        paddingRight:20,
    },
    head_box:{
        paddingLeft:40,
        paddingRight:40,
    },
    border_btn:{
        width:11,
        height:4,
        borderRadius:2,
        marginTop:5,
    },
    course_sty:{
        width:100,
    },
    item:{
        width:'48%',
    },
});

export const LayoutComponent = VodChannel;

export function mapStateToProps(state) {
	return {
        channel:state.course.channel,
	};
}

