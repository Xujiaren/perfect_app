import React, { Component } from 'react'
import { Text, View ,Image,StyleSheet, ScrollView,TouchableOpacity} from 'react-native'

import asset from '../../config/asset';
import theme from '../../config/theme';

class PayProps extends Component {

    static navigationOptions = {
        title:'购买道具',
        headerRight: <View/>,
    };

    constructor(props){
        super(props)

        const {navigation} = props;
        this.gift = navigation.getParam('gift', {});

        console.log(this.gift)

        this.state = {
            isPay:false,
            user_integral:0,
        }

        this._onBuy = this._onBuy.bind(this);

    }

    componentWillReceiveProps(nextProps){

        const {user} = nextProps;

        this.setState({
            user_integral:user.integral
        })
    }


    componentWillMount(){
    }


    componentDidMount(){
        const {actions} = this.props;

        actions.user.user();
    }



    _onBuy(){
        console.log('道具购买')
    }

    render() {

        const {isPay,user_integral} = this.state;


        return (
            <View style={[styles.container]}>
                <ScrollView style={[styles.col_1]}>

                    <View style={[styles.head,styles.bg_white,styles.pl_20,styles.pr_20,styles.pt_20,styles.pb_12]}>
                        <Text style={[styles.tip_label,styles.sm_label]}>道具信息</Text>
                        <View style={[styles.fd_r,styles.mt_10]}>
                            <Image source={{uri:this.gift.giftImg}} style={[styles.img_cover]} />
                            <View style={[styles.fd_c,styles.jc_sb,styles.col_1,styles.ml_15]}>
                                <Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>{this.gift.giftName}</Text>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb]}>
                                    <Text style={[styles.sred_label,styles.default_label]}>{this.gift.integral}学分</Text>
                                    <Text style={[styles.sm_label,styles.tip_label]}>x1</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity  onPress={()=>this.setState({isPay:!isPay})}style={[styles.bg_white,styles.fd_r,styles.jc_sb,styles.ai_ct ,styles.mt_10,styles.pt_12,styles.pb_12,styles.pl_20,styles.pr_15]}>
                        <Text style={[styles.default_label,styles.c33_label]}>可用学分 {user_integral}</Text>
                        <Image source={isPay ?  asset.radio_full : asset.radio }  style={[styles.radio]} />
                    </TouchableOpacity>

                    <View style={[styles.bg_white,styles.mt_10,styles.pl_20,styles.pt_12,styles.pb_12,styles.pr_15]}>
                        <Text style={[styles.default_label,styles.c33_label,styles.lh20_label,styles.mb_15]}>价格明细</Text>
                        <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.bt_border]}>
                            <Text style={[styles.default_label,styles.c33_label]}>总价：</Text>
                            <Text style={[styles.default_label,styles.c33_label]}>{this.gift.integral}学分</Text>
                        </View>
                        <View style={[styles.fd_r,styles.jc_fe]}>
                        <Text style={[styles.default_label,styles.c33_label]}>支付金额：<Text style={[styles.default_label,styles.sred_label]}>{this.gift.integral}学分</Text></Text>
                        </View>
                    </View>
                </ScrollView>
                
                <View style={[styles.fd_r,styles.ai_ct,styles.bg_white,styles.jc_sb,styles.pl_20,styles.pr_10,styles.pt_12,styles.pb_12]}>
                    <Text style={[styles.default_label,styles.c33_label]}>支付金额：<Text style={[styles.default_label,styles.sred_label]}>{this.gift.integral}学分</Text></Text>
                    <TouchableOpacity style={[styles.payBtn]} onPress={this._onBuy}>
                        <Text style={[styles.default_label,styles.white_label,styles.fw_label]}>立即支付</Text>
                    </TouchableOpacity>
                </View>

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
    head:{
        borderTopColor:'#F0F0F0',
        borderTopWidth:1,
        borderStyle:'solid'
    },
    img_cover:{
        width:48,
        height:48,
        backgroundColor:'#FAFAFA'
    },
    radio:{
        width:16,
        height:16,
    },
    bt_border:{
        borderBottomWidth:1,
        borderStyle:'solid',
        borderBottomColor:'#F0F0F0',
        paddingBottom:15,
        marginBottom:18
    },
    payBtn:{
        width:178,
        height:36,
        backgroundColor:'#F4623F',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderTopColor:'#F0F0F0',
        borderTopWidth:1,
        borderStyle:'solid'
    }
})

export const LayoutComponent = PayProps;

export function mapStateToProps(state) {
	return {
        user:state.user.user
	};
}



