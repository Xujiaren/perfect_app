import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,TextInput,Image,Modal,PermissionsAndroid} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';

import HudView from '../../component/HudView';

import {asset, theme} from '../../config';

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

class WriteQust extends Component {

    static navigationOptions = ({navigation}) => {
        
        const ask = navigation.getParam('ask', {title: '写答案'});
		return {
            title: ask.title,
            headerRight: <View/>,
		}
	};

    state = {
        content:'',
        picArray:[],

        preview: false,
        preview_index: 0,
        preview_imgs: [],
    }

    ask = this.props.navigation.getParam('ask', {askId: 0})

    _onChangeImg = () => {
        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {

                if ( result["android.permission.CAMERA"] === "granted"  &&  result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {
                    this._editImg()
                }
    
            })
            
        } else {
            this._editImg()
        }

    }

    _editImg = () => {
        const {actions} = this.props;
        let picArray = this.state.picArray;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        picArray.push(data);
                        this.setState({
                            picArray:picArray,
                        });
					},
					rejected: (msg) => {
					},
                });
            }
        });
    }

    _onDetele = (index) => {
        let picArray = this.state.picArray;
        picArray.splice(index,1);

        this.setState({
            picArray:picArray,
        });
    }

    _preview = (index) => {

        let images = [];
        const p_image =  this.state.picArray;

        p_image.map((img, i) => {
            let goodimg = '';
            goodimg = img;
            images.push({
				url: goodimg,
			});
        });

        this.setState({
            preview:true,
            preview_index:index,
            preview_imgs: images,
        });
    }


    _onSubmit = () => {
        const {navigation, actions} = this.props
        const {content, picArray} = this.state;
        
        this.refs.hud.show('...');

        actions.ask.answer({
            ask_id: this.ask.askId,
            fuser_id: 0,
            content: content,
            pics: picArray.join(","),
            resolved: (data) => {
                this.refs.hud.show('提交成功，请耐心等待审核', 1, () => {
                    navigation.goBack()
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败，请联系工作人员', 1);
            }
        })
    }


    render() {
        
        const {content, picArray, preview, preview_index, preview_imgs} = this.state;
        const enable = content.length > 5;

        return (
            <View style={styles.container}>

                <View style={[styles.bg_white ,styles.pl_20,styles.border_bt]}>

                    <TextInput
                        style={styles.textinput}
                        placeholder={'请填写回答内容'}
                        placeholderTextColor={'#999999'}
                        underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                        multiline={true}
                        value={content}
                        onChangeText={(text) => {this.setState({content:text});}}
                    />

                </View>

                <View style={[styles.from_item ,styles.fd_r  ,styles.pb_15,styles.pt_15 ,styles.bg_white   ,styles.pl_30 ,styles.pr_20]}>
                    <View style={[styles.from_img]}>
                        {
                            picArray.map((fditem,index)=>{
                                return (
                                    <View style={[styles.commt_img ,styles.fd_r ,styles.ai_ct ,styles.jc_ct ,styles.mr_15 ]} key={index} >
                                        <TouchableOpacity  onPress={()=>this._preview(index)}>
                                            <Image source={{uri:fditem}} style={[styles.commt_img_cover]} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this._onDetele(index)} style={styles.commt_tip_cover}>
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
                                <Text style={[styles.tip_label,styles.smm_label,styles.mt_5]}>添加图片</Text>
                            </TouchableOpacity >
                        }
                    </View>
                </View>

                <TouchableOpacity onPress={this._onSubmit} style={[styles.submit,styles.fd_r ,styles.ai_ct ,styles.jc_ct ,styles.p_10 ,styles.circle_5, !enable && styles.disabledContainer]} disabled={!enable}>
                    <Text style={[styles.lg_label ,styles.white_label]}>提交</Text>
                </TouchableOpacity>

                <HudView ref={'hud'} />

                <Modal visible={preview} transparent={true} onRequestClose={() => {}}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>

            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    submit:{
        margin:20,
        borderRadius:5,
        backgroundColor:'#F4623F',
    },
    textinput:{
        width:theme.window.width - 40,
		height:160,
		backgroundColor: '#f7f7f7',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
		paddingVertical: 0,
        textAlignVertical:'top',
        marginTop:15,
        borderRadius:5,
        paddingVertical: 0,
    },
    from_img:{
        flexDirection:'row',
    },
    commt_img:{
        width:50,
        height:50,
        position:'relative',
    },
    commt_img_cover:{
        width:50,
        height:50,
    },
    commt_tip_cover:{
        position:'absolute',
        top:-5,
        right:-5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#ffffff',
        borderRadius:6,
    },
    commt_tip:{
        width:12,
        height:12,
        borderRadius:6,
    },
    commt_imgs:{
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderStyle:'solid',
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commt_img_covers:{
        width:25,
        height:25,
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    tip:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:310,
        height:478,
        marginLeft: -155,
        marginTop: -239,
        backgroundColor:'#ffffff',
        borderRadius:5,
        flexDirection:'column',
        justifyContent:'space-between'
    },
    layer_btns:{
        borderTopWidth: 1,
        borderStyle:'solid',
        borderTopColor: '#E5E5E5',
    },
    layer_btn:{
        flex: 1,
        height: 50,
    },
    right_border:{
        borderRightWidth: 1,
        borderStyle:'solid',
        borderRightColor: '#E5E5E5',
    },

});

export const LayoutComponent = WriteQust;

export function mapStateToProps(state) {
	return {
        coursedesc:state.home.coursedesc,
	};
}
