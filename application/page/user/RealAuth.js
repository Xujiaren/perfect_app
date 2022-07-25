import React, { Component } from 'react';
import { Text, View ,TextInput,TouchableOpacity,StyleSheet,Alert,TouchableWithoutFeedback, ScrollView,Platform,Keyboard} from 'react-native';

import theme from '../../config/theme';
import HudView from '../../component/HudView';

import * as  DataBase from '../../util/DataBase';

class RealAuth extends Component {
    static navigationOptions = {
        title:'实名认证',
        headerRight: <View/>,
    }

    constructor(props){
        super(props);

        this.state = {
            vip:'',
            Idcard:'',
            authNum:1
        };

        this._onAuth = this._onAuth.bind(this);
        this._toLink = this._toLink.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentWillUnmount(){
        DataBase.setItem('authNum', 1);
    }

    _onSubmit(){
        DataBase.getItem('authNum').then(data => {
            if (data == null) {
                this.setState({
                    authNum: 1,
                },()=>{
                    this._onAuth()
                });
            } else {
                this.setState({
                    authNum: data,
                },()=>{
                    this._onAuth(data);
                });
            }
        });
    }

    _onAuth(){
        const {actions,navigation} = this.props;
        const {vip,Idcard,authNum} = this.state;

        if (vip.length === 8 || vip.length === 10){
            if (Idcard.length === 6){
                actions.user.userauth({
                    sn:vip,
                    pwd:Idcard,
                    resolved: (data) => {
                        actions.user.user();
                        this.refs.hud.show('认证成功', 2);
                        setTimeout(()=>navigation.goBack(),2000);
					},
					rejected: (res) => {
                        if(authNum < 4){
                            if (res === 'PWD_ERROR' || res === 'USER_ERROR' ){
                                Alert.alert('实名认证','您输入的帐号与身份证信息不符，请重新填写');
                            } else if (res === 'bind limit exceeded'){
                                Alert.alert('实名认证','系统检测您的VIP卡号已与另一个微信账号绑定，请登录原账号使用，如需换绑，请到“帮助反馈”中提交您的VIP卡号进行申请。',[
                                    {text:'确定',onPress:() => navigation.navigate('FeedBack')}
                                ],{cancelable:false}); 
                            } else if(res == 'card and pwd already bound'){
                                Alert.alert('实名认证','当前卡号和密码已被绑定');
                            } else if(res == 'SYSTEM_ERROR'){
                                Alert.alert('实名认证','系统错误');
                            }else if(res == 'USER_EXPIRED'){
                                Alert.alert('实名认证','卡号过期');
                            }
    
                            DataBase.setItem('authNum', authNum + 1);
                        } else {
                            Alert.alert('实名认证','您已输错超过三次，请致电客 \n 服咨询4008701828');
                        }
                        
					},
                });
            } else {
                Alert.alert('提示','身份证号码填写不完整');
            }
        } else {
            Alert.alert('提示','VIP卡号/序列号填写不正确');
        }
    }


    _toLink(){
        const {navigation} = this.props

        navigation.navigate('AdWebView',{link:'https://wap.perfect99.com/#/shop/register'})
    }

    render() {

        const {vip,Idcard} = this.state;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView
                        style={{flex:1}}  
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}  
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={[styles.nickwrap]}>
                            <View style={[styles.pt_15,styles.pb_15 ,styles.pl_30 ,styles.bg_white ,styles.mt_10 ,styles.fd_r]}>
                                <Text style={[styles.c33_label, styles.default_label,styles.pr_15]}>VIP卡号</Text>
                                <TextInput
                                    style={[styles.right_label,styles.col_1,styles.pr_20,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'VIP卡号'}
                                    onChangeText={(text) => {this.setState({vip:text});}}
                                    value={vip}
                                />
                            </View>
                            <View style={[styles.pt_15,styles.pb_15 ,styles.pl_30 ,styles.bg_white ,styles.mt_1 ,styles.fd_r]}>
                                <Text style={[styles.c33_label, styles.default_label,styles.pr_15]}>身份证后6位</Text>
                                <TextInput
                                    style={[styles.right_label,styles.col_1,styles.pr_20,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    secureTextEntry={true}
                                    placeholder={'请输入身份证的后六位'}
                                    onChangeText={(text) => {this.setState({Idcard:text});}}
                                    value={Idcard}
                                />
                            </View>
                            <TouchableOpacity style={[styles.m_20  ,styles.btn ,styles.pt_10 ,styles.pb_10,styles.fd_r,styles.jc_ct]} onPress={this._onSubmit} >
                                <Text style={[styles.white_label]}>认证</Text>
                            </TouchableOpacity>


                            {
                                Platform.OS == 'ios' ? 
                                null:
                                <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]} 
                                    onPress={this._toLink}
                                > 
                                    <Text style={[styles.default_label ,styles.red_label]}>没有VIP卡号？立即注册</Text>
                                </TouchableOpacity>
                            }
                            <HudView ref={'hud'} />
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        backgroundColor:'#FAFAFA',
        flex:1,
    },
    btn:{
        backgroundColor:'#F4623F',
        borderRadius: 5,
        marginTop:150,
    },
    input:{
        paddingVertical: 0,
    }
});

export const LayoutComponent = RealAuth;

export function mapStateToProps(state) {
	return {
	};
}