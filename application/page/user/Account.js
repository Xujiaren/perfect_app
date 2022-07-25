import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import _ from 'lodash';
import asset from '../../config/asset';
import theme from '../../config/theme';
import CountDownButton from '../../component/CountDownButton';
import LabelBtn from '../../component/LabelBtn';
import HudView from '../../component/HudView';
class Account extends Component {

    static navigationOptions = {
        title: '账号',
        headerRight: <View />,
    };
    constructor(props) {
        super(props);

        this.state = {
            typs: 0,
            mobile: '',
            code: '',
            user_mobile:''
        }
    }

    componentDidMount() {
        const { actions } = this.props;
        actions.user.user();
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
       
        this.setState({
            user_mobile:user.mobile
        })
    }
    _onPage = (nav_val) => {
        const { navigation } = this.props;
        navigation.navigate(nav_val);
    }
    _onCode = () => {
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
    onMobile = () => {
        const { mobile, code } = this.state
        const { actions } = this.props
        if (!code) {
            this.refs.hud.show('请输入验证码', 1);
            return;
        }

        Alert.alert('提示', '确定更改手机号', [
            {
                text: '取消', onPress: () => {

                }
            }, {
                text: '确定', onPress: () => {
                    actions.user.editMobile({
                        code: code,
                        mobile: mobile,
                        type: 1,
                        resolved: (res) => {
                            this.refs.hud.show('修改成功', 2);
                            this.setState({
                                user_mobile:mobile,
                                typs:0
                            })
                        },
                        rejected: (err) => {
                            let tip = '系统错误，请联系工作人员。';
                            if (msg == 'ACCOUNT_DENY') {
                                tip = '账户已禁用，请联系工作人员。';
                                this.refs.hud.show(tip, 2);
                            } else if (msg == 'CODE_ERROR') {
                                tip = '验证码错误';
                                this.refs.hud.show(tip, 2);
                            }  else {
                                this.refs.hud.show(tip, 2);
                            }
                        }
                    })
                }
            }])
    }

    render() {
        const { navigation, user } = this.props;
        const{user_mobile}=this.state
        let mobile = user_mobile || '';

        const mobile_val = mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

        return (
            <View style={styles.container}>
                <View style={[styles.fd_r, styles.jc_sb, styles.pt_20, styles.pb_20, styles.pl_35, styles.pr_35]}>
                    {
                        this.state.typs == 0 ?
                            <Text style={[styles.black_label, styles.lg18_label]}>{mobile_val}</Text>
                            :
                            <View style={[{ width: '100%' }]}>
                                <View style={[styles.row, styles.ai_ct, { width: '100%' }]}>
                                    <TextInput
                                        style={[styles.col_1, styles.input, styles.pb_10, styles.pt_10]}
                                        placeholder={'请输入手机号码'}
                                        clearButtonMode={'while-editing'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        value={this.state.mobile}
                                        keyboardType={'phone-pad'}
                                        onChangeText={(text) => { this.setState({ mobile: text }); }}
                                    />
                                    <CountDownButton onPress={this._onCode} canSend={this.state.mobile.length === 11} />
                                </View>
                                <View style={[styles.row, styles.ai_ct, { width: '60%' }]}>
                                    <TextInput
                                        style={[styles.col_1, styles.input, styles.pb_10, styles.pt_10]}
                                        placeholder={'请输入验证码'}
                                        clearButtonMode={'while-editing'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        secureTextEntry={true}
                                        value={this.state.code} keyboardType={'number-pad'}
                                        onChangeText={(text) => { this.setState({ code: text }); }}
                                    />
                                </View>
                                <View style={[styles.row, styles.ai_ct, styles.jc_ct, styles.mt_10, { width: '100%' }]}>
                                    <TouchableOpacity style={[styles.row, styles.jc_ct, styles.ai_ct, styles.bg_sred, { width: 300, height: 30, borderRadius: 8 }]} onPress={() => this.onMobile()}>
                                        <Text style={[styles.white_label, { fontSize: 18 }]}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }

                    {/* <TouchableOpacity style={[styles.signBox]} onPress={() => navigation.navigate('UserSignIn')}>
                        <Text style={[styles.red_label,styles.sm_label]}>签到</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={[styles.pl_15, styles.pr_15, styles.bg_white]}>
                    <LabelBtn label={this.state.typs == 0 ? '修改手机号' : '取消修改手机号'} nav_val={'Mobile'} clickPress={() => {
                        if (this.state.typs == 0) {
                            this.setState({
                                typs: 1
                            })
                        } else {
                            this.setState({
                                typs: 0
                            })
                        }

                    }} />
                    <LabelBtn label={'修改密码'} nav_val={'SetMobile'} clickPress={this._onPage} />
                    <LabelBtn label={'微信'} nav_val={''} type={'已绑定'} color={'#F4623F'} clickPress={this._onPage} />
                </View>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    signBox: {
        width: 56,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F4623F',
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        paddingVertical: 0,
    },
});

export const LayoutComponent = Account;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}
