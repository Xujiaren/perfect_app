import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Modal,PermissionsAndroid ,TouchableWithoutFeedback, Keyboard} from 'react-native';

import _ from 'lodash';
import Picker from 'react-native-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import HudView from '../../component/HudView';
import LabelBtn from '../../component/LabelBtn';

import { asset, theme } from '../../config';

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
    quality: 0.4, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class AskQust extends Component {

    static navigationOptions = {
        title: '提问',
        headerRight: <View />,
    };
    ask = this.props.navigation.getParam('ask', { askId: 0, title: '' })
    state = {
        tap_idx: 0,
        title: '',
        content: '',

        picArray: [],
        integral: 0,

        preview: false,
        preview_index: 0,
        preview_imgs: [],
        ask_id:0
    }

    category = []
    cnames = []
    listDataCopy =[]
    list=[]
    componentDidMount() {
        const { actions } = this.props
        actions.ask.category()
        if(this.ask.askId!==0){
            let lst = []
            if(this.ask.gallery.length>0){
                this.ask.gallery.map(item=>{
                    lst.push(item.fpath)
                })
            }
            this.setState({
                ask_id:this.ask.askId,
                title:this.ask.title,
                content:this.ask.content,
                integral:this.ask.integral,
                picArray:lst
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { category, similar } = nextProps

        if (category !== this.props.category) {
            this.category = category

            let cnames = []
            category.map((c, index) => {
                cnames.push(c.categoryName)
            })

            this.cnames = cnames
        }
        if (similar !== this.props.similar) {
           this.list=similar
           this.listDataCopy=similar
        }
    }

    _onChangeImg = () => {
        const { actions } = this.props;

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

    _editImg = () => {
        const { actions } = this.props;

        let picArray = this.state.picArray;

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
    }
    _askSimilar = (text) => {
        this.setState({ 
            title: text
         },()=>{
            if (this.state.title !== '') {
                this.props.actions.ask.similar(this.state.title)
            }else{
                this.listDataCopy=[]
                this.list=[]
            }
         })
    }


    _onDetele = (index) => {
        const { picArray } = this.state;
        picArray.splice(index, 1);

        this.setState({
            picArray: picArray,
        });
    }

    _preview = (index) => {

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
            preview_imgs: images,
        });
    }


    _onTag = () => {
        const { tap_idx } = this.state;

        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择标签',
            pickerData: this.cnames,
            selectedValue: [this.cnames[tap_idx]],
            onPickerConfirm: pickedValue => {

                for (let i = 0; i < this.cnames.length; i++) {
                    if (pickedValue[0] === this.cnames[i]) {
                        this.setState({
                            tap_idx: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }


    _onSubmit = () => {
        const { navigation, actions } = this.props
        const { tap_idx, title, content, picArray, integral,ask_id } = this.state;

        this.refs.hud.show('...');

        actions.ask.publish({
            ask_id:ask_id,
            category_id: this.category[tap_idx].categoryId,
            title: title,
            content: content,
            integral: integral,
            pics: picArray.join(","),
            videos: '',
            is_delete: 0,
            resolved: (data) => {
                this.refs.hud.show('提交成功，请耐心等待审核', 1, () => {
                    navigation.goBack()
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('发布失败，请联系工作人员', 1);
            }
        })
    }


    _relaList() {
        return (
            <View style={[styles.fd_c, styles.pt_10, styles.pb_10]}>
                <Text style={[styles.c33_label, styles.default_label]} numberOfLines={2}>十几岁的小女孩子喝什么吃什么才能长的快长的高长的结实？</Text>
                <Text style={[styles.tip_label, styles.sm_label, styles.mt_5]}>1个回答 · 2个关注</Text>
            </View>
        )
    }


    render() {
        const { user } = this.props;
        const { tap_idx, title, content, picArray, integral, preview, preview_index, preview_imgs } = this.state;

        const enable = title.length > 0 && content.length > 0 && user.integral >= integral;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={styles.container}>
                <ScrollView>
                    <View style={[styles.mt_8, styles.mb_8]}>
                        <LabelBtn label={'选择标签'} nav_val={''} type={this.cnames[tap_idx] ? this.cnames[tap_idx] : '请选择'} color={'#999999'} clickPress={this._onTag} />
                    </View>
                    <View style={[styles.pt_15, styles.pb_15, styles.pl_20, styles.bg_white, styles.mt_10, styles.bor_bt]}>
                        <TextInput
                            style={styles.input}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            placeholder={'请输入一个完整的问题'}
                            onChangeText={(text) => { this._askSimilar(text) }}
                            value={title}
                        />
                    </View>
                    <View style={[styles.bg_white, styles.border_bt]}>
                        <TextInput
                            style={styles.textinput}
                            placeholder={'补充问题背景，条件等详细信息'}
                            placeholderTextColor={'#999999'}
                            underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                            multiline={true}
                            value={content}
                            onChangeText={(text) => { this.setState({ content: text }); }}
                        />
                    </View>
                    <View style={[styles.from_item, styles.fd_r, styles.pb_15, styles.pt_15, styles.bg_white, styles.pl_30, styles.pr_20]}>
                        <View style={[styles.from_img]}>
                            {
                                picArray.map((fditem, index) => {
                                    return (
                                        <View style={[styles.commt_img, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mr_15]} key={index} >
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
                                    <TouchableOpacity style={[styles.commt_imgs]}
                                        onPress={this._onChangeImg}
                                    >
                                        <Image source={asset.upload_Img} style={[styles.commt_img_covers]} />
                                        <Text style={[styles.tip_label, styles.smm_label, styles.mt_5]}>添加图片</Text>
                                    </TouchableOpacity >
                            }
                        </View>
                    </View>

                    <View style={[styles.fd_r, styles.jc_sb, styles.pl_20, styles.pr_20, styles.pt_15, styles.pb_15, styles.mt_10, styles.bg_white]}>
                        <Text style={[styles.c33_label, styles.lg_label, styles.fw_label]}>悬赏
                            {parseInt(integral) > user.integral ?
                                <Text style={[styles.sred_label, styles.sm_label]}>（学分不足）</Text>
                                :
                                <Text style={[styles.gray_label, styles.sm_label]}>（可用学分{user.integral}）</Text>
                            }
                        </Text>
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <TextInput
                                style={styles.x_input}
                                clearButtonMode={'never'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                placeholder={'0'}
                                keyboardType={'phone-pad'}
                                onChangeText={(text) => { this.setState({ integral: text }); }}
                                value={integral}
                            />
                            <Text style={[styles.default_label, styles.gray_label, styles.pl_10]}>学分</Text>
                        </View>

                    </View>
                    <View style={[styles.fd_c, styles.pl_20, styles.pr_20, styles.mt_10, styles.list]}>
                        {this.listDataCopy.length > 0 ? <Text style={[styles.c33_label, styles.fw_label, styles.default_label]}>相似问题</Text> : null}
                        {this.listDataCopy.length > 0  && this.listDataCopy.map((item, index) => {
                            return (
                                <TouchableOpacity onPress={()=>{
                                    this.props.navigation.navigate('Question', { ask: item })
                                }}>
                                    <View style={[styles.fd_c, styles.pt_10, styles.pb_10, styles.list_bt]}>
                                        <View style={[styles.row]}>
                                            {item.title.split('').map((val, idx) => {
                                                let ok = val===title;
                                                if(title.length>0){
                                                    title.split('').map(item=>{
                                                        if(val === item){
                                                            ok = val===item
                                                        }
                                                    })
                                                }
                                                return (
                                                    <Text style={[styles.default_label, styles.fw_label, ok ? styles.sred_label : styles.c33_label]}>{val}</Text>
                                                )
                                            })}
                                        </View>
                                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>{item.replyNum}个回答 · {item.followNum}个关注</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <TouchableOpacity style={[styles.pub_btn, !enable && styles.disabledContainer]} disabled={!enable} onPress={this._onSubmit}>
                        <Text style={[styles.fw_label, styles.lg_label, styles.white_label]}>发布问题</Text>
                    </TouchableOpacity>
                </ScrollView>

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
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    textinput: {
        width: theme.window.width,
        height: 160,
        backgroundColor: '#ffffff',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingVertical: 0,
        textAlignVertical: 'top',
        marginTop: 10,
        borderRadius: 5,
        paddingVertical: 0,
        paddingVertical: 0,
    },
    bor_bt: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F2F6FC',
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
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderStyle: 'solid',
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commt_img_covers: {
        width: 18,
        height: 18,
    },
    x_input: {
        width: 100,
        textAlign: 'right',
        paddingVertical: 0,
    },
    pub_btn: {
        margin: 25,
        marginTop: 50,
        height: 44,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4623F',
    },
    list: {
        backgroundColor: '#FAFAFA'
    },
    list_bt: {
        borderColor: '#EDEEF0',
        borderStyle: 'solid',
        borderBottomWidth: 1
    },
    input:{
        paddingVertical: 0,
    }
});

export const LayoutComponent = AskQust;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        category: state.ask.category,
        similar: state.ask.similar,
    };
}
