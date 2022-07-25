import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity, Image,ScrollView,AppState} from 'react-native';

import * as WeChat from 'react-native-wechat-lib';
import Alipay from '@uiw/react-native-alipay';

Alipay.setAlipayScheme('alipay2021002103616468');


import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';


class CartSettlement extends Component {

    static navigationOptions = {
        title:'结算',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = this.props;

        this.cartIds = navigation.getParam('cartIds',0); //  选中的 goodsId
        this.totalAmount = navigation.getParam('totalAmount',0); // 总金额
        this.disAmount = navigation.getParam('disAmount',0); // 优惠金额
        this.allAmount = navigation.getParam('allAmount',0); // 总价
        this.mock_cartIds = navigation.getParam('mock_cartIds',{}); // 总价
        this.shipping = navigation.getParam('shipping',{}); // 总价

        this.order_act = navigation.getParam('order_act')
    
        this.mailCart = [];

        this.activitys = [] ; // 活动、物流


        this.state = {

            address:{},
            integral:0,
            selectIntegral:false,
            gtype:0,
            payId:0,
            mailCart:[],

            freightAmount:0, // 运费价格
            totalNumber:0, // 总共件数

            finalPrice:0, // 最终价格

            order_obj:{},


        }



        this._onAddress = this._onAddress.bind(this);
        this._SelectPay = this._SelectPay.bind(this);
        this._onPay = this._onPay.bind(this);
        this._freight = this._freight.bind(this);
        this._aliPay = this._aliPay.bind(this);
        this._act_list = this._act_list.bind(this);

    }


    componentDidMount(){

        const {navigation,actions} = this.props;

        actions.mall.mailCart();
        actions.mall.setShop();
        actions.address.address();

    }

    componentWillReceiveProps(nextProps){

        const {address,user,mailCart,setShop,shipAmount} = nextProps;

        if(mailCart !== this.props.mailCart){
            
            let cart_arr = [];

            if(mailCart.length > 0 ){

                for(let i = 0 ; i < mailCart.length ; i++){

                    if(this.cartIds.indexOf(mailCart[i].cartId + '') > -1){
                        cart_arr.push(mailCart[i]);
                    }
                }

                this.mailCart = cart_arr;

                this.setState({
                    mailCart:cart_arr
                },()=>{
                    this._freight();
                    this._act_list();
                })
            }

        }

        if( setShop !== this.props.setShop){
            this.activitys = setShop.activity;
        }


        if(address !== this.props.address){

            address.map((addr,index)=>{

                if(addr.isFirst === 1){
                     
                    this.setState({
                        address:addr
                    },()=>{
                        this._freight();
                    })

                }

            })
        }

        if(shipAmount !== this.props.shipAmount){
            this.setState({
                freightAmount:shipAmount
            })
        }
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleOpenURL)
    }

    // 支付回调 支付宝
    _handleOpenURL(){
        const {navigation } = this.props;

        navigation.navigate('Order');
    }

    // 地址的选择
    _onAddress(address){
        this.setState({
			address: address
		},()=>{
            this._freight();
        })

    }

    // 选择支付方式
    _SelectPay(type){
        
        this.setState({
            payId:type
        })
    }

    // 计算运费
    _freight(){
        const {actions} = this.props;
        const {address,cartIds,mailCart} = this.state;

        let goodsIds =  Object.keys(this.mock_cartIds); // 包含的cartids 
        let allWeight = 0 ;

        if(Object.keys(address).length > 0){

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



            for(let i = 0 ; i < mailCart.length ; i++ ){
                if(!mailCart[i].freeShip){

                    if(goodsIds.indexOf(mailCart[i].cartId + '') > -1){
                        allWeight += mailCart[i].goodsWeight * mailCart[i].goodsNumber;
                    }

                }
            }

            actions.mall.shipAmount(province,city,allWeight);
        }

    }

    //  订单支付
    _onPay(){
        const {actions,navigation} = this.props;
        const {payId,goodsAttrIds,goods_id,address,totalNumber} = this.state;

        let vaild = true;
        let msg = '';

        if(Object.keys(address).length === 0 ){
            vaild = false;
            msg = '请选择地址';
        } else if(payId === 0){
            vaild = false;
            msg = '请选择支付方式';
        }

        if(vaild){
            actions.mall.goodSubmit({
                buy_type: 1,
                cart_ids:Object.keys(this.mock_cartIds).join(","),
                pay_type: payId,
                goods_id:'',
                goods_number:totalNumber,
                attr_ids:'',
                coupon_id:0,
                address_id:address.addressId,
                remark:'',
                resolved: (data) => {
                    
                    if(data.pay_type === 2) {
                        
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
        } else {
            this.refs.hud.show(msg, 2);
        }

    
    }


    // 阿里支付
    _aliPay(payInfo){
        Alipay.alipay(payInfo, (resule) => {
            console.log('resule-->>>', resule)
        });
    }


    _act_list(){

        let order_arr = Object.entries(this.order_act);

        for(let i = 0 ; i < order_arr.length ; i++){
            if(order_arr[i][1] === 0){
                order_arr.splice(i,1)
            }
        }

        let order_obj =  Object.fromEntries(order_arr);

        this.setState({
            order_obj:order_obj
        })

    }



    render() {

        const {navigation} = this.props;
        const {address,payId,freightAmount,finalPrice,order_obj} = this.state;

        let pay_prices = 0;

        if(freightAmount === '暂无该地区运费配置' || freightAmount===0){
            pay_prices = this.totalAmount
        } else {
            pay_prices = this.totalAmount + freightAmount;
        }


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
                        {
                            this.mailCart.map((cart,index)=>{
                                return(
                                    <View style={[styles.good,styles.fd_r]} key={'cart' + index}>
                                        <View style={[styles.goodsCover,styles.mr_5]}>
                                            <Image source={{uri:cart.goodsImg}} style={[styles.goodsImg]} />
                                        </View>
                                        <View style={[styles.fd_c,styles.jc_sb ,styles.col_1]}>
                                            <View style={[styles.fd_c,]}>
                                                <Text style={[styles.c33_label,styles.default_label,styles.fw_label]} numberOfLines={1}>{cart.goodsName}</Text>
                                                <Text style={[styles.sm_label,styles.tip_label,styles.mt_5]}>{cart.goodsAttr}{'  '}{cart.goodsWeight}kg</Text>
                                            </View>
                                            <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct]}>
                                                <Text style={[styles.sred_label,styles.default_label]}>¥{cart.goodsAmount}</Text>
                                                <Text style={[styles.c33_label,styles.default_label]}>X{cart.goodsNumber}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>

                    
                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pt_12,styles.pb_12,styles.pl_20,styles.pr_15,styles.bg_white,styles.mt_10,styles.mb_10]}>
                        <Text style={[styles.default_label,styles.gray_label]}>优惠券</Text>
                        <TouchableOpacity style={[styles.fd_r]} onPress={()=>navigation.navigate('UserCoupon')}>
                            <Text style={[styles.default_label,styles.gray_label]}>￥0.00</Text>
                            <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pl_20,styles.pr_15,styles.bg_white,styles.mb_1,styles.pb_12,styles.pt_12]}>
                            <Text style={[styles.default_label,styles.c33_label]}>总价</Text>
                            <Text style={[styles.default_label,styles.c33_label,styles.fw_label]}>￥{this.allAmount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pl_20,styles.pr_15,styles.bg_white,styles.pt_10,styles.pb_10]}>
                            <Text style={[styles.default_label,styles.gray_label]}>运费</Text>
                            {
                                freightAmount === '暂无该地区运费配置' ? 
                                <Text style={[styles.default_label,styles.gray_label]}>{freightAmount}</Text>
                                :
                                <Text style={[styles.default_label,styles.gray_label]}>+¥{freightAmount}</Text>
                            }
                            
                        </View>
                        {
                            this.activitys.length > 0 && this.activitys.map((act,index)=>{
                                let on = Object.keys(order_obj).indexOf(act.activityId + '') > -1 ;
                                return(
                                    <View key={'act' + index}>
                                        {
                                            on ?
                                            <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pl_20,styles.pr_15,styles.bg_white,styles.pt_5,styles.pb_5]}>
                                                <Text style={[styles.default_label,styles.gray_label]}>{act.title}</Text>
                                                <Text style={[styles.default_label,styles.gray_label]}>-¥{order_obj[act.activityId]}</Text>
                                            </View>
                                        :null}
                                    </View>
                                )
                            })
                        }

                        <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pl_20,styles.pr_15,styles.bg_white,styles.mt_1,styles.pb_12,styles.pt_12]}>
                            <Text style={[styles.default_label,styles.c33_label]}>实付款</Text>
                            <Text style={[styles.default_label,styles.c33_label,styles.fw_label]}>￥{pay_prices.toFixed(2)}</Text>
                        </View>
                    </View>


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

export const LayoutComponent = CartSettlement;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        address:state.address.address,
        mailCart:state.mall.mailCart,
        setShop:state.mall.setShop,
        shipAmount:state.mall.shipAmount,
	};
}
