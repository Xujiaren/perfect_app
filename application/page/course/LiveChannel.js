//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Linking, Alert} from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import Tabs from '../../component/Tabs';
import VodCell from '../../component/cell/VodCell';

import {theme} from '../../config';

import * as WeChat from 'react-native-wechat-lib';

// create a component
class LivChannel extends Component {

    static navigationOptions = {
        title:'直播回放',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.liveSlist = [];

        this.state = {
            status:0,
            sort:0,
        }

        this._onSelect = this._onSelect.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._onLink = this._onLink.bind(this)
        this._toWxchat = this._toWxchat.bind(this)

    }


    componentWillReceiveProps(nextProps){

        const {liveback} = nextProps

        if(liveback !== this.props.liveback){
            this.liveSlist = this.liveSlist.concat(liveback.items);
            this.page = liveback.page ;
            this.totalPage = liveback.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        this._onHeaderRefresh()
    }

    componentWillMount(){

    }


    _onHeaderRefresh(){
        const {actions} = this.props;

        const {sort} = this.state;

        this.liveSlist = [];
        this.page = 0;
        actions.course.liveback(1,sort,this.page);

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh(){
        const {actions} = this.props;
        const {sort} = this.state;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

            actions.course.liveback(1,sort,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }


    _onSelect(index){
        this.setState({
            status:index,
            sort:index
        },()=>{
            this._onHeaderRefresh()
        })
    }

    _onLink(courseId,courseName){

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                WeChat.launchMiniProgram({
                    userName: "gh_7bd862c3897e", // 拉起的小程序的username
                    miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                    path: '/pages/index/courseDesc?course_id=' + courseId +'&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                });
            } else {
                Alert.alert('温馨提示', '请先安装微信');
            }
        })
    }

    _toWxchat(courseId,courseName){
        Alert.alert('课程提示','此课程只能在微信小程序观看',[
            { text: '取消', onPress: () => {
                
            }
        },{
            text: '跳转', onPress: () => {
                this._onLink(courseId,courseName)

            }
        }])
    }

    _renderItem(item){
        const {navigation} = this.props
        const course = item.item
        return(
            <VodCell course={course} key={'recomm_' + course.courseId}  
                onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName) : navigation.navigate('Vod', {course: course})}
            />
        )
    }




    render() {

        const {status} = this.state

        return (
            <View style={styles.container}>
                 <View style={[styles.atabs, styles.pl_20, styles.pr_20,styles.pt_10,styles.border_bt]}>
                    <Tabs items={['最新发布', '最多播放']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                <RefreshListView
                    style={[styles.pb_50,styles.pl_12,styles.pr_12,styles.pt_15]}
                    showsVerticalScrollIndicator={false}
                    data={this.liveSlist}
                    exdata={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    container: {
    },
});

export const LayoutComponent = LivChannel;

export function mapStateToProps(state) {
    return {
        liveback:state.course.liveback,
    };
}
