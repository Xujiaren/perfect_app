import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableWithoutFeedback,TouchableOpacity,ScrollView,Image,TextInput,Keyboard} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';


import zxcvbn  from 'zxcvbn';
import asset from '../../config/asset';
import iconMap from '../../config/font';
import theme from '../../config/theme';
import HudView from '../../component/HudView';


class SetPwd extends Component {
    
    static navigationOptions = {
        header:null
    };

    constructor(props){
        super(props);
        const {navigation} = props;
        const {params = {}} = navigation.state;
        
        this.state = {
            type: params.type || 0,
            code: params.code || '',
            mobile: params.mobile || '',
            new_pwd:'',
            confirm_pwd:'',
            new_pwd_hide: true,
            confirm_pwd_hide: true,
            score: 0,
        };

        this._onCheck = this._onCheck.bind(this);
        this._onPassword = this._onPassword.bind(this);
    }

    _onCheck(new_pwd) {
        this.setState({
            new_pwd: new_pwd,
            score: zxcvbn(new_pwd).score,
        })
    }

    _onPassword() {
        const {actions, navigation} = this.props;
        const {mobile, code, new_pwd} = this.state;

        if (this.state.type == 0) {
            actions.user.pwd({
                pwd: new_pwd,
                resolved: (data) => {
                    this.refs.hud.show('密码修改成功！', 1, () => {
                        navigation.navigate('User');
                    });
                },
                rejected: (msg) => {
    
                }
            })
        } else {
            actions.passport.resetpwd({
                mobile: mobile,
                code: code,
                password: new_pwd,
                resolved: (data) => {
                    this.refs.hud.show('密码重置成功！', 1, () => {
                        navigation.navigate('PassPort');
                    });
                },
                rejected: (msg) => {
    
                }
            })
        }
    }
    
    render() {
        const {navigation} = this.props;
        const {new_pwd, confirm_pwd, new_pwd_hide, confirm_pwd_hide, score} = this.state;

        let dmsg = '-';
        let diff = 0;

        if (new_pwd != '') {
            if (score < 2) {
                dmsg = '弱';
            } else if (score < 4) {
                dmsg = '中';
                diff = 1;
            } else {
                dmsg = '难';
                diff = 2;
            }
        }

        const enable = new_pwd.length >= 6 && new_pwd == confirm_pwd;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView style={{flex:1}}  
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}  keyboardShouldPersistTaps={'handled'}>
                        <TouchableOpacity onPress={()=>navigation.navigate('User')} style={styles.backicon}>
                            <Image source={asset.left_arrows}  style={[styles.arrow_right]} />
                        </TouchableOpacity>
                        <View style={[styles.fd_r,styles.ai_ct,styles.mt_40,styles.ml_25]}>
                            <Text style={[styles.lg26_label,styles.c33_label,styles.fw_label]}>设置密码</Text>
                        </View>
                        <View style={[styles.mt_40,styles.ml_25,styles.mr_25]}>
                            <View style={[styles.row,styles.mt_20,styles.mb_10,styles.border_bt]}>
                                <TextInput
                                    style={[styles.col_1,styles.input,styles.pb_10,styles.pt_10]}
                                    ref={ (ref)=>this.textInput = ref }
                                    maxLength={12}
                                    placeholder={'请输入密码（6-12位，包含大小写字母、数字）'}
                                    clearButtonMode={'while-editing'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    defaultValue={new_pwd}
                                    secureTextEntry={new_pwd_hide}
                                    onChangeText={(text) => { this._onCheck(text)}}
                                />
                                <Text style={[styles.sm_label, styles.tip_label, styles.mt_10]}>复杂度 <Text style={[styles.sm_label, diff == 0 && styles.sred_label, diff == 1 && styles.orange_label, diff == 2 && styles.green_label]}>{dmsg}</Text></Text>
                                <TouchableOpacity style={[styles.ml_5, styles.mt_10]} onPress={() => this.setState({
                                    new_pwd_hide: !new_pwd_hide
                                })}>
                                    <Text style={[styles.icon, styles.lg_label, styles.cd0_label]}>{iconMap(new_pwd_hide ? 'yincang' : 'xianshi1')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.row,styles.mt_20,styles.mb_10,styles.border_bt]}>
                                <TextInput
                                    style={[styles.col_1,styles.input,styles.pb_10,styles.pt_10]}
                                    ref={ (ref)=>this.textInput = ref }
                                    maxLength={12}
                                    placeholder={'请再次输入密码'}
                                    clearButtonMode={'while-editing'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    defaultValue={confirm_pwd}
                                    secureTextEntry={confirm_pwd_hide}
                                    onChangeText={(text) => { this.setState({confirm_pwd: text})}}
                                />
                                <TouchableOpacity style={[styles.ml_5, styles.mt_10]} onPress={() => this.setState({
                                    confirm_pwd_hide: !confirm_pwd_hide
                                })}>
                                    <Text style={[styles.icon, styles.lg_label, styles.cd0_label]}>{iconMap(confirm_pwd_hide ? 'yincang' : 'xianshi1')}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.btns, !enable && styles.disabledContainer]} disabled={!enable} onPress={this._onPassword}>
                                <Text style={[styles.lg_label,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <HudView ref={'hud'} />
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
    header_icon:{
        width:144,
        height:30,
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
    input:{
        paddingVertical: 0,
    }
});


export const LayoutComponent = SetPwd;

export function mapStateToProps(state) {
	return {
	};
}
