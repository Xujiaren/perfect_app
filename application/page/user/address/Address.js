import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image, ScrollView} from 'react-native';

import HudView from '../../../component/HudView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

class Address extends Component {

    static navigationOptions = {
        title:'地址管理',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        
        this.address = [];
        this.itemtype = null;

        this.state = {

        }

        this._doneAddress = this._doneAddress.bind(this);
        this._doneDefault = this._doneDefault.bind(this);
        this._onDelete = this._onDelete.bind(this);
    }


    componentWillReceiveProps(nextProps){

        const {address} = nextProps;

        if(address !== this.props.address){
            this.address = address;
            this.itemtype = [];
        }
    }

    componentDidMount(){
        const {actions,navigation} = this.props;

        

        this._onRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }

    _onRefresh(){
        const {actions} = this.props;
        actions.address.address();
    }

    _doneAddress(type,ads){

        const { navigation} = this.props;

        navigation.navigate('DoneAddress',{type:type,ads:ads});

    }

    _doneDefault(addressId,index){

        const {actions} = this.props;

        actions.address.firstAddress({
            address_id:addressId,
            resolved: (data) => {
                this._onRefresh();
                this.refs.hud.show('设置默认地址成功', 1);
            },
            rejected: (msg) => {
                
            },
        })
    }

    _onDelete(addressId){

        const {actions} = this.props;

        actions.address.removeAddress({
            address_id:addressId,
            resolved: (data) => {
                this._onRefresh();
                this.refs.hud.show('删除成功', 1);
            },
            rejected: (msg) => {
                
            },
        })

    }

    
    render() {

        const {navigation} = this.props;
        const {params} = navigation.state;

        console.log(this.address.length === 0 && this.itemtype === [],this.itemtype,this.address,this.address.length)
        
        return (
            <View style={[styles.container]}>
                <ScrollView>
                    {
                        this.address.length >  0 && this.address.map((ads,index)=>{
                            return(
                                <TouchableOpacity key={'ads' + index} style={[styles.adsList,styles.fd_c]}
                                    onPress={()=> {params && params.callback && params.callback(ads); navigation.goBack(); }}
                                >
                                    <View style={[styles.fd_r ,styles.jc_sb ,styles.pl_25 ,styles.pr_25]}>
                                        <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label]}>{ads.realname}</Text>
                                        <Text style={[styles.default_label ,styles.c33_label]}>{ads.mobile}</Text>
                                    </View>
                                    <Text style={[styles.default_label ,styles.c33_label ,styles.pt_15 ,styles.pb_15 ,styles.pl_25 ,styles.pr_25]}>{ads.province + ads.city + ads.district + ads.address}</Text>
                                    <View style={[ ,styles.fd_r ,styles.jc_sb  ,styles.ai_ct ,styles.adsList_bottom]}>
                                        <TouchableOpacity style={[ ,styles.fd_r  ,styles.ai_ct ,styles.pl_25]} 
                                            onPress={()=>this._doneDefault(ads.addressId,index)}
                                        >
                                            <Image source={ads.isFirst == 1 ? asset.radio_full : asset.radio} style={[styles.adsList_cover]} />
                                            <Text  style={[styles.tip_label,styles.default_label,(ads.isFirst == 1)&&styles.red_label,styles.ml_10]} >{ads.isFirst == 0 ? '设为默认'  : '默认地址'
                                            }</Text>
                                        </TouchableOpacity>
                                        <View style={[ ,styles.fd_r ,styles.pr_25]}>
                                            <TouchableOpacity style={[styles.adsList_Btn  ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]}
                                                onPress={()=>this._doneAddress(1,ads)}
                                            >
                                                <Text style={[styles.default_label ,styles.c33_label]}>编辑</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.adsList_Btn ,styles.fd_r ,styles.ai_ct ,styles.jc_ct ,styles.ml_10]}
                                                onPress={()=>this._onDelete(ads.addressId)}
                                            >
                                                <Text style={[styles.default_label ,styles.c33_label]}>删除</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        
                    }
                    {
                        this.address.length == [] && Array.isArray(this.itemtype) ?
                        <View style={[styles.adsBox,styles.fd_c,styles.ai_ct]}>
                            <Image source={{uri:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/empty_addr.png'}}  style={[styles.ads_cover]} />
                            <Text style={[styles.sm_label ,styles.tip_label]}>您尚未添加收货地址</Text>
                            <TouchableOpacity style={[styles.doneBtn]} 
                                onPress={()=>this._doneAddress(0,{})}
                            >
                                <Text style={[styles.lg_label ,styles.red_label]}>去添加</Text>
                            </TouchableOpacity>
                        </View>
                    :null}
                </ScrollView>
                {
                    this.address.length > 0 ?
                    <TouchableOpacity style={[styles.add_address ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]} onPress={()=> this._doneAddress(0,{})}>
                        <Text style={[styles.lg_label ,styles.white_label]}>新增收货地址</Text>
                    </TouchableOpacity>
                :null}

                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#fafafa'
    },
    adsBox:{
        marginTop:80,
    },
    ads_cover:{
        width:156,
        height:160,
        marginBottom:16
    },
    doneBtn:{
        marginTop:32,
        width:120,
        height:40,
        backgroundColor:'rgba(255, 255, 255, 1)',
        borderRadius:8,
        borderColor:'rgba(244,98,63,1)',
        borderStyle:'solid',
        borderWidth:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    adsList:{
        paddingTop:16,
        paddingLeft:16,

        backgroundColor:'#ffffff',
        marginTop:10,
    },
    adsList_cover:{
        width:15,
        height:15,
    },
    adsList_bottom:{
        borderTopColor:'#fafafa',
        borderTopWidth:1,
        borderStyle:'solid',
        paddingTop:12,
        paddingBottom:12,
    },
    adsList_Btn:{
        width:74,
        height:30,
        borderRadius:5,
        borderWidth:1,
        borderColor:'rgba(224, 224, 224,1)',
        borderStyle:'solid',
    },
    add_address:{
        width:theme.window.width,
        height:50,
        backgroundColor:'#F4623F'
    }
})


export const LayoutComponent = Address;

export function mapStateToProps(state) {
	return {
        address:state.address.address
	};
}