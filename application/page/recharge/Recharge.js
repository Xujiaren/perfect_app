import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Platform} from 'react-native';

import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';

class Recharge extends Component {

    static navigationOptions = ({navigation}) => {
        
		return {
            title: '充值',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('RcRecord')} style={[styles.pr_15]}>
                    <Text style={[styles.sm_label ,styles.gray_label]}>充值记录</Text>
                </TouchableOpacity>
            ),
		}
    };


    constructor(props){
        super(props);

        this.charge = [];

        this.state = {
            status:0,
            rechargeId:0,
            userintegral:0,
            re_item:{},
        }

        this._onSelect = this._onSelect.bind(this);
        this._onPay = this._onPay.bind(this);
    }

    componentDidMount(){

        const {actions} = this.props;
        actions.charge.charge();
        actions.user.user();

    }

    componentWillReceiveProps(nextProps){
        const { navigation,charge , user} = nextProps;

        if(charge != this.props.charge){
            this.charge = charge;
        }

        if(user !== this.props.user){
            this.setState({
                userintegral:user.integral
            })
        }

    }

    componentWillUnmount(){

    }

    _onSelect(item){

        this.setState({
            rechargeId:item.rechargeId,
            re_item:item
        })

    }


    _onPay(){

        // const param = {
        //     appId: '2323',
        //     partnerId:  '2323',
        //     prepayId:  '2323',
        //     package:  '2323',
        //     nonceStr:  '2323',
        //     timeStamp:  '2323',
        //     sign: '2323'
        // }

        // WeChat.pay(param).then(data => {

        //     this.refs.hud.show('充值成功', 1);
            
        // }).catch(err => {

        //     console.log(err)
        //     this.refs.hud.show('充值失败', 1);
        // });

        const {re_item} = this.state;
        const {navigation} = this.props;

        navigation.navigate('RechargePay',{re_item:re_item,});
    }


    render() {

        const {navigation} = this.props;
        const {rechargeId,userintegral} = this.state;

        let ok = Platform.OS === 'android' ; // true android false ios

        return (
            <View style={[styles.container]}>
                <ScrollView style={{paddingLeft:16,paddingRight:16}}
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                >

                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mb_15,styles.mt_15]}>
                        <Text style={[styles.default_label,styles.black_label,styles.fw_label]}><Text style={[styles.lg36_label,styles.black_label,styles.fw_label]}>{userintegral}</Text>学分</Text>
                    </View>

                    <Text style={[styles.tip_label,styles.default_label]}>充值</Text>

                    <View style={[styles.cates,styles.fd_r,styles.ai_ct,styles.f_wrap,styles.jc_sb,styles.mt_15]}>
                        {
                            Array.isArray(this.charge)&&this.charge.map((item,index)=>{

                                const on = item.rechargeId === rechargeId;

                                return(
                                    <TouchableOpacity style={[styles.cate_item,styles.fd_c,styles.ai_ct,styles.jc_ct,styles.mb_15,on&&styles.onCate_item]} 
                                        onPress={()=>this._onSelect(item)}
                                    >
                                        <View style={[styles.topTip]}>
                                            <ImageBackground source={on ? asset.rech_icon1 : asset.rech_icon3} style={[styles.rech_icon,styles.fd_r,styles.ai_ct,styles.jc_ct,]}>
                                                <Text style={[styles.smm_label,styles.white_label,styles.fw_label]}>+{item.rechargeIntegral}学分</Text>
                                            </ImageBackground>
                                        </View>

                                        <Text style={[styles.black_label,styles.lg_label,styles.mt_5,on&&styles.sred_label]}>{ok ? item.amount : item.iosAmount}元</Text>
                                        <Text style={[styles.sm_label,styles.tip_label,on&&styles.sred_label,styles.fw_label,styles.mt_5]}>{item.rechargeIntegral}学分</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>

                    <TouchableOpacity style={[styles.pay_btn,styles.mt_25]} onPress={this._onPay}>
                        <Text style={[styles.white_label]}>确认支付</Text>
                    </TouchableOpacity>
                    
                    <View style={[styles.fd_c,styles.mt_30]}>
                        <Text style={[styles.default_label,styles.tip_label,styles.mt_20,styles.lh18_label]}>1、学分可以用于直接购买APP内虚拟内容（不含实物产品、线下课）；</Text>
                        <Text style={[styles.default_label,styles.tip_label,styles.mt_20,styles.lh18_label]}>2、iOS系统和其他系统的余额只能在相应系统使用，不能互通使用；</Text>
                        <Text style={[styles.default_label,styles.tip_label,styles.mt_20,styles.lh18_label]}>3、学分为虚拟币，充值后的学分不会过期，但无法体现或转赠他人。</Text>
                    </View>

                    <View style={[styles.fd_r,styles.jc_ct,styles.ai_ct,styles.mt_100,styles.mb_60]}>
                        <Text style={[styles.default_label,styles.tip_label]}>遇到问题，请提交 </Text>
                        <TouchableOpacity style={[styles.text_bt]} onPress={()=>navigation.navigate('FdBack')}>
                            <Text style={[styles.default_label,styles.tip_label]}>意见反馈</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    cate_item:{
        width:(theme.window.width - 48) / 3,
        height:88,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#DBDBDB',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:6,
        position:'relative'
    },
    topTip:{
        position:'absolute',
        top:0,
        right:-1,
        height:18,
    },
    onCate_item:{
        width:(theme.window.width - 54) / 3,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F',
    },
    pay_btn:{
        backgroundColor:'#F4623F',
        borderRadius:5,
        height:44,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    text_bt:{
        borderBottomWidth:1,
        borderBottomColor:'#999999',
        borderStyle:'solid'
    },
    rech_icon:{
        width:86,
        height:17,
    },
    rech_onicon:{
        backgroundColor:'#F4623F'
    }
})


export const LayoutComponent = Recharge;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        charge:state.charge.charge,
	};
}

