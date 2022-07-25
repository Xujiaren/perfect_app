import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Modal, TextInput, Platform, PermissionsAndroid, Keyboard, Alert, TouchableWithoutFeedback } from 'react-native'
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';

import HudView from '../../component/HudView';
import SyanImagePicker from 'react-native-syan-image-picker';
import { config, asset, theme } from '../../config';

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

const options1 = {
    title: '上传视频',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '录像',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'video', // 'photo' or 'video'
    maxWidth: 1280, // photos only
    maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.5, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: true, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class ActivitySignUp extends Component {


    static navigationOptions = {
        title: '活动报名',
        headerRight: <View />,
    };


    constructor(props) {
        super(props);

        const { navigation } = props;
        this.activityId = navigation.getParam('activityId', 0);
        this.ctype = navigation.getParam('ctype', 16);
        this.signendTime = navigation.getParam('signendTime', 0);
        this.beginTime = navigation.getParam('beginTime', 0);



        this.state = {
            userId: 0,
            activityId: 0,

            user_name: '',
            mobile: '',
            work_title: '',
            work_intro: '',
            work_url: '',
            w_videoUrl: '',
            ctype: this.ctype,   // 16 视频  17 图片
            type: false,
            picArray: [],
            preview: false,
            preview_imgs: [],
            preview_index: 0,
            uploadProgress: 0, //进度条
            pic_list:[],
        }

        this._onSubmit = this._onSubmit.bind(this);
        this._onViewImgs = this._onViewImgs.bind(this);
        this._onDetele = this._onDetele.bind(this);
        this._onVideoDetele = this._onVideoDetele.bind(this);
        this._onChangeImg = this._onChangeImg.bind(this);
        this._onChangeVideo = this._onChangeVideo.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { actions } = this.props;
        actions.user.user();
    }

    componentWillUnmount() {

    }


    // 查看上传的图片
    _onViewImgs(galleryList, index) {

        let urls = new Array();
        for (let i = 0; i < galleryList.length; i++) {
            urls.push({
                url: galleryList[i],
            });
        }

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: urls,
        });

    }


    // 删除上传图片
    _onDetele(index) {
        let { picArray } = this.state;
        picArray.splice(index, 1);

        this.setState({
            picArray: picArray
        })
    }

    // 删除上传视频
    _onVideoDetele() {
        this.setState({
            w_videoUrl: ''
        })
    }

    // 判断是否有权限
    _onChangeImg() {

        if (Platform.OS === 'android') {
            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {
                //console.info(result);
                console.log(result["android.permission.CAMERA"], result["android.permission.WRITE_EXTERNAL_STORAGE"])

                if (result["android.permission.CAMERA"] === "granted" && result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {

                    this._editImg()
                }
            })

        } else {
            this._editImg()
        }

    }

    _onChangeVideo() {
        const { actions } = this.props;
        ImagePicker.showImagePicker(options1, (response) => {

            if (!response.didCancel) {
                // ios
                if (Platform.OS === 'ios') {

                    if (response.uri) {
                        let fileName = response.origURL.split("id")[response.origURL.split("id").length - 1];
                        let type = response.fileName.split(".")[response.fileName.split(".").length - 1];

                        fetch(config.api + '/site/getSign')
                            .then((response) => {
                                return response.json()
                            }).then((data) => {

                                if (Object.keys(data).length > 0) {

                                    let post = data
                                    const aliyunFileKey = post.dir + fileName + '.' + type;

                                    const formData = new FormData()
                                    formData.append('key', aliyunFileKey)
                                    formData.append('OSSAccessKeyId', post.accessid)
                                    formData.append('policy', post.policy)
                                    formData.append('signature', post.signature)
                                    formData.append('expire', post.expire)
                                    formData.append('callback', post.callback)
                                    formData.append('success_action_status', '201')
                                    formData.append('file', {
                                        uri: response.uri,
                                        type: 'multipart/form-data',
                                        name: response.fileName
                                    })


                                    console.log(formData, 'formData');
                                    console.log(post.host, 'post.host');

                                    fetch(post.host, {
                                        method: 'POST',
                                        body: formData,
                                        extra: null
                                    }).then((response) => {
                                        return response.json()
                                    }).then((data2) => {
                                        console.log(data2)
                                        let showUrl = post.host + '/' + aliyunFileKey
                                        this.setState({
                                            w_videoUrl: showUrl
                                        })

                                    })


                                }
                            })
                    }
                } else { // android 

                    console.log(response, 'response');

                    let path = response.path.split('Camera/')[response.path.split('Camera/').length - 1];
                    let fileName = path.split('.')[0];
                    let type = response.path.split(".")[response.path.split(".").length - 1];

                    fetch(config.api + '/site/getSign')
                        .then((response) => {
                            return response.json()
                        }).then((data) => {
                            if (Object.keys(data).length > 0) {
                                this.refs.hud.show('上传中，请稍后');
                                let post = data
                                const aliyunFileKey = post.dir + fileName + '.' + type;

                                const formData = new FormData()

                                formData.append('key', aliyunFileKey)
                                formData.append('OSSAccessKeyId', post.accessid)
                                formData.append('policy', post.policy)
                                formData.append('signature', post.signature)
                                formData.append('expire', post.expire)
                                formData.append('callback', post.callback)
                                formData.append('success_action_status', '201')
                                formData.append('file', {
                                    "uri": response.uri,
                                    "type": 'multipart/form-data',
                                    "name": response.fileName,
                                })

                                // fetch(config.api + '/user',{
                                //     method:'POST',
                                //     headers: {
                                //         "Accept": "application/json",
                                //         "Content-Type": 'application/json',   
                                //         "Connection": "close",   
                                //     },
                                //     body:JSON.stringify({
                                //         "field":"field",
                                //         "val":"nickname"
                                //     }),
                                // }).then((response)=>{
                                //     return response.json();
                                // }).then((data2)=>{
                                //     console.log(data2);
                                // }).catch((error)=>{
                                //     console.log(JSON.stringify(error),error);
                                // })

                                fetch(post.host, {
                                    method: 'POST',
                                    body: formData,
                                    extra: null,
                                    // headers: {
                                    //     "Accept": "application/json",
                                    //     'Content-Type': 'multipart/form-data;charset=utf-8',
                                    //     "Connection": "close",   
                                    // },
                                }).then((response) => {
                                    // console.log(response.json(),'response');
                                    this.refs.hud.hide();
                                    return response.json();
                                }).then((data2) => {

                                    console.log(data2, 'data2');
                                    let showUrl = post.host + '/' + aliyunFileKey;
                                    // console.log(showUrl)
                                    this.setState({
                                        w_videoUrl: showUrl
                                    })
                                    this.refs.hud.hide();

                                }).catch(function (error) {
                                    console.log(error);
                                    Alert.alert('dhc', 'dcjdksj')
                                    this.refs.hud.hide();
                                })
                            }
                        })

                }
            }

        })
    }

    // 上传图片
    _editImg() {
        const { actions } = this.props;
        const { picArray } = this.state;
        const optionss = {
            imageCount:5-picArray.length,
            isRecordSelected:false,
            isCamera:true,
            isCrop:false,
            isGif:false,
            enableBase64:true,
        }
        if(Platform.OS === 'ios'){
            ImagePicker.showImagePicker(options, (response) => {
                if (response.uri) {
                    actions.site.upload({
                        file: 'data:image/jpeg;base64,' + response.data,
                        resolved: (data) => {
                            picArray.push(data);
                            this.setState({
                                picArray: picArray,
                            });
                        },
                        rejected: (msg) => {
                        },
                    });
                }
            });
        }else{
            SyanImagePicker.asyncShowImagePicker(optionss)
            .then(photos => {
              // 选择成功
              this.refs.hud.show('上传中，请稍后');
              photos.map((item,index)=>{
                  console.log(item)
                actions.site.upload({
                    file: item.base64,
                    resolved: (data) => {
                        picArray.push(data);
                        this.setState({
                            picArray: picArray,
                        });
                        if(index == photos.length-1 ){
                            this.refs.hud.hide();
                        }
                    },
                    rejected: (msg) => {
                    },
                });
              })
            })
            .catch(err => {
              // 取消选择，err.message为"取消"
            })
        }
    }


    // 作品提交
    _onSubmit() {
        const { actions, navigation } = this.props;
        const { user_name, user_mobile, work_title, work_intro, w_videoUrl, ctype, picArray ,pic_list} = this.state;

        let picStr = picArray.join(",");
        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        let isPush = true;
        let tip = '';


        var nowTime = new Date();
        let newtime = nowTime.getTime();

        console.log(newtime, 'newtime', this.signendTime, this.beginTime)

        if (!(newtime < this.signendTime * 1000 && newtime > this.beginTime * 1000)) {
            isPush = false;
            tip = '时间已截止';
        } else if (user_name == '') {
            isPush = false;
            tip = '姓名不能为空';
        } else if (!pattern.test(user_mobile)) {
            isPush = false;
            tip = '请填写正确的手机号';
        } else if (work_title == '') {
            isPush = false;
            tip = '请输入作品名称';
        } else if (work_intro == '') {
            isPush = false;
            tip = '请输入作品描述';
        } else {
            if (ctype === 16) {
                if (w_videoUrl.length === 0 || w_videoUrl === undefined) {
                    isPush = false;
                    tip = '请上传作品描述';
                }
            }

            if (ctype === 17) {
                if (picStr == '') {
                    isPush = false;
                    tip = '请上传作品描述';
                }
            }
        }

        if (isPush) {
            actions.activity.activityJoin({
                activity_id: this.activityId,
                user_name: user_name,
                mobile: user_mobile,
                work_name: work_title,
                work_intro: work_intro,
                work_url: ctype === 16 ? w_videoUrl : picStr,
                resolved: (data) => {

                    this.refs.hud.show('提交成功,请等待审核。', 2);

                    setTimeout(() => {
                        navigation.goBack();
                    }, 2000);

                },
                rejected: (msg) => {
                },
            })
        } else {

            this.refs.hud.show(tip, 1);
        }
        


    }



    render() {

        const { user_name, user_mobile, work_title, work_intro, work_url, ctype, picArray, preview, preview_imgs, preview_index, w_videoUrl, uploadProgress,pic_list } = this.state;


        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={[styles.container]}>
                    <View style={[styles.from]}>
                        <View style={[styles.form_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]}>
                            <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>姓名</Text>
                            <TextInput
                                style={[styles.input, styles.default_label, styles.c33_label, styles.col_1]}
                                clearButtonMode={'never'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                placeholderTextColor={'#999999'}
                                autoCapitalize={'none'}
                                placeholder={'请填写姓名'}
                                onChangeText={(text) => { this.setState({ user_name: text }); }}
                                value={user_name}
                            />
                        </View>
                        <View style={[styles.form_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]}>
                            <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>联系方式</Text>
                            <TextInput
                                style={[styles.input, styles.default_label, styles.c33_label, styles.col_1]}
                                clearButtonMode={'never'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                maxLength={11}
                                autoCapitalize={'none'}
                                placeholder={'请填写手机号'}
                                placeholderTextColor={'#999999'}
                                keyboardType={'phone-pad'}
                                onChangeText={(text) => { this.setState({ user_mobile: text }); }}
                                value={user_mobile}
                            />
                        </View>
                        <View style={[styles.form_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]}>
                            <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>作品名称</Text>
                            <TextInput
                                style={[styles.input, styles.default_label, styles.c33_label, styles.col_1]}
                                clearButtonMode={'never'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                placeholderTextColor={'#999999'}
                                placeholder={'请填写'}
                                onChangeText={(text) => { this.setState({ work_title: text }); }}
                                value={work_title}
                            />
                        </View>
                        <View style={[styles.form_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]}>
                            <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>作品描述</Text>
                            <TextInput
                                style={styles.textinput}
                                placeholder={'请填写'}
                                placeholderTextColor={'#999999'}
                                underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                multiline={true}
                                value={work_intro}
                                onChangeText={(text) => { this.setState({ work_intro: text }); }}
                            />
                        </View>
                        <View style={[styles.commtbox, styles.fd_r, styles.fd_c, styles.pt_15, styles.pb_15, styles.bg_white, styles.mt_1, styles.mb_10]}>
                            <Text style={[styles.be_333, styles.fs_15, styles.fw_label]}>上传作品{ctype === 16 ? '(视频)' : '(图片)'}</Text>
                            {
                                ctype === 16 ?
                                    <View style={[styles.from_vids]}>
                                        {
                                            w_videoUrl.length > 0 ?
                                                <View style={[styles.commt_vids, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mb_10, styles.mt_15]}>
                                                    <Video
                                                        ref={e => { this.player = e; }}
                                                        source={{ uri: w_videoUrl }}
                                                        style={[styles.commt_video]}
                                                        posterResizeMode={'cover'}
                                                        resizeMode={'cover'}
                                                    />
                                                    <TouchableOpacity onPress={this._onVideoDetele} style={[styles.commt_tip]}
                                                    >
                                                        <Image source={asset.i_dete} style={styles.commt_tip_cover} />
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity style={[styles.commt_vids, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mb_10, styles.mt_15]}
                                                    onPress={this._onChangeVideo}
                                                >
                                                    <Image source={asset.video_icon} style={styles.commt_vid_covers} />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    :
                                    <View style={[styles.from_img, styles.fd_r, styles.mt_15]}>
                                        {
                                            picArray.map((fditem, index) => {
                                                return (
                                                    <View style={[styles.commt_img, styles.mr_10]} key={'fdItem' + index}>
                                                        <TouchableOpacity
                                                            onPress={() => this._onViewImgs(picArray, index)}
                                                        >
                                                            <Image source={{ uri: fditem }} style={[styles.commt_img_cover]}/>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this._onDetele(index)}
                                                            style={[styles.commt_tip]}
                                                        >
                                                            <Image source={asset.i_dete} style={[styles.commt_tip_cover]} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                        {
                                            picArray.length > 4 ?
                                                null :
                                                <TouchableOpacity style={[styles.commt_imgs, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mb_10]}
                                                    onPress={this._onChangeImg}
                                                >
                                                    <Image source={asset.upload_Img} style={[styles.commt_img_covers]} />
                                                </TouchableOpacity>
                                        }
                                    </View>
                            }

                        </View>
                    </View>
                    <TouchableOpacity style={[styles.makeBtn]}
                        onPress={this._onSubmit}
                    >
                        <Text style={[styles.default_label, styles.white_label]}>确定</Text>
                    </TouchableOpacity>


                    <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                        <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                            this.setState({
                                preview: false,
                            });
                        }} />
                    </Modal>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    from: {
        backgroundColor: '#ffffff',
        paddingLeft: 30,
    },
    form_item: {
        paddingBottom: 15,
        paddingTop: 15,
    },
    input: {
        textAlign: 'right',
        paddingRight: 30,
        paddingLeft: 10,
    },
    textinput: {
        textAlign: 'right',
        paddingLeft: 10,
        marginRight: 30,
        width: theme.window.width - 150,
    },
    makeBtn: {
        marginTop: 50,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: '#F4623F',
        height: 36,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    commt_img: {
        width: 50,
        height: 50,
        position: 'relative',
        flexShrink: 0,
    },
    commt_img_cover: {
        width: 50,
        height: 50,
        // borderRadius: 5,
    },
    commt_tip: {
        width: 12,
        height: 12,
        position: 'absolute',
        top: -5,
        right: -5,
    },
    commt_tip_cover: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff',
    },
    commt_imgs: {
        width: 49,
        height: 49,
        position: 'relative',
        flexShrink: 0,
        borderWidth: 1,
        borderStyle: 'dotted',
        borderColor: '#E9E9E9',
        borderRadius: 5,

    },
    commt_img_covers: {
        width: 25,
        height: 25,
    },
    commt_vids: {
        width: 248,
        height: 148,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        position: 'relative',
        flexShrink: 0,
        borderRadius: 5
    },
    commt_video: {
        width: 250,
        height: 150,
        borderRadius: 5
    },
    commt_vid_covers: {
        width: 40,
        height: 40
    }
})

export const LayoutComponent = ActivitySignUp;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}

