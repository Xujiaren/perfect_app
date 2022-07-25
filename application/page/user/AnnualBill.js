import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image,Modal} from 'react-native';

import { WebView } from 'react-native-webview';
import ViewShot from 'react-native-view-shot';
import * as WeChat from 'react-native-wechat-lib';

import asset from '../../config/asset';
import theme from '../../config/theme';

import LabelBtn from '../../component/LabelBtn';

class AnnualBill extends Component {

    static navigationOptions = {
        // title:'年度账单',
        // headerRight: <View/>,
        header:null
    };

    constructor(props){
        super(props);

        const {navigation} = props;

        this.state = {
            currentTimestamp:'',
            tips:false
        };
    }

    componentDidMount(){
        const currentTimestamp = new Date().getTime();

        this.setState({
            currentTimestamp:currentTimestamp
        })
    }


    _onLoadEnd = () => {
        console.log('结束')
    }


    _onMessage = (event) => {
        const {navigation} = this.props;
        let eventMsg = event.nativeEvent.data;

        console.log(eventMsg)

        if(eventMsg.length > 0){
            let msg = eventMsg.split('&')[1];

            if(msg === 'firend'){
                this._onTyShare(0)
            } else if(msg === 'firends') {
                this._onTyShare(1)
            } else if(msg === 'back'){
                navigation.goBack()
            }
        }

    }

    _onTyShare = (type) => {
        console.log(type)
        this.setState({
            tips:true
        })
    }

    _onShare(shareType){

        WeChat.isWXAppInstalled().then(isInstalled => {

            if (isInstalled) {
                this.refs.viewShot.capture().then(uri => {

                    if(Platform.OS === 'android'){
                        WeChat.shareImage({
                            imageUrl: uri,
                            scene: shareType
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
                            scene: shareType
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
        const {currentTimestamp,tips} = this.state;

        return (
            <View style={styles.container}>
                <WebView
                    ref={"webView"}
                    useWebKit={true} 
                    source={{uri: 'http://127.0.0.1:8000/App.html?v=' + currentTimestamp}}
                    urlPrefixesForDefaultIntent={['http', 'https']}
                    onLoadEnd={this._onLoadEnd}
                    onMessage={this._onMessage}
                    javaScriptEnabled={true}
                    onNavigationStateChange={this._onNavigationStateChange}
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest} 
                />

                <Modal transparent={true} visible={tips} onRequestClose={() => {}}>
                    <View style={[styles.bg_container]}></View>
                    <View style={styles.tip}>
                        <ViewShot ref='viewShot' options={{ format: 'png', quality: 0.1 , result: Platform.OS === 'ios' ? 'tmpfile' : 'tmpfile'}}>
                            <View style={[styles.canvas_tip,styles.p_25]}>
                                <View style={[styles.fd_c,styles.ai_ct]}>
                                    <Text style={[styles.lg_label,styles.black_label]}>我的年度关键词</Text>
                                    <Text style={[styles.lg_label,styles.black_label]}>“关键词 参数”</Text>
                                </View>
                                <Image source={''} style={[styles.bill_image,styles.mt_15]} />
                                <Text style={[styles.mt_10,styles.black_label,styles.default_label]}>关键词描述关键词描述关键词描述关键词描述关键词描述</Text>
                                <Image source={''} style={[styles.qrcode,styles.mt_30]} />
                                <Text style={[styles.mt_5,styles.tip_label,styles.sm_label]}>查看我的年度账单</Text>
                            </View>
                        </ViewShot>
                        <View style={[styles.items ,styles.fd_r,styles.jc_ct ,styles.ai_ct ,styles.mt_15]}>
                            <TouchableOpacity style={[styles.item ,styles.fd_c ,styles.jc_ct ,styles.ai_ct ]}
                                onPress={() => this._onShare(0)}
                            >
                                <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]}>
                                    <Image source={asset.wechat} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label ,styles.white_label,styles.m_5]}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item  ,styles.fd_c ,styles.jc_ct ,styles.ai_ct ,styles.ml_20 ,styles.mr_20]}
                                onPress={() => this._onShare(1)}
                            >
                                <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]} >
                                    <Image source={asset.friends} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label ,styles.white_label,styles.m_5]}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    tip:{
        position: 'absolute',
        top:'45%',
        left:'50%',
        width:270,
        height:520,
        marginLeft: -135,
        marginTop: -260,
        borderRadius:5,
    },
    canvas_tip:{
        width:270,
        height:520,
        position:'relative',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bill_image:{
        width: '100%',
        height: 230,
        backgroundColor: '#dddddd',
    },
    qrcode:{
        width: 90,
        height: 90,
        backgroundColor: '#dddddd',
    },
    item_box:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#f5f5f5',
    },
    left_box:{
        position: 'absolute',
        top: 20,
        left:20,
    },
    left_arrow_icon:{
        width: 30,
        height: 30,
    }
});

export const LayoutComponent = AnnualBill;

export function mapStateToProps(state) {
	return {
	};
}
