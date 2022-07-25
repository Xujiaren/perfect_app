import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Platform} from 'react-native';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

import {msgTime} from '../../../util/common'



class Message extends Component {
    static navigationOptions = {
        title:'消息',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        this.remindList = [];
        this.courseList = [];
        this.newsList = [];
        this.admin = {}
        

        this.state = {
            message:0,
            remind:0,
            courseRemind:0,
        };

        this._onRefresh = this._onRefresh.bind(this);
        this._onChat = this._onChat.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {msgread,userremind,usermsgcourse,usermessage,msgadmin} = nextProps;

        if (msgread !== this.props.msgread) {
            this.setState({
                message:msgread.message,
                remind:msgread.remind,
                courseRemind:msgread.courseRemind,
            });
        }

        if(userremind !== this.props.userremind) {
            this.remindList = userremind.items
        }
        
        if(usermsgcourse !== this.props.usermsgcourse) {
            
            this.courseList = usermsgcourse.items
        }
        
        if(usermessage !== this.props.usermessage) {
            this.newsList = usermessage.items
        }

        if(msgadmin !== this.props.msgadmin) {
            if(msgadmin.length > 0 ){
                this.admin = msgadmin[0]
            }
        }
    }

    componentDidMount(){
        const {navigation,actions} = this.props;
        this._onRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {

            this._onRefresh();

        })
        // this.cts = setInterval(() => this._onRefresh(), 5000);
    }

    componentWillUnmount() {
        // this.cts && clearInterval(this.cts);
        this.focuSub && this.focuSub.remove();
    }

    _onRefresh() {
        const {actions} = this.props;

        actions.message.msgread();
        actions.message.userremind(0)
        actions.message.usermsgcourse(0)
        actions.message.usermessage(0)
        actions.message.msgadmin();
    }

    _onChat(){
        const {navigation} = this.props;

        if(Object.keys(this.admin).length > 0){
            navigation.navigate('MsgChat',{chatId:this.admin.chatId})
        } else {
            navigation.navigate('MsgChat',{chatId:0})
        }
    }

    render() {
        const {navigation} = this.props;
        const {message,remind,courseRemind} = this.state;

        let isRemind = false;
        let isCourse = false;
        let isNews =false;

        let isAdmin = Object.keys(this.admin).length > 0;

        if(this.remindList && this.remindList.length > 0){
            isRemind = true
        }

        if(this.courseList && this.courseList.length > 0){
            isCourse = true
        }

        if(this.newsList && this.newsList.length > 0){
            isNews = true
        }

        return (
            <View style={[styles.container, styles.pl_20 ,styles.pr_20]}>
                <TouchableOpacity style={[ styles.d_flex,styles.pt_10,styles.pb_10,styles.fd_r ,styles.jc_sb, styles.ai_ct ,styles.bd_bt]}
                    onPress={()=> navigation.navigate('RemindList')}
                >
                    <View style={[styles.msg_item ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                        <View style={[styles.msg_item_icon]}>
                            <Image source={asset.sysIcon}  style={[styles.msg_icon]}/>
                            {
                                remind > 0 ?
                                <View style={[styles.msg_count ,styles.d_flex ,styles.jc_ct ,styles.ai_ct]}>
                                    <Text style={[styles.sm9_label ,styles.white_label]}>{remind}</Text>
                                </View>
                            :null}
                        </View>
                        <View style={[styles.d_flex ,styles.fd_c ,styles.col_1 ,styles.ml_15]}>
                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.mb_5]}>
                                <Text style={[styles.c33_label ,styles.default_label ,styles.fw_label]}>系统通知</Text>
                            <Text style={[styles.tip_label ,styles.smm_label]}>{isRemind ? msgTime(this.remindList[0].pubTime) :''  }</Text>
                            </View>
                            <Text style={[styles.sm_label ,styles.gray_label]}  numberOfLines={2}>{isRemind ? this.remindList[0].title : ''}</Text>
                        </View>
                        
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[ styles.d_flex,styles.pt_10,styles.pb_10,styles.fd_r ,styles.jc_sb, styles.ai_ct ,styles.bd_bt]}
                    onPress={()=> navigation.navigate('MsgCourse')}
                >
                    <View style={[styles.msg_item ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                        <View style={[styles.msg_item_icon]}>
                            <Image source={asset.reminIcon}  style={[styles.msg_icon]}/>
                            {
                                courseRemind > 0 ?
                                <View style={[styles.msg_count ,styles.d_flex ,styles.jc_ct ,styles.ai_ct]}>
                                    <Text style={[styles.sm9_label ,styles.white_label]}>{courseRemind}</Text>
                                </View>
                            :null}
                        </View>
                        <View style={[styles.d_flex ,styles.fd_c ,styles.col_1 ,styles.ml_15]}>
                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.mb_5]}>
                                <Text style={[styles.c33_label ,styles.default_label ,styles.fw_label]}>课程消息</Text>
                            <Text style={[styles.tip_label ,styles.smm_label]}>{isCourse ? msgTime(this.courseList[0].pubTime) :''  }</Text>
                            </View>
                            <Text style={[styles.sm_label ,styles.gray_label]} numberOfLines={2}>{isCourse ? this.courseList[0].title: ''}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                

                {/* 第一版 */}
                {/* <TouchableOpacity style={[ styles.d_flex,styles.pt_10,styles.pb_10,styles.fd_r ,styles.jc_sb, styles.ai_ct ,styles.bd_bt]}
                    onPress={this._onChat}
                >
                    <View style={[styles.msg_item ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                        <View style={[styles.msg_item_icon]}>
                            <Image source={asset.adminIcon}  style={[styles.msg_icon]}/>
                        </View>
                        <View style={[styles.d_flex ,styles.fd_c ,styles.col_1 ,styles.ml_15]}>
                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.mb_5]}>
                                <Text style={[styles.c33_label ,styles.default_label ,styles.fw_label]}>管理员消息</Text>
                            <Text style={[styles.tip_label ,styles.smm_label]}>{isAdmin ? msgTime(this.admin.pubTime) :''  }</Text>
                            </View>
                            {
                                isAdmin ?
                                <Text style={[styles.sm_label ,styles.gray_label]} numberOfLines={1}>{this.admin.lastMsg.indexOf('png') > 0  || this.admin.lastMsg.indexOf('jpeg') > 0 || this.admin.lastMsg.indexOf('jpg') > 0 ? '图片' :  this.admin.lastMsg}</Text>
                                :
                                <Text style={[styles.sm_label ,styles.gray_label]}>你好，你的反馈我们已经收到。</Text>
                            }
                        </View>
                        
                    </View>
                </TouchableOpacity> */}


                <TouchableOpacity style={[ styles.d_flex,styles.pt_10,styles.pb_10,styles.fd_r ,styles.jc_sb, styles.ai_ct ,styles.bd_bt]}
                    onPress={()=> navigation.navigate('MsgList')}
                >
                    <View style={[styles.msg_item ,styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                        <View style={[styles.msg_item_icon]}>
                            <Image source={asset.newsIcon}  style={[styles.msg_icon]}/>
                            {
                                message > 0 ?
                                <View style={[styles.msg_count ,styles.d_flex ,styles.jc_ct ,styles.ai_ct]}>
                                    <Text style={[styles.sm9_label ,styles.white_label]}>{message}</Text>
                                </View>
                            :null}
                        </View>
                        <View style={[styles.d_flex ,styles.fd_c ,styles.col_1 ,styles.ml_15]}>
                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.mb_5]}>
                                <Text style={[styles.c33_label ,styles.default_label ,styles.fw_label]}>油葱新鲜事</Text>
                            <Text style={[styles.tip_label ,styles.smm_label]}>{isNews ? msgTime(this.newsList[0].ptime) :''  }</Text>
                            </View>
                            <Text style={[styles.sm_label ,styles.gray_label]} numberOfLines={2}>{isNews ? this.newsList[0].title : ''}</Text>
                        </View>
                        
                    </View>
                </TouchableOpacity>
                
            </View>
        );
    }
}



const styles =  StyleSheet.create({
    ...theme.base,
    msg_item_icon:{
        position:'relative',
    },
    msg_icon:{
        width:50,
        height:50,
        borderRadius:25,
    },
    msg_count:{
        position:'absolute',
        right:0,
        top:0,
        width:16,
        height:16,
        borderRadius:8,
        backgroundColor:'#FF0013',
    },
    icon_right:{
        width:6,
        height:11,
        marginLeft:5,
    },
    bd_bt:{
        borderBottomColor:'#E4E7ED',
        borderStyle:'solid',
        borderBottomWidth:1
    }
});

export const LayoutComponent = Message;

export function mapStateToProps(state) {
	return {
        msgread:state.message.msgread,
        userremind :state.message.userremind,
        usermsgcourse:state.message.usermsgcourse,
        usermessage:state.message.usermessage,
        msgadmin:state.message.msgadmin
	};
}
