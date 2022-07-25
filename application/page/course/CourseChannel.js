import React, { Component } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';

import * as WeChat from 'react-native-wechat-lib';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import Tabs from '../../component/Tabs';
import VodCell from '../../component/cell/VodCell';

import {theme} from '../../config';

class CourseChannel extends Component {

    static navigationOptions = ({navigation}) => {

		return {
            title: navigation.getParam('ctype', 0) === 0 ?  '视频课程': '音频课程',
            headerRight: <View/>,
		}
    };

    state = {
        refreshState: RefreshState.Idle,
        sort: 0,
    }

    ctype = this.props.navigation.getParam('ctype', 0)
    items = []
    page = 0
    pages = 1

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {course} = nextProps;

        if (course !== this.props.course){
            this.items = this.items.concat(course.items);
            this.pages = course.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh = () => {
        const {actions} = this.props;
        const {sort} = this.state;

        this.page = 0;
        this.pages = 1;
        this.items = [];

        actions.course.course(0, 0, this.ctype, sort, this.page,2);

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh = () => {
        const {actions} = this.props;
        const {sort} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page++;

            actions.course.course(0, 0, this.ctype, sort, this.page,2);
        }  else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _onLink = (courseId, courseName, ctype) => {
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

    _toWxchat = (courseId, courseName, ctype) => {
        Alert.alert('课程提示','此课程只能在微信小程序观看',[
            { text: '取消', onPress: () => {
                
            }
        },{
            text: '跳转', onPress: () => {
                this._onLink(courseId,courseName,ctype)
            }
        }])
    }

    _renderItem = (item) => {
        const {navigation} = this.props;
        const course = item.item;

        if(course.ctype === 1){
            return (
                <VodCell course={course} onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, course.ctype) : navigation.navigate('Audio', {course: course})}/>
            )
        }

        return (
            <VodCell course={course} onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName,course.ctype) : navigation.navigate('Vod', {course: course})}/>
        )
    }

    render() {
        const {sort} = this.state;

        return (
            <View style={[styles.container, styles.bg_white]}>
                <Tabs items={['最新发布', '最多播放']} selected={sort} type={1} onSelect={(index) => {
                    this.setState({
                        sort: index,
                    }, () => {
                        this._onHeaderRefresh();
                    })
                }}/>
                <RefreshListView
                    contentContainerStyle={[styles.p_10]}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    filter: {
        height: 42,
    }
});

export const LayoutComponent = CourseChannel;

export function mapStateToProps(state) {
	return {
        course:state.course.course,
	};
}