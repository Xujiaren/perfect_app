import React, { Component } from 'react';
import {Text, View ,StyleSheet,ActivityIndicator, TouchableOpacity,Modal,Image,TextInput,Alert} from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import request from '../../util/net';
import asset from '../../config/asset';
import theme from '../../config/theme';
import Tabs from '../../component/Tabs';
import HudView from '../../component/HudView';
class WinRecord extends Component {

    static navigationOptions = {
        title:'中奖纪录',
        headerRight: <View/>,
    };

    constructor(props) {
        const{navigation}=props
        super(props);
        this.page = 0
        this.type = navigation.getParam('type', 0);
        this.state = {
            list:[],
            page:0,
            pages:0,
            type:0,
            formType:false,
            mobile:'',
            ads:'',
            name:'',
            rewardId:0,
        };
    }

    componentWillReceiveProps(nextProps){
        const {navigation} = this.props
        const {user} = nextProps
        if(user !== this.props.user){
            if(user.addressList.length>0){
                this.setState({
                    name:user.addressList[0].realname,
                    mobile:user.addressList[0].mobile,
                    ads:user.addressList[0].province+user.addressList[0].city+user.addressList[0].district+user.addressList[0].address
                })
            }
        }
    }

    componentDidMount(){
        this._getRecord()
        this.props.actions.user.user()
    }
    _getRecord(){
        var that = this ;
        const {list} = that.state;
        let atype = 11
        if(this.type==0){
            atype=11
        }
        if(this.type==1){
            atype=12
        }
        if(this.type==2){
            atype=13
        }
        request.get('/activity/rank/rewards',{
            atype:atype,
            page:this.page,
        }).then((res)=>{
            let record = res ;

            if(this.page === 0 ){
                this.page = record.page
                this.pages = record.pages
                var fList= record.items
            } else {
                var fList= list.concat(record.items)
            }

            that.setState({
                list:fList,
                page:record.page,
                pages:record.pages,
            })
        })
    }
    onOpen=(val)=>{
        if(val.integral==0){
            if(!val.address){
                this.setState({
                    formType:true,
                    rewardId:val.rewardId
                })
            }else{
                this.refs.hud.show('已填写地址', 1);
            }
        }else{
            this.refs.hud.show('该奖品为学分奖品', 1);
        }
    }
    _onSubmit=()=>{
        const{ads,mobile,name,rewardId}=this.state
        const{actions}=this.props
        if(!ads){
            this.refs.hud.show('请填写地址', 1);
            return;
        }
        if(!mobile){
            this.refs.hud.show('请填写手机号', 1);
            return;
        }
        if(!name){
            this.refs.hud.show('请填写姓名', 1);
            return;
        }
        actions.user.lotteryReceive({
            reward_id:rewardId,
            address:ads,
            mobile:mobile,
            realname:name,
            resolved:(res)=>{
                this.refs.hud.show('操作成功', 1);
                this.setState({
                    formType:false
                })
                this._getRecord()
            },
            rejected:(err)=>{
                this.refs.hud.show('操作失败', 1);
                this.setState({
                    formType:false
                })
            }
        })
    }
    render() {
        const {status,list,formType,mobile,ads,name} = this.state;

        return (
            <View style={styles.container}>
                {
                    list.length>0&&list.map((item,index)=>{
                        const on = list.length - 1 === index ; 

                        return(
                            <TouchableOpacity onPress={()=>this.onOpen(item)}>
                                <View style={[ !on&&styles.item_bt,styles.fd_r,styles.pl_20,styles.pr_20,styles.pt_12,styles.pb_12,styles.bg_white]}>
                                    <Image source={{uri:item.itemImg}} style={[styles.cover]} />
                                    <View style={[styles.fd_c,styles.jc_sb,styles.pl_12]}>
                                        <View style={[styles.fd_c]}>
                                            <Text style={[styles.default_label,styles.gray_label,styles.fw_label]}>{item.itemName}</Text>
                                            <Text style={[styles.default_label,styles.black_label,styles.fw_label,styles.mt_5]}>学霸周榜名次：{item.contentId}名   奖品：{item.itemName}</Text>
                                        </View>
                                        <Text style={[styles.tip_label,styles.sm_label]}>{item.pubTimeFt}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
                {
                    formType  ?
                    <Modal transparent={true} visible={true} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_info]}>
                            <Image source={asset.bg.lucky_ads} style={styles.info_head} />
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'姓名'}
                                    onChangeText={(text) => {this.setState({name:text});}}
                                    value={name}
                                />
                            </View>
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'手机'}
                                    onChangeText={(text) => {this.setState({mobile:text});}}
                                    value={mobile}
                                />
                            </View>
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'地址'}
                                    onChangeText={(text) => {this.setState({ads:text});}}
                                    value={ads}
                                />
                            </View>
                            <View style={[styles.mt_10,styles.mb_20]}>
                                <Text style={[styles.sm_label,styles.tip_label]}>请确保信息无误，一旦提交无法修改</Text>
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]} onPress={this._onSubmit}>
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                : null}
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    cover:{
        width: 64,
        height: 64,
        backgroundColor: '#dddddd',
    },
    item_bt:{
        borderBottomWidth: 1,
        borderStyle:'solid',
        borderBottomColor: '#FAFAFA',
    },
    layertop:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.6)',
    },
    layer_cons:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:280,
        height:306,
        marginLeft:-140,
        marginTop:-153,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        zIndex:999,
        borderRadius:4,
        alignItems:'center',
    },
    layer_info:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:280,
        height:300,
        marginLeft:-140,
        marginTop:-150,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        zIndex:999,
        borderRadius:5,
        alignItems:'center',
    },
    layer_head:{
        width:'100%',
        height:89,
        marginTop:-24,
    },
    layer_ncover:{
        width:80,
        height:80,
    },
    layer_btns:{
        width:250,
        height:34,
        backgroundColor:'#F4623F',
        borderRadius:5,
    },
    layer_icover:{
        paddingTop:12,
        paddingBottom:30,
    },
    gold_cover:{
        width:60,
        height:60,
        borderRadius:30,
    },
    goods_cover:{
        width:64,
        height:70,
    },
    info_head:{
        width:'100%',
        height:89,
        marginTop:-24,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    },
    layer_item:{
        width:250,
        height:32,
        backgroundColor:'#EEEEEE',
        borderRadius:5,
    },
    input:{
        paddingVertical: 0,
    }
});


export const LayoutComponent = WinRecord;


export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}