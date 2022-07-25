import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, AppState, Alert } from 'react-native';

import * as WeChat from 'react-native-wechat-lib';
import Alipay from '@uiw/react-native-alipay';

Alipay.setAlipayScheme('alipay2021002103616468');

import HudView from '../../component/HudView';

import theme from '../../config/theme';
import asset from '../../config/asset';

class OrderPay extends Component {

    static navigationOptions = {
        title: '支付订单',
        headerRight: <View />,
        defaultNavigationOptions: {
            headerLeft: null,//隐藏返回箭头
        }
    };


    constructor(props) {
        super(props);

        const { navigation } = props;
        this.orderSn = navigation.getParam('orderSn', 0);
        this.goodsAmount = navigation.getParam('goodsAmount', 0);


        this.state = {
            payId: 1,

        }

        this._SelectPay = this._SelectPay.bind(this);
        this._onPay = this._onPay.bind(this);
        this._aliPay = this._aliPay.bind(this);
        this._handleOpenURL = this._handleOpenURL.bind(this);
    }

    componentWillReceiveProps() {

    }

    componentWillMount() {

    }

    componentDidMount() {
        const { actions, navigation } = this.props;


        this.focuSub = navigation.addListener('didFocus', (route) => {
            console.log(route);
        })

        AppState.addEventListener('change', this._handleOpenURL);
    }


    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleOpenURL)
    }

    //  监听 
    _handleOpenURL() {
        const { navigation } = this.props;

        navigation.goBack();
    }


    // 选择不同的支付方式
    _SelectPay(type) {
        this.setState({
            payId: type
        })
    }


    // 生成订单 支付
    _onPay() {
        const { navigation, actions } = this.props;
        const { payId } = this.state;

        actions.mall.orderPay({
            order_sn: this.orderSn,
            pay_type: payId,
            resolved: (data) => {

                if (payId === 2) {
                    const param = {
                        appId: data.appid,
                        partnerId: data.partnerid,
                        prepayId: data.prepayid,
                        package: data.package,
                        nonceStr: data.noncestr,
                        timeStamp: data.timestamp,
                        sign: data.sign
                    }

                    WeChat.pay(param).then(() => {
                        Alert.alert('提示', '购买成功', [
                            {
                                text: '确定', onPress: () => {
                                    setTimeout(()=>{navigation.goBack()},1000);

                                }
                            }])

                    }).catch(() => {

                        Alert.alert('提示', '购买失败', [
                            {
                                text: '确定', onPress: () => {
                                    setTimeout(()=>{navigation.goBack()},1000);

                                }
                            }])
                    });

                } else if (payId === 1) {
                    this._aliPay(data);
                }
            },
            rejected: () => {
            }
        })

    }


    // 支付宝支付
    _aliPay(payInfo) {
        Alipay.alipay(payInfo, (resule) => {
            console.log('resule-->>>', resule);
        });
    }


    render() {
        const { payId } = this.state;
        return (
            <View style={[styles.container]}>
                <View style={[styles.pt_40, styles.pb_40, styles.fd_c, styles.jc_ct, styles.ai_ct]}>
                    <Text style={[styles.lg18_label, styles.black_label, styles.fw_label]}>¥<Text style={[styles.lg36_label, styles.black_label, styles.fw_label]}>{this.goodsAmount}</Text></Text>
                    <Text style={[styles.sm_label, styles.tip_label]}>订单编号：{this.orderSn}</Text>
                </View>
                <View style={[styles.bg_white, styles.mt_10, styles.pl_20, styles.pt_12, styles.pb_12, styles.pr_15]}>
                    <Text style={[styles.default_label, styles.c33_label, styles.lh20_label, styles.mb_5]}>支付方式</Text>

                    <TouchableOpacity style={[styles.ai_ct, styles.fd_r, styles.jc_sb, styles.bg_white, styles.pt_15, styles.pb_15, styles.bb_boder]}
                        onPress={() => this._SelectPay(1)}
                    >
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <Image source={asset.pay.ali_pay} style={[styles.pay_icon, styles.mr_10]} />
                            <Text style={[styles.gray_label, styles.default_label]}>支付宝</Text>
                        </View>
                        <Image source={payId === 1 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct, styles.fd_r, styles.jc_sb, styles.bg_white, styles.pt_15, styles.pb_15]}
                        onPress={() => this._SelectPay(2)}
                    >
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <Image source={asset.pay.wechat_pay} style={[styles.pay_icon, styles.mr_10]} />
                            <Text style={[styles.gray_label, styles.default_label]}>微信支付</Text>
                        </View>
                        <Image source={payId === 2 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.btn, styles.mt_40]} onPress={this._onPay}>
                    <Text style={[styles.white_label, styles.lg_label]}>确认支付</Text>
                </TouchableOpacity>
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    pay_icon: {
        width: 20,
        height: 20,
    },
    icon_cover: {
        width: 16,
        height: 16
    },
    bb_boder: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F0F0F0',
    },
    btn: {
        margin: 20,
        height: 54,
        borderRadius: 5,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export const LayoutComponent = OrderPay;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}
