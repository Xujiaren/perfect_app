import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableWithoutFeedback,DeviceEventEmitter,ScrollView,Keyboard,TouchableOpacity,Image,TextInput,Modal} from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper';
import _ from 'lodash';

import CountDownButton from '../../component/CountDownButton';

import asset from '../../config/asset';
import theme from '../../config/theme';


class BindAccount extends Component {

    static navigationOptions = {
        header:null
    };

    constructor(props){
        super(props);

        const {navigation} = props;

        this.state = {
            unionId: navigation.getParam('unionId', ''),
            code:'',
            mobile:'',
            bindType:false,
            loginType: navigation.getParam('loginType', 0) , //  0 微信登录  1 苹果登录
        };

        this._onCode = this._onCode.bind(this);
        this._onBind = this._onBind.bind(this);
        this._realAuth = this._realAuth.bind(this);
        this._onClose = this._onClose.bind(this);
    }


    componentWillReceiveProps(nextProps){
        const {user} = nextProps
        const {navigation} = this.props

        if (!_.isEqual(user, this.props.user)){
            
            if(user.isAuth === 0){

                this.setState({
                    bindType:true
                })

            }   else {
                navigation.dismiss()
            } 
        }
    }

    componentDidMount() {
    }

    _onCode() {
        const {actions} = this.props;
        const {mobile} = this.state;

        actions.passport.vcode({
            mobile: mobile,
            type:1,
            resolved: (data) => {

            },
            rejected: (msg) => {

            }
        })
    }

    _onBind(){
        const {actions} = this.props;

        const { mobile, code, unionId, loginType} = this.state;

        if(loginType === 0){
            actions.passport.bindMobile({
                union_id:unionId,
                mobile: mobile,
                code: code,
                resolved: (data) => {
                    const udata = data;
                    actions.passport.token({
                        token: udata,
                        resolved: (data) => {
                            actions.user.user()
                        },
                        rejected: (msg) => {
    
                        }
                    })
                },
                rejected: (msg) => {
                }
            })

        } else {

            actions.passport.bindAppleMobile({
                apple_id:unionId,
                mobile: mobile,
                code: code,
                resolved: (data) => {
                    const udata = data;
                    actions.passport.token({
                        token: udata,
                        resolved: (data) => {
                            actions.user.user()
                        },
                        rejected: (msg) => {
    
                        }
                    })
                },
                rejected: (msg) => {
                }
            })

        }
    }


    _onClose(){
        const {navigation} = this.props
        this.setState({
            bindType:false
        },()=>{
            navigation.dismiss()
        })
    }



    _realAuth(){

        DeviceEventEmitter.emit('jump', 'RealAuth');

    }

    render() {
        const {navigation} = this.props
        const {mobile,code,bindType,unionId,loginType} = this.state;

        const enable = mobile.length == 11 && code.length >= 5;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>navigation.dismiss()} style={styles.backicon}>
                        <Image source={asset.left_arrows}  style={[styles.arrow_right]} />
                    </TouchableOpacity>
                    <ScrollView 
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}  
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={[styles.fd_r,styles.ai_ct,styles.mt_40,styles.ml_25]}>
                            <Text style={[styles.lg26_label,styles.c33_label,styles.fw_label]}>绑定手机</Text>
                        </View>
                        <View style={[styles.mt_50,styles.ml_25,styles.mr_25]}>
                            <View style={[styles.row,styles.mt_20,styles.ai_ct,styles.border_bt]}>
                                <Text style={[styles.horange_label]}>+86</Text>
                                <TextInput
                                    style={[styles.col_1,styles.input,styles.pb_10,styles.pt_10, styles.ml_5]}
                                    placeholder={'请输入手机号码'}
                                    clearButtonMode={'while-editing'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    value={mobile}
                                    keyboardType={'phone-pad'}
                                    onChangeText={(text) => {this.setState({mobile:text});}}
                                />
                                <CountDownButton onPress={this._onCode} canSend={mobile.length === 11} />
                            </View>
                            <View style={[styles.row,styles.mt_20,styles.mb_10,styles.border_bt]}>
                                <TextInput
                                    style={[styles.col_1,styles.input,styles.pb_10,styles.pt_10]}
                                    placeholder={'请输入验证码'}
                                    clearButtonMode={'while-editing'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    secureTextEntry={true}
                                    value={code}  keyboardType={'number-pad'}
                                    onChangeText={(text) => {this.setState({code:text});}}
                                />
                            </View>


                            <TouchableOpacity style={[styles.red_label,styles.btns]} disabled={!enable} onPress={this._onBind}>
                                <Text style={[styles.lg_label,styles.white_label, !enable && styles.disabledContainer]}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>


                    <Modal transparent={true} visible={bindType} onRequestClose={() => {}}>
                        <View style={styles.scoreBox}>
                            <View style={[styles.evalBox]}>
                                <Image style={styles.modal_img}  source={{uri:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png"}}/>
                                <View style={[styles.d_flex ,styles.fd_c]}>
                                    <View  style={[styles.fd_r ,styles.jc_ct]}>
                                        <Text style={[styles.lg20_label ,styles.c33_label]}>手机绑定成功</Text>
                                    </View>
                                </View>
                                <View style={[styles.d_flex ,styles.fd_r  ,styles.mt_30 ,styles.eval_btns]}>
                                    <TouchableOpacity style={[styles.col_1 ,styles.d_flex ,styles.ai_ct ,styles.jc_ct ,styles.eval_btns_left ,styles.pt_12 ,styles.pb_12]} 
                                        onPress={this._onClose}
                                    >
                                        <Text style={[styles.lg18_label ,styles.tip_label]}>关闭</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.col_1 ,styles.d_flex ,styles.ai_ct ,styles.jc_ct ,styles.pt_12 ,styles.pb_12]} 
                                        onPress={this._realAuth}
                                    >
                                        <Text style={[styles.lg18_label ,styles.c33_label]}>实名认证</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>


                </View>
                
            </TouchableWithoutFeedback>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        backgroundColor:'#fff',
        flex:1,
    },
    backicon:{
        ...ifIphoneX({
            marginTop: 50,
        }, {
            marginTop:28,
        }),
        marginLeft:18 ,
    },
    arrow_right:{
        width:10,
        height:18,
    },
    btns:{
        width:theme.window.width - 50,
        height:42,
        backgroundColor:'rgba(244,98,63,1)',
        borderRadius:5,
        marginTop:40,
        alignItems:'center',
        justifyContent:'center',
    },

    scoreBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0, 0, 0, 0.4)'
    },
    evalBox:{
        width:280,
        height:184,
        backgroundColor:'#ffffff',
        borderRadius:4,
        flexDirection:'column',
        justifyContent:'flex-end',
        position:'relative'
    },
    modal_img:{
        position:'absolute',
        left:'50%',
        top:-230,
        width:375,
        height:260,
        marginLeft:-187.5,
    },
    eval_btns:{
        borderTopWidth:1,
        borderTopColor:'#E5E5E5',
        borderStyle:'solid'
    },
    eval_btns_left:{
        borderRightWidth:1,
        borderRightColor:'#E5E5E5',
        borderStyle:'solid'
    },
});

export const LayoutComponent = BindAccount;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}
