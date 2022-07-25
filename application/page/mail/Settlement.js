import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity, Image,ScrollView,AppState} from 'react-native';

import * as WeChat from 'react-native-wechat-lib';
import Alipay from '@uiw/react-native-alipay';

Alipay.setAlipayScheme('alipay2021002103616468');


import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';




class Settlement extends Component {

    static navigationOptions = {
        title:'结算',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = this.props;

        this.goodsName = navigation.getParam('goodsName','');
        this.goods_id = navigation.getParam('goods_id',0);
        this.goodsIntegral = navigation.getParam('goodsIntegral',0);
        this.goodsImg = navigation.getParam('goodsImg','');
        this.goods_number = navigation.getParam('goods_number',0);
        this.goodsAttr_str = navigation.getParam('goodsAttr_str','');
        this.goodsAttrIds = navigation.getParam('goodsAttrIds',{});
        this.gtype = navigation.getParam('gtype');
        this.goodsActivityDTO = navigation.getParam('goodsActivityDTO',{});
        this.activityId = navigation.getParam('activityId',0);

        this.goods = navigation.getParam('goods',{}); 

        this.activitys = []; // 活动、物流 

        this.state = {
            address:{},
            integral:0,
            selectIntegral:false,

            goods_number:this.goods_number,
            goodsAttrIds:this.goodsAttrIds,
            goodsAttr_str:this.goodsAttr_str,
            goodsIntegral:this.goodsIntegral,
            goodsName:this.goodsName,
            goodsImg:this.goodsImg,
            goods_id:this.goods_id,

            gtype:this.goods.gtype,

            payId:0,

            freightAmount:0, // 运费价格
            totalNumber:0, // 总共件数
            discount:0, // 优惠价格
            finalPrice:0, // 最终价格,
        }

        this._onAddress = this._onAddress.bind(this);
        this._selectIntegral = this._selectIntegral.bind(this);
        this._onPay = this._onPay.bind(this);
        this._SelectPay = this._SelectPay.bind(this);
        this._Pay = this._Pay.bind(this);
        this._aliPay = this._aliPay.bind(this);
        this._handleOpenURL = this._handleOpenURL.bind(this);

        this._freight = this._freight.bind(this);
        this._freactivtity = this._freactivtity.bind(this);

    }

    componentDidMount(){
        const {actions,navigation} = this.props;
        actions.address.address();
        actions.user.user();
        actions.mall.setShop();

 
        this._freactivtity();

        this.focuSub = navigation.addListener('didFocus',(route) => {
        })

        AppState.addEventListener('change', this._handleOpenURL);

    }

    componentWillReceiveProps(nextProps){

        const {address,user,setShop,shipAmount} = nextProps;

        if(address !== this.props.address){

            address.map((addr,index)=>{

                if(addr.isFirst === 1){
                     
                    this.setState({
                        address:addr
                    })

                }

            })
        }

        if(user !== this.props.user){

            this.setState({
                integral:user.integral
            })
        }

        if( setShop !== this.props.setShop){
            this.activitys = setShop.activity;

            this._freight();
        }

        if(shipAmount !== this.props.shipAmount){

            this.setState({
                freightAmount:shipAmount
            })
        }
    }

    componentWillUnmount(){

        AppState.removeEventListener('change', this._handleOpenURL);
        this.focuSub && this.focuSub.remove();

    }


    //  监听 
    _handleOpenURL(){
        const {navigation } = this.props;

        navigation.navigate('Order')
    }


    _onAddress(address){

        this.setState({
			address: address
		},()=>{
            this._freight();
        })

    }

    _selectIntegral(){

        const {selectIntegral} = this.state;

        this.setState({
            selectIntegral:!selectIntegral
        })

    }

    _SelectPay(type){
        
        this.setState({
            payId:type
        })
    }

    // 计算运费
    _freight(){

        const {actions} = this.props;
        const {address,mailCart} = this.state;

        // this.goods.isFree === 1 ? '包邮' : '不包邮'

        if(Object.keys(address).length > 0 && this.goods.isFree !== 1){

            let province = '';
            let city = '';

            if(address.province.indexOf('广西') > -1){
                province = '广西';
            } else if(address.province.indexOf('内蒙古') > -1){
                province = '内蒙古';
            } else if(address.province.indexOf('广西') > -1){
                province = '广西';
            } else if(address.province.indexOf('西藏') > -1){
                province = '西藏';
            } else if(address.province.indexOf('宁夏') > -1){
                province = '宁夏';
            } else if(address.province.indexOf('新疆') > -1){
                province = '新疆';
            } else {
                province = address.province.substr(0,address.province.length - 1);
            }

            if(address.city.indexOf('上海') > -1 || address.city.indexOf('北京') > -1 || address.city.indexOf('天津') > -1 || address.city.indexOf('重庆') > -1){
                city = address.city;
            } else if(address.city.indexOf('市') > -1){
                city = address.city.substr(0,address.city.length - 1);
            } else if(address.city.indexOf('地区') > -1){
                city = address.city.substr(0,address.city.length - 2);
            } else if(address.city.indexOf('盟') > -1){
                city = address.city.substr(0,address.city.length - 1);
            } else if(address.province.indexOf('海南') > -1){
                if(address.district.indexOf('黎族苗族') > -1){
                    city = address.district.substr(0,address.district.length - 7);
                } else {
                    city = address.district.substr(0,address.district.length - 1);
                }
            } else if(address.province.indexOf('新疆') > -1){

                if(address.city.indexOf('回族自治州') > -1){
                    city = address.city.substr(0,address.city.length - 5);
                } else if(address.city.indexOf('蒙古自治州') > -1){
                    city = address.city.substr(0,address.city.length - 5);
                } else if(address.city.indexOf('哈萨克自治州') > -1){
                    city = address.city.substr(0,address.city.length - 6);
                } else if(address.city.indexOf('哈萨克自治州') > -1){
                    city = address.city.substr(0,address.city.length - 6);
                } else if(address.city.indexOf('自治区直辖县级行政区') > -1){
                    city = address.district.substr(0,address.district.length - 1);
                } else if(address.city.indexOf('克孜勒苏柯尔克孜') > -1){
                    city = '克孜勒苏柯尔克孜';
                }

            }

            let allWeight = this.goods.goodsWeight * this.goods_number;

            actions.mall.shipAmount(province,city,allWeight);
        }
    }


    _freactivtity(){
        //  way 1 "折扣活动"  0 满减活动 ,

        let total_price = (this.goods_number * this.goods.goodsAmount).toFixed(2);
        // if(this.activityId !== 0){

            if(this.goodsActivityDTO.way === 1){

                if(parseInt(this.goodsActivityDTO.condFir) <= parseInt(this.goods_number)){

                    let dis_amount =  (this.goods_number * this.goods.goodsAmount * (this.goodsActivityDTO.condSec * 1)).toFixed(2);
                    let dis_amount_m = (this.goods_number * this.goods.goodsAmount * (1 -  this.goodsActivityDTO.condSec * 1)).toFixed(2);
                    if(this.goods.goodsAmountDTO.goodsAmount){
                        dis_amount =  (this.goods_number * this.goods.goodsAmountDTO.goodsAmount * (this.goodsActivityDTO.condSec * 1)).toFixed(2);
                        dis_amount_m = (this.goods_number * this.goods.goodsAmountDTO.goodsAmount * (1 -  this.goodsActivityDTO.condSec * 1)).toFixed(2);
                    }
                    this.setState({
                        discount:dis_amount_m,
                        finalPrice:dis_amount,
                    })
                }   

            } else {
                if(total_price * 1 >=  this.goodsActivityDTO.condFir * 1){

                    let price = (total_price*1 - this.goodsActivityDTO.condSec * 1).toFixed(2);
                    this.setState({
                        discount:this.goodsActivityDTO.condSec * 1,
                        finalPrice:price,
                    })

                }else{
                    that.setState({
                        finalPrice: total_price * 1
                    })
                }
            }

        // }
    }


    _onPay(){
        const {payId,goods_number,integral,goodsIntegral,address} = this.state;

        if(Object.keys(address).length > 0 ){
            if(payId > 0 ){
                if(payId === 3){
                    if(goodsIntegral * goods_number > integral ){
                        this.refs.hud.show('学分不足', 2);
                    } else {
                        this._Pay();
                    }
                } else {
                    this._Pay();
                }
            } else {
                this.refs.hud.show('请选择支付方式', 2);
            }
        } else {
            this.refs.hud.show('请选择收货地址', 2);
        }
    }

    // 支付
    _Pay(){

        const {actions,navigation} = this.props;
        const {payId,goodsAttrIds,goods_number,goods_id,address} = this.state;

        let attrids = Object.values(JSON.parse(goodsAttrIds)).join(","); 

        actions.mall.goodSubmit({
            buy_type: 0,
            pay_type: payId,
            goods_id:goods_id,
            goods_number:goods_number,
            attr_ids:attrids,
            coupon_id:0,
            address_id:address.addressId,
            remark:'',
            resolved: (data) => {
                
                if(data.pay_type === 3){
                    this.refs.hud.show('购买成功', 2);
                    navigation.navigate('Order');
                } else if(data.pay_type === 2) {
                    
                    const param = {
						appId: data.pay_info.appid,
						partnerId: data.pay_info.partnerid,
						prepayId: data.pay_info.prepayid,
						package: data.pay_info.package,
						nonceStr: data.pay_info.noncestr,
						timeStamp: data.pay_info.timestamp,
						sign: data.pay_info.sign
					}
            
                    WeChat.pay(param).then(() => {
            
                        this.refs.hud.show('购买成功', 1);
                        navigation.navigate('Order');
                        
                    }).catch(() => {
            
                        this.refs.hud.show('购买失败', 1);

                        setTimeout(()=>{navigation.navigate('Order')},1000)
                    });

                } else if(data.pay_type === 1){
                    this._aliPay(data.pay_info);
                    // this.getVersion();
                }

            },
            rejected: () => {
            }
        })
    }


    _aliPay(payInfo){
        Alipay.alipay(payInfo, (resule) => {
            console.log('resule-->>>', resule)
          });
    }


    render() {
        const {navigation} = this.props;
        const {address,integral,selectIntegral,payId,discount,finalPrice,freightAmount} = this.state
        return (
            <View style={styles.container}>
                <ScrollView style={[styles.col_1]}>

                    <View style={[styles.addres,styles.mt_10]}>
                        <Image source={asset.mail.ads_head} style={[styles.ads_side]} />
                        <TouchableOpacity style={[styles.order_ads,styles.fd_r,styles.ai_ct,styles.p_20]}
                            onPress={()=> navigation.navigate('Address' ,{address:address,callback:this._onAddress}) }
                        >
                            <Image source={asset.mail.location}   style={[styles.location]}/>
                            {
                                Object.keys(address).length > 0 ?
                                <View style={[styles.fd_c,styles.ml_15]}>
                                    <Text style={[styles.c33_label,styles.default_label,styles.fw_label]}>{address.realname} {' '}{address.mobile}</Text>
                                    <Text style={[styles.gray_label,styles.default_label,styles.mt_5]}>{address.province} {address.city} {address.district} {address.address}</Text>
                                </View>
                                :
                                <View style={[styles.fd_c,styles.ai_ct,styles.ml_15]}>
                                    <Text style={[styles.gray_label,styles.default_label]}>请选择地址</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        <Image source={asset.mail.ads_head} style={[styles.ads_side]} />
                    </View>

                    <View style={[styles.goods,styles.mt_10]}>
                        <View style={[styles.good,styles.fd_r]}>
                            <View style={[styles.goodsCover,styles.mr_5]}>
                                <Image source={{uri:this.goodsImg}} style={[styles.goodsImg]} />
                            </View>
                            <View style={[styles.fd_c,styles.jc_sb ,styles.col_1]}>
                                <View style={[styles.fd_c,]}>
                                    <Text style={[styles.c33_label,styles.default_label,styles.fw_label]} numberOfLines={1}>{this.goodsName}</Text>
                                    <Text style={[styles.sm_label,styles.tip_label,styles.mt_5]}>{this.goodsAttr_str}</Text>
                                </View>
                                <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct]}>
                                    {
                                        this.goods.gtype === 2 ? 
                                        <Text style={[styles.sred_label,styles.default_label]}>¥{this.goods.goodsAmountDTO.goodsAmount?this.goods.goodsAmountDTO.goodsAmount:this.goods.goodsAmount}</Text>
                                    :null}
                                    {
                                        this.goods.gtype === 3 ? 
                                        <Text style={[styles.sred_label,styles.default_label]}>{this.goodsIntegral}学分</Text>
                                    :null}
                                    
                                    <Text style={[styles.c33_label,styles.default_label]}>X{this.goods_number}</Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>

                    <View style={[styles.mt_10]}>
                        <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_12,styles.pb_12,styles.pl_20,styles.pr_20]}>
                            <Text style={[styles.c33_label,styles.default_label]}>总价</Text>
                            {
                                this.goods.gtype === 2 ?  
                                <Text style={[styles.c33_label,styles.lg_label,styles.fw_label]}>¥{this.goods.goodsAmountDTO.goodsAmount?this.goods.goodsAmountDTO.goodsAmount * this.goods_number:this.goods.goodsAmount * this.goods_number}</Text>
                            :null}
                            {
                                this.goods.gtype === 3 ?  
                                <Text style={[styles.c33_label,styles.lg_label,styles.fw_label]}>{this.goodsIntegral * this.goods_number}学分</Text>
                            :null}
                        </View>
                        {
                            this.goods.gtype === 2 ? 
                            <View style={[styles.fd_c]}>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pl_20,styles.pr_15,styles.bg_white,styles.pt_10]}>
                                    <Text style={[styles.default_label,styles.gray_label]}>运费</Text>
                                    <Text style={[styles.default_label,styles.gray_label]}>+¥{freightAmount}</Text>
                                </View>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pl_20,styles.pr_15,styles.bg_white,styles.pt_5,styles.pb_5]}>
                                    <Text style={[styles.default_label,styles.gray_label]}>{this.goodsActivityDTO.title}</Text>
                                    <Text style={[styles.default_label,styles.gray_label]}>-¥{discount}</Text>
                                </View>
                            </View>
                        :null}
                        <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_12,styles.pb_12,styles.pl_20,styles.pr_20]}>
                            <Text style={[styles.c33_label,styles.default_label]}>实付款</Text>
                            {
                                this.goods.gtype === 2 ?  
                                <Text style={[styles.c33_label,styles.lg_label,styles.fw_label]}>¥{finalPrice * 1 + freightAmount * 1}</Text>
                            :null}
                            {
                                this.goods.gtype === 3 ?  
                                <Text style={[styles.c33_label,styles.lg_label,styles.fw_label]}>{this.goodsIntegral * this.goods_number}学分</Text>
                            :null}
                        </View>
                    </View>
                    
                    {
                        this.goods.gtype === 3?
                        <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.mb_1,styles.jc_sb,styles.bg_white,styles.pt_12,styles.pb_12,styles.pl_20,styles.pr_20,styles.mt_10]} 
                            onPress={()=>this._SelectPay(3)}
                        >
                            <Text style={[styles.c33_label,styles.default_label]}>可用学分 {integral}</Text>
                            <Image source={payId === 3 ? asset.radio_full : asset.radio} style={[styles.icon_cover]} />
                        </TouchableOpacity>
                    :null}
                    
                    

                    
                    {
                        this.goods.gtype === 2||this.goods.gtype === 4 ?
                        <View>
                            <View style={[styles.mt_10,styles.pt_12,styles.pb_12,styles.bg_white,styles.pl_20,styles.mb_1]}> 
                                <Text style={[styles.lg_label,styles.c33_label]}>支付方式</Text>
                            </View>
                            <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20]}
                                onPress={()=>this._SelectPay(1)}
                            >
                                <View style={[styles.fd_r,styles.ai_ct]}>
                                    <Image source={asset.pay.ali_pay} style={[styles.pay_icon,styles.mr_10]} />
                                    <Text style={[styles.gray_label,styles.default_label]}>支付宝</Text>
                                </View>
                                <Image source={ payId === 1 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_20,styles.pb_20,styles.pl_25,styles.pr_20]}
                                onPress={()=>this._SelectPay(2)}
                            >
                                <View style={[styles.fd_r,styles.ai_ct]}>
                                    <Image source={asset.pay.wechat_pay} style={[styles.pay_icon,styles.mr_10]} />
                                    <Text style={[styles.gray_label,styles.default_label]}>微信支付</Text>
                                </View>
                                <Image source={ payId === 2 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                            </TouchableOpacity>
                        </View>
                    :null}

                </ScrollView>
                <TouchableOpacity style={[styles.btn,styles.mt_30]} onPress={this._onPay}>
                    <Text style={[styles.white_label,styles.lg_label]}>确认支付</Text>
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
        backgroundColor:'#FAFAFA'
    },
    addres:{
        backgroundColor:'#ffffff',
    },
    ads_side:{
        width:'100%',
        height:4,
    },
    location:{
        width:12,
        height:16
    },
    good:{
        marginBottom:1,
        paddingTop:16,
        paddingBottom:16,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'#ffffff'
    },
    goodsCover:{
        width:65,
        height:65,
    },
    goodsImg:{
        width:65,
        height:65,
    },
    icon_cover:{
        width:18,
        height:18,
    },
    btn:{
        width:theme.window.width,
        height:54,
        backgroundColor:'#F4623F',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    pay_icon:{
        width:20,
        height:20,
    },
});

export const LayoutComponent = Settlement;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        address:state.address.address,
        setShop:state.mall.setShop,
        shipAmount:state.mall.shipAmount,
	};
}
