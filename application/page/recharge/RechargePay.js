import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,Platform,AppState,NativeModules} from 'react-native';

import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';

import * as WeChat from 'react-native-wechat-lib';
import Alipay from '@uiw/react-native-alipay';

Alipay.setAlipayScheme('alipay2021002103616468');

class RechargePay extends Component {


    static navigationOptions = ({navigation}) => {
        
		return {
            title: '充值支付',
            headerRight: <View/>,
        }
        
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.re_item = navigation.getParam('re_item', {});

        this.state = {
            payId:0, // 0 支付宝 1 微信  4 苹果  9 小程序
            rechargeId:this.re_item.rechargeId
        }

        this._SelectPay = this._SelectPay.bind(this);

    }

    componentDidMount(){
        AppState.addEventListener('change', this._handleOpenURL);
    }

    componentWillReceiveProps(nextProps){
        const { navigation } = nextProps;



    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleOpenURL)
    }
    
    //  监听 
    _handleOpenURL(){
        const {navigation } = this.props;

        navigation.goBack();
    }

    _SelectPay(type){
        
        this.setState({
            payId:type
        })

    }

    _onPlay = () => {

        const {payId,rechargeId} = this.state;
        const {actions,navigation} = this.props;
        
        if(payId === 0 || payId === 1){
            actions.charge.payCharge({
                recharge_id:rechargeId,
                pay_type:payId,
                resolved: (data) => {
                    
                    if(payId === 1) {
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
                
                            this.refs.hud.show('购买成功', 1);
                            setTimeout(()=>{navigation.goBack()},1000);
                            
                        }).catch(() => {
                
                            this.refs.hud.show('购买失败', 1);
    
                            setTimeout(()=>{navigation.goBack()},1000);
                        });
    
                    } else if(payId === 0){
    
                        this._aliPay(data);
    
                    } 
                },
                rejected: (msg) => {
    
                }
            })
        }  else if (payId === 4) {

            const { InAppUtils } = NativeModules;

            InAppUtils.canMakePayments((canMakePayments) => {
                console.info("iap:" + canMakePayments + " product:" );
                if(canMakePayments){
                    InAppUtils.loadProducts(['23433534'], (error, products) => {
                        console.log(products)
                        InAppUtils.purchaseProduct('23433534', (error, response) => {
                            console.log(response)
                        })
                    })
                }
            })
        }
        
    }

    // 支付宝支付
    _aliPay(payInfo){
        Alipay.alipay(payInfo, (resule) => {
            console.log('resule-->>>', resule);
        });
    }


    render() {
        const {payId,rechargeId} = this.state;

        let ok = Platform.OS === 'android' ; // true android false ios

        return (
            <View style={[styles.container]}>
                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20,styles.bg_white,styles.mb_1]}>
                    <Text style={[styles.c33_label,styles.default_label]}>商品名称</Text>
                    <Text style={[styles.c33_label,styles.default_label,styles.fw_label]}>{this.re_item.rechargeIntegral} 学分</Text>
                </View>
                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20,styles.bg_white,styles.mb_1]}>
                    <Text style={[styles.c33_label,styles.default_label]}>金额</Text>
                    <Text style={[styles.c33_label,styles.default_label,styles.fw_label]}>￥{ok ? this.re_item.amount : this.re_item.iosAmount}</Text>
                </View>
                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20,styles.bg_white,styles.mb_1]}>
                    <Text style={[styles.c33_label,styles.default_label]}>待支付</Text>
                    <Text style={[styles.sred_label,styles.default_label,styles.fw_label]}>￥{ok ? this.re_item.amount : this.re_item.iosAmount}</Text>
                </View>
                <View style={[styles.mt_30,styles.ml_25]}> 
                    <Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>选择支付方式</Text>
                </View>

                <View style={[styles.mt_15]}>
                    <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20]}
                        onPress={()=>this._SelectPay(0)}
                    >
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Image source={asset.pay.ali_pay} style={[styles.pay_icon,styles.mr_10]} />
                            <Text style={[styles.gray_label,styles.default_label]}>支付宝</Text>
                        </View>
                        <Image source={ payId === 0 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20]}
                        onPress={()=>this._SelectPay(1)}
                    >
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Image source={asset.pay.wechat_pay} style={[styles.pay_icon,styles.mr_10]} />
                            <Text style={[styles.gray_label,styles.default_label]}>微信支付</Text>
                        </View>
                        <Image source={ payId === 1 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20]}
                        onPress={()=>this._SelectPay(4)}
                    >
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Image source={asset.pay.iphone_pay} style={[styles.pay_icon,styles.mr_10]} />
                            <Text style={[styles.gray_label,styles.default_label]}>苹果支付</Text>
                        </View>
                        <Image source={ payId === 4 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                    </TouchableOpacity>

                </View>


                <TouchableOpacity style={[styles.pay_btn,styles.mt_50]} onPress={this._onPlay}>
                    <Text style={[styles.white_label,styles.lg_label,styles.fw_label]}>确认支付</Text>
                </TouchableOpacity>

                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FAFAFA',
    },
    pay_icon:{
        width:20,
        height:20,
    },
    icon_cover:{
        width:14,
        height:14
    },
    pay_btn:{
        backgroundColor:'#F4623F',
        borderRadius:5,
        margin:20,
        height:44,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
})


export const LayoutComponent = RechargePay;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}

