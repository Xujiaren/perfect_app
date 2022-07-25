import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image, Alert,PermissionsAndroid, DeviceEventEmitter, Keyboard} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import {formatTimeStampToTime} from '../../../util/common';
import region from '../../../util/region';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import HudView from '../../../component/HudView';
import theme from '../../../config/theme';
import iconMap from '../../../config/font';
import LabelBtn from '../../../component/LabelBtn';
import request from '../../../util/net'
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



class UserInfo extends Component {

    static navigationOptions = {
        title:'编辑个人信息',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);


        this.state = {
            userInfo:{},
            sexlist:['保密','男','女'],
            sex_idx:0,
            datetime: '2020-01-01',
            mobile:'',
            id: '',
            province: '',
            city: '',
            district: '',
        };

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

        this._editHead = this._editHead.bind(this);
        this._onSex = this._onSex.bind(this);
        this._onAds = this._onAds.bind(this);
        this._editImg = this._editImg.bind(this)
    }


    componentWillReceiveProps(nextProps){
        const {user} = nextProps;
        if (user !== this.props){
            this.setState({
                userInfo:user,
                sex_idx:user.sex,
                datetime:formatTimeStampToTime(user.birthday),
                mobile:user.mobile,
                id: user.userId,
                province: user.regionId > 0 ? user.regionName : '请选择',
            });
        }
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.user.user();
    }

    componentWillUnmount(){
        Picker.hide();
    }


    _editHead(){
        const {actions} = this.props;

        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {
                //console.info(result);
                console.log(result["android.permission.CAMERA"] ,  result["android.permission.WRITE_EXTERNAL_STORAGE"])

                if ( result["android.permission.CAMERA"] === "granted"  &&  result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {

                    this._editImg()
    
                }
    
            })
            
        } else {
            this._editImg()
        }

    }



    _editImg(){
        const {actions} = this.props;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    field:'avatar',
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {

                        actions.user.reuserinfo({
                            field:'avatar',
                            val:data,
                            resolved: (data) => {
                                actions.user.user();
                                this.refs.hud.show('头像修改成功', 1);
                                this.check()
                            },
                            rejected: (msg) => {
                                actions.user.user();
                            },
                        });

                    },
                    rejected: (msg) => {
                        actions.user.user();
                    },
                });
            }
        });
    }


    _onSex(){
        const {sexlist,sex_idx} = this.state;
        const {actions} = this.props;

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择性别',
            pickerData: sexlist,
            selectedValue: [sexlist[sex_idx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < sexlist.length; i++){
                    if (pickedValue[0] === sexlist[i]){
                        this.setState({
                            sex_idx: i,
                        });
                        actions.user.reuserinfo({
                            field:'sex',
                            val:i,
                            resolved: (data) => {
                                actions.user.user();
                                this.refs.hud.show('性别修改成功', 1);
                                this.check()
                            },
                            rejected: (msg) => {
                                actions.user.user();
                            },
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _onAds() {
        const {actions} = this.props;
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
                }, () => {
                    actions.user.bindRegion({
                        regionName: pickedValue[0],
                        resolved: (data) => {
                            actions.user.user();
                            this.refs.hud.show('绑定成功', 1);
                            this.check()
                        },
                        rejected: (msg) => {
                            actions.user.user();
                        },
                    })
                })
            },
        });

        Picker.show();
    }

    onDateChange = (time) => {
        const {actions,navigation} = this.props;
        const {datetime} = this.state;

        if (datetime === '1970-01-01') {
            this.setState({
                datetime: time,
            },()=>{
                actions.user.reuserinfo({
                    field:'birthday',
                    val:time,
                    resolved: (data) => {
                        actions.user.user();
                        this.refs.hud.show('日期修改成功', 1);
                        this.check()
                    },
                    rejected: (msg) => {
                        actions.user.user();
                    },
                });
            });
        } else {
            
            setTimeout(()=>{
                Alert.alert('编辑资料', '您修改生日次数已超过1次，为保障您的权益，如需再次修改请在帮助反馈中提出申请，我们将尽快为您处理。', [
                    {text: '确认', onPress: () => {
                        navigation.navigate('FeedBack');
                    }},
                    {text: '取消', style: 'cancel'},
                ]);
            },1000)
           
        }

    }
    check=()=>{
        request.get('/user/check/user/event')
        .then(res=>{
            if(res){
                DeviceEventEmitter.emit('inter',{integral:parseInt(res),show:true})
            }
        })
    }
    render() {
        const {userInfo,sexlist,mobile, id, province} = this.state;
        const {navigation} = this.props;

        let avatar = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/5750b2cd-58b9-47b6-938f-41b5adca8f3b.png';

        if(userInfo.avatar !== ''){
            avatar = userInfo.avatar;
        }

        return (
            <View style={styles.container}>

                <View style={[styles.p_15, styles.mt_10,styles.mb_10,styles.pl_20,styles.pr_20, styles.bg_white, styles.row, styles.jc_sb,styles.ai_ct]} >
                    <Text style={[styles.c33_label,styles.default_label, styles.fw_label]}>头像</Text>
                    <TouchableOpacity style={[styles.row,styles.ai_ct]} onPress={this._editHead}>
                        <Image source={{uri:avatar}} style={styles.header_cover}/>
                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                </View>

                <LabelBtn label={'ID'}  nav_val={''} type={id + ''} color={'#999999'}  clickPress ={''} iconType={1}/>
                <LabelBtn label={'昵称'}  nav_val={''} type={userInfo.nickname} color={'#999999'}
                    clickPress = {()=>navigation.navigate('NickName',{title:'修改昵称',type:1,nickname:`${userInfo.nickname}`})}
                />

                <TouchableOpacity style={[styles.p_15, styles.pl_20,styles.pr_20, styles.bg_white, styles.row, styles.jc_sb,styles.mb_1,styles.bd_bt]}>
                    <Text style={[styles.c33_label,styles.default_label, styles.fw_label]}>生日</Text>
                    <View style={[styles.row,styles.ai_ct]}>
                        <DatePicker
                            style={{width: 120,borderWidth:0,height:20,color:'#999999'}}
                            date={this.state.datetime}
                            mode="date"
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            showIcon={false}
                            locale="zh"
                            customStyles={{
                                dateInput: {
                                    position:'absolute',
                                    top:0,
                                    right:0,
                                    borderWidth: 0,
                                    borderStyle: 'solid',
                                    width:120,
                                    height:20,
                                    flexDirection:'row',
                                    justifyContent:'flex-end',
                                    color:'#999999',
                                    opacity:0.6
                                },
                            }}
                            onDateChange={(datetime) => { this.onDateChange(datetime);}}
                        />
                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('arrow-right1')}</Text>
                    </View>
                </TouchableOpacity>
                <LabelBtn label={'性别'}  nav_val={''} type={sexlist[userInfo.sex]} color={'#999999'} clickPress = {this._onSex} />
                <LabelBtn label={'地区'}  nav_val={''} type={province} color={'#999999'} clickPress = {this._onAds} />
                <LabelBtn label={'联系方式'}  nav_val={''} type={mobile} color={'#999999'} iconType={1} clickPress ={''} />
                <HudView ref={'hud'} />
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FAFAFA'
    },
    header_cover:{
        width:50,
        height:50,
        borderRadius:25,
    },
    bd_bt:{
        borderBottomColor:'#FAFAFA',
        borderStyle:'solid',
        borderBottomWidth:1
    }
});


export const LayoutComponent = UserInfo;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}
