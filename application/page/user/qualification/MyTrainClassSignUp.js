import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';

import Picker from 'react-native-picker';

import HudView from '../../../component/HudView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

class MyTrainClassSignUp extends Component {


    static navigationOptions = {
        title: '立即报名',
        headerRight: <View />,
    };


    constructor(props) {
        super(props);
        const { navigation } = this.props;

        this.squad_id = navigation.getParam('squad_id', 0);
        this.applyBegin = navigation.getParam('applyBegin', 0);
        this.applyend = navigation.getParam('applyend', 0);



        this.state = {
            squad_id: this.squad_id,
            applyBegin: this.applyBegin,
            applyend: this.applyend,


            sexIndex: 0, //性别选择
            dietaryIndex: 0, //  膳食选择
            tasteIndex: 0,  //　 口味选择

            adres: {},
            NickName: '',
            RealName: '', //  姓名
            Card: '',  // 卡号
            Age: '',   // 年龄
            IdCard: '', // 身份证
            PostCard: 0, // 正副卡
            Phone: '',  // 电话
            Address: '', //地址
            Email: '', // 邮箱
            Note: '',  // 备注
            sexList: ['保密', '男', '女'],
            tasteList: ['无特别要求', '咸', '甜', '辣', '清淡'], // 口味要求
            dietaryList: ['无特别要求', '素食', '清真'], // 膳食要求
            one:true,
            two:true,
            three:true,

        }

        this._onSubmit = this._onSubmit.bind(this);
        this._selectSex = this._selectSex.bind(this);
        this._selectRequire = this._selectRequire.bind(this);
        this._selectTaste = this._selectTaste.bind(this);
        this._onFocus = this._onFocus.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;

        if (user !== this.props.user) {

            this.setState({
                NickName: user.nickname,
                Card: user.sn,
                sexIndex: user.sex,
                PostCard: user.isPrimary, // 0 副卡  正卡
                Phone: user.mobile,
                IdCard:user.idcard,
                RealName:user.username,
                Age:user.age.toString(),
            })
            if(user.username){
                this.setState({
                    one:false
                })
            }
            if(user.idcard){
                this.setState({
                    two:false
                })
            }
            if(user.age){
                this.setState({
                    three:false
                })
            }
            if(user.addressList.length>0){
                let lst = user.addressList[0]
                this.setState({
                    Address:lst.province+lst.city+lst.district+lst.address
                })
            }
        }
    }

    componentDidMount() {
        const { actions } = this.props;
        actions.user.user();
    }


    componentWillUnmount() {
        Picker.hide();
        console.log(this.props.navigation,'???')
        this.props.navigation.state.params.refresh()
    }

    _selectRequire() {
        const { dietaryIndex, dietaryList } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择膳食要求',
            pickerData: dietaryList,
            selectedValue: [dietaryList[dietaryIndex]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < dietaryList.length; i++) {
                    if (pickedValue[0] === dietaryList[i]) {
                        this.setState({
                            dietaryIndex: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _selectTaste() {
        const { tasteIndex, tasteList } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择性别',
            pickerData: tasteList,
            selectedValue: [tasteList[tasteIndex]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < tasteList.length; i++) {
                    if (pickedValue[0] === tasteList[i]) {
                        this.setState({
                            tasteIndex: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }


    _selectSex() {
        const { sexIndex, sexList } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择性别',
            pickerData: sexList,
            selectedValue: [sexList[sexIndex]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < sexList.length; i++) {
                    if (pickedValue[0] === sexList[i]) {
                        this.setState({
                            sexIndex: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _onFocus() {
        Picker.hide();
    }


    _onSubmit() {
        const { actions ,navigation} = this.props;
        const { PostCard, Card, squad_id, sexIndex, dietaryIndex, tasteIndex, NickName, RealName, Age, IdCard, Phone, Address, Email, Note, tasteList, dietaryList, applyend, applyBegin } = this.state;

        let isPush = true;
        let tip = ''

        var szReg = /^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; // 判断邮箱
        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        var paId = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/; // 身份证

        var nowTime = (new Date()).getTime();

        if (RealName == '') {
            isPush = false
            tip = '请填写你的真实姓名'
        } else if (Card == '') {
            isPush = false
            tip = '卡号不能为空'
        } else if (Age == '') {
            isPush = false
            tip = '请填写你的年龄'
        } else if (!paId.test(IdCard)) {
            isPush = false
            tip = '请填写正确的身份证号码'
        } else if (!pattern.test(Phone)) {
            isPush = false
            tip = '请填写正确的手机号'
        } else if (Address == '') {
            isPush = false
            tip = '请填写你的地址'
        } else if (Email.length > 0) {
            if (!szReg.test(Email)) {
                isPush = false
                tip = '请填写正确的邮箱格式'
            }
        }


        // if (applyBegin * 1000 < nowTime && applyend * 1000 > nowTime) {
            if (isPush) {
                actions.train.squadApply({
                    squad_id: squad_id,
                    sn: Card,
                    name: NickName,
                    realname: RealName,
                    age: parseInt(Age),
                    sex: sexIndex,
                    identity_sn: IdCard,
                    is_primary: PostCard,
                    mobile: Phone,
                    address: Address,
                    email: Email,
                    taste: tasteList[tasteIndex],
                    meal: dietaryList[dietaryIndex],
                    remark: Note,
                    resolved: (data) => {
                        this.refs.hud.show('报名成功', 1);
                        setTimeout(() => navigation.goBack(), 1000);
                    },
                    rejected: (res) => {

                        let msg = '';
                        if (res.data.message == 'SQUAD_ERROR') {
                            msg = '不在报名时间内'
                        } else if (res.data.message == 'SQUAD_MAX_NUM') {
                            msg = '人数已满'
                        } else if (res.data.message == 'USER_ERROR') {
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
    onAddress=()=>{
        const{navigation}=this.props
        navigation.navigate('Address' ,{address:this.state.Address,callback:this._onAddress})
    }
    _onAddress=(ads)=>{

        this.setState({
			Address: ads.province + ads.city + ads.district + ads.address
		})

    }
    render() {

        const { PostCard, adres, show_pannel, sexList, sexIndex, dietaryIndex, tasteIndex, NickName, RealName, Card, Age, IdCard, Phone, Address, Email, Note, tasteList, dietaryList } = this.state
        return (
            // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={StyleSheet.container}>
                    <View style={[styles.apply_type]}></View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={[styles.form, styles.pb_50, styles.pl_30, styles.bg_white]}>
                            <View style={[styles.form_item, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>昵称</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'请填写姓名'}
                                    onFocus={this._onFocus}
                                    value={NickName}
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>真实姓名</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'请输入你的真实姓名'}
                                    onChangeText={(text) => { this.setState({ RealName: text }); }}
                                    onFocus={this._onFocus}
                                    value={RealName}
                                    editable={this.state.one}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>卡号</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'卡号'}
                                    onFocus={this._onFocus}
                                    value={Card}
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>性别</Text>
                                <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectSex}>
                                    <Text style={[styles.default_label, styles.c30_label]}>{sexList[sexIndex]}</Text>
                                    <Image source={asset.arrow_right} style={styles.arrow_right} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>年龄</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    maxLength={3}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    keyboardType={'phone-pad'}
                                    placeholder={'请输入年龄'}
                                    onChangeText={(text) => { this.setState({ Age: text }); }}
                                    onFocus={this._onFocus}
                                    value={Age}
                                    // editable={this.state.three}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>身份证</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'请输入身份证'}
                                    keyboardType={'phone-pad'}
                                    onChangeText={(text) => { this.setState({ IdCard: text }); }}
                                    onFocus={this._onFocus}
                                    value={IdCard}
                                    editable={this.state.two}
                                />
                            </View>

                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>正副卡</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'卡号'}
                                    value={PostCard === 0 ? '副卡' : '正卡'}
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>联系电话（可修改）</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}
                                    onChangeText={(text) => { this.setState({ Phone: text }); }}
                                    autoCapitalize={'none'}
                                    keyboardType={'phone-pad'}
                                    placeholder={'请填写联系电话'}
                                    value={Phone}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>联系地址</Text>
                                {/* <View style={[styles.pl_15]}>
                                    <TextInput
                                        style={[styles.textinput]}
                                        placeholder={'请填写'}
                                        placeholderTextColor={'#909399'}

                                        underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                        multiline={true}
                                        value={Address}
                                        onChangeText={(text) => { this.setState({ Address: text }); }}
                                        onFocus={this._onFocus}
                                    />
                                </View> */}
                                 <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this.onAddress}>
                                    <Text style={[styles.default_label, styles.c30_label]}>{Address}</Text>
                                    <Image source={asset.arrow_right} style={styles.arrow_right} />
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>邮箱</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'请输入邮箱'}
                                    value={Email}
                                    onChangeText={(text) => { this.setState({ Email: text }); }}
                                    onFocus={this._onFocus}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>备注(非必填)</Text>
                                <TextInput
                                    style={[styles.input, styles.default_label, styles.col_1]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    placeholderTextColor={'#909399'}

                                    autoCapitalize={'none'}
                                    placeholder={'请输入备注'}
                                    value={Note}
                                    onChangeText={(text) => { this.setState({ Note: text }); }}
                                    onFocus={this._onFocus}
                                />
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>口味偏好</Text>
                                <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectTaste}>
                                    <Text style={[styles.default_label, styles.c30_label]}>{tasteList[tasteIndex]}</Text>
                                    <Image source={asset.arrow_right} style={styles.arrow_right} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.form_item, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>膳食要求</Text>
                                <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectRequire}>
                                    <Text style={[styles.default_label, styles.c30_label]}>{dietaryList[dietaryIndex]}</Text>
                                    <Image source={asset.arrow_right} style={styles.arrow_right} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.btn]}>
                                <TouchableOpacity style={[styles.btn_text, styles.fd_r, styles.jc_ct, styles.ai_ct]}
                                    onPress={this._onSubmit}
                                >
                                    <Text style={[styles.white_label, styles.default_label]}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    <HudView ref={'hud'} />
                </View>

            // </TouchableWithoutFeedback>

        )
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FBFDFF',
    },
    apply_type: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#FAFAFA'
    },
    input: {
        textAlign: 'right',
        paddingRight: 30,
        paddingVertical: 0,
    },
    form: {
        flex: 1
    },
    form_item: {
        paddingBottom: 15,
        paddingTop: 15
    },
    form_item_bt: {
        borderTopColor: '#F8F8F8',
        borderTopWidth: 1,
        borderStyle: 'solid'
    },
    btn: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingRight: 30,
        zIndex: 9999,
        borderTopColor: '#f8f8f8',
        borderStyle: 'solid',
        borderTopWidth: 1,
    },
    btn_text: {
        borderRadius: 5,
        backgroundColor: '#F4623F',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 8,
        marginBottom: 8
    },
    arrow_right: {
        width: 6,
        height: 11,
        marginLeft: 5,
    },
    textinput: {
        textAlign: 'right',
        paddingLeft: 10,
        marginRight: 30,
        width: theme.window.width - 150,
    },
})


export const LayoutComponent = MyTrainClassSignUp;

export function mapStateToProps(state) {
    return {
        user: state.user.user
    };
}


