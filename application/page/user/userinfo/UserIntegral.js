import React, { Component } from 'react';
import { Text, View ,StyleSheet ,ImageBackground, TouchableOpacity, Modal,Image, TextInput} from 'react-native';

import Tabs from '../../../component/Tabs';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';


class UserIntegral extends Component {

    static navigationOptions = {
        title:'我的学分',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        const {navigation} = this.props;

        this.integral = navigation.getParam('integral',0);

        this.items = [];
		this.page = 1;
        this.totalPage = 1;
        
        this.state = {
            status:0,
            payId:0,
            page:0,
            itype:0,
            amount:0,
            wdType:false,
            wd_s_Type:false,
            integral:this.integral,
            refreshState: RefreshState.Idle,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._SelectPay = this._SelectPay.bind(this);

    }

    componentWillReceiveProps(nextProps) {
		const {userintegral} = nextProps;

		if (userintegral !== this.props.userintegral) {
			this.items = this.items.concat(userintegral.items);
			this.page = userintegral.page + 1;
			this.totalPage = userintegral.pages;
		}


		setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }
    
    componentWillMount(){
    }

    componentDidMount() {
		this._onHeaderRefresh();
	}

    _onHeaderRefresh() {
		const {actions} = this.props;
        const {itype} = this.state;
		this.items = [];
		this.page = 1;
		this.totalPage = 1;


		actions.user.userintegral(itype,1);

		this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh() {
		const {actions} = this.props;
        const {itype} = this.state;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.user.userintegral(itype,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
	}

    _renderItem(item){
        const gold = item.item;

        return (
            <View style={[ styles.pt_15,styles.pb_15 ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb]}>
                <View style={[styles.d_flex ,styles.fd_c ,styles.ml_5,styles.col_1,styles.mr_10]}>
                    <Text style={[styles.default_label]}>{gold.contentName} </Text>
                    <Text style={[styles.sm_label ,styles.tip_label ,styles.mt_5]}>{gold.pubTimeFt}</Text>
                </View>
                <Text style={[styles.default_label ,styles.orange_label]}>{gold.itype === 0 ? '+' : '-'}{gold.integral}</Text>
            </View>
        );
    }

    _onSelect = (index) =>{

        this.setState({
            page:1,
            status:index,
            itype:index,
        },()=>{
            this._onHeaderRefresh();
        });
    }

    _SelectPay(type){

    }

    render() {
        const {navigation} = this.props;
        const {status,integral,wdType,payId,amount,wd_s_Type} = this.state;


        return (
           

            <View style={styles.container}>

                <ImageBackground source={asset.bg.bg_gold} style={[styles.goldBox,styles.fd_r,styles.ai_ct,styles.mt_20]}>
                    <View style={[styles.pl_25,styles.pr_25,styles.fd_c,{width:'100%'}]}>
                        <View style={[styles.fd_c]}>
                            <Text style={[styles.white_label,styles.sm_label,styles.fw_label]}>我的学分</Text>
                            <Text style={[styles.white_label,styles.lg30_label,styles.fw_label]}>{integral}</Text>
                        </View>
                        {/* <View style={[styles.mt_25]}>
                            <Text style={[styles.white_label,styles.sm_label,styles.fw_label]}>账户余额</Text>
                            <View style={[styles.fd_r,styles.jc_sb]}>
                                <Text style={[styles.fw_label,styles.white_label,styles.lg30_label]}><Text style={[styles.fw_label,styles.white_label,styles.default_label]}>￥</Text>872</Text>
                                <View style={[styles.fd_r,styles.ai_ct]}>
                                    <TouchableOpacity style={[styles.recharge_btn]} onPress={()=>navigation.navigate('Recharge')}>
                                        <Text style={[styles.gray_label,styles.default_label]}>充值</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.recharge_btn,styles.ml_10]} onPress={()=>this.setState({wdType:true})}>
                                        <Text style={[styles.gray_label,styles.default_label]}>提现</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> */}
                    </View>
                </ImageBackground>

                <View style={[styles.atabs,styles.pt_10,styles.mt_10]}>
                    <Tabs items={['获得明细', '支出明细']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>
                <View style={[styles.pl_25,styles.pr_25]}>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.items}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                        onFooterRefresh={this._onFooterRefresh}
                    />
                </View>

                <Modal  visible={wdType} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={()=>this.setState({wdType:false})}></TouchableOpacity>
                    <View style={styles.withdrawal}>

                        <View style={[styles.fd_c,styles.jc_sb,styles.col_1]}>
                            <View style={[styles.m_20,]}>
                                <Text style={[styles.c33_label,styles.default_label,styles.fw_label]}>提现金额</Text>
                                <View style={[styles.txt_box,styles.fd_r,styles.ai_ct]}>
                                    <Text style={[styles.lg26_label,styles.c33_label,styles.fw_label]}>￥ </Text>
                                    <TextInput 
                                        style={[styles.input,styles.lg26_label,styles.col_1,styles.fw_label]}
                                        clearButtonMode={'never'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        placeholderTextColor={'#909399'}
                                        
                                        autoCapitalize={'none'}
                                        keyboardType={'numbers-and-punctuation'}
                                        placeholder={''}
                                        value={amount}
                                        onChangeText={(text) => {this.setState({amount:text});}}
                                    />
                                </View>
                                <Text style={[styles.c33_label,styles.default_label,styles.fw_label]}>提现到</Text>
                                <View style={[styles.mt_20]}>
                                    <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_15,styles.pb_15]}
                                        onPress={()=>this._SelectPay(0)}
                                    >
                                        <View style={[styles.fd_r,styles.ai_ct]}>
                                            <Image source={asset.pay.ali_pay} style={[styles.pay_icon,styles.mr_10]} />
                                            <Text style={[styles.gray_label,styles.default_label]}>支付宝</Text>
                                        </View>
                                        <Image source={ payId === 0 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.mb_1,styles.pt_15,styles.pb_15]}
                                        onPress={()=>this._SelectPay(1)}
                                    >
                                        <View style={[styles.fd_r,styles.ai_ct]}>
                                            <Image source={asset.pay.wechat_pay} style={[styles.pay_icon,styles.mr_10]} />
                                            <Text style={[styles.gray_label,styles.default_label]}>微信支付</Text>
                                        </View>
                                        <Image source={ payId === 1 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                           
                            <View style={[styles.log_btn]}>
                                <TouchableOpacity style={[styles.log_btn_l ,styles.col_1,styles.fd_r,styles.jc_ct,styles.ai_ct]} onPress={()=>this.setState({wdType:false})}>
                                    <Text style={[styles.lg18_label ,styles.tip_label]}>关闭</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.col_1 ,styles.log_btn_r,styles.fd_r,styles.jc_ct,styles.ai_ct]} >
                                    <Text style={[styles.lg18_label ,styles.c33_label]}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                </Modal>

                <Modal  visible={wd_s_Type} transparent={true} onRequestClose={() => {}}>
                    <View style={styles.scoreBox}>
                        <View style={[styles.evalBox]}>
                            <Image style={styles.modal_img}  source={{uri:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png"}}/>
                            <View style={[styles.head_tip,styles.fd_r,styles.jc_ct,styles.ai_ct,styles.col_1]}>
                                <Text style={[styles.lg18_label,styles.black_label]}>提交成功，待审核</Text>
                            </View>

                            <View style={[styles.pl_25,styles.pr_20]}>
                                <Text style={{color:'#888888',fontSize:15}}>提示：我们会在3个工作日内完成审核并发送结果，请注意消息通知。</Text>
                            </View>
                            <View style={[styles.d_flex ,styles.fd_r  ,styles.mt_30 ,styles.eval_btns]}>
                                <TouchableOpacity style={[styles.col_1 ,styles.d_flex ,styles.ai_ct ,styles.jc_ct ,styles.eval_btns_left ,styles.pt_12 ,styles.pb_12]} 
                                    onPress={()=>this.setState({wd_s_Type:false})}>
                                    <Text style={[styles.lg18_label ,styles.tip_label]}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.col_1 ,styles.d_flex ,styles.ai_ct ,styles.jc_ct ,styles.pt_12 ,styles.pb_12]} 
                                    >
                                    <Text style={[styles.lg18_label ,styles.c33_label]}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    atabs:{
        borderBottomWidth:1,
        borderBottomColor:'#F6F6F6',
        borderStyle:'solid'
    },
    container:{

    },
    goldBox:{
        width:theme.window.width - 30,
        marginLeft:15,
        height:156,
    },
    recharge_btn:{
        width:70,
        height:28,
        borderRadius:14,
        backgroundColor:'#ffffff',
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(200, 109, 62, 0.57);',
        shadowOpacity: 1.0,
        elevation: 2,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    withdrawal:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:290,
        height:350,
        marginLeft:-145,
        marginTop:-175,
        borderRadius:5,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        backgroundColor:'#ffffff'
    },
    log_btn:{
        height:50,
        borderTopWidth:1,
        borderTopColor:'#E5E5E5',
        borderStyle:'solid',
        flexDirection:'row'
    },
    log_btn_l:{
        borderRightWidth:1,
        borderRightColor:'#E5E5E5',
        borderStyle:'solid',
    },
    pay_icon:{
        width:20,
        height:20,
    },
    icon_cover:{
        width:16,
        height:16
    },
    txt_box:{
        marginTop:15,
        marginBottom:25,
        borderStyle:'solid',
        borderBottomColor:'#F2F2F2',
        borderBottomWidth:2,
        borderStyle:'solid',
        height:40,
    },
    scoreBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0, 0, 0, 0.4)'
    },
    evalBox:{
        width:280,
        height:184,
        backgroundColor:'#ffffff',
        borderRadius:4,
        flexDirection:'column',
        justifyContent:'flex-end',
        position:'relative'
    },
    modal_img:{
        position:'absolute',
        left:'50%',
        top:-230,
        width:375,
        height:260,
        marginLeft:-187.5,
    },
    eval_btns:{
        borderTopWidth:1,
        borderTopColor:'#E5E5E5',
        borderStyle:'solid'
    },
    eval_btns_left:{
        borderRightWidth:1,
        borderRightColor:'#E5E5E5',
        borderStyle:'solid'
    },
    head_tip:{
        position:'absolute',
        top:-20,
        width:280,
    }
});

export const LayoutComponent = UserIntegral;

export function mapStateToProps(state) {
	return {
        userintegral:state.user.userintegral,
	};
}
