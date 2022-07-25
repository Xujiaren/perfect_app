import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';

import HudView from '../../../component/HudView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

const options = {
    title: '选择头像',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.1, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection  原图 不裁剪
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class CertificateSignUp extends Component {


    static navigationOptions = {
        title:'立即报名',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);
        const {navigation} = this.props;

        this.squad_id = navigation.getParam('squad_id',0);
        this.beginTime = navigation.getParam('beginTime',0);
        this.endTime = navigation.getParam('endTime',0);



        this.state = {
            squad_id:this.squad_id,
            beginTime:this.beginTime,
            endTime:this.endTime,

            idLevel:0,
            sexIndex:0, //性别选择


            adres:{},
            NickName:'',
            name:'', //  姓名
            Card:'',  // 卡号
            Age:'',   // 年龄
            height:'',
            mobile:'',  // 电话
            ads:'', //地址
            sexList:['保密','男','女'],
            dietaryList:['无特别要求','素食','清真'], // 膳食要求
            eduBack:['初级中学','普通高中','技工学校','职业高中','中等专科','大学专科','大学本科','硕士研究生','博士研究生'],
            eduBackIdx:0,
            sell_sn:'',
            hasPaper:['有','无'],//是否有学历证书
            hasPaperIdx:0,
            card_forward_img:'',//身份证正面
            card_backward_img:'',//身份证反面
            certificate_img:'',//学历图片   
            certImg:["https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/6499edba-5cdd-4951-bc52-227d1993bde5.png",
                    "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/02af99a2-c706-430e-97f2-5fa8826c7aa8.png",
                    "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/e9a43155-831d-4239-8b88-8d513b642df8.png"
                    ],
            rangeIcon:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png",
            ephoto:'',
            
        }

        this._onSubmit = this._onSubmit.bind(this);
        this._selectSex = this._selectSex.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._selectEdu = this._selectEdu.bind(this);
        this._onChooseImg = this._onChooseImg.bind(this);
        this._onDetele = this._onDetele.bind(this); 
        this._selectPaper = this._selectPaper.bind(this); 

        
    }

    componentWillReceiveProps(nextProps){
        const {user} = nextProps;

        if(user !== this.props.user){

            this.setState({
                NickName:user.nickname,
                Card:user.sn,
                sexIndex:user.sex,
                mobile:user.mobile,
                idLevel:user.idLevel,
                name:user.username
            })

        }
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.user.user();
    }


    componentWillUnmount(){
        Picker.hide();
    }



    _selectEdu(){
        const {eduBack,eduBackIdx} = this.state;
        Keyboard.dismiss();
        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择学历',
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

    _selectPaper(){
        const {hasPaper,hasPaperIdx} = this.state;
        Keyboard.dismiss();
        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择是否有学历证书',
            pickerData: hasPaper,
            selectedValue: [hasPaper[hasPaperIdx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < hasPaper.length; i++){
                    if (pickedValue[0] === hasPaper[i]){
                        this.setState({
                            hasPaperIdx: i,
                        });
                    }
                }
            },
        });

        Picker.show();

    }


    _selectSex(){
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

    _onFocus(){
        Picker.hide();
    }

    _onChooseImg(type){
        const {actions} = this.props;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                this.refs.hud.show('上传中，请稍后');
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                            this.refs.hud.hide();
                            if(type === 0)
                                this.setState({ card_forward_img:data })
                            else if(type === 1)
                                this.setState({ card_backward_img:data })
                            else if(type === 2)
                                this.setState({ certificate_img:data })
                            else 
                                this.setState({ephoto:data})
                    },
                    rejected: (msg) => {
                        // this.refs.hud.show('请重新上传', 2);
                    },
                });
            }
        });
    }

    _onDetele(){

        this.setState({
            ephoto:''
        })

    }


    _onSubmit(){
        const {actions,navigation} = this.props;
        const {Card,squad_id,ads,idLevel,sexIndex,name,Age,mobile,endTime,beginTime,height,eduBack,eduBackIdx,sell_sn,card_forward_img,card_backward_img,certificate_img,ephoto, hasPaperIdx} = this.state;

        let isPush = true;
        let tip = '';

        var szReg=/^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; // 判断邮箱
        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        var paId =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/; // 身份证

        var nowTime = (new Date()).getTime();

        if(name == ''){
            isPush = false
            tip = '请填写姓名'
        }else if(Card == ''){
            isPush = false
            tip = '请填写卡号'
        } else if(idLevel == 0){
            isPush = false
            tip = '请填写级别'
        }  else if(!pattern.test(mobile)){
            isPush = false
            tip = '请填写正确的手机号'
        } else if(ads == ''){
            isPush = false
            tip = '请填写你的地址'
        } else if( Age == ''){
            isPush = false
            tip = '请填写年龄' 
        } else if( height == '' ){
            isPush = false
            tip = '请填写你的身高'
        } else if(sell_sn == ''){
            isPush = false
            tip = '请填写专卖号'
        } else if(card_forward_img == ''){
            isPush = false
            tip = '请上传身份证正面照'
        } else if(card_backward_img == ''){
            isPush = false
            tip = '请上传身份证背面照'
        } else if(certificate_img == '' && hasPaperIdx === 0 ){
            isPush = false
            tip = '请上传学历证书内页'
        } else if(ephoto == ''){
            isPush = false
            tip = '请上传一寸彩色白底照片'
        }

        let identity_imgs = card_forward_img + ','+ card_backward_img;

       
        // if(beginTime * 1000 < nowTime &&  endTime * 1000 > nowTime){
            if(isPush){
                actions.train.squadCert({
                    squad_id:squad_id,
                    name:name,
                    sn:Card,
                    level:idLevel,
                    mobile:mobile,
                    address:ads,
                    sex:sexIndex,
                    edu:eduBack[eduBackIdx],
                    age:Age,
                    height:height,
                    sell_sn:sell_sn,
                    identity_imgs:identity_imgs,
                    edu_cert:certificate_img,
                    ephoto:ephoto,
                    resolved: (data) => {
                        this.refs.hud.show('报名成功', 1);
                        setTimeout(()=>navigation.goBack(),1000);
                    },
                    rejected: (res) => {
                        let msg = '';
                        if(res == 'SQUAD_ERROR'){
                            msg = '不在报名时间内'
                        } else if(res == 'SQUAD_MAX_NUM'){
                            msg = '人数已满'
                        } else if(res == 'USER_ERROR'){
                            msg = '已报名'
                        }

                        this.refs.hud.show(msg, 2);
                    },
                })
            } else {
                this.refs.hud.show(tip, 1);
            }
        // } else {
        //     this.refs.hud.show('不在可报名时间内', 1);
        // }
    }

    render() {

        const {adres,ads,show_pannel,sexList,sexIndex,NickName,name,Card,Age,mobile,dietaryList,idLevel,height,eduBack,eduBackIdx,sell_sn,hasPaper,hasPaperIdx,card_forward_img,card_backward_img,certificate_img,ephoto,certImg} = this.state;


        let levelName = ''
        
        if(idLevel == 1){
            levelName = '直销员工'
        }else if(idLevel == 3){
            levelName = '服务中心员工'
        }else if(idLevel == 4){
            levelName = '服务中心负责人'
        } else if(idLevel == 5){
            levelName = '优惠顾客'
        } else if(idLevel == 6) {
            levelName = '初级经理'
        } else if(idLevel == 7){
            levelName = '中级经理'
        } else if(idLevel == 8){
            levelName = '客户总监'
        } else if(idLevel == 9){
            levelName = '高级客户经监'
        } else if(idLevel == 'gg'){
            levelName = '高级客户总监及以上'
        } 

        return (
            // <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    
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
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>级别</Text>
                                <View style={[styles.fd_r,styles.ai_ct,styles.pr_30]}>
                                    <Text style={[styles.default_label ,styles.c30_label]}>{levelName}</Text>
                                </View>
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
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>性别</Text>
                                <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.pr_30]} onPress={this._selectSex}>
                                    <Text style={[styles.default_label ,styles.c30_label]}>{sexList[sexIndex]}</Text>
                                    <Image source={asset.arrow_right}  style={styles.arrow_right}/>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>学历</Text>
                                <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.pr_30]} onPress={this._selectEdu}>
                                    <Text style={[styles.default_label ,styles.c30_label]}>{eduBack[eduBackIdx]}</Text>
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
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>身高</Text>
                                <View style={[styles.fd_r,styles.ai_ct,styles.pr_30]}>
                                    <TextInput
                                        style={[styles.input,styles.default_label,{paddingRight:10}]}
                                        clearButtonMode={'never'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        maxLength={3}
                                        placeholderTextColor={'#909399'}
                                        
                                        autoCapitalize={'none'}
                                        keyboardType={'phone-pad'}
                                        placeholder={'请输入身高'}
                                        onChangeText={(text) => {this.setState({height:text});}}
                                        onFocus= {this._onFocus}
                                        value={height}
                                    />
                                    <Text style={[styles.default_label,styles.tip_label]}>cm</Text>
                                </View>
                            </View>

                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>专卖号</Text>
                                <TextInput
                                    style={[styles.input,styles.default_label,styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}
                                    
                                    autoCapitalize={'none'}
                                    keyboardType={'phone-pad'}
                                    placeholder={'请输入专卖号'}
                                    onChangeText={(text) => {this.setState({sell_sn:text});}}
                                    onFocus= {this._onFocus}
                                    value={sell_sn}
                                />
                            </View>

                            <View style={[styles.form_item ,styles.form_item_bt,styles.fd_r ,styles.ai_ct ,styles.jc_sb]} >
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label]}>是否有学历证书</Text>
                                <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.pr_30]} onPress={this._selectPaper}>
                                    <Text style={[styles.default_label ,styles.c30_label]}>{hasPaper[hasPaperIdx]}</Text>
                                    <Image source={asset.arrow_right}  style={styles.arrow_right}/>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.form_item]}>
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label ,styles.se_label]}>身份证照</Text>
                                <View style={[styles.photo_wrap,styles.fd_r,styles.jc_sb,styles.mr_30]}>
                                    <TouchableOpacity style={[styles.photo]} onPress={()=>this._onChooseImg(0)}>
                                        {card_forward_img?
                                        <Image style={[styles.preview_img]}  source={{uri:card_forward_img}}/>
                                        :
                                        <Image mode='aspectFit' style={[styles.photo_img]} source={{uri:certImg[0]}}/>
                                        }
                                        <View style={[styles.photo_txt]}>
                                            <Text style={[styles.white_label,styles.smm_label]}>上传身份证正面</Text>
                                        </View>
                                        
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.photo]} onPress={()=>this._onChooseImg(1)}>
                                        {card_backward_img?
                                        <Image style={[styles.preview_img]} mode='aspectFill' source={{uri:card_backward_img}}/>
                                        :
                                        <Image mode='aspectFit' style={[styles.photo_img]} source={{uri:certImg[1]}}/>
                                        }
                                        <View style={[styles.photo_txt]}>
                                            <Text style={[styles.white_label,styles.smm_label]}>上传身份证反面</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {
                                hasPaperIdx === 0 ?
                                <View style={[styles.form_item]}>
                                    <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label ,styles.se_label]}>学历证书</Text>
                                    <View style={[styles.photo_wrap,styles.fd_r,styles.jc_sb,styles.mr_30]}>
                                        <TouchableOpacity style={[styles.photo]} onPress={()=>this._onChooseImg(2)}>
                                            {certificate_img?
                                            <Image style={[styles.preview_img]} mode='aspectFill' source={{uri:certificate_img}}/>
                                            :
                                            <Image mode='aspectFit' style={[styles.photo_img]} source={{uri:certImg[2]}}/>
                                            }
                                            <View style={[styles.photo_txt]}>
                                                <Text style={[styles.white_label,styles.smm_label]}>上传学历证书内页</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            certificate_img?null:
                                            <View style={[styles.photo_tips,styles.fd_r,styles.jc_ct,styles.ai_ct]}>
                                                <Text style={[styles.smm_label]}>后期会有工作人员联系补充资料</Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                :
                            null}

                            <View style={[styles.from_item ,styles.border_tp ,styles.pt_15 ,styles.pb_15]}>
                                <Text style={[styles.be_333 ,styles.fs_15 ,styles.fw_label ,styles.se_label]}>彩色白底证件照片</Text>   
                                <View style={[styles.photo_wrap ,styles.pt_15,styles.fd_r,styles.jc_sb,styles.mr_30]}>
                                    {
                                        ephoto.length > 0 ?
                                        <View style={[styles.inch_pics]}>
                                            <Image source={{uri:ephoto}} style={[styles.inch_pic]} />
                                            <TouchableOpacity onPress={this._onDetele} style={[styles.commt_tip]}  >
                                                <Image source={asset.i_dete} style={[styles.commt_tip_cover]}  />
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity style={[styles.add_inch ,styles.d_flex ,styles.fd_c ,styles.ai_ct ,styles.jc_ct]} onPress={()=>this._onChooseImg(3)}>
                                            <Image source={asset.uppic} style={[styles.inch_Icon]} />
                                            <View style={[styles.inch_bt]}>
                                                <Text style={[styles.smm_label ,styles.white_label ,styles.fw_label]}>上传一寸照片</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
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
                
            // </TouchableWithoutFeedback>
            
        )
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
        paddingVertical: 0,
    },
    c48_label:{
        color:'#484848'
    },
    preview_img:{
        width:(theme.window.width - 70) /2 ,
        height:77
    },
    photo:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-between',
        width:(theme.window.width - 70) /2 ,
        height:100,
        marginTop:15,
        backgroundColor:'#f3f3f3'
    },
    photo_img:{
        marginTop:15,
        width:64,
        height:43
    },
    photo_txt:{
        flexShrink:0,
        width:'100%',
        height:23,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#484848'
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
})


export const LayoutComponent = CertificateSignUp;

export function mapStateToProps(state) {
	return {
        user:state.user.user
	};
}
