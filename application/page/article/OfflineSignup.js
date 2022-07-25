import React, { Component } from 'react';
import { Text, Image,View ,StyleSheet,TouchableOpacity,TouchableWithoutFeedback,TextInput,ScrollView, Keyboard} from 'react-native';

import _ from 'lodash';
import Picker from 'react-native-picker';


import HudView from '../../component/HudView';

import {asset, theme} from '../../config';

class OfflineSignup extends Component {

    static navigationOptions = {
        title:'报名信息',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);
        this.state = {
            NickName:'',
            name:'', //  姓名
            Card:'',  // 卡号
            Age:'',   // 年龄
            height:'',
            mobile:'',  // 电话
            ads:'', //地址
            sexList:['保密','男','女'],
            eduBack:['正卡','副卡'],
            eduBackIdx:0,
            sell_sn:'',
            sexIndex:0,
            IDcard:0,
            email:'',
        };
    }

    componentDidMount() {
      
        
    }

    componentWillUnmount(){
        Picker.hide();
    }

    componentWillReceiveProps(nextProps){
       
    }

    _selectCard = () =>{
        const {eduBack,eduBackIdx} = this.state;
        Keyboard.dismiss();
        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择正负卡',
            pickerData: eduBack,
            selectedValue: [eduBack[eduBackIdx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < eduBack.length; i++){
                    if (pickedValue[0] === eduBack[i]){
                        this.setState({
                            eduBackIdx: i,
                        });
                    }
                }
            },
        });

        Picker.show();

    }

    _selectSex = () => {
        const { sexIndex ,sexList} = this.state; 
        Keyboard.dismiss();
        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择性别',
            pickerData: sexList,
            selectedValue: [sexList[sexIndex]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < sexList.length; i++){
                    if (pickedValue[0] === sexList[i]){
                        this.setState({
                            sexIndex: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _onFocus = () => {
        Picker.hide();
    }




    render() {
        const {adres,ads,show_pannel,sexList,sexIndex,NickName,name,Card,Age,mobile,idLevel,height,eduBack,eduBackIdx,sell_sn,IDcard,email} = this.state;


        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={StyleSheet.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}      
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'} 
                    >
                        <View style={[styles.apply_type]}></View>

                        <View style={[styles.form,styles.pb_50,styles.pl_30,styles.bg_white]}>

                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>姓名</Text>
                                <TextInput
                                    style={[styles.input,styles.default_label,styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}
                                    
                                    autoCapitalize={'none'}
                                    placeholder={'请输入你的真实姓名'}
                                    onChangeText={(text) => {this.setState({name:text});}}
                                    onFocus= {this._onFocus}
                                    value={name}
                                    
                                />
                            </View>

                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>卡号</Text>
                                <TextInput
                                    style={[styles.input,styles.default_label,styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}
                                    
                                    autoCapitalize={'none'}
                                    placeholder={'卡号'}
                                    onFocus= {this._onFocus}
                                    value={Card}
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>性别</Text>
                                <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.pr_30]} onPress={this._selectSex}>
                                    <Text style={[styles.default_label ,styles.c30_label]}>{sexList[sexIndex]}</Text>
                                    <Image source={asset.arrow_right}  style={styles.arrow_right}/>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>年龄</Text>
                                <TextInput
                                    style={[styles.input,styles.default_label,styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    maxLength={2}
                                    placeholderTextColor={'#909399'}
                                    
                                    autoCapitalize={'none'}
                                    keyboardType={'phone-pad'}
                                    placeholder={'请输入年龄'}
                                    onChangeText={(text) => {this.setState({Age:text});}}
                                    onFocus= {this._onFocus}
                                    value={Age}
                                />
                            </View>
                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>身份证</Text>
                                <TextInput
                                    style={[styles.input,styles.default_label,styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    maxLength={18}
                                    placeholderTextColor={'#909399'}
                                    
                                    autoCapitalize={'none'}
                                    keyboardType={'phone-pad'}
                                    placeholder={'请输入身份证号码'}
                                    onChangeText={(text) => {this.setState({IDcard:text});}}
                                    onFocus= {this._onFocus}
                                    value={IDcard}
                                />
                            </View>
                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>正副卡</Text>
                                <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.pr_30]} onPress={this._selectCard}>
                                    <Text style={[styles.default_label ,styles.c30_label]}>{eduBack[eduBackIdx]}</Text>
                                    <Image source={asset.arrow_right}  style={styles.arrow_right}/>
                                </TouchableOpacity>
                            </View>


                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>联系电话</Text>
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
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>邮寄地址</Text>
                                <View style={[styles.pl_15]}>
                                    <TextInput
                                        style={[styles.textinput]}
                                        placeholder={'请填写'}
                                        placeholderTextColor={'#909399'}
                                        
                                        underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                        multiline={true}
                                        value={ads}
                                        onChangeText={(text) => {this.setState({ads:text});}}
                                        onFocus= {this._onFocus}
                                    />
                                </View>
                            </View>
                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>邮箱</Text>
                                <View style={[styles.pl_15]}>
                                    <TextInput
                                        style={[styles.textinput]}
                                        placeholder={'请填写'}
                                        placeholderTextColor={'#909399'}
                                        
                                        underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                        multiline={true}
                                        value={email}
                                        onChangeText={(text) => {this.setState({email:text});}}
                                        onFocus= {this._onFocus}
                                    />
                                </View>
                            </View>
                            
                            
                        </View>
                        <View style={[styles.btn]}>
                            <TouchableOpacity style={[styles.btn_text,styles.fd_r,styles.jc_ct,styles.ai_ct]} 
                                onPress={this._onSubmit}
                            >
                                <Text style={[styles.white_label,styles.default_label]}>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FBFDFF',
    },
    apply_type:{
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#FAFAFA'
    },
    input:{
        textAlign:'right',
        paddingRight:30,
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
    btn:{
        width:'100%',
        backgroundColor:'#ffffff',
        paddingLeft:18,
        paddingRight:18,
        zIndex:9999,
        borderTopColor:'#f8f8f8',
        borderStyle:'solid',
        borderTopWidth:1,
    },
    btn_text:{
        borderRadius:5,
        backgroundColor:'#F4623F',
        paddingTop:10,
        paddingBottom:10,
        marginTop:8,
        marginBottom:8
    },
    arrow_right:{
        width:6,
        height:11,
        marginLeft:5,
    },
    textinput:{
        textAlign:'right',
        paddingLeft:10,
        marginRight:30,
        width:theme.window.width - 150,
    },
    c48_label:{
        color:'#484848'
    },
    preview_img:{
        width:(theme.window.width - 70) /2 ,
        height:77
    },
    se_label:{
        marginRight:10,
        flexShrink:0,
    },
    inch_pics:{
        height:105,
        position:'relative'
    },
    inch_pic:{
        width:90,
        height:115,
        backgroundColor:'#fafafa'
    },
    commt_tip:{
        width:14,
        height:14,
        position:'absolute',
        top:-5,
        right:-5,
        borderRadius:8,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#ffffff',
        backgroundColor:'#ffffff'
    },
    commt_tip_cover:{
        width:14,
        height:14,
        borderRadius:8,
    },
    add_inch:{
        position:'relative',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#fafafa',
        width:88,
        height:113,
    },
    inch_Icon:{
        width:40,
        height:40,
    },
    inch_bt:{
        position:'absolute',
        bottom:0,
        flexShrink:0,
        width:'100%',
        height:18,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#484848',
        borderTopLeftRadius:3,
        borderBottomRightRadius:3
    }
});

export const LayoutComponent = OfflineSignup;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}
