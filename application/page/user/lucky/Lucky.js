import React, { Component } from 'react';
import { Text, View ,StyleSheet,ActivityIndicator, TouchableOpacity,Modal,Image,TextInput,Alert} from 'react-native';
import { WebView } from 'react-native-webview';

import HudView from '../../../component/HudView';

import {config, asset, theme} from '../../../config';

class Lucky extends Component {

    static navigationOptions = {
        title:'翻牌抽奖',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.loaded = false;
        this.state = {
            integral:0,
            prestige:0,
            avatar:'',
            nowLevel:0,
            loading: false,
            integralnum:0,
            lotterynum:0,
            reward:{},
            tips:true,
            formType:false,
            showtips:5,
            mobile:'',
            ads:'',
            name:'',
            reward_id:0,
            currentTimestamp:'',
        };
        this._onLoadEnd = this._onLoadEnd.bind(this);
        this._noWin =  this._noWin.bind(this);
        this._onGold = this._onGold.bind(this);
        this._onGift = this._onGift.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {navigation} = this.props
        const {user,activityflop} = nextProps

        if(user !== this.props.user){

            this.setState({
                integralnum:user.integral,
                lotterynum:user.lottery
            })
            if(user.addressList.length>0){
                this.setState({
                    name:user.addressList[0].realname,
                    mobile:user.addressList[0].mobile,
                    ads:user.addressList[0].province+user.addressList[0].city+user.addressList[0].district+user.addressList[0].address
                })
            }
        }

        if (activityflop !== this.props.activityflop){
            this.activity = activityflop.activity;

            if(!(user.lottery > 0)){
                Alert.alert('翻牌抽奖', '抽奖机会不足', [
                    {text: '确认', onPress: () => {
                        navigation.goBack();
                    }}
                ],{cancelable:false});
            }
        }
       
    }
    

    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state;
        this.setState({
            integral:params.integral,
            lottery:params.lottery,
            avatar:params.avatar,
            nowLevel:params.nowLevel,
        });
    }

 
    componentDidMount(){
        const {actions,navigation} = this.props

        actions.user.user()

        actions.activity.activityflop();

        const currentTimestamp = new Date().getTime();

        this.setState({
            currentTimestamp:currentTimestamp
        })


    }


    _onLoadEnd(navState) {
		this.loaded = true;
		this.setState({
			loading: false,
        });
    }

    _onMessage = (event) => {

        const {navigation,actions} = this.props

        let eventMsg = event.nativeEvent.data;

        if(eventMsg.length > 0){

            if(eventMsg.split('&')[0] === 'navigation'){
                navigation.navigate(`${eventMsg.split('&')[1]}`)
            }

            if(eventMsg.split('&')[0] === 'reward'){

                let rewardObj = JSON.parse(eventMsg.split('&')[1])

                this.setState({
                    reward:rewardObj,
                    tips:true,
                })
                
                const ts = new Date().getTime();

                actions.activity.activityLottery({
                    ts:ts,
                    index:rewardObj.index,
                    resolved: (data) => {
                        actions.user.user();
                        this.setState({
                            reward:rewardObj,
                            tips:true,
                            reward_id:data.rewardId
                        })
                    },
                    rejected: (msg) => {
                        actions.user.user();
                    },
                })
                
            }
        }

    }

    _onloading(){
        const {actions} = this.props

        actions.user.user()
        actions.activity.activityflop();
    }


    // 未获奖
    _noWin(){
        const {actions} = this.props

        actions.user.user();

        this.setState({
            tips:false
        },()=>{
            this._onloading();
        })

        //  重新加载
        this.refs.WebView.reload()

    }

    // 学分
    _onGold(){
        const {actions} = this.props
        const {reward_id} = this.state  

        actions.activity.lotteryReceive({
            reward_id:reward_id,
            realname:'',
            address:'',
            mobile:'',
            resolved: (data) => {
                this.setState({
                    tips:false,
                },()=>{
                    setTimeout(()=>{
                        this.refs.hud.show('学分领取成功', 1);
                        this.refs.WebView.reload()
                        this._onloading();
                    },1000)
                })
            },

            rejected: (msg) => {
                this.setState({
                    tips:false
                },()=>{
                    setTimeout(()=>{
                        this.refs.hud.show('领取失败，联系客服', 1);
                        this.refs.WebView.reload()
                        this._onloading();
                    },1000)
                    
                })
            },
        })
        
    }

    // 礼品
    _onGift(){
        this.setState({
            tips:false,
            formType:true
        })
    }


    // 地址提交
    _onSubmit(){
        const {actions} = this.props
        const {mobile,ads,name,reward_id,formType} = this.state

        let voild = true
        let msg = ''

        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号

        if(name == ''){
            voild = false,
            msg = '姓名不能为空'
        } else if(!pattern.test(mobile)){
            voild = false,
            msg = '请填写正确的手机号'
        }  else if(ads == ''){
            voild = false,
            msg = '地址不能为空'
        }

        if(voild){
            actions.activity.lotteryReceive({
                reward_id:reward_id,
                realname:name,
                address:ads,
                mobile:mobile,
                resolved: (data) => {
                    this.setState({
                        formType:false,
                        mobile:'',
                        ads:'',
                        name:'',
                    },()=>{
                        setTimeout(()=>{
                            this.refs.hud.show('提交成功', 1);
                            this.refs.WebView.reload()
                            this._onloading();
                        },1000)
                        
                    })

                },
                rejected: (msg) => {
                    this.setState({
                        formType:false
                    },()=>{
                        setTimeout(()=>{
                            this.refs.hud.show('提交失败，联系客服', 1);
                            this.refs.WebView.reload()
                            this._onloading();
                        },1000)
                        
                    })
                },
            })
        } else {
            Alert.alert('表单提交', msg, [
                {text: '确认', onPress: () => {
                    
                }}
            ],{cancelable:false});
        }

        

    }



    render() {

        const {integralnum,lotterynum,reward,tips,formType,mobile,ads,name,reward_id,currentTimestamp} = this.state;

        // var weburl = "https://teach.perfect99.com/event/lucky2/index.html?v=76&integral=" +  integralnum + '&lotterynum=' + lotterynum
        // var weburl = 'https://teach.perfect99.com/event/lucky/index.html?v=' + currentTimestamp + '&integral=' +  integral + '&lotterynum=' + lottery;
        // var weburl = 'http://localhost:8000/index.html?v=' + currentTimestamp + '&integral=' +  integralnum + '&lotterynum=' + lotterynum;
        
        var weburl = config.bUrl +  "/event/lucky2/iapp.html?v="+ currentTimestamp +"&integral=" +  integralnum + '&lotterynum=' + lotterynum
        console.log(currentTimestamp,'///')
        return (
            <View style={[styles.container]}>
                <WebView
                    useWebkit={true}
                    ref="WebView"
                    source={{ uri: weburl}}
                    onLoadEnd={this._onLoadEnd}
                    onNavigationStateChange={(event)=>{
                        // console.log('点击');
                    }}
                    onMessage={this._onMessage}
                    // injectedJavaScript={runFirst}
                    javaScriptEnabled={true}
                />

                {
                    this.state.loading ?
                    <View style={styles.loading}>
                        <ActivityIndicator/>
                    </View>
				: null}

                {
                    reward.ctype === 0  ?
                    <Modal transparent={true} visible={tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_cons]}>
                            <Image source={asset.lucky_glod} style={styles.layer_head} />
                            <Text style={[styles.lg24_label ,styles.black_label ,styles.pt_20 ,styles.pb_5]}>再接再厉!</Text>
                            <View style={[styles.layer_icover ,styles.d_flex ,styles.fd_r ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={asset.perfect_icon.pf_lucky}  style={[styles.layer_ncover]}/>
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]}
                                onPress= {this._noWin}
                            >
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                :null}

                {
                    reward.ctype === 1  ?
                    <Modal transparent={true} visible={tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_cons]}>
                            <Image source={asset.lucky_glod} style={styles.layer_head} />
                            <Text style={[styles.lg24_label ,styles.black_label ,styles.pt_20 ,styles.pb_5]}>恭喜你</Text>
                            <Text style={[styles.lg18_label, styles.c33_label]}>获得 {reward.name}</Text>
                            <View style={[styles.layer_icover ,styles.d_flex ,styles.fd_r ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={asset.goldtip} style={[styles.gold_cover]} />
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]} 
                                onPress={this._onGold}
                            >
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                :null}


                {
                    reward.ctype === 2  ?
                    <Modal transparent={true} visible={tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_cons]}>
                            <Image source={asset.lucky_glod} style={styles.layer_head} />
                            <Text style={[styles.lg24_label ,styles.black_label ,styles.pt_20 ,styles.pb_5]}>恭喜你</Text>
                            <Text style={[styles.lg18_label, styles.c33_label]}>获得 {reward.name}</Text>
                            <View style={[styles.layer_icover ,styles.d_flex ,styles.fd_r ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={{uri:reward.img}} style={[styles.goods_cover]} />
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]}
                                onPress={this._onGift}
                            >
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                :null}

                {
                    formType  ?
                    <Modal transparent={true} visible={true} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_info]}>
                            <Image source={asset.bg.lucky_ads} style={styles.info_head} />
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'姓名'}
                                    onChangeText={(text) => {this.setState({name:text});}}
                                    value={name}
                                />
                            </View>
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'手机'}
                                    onChangeText={(text) => {this.setState({mobile:text});}}
                                    value={mobile}
                                />
                            </View>
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'地址'}
                                    onChangeText={(text) => {this.setState({ads:text});}}
                                    value={ads}
                                />
                            </View>
                            <View style={[styles.mt_10,styles.mb_20]}>
                                <Text style={[styles.sm_label,styles.tip_label]}>请确保信息无误，一旦提交无法修改</Text>
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]} onPress={this._onSubmit}>
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                : null}

                <HudView ref={'hud'} />

            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
    },
    layertop:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.6)',
    },
    layer_cons:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:280,
        height:306,
        marginLeft:-140,
        marginTop:-153,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        zIndex:999,
        borderRadius:4,
        alignItems:'center',
    },
    layer_info:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:280,
        height:300,
        marginLeft:-140,
        marginTop:-150,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        zIndex:999,
        borderRadius:5,
        alignItems:'center',
    },
    layer_head:{
        width:'100%',
        height:89,
        marginTop:-24,
    },
    layer_ncover:{
        width:80,
        height:80,
    },
    layer_btns:{
        width:250,
        height:34,
        backgroundColor:'#F4623F',
        borderRadius:5,
    },
    layer_icover:{
        paddingTop:12,
        paddingBottom:30,
    },
    gold_cover:{
        width:60,
        height:60,
        borderRadius:30,
    },
    goods_cover:{
        width:64,
        height:70,
    },
    info_head:{
        width:'100%',
        height:89,
        marginTop:-24,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    },
    layer_item:{
        width:250,
        height:32,
        backgroundColor:'#EEEEEE',
        borderRadius:5,
    },
    input:{
        paddingVertical: 0,
    }
    
});


export const LayoutComponent = Lucky;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        activityflop:state.activity.activityflop,
	};
}
