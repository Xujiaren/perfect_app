import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Image, TextInput, DeviceEventEmitter, Linking, requireNativeComponent, Keyboard, Platform, Alert } from 'react-native';
import store from 'react-native-simple-store';
import asset from '../../config/asset';
import theme from '../../config/theme';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CountDownButton from '../../component/CountDownButton';
import HudView from '../../component/HudView';
import _ from 'lodash';
import * as WeChat from 'react-native-wechat-lib';

const NativeView = requireNativeComponent('SignWithApple');


class PassPort extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            type: 0,
            code: '',
            mobile: '',
            pwd: '',
            fuser: '',
            isWechat: false,
            ios: Platform.OS === 'ios',
            isAgree: false,
        };

        this._onCode = this._onCode.bind(this);
        this._onLogin = this._onLogin.bind(this);
        this._onWechat = this._onWechat.bind(this);
        this._onOAuth = this._onOAuth.bind(this);
        this._onApple = this._onApple.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this._onJudgewechat();
    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (!_.isEqual(user, this.props.user)) {
            store.push("token", user.token);
        }
    }
    // 判断 手机 是否 有微信
    _onJudgewechat() {
        var url = 'wechat://';

        if (Platform.OS === 'ios') {
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    this.setState({
                        isWechat: false
                    })
                } else {
                    setTimeout(() => this.setState({ isWechat: true }), 2000);
                }
            }).catch(err => console.err(err));
        } else {
            this.setState({
                isWechat: true
            })
        }

    }



    _onCode() {
        const { actions } = this.props;
        const { mobile, isAgree } = this.state;
        actions.passport.vcode({
            mobile: mobile,
            type: 0,
            resolved: (data) => {

            },
            rejected: (msg) => {

            }
        })
    }

    _onLogin() {
        const { actions, navigation } = this.props;
        const { type, mobile, code, fuser, isAgree } = this.state;
        if (!isAgree) {
            this.refs.hud.show('请先阅读并且同意该协议', 1);
            return;
        }

        actions.passport.login({
            mobile: mobile,
            type: type,
            code: code,
            fuser: fuser,
            resolved: (data) => {
                const udata = data;

                actions.passport.token({
                    token: udata.token,
                    resolved: (data) => {
                        if (!udata.pwd) {
                            navigation.replace('SetPwd');
                        } else {
                            navigation.dismiss();
                            if (!udata.valid) {
                                DeviceEventEmitter.emit('jump', 'RealAuth');
                            }
                        }
                    },
                    rejected: (msg) => {

                    }
                })
            },
            rejected: (msg) => {

                let tip = '系统错误，请联系工作人员。';
                if (msg == 'USER_ERROR') {
                    tip = '请点击微信登录按钮，登录注册。';

                    this.refs.hud.show(tip, 2, () => {
                        this._onWechat();
                    });

                } else if (msg == 'ACCOUNT_DENY') {
                    tip = '账户已禁用，请联系工作人员。';
                    this.refs.hud.show(tip, 2);
                } else if (msg == 'CODE_ERROR') {
                    tip = '验证码错误';
                    this.refs.hud.show(tip, 2);
                } else if (msg == 'PASSWORD_ERROR') {
                    tip = '密码错误';
                    this.refs.hud.show(tip, 2);
                } else {
                    this.refs.hud.show(tip, 2);
                }
                
            }
        })
    }

    _onWechat() {
        const{isAgree}=this.state
        if (!isAgree) {
            this.refs.hud.show('请先阅读并且同意该协议', 1);
            return;
        }

        WeChat.isWXAppInstalled().then((installed) => {
            if (installed) {
                WeChat.sendAuthRequest('snsapi_userinfo', 'wechat_sdk_demo').then(responseCode => {

                    this._onOAuth(responseCode.code, 0,);
                })
            } else {
                this.refs.hud.show('未找到微信', 1);
            }
        });
    }


    _onOAuth(code, fuser) {
        const { actions, navigation } = this.props

        actions.passport.wechatRLogin({
            code: code,
            fuser: fuser,
            resolved: (data) => {
                if (data.reqType === 'bind') {
                    navigation.replace('BindAccount', { unionId: data.unionId, loginType: 0 });
                } else if (data.reqType === 'login') {
                    actions.passport.token({
                        token: data.token,
                        resolved: (data) => {
                            actions.user.user();
                            navigation.navigate('User');
                        },
                        rejected: (msg) => {
                            this.refs.hud.show('登录失败', 1);
                        }
                    })
                }

            },
            rejected: (msg) => {
                this.refs.hud.show(msg, 1);
            }
        })
    }


    _onApple(info) {
        const { navigation, actions } = this.props;
        const{isAgree}=this.state
        if (!isAgree) {
            this.refs.hud.show('请先阅读并且同意该协议', 1);
            return;
        }
        if (info.nativeEvent.success) {
            const apple_id = info.nativeEvent.success;
            const that = this;

            actions.passport.appleLogin({
                apple_id: apple_id,
                authorization_code: '',
                identity_token: '',

                resolved: (data) => {

                    if (data.reqType === 'bind') {
                        navigation.replace('BindAccount', { unionId: apple_id, loginType: 1 });
                    } else if (data.reqType === 'login') {
                        actions.passport.token({
                            token: data.token,
                            resolved: (data) => {
                                actions.user.user();
                                navigation.navigate('User');
                            },
                            rejected: (msg) => {
                                that.refs.hud.show('登录失败', 1);
                            }
                        })
                    }
                },
                rejected: (msg) => {
                    that.refs.hud.show(msg, 1);

                    //A13861066450bn
                }
            })

        } else if (info.nativeEvent.error) {
            Alert.alert('苹果登录', info.nativeEvent.error)
        }
    }


    render() {
        const { navigation } = this.props;
        const { type, code, mobile, fuser, isWechat, ios, isAgree } = this.state;
        const enable = mobile.length == 11 && code.length >= 5;

        const majorVersionIOS = parseInt(Platform.Version, 10);

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.dismiss()} style={styles.backicon}>
                        <Image source={asset.left_arrows} style={[styles.arrow_right]} />
                    </TouchableOpacity>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                        <View style={[styles.fd_r, styles.ai_ct, styles.mt_40, styles.ml_25]}>
                            <Image source={asset.header_icon} style={styles.header_icon} />
                        </View>
                        {type == 0 ?
                            <View>
                                <View style={[styles.mt_50, styles.ml_25, styles.mr_25]}>
                                    <View style={[styles.row, styles.mt_20, styles.ai_ct, styles.border_bt]}>
                                        <Text style={[styles.horange_label]}>+86</Text>
                                        <TextInput
                                            style={[styles.col_1, styles.input, styles.pb_10, styles.pt_10, styles.ml_5]}
                                            placeholder={'请输入手机号码'}
                                            clearButtonMode={'while-editing'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            value={mobile}
                                            keyboardType={'phone-pad'}
                                            onChangeText={(text) => { this.setState({ mobile: text }); }}
                                        />
                                        <CountDownButton onPress={this._onCode} canSend={mobile.length === 11} />
                                    </View>
                                    <View style={[styles.row, styles.mt_20, styles.mb_10, styles.border_bt]}>
                                        <TextInput
                                            style={[styles.col_1, styles.input, styles.pb_10, styles.pt_10]}
                                            placeholder={'请输入验证码'}
                                            clearButtonMode={'while-editing'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            secureTextEntry={true}
                                            value={code} keyboardType={'number-pad'}
                                            onChangeText={(text) => { this.setState({ code: text }); }}
                                        />
                                    </View>
                                    {/* <View style={[styles.row,styles.mt_20,styles.mb_10,styles.border_bt]}>
                                    <TextInput
                                        style={[styles.col_1,styles.input,styles.pb_10,styles.pt_10]}
                                        placeholder={'请输入邀请码（非必填）'}
                                        clearButtonMode={'while-editing'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        value={fuser}  keyboardType={'phone-pad'}
                                        onChangeText={(text) => {this.setState({fuser:text});}}
                                    />
                                </View> */}
                                    <TouchableOpacity style={[styles.red_label, styles.btns]} disabled={!enable} onPress={this._onLogin}>
                                        <Text style={[styles.lg_label, styles.white_label, !enable && styles.disabledContainer]}>登录</Text>
                                    </TouchableOpacity>
                                    <View style={[styles.fd_r, styles.jc_fe, styles.mt_20]}>
                                        <TouchableOpacity onPress={() => {
                                            if (!isAgree) {
                                                this.refs.hud.show('请先阅读并且同意该协议', 1);
                                                return;
                                            }
                                            this.setState({ type: 1, code: '' })
                                        }}>
                                            <Text style={[styles.sred_label, styles.sm_label]}>密码登录</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    isWechat || (ios && majorVersionIOS >= 13) ?
                                        <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, styles.mt_30]}>
                                            <Text style={[styles.tip_label, styles.sm_label]}>首次登录建议使用微信授权登录</Text>
                                            <View style={[styles.fd_r, styles.mt_12, styles.loginBox]}>
                                                {
                                                    isWechat ?
                                                        <TouchableOpacity onPress={this._onWechat} style={[styles.fd_c, styles.jc_ct, styles.ai_ct, styles.loginBox_items]}>
                                                            <Image source={asset.passport_wechat} style={styles.oauth_icon} />
                                                        </TouchableOpacity>
                                                        : null}

                                                {
                                                    ios && majorVersionIOS >= 13 ?
                                                        <View>
                                                            <NativeView
                                                                style={[styles.fd_c, styles.jc_ct, styles.ai_ct, styles.loginBox_items]}
                                                                onClick={(info) => this._onApple(info)}
                                                            >
                                                                <Image source={asset.passport_apple} style={styles.oauth_icon} />
                                                            </NativeView>

                                                        </View>

                                                        : null}
                                            </View>
                                        </View>
                                        : null}
                                <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, styles.mt_30]}>
                                    <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => {
                                        this.setState({
                                            isAgree: !isAgree,
                                        })
                                    }}>
                                        {
                                            isAgree ?
                                                <Image source={asset.checked} style={[{ width: 16, height: 16 }]} resizeMode='cover' />
                                                :
                                                <Image source={asset.uncheck} style={[{ width: 16, height: 16 }]} resizeMode='cover' />
                                        }
                                        <Text style={[styles.tip_label, styles.sm_label, styles.ml_5]}>您已阅读并同意</Text>
                                    </TouchableOpacity>
                                    <View style={[styles.fd_r, styles.mt_12]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('ServiceAgreement', { type: 0 })}>
                                            <Text style={[styles.sm_label, styles.sred_label]}>《完美教育服务协议》</Text>
                                        </TouchableOpacity>
                                        <Text style={[styles.tip_label, styles.sm_label]}>和</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy', { type: 0 })}>
                                            <Text style={[styles.sm_label, styles.sred_label]}>《完美教育隐私服务》</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={[styles.mt_50, styles.ml_25, styles.mr_25]}>
                                <View style={[styles.row, styles.mt_20, styles.ai_ct, styles.border_bt]}>
                                    <Text style={[styles.horange_label]}>+86</Text>
                                    <TextInput
                                        style={[styles.col_1, styles.input, styles.pb_10, styles.pt_10, styles.ml_5]}
                                        placeholder={'请输入手机号码'}
                                        clearButtonMode={'while-editing'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        value={mobile}
                                        keyboardType={'phone-pad'}
                                        onChangeText={(text) => { this.setState({ mobile: text }); }}
                                    />
                                </View>
                                <View style={[styles.row, styles.mt_20, styles.mb_10, styles.border_bt]}>
                                    <TextInput
                                        style={[styles.col_1, styles.input, styles.pb_10, styles.pt_10]}
                                        placeholder={'请输入密码'}
                                        clearButtonMode={'while-editing'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        secureTextEntry={true}
                                        value={code}
                                        onChangeText={(text) => { this.setState({ code: text }); }}
                                    />
                                </View>
                                <TouchableOpacity style={[styles.red_label, styles.btns, !enable && styles.disabledContainer]} disabled={!enable} onPress={this._onLogin}>
                                    <Text style={[styles.lg_label, styles.white_label]}>登录</Text>
                                </TouchableOpacity>
                                <View style={[styles.mt_20]}>
                                    <View style={[styles.fd_r, styles.jc_sb]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('ForgetPwd')}>
                                            <Text style={[styles.tip_label, styles.sm_label]}>忘记密码？</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ type: 0, code: '' })}>
                                            <Text style={[styles.sred_label, styles.sm_label]}>快速登录</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                    </ScrollView>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    backicon: {
        ...ifIphoneX({
            marginTop: 50,
        }, {
            marginTop: 28,
        }),
        marginLeft: 18,
    },
    arrow_right: {
        width: 10,
        height: 18,
    },
    header_icon: {
        width: 144,
        height: 30,
    },
    tipbtn: {
        width: 74,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: 'rgba(244,98,63,0.4)',
    },
    btns: {
        width: theme.window.width - 50,
        height: 42,
        backgroundColor: 'rgba(244,98,63,1)',
        borderRadius: 5,
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    oauth_icon: {
        width: 44,
        height: 44
    },
    input: {
        paddingVertical: 0,
    },
    loginBox: {
        width: 204,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center"
    },
    loginBox_items: {
        width: 100,
        height: 50,
        justifyContent: 'space-between'
    }
});


export const LayoutComponent = PassPort;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}
