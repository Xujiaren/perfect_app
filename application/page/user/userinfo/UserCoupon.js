import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image,ImageBackground,Clipboard,ToastAndroid} from 'react-native';

import Tabs from '../../../component/Tabs';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import {formatTimeStampToTime} from '../../../util/common'
import HudView from '../../../component/HudView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';



class UserCoupon extends Component {

    static navigationOptions = {
        title:'我的优惠券',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        const{navigation}=this.props
        this.type = navigation.getParam('type', 0)
        this.couponList = navigation.getParam('couponList', [])
        this.itemType = null;

        this.page = 0;
        this.totalPage = 1;

        this.userCoupon = [];

        this.state = {
            status:0,
            page:0,
            couItems:[],
        };

        this._onSelect = this._onSelect.bind(this);
        this._copyBtn = this._copyBtn.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

    }


    componentWillReceiveProps(nextProps){
        const {userCoupon} = nextProps;
        const {couItems} = this.state;


        if(userCoupon !== this.props.userCoupon){

            this.userCoupon = couItems.concat(userCoupon.items);

            this.setState({
                couItems : this.userCoupon,
            })

			this.page = userCoupon.page;
            this.totalPage = userCoupon.pages;
            
            this.itemtype = [];

        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){

        this._onHeaderRefresh();
    }

    componentWillUnmount(){

    }


    _onHeaderRefresh(){
        const {actions} = this.props;
        const {status} = this.state;


        this.itemtype = null;
		this.userCoupon = [];
		this.page = 0;

        this.setState({
            couItems:[],
        })


        actions.user.userCoupon(status,this.page)

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh(){

        const {actions} = this.props;
        const {status} = this.state;

		if (this.page < this.totalPage) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.user.userCoupon(status,this.page)

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _keyExtractor(item, index) {
	    return index + '';
    }


    _onSelect(index){

        this.setState({
            status:index
        },()=>{
            this._onHeaderRefresh();
        })
    }

    async _copyBtn(code){


        Clipboard.setString(code);

        try {
			var content = await Clipboard.getString();
			this.refs.hud.show('已复制', 1);
	      	ToastAndroid.show('粘贴板的内容为:'+ content,ToastAndroid.SHORT);
	    } catch (e) {
	      	ToastAndroid.show(e.message,ToastAndroid.SHORT);
	    }

    }
    onUse=(val)=>{
        const{navigation}=this.props
        if(this.type==1){
            if(val.ctype==3){
                navigation.state.params.callBack(val);
                navigation.goBack()
            }else{
                this.refs.hud.show('该优惠券不可使用', 1);
            } 
        }else{
            navigation.state.params.callBack(val);
            navigation.goBack()
        }
        
    }

    _renderItem(item){
        const msg = item.item;
        const index = item.index;
        const {status} = this.state;


        return (
            <View>
                {
                    status === 0 ? 
                    <TouchableOpacity style={[styles.mb_15]} onPress={()=>this.onUse(msg)}>
                        <ImageBackground style={[styles.fd_r,styles.ai_ct,styles.coupon]} source={asset.user.coupon}>
                            <View style={[styles.fd_c,styles.jc_ct,styles.ai_ct,{width:(theme.window.width - 30) * 0.35}]}>
                                {
                                    msg.ctype==3?
                                    <Text style={[styles.lg_label,styles.sred_label,styles.fw_label]}>{msg.integral}学分</Text>
                                    :
                                    <Text style={[styles.lg26_label,styles.sred_label,styles.fw_label]}><Text style={[styles.lg_label,styles.sred_label,styles.fw_label]}>￥</Text>{msg.amount}</Text>
                                }
                                {
                                    msg.ctype==3?
                                    <Text style={[styles.sm_label,{color:'#BFBFBF'}]}>满{msg.requireIntegral}可用</Text>
                                    :
                                    <Text style={[styles.sm_label,{color:'#BFBFBF'}]}>满{msg.requireAmount}元可用</Text>
                                }
                            </View>
                            <View style={[styles.fd_c,styles.pl_20]}>
                                <Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>{msg.couponName}</Text>
                                {
                                    msg.endTime==0?
                                    <Text style={[styles.sm_label,styles.mt_10,{color:'#BFBFBF'}]}>{formatTimeStampToTime(msg.beginTime * 1000)} - 无期限</Text>
                                    :
                                    <Text style={[styles.sm_label,styles.mt_10,{color:'#BFBFBF'}]}>{formatTimeStampToTime(msg.beginTime * 1000)} - {formatTimeStampToTime(msg.endTime * 1000)}</Text>
                                }
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                :null}
                {
                    status === 1 ?
                    <TouchableOpacity style={[styles.mb_15]}>
                        <ImageBackground style={[styles.fd_r,styles.ai_ct,styles.coupon]} source={asset.user.coupon}>
                            <View style={[styles.fd_c,styles.jc_ct,styles.ai_ct,{width:(theme.window.width - 30) * 0.35}]}>
                                {
                                    msg.ctype==3?
                                    <Text style={[styles.lg26_label,styles.sred_label,styles.fw_label]}>{msg.integral}学分</Text>
                                    :
                                    <Text style={[styles.lg26_label,styles.sred_label,styles.fw_label]}><Text style={[styles.lg_label,styles.sred_label,styles.fw_label]}>￥</Text>{msg.amount}</Text>
                                }
                                {
                                    msg.ctype==3?
                                    <Text style={[styles.sm_label,{color:'#BFBFBF'}]}>满{msg.requireIntegral}可用</Text>
                                    :
                                    <Text style={[styles.sm_label,{color:'#BFBFBF'}]}>满{msg.requireAmount}元可用</Text>
                                }
                            </View>
                            <View style={[styles.fd_c,styles.pl_20]}>
                                <Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>{msg.couponName}</Text>
                                {
                                    msg.endTime==0?
                                    <Text style={[styles.sm_label,styles.mt_10,{color:'#BFBFBF'}]}>{formatTimeStampToTime(msg.beginTime * 1000)} - 无期限</Text>
                                    :
                                    <Text style={[styles.sm_label,styles.mt_10,{color:'#BFBFBF'}]}>{formatTimeStampToTime(msg.beginTime * 1000)} - {formatTimeStampToTime(msg.endTime * 1000)}</Text>
                                }
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                :null}
                {/* {
                        ls.c_status === 1 ?
                        <View style={[styles.mb_15]}>
                            <ImageBackground style={[styles.coupon,styles.fd_c,styles.jc_ct]} source={asset.user.null_coupon}>
                                <View style={[styles.fd_c,styles.ml_25]}>
                                    <Text style={[styles.sred_label,styles.lg_label,styles.fw_label]}>兑换码</Text>
                                    <View style={[styles.fd_r,styles.ai_ct,styles.mt_10]}>
                                        <View style={[styles.codeback]}>
                                            <Text style={[styles.black_label,styles.default_label]}>348827733331311192112113</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.copyBtn]} onPress={()=>this._copyBtn('348827733331311192112113')}>
                                            <Text style={[styles.gray_label,styles.sm_label]}>复制</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    :null}
                    {
                        ls.c_status === 2 ?
                        <View style={[styles.mb_15]}>
                            <ImageBackground style={[styles.coupon,styles.fd_c,styles.jc_ct]} source={asset.user.used_coupon}>
                                <View style={[styles.fd_c,styles.ml_25]}>
                                    <Text style={[styles.gray_label,styles.lg_label,styles.fw_label]}>兑换码</Text>
                                    <View style={[styles.fd_r,styles.ai_ct,styles.mt_10,]}>
                                        <View style={[styles.codeback]}>
                                            <Text style={[styles.black_label,styles.default_label]}>348827733331311192112113</Text>
                                        </View>
                                        <View style={[styles.nocopyBtn]}></View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    :null} */}
            </View>
        )
    }

    render() {
        const {status,list} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.atabs]}>
                    <Tabs items={['待使用', '已失效','油葱券']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                <View style={[styles.fd_c,styles.jc_ct,styles.ai_ct,styles.mt_20]}>
                    
                    {
                        this.userCoupon&&this.userCoupon.length > 0 ?
                        <RefreshListView
                            showsVerticalScrollIndicator={false}
                            data={this.type==1?this.couponList:this.userCoupon}
                            exdata={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this._onHeaderRefresh}
                            onFooterRefresh={this._onFooterRefresh}
                        />    
                    :null}
                    
                    {
                        this.itemType !== null && this.userCoupon.length === 0 ? 
                        <View style={[styles.fd_c,styles.jc_ct,styles.ai_ct,styles.mt_70]}>
                            <Image source={asset.perfect_icon.pf_coupon} style={styles.nocoupon} />
                            <Text style={[styles.tip_label,styles.sm_label,styles.mt_20]}>暂无可用优惠券</Text>
                        </View>
                    :null}

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
        backgroundColor:'#FAFAFA',
    },
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#fafafa',
        backgroundColor:'#ffffff'
    },
    nocoupon:{
        width:190,
        height:144,
    },
    coupon:{
        width:theme.window.width - 30,
        height:90,
    },
    copyBtn:{
        width:60,
        height:28,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        borderWidth:1,
        borderColor:'#D4D4D4',
        borderStyle:'solid',
        marginLeft:20,
        marginRight:25
    },
    codeback:{
        flex:1,
        backgroundColor:'#F2F2F2',
        height:30,
        borderRadius:5,
        paddingLeft:10,
        flexDirection:'row',
        alignItems:'center',
    },
    nocopyBtn:{
        width:62,
        height:30,
        marginLeft:20,
        marginRight:25
    }
})

export const LayoutComponent = UserCoupon;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userCoupon:state.user.userCoupon
	};
}
