import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';
import _ from 'lodash';
import theme from '../../../config/theme';
import HudView from '../../../component/HudView';
import request from '../../../util/net'
class MsgDesc extends Component {

    static navigationOptions = {
        title:'消息详情',
        headerRight: <View/>,
    };

    userlevel = []

    constructor(props){
        super(props);

        this.state = {
            msg:{},
            typeImg:0,

            userInfo:{},
            nowLevel: 0,
            integral:0,
            lottery:0,
            prestige:0,
        };


        this._onLink = this._onLink.bind(this);
    }


    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state;

        this.setState({
            msg:params.msg,
            typeImg: params.typeImg !== undefined ?  parseInt(params.typeImg) :0
        });
    }


    componentDidMount(){
        const {actions} = this.props;
        actions.user.user();
        actions.user.userlevel();
    }

    componentWillReceiveProps(nextProps){
        const {user, userlevel} = nextProps;

        if (!_.isEqual(user, this.props.user)){

            this.setState({
                userInfo:user,
                integral:user.integral || 0,
                lottery:user.lottery || 0,
                prestige:user.prestige || 0,
            });
            
        }

        if (!_.isEqual(userlevel, this.props.userlevel)) {
            this.userlevel = userlevel;
        }

        let nowLevel = 0;
        if (this.userlevel.length > 0 && this.state.userInfo.level) {
            for (let i = 0; i < this.userlevel.length; i++){
                if (this.userlevel[i].levelId === this.state.userInfo.level){
                    nowLevel = i;
                    break;
                }
            }
        }

        this.setState({
            nowLevel: nowLevel
        })
    }

    componentWillUnmount(){
        const {actions} = this.props;
        actions.message.msgread();
    }


    _onJump = (etype, args) => {
        const {navigation} = this.props

        navigation.navigate('FeedBack', {status: 1})
    }


    _onLink(msg){
        console.log(msg,'????')
        const {navigation,user} = this.props
        const {userInfo, integral, lottery, nowLevel} = this.state;

        let adlink = msg.link || msg.url;

        if(adlink.substring(0,4) == 'http'){

            navigation.navigate('AdWebView',{link:adlink})
            
        } else {
            if (adlink.indexOf('courseDesc') !== -1 ){

                let courseId = adlink.split('=')[1]
                const couse = {'courseId':courseId.split("&")[0]};
                navigation.navigate('Vod',{course:couse,courseName:''});

            } else if (adlink.indexOf('consultDesc') !== -1 ){

                let courseId = adlink.split('=')[1]
                const article = {'articleId':courseId.split("&")[0]};
                navigation.navigate('Article', {article: article})
 
            } else if (adlink.indexOf('readyLottery') !== -1 ) {
                navigation.navigate('Lucky', {integral:integral, lottery:lottery, nowLevel:nowLevel, avatar:userInfo.avatar})
            } else if(adlink.indexOf('actProduction')!==-1){
                let activity = adlink.split('=')[1]
                let activitys = adlink.split('=')[2]
                let activityss= adlink.split('=')[3]
                const activityId = activity.split("&")[0]
                const ctype = activitys.split("&")[0]
                const etype = activityss.split("&")[0]
                navigation.navigate('ActivityProduction',{activityId:activityId,ctype:ctype,etype:etype})
            } else if(adlink.indexOf('s_Map')!==-1){
                if (user.isAuth === 1) {
                    navigation.navigate('StudyMap')
                } else {
                    this.refs.hud.show('学习地图仅对特定对象可见', 1);
                }
            }else if(adlink.indexOf('activityDesc')!==-1){
                let activity = adlink.split('=')[1]
                const activityId = activity.split("&")[0]
                request.get('/activity/'+activityId)
                .then(res=>{
                    navigation.navigate('Activity', { activity: res })
                })
            }else if(adlink.indexOf('liveDesc')!==-1){
                let courseId = adlink.split('=')[1]
                const couse = {'courseId':courseId.split("&")[0]};
                navigation.navigate('Live', {course:couse})
            }else if(adlink.indexOf('activeLive')!==-1){
                let courseId = adlink.split('=')[1]
                const couse = {'courseId':courseId.split("&")[0]};
                navigation.navigate('activeLive', {course:couse})
            }else if(adlink.indexOf('myTranDetail')!==-1){
                let squadId = adlink.split('=')[1]
                let squadName = adlink.split('=')[2]
                let o2o = {
                    'squadId':squadId.split("&")[0],
                    'squadName':squadName.split("&")[0]
                }
                navigation.navigate('MyTranDetail',{o2o:o2o})
            }
        }

    }


    render() {
        const {msg,typeImg} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.msgDesc]}>
                    <View style={[styles.d_flex ,styles.fd_c ,styles.pt_25]}>
                        <Text style={[styles.lg_label ,styles.fw_label ,styles.black_label]}>{msg.title}</Text>
                        <Text style={[styles.sm_label ,styles.tip_label ,styles.pt_10]}>{msg.pubTimeFt}</Text>
                    </View>
                    <View style={[styles.msg_txt ,styles.pt_15 ,styles.pb_30]}>
                        <Text style={[styles.default_label ,styles.lh16_label ,styles.gray_label ]}>{msg.content}</Text>
                        <TouchableOpacity
                            onPress={() => this._onLink(msg)}
                        >
                            <Text style={[styles.default_label ,styles.lh16_label,styles.txt_link]} >{msg.link}</Text>
                        </TouchableOpacity>
                        {
                            typeImg === 1 ?
                            <Image source={{uri:msg.messageImg}}  style={styles.messageImg}  />
                        :null}

                        {msg.url && msg.url !== '' ? 
                        <TouchableOpacity
                            style={[styles.bg_red, styles.p_10, styles.circle_5, styles.ai_ct, styles.mt_10]}
                            onPress={() => this._onLink(msg)}
                        >
                            <Text style={[styles.white_label]}>参与</Text>
                        </TouchableOpacity>
                        : null}

                        {msg.etype == 96 ? 
                        <TouchableOpacity
                            style={[styles.bg_red, styles.p_10, styles.circle_5, styles.ai_ct, styles.mt_10]}
                            onPress={() => this._onJump(msg.etype)}
                        >
                            <Text style={[styles.white_label]}>查看回复</Text>
                        </TouchableOpacity>
                        : null}
                    </View>
                    <HudView ref={'hud'} />

                </View>
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#f5f5f5',
    },
    msgDesc:{
        paddingLeft:18,
        paddingRight:18,
    },
    messageImg:{
        width:'100%',
        height:108,
        marginTop:10,
    },
    txt_link:{
        textDecorationLine:'underline',
        color:'#1a0dab'
    }
});

export const LayoutComponent = MsgDesc;

export function mapStateToProps(state) {
	return {
        msgread:state.message.msgread,
        user:state.user.user,
        userlevel:state.user.userlevel,
	};
}
