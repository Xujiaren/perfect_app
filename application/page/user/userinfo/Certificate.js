import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,Modal} from 'react-native';

import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import * as WeChat from 'react-native-wechat-lib';

import HudView from '../../../component/HudView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';


class Certificate extends Component {

    static navigationOptions = {
        title:'我的证书',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.cert = navigation.getParam('cert', {});


        this.state = {
            imgs:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/045f86a9-71b6-490f-aa64-c1f0ac1ed43e.png',
            shareType:false,
        }

        this._onDown = this._onDown.bind(this);
        this._toggleShare = this._toggleShare.bind(this);
    }

    _onDown(){
        this.refs.viewShot.capture().then(uri => {
            
            CameraRoll.saveToCameraRoll(uri).then(result=>{

                this.setState({
                    tips:false,
                },()=>{
                    this.refs.hud.show('保存成功', 2);
                });
            }).catch(error=>{
                this.refs.hud.show('保存失败', 2);
            });
        })
    }

    _toggleShare = (type) => {

            WeChat.isWXAppInstalled().then(isInstalled => {

                if (isInstalled) {
                    this.refs.viewShot.capture().then(uri => {

                        if(Platform.OS === 'android'){
                            WeChat.shareImage({
                                imageUrl: uri,
                                scene: type
                            }).then(data => {
                                this.setState({
                                    tips: false,
                                }, () => {
                                    this.refs.hud.show('分享成功', 1);
                                })
                            }).catch(error => {
                                
                            })
                        } else {

                            WeChat.shareImage({
                                imageUrl: 'file:/' + uri,
                                scene: type
                            }).then(data => {
                                this.setState({
                                    tips: false,
                                }, () => {
                                    this.refs.hud.show('分享成功', 1);
                                })
                            }).catch(error => {
                                
                            })
                        }
                        
                        
                    });
                }
            })
    }

    render() {

        const {imgs,shareType} = this.state;

        const savebtn = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/e9b9b59d-7d1b-4358-806f-959311629cb5.png';
        const sharebtn = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24889223-5a1b-4d7b-a05f-4b26dd8bc3b9.png';

        return (
            <View style={[styles.container]}>
                
                <ViewShot ref='viewShot' options={{ format: 'png', quality: 0.1 , result: Platform.OS === 'ios' ? 'tmpfile' : 'tmpfile'}}>
                    <TouchableOpacity style={[styles.fd_c, styles.bg_white, styles.ai_ct,styles.jc_ct,styles.certBox]}>
                        <Image style={[styles.img]} resizeMode='contain' source={{uri:imgs}}/>
                        <View style={[styles.certTip]}>
                            <Text style={[styles.sm_label,styles.c33_label,styles.mb_15,styles.center_label]}>{this.cert.content}</Text>
                        </View>
                    </TouchableOpacity>
                </ViewShot>
                
                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                    <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.jc_ct,styles.btn_item,styles.mr_15]}
                        onPress={this._onDown}
                    >
                        <Image style={[styles.save_icon]} mode='aspectFit' source={{uri:savebtn}}/>
                        <Text style={[styles.red_label,styles.default_label]}>保存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.jc_ct,styles.btn_item]} onPress={()=>this.setState({shareType:true})}>
                        <Image style={[styles.share_icon]} mode='aspectFit' source={{uri:sharebtn}}/>
                        <Text style={[styles.red_label,styles.default_label]}>分享</Text>
                    </TouchableOpacity>
                </View>
                <Modal  visible={shareType} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={()=>this.setState({shareType:false})}></TouchableOpacity>
                    <View style={styles.wechatType}>
                        <View style={[styles.wechatIcons,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <TouchableOpacity style={[styles.item ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1 ]}
                                onPress={() => this._toggleShare(0)}
                            >
                                <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]}>
                                    <Image source={asset.wechat} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label ,styles.m_5]}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item  ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1]}
                                onPress={() => this._toggleShare(1)}
                            >
                                <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]} >
                                    <Image source={asset.friends} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label ,styles.m_5]}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    img:{
        width:294,
        height:207,
    },
    certBox:{
        position:'relative',
    },
    certTip:{
        position:'absolute',
        top:0,
        left:'50%',
        marginLeft:-147,
        width:294,
        height:207,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingLeft:20,
        paddingRight:20,
        textAlign:'center'
    },
    save_icon:{
        width:16,
        height:16,
        marginRight:4,
    },
    share_icon:{
        width:13,
        height:13,
        marginRight:4
    },
    btn_item:{
        flexGrow:0,
        width:129,
        height:44,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F',
        borderRadius:5,
        backgroundColor:'#ffffff'
    },
    btn_items:{
        flexGrow:0,
        width:129,
        height:44,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F',
        borderRadius:5,
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    wechatType:{
        position: 'absolute',
        bottom:0,
        left:0,
        width:'100%',
        height:120,
        borderRadius:5,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        backgroundColor:'#ffffff'
    },
    wechatIcons:{
        width:'100%',
        backgroundColor:'#ffffff',
        height:100
    },
    item_box:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#f5f5f5',
    },
})

export const LayoutComponent = Certificate;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userCert:state.user.userCert,
	};
}
