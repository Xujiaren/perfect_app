import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,ScrollView,TextInput} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import HudView from '../../component/HudView';

import asset from '../../config/asset';
import theme from '../../config/theme';

import _ from 'lodash';

function cart_restruct(arr){
    let obj = {}
    arr.map(v => {
      obj[v.activityId] = 0  
    })
    let cart = Object.keys(obj)

    let result = cart.map(v => {
      return {
        data: arr.filter(_v => v == _v.activityId)
      }
    })
    return result;
}

function activity(id,arr){
    let result = {};
    
    for(let i = 0 ; i<arr.length;i++){
        if(arr[i].activityId === id){
            result = arr[i];
        }
    }

    return result;
}

// 多少个相同元素 满折
function activity_count(id,arr){
    let count = 0

    if(id !== undefined && id.length > 0 ){
        for(let i = 0 ; i < arr.length ; i++){

            if(id.indexOf((arr[i].cartId+'')) > -1){
                count += arr[i].goodsNumber;
            }
        }
    }
    
    return count ;
}

// 满减 计算出商品的总价
function activity_total(ids,arr){

    let total = 0;
    if(ids !== undefined && ids.length > 0 ){
        for(let i = 0 ; i < arr.length ; i++){

            if(ids.indexOf(arr[i].cartId+'') > -1){
                total += arr[i].goodsNumber * arr[i].goodsAmount ;
            }
        }
    }
   
    return total;
}



class Cart extends Component {

    static navigationOptions = ({navigation}) => {
        const cartType = navigation.getParam('cartType', false);
        
		return {
            title: '购物车',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.setParams({cartType:!cartType})} style={[styles.pr_15]}>
                    <Text style={[styles.default_label ,styles.c33_label,styles.fw_label]}>{cartType ? '取消' : '管理'}</Text>
                </TouchableOpacity>
            ),
		}
    };


    constructor(props){
        super(props);

        this.mailCart = [];
        this.mockCart = [];

        this.activitys = [] ; // 活动、物流
        this.shipping = {}


        this.state = {
            payId:0,
            cartType:false,
            status:0,
            tabbarIndex:2,

            delGoodIds:[], // 删除商品 goodids 集合
            cartIds:[], // 商品 cartid 集合
            goodIds:[], // 商品 goodid 集合
            totalAmount: 0, // 结算 总价
            allType:false, // 全选 
            delType:false,
            
            act_goodsId:{},// 活动满足， 商品id

            mock_cartIds :{},
            mock_goodIds:{},

            c_type:0, // 0 选择购物车 1 选择删除商品 

            meet_ids:[],

            order_act:{},


            tabbar_bottom:[{
                text:'首页',
                link:'Mail',
                icon:asset.mail.mail_icon,
                iconfull:asset.mail.mail_icon_full
            },{
                text:'分类',
                link:'MailCate',
                icon:asset.mail.cate_icon,
                iconfull:asset.mail.cate_icon_full
            }
            ,{
                text:'购物车',
                link:'Cart',
                icon:asset.mail.cart_icon,
                iconfull:asset.mail.cart_icon_full
            }
            ,{
                text:'订单',
                link:'Order',
                icon:asset.mail.order_icon,
                iconfull:asset.mail.order_icon_full
            }],
        }

        this._onSelect  = this._onSelect.bind(this);
        this._countAmount = this._countAmount.bind(this);
        this._checkAll = this._checkAll.bind(this);
        this._judge = this._judge.bind(this);
        this._updateCart = this._updateCart.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this._toSettlement = this._toSettlement.bind(this);

    }

    componentDidMount(){
        const {actions} = this.props;

        actions.mall.mailCart();
        actions.mall.setShop();

    }

    componentWillReceiveProps(nextProps){
        const { navigation,mailCart ,setShop} = nextProps;


        if(navigation !== this.props.navigation){

            const {params} = navigation.state;

            this.setState({
                cartType:params.cartType,
                c_type:params.cartType ? 1 : 0,
                delGoodIds:[],
            })

        }

        if(mailCart !== this.props.mailCart){
            
            if(mailCart.length > 0 ){

                this.mailCart = mailCart;
                this.mockCart = cart_restruct(mailCart);
            }else{
                this.mailCart = mailCart;
                this.mockCart = mailCart;
            }

            this._countAmount();
        }

        if( setShop !== this.props.setShop){

            this.activitys = setShop.activity;
            this.shipping = setShop.shipping;
        }
        // out of stock
        
    }

    componentWillUnmount(){

    }

    // 单个选择
    _onSelect(cart,type){
  
        const {goodIds,delGoodIds,mock_cartIds,mock_goodIds,c_type,cartIds} = this.state;


        let _mockgoodIds = mock_goodIds;
        let _mockcartIds = mock_cartIds;
        let _delGoodIds = delGoodIds;


        if( c_type === 0 ){

            if(Object.keys(_mockcartIds).indexOf(cart.cartId + '') === -1){

                _mockcartIds[parseInt(cart.cartId)] = cart.activityId;
    
    
                this.setState({
                    cartIds:Object.keys(_mockcartIds),
                    mock_cartIds:_mockcartIds
                },()=>{
                    this._judge();
                    this._countAmount();
    
                })
    
            } else {
                let _mock_goods = {};
                let _mock_carts = {};
                let ids = Object.keys(_mockcartIds);
    
                ids.splice(Object.keys(_mockcartIds).indexOf(cart.cartId + ''),1);
    
                _mock_carts = _.pick(_mockcartIds,ids);
    
                let mock_ids = Object.keys(_mock_carts);
    
                this.setState({
                    cartIds:mock_ids,
                    mock_cartIds:_mock_carts
                },()=>{
                    this._judge();
                    this._countAmount();
                })
                
            }

        } else {

            if(_delGoodIds.indexOf(cart.cartId) ==  -1){
                _delGoodIds.push(cart.cartId + '');
            } else {
                _delGoodIds.splice(_delGoodIds.indexOf(cart.cartId + ''),1);
            }

            
            this.setState({
                delGoodIds:_delGoodIds
            },()=>{
                this._judge();
            })

        }

        
            

    }

    // 判断
    _judge(){
        const {goodIds,c_type,delGoodIds,cartIds} = this.state;

        let judge = [];

        if(c_type === 0){

            for (var i = 0; i < this.mailCart.length; i++ ){
                judge.push(this.mailCart[i].cartId + '');

                if ((judge.sort().toString() === cartIds.sort().toString()) && cartIds.length > 0){
                    this.setState({
                        allType:true,
                    });
                } else {
                    this.setState({
                        allType:false,
                    });
                }
            }

        } else {

            for (var i = 0; i < this.mailCart.length; i++ ){
                judge.push(this.mailCart[i].cartId + '');
                if ((judge.sort().toString() === delGoodIds.sort().toString()) && delGoodIds.length > 0){
                    this.setState({
                        delType:true,
                    });
                } else {
                    this.setState({
                        delType:false,
                    });
                }
            }
        }

    }

    //全选
    _checkAll(){

        const {goodIds,c_type,delGoodIds,mock_goodIds,cartIds,mock_cartIds} = this.state;

        let allchoose = [];
        let _mock_cartIds = mock_cartIds;

        if(c_type === 0){

            for (var i = 0; i < this.mailCart.length; i++ ){

                allchoose.push(this.mailCart[i].cartId + '');

                _mock_cartIds[parseInt(this.mailCart[i].cartId ) +''] = this.mailCart[i].activityId;
    
                if ((allchoose.sort().toString() === cartIds.sort().toString()) && cartIds.length > 0){
    
                    this.setState({
                        allType:false,
                        mock_cartIds:[],
                        cartIds:[],
                        order_act:{},
                    },()=>{
                        this._countAmount();
                    });
                } else {
                    this.setState({
                        cartIds:allchoose,
                        allType:true,
                        mock_cartIds:_mock_cartIds,
                        
                    },()=>{
                        this._countAmount();
                    });
                }
            }

        } else {

            for (var i = 0; i < this.mailCart.length; i++ ){

                allchoose.push(this.mailCart[i].cartId + '');
                _mock_cartIds[parseInt(this.mailCart[i].goodsId)] = this.mailCart[i].activityId;
    
                if ((allchoose.sort().toString() === delGoodIds.sort().toString()) && delGoodIds.length > 0 ){
                    
                    this.setState({
                        delGoodIds:[],
                        delType:false,
                        mock_goodIds:{},
                    });
                } else {
                    this.setState({
                        delGoodIds:allchoose,
                        delType:true,
                        mock_goodIds:_mock_cartIds
                    });
                }
            }
        }
        

    }

    // 更新 数据
    _updateCart(cart,type,text){
        
        const {actions} = this.props;

        actions.mall.updateCart({
            cart_id:cart.cartId,
            goods_number:1,
            ctype:type,
            resolved: (data) => {
                actions.mall.mailCart();
            },
            rejected: (msg) => {
                let tip = ''
                if(msg === 'number only one'){
                    tip = '商品不能在减少了'
                } else if(msg === 'out of stock'){
                    tip = '库存不足'
                }
                this.refs.hud.show(tip, 2);
            }
        })

    }

    // 计算价格
    _countAmount(){

        const {goodIds,mock_goodIds,meet_ids,act_goodsId,cartIds,mock_cartIds,order_act} = this.state;

        let totalMoney = 0;
        let _order_act = order_act;
        let total_mz_discount = 0 ;


        for(let i = 0 ; i < this.mailCart.length ; i++){

            if(cartIds.indexOf(this.mailCart[i].cartId + '') > -1){
                
                if(this.mailCart[i].activityId == 0 ){ // 没有活动 计算
                    if( this.mailCart[i].goodsAmountDTO.goodsAmount){
                        totalMoney += this.mailCart[i].goodsAmountDTO.goodsAmount * this.mailCart[i].goodsNumber;
                    }else{
                        totalMoney += this.mailCart[i].goodsAmount * this.mailCart[i].goodsNumber;
                    }
                } else {  // 不同活动 计算

                    let act_ids = Object.values(mock_cartIds);

                    for(let j = 0  ; j <  this.activitys.length ; j++){

                        // 满折
                        let mz_g_ids = []; // 满折商品ids 
                        let mz_a_ids = []; // 满折活动ids
                        let mz_arr = []; // 满折 数组
                        // 满减
                        let mj_total = 0; // 满减
                        let mj_g_ids = [];
                        
                        
                        mz_arr = Object.entries(mock_cartIds);

                        for(let z = 0 ; z < mz_arr.length ; z++){
                            if(mz_arr[z][1] === this.activitys[j].activityId){
                                mz_g_ids.push(mz_arr[z][0]);
                                mj_g_ids.push(mz_arr[z][0]);
                            }
                        }


                        mj_total = activity_total(mj_g_ids,this.mailCart);
                        let act_count =  activity_count(mz_g_ids,this.mailCart);

                        if(this.activitys[j].way === 0 ){ // 满减 


                            act_goodsId[this.activitys[j].activityId] = mj_g_ids;


                            if(mj_total >= this.activitys[j].condFir){
                                // 满减 满足条件        
                                
                                let  per_count =  ( (this.activitys[j].condSec * 1) / mj_g_ids.length).toFixed(2); //  每件 减 少的钱数

                                if(mj_g_ids.indexOf(this.mailCart[i].cartId + '') > -1){
                                    if( this.mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += this.mailCart[i].goodsAmountDTO.goodsAmount * this.mailCart[i].goodsNumber - per_count;
                                    }else{
                                        totalMoney += this.mailCart[i].goodsAmount * this.mailCart[i].goodsNumber - per_count;
                                    }
                                }

                                _order_act[this.activitys[j].activityId] = this.activitys[j].condSec * 1;


                            } else {

                                if(mj_g_ids.indexOf(this.mailCart[i].cartId + '') > -1){
                                    if(mj_g_ids.indexOf(this.mailCart[i].cartId + '') > -1){
                                        if( this.mailCart[i].goodsAmountDTO.goodsAmount){
                                            totalMoney += this.mailCart[i].goodsAmountDTO.goodsAmount * this.mailCart[i].goodsNumber;
                                        }else{
                                            totalMoney += this.mailCart[i].goodsAmount * this.mailCart[i].goodsNumber;
                                        }
                                    }
                                }

                                _order_act[this.activitys[j].activityId] = 0;
                            }

                        }  else if(this.activitys[j].way === 1){ // 满折


                            act_goodsId[this.activitys[j].activityId] = mz_g_ids;


                            if(this.activitys[j].condFir * 1 > act_count ){  // 不满足满折活动 ， 按正常价格 计算 
                                
                                if(mz_g_ids.indexOf(this.mailCart[i].cartId + '') > -1){
                                    if( this.mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += this.mailCart[i].goodsAmountDTO.goodsAmount * this.mailCart[i].goodsNumber;
                                    }else{
                                        totalMoney += this.mailCart[i].goodsAmount * this.mailCart[i].goodsNumber;
                                    }
                                }


                                _order_act[this.activitys[j].activityId] = 0;

                            } else { // 满足满折活动  
                                
                                if(mz_g_ids.indexOf(this.mailCart[i].cartId + '') > -1){
                                    if( this.mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += this.mailCart[i].goodsAmountDTO.goodsAmount * this.mailCart[i].goodsNumber * (this.activitys[j].condSec * 1);
                                        total_mz_discount += this.mailCart[i].goodsAmountDTO.goodsAmount * this.mailCart[i].goodsNumber * (1 - this.activitys[j].condSec * 1)
                                    }else{
                                        totalMoney += this.mailCart[i].goodsAmount * this.mailCart[i].goodsNumber * (this.activitys[j].condSec * 1);
                                        total_mz_discount += this.mailCart[i].goodsAmount * this.mailCart[i].goodsNumber * (1 - this.activitys[j].condSec * 1)
                                    }
                                }

                                _order_act[this.activitys[j].activityId] = total_mz_discount.toFixed(2);
                            }

                        }

                    }


                }
            }
        }

        this.setState({
            totalAmount:totalMoney,
            act_goodsId:act_goodsId
        })

    }


    // 删除
    _onDelete(){

        const {actions,navigation} = this.props;
        const {delGoodIds} = this.state;

        let cartId_str = delGoodIds.join(',')

        actions.mall.removeCart({
            cartIds:cartId_str,
            resolved: (data) => {
                actions.mall.mailCart();
                navigation.setParams({'cartType': false});
                that.setState({
                    mock_cartIds: []
                })
            },
            rejected: (msg) => {
            }
        })

    }


    

    // 去结算
    _toSettlement(){
        const {navigation} = this.props;
        const {cartIds,totalAmount,mock_cartIds,order_act} = this.state;



        if(cartIds.length > 0 ){

            let all_total =  activity_total(cartIds,this.mailCart);

            navigation.navigate('CartSettlement',{cartIds:cartIds,totalAmount:totalAmount,disAmount:(all_total - totalAmount).toFixed(2),allAmount:all_total,mock_cartIds:mock_cartIds,shipping:this.shipping,order_act:order_act})

        } else {
            this.refs.hud.show('你还没有选择商品哦', 2);
        }
    }


    render() {

        const {navigation} = this.props;
        const {tabbar_bottom,tabbarIndex,cartType,allType,totalAmount,c_type,delType,delGoodIds,act_goodsId,cartIds,order_act} = this.state;

        // let all_count = 0 ; // 总共多少件

        let all_total =  activity_total(cartIds,this.mailCart);
        let all_count =  activity_count(cartIds,this.mailCart);

        return (
            <View style={styles.container}>
                <ScrollView style={[styles.col_1]}>

                    {
                        this.mockCart.length > 0 ?
                        <View>
                            {
                                this.mockCart.map((m_cart,index)=>{

                                    let m_activity = {} ; //  活动详情
                                    let per_money = 0 ; // 每件优惠价格
                                    let per_goods = []; // 优惠的商品 id
                                    let per_isMeet = false; // 是否优惠
                                    
                                    let cart_total = 0; // 总价
                                    let cart_count = 0; // 总件数

                                    m_activity = activity(m_cart.data[0].activityId,this.activitys);

                                    if(m_cart.data[0].activityId !== 0){
                                        per_goods = act_goodsId[m_cart.data[0].activityId + ''] || [];

                                        cart_count =  activity_count(per_goods,this.mailCart);
                                        cart_total = activity_total(per_goods,this.mailCart);

                                        if(m_activity.way === 0){
                                    
                                            if(cart_total >= m_activity.condFir){
                                                per_money = m_activity.condSec / cart_count ;
                                                per_isMeet = true;
                                            }

                                        } else if(m_activity.way === 1){


                                            if(cart_count >= m_activity.condFir){
                                                per_isMeet = true;
                                            }

                                        }

                                    }

                                    

                                    return(

                                        <View style={[styles.cartBox,styles.bg_white,styles.ml_15,styles.mr_15,styles.mt_15,styles.pl_12,styles.pr_12,styles.pt_12,{width:theme.window.width - 30}]} key={'m_cart' + index}>
                                            {
                                                m_cart.data[0].activityId !== 0 ?
                                                <View style={[styles.fd_r,styles.ai_ct,styles.c_head]}>
                                                    <LinearGradient colors={['#EC008C', '#FC8068']} style={[styles.popu_tips]} >
                                                        <Text style={[styles.smm_label ,styles.white_label,styles.fw_label]}>{m_activity.title}</Text>
                                                    </LinearGradient>
                                                    {
                                                        m_activity.way === 0 ?
                                                        <Text style={[styles.smm_label,styles.sred_label]}>购物满{m_activity.condFir}-{m_activity.condSec}</Text>
                                                        :
                                                        <Text style={[styles.smm_label,styles.sred_label]}>购物满{m_activity.condFir}件{m_activity.condSec * 10}折</Text>
                                                    }
                                                </View>
                                            :null}
                                            
                                            {
                                                m_cart.data.map((d_cart,idx)=>{

                                                    let on = cartIds.indexOf(d_cart.cartId + '') > -1;
                                                    let ok = delGoodIds.indexOf(d_cart.cartId + '') > -1;

                                                    let _ok = per_goods.indexOf(d_cart.cartId + '') > -1;

                                                    return( 
                                                        <View style={[styles.pt_20,styles.pb_20,styles.fd_r]} key={'d_cart' + idx }>
                                                            <TouchableOpacity style={[styles.radio_box ,styles.jc_ct ,styles.ai_ct ]} onPress={()=>this._onSelect(d_cart,c_type)}>
                                                                {
                                                                    c_type === 0 ?
                                                                    <Image source={on ? asset.radio_full : asset.radio_cart} style={[styles.radio_icon]} />
                                                                    :
                                                                    <Image source={ok ? asset.radio_full : asset.radio_cart} style={[styles.radio_icon]} />
                                                                }
                                                            </TouchableOpacity>
                                                            <View style={[styles.fd_r,styles.col_1]}>
                                                                <View style={[styles.mr_10]}>
                                                                    <Image source={{uri:d_cart.goodsImg}} style={[styles.img_cover]}/>
                                                                </View>
                                                                <View style={[styles.fd_c,styles.jc_sb,styles.col_1]}>
                                                                    <View style={[styles.fd_r,styles.ai_ct]}>
                                                                        {
                                                                            d_cart.activityId !== 0 ?
                                                                            <View style={[styles.tips]}>
                                                                                {
                                                                                    m_activity.way === 0 ?
                                                                                    <Text style={[styles.smm_label,styles.sred_label]}>满{m_activity.condFir}-{m_activity.condSec}</Text>
                                                                                    :
                                                                                    <Text style={[styles.smm_label,styles.sred_label]}>满{m_activity.condFir}件{m_activity.condSec * 10}折</Text>
                                                                                }
                                                                            </View>
                                                                        :null}
                                                                        
                                                                        <View style={[styles.col_1]}>
                                                                            <Text style={[styles.c33_label,styles.default_label,styles.ml_5]} numberOfLines={1}>{d_cart.goodsName}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <Text style={[styles.sm_label,styles.tip_label]}>{d_cart.goodsAttr}</Text>
                                                                    <View style={[styles.fd_r,styles.jc_sb]}>
                                                                        <View style={[styles.fd_r,styles.ai_ct,]}>
                                                                            <Text style={[styles.sred_label,styles.default_label]}>￥{d_cart.goodsAmountDTO.goodsAmount?d_cart.goodsAmountDTO.goodsAmount:d_cart.goodsAmount}</Text>
                                                                            {
                                                                                d_cart.activityId !== 0  && _ok  && per_isMeet  ?
                                                                                <View style={[styles.dis_box,styles.ml_10]}>
                                                                                    {
                                                                                        m_activity.way === 0 ? 
                                                                                        <Text style={[styles.sred_label,styles.smm_label]}>优惠价¥{(d_cart.goodsAmount - per_money).toFixed(2)}</Text>
                                                                                        :
                                                                                        <Text style={[styles.sred_label,styles.smm_label]}>优惠价¥{(d_cart.goodsAmount * m_activity.condSec).toFixed(2)}</Text>
                                                                                    }
                                                                                </View>
                                                                            :null}
                                                                        </View>
    
                                                                        <View style={[styles.fd_r]}>
                                                                            <TouchableOpacity onPress={()=>this._updateCart(d_cart,1,0)}>
                                                                                <Image source={asset.mail.minus} style={[styles.action_icon]} />
                                                                            </TouchableOpacity>
                                                                            <View style={[styles.count]}>
                                                                                <TextInput 
                                                                                    style={[styles.count_count]}
                                                                                    type='number'
                                                                                    clearButtonMode={'never'}
                                                                                    underlineColorAndroid={'transparent'}
                                                                                    autoCorrect={false}
                                                                                    autoCapitalize={'none'}
                                                                                    value={d_cart.goodsNumber + ''}
                                                                                    keyboardType={'phone-pad'}
                                                                                    editable={false}
                                                                                />
                                                                            </View>
                                                                            <TouchableOpacity onPress={()=>this._updateCart(d_cart,0,0)}>
                                                                                <Image source={asset.mail.add} style={[styles.action_icon]} />
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }

                                            {
                                                m_cart.data[0].activityId !== 0 ?
                                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_fe,styles.pb_20,styles.pt_15,styles.count_box]}>
                                                    {
                                                        m_activity.way === 0 ?
                                                        <Text style={[styles.default_label,styles.c33_label]}>购物满{m_activity.condFir}-{m_activity.condSec},</Text>
                                                        :
                                                        <Text style={[styles.default_label,styles.c33_label]}>购物满{m_activity.condFir}件{m_activity.condSec * 10}折,</Text>
                                                    }

                                                    {
                                                        per_isMeet ? 
                                                        <View>
                                                            {
                                                                m_activity.way === 0 ?
                                                                <Text style={[styles.default_label,styles.c33_label]}>已优惠¥{(m_activity.condSec * 1).toFixed(2)}</Text>
                                                            :null}
                                                            {
                                                                m_activity.way === 1 ?
                                                                <Text style={[styles.default_label,styles.c33_label]}>已优惠¥{ (cart_total -  cart_total  * m_activity.condSec).toFixed(2)}</Text>
                                                            :null}
                                                        </View>
                                                        :
                                                        <View>
                                                            <Text style={[styles.default_label,styles.c33_label]}>已优惠¥0</Text>
                                                        </View>
                                                    }
                                                

                                                    {
                                                        per_isMeet ? 
                                                        <View>
                                                            {
                                                                m_activity.way === 0 ?
                                                                <Text style={[styles.default_label,styles.c33_label,styles.pl_20]}>小计¥{(cart_total - m_activity.condSec).toFixed(2)}</Text>
                                                            :null}
                                                            {
                                                                m_activity.way === 1 ?
                                                                <Text style={[styles.default_label,styles.c33_label,styles.pl_20]}>小计¥{(cart_total * m_activity.condSec).toFixed(2)}</Text>
                                                            :null}
                                                        </View>
                                                        :
                                                        <View>
                                                            <Text style={[styles.default_label,styles.c33_label,styles.pl_20]}>小计¥{cart_total}</Text>
                                                        </View>
                                                    }
                                                </View>
                                            :null}
                                        </View>
                                    )
                                })
                            }
                        </View>
                        
                    :null}

                </ScrollView>

                {
                    cartType ? 
                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.bg_white,styles.pt_8,styles.pb_8,styles.pl_30,styles.pr_20]}>
                        <TouchableOpacity style={[styles.fd_r,styles.ai_ct]} onPress={()=>this._checkAll(c_type)}>
                            <Image source={delType ? asset.radio_full : asset.radio_cart} style={[styles.radio_icon,styles.mr_10]} />
                            <Text style={[styles.default_label,styles.gray_label]}>全选</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.del_box]} onPress={this._onDelete}>
                            <Text style={[styles.sred_label,styles.default_label]}>删除</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.bg_white,styles.pl_30]}>
                        <TouchableOpacity style={[styles.fd_r,styles.ai_ct]} onPress={()=>this._checkAll(c_type)}>
                            <Image source={allType ? asset.radio_full : asset.radio_cart} style={[styles.radio_icon,styles.mr_10]} />
                            <Text style={[styles.default_label,styles.gray_label]}>全选</Text>
                        </TouchableOpacity>
                        <Text style={[styles.c33_label,styles.sm_label,styles.fw_label]}>共{all_count}件</Text>
                        <View style={[styles.fd_r,styles.ai_ct]} >
                            <View style={[styles.fd_c]}>
                                <Text style={[styles.c33_label,styles.default_label,styles.fw_label]}>合计：<Text  style={[styles.sred_label,styles.default_label,styles.fw_label]}>￥{totalAmount.toFixed(2)}</Text></Text>
                                <Text style={[styles.c33_label,styles.sm_label,styles.fw_label]}>已优惠：<Text  style={[styles.sred_label,styles.default_label,styles.fw_label]}>￥{(all_total - totalAmount).toFixed(2)}</Text></Text>
                            </View>
                            
                            <TouchableOpacity style={[styles.set_box,styles.ml_15,styles.fd_r,styles.ai_ct,styles.jc_ct]} onPress={this._toSettlement}>
                                <Text style={[styles.white_label,styles.default_label]}>去结算</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                }

                <View style={[styles.tabbar]}>
                    {
                        tabbar_bottom.map((item,idx)=>{

                            const on = tabbarIndex === idx;

                            return( 
                                <TouchableOpacity key={'item'+idx} style={[styles.tabItem]} 
                                    onPress={()=>navigation.navigate(item.link)}
                                >
                                    <Image source={on ? item.iconfull : item.icon} style={[styles.tabItem_cover]} />
                                    <Text style={[ styles.sm_label , styles.gray_label,on&&styles.red_label]}>{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

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
    tabbar:{
        width:theme.window.width,
        height:50,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        borderTopColor:'#fafafa',
        borderTopWidth:1,
        borderStyle:'solid'
    },
    tabItem:{
        flexDirection:'column',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    tabItem_cover:{
        width:24,
        height:24,
    },
    img_cover:{
        width:65,
        height:65,
        backgroundColor:'#f7f7f7'
    },
    tips:{
        borderWidth:1,
        borderColor:'#FF635B',
        borderStyle:'solid'
    },
    action_icon:{
        width:18,
        height:18
    },
    count:{
        width:40,
        height:18,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    popu_tips:{
        height:10,
        borderRadius:2,
        marginRight:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    c_head:{
        paddingBottom:15,
        borderBottomColor:'#EFEFEF',
        borderBottomWidth:1,
        borderStyle:'solid'
    },
    radio_icon:{
       width:14,
       height:14, 
    },
    radio_box:{
        width: 16,
        marginRight:10,
        flexDirection:"row",
        justifyContent:'center',
        alignItems:'center'
    },
    del_box:{
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F',
        width:100,
        height:32,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
    },
    cartBox:{
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    set_box:{
        width:80,
        height:48,
        backgroundColor:'#F4623F'
    },
    dis_box:{
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F',
        paddingLeft:2,
        paddingRight:2,
        borderRadius:5,
        flexDirection:"row",
        justifyContent:'center',
        alignItems:'center'
    },
    count_box:{
        borderTopColor:'#EFEFEF',
        borderTopWidth:1,
        borderStyle:'solid'
    },
    count_count:{
        width:30,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        flex:1,
        paddingVertical: 0,
    },
})

export const LayoutComponent = Cart;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        mailCart:state.mall.mailCart,
        setShop:state.mall.setShop,
	};
}