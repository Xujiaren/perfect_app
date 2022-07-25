import React, { Component } from 'react'
import { View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,ActivityIndicator,RefreshControl} from 'react-native';

import HtmlView from '../../../component/HtmlView';
import HudView from '../../../component/HudView';

import theme from '../../../config/theme';
import {dateDiff,formatTimeStampToTime,getExactTimes} from '../../../util/common';

const nowTime = (new Date()).getTime();

class MyTrainClassDetail extends Component {

    static navigationOptions = ({navigation}) => {
        
        const o2o = navigation.getParam('o2o', {squadName: '活动报名'});
		return {
            title: o2o.squadName,
            headerRight: <View/>,
		}
	};


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.nowTime = (new Date()).getTime();
        this.o2o = navigation.getParam('o2o', {});
        this.stype = navigation.getParam('stype', 0);

        this.state = {
            loaded: false,
            type:0,
            enrollNum:0,
            registeryNum:0,
            stype:this.stype,
            squadId:0,
            userId:0,
            finish:false,
            isRefreshing: false,
        }

        this._singUp = this._singUp.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {o2oDetail,user} = nextProps;

        if (o2oDetail !== this.props.o2oDetail) {
            this.o2o = o2oDetail
            this.setState({
                loaded: true,
                enrollNum:o2oDetail.enrollNum,
                registeryNum:o2oDetail.registeryNum,
                stype:o2oDetail.stype,
                squadId:o2oDetail.squadId,
                finish:o2oDetail.finish
            })

            if(o2oDetail.hasFlag){
                // 报名开始时间 大于 当前时间 
                if(o2oDetail.beginTime * 1000  >  this.nowTime){
                    this.setState({
                        type:0
                    })
                } else if(o2oDetail.beginTime * 1000 < this.nowTime &&  o2oDetail.endTime * 1000 > this.nowTime){
                    if(o2oDetail.canApply){
                        this.setState({
                            type:1
                        })
                    } else {
                        this.setState({
                            type:2
                        })
                    }
                } else if(o2oDetail.endTime * 1000 < this.nowTime){
                    this.setState({
                        type:3
                    })
                }
            } else {
                this.setState({
                    type:4
                })
            }
        }

        if(user !== this.props.user){
            this.setState({
                userId:user.userId
            })
        }
    }

    componentDidMount() {
        const {navigation,actions} = this.props;

        this._onRefresh();
        
        this.focuSub = navigation.addListener('didFocus', (route) => {
            
            actions.train.o2oDetail(this.o2o.squadId);
            actions.user.user();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }
    
    _onRefresh(){
        const {actions} = this.props;
        actions.train.o2oDetail(this.o2o.squadId);
        actions.user.user();
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        },2000)
    }

    _singUp=()=>{
        const {navigation} = this.props;

        const {userId,enrollNum,registeryNum,stype,squadId} = this.state;

        if(userId > 0){
            if(  enrollNum <= registeryNum) {

                this.refs.hud.show('报名人数已满', 2);

            } else {
                navigation.navigate('CertificateSignUp',{squad_id:squadId,beginTime:this.o2o.beginTime,endTime:this.o2o.endTime})
            }
        } else {
            navigation.navigate('PassPort')
        }
    }


    render() {
        const {navigation} = this.props;
        const {loaded,type,finish,squadId} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )

        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps={'handled'} 
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={this._onRefresh}
                          tintColor="#2c2c2c"
                          title="刷新中..."
                          titleColor="#2c2c2c"
                          colors={['#2c2c2c', '#2c2c2c', '#2c2c2c']}
                          progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    <View style={[styles.content_wrap]}>
                        <View style={[styles.img_wrap]}>
                            <Image style={[styles.class_img]} source={{uri:this.o2o.squadImg}} />
                        </View>
                        <View style={[styles.title]}>
                            <Text style={[styles.c33_label,styles.lg18_label,styles.fw_label]}>{this.o2o.squadName}</Text>
                        </View>
                        {
                            this.o2o.summary.length > 0 ? 
                            <Text style={[styles.gray_label ,styles.sm_label]}>{this.o2o.summary}</Text>
                        :null}
                        <View style={[styles.fd_r,styles.jc_sb,styles.mb_5 ,styles.mt_5]}>
                            <Text style={[styles.tip_label,styles.sm_label]}>活动时间：{formatTimeStampToTime(this.o2o.beginTime*1000)} - {formatTimeStampToTime(this.o2o.endTime*1000)}</Text>
                            <Text style={[styles.tip_label,styles.sm_label]}>{dateDiff(this.o2o.pubTime)}</Text>
                        </View>
                        <View style={[styles.fd_r,styles.jc_sb,styles.mb_5 ,]}>
                            <Text style={[styles.tip_label,styles.sm_label]}>招生人数：{this.o2o.enrollNum}  报名人数：{this.o2o.registeryNum}</Text>
                            <Text style={[styles.tip_label,styles.sm_label]}>{this.o2o.location.length > 0 ? '地点：' : ''}{this.o2o.location}</Text>
                        </View>
                    </View>
                    <View style={[styles.cons,styles.bg_white,styles.pl_15,styles.pr_15]}>
                        <HtmlView html={this.o2o.content} type={1} onLinkPress={this.onLinkPress} />
                    </View>
                </ScrollView>
                
                <View style={[styles.btn_wrap]}>
                    {
                        type === 0  ?
                        <View style={[styles.btn ,styles.lock]} >
                            <Text>未开始</Text>
                        </View>
                    :null}
                    {
                        type === 1 ?
                        <TouchableOpacity style={[styles.btn]} hoverClass='on_btn' onPress={()=>this._singUp()}>
                            <Text style={[styles.white_label,styles.default_label]}>立即报名</Text>
                        </TouchableOpacity>
                    :null}
                    {
                        type === 2 ?
                        <View>
                            {
                                finish ?
                                <View style={[styles.btn ,styles.lock]} >
                                    <Text style={[styles.white_label,styles.default_label]}>开始学习</Text>
                                </View>
                                :
                                <TouchableOpacity style={[styles.btn]} onPress={()=>navigation.navigate('PracticeRoom',{squadId:squadId})}>
                                    <Text style={[styles.white_label,styles.default_label]}>开始学习</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        
                    :null}
                    {
                        type === 3?
                        <View style={[styles.btn ,styles.lock]} onPress={()=>navigation.navigate('PracticeRoom',{squadId:squadId})}>
                            <Text style={[styles.white_label,styles.default_label]}>已结束</Text>
                        </View>
                    :null}
                    {
                        type === 4?
                        <View style={[styles.btn ,styles.lock]} >
                            <Text style={[styles.white_label,styles.default_label]}>暂无报名权限</Text>
                        </View>
                    :null}
                </View>

                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FBFDFF',
    },
    content_wrap:{
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:15,
        paddingRight:15
    },
    title:{
        paddingTop:15,
        paddingBottom:5
    },
    class_img:{
        width:'100%',
        height:130,
    },
    btn_wrap:{
        paddingTop:8,
        paddingBottom:8,
        width:'100%',
        borderTopColor:'#F0F0F0',
        borderTopWidth:1,
        borderStyle:'solid',
        backgroundColor:'#ffffff'
    },
    btn:{
        height:30,
        width:theme.window.width - 30,
        marginLeft:15,
        borderRadius:5,
        backgroundColor:'#F4623F',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    lock:{
        backgroundColor:'#CBCBCB'
    }
})

export const LayoutComponent = MyTrainClassDetail;

export function mapStateToProps(state) {
	return {
        o2oDetail:state.train.o2oDetail,
        user:state.user.user,
	};
}




