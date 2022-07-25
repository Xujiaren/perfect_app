import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, PermissionsAndroid, TouchableWithoutFeedback,Platform, Keyboard } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import Picker from 'react-native-picker';

import { config, asset, theme } from '../../../config';
import HudView from '../../../component/HudView';
import Tabs from '../../../component/Tabs';
import RefreshListView, { RefreshState } from '../../../component/RefreshListView';

const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.7, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

const voptions = {
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


class FeedBack extends Component {
    static navigationOptions = {
        title: '帮助反馈',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.items = [];
        this.page = 1;
        this.totalPage = 1;
        this.catefeedback = [];
        this.state = {
            status: props.navigation.getParam('status', 0),
            catefeedback: [],
            cateName: [],
            cateId: 0,
            cateIndex: 0,
            updateidx: 0,
            updateList: ['图片', '视频'],
            picArray: [],
            imgs: [],
            videoUrl: '',
            selectstatus: 0,
            content: '',
            mobile: '',
            preview: false,
            preview_index: 0,
            images: [{ url: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/cf7ce410-2686-42d6-9a49-fb960476fd6b.jpg' }],
        };
        this._onSelect = this._onSelect.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onChangeImg = this._onChangeImg.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._preview = this._preview.bind(this);
        this.onViewImg = this.onViewImg.bind(this);
        this._onCate = this._onCate.bind(this);
        this._onupdateType = this._onupdateType.bind(this);
        this._onVideoDetele = this._onVideoDetele.bind(this)
        this._onChangeVideo = this._onChangeVideo.bind(this)

        this._editImg = this._editImg.bind(this);

        this._onFocus = this._onFocus.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const { feedback, catefeedback } = nextProps;

        if (feedback !== this.props.feedback) {
            this.items = this.items.concat(feedback.items);
            this.page = feedback.page + 1;
            this.totalPage = feedback.pages;
        }

        if (catefeedback !== this.props.catefeedback) {
            this.catefeedback = catefeedback;
            let cateName = [];
            for (let i = 0; i < catefeedback.length; i++) {
                cateName.push(catefeedback[i].categoryName);
            }

            this.setState({
                catefeedback: catefeedback,
                cateName: cateName,
                cateId: catefeedback[0].categoryId,
            });
        }

        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);

    }

    componentWillMount() {
        const { actions } = this.props;
        actions.user.catefeedback();
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillUnmount() {
        Picker.hide();
    }

    _onHeaderRefresh() {
        const { actions } = this.props;
        this.items = [];
        this.page = 0;
        this.totalPage = 1;


        actions.user.feedback(this.page);

        this.setState({ refreshState: RefreshState.HeaderRefreshing });

    }

    _onFooterRefresh() {
        const { actions } = this.props;

        if (this.page < this.totalPage) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });
            this.page = this.page + 1;

            actions.user.feedback(this.page);

        }
        else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
    }

    _renderItem(item) {
        const feedback = item.item;
        const index = item.index;

        const { catefeedback, cateName } = this.state;
        let title = '';
        for (let i = 0; i < catefeedback.length; i++) {
            if (catefeedback[i].categoryId === feedback.categoryId) {
                title = catefeedback[i].categoryName;
            }
        }


        return (
            <View style={[styles.feed_item, styles.fd_c, styles.mb_1]} >
                <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>{index + 1}.{title}</Text>
                <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>{feedback.pubTimeFt}</Text>
                <Text style={[styles.gray_label, styles.default_label, styles.mb_10, styles.mt_10]}>{feedback.content}</Text>
                {
                    feedback.galleryList.length > 0 ?
                        <View style={[styles.fd_r, styles.mb_10, styles.picbox]}>
                            {
                                feedback.galleryList.map((iitem, i) => {
                                    if (iitem.fpath == 1) {
                                        return (
                                            <TouchableOpacity key={'iitem' + i}>
                                                <Image source={{ uri: iitem.fpath + '?x-oss-process=video/snapshot,t_10000,m_fast' }} style={[styles.feed_cover, styles.mr_10]} />
                                            </TouchableOpacity>
                                        );
                                    } else {
                                        return (

                                            <TouchableOpacity onPress={() => this.onViewImg(feedback.galleryList, i)} key={'iitem' + i}>
                                                <Image source={{ uri: iitem.fpath }} style={[styles.feed_cover, styles.mr_10]} />
                                            </TouchableOpacity>
                                        );
                                    }

                                })
                            }
                        </View>
                        : null}

                {
                    feedback.reply != '' ?
                        <View style={[styles.bg_brown]}>
                            <Text style={[styles.brown_label, styles.default_label]}>回复：{feedback.reply}</Text>
                        </View>
                        : null}
            </View>
        );
    }
    _onSelect(index) {
        this.items = [];
        this.setState({
            status: index,
        }, () => {
            this._onHeaderRefresh();
        });
    }

    _onChangeImg() {
        const { actions } = this.props;
        Picker.hide();
        Keyboard.dismiss();
        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {
                console.info(result);
                // console.log(result["android.permission.CAMERA"], result["android.permission.WRITE_EXTERNAL_STORAGE"])

                if (result["android.permission.CAMERA"] === "granted" && result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {

                    this._editImg()

                }else{
                    this._editImg()
                }

            })

        } else {
            this._editImg()
        }

    }

    _editImg() {
        const { actions } = this.props;
        const { picArray } = this.state;

        ImagePicker.showImagePicker(options, (response) => {

            if (response.uri) {
                this.refs.hud.show('上传中，请稍后');
                actions.site.upload({
                    file: 'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        picArray.push(data);
                        this.setState({
                            picArray: picArray,
                        });
                        this.refs.hud.hide();
                    },
                    rejected: (msg) => {
                    },
                });
            }
        });
    }

    _onDetele(index) {
        const { picArray } = this.state;
        picArray.splice(index, 1);

        this.setState({
            picArray: picArray,
        });
    }

    _onSubmit() {
        const { actions } = this.props;
        const { cateId, mobile, content, picArray, videoUrl } = this.state;
        var picStr = picArray.join(',');

        let volid = true;
        let msg = '反馈成功';
        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号

        let cont = content.toString().trim();

        if (cont.length == '') {

            volid = false;
            msg = '请填写反馈内容';

        } else if (cont.length < 10) {

            volid = false;
            msg = '反馈内容须大于10个字符';

        } else if (!pattern.test(mobile)) {
            volid = false;
            msg = '请填写正确的手机号';
        }

        if (volid) {
            actions.user.pushfeedback({
                category_id: cateId,
                content: content,
                gallery: picStr,
                mobile: mobile,
                videos: videoUrl,
                resolved: (data) => {
                    this.items = [];
                    this.refs.hud.show(msg, 1);
                    this.setState({
                        content: '',
                        picArray: [],
                        mobile: '',
                        status: 1,
                    }, () => {
                        this._onHeaderRefresh();
                    });
                },
                rejected: (res) => {
                    this.refs.hud.show('反馈失败', 2);
                },
            });
        } else {
            this.refs.hud.show(msg, 2);
        }


    }

    _preview(index) {

        let images = [];
        const p_image = this.state.picArray;

        p_image.map((img, i) => {
            let goodimg = '';
            goodimg = img;
            images.push({
                url: goodimg,
            });
        });

        this.setState({
            preview: true,
            preview_index: index,
            images: images,
        });
    }

    onViewImg(galleryList, index) {

        let images = [];
        let galleryArr = [];
        for (let i = 0; i < galleryList.length; i++) {
            galleryArr.push(galleryList[i].fpath);
        }
        galleryArr.map((img, i) => {
            let goodimg = '';
            goodimg = img;
            images.push({
                url: goodimg,
            });
        });
        this.setState({
            preview: true,
            preview_index: index,
            images: images,
        });
    }

    _onCate() {
        const { catefeedback, cateIndex, cateName } = this.state;
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '问题类型',
            pickerData: cateName,
            selectedValue: [cateName[cateIndex]],
            onPickerConfirm: pickedValue => {

                for (let i = 0; i < catefeedback.length; i++) {
                    if (pickedValue[0] === catefeedback[i].categoryName) {
                        this.setState({
                            cateId: catefeedback[i].categoryId,
                            cateIndex: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _onupdateType() {
        const { updateList, updateidx } = this.state
        Keyboard.dismiss();
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '上传方式',
            pickerData: updateList,
            selectedValue: [updateList[updateidx]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < updateList.length; i++) {
                    if (pickedValue[0] === updateList[i]) {
                        this.setState({
                            updateidx: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }

    _onVideoDetele() {
        this.setState({
            videoUrl: '',
        })
    }

    _onChangeVideo() {
        const { actions } = this.props
        ImagePicker.showImagePicker(voptions, (response) => {

            if (response.uri) {
                console.log(response)

                // this.refs.hud.show('上传中，请稍后');

                // actions.site.oss({
                //     resolved: (oss) => {
                //         console.info(oss)

                //         const filename = new Date().getTime() + response.uri.slice(-4);
                //         const key = oss.dir + filename;
                //         console.info(key)

                //         const uploadMediaData = new FormData();
                //         uploadMediaData.append('OSSAccessKeyId', oss.accessid);
                //         uploadMediaData.append('policy', oss.policy);
                //         uploadMediaData.append('Signature', oss.signature);
                //         uploadMediaData.append('key', key);
                //         uploadMediaData.append('success_action_status', '201');
                //         uploadMediaData.append('file', {
                //             uri:  response.uri,
                //             type: 'multipart/form-data',
                //             name: filename,
                //         });

                //         //console.info(uploadMediaData);

                //         fetch(oss.host, {
                //             method: 'POST',
                //             body: uploadMediaData,
                //             extra:null,
                //         }).then(res => {
                //             this.refs.hud.hide();
                //             videoUrl = oss.host + "/" + key;
                //             console.info(videoUrl)
                //             this.setState({
                //                 videoUrl: videoUrl,
                //             },()=>{
                //                 console.log(this.state.videoUrl,'??????')
                //             })
                //         }).catch(err => {
                //             this.refs.hud.hide();
                //             this.refs.hud.show('上传失败');
                //         })
                //     },
                //     rejected: (msg) => {
                //         this.refs.hud.hide();
                //         this.refs.hud.show('上传失败');
                //     }
                // });
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
                                            videoUrl: showUrl,
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

                                fetch(post.host, {
                                    method: 'POST',
                                    body: formData,
                                    extra: null
                                }).then((response) => {
                                    this.refs.hud.hide();
                                    return response.json()
                                }).then((data2) => {
                                    console.log(data2)
                                    let showUrl = post.host + '/' + aliyunFileKey
                                    this.setState({
                                        videoUrl: showUrl,
                                    })
                                    this.refs.hud.hide();

                                })
                               
                            }
                        })

                }
            }
        })
    }

    _onFocus() {
        Picker.hide();
    }

    _keyExtractor(item, index) {
        return index + '';
    }

    render() {
        const { status, content, mobile, picArray, preview, preview_index, images, cateIndex, updateidx, updateList, videoUrl } = this.state;

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={[styles.headbox]}>
                        <View style={[styles.atabs, styles.pl_30, styles.pr_30, styles.bg_white]}>
                            <Tabs items={['填写问题', '我的反馈']} selected={status} onSelect={this._onSelect} />
                        </View>
                    </View>

                    {
                        status === 0 ?
                            <View style={[styles.pt_50]}>
                                <View style={[styles.pt_10, styles.bg_white]}>
                                    <View style={[styles.from_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pb_15, styles.pl_30, styles.pr_20, styles.border_bt]}>
                                        <Text style={[styles.c33_label, styles.lg15_label, styles.fw_label]}>问题类型<Text style={[styles.default_label, styles.tip_label]}>(必选)</Text></Text>
                                        <TouchableOpacity style={[styles.fd_r, styles.row, styles.ai_ct]} onPress={this._onCate}>
                                            {
                                                this.catefeedback[0] !== undefined ?
                                                    <Text style={[styles.default_label, styles.tip_label]}>{this.catefeedback[cateIndex].categoryName}</Text>
                                                    :
                                                    <Text style={[styles.default_label, styles.tip_label]}></Text>
                                            }
                                            <Image source={asset.arrow_right} style={[styles.icon_right, styles.mt_2, styles.ml_5]} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.fd_c, styles.pt_15, styles.pb_15, styles.pl_30, styles.pr_20, styles.mt_1]}>
                                        <Text style={[styles.c33_label, styles.lg15_label, styles.fw_label]}>问题描述<Text style={[styles.default_label, styles.tip_label]}>(必填)</Text></Text>
                                        <TextInput
                                            refs={'TextInput(content)'}
                                            style={styles.textinput}
                                            placeholder={'留下您的宝贵意见或建议'}
                                            placeholderTextColor={'#999999'}
                                            underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                            multiline={true}
                                            value={content}
                                            onChangeText={(text) => { this.setState({ content: text }); }}
                                            onFocus={this._onFocus}
                                        />
                                    </View>


                                    <View style={[styles.from_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pb_15, styles.mb_10, styles.pl_30, styles.pr_20, styles.border_bt]}>
                                        <Text style={[styles.c33_label, styles.lg15_label, styles.fw_label]}>上传方式</Text>
                                        <TouchableOpacity style={[styles.fd_r, styles.row, styles.ai_ct]} onPress={this._onupdateType}>
                                            <Text style={[styles.default_label, styles.tip_label]}>{updateList[updateidx]}</Text>
                                            <Image source={asset.arrow_right} style={[styles.icon_right, styles.mt_2, styles.ml_5]} />
                                        </TouchableOpacity>
                                    </View>

                                    {
                                        updateidx === 1 ?
                                            <View style={[styles.from_item, styles.fd_r, styles.pb_15, styles.bg_white, styles.mb_10, styles.pl_30, styles.pr_20]}>
                                                <View style={[styles.from_imgs]}>
                                                    {
                                                        videoUrl.length > 0 ?
                                                            <View style={[styles.commt_vid, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.mb_10, styles.mt_15]} >
                                                                <Video
                                                                    ref={e => { this.player = e; }}
                                                                    source={{ uri: videoUrl }}
                                                                    // src={videoUrl}
                                                                    style={[styles.commt_video]}
                                                                    id='video'
                                                                />
                                                                <TouchableOpacity
                                                                    style={[styles.commt_video_remove]}
                                                                    onPress={this._onVideoDetele}
                                                                >
                                                                    <Image source={asset.i_dete} style={[styles.commt_vid_tip]} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            :
                                                            <TouchableOpacity style={[styles.commt_vid, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.mb_10, styles.mt_15]}
                                                                onPress={this._onChangeVideo}
                                                            >
                                                                <Image source={asset.video_icon} style={[styles.commt_vid_covers]} />
                                                            </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                            :
                                            <View style={[styles.from_item, styles.fd_r, styles.pb_15, styles.bg_white, styles.mb_10, styles.pl_30, styles.pr_20]}>
                                                <View style={[styles.from_img]}>
                                                    {
                                                        picArray.map((fditem, index) => {
                                                            return (
                                                                <View style={[styles.commt_img, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mr_15, styles.mb_10]} key={index} >
                                                                    <TouchableOpacity onPress={() => this._preview(index)}>
                                                                        <Image source={{ uri: fditem }} style={[styles.commt_img_cover]} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => this._onDetele(index)} style={styles.commt_tip_cover}>
                                                                        <Image source={asset.i_dete} style={[styles.commt_tip]} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            );
                                                        })
                                                    }
                                                    {
                                                        picArray.length > 3 ?
                                                            null
                                                            :
                                                            <TouchableOpacity style={[styles.commt_imgs, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mb_10]}
                                                                onPress={this._onChangeImg}
                                                            >
                                                                <Image source={asset.add} style={[styles.commt_img_covers]} />
                                                            </TouchableOpacity >
                                                    }
                                                </View>
                                            </View>
                                    }

                                    <View style={[styles.from_item, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pb_15, styles.pt_15, styles.border_bt, styles.border_tp, styles.pl_30, styles.pr_30]}>
                                        <Text style={[styles.c33_label, styles.lg15_label, styles.fw_label]}>联系方式</Text>
                                        <TextInput style={[styles.input, styles.default_label, styles.tip_label]}
                                            refs={'mobile'}
                                            clearButtonMode={'never'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            secureTextEntry={false}
                                            placeholder={'请填写手机号'}
                                            onChangeText={(text) => { this.setState({ mobile: text }); }}
                                            onFocus={this._onFocus}
                                            value={mobile}
                                        />
                                    </View>
                                    <View style={[styles.pt_15, styles.pb_15, styles.pl_30]}>
                                        <Text style={[styles.sm_label, styles.gray_label]}>联系我们：邮箱 help@perfect99.com</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.m_20, styles.btn, styles.pt_10, styles.pb_10]} onPress={this._onSubmit}>
                                    <Text style={[styles.white_label]}>提交</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={[styles.pt_50]}>
                                <RefreshListView
                                    showsVerticalScrollIndicator={false}
                                    data={this.items}
                                    exdata={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItem}
                                    refreshState={this.state.refreshState}
                                    onHeaderRefresh={this._onHeaderRefresh}
                                    onFooterRefresh={this._onFooterRefresh}
                                />
                            </View>
                    }
                    <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                        <ImageViewer imageUrls={images} index={preview_index} onClick={() => {
                            this.setState({
                                preview: false,
                            });
                        }} />
                    </Modal>
                    <HudView ref={'hud'} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    headbox: {
        width: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: '#ffffff',
        zIndex: 999,
    },
    icon_right: {
        width: 6,
        height: 11,
        marginLeft: 5,
    },
    feed_item: {
        backgroundColor: '#ffffff',
        paddingLeft: 40,
        paddingRight: 35,
        paddingBottom: 20,
        paddingTop: 20,
    },
    picbox: {
        flexWrap: 'wrap',
    },
    feed_cover: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    bg_brown: {
        backgroundColor: '#f4f4f4',
        borderRadius: 5,
        paddingLeft: 10,
        lineHeight: 19,
        paddingTop: 10,
        paddingBottom: 10,
    },
    textinput: {
        width: theme.window.width - 60,
        height: 110,
        backgroundColor: '#F5F5F5',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingVertical: 0,
        textAlignVertical: 'top',
        marginTop: 15,
    },
    input: {
        textAlign: 'right',
        flex: 1,
        paddingLeft: 15,
        paddingVertical: 0,
    },
    from_img: {
        flexDirection: 'row',
    },
    commt_img: {
        width: 50,
        height: 50,
        position: 'relative',
    },
    commt_img_cover: {
        width: 50,
        height: 50,
    },
    commt_tip_cover: {
        position: 'absolute',
        top: -5,
        right: -5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff',
        borderRadius: 6,
    },
    commt_tip: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    commt_imgs: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderStyle: 'solid',
    },
    commt_img_covers: {
        width: 25,
        height: 25,
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#F4623F',
        borderRadius: 5,
        marginTop: 36,
    },

    commt_vid: {
        width: 248,
        height: 148,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderStyle: 'solid',
        position: 'relative',
        flexShrink: 0,
        borderRadius: 5,
    },
    commt_video: {
        width: 248,
        height: 148,
    },
    commt_vid_covers: {
        width: 40,
        height: 40
    },
    commt_video_remove: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    commt_vid_tip: {
        width: 24,
        height: 24,
        borderRadius: 12
    }

});


export const LayoutComponent = FeedBack;

export function mapStateToProps(state) {
    return {
        feedback: state.user.feedback,
        catefeedback: state.user.catefeedback,
        sign: state.site.sign
    };
}
