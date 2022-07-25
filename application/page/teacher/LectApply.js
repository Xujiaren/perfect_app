import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Keyboard, TextInput, TouchableWithoutFeedback, Modal } from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';

import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';

const options = {
    title: '请选择',
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


class LectApply extends Component {

    static navigationOptions = {
        title: '申请讲师',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.state = {
            applyId: 0,
            type: 1, // 是否可以申请讲师  0 暂未开启  1  开启  
            name: '', // 姓名
            IdCard: '', // 卡号
            level: '', // 级别
            mobile: '', // 电话
            ads: '总公司', // 地址省份
            companyNo: "01000",
            sexList: ['男', '女'], // 性别
            sexIdx: 0,
            eduBack: ['初级中学', '普通高中', '技工学校', '职业高中', '中等专科', '大学专科', '大学本科', '硕士研究生', '博士研究生'], // 学历
            eduBackIdx: 0,
            serviceCenter: '91000', // 服务中心 
            age: '',
            specialty: '', // 特长
            lectType: ['无', '企业文化', '健康管理', '日化', '美容', '专业素质', '自我发展'],//讲师类型
            lectTypeIdx: 0,
            speaker: '',// 主讲课程
            rangeIcon: "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png",
            record: '', // 履历
            experie: '', // 经验
            picArray: [], // 职业资格证书
            barehead: '', // 免冠证书
            applyList: [{
                text: '提交申请',
                status: 2
            }, {
                text: '业务中心',
                status: 0
            }, {
                text: '市场中心',
                status: 0
            }, {
                text: '完美大学',
                status: 0
            }],
            checkLogList: [],
            checkReason: '',
            preview: false,
            preview_index: 0,
            images: [],
            status: 0,
            reason: '',
            companylist: [],
            company_index: 0,
            comps: [],
            isEdit:true,
        }

        this._selectSex = this._selectSex.bind(this);
        this._selectEdu = this._selectEdu.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._selectlect = this._selectlect.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onChooseImg = this._onChooseImg.bind(this);
        this._onViewImgs = this._onViewImgs.bind(this);
        this._onDetele = this._onDetele.bind(this);
        this._onbareDetele = this._onbareDetele.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { user, teacherStatus, companylist } = nextProps;
        const { lectType, lectTypeIdx } = this.state
        if (companylist !== this.props.companylist) {
            let lst = []
            companylist.map(item => {
                lst.push(item.companyName)
            })
            this.setState({
                companylist: companylist,
                comps: lst
            })
        }
        if (user !== this.props.user) {
            this.setState({
                IdCard: user.sn,
                sexIndex: user.sex,
                mobile: user.mobile,
                level: user.level,
                name: user.username,
                serviceCenter: user.agentNo ? user.agentNo : '91000',
                ads: user.companyName
            })
        }

        if (teacherStatus && teacherStatus.checkLogList && teacherStatus !== this.props.teacherStatus) {
            let applyData = teacherStatus;

            let obj = {
                checkInfo: {
                    checkStatus: 1
                },
                isCheck: 1,
                name: "提交申请",
                role_id: 0,
                rule_order: 0,
            }

            let gareList = [];
            let lectidx = 0;

            applyData.checkLogList.unshift(obj)

            if (Array.isArray(applyData.galleryList)) {
                for (let j = 0; j < applyData.galleryList.length; j++) {
                    gareList.push(applyData.galleryList[j].fpath)
                }
            }

            // for (let z = 0; z < lectType.length; z++) {
            //     if (lectType[z] === applyData.categoryIds) {
            //         lectidx = z
            //     }
            // }
            if (applyData.categoryIds == '159') {
                lectidx = 1
            } else if (applyData.categoryIds == '160') {
                lectidx = 2
            } else if (applyData.categoryIds == '161') {
                lectidx = 3
            } else if (applyData.categoryIds == '162') {
                lectidx = 4
            } else if (applyData.categoryIds == '163') {
                lectidx = 5
            } else if (applyData.categoryIds == '164') {
                lectidx = 6
            } else {
                lectidx = 0
            }
            let gareLists = gareList.slice(0, 4);
            setTimeout(() => {
                this.setState({
                    applyId: applyData.applyId,
                    sexIdx: applyData.sex - 1 < 0 ? 0 : applyData.sex - 1,
                    barehead: applyData.photo,
                    picArray: gareLists,
                    ads: applyData.companyName,
                    companyNo: applyData.province,
                    age: applyData.age.toString(),
                    experie: applyData.trainExp,
                    record: applyData.selfExp,
                    mobile: applyData.mobile,
                    serviceCenter: applyData.service,
                    // IdCard:applyData.sn,
                    name: applyData.name,
                    specialty: applyData.strong,
                    checkLogList: applyData.checkLogList,
                    lectTypeIdx: lectidx,
                    status: applyData.status,
                    reason: applyData.reason,
                    isEdit:false
                })
            }, 500);


            for (let i = 0; i < applyData.checkLogList.length; i++) {
                if (applyData.checkLogList[i].checkInfo !== '') {
                    if (applyData.checkLogList[i].checkInfo.checkStatus === 2) {
                        this.setState({
                            checkReason: applyData.checkLogList[i].checkInfo.reason
                        })
                        break;
                    } else {
                        this.setState({
                            checkReason: ''
                        })
                    }
                }
            }

        }
    }

    componentDidMount() {
        const { actions } = this.props;
        actions.user.user();
        actions.teacher.teacherStatus();
        actions.user.companyList();
    }


    componentWillUnmount() {
        Picker.hide();
    }
    _selectarea = () => {
        const { companyNo, companylist, ads, company_index, comps } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择省份/公司',
            pickerData: comps,
            selectedValue: [comps[company_index]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < companylist.length; i++) {
                    if (pickedValue[0] === comps[i]) {
                        this.setState({
                            ompany_index: i,
                            companyNo: companylist[i].companyNo,
                            ads: companylist[i].companyName
                        });
                    }
                }
            },
        });

        Picker.show();
    }
    _selectSex() {
        const { sexIndex, sexList, sexIdx } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择性别',
            pickerData: sexList,
            selectedValue: [sexList[sexIdx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < sexList.length; i++) {
                    if (pickedValue[0] === sexList[i]) {
                        this.setState({
                            sexIdx: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _selectEdu() {
        const { eduBack, eduBackIdx } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择学历',
            pickerData: eduBack,
            selectedValue: [eduBack[eduBackIdx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < eduBack.length; i++) {
                    if (pickedValue[0] === eduBack[i]) {
                        this.setState({
                            eduBackIdx: i,
                        });
                    }
                }
            },
        });

        Picker.show();

    }

    _selectlect() {
        const { lectType, lectTypeIdx } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '申报讲师类型',
            pickerData: lectType,
            selectedValue: [lectType[lectTypeIdx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < lectType.length; i++) {
                    if (pickedValue[0] === lectType[i]) {
                        this.setState({
                            lectTypeIdx: i,
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

    _onChooseImg(type) {
        const { actions } = this.props;
        const { picArray } = this.state;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file: 'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {

                        if (type === 0) {
                            picArray.push(data);
                            this.setState({ picArray: picArray })
                        } else if (type === 1) {
                            this.setState({ barehead: data })
                        }
                    },
                    rejected: (msg) => {
                        this.refs.hud.show('请重新上传', 2);
                    },
                });
            }
        });

    }

    _onViewImgs(arr, index, type) {

        let images = [];

        if (type === 0) {
            arr.map((img, i) => {
                images.push({
                    url: img,
                });
            })
        } else {
            images.push({
                url: arr,
            });
        }

        this.setState({
            preview: true,
            preview_index: index,
            images: images,
        });

    }

    _onDetele(index) {
        const { picArray } = this.state;
        picArray.splice(index, 1);

        this.setState({
            picArray: picArray,
        });
    }

    _onbareDetele() {
        this.setState({
            barehead: ''
        })
    }

    _onSubmit() {
        const { actions } = this.props;
        const { applyId, IdCard, name, age, mobile, ads, sexIdx, eduBack, eduBackIdx, lectType, lectTypeIdx, record, experie, picArray, barehead, serviceCenter, specialty,checkLogList } = this.state;
        let lst = []
        let vas = checkLogList
        lst = vas.filter((item,index)=>index!==0)
        if(lst.length>0&&lst.filter(item=>item.isCheck==1).length>0&&!this.state.isEdit){
            this.refs.hud.show('审核中，不可重复提交', 1);
            return;
        }
        
        let train_certs = picArray.join(',')

        let isPush = true
        let tip = ''
        var pattern = /^1[3-9]\d{9}$/; // 手机号
        let ids = ''
        if (lectTypeIdx == '1') {
            ids = '159'
        } else if (lectTypeIdx == '2') {
            ids = '160'
        } else if (lectTypeIdx == '3') {
            ids = '161'
        } else if (lectTypeIdx == '4') {
            ids = '162'
        } else if (lectTypeIdx == '5') {
            ids = '163'
        } else if (lectTypeIdx == '6') {
            ids = '164'
        }
        if (name == '') {
            isPush = false
            tip = '请填写姓名'
        } else if (serviceCenter == '') {
            isPush = false
            tip = '服务中心不能为空'
        } else if (age == '') {
            isPush = false
            tip = '请填写年龄'
        } else if (!pattern.test(mobile)) {
            isPush = false
            tip = '请填写正确的手机号'
        } else if (specialty == '') {
            isPush = false
            tip = '请填写特长'
        } else if (experie == '') {
            isPush = false
            tip = '请填写授课经历'
        } else if (record == '') {
            isPush = false
            tip = '请填写个人履历'
        } else if (train_certs == '') {
            isPush = false
            tip = '请上传职业资格证书'
        } else if (barehead == '') {
            isPush = false
            tip = '请上传蓝底免冠照片'
        }

        if (isPush) {
            actions.teacher.teacherApply({
                apply_id: applyId,
                sn: IdCard,
                name: name,
                age: age,
                sex: sexIdx + 1,
                province: this.state.companyNo,
                edu: eduBack[eduBackIdx],
                mobile: mobile,
                serviceCenter: serviceCenter,
                category_ids: ids,
                strong: specialty,
                train_exp: experie,
                self_exp: record,
                train_cert: train_certs,
                photo: barehead,
                resolved: (data) => {
                    this.refs.hud.show('申请成功，待审核', 1);
                    setTimeout(() => this.props.navigation.goBack(), 1000);
                    actions.teacher.teacherStatus();
                },
                rejected: (res) => {
                    let msg = '';
                    if (res == 'already teacher') {
                        msg = '已是讲师'
                    } else if (res == 'already apply') {
                        msg = '已经申请，请等待审核'
                    }

                    this.refs.hud.show(msg, 2);
                },
            })
        } else {
            this.refs.hud.show(tip, 1);
        }

    }


    render() {
        const { applyId, applyList, type, name, IdCard, serviceCenter, age, mobile, rangeIcon, sexList, sexIdx, ads, eduBack, eduBackIdx, lectType, lectTypeIdx, record, experie, picArray, barehead, checkLogList, checkReason, specialty, preview, preview_index, images, status, reason} = this.state;

        const lectNotImg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/5b9b8ec5-3594-49c1-8671-f6cce47a6b3c.png';

        return (
            // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    {
                        type === 0 ?
                            <View style={[styles.wrapImg, styles.fd_c, styles.ai_ct, styles.jc_ct]}>
                                <Image source={{ uri: lectNotImg }} style={[styles.wrapCover]} />
                                <View style={[styles.m_20, styles.wraptip]}>
                                    <Text style={[styles.sm_label, styles.tip_label]}>线上申请讲师即将开启敬请期待</Text>
                                </View>
                            </View>
                            :
                            <View>
                                {
                                    applyId > 0 ?
                                        <View style={[styles.lect_status]}>
                                            <View style={[styles.lect_box, styles.fd_r, styles.ai_ct]}>
                                                {/* {
                                                        checkLogList.map((apy, index) => {
                                                            // 0 未做  1  未通过  // 2  通过
                                                            let nextcolor = '#ECECEC';
                                                            let precolor = '#ECECEC';
                                                            let imgtxt = asset.lect_null;

                                                            let on = index === 0;
                                                            let ok = index === checkLogList.length - 1;

                                                            if (apy.isCheck === 1) {
                                                                if (index > 0) {
                                                                    if (checkLogList[index - 1].checkInfo.checkStatus === 1) {
                                                                        precolor = '#7ED321'
                                                                    }
                                                                }
                                                                if (apy.checkInfo.checkStatus === 2) {
                                                                    imgtxt = asset.lect_fail
                                                                } else if (apy.checkInfo.checkStatus === 1) {
                                                                    nextcolor = '#7ED321'
                                                                    imgtxt = asset.lect_da
                                                                }
                                                            } else if (apy.isCheck === 0) {
                                                                if (index > 0) {
                                                                    if (checkLogList[index - 1].checkInfo.checkStatus === 1) {
                                                                        precolor = '#7ED321'
                                                                    }
                                                                }
                                                            }

                                                            return (
                                                                <View style={[styles.lineBox, styles.col_1, styles.fd_c]} key={'apy' + index}>
                                                                    <View style={[styles.fd_r, styles.ai_ct]}>
                                                                        {
                                                                            on ?
                                                                                <View style={[styles.line, styles.bg_fa]}></View>
                                                                                :
                                                                                <View style={[styles.line, { backgroundColor: precolor }]}></View>
                                                                        }
                                                                        <Image source={imgtxt} style={[apy.status === 2 ? styles.lect_pdot : styles.lect_fdot]} />
                                                                        {
                                                                            ok ?
                                                                                <View style={[styles.line, styles.bg_fa]}></View>
                                                                                :
                                                                                <View style={[styles.line, { backgroundColor: nextcolor }]}></View>
                                                                        }
                                                                    </View>
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mt_10]}>
                                                                        <Text style={[styles.sm_label]}>{apy.name}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    } */}
                                                {
                                                    status == 1 ?
                                                        <View style={[{ width: '100%' }, styles.row, styles.jc_ct, styles.ai_ct, styles.mt_10, styles.mb_10]}>
                                                            <Text style={[{ fontSize: 26, color: '#7ED321' }]}>审核通过</Text>
                                                        </View>
                                                        : null
                                                }
                                                {
                                                    status == 0 ?
                                                        <View style={[{ width: '100%' }, styles.row, styles.jc_ct, styles.ai_ct, styles.mt_10, styles.mb_10]}>
                                                            {
                                                                checkLogList.length>0&&checkLogList.filter(item=>item.isCheck==1).length>1?
                                                                <Text style={[{ fontSize: 26, color: '#BA634C' }]}>审核中</Text>
                                                                :
                                                                <Text style={[{ fontSize: 26, color: '#BA634C' }]}>待审核</Text>
                                                            }
                                                            
                                                        </View>
                                                        : null
                                                }
                                                {
                                                    status == 2 ?
                                                        <View>
                                                            <View style={[{ width: '100%' }, styles.row, styles.jc_ct, styles.ai_ct, styles.mt_10]}>
                                                                <Text style={[{ fontSize: 26, color: '#BA634C' }]}>审核不通过</Text>
                                                            </View>
                                                            <View style={[{ width: '100%' }, styles.row, styles.jc_ct, styles.ai_ct, styles.mb_10, styles.mt_5]}>
                                                                <Text style={[{ fontSize: 12, color: '#FF0000' }]}>原因：{reason}</Text>
                                                            </View>
                                                        </View>
                                                        : null
                                                }
                                            </View>
                                            {/* {
                                                    checkReason.length > 0 ?
                                                        <View style={[styles.tips]}>
                                                            <Text style={[styles.sm_label, { color: '#BA634C' }]}>驳回原因：{checkReason}</Text>
                                                        </View>
                                                        : null} */}
                                        </View>
                                        : null}
                                <View style={[styles.form, styles.pb_50, styles.bg_white]}>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>姓名</Text>
                                        <TextInput
                                            style={[styles.input, styles.default_label, styles.col_1]}
                                            clearButtonMode={'never'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            placeholderTextColor={'#909399'}

                                            autoCapitalize={'none'}
                                            placeholder={'请输入你的真实姓名'}
                                            onChangeText={(text) => { this.setState({ name: text }); }}
                                            onFocus={this._onFocus}
                                            value={name}

                                        />
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
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
                                            value={IdCard}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>服务中心</Text>
                                        <TextInput
                                            style={[styles.input, styles.default_label, styles.col_1]}
                                            clearButtonMode={'never'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            placeholderTextColor={'#909399'}

                                            autoCapitalize={'none'}
                                            keyboardType={'default'}
                                            placeholder={''}
                                            onChangeText={(text) => { this.setState({ serviceCenter: text }); }}
                                            onFocus={this._onFocus}
                                            value={serviceCenter}
                                        />
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>年龄</Text>
                                        <TextInput
                                            style={[styles.input, styles.default_label, styles.col_1]}
                                            clearButtonMode={'never'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            maxLength={2}
                                            placeholderTextColor={'#909399'}

                                            autoCapitalize={'none'}
                                            keyboardType={'phone-pad'}
                                            placeholder={'请输入年龄'}
                                            onChangeText={(text) => { this.setState({ age: text }); }}
                                            onFocus={this._onFocus}
                                            value={age}
                                        />
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>性别</Text>
                                        <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectSex}>
                                            <Text style={[styles.default_label, styles.c30_label]}>{sexList[sexIdx]}</Text>
                                            <Image source={asset.arrow_right} style={styles.arrow_right} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>省份</Text>
                                        <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectarea}>
                                            <Text style={[styles.default_label, styles.c30_label]}>{ads}</Text>
                                            <Image source={asset.arrow_right} style={styles.arrow_right} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>联系电话</Text>
                                        <TextInput
                                            style={[styles.input, styles.default_label, styles.col_1]}
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
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>学历</Text>
                                        <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectEdu}>
                                            <Text style={[styles.default_label, styles.c30_label]}>{eduBack[eduBackIdx]}</Text>
                                            <Image source={asset.arrow_right} style={styles.arrow_right} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>特长</Text>
                                        <TextInput
                                            style={[styles.input, styles.default_label, styles.col_1]}
                                            clearButtonMode={'never'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            placeholderTextColor={'#909399'}

                                            autoCapitalize={'none'}
                                            keyboardType={'default'}
                                            placeholder={'例如（演讲）'}
                                            onChangeText={(text) => { this.setState({ specialty: text }); }}
                                            onFocus={this._onFocus}
                                            value={specialty}
                                        />
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_r, styles.ai_ct, styles.jc_sb]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>申报讲师类型</Text>
                                        <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pr_30]} onPress={this._selectlect}>
                                            <Text style={[styles.default_label, styles.c30_label]}>{lectType[lectTypeIdx]}</Text>
                                            <Image source={asset.arrow_right} style={styles.arrow_right} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_c]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>培训授课经历</Text>
                                        <View style={[styles.mt_20]}>
                                            <TextInput
                                                style={[styles.textinput]}
                                                placeholder={'请填写'}
                                                placeholderTextColor={'#909399'}

                                                underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                                multiline={true}
                                                value={experie}
                                                onChangeText={(text) => { this.setState({ experie: text }); }}
                                                onFocus={this._onFocus}
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_c]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>个人履历及能力自述</Text>
                                        <View style={[styles.mt_20]}>
                                            <TextInput
                                                style={[styles.textinput]}
                                                placeholder={'请填写'}
                                                placeholderTextColor={'#909399'}

                                                underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                                multiline={true}
                                                value={record}
                                                onChangeText={(text) => { this.setState({ record: text }); }}
                                                onFocus={this._onFocus}
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_c]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>职业资格证书</Text>
                                        <View style={[styles.mt_20, styles.photo_wraps, styles.fd_r]}>
                                            {
                                                picArray.map((fdItem, index) => {
                                                    return (
                                                        <View key={'fdItem' + index} style={[styles.commt_img, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mb_10, styles.mr_10]}>
                                                            <TouchableOpacity onPress={() => this._onViewImgs(picArray, index, 0)}>
                                                                <Image source={{ uri: fdItem }} style={[styles.commt_img_cover]} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => this._onDetele(index)} style={[styles.commt_tips]}>
                                                                <Image source={asset.i_dete} style={[styles.commt_tip]} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                            }

                                            {
                                                picArray.length < 4 ?
                                                    <TouchableOpacity style={[styles.photo_wrap, styles.fd_c, styles.ai_ct, styles.jc_ct]}
                                                        onPress={() => this._onChooseImg(0)}
                                                    >
                                                        <Image source={asset.uppic} style={[styles.photoImg]} />
                                                        <Text style={[styles.smm_label, styles.tip_label]}>添加图片</Text>
                                                    </TouchableOpacity>
                                                    : null}

                                        </View>
                                    </View>

                                    <View style={[styles.form_item, styles.pl_30, styles.form_item_bt, styles.fd_c]} >
                                        <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>蓝底照片上传</Text>
                                        <View style={[styles.mt_20]}>
                                            {
                                                barehead.length > 0 ?
                                                    <View style={[styles.commt_img, styles.ai_ct, styles.jc_ct, styles.mr_15, styles.mb_10]}  >
                                                        <TouchableOpacity onPress={() => this._onViewImgs(barehead, 0, 1)}>
                                                            <Image source={{ uri: barehead }} style={[styles.commt_img_cover]} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={this._onbareDetele} style={[styles.commt_tips]}>
                                                            <Image source={asset.i_dete} style={[styles.commt_tip]} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    :
                                                    <TouchableOpacity style={[styles.photo_wrap, styles.fd_c, styles.ai_ct, styles.jc_ct]} onPress={() => this._onChooseImg(1)}>
                                                        <Image source={asset.uppic} style={[styles.photoImg]} />
                                                        <Text style={[styles.smm_label, styles.tip_label]}>添加图片</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    </View>



                                    <View style={[styles.btn]}>
                                        <TouchableOpacity style={[styles.btn_text, styles.fd_r, styles.jc_ct, styles.ai_ct]}
                                            onPress={this._onSubmit}
                                        >
                                            <Text style={[styles.white_label, styles.default_label]}>{checkLogList.length>0&&checkLogList[0].isCheck==1?'修改提交':'提交'}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                    }

                </ScrollView>
                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={images} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} />
                </Modal>
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
    wrapImg: {
        marginTop: 100
    },
    wrapCover: {
        width: 180,
        height: 136,
    },
    wraptip: {
        width: 180,
    },

    apply_type: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#FAFAFA'
    },
    input: {
        textAlign: 'right',
        paddingRight: 30,
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
        paddingLeft: 18,
        paddingRight: 18,
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
        width: theme.window.width - 80,
        height: 99,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#FAFAFA',
    },
    photo_wrap: {
        width: 54,
        height: 54,
        borderWidth: 0.5,
        borderStyle: 'dotted',
        borderColor: '#E5E5E5',
        borderRadius: 5,
    },
    photoImg: {
        width: 20,
        height: 20
    },
    commt_img: {
        width: 50,
        height: 50,
        position: 'relative',
        flexShrink: 0,
    },
    commt_img_cover: {
        width: 54,
        height: 54,
    },
    commt_tips: {
        width: 12,
        height: 12,
        position: 'absolute',
        top: -5,
        right: -5,
    },
    commt_tip: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff',
        borderRadius: 6,
    },
    lect_status: {
        width: '100%'
    },
    lect_box: {
        height: 70,
        paddingLeft: 30,
        paddingRight: 30,
    },
    line_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#7ED321',
    },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: '#7ED321',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
    lect_pdot: {
        width: 12,
        height: 12,
    },
    lect_fdot: {
        width: 10,
        height: 10
    }
})

export const LayoutComponent = LectApply;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        teacherStatus: state.teacher.teacherStatus,
        companylist: state.user.companylist,
    };
}
