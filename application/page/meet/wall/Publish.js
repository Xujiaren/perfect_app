//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity,TextInput,Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import HudView from '../../../component/HudView';

import theme from '../../../config/theme'
import asset from '../../../config/asset'

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

class Publish extends Component {

    static navigationOptions = {
        title:'发布心情',
        headerRight: <View/>,
    };

    state = {
        content: '',
        pics: [],
        videos: [],
    }

    onUpload = () => {
        const {actions} = this.props;
        let pics = this.state.pics;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        pics.push(data);
                        this.setState({
                            pics: pics,
                        });
					},
					rejected: (msg) => {
					},
                });
            }
        });
    }

    onDetele = (index) => {
        let pics = this.state.pics;
        pics.splice(index, 1);

        this.setState({
            pics: pics,
        });
    }

    onPublish = () => {
        const {actions, navigation} = this.props
        const {content, pics, videos} = this.state

        actions.meet.publishWall({
            content: content,
            pics: pics,
            videos: videos,
            resolved: (data) => {
                this.refs.hud.show('发布成功', 1, () => {
                    navigation.goBack()
                });
            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败，请联系工作人员', 1);
            },
        })
    }

    render() {
        const {content, pics} = this.state

        const enable = content.length >= 5;

        return (
            <View style={styles.container}>
                <View style={[styles.p_15]}>
                    <TextInput
                        style={[styles.textinput, styles.bg_f7f, styles.circle_10, styles.p_5]}
                        placeholder={'想说些什么'}
                        placeholderTextColor={'#999999'}
                        underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                        multiline={true}
                        value={content}
                        onChangeText={(text) => {this.setState({content:text});}}
                    />
                    <View style={[styles.row, styles.f_wrap]}>
                        {pics.map((pic, index) => {
                            return (
                                <View key={'pic_' + index} style={[styles.mt_10, styles.mr_10]}>
                                    <Image source={{uri: pic}} style={[styles.thumb]}/>
                                    <TouchableOpacity onPress={()=>this.onDetele(index)} style={styles.delete}>
                                        <Image source={asset.i_dete} style={[styles.delete_icon]} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                        <TouchableOpacity style={[styles.mt_10]} onPress={this.onUpload}>
                            <Image source={asset.upload_Img} style={[styles.thumb]}/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.p_10, styles.bg_sred, styles.ai_ct, styles.circle_10, styles.mt_20, !enable && styles.disabledContainer]} disabled={!enable} onPress={this.onPublish}>
                        <Text style={[styles.white_label]}>发布</Text>
                    </TouchableOpacity>
                </View>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    textinput:{
        width:theme.window.width - 30,
		height:160,
        textAlignVertical:'top',
    },
    thumb: {
        width: (theme.window.width - 60) / 3,
        height: (theme.window.width - 60) / 3,
    },
    delete: {
        position:'absolute',
        top:-5,
        right:-5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#ffffff',
        borderRadius:6,
    },
    delete_icon: {
        width: 12,
        height: 12,
    }
});

export const LayoutComponent = Publish;

export function mapStateToProps(state) {
	return {
        
	};
}