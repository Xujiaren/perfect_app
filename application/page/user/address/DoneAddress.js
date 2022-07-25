import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Switch,TouchableWithoutFeedback, Keyboard } from 'react-native';

import Picker from 'react-native-picker';

import HudView from '../../../component/HudView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';
import region from '../../../util/region';

class DoneAddress extends Component {
    
    static navigationOptions = {
        title:'添加地址',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.ads = navigation.getParam('ads',{});


        this.citys = [];

        Object.keys(region).map((province, index) => {
			let _area = {};
			const citys = region[province];

			let _citys = [];
			Object.keys(citys).map((city, index) => {
				let _area = {};
				_area[city] = citys[city];
				_citys.push(_area);
			})

			_area[province] = _citys;

			this.citys.push(_area);
        })
        

        this.state = {
            address_id:this.ads.addressId === undefined ? '' : this.ads.addressId,
            name:this.ads.realname === undefined ? '' : this.ads.realname,
            mobile:this.ads.mobile === undefined ? '' : this.ads.mobile,
            ads:this.ads.address === undefined ?  '' : this.ads.address,
            province:this.ads.province === undefined ? '' : this.ads.province,
			city:this.ads.city === undefined ? '' : this.ads.city,
			district:this.ads.district === undefined ? '' : this.ads.district,
            isfirst:this.ads.isFirst === undefined ? '' : this.ads.isFirst === 0 ? false : true,
        }

        this._onFocus = this._onFocus.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onCity = this._onCity.bind(this);
    }

    _onFocus(){
        Picker.hide();
    }

    _onChange(value){
        this.setState({
            isfirst:value,
        });
    }

    _onCity(){
        const {province,city,district} = this.state;

        Keyboard.dismiss();

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择地区',
            pickerData: this.citys,
            selectedValue: [province, city, district],
            onPickerConfirm: pickedValue => {
                this.setState({
                	province: pickedValue[0],
                	city: pickedValue[1],
                	district: pickedValue[2],
                })
            },
        });

        Picker.show();
    }


    _onSubmit(){
        const {actions,navigation} = this.props;
        const {address_id,name,mobile,ads,isfirst,province,city,district} = this.state;

        let isPush = true;
        let tip = '' ;

        if(name == '' ){
            isPush = false
            tip = '请填写你的姓名'
        } else if (mobile == '' || mobile.length != 11) {
            isPush = false
            tip = '请填写正确的号码'
        }else if(province.length == 0){
            isPush = false
            tip = '请选择地区'
        } else if(ads == ''){
            isPush = false
            tip = '请填写你的详细地址'
        }

        if(isPush){
            actions.address.doneAddress({
                address_id:address_id,
                realname:name,
                mobile:mobile,
                province:province,
                city:city,
                district:district,
                address:ads,
                is_first:isfirst ? 1 : 0,
                resolved: (data) => {
                    this.refs.hud.show('保存地址', 1);
                    setTimeout(()=>{navigation.goBack();},1000)
                },
                rejected: (msg) => {
                    
                },
            })
        } else {
            this.refs.hud.show(tip, 2);
        }
        
    }

    render() {

        const {name,mobile,ads,isfirst,province,city,district} = this.state;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={[styles.container]}>
                <View style={[styles.form,styles.pb_50,styles.bg_white]}>
                    <View style={[styles.form_item ,styles.pl_30,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                        <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>姓名</Text>
                        <TextInput
                            style={[styles.input,styles.default_label,styles.col_1]}
                            clearButtonMode={'never'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            placeholderTextColor={'#909399'}
                            autoCapitalize={'none'}
                            placeholder={'请填写你的姓名'}
                            onChangeText={(text) => {this.setState({name:text});}}
                            onFocus= {this._onFocus}
                            value={name}                            
                        />
                    </View>
                    <View style={[styles.form_item ,styles.pl_30,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                        <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>手机</Text>
                        <TextInput
                            style={[styles.input,styles.default_label,styles.col_1]}
                            clearButtonMode={'never'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            placeholderTextColor={'#909399'}
                            autoCapitalize={'none'}
                            keyboardType={'phone-pad'}
                            placeholder={'请填写联系电话'}
                            value={mobile}
                            onChangeText={(text) => {this.setState({mobile:text});}}
                            onFocus= {this._onFocus}
                        />
                    </View>
                    <View style={[styles.form_item,styles.pl_30 ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                        <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>地区</Text>
                        <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.jc_fe,styles.pr_30,{width:theme.window.width - 105}]} onPress={this._onCity}>
                            <Text style={[province != '' ? styles.c33_label : styles.tip_label,]}>{province != '' ? province + ' ' + city + ' ' + district : '请选择所在区域'}</Text>
                            <Image source={asset.arrow_right}  style={styles.arrow_right}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.form_item ,styles.pl_30,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                        <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>详细地址</Text>
                        <View style={[styles.pl_15]}>
                            <TextInput
                                style={[styles.textinput]}
                                placeholder={'街道地址门牌号'}
                                placeholderTextColor={'#909399'}
                                underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                multiline={true}
                                value={ads}
                                onChangeText={(text) => {this.setState({ads:text});}}
                                onFocus= {this._onFocus}
                            />
                        </View>
                    </View>
                    <View style={[styles.form_item ,styles.pl_30,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                        <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>默认地址</Text>
                        <View style={[styles.pr_30]}>
                            <Switch
                                style={{transform:[{scaleX:0.8},{scaleY:0.8}]}}
                                onValueChange={(value) => this._onChange(value)}
                                value={isfirst}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.m_20 ,styles.keepBtn]} onPress={this._onSubmit}>
                        <Text style={[styles.lg_label ,styles.white_label]}>保存</Text>
                    </TouchableOpacity>
                    
                </View>
                <HudView ref={'hud'} />
            </View>
            </TouchableWithoutFeedback>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FBFDFF',
    },
    input:{
        textAlign:'right',
        paddingRight:30,
        paddingVertical: 0,
    },
    form:{
        flex:1
    },
    form_item:{
        paddingBottom:15,
        paddingTop:15
    },
    form_item_bt:{
        borderTopColor:'#F8F8F8',
        borderTopWidth:1,
        borderStyle:'solid'
    },
    textinput:{
        textAlign:'right',
        paddingLeft:10,
        marginRight:30,
        width:theme.window.width - 150,
        paddingVertical: 0,
    },
    arrow_right:{
        width:6,
        height:11,
        marginLeft:5,
    },
    keepBtn:{
        backgroundColor:'#F4623F',
        borderRadius:5,
        height:44,
        marginTop:25,
        alignItems:'center',
        justifyContent:'center'
    }
})

export const LayoutComponent = DoneAddress;

export function mapStateToProps(state) {
	return {

	};
}
