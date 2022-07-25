import React, { Component } from 'react';
import {View, StyleSheet, Linking, Alert} from 'react-native';

import * as WeChat from 'react-native-wechat-lib';

import Tabs from '../../component/Tabs';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import VodCell from '../../component/cell/VodCell';
import GraphicCell from '../../component/cell/GraphicCell';

import theme from '../../config/theme';

class SearchChannel extends Component {

    static navigationOptions = {
        title:'完美教育',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.page = 0;
        this.totalPage = 1;
        this.searchcourse = [];
        this.state = {
            keyword:'',
            status:0,
            sort:0,
            ctype:0,
            btype:0
        };

        this._onSelect = this._onSelect.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._onLink = this._onLink.bind(this)
        this._toWxchat = this._toWxchat.bind(this)
    }

    componentWillReceiveProps(nextProps){
        const {searchcourse} = nextProps;

        if (searchcourse !== this.props.searchcourse){
            this.searchcourse = this.searchcourse.concat(searchcourse.items);
			this.page = searchcourse.page;
            this.totalPage = searchcourse.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state;
        const {keyword,ctype,btype} = params

        this.setState({
            keyword:keyword,
            ctype:ctype,
            btype:btype
        });
    }


    componentDidMount(){
        this._onHeaderRefresh();
    }

    _onHeaderRefresh(){
        const {actions} = this.props;

        const {keyword,sort,ctype} = this.state;

        this.searchcourse = [];
        this.page = 0;
        actions.home.searchcourse(keyword,ctype,sort,this.page);

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh(){
        const {actions} = this.props;
        const {keyword,sort,ctype} = this.state;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

            actions.home.searchcourse(keyword,ctype,sort,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _keyExtractor(item, index) {
        return index + '';
    }

    _oncourseDesc = (recom) =>{
        const {navigation} = this.props;
        navigation.navigate('CourseDesc',{course:recom,courseName:recom.courseName});
    }

    _renderItem(item){
        const {navigation} = this.props;
        const {ctype} = this.state
        const recom = item.item;

        if(ctype === 3){
            return(
                <GraphicCell course={recom} key={'channel_' + recom.courseId} onPress={(recom) => navigation.navigate('Graphic', {course: recom})}/>
            )
        } else if(ctype === 2 || ctype === 0){
            return(
                <VodCell course={recom} key={'recomm_' + recom.courseId}  
                    onPress={(recom) => recom.plant === 1 ? this._toWxchat(recom.courseId,recom.courseName,ctype) : navigation.navigate('Vod', {course: recom})}
                />
            )
        } else if(ctype === 1){
            return(
                <VodCell course={recom} key={'recomm_' + recom.courseId}  
                    onPress={(recom) => recom.plant === 1 ? this._toWxchat(recom.courseId,recom.courseName,ctype) : navigation.navigate('Audio', {course: recom})}
                />
            )    
        }

        return null ;
    }

    _onLink(courseId,courseName,ctype){

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                if(ctype === 2 || ctype === 0){
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


    _onSelect(index){
        this.setState({
            status:index,
            sort:index,
        },()=>{
            this._onHeaderRefresh();
        });
    }

    render() {

        const {status} = this.state;

        return (
            <View style={styles.container}>
                 <View style={[styles.atabs, styles.pl_20, styles.pr_20,styles.pt_10,styles.border_bt]}>
                    <Tabs items={['最新发布', '最多播放']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>
                <RefreshListView
                    style={[styles.pb_50,styles.pl_12,styles.pr_12,styles.pt_15]}
                    showsVerticalScrollIndicator={false}
                    data={this.searchcourse}
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

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        backgroundColor:'#ffffff',
    },
    recomm:{
        borderTopColor:'#FAFAFA',
        borderTopWidth:5,
        borderStyle:'solid',
    },
    item_cover_cons:{
        position:'relative',
        height:72,
    },
    item_cover:{
        width:129,
        height:72,
        borderRadius:5,
        backgroundColor:'#dddddd',
    },
    item_tips_hit:{
        position:'absolute',
        bottom:5,
        right:5,
        height:14,
        width:40,
        backgroundColor:'rgba(0,0,0,0.65)',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(255,255,255,0.65)',
        borderRadius:8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    item_hit_cover:{
        width:8,
        height:9,
        marginRight:6,
    },
    item_head_cover:{
        width:10,
        height:10,
        marginRight:5,
    },
    view_icon:{
        width:14,
        height:14,
    },
});

export const LayoutComponent = SearchChannel;

export function mapStateToProps(state) {
	return {
        searchcourse:state.home.searchcourse,
	};
}
