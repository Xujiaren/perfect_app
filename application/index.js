import React, { Component } from 'react';
import {PermissionsAndroid, Platform, StatusBar, Alert, DeviceEventEmitter, NativeModules} from 'react-native';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
const { StatusBarManager } = NativeModules;
import { Header } from 'react-navigation-stack';
import store from 'react-native-simple-store';
import { setCustomText } from 'react-native-global-props';

import * as WeChat from 'react-native-wechat-lib';
import AliyunPush from '@myoula/react-native-aliyun-push';

import config from './config/param';                                                           
import App from './App';

console.disableYellowBox = true;

//codesign -s "iPhone Distribution: Perfect (China) Co., Ltd. (Z9P7VBML98)" -f --preserve-metadata --generate-entitlement-der Payload/
//xcrun altool --validate-app -f perfectApp.ipa -t iOS -u dnb_apple@perfect99.com -p druv-jmse-tzms-ipyt

const customTextProps = {
	style: {
		fontSize: 14,
		color: '#333333',
	},
};

setCustomText(customTextProps);


function setup() {

    global.token = '';
    global.tip = 1;
    global.statusBarHeight = 20;
    global.navigationHeight = 0;

    class Root extends Component {

        constructor(props){
            super(props);
            this.state = {
                loaded: false,
            };
        }

        componentDidMount() {
            
            if (Platform.OS === 'ios'){
                StatusBarManager.getHeight(statusBarHeight => {
                    global.statusBarHeight = statusBarHeight.height;
                });
            } else {
                global.statusBarHeight = StatusBar.currentHeight;
            }
    
            global.navigationHeight = Header.HEIGHT;//即获取导航条高度

            if (Platform.OS === 'android') {
                PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {
                    console.info(result);
                })
            }
            
            WeChat.registerApp(config.wechat, 'https://edu.perfect99.com/');
            // WeChat.registerApp(config.wechat, 'https://help.wechat.com/app/');

            AliyunPush.addListener(e => {
                console.log("Message Received. " + JSON.stringify(e));
                const {extras = {action: '', id: 0}} = e;
                
                if (extras.action == 'msg') {
                    DeviceEventEmitter.emit('msg', extras.id);
                }
            });

            AliyunPush.initCloudChannel(config.emasKey, config.emasSecret).then(data => {
                console.info(data)

                // AliyunPush.getDeviceId().then(data => {
                //     console.info(data)
                // }).catch(err => {
                //     console.info(err)
                // })
            }).catch(err => {
                console.info(err)
            })

            store.get(["token", "tip"]).then(data => {
                global.token = data[0] || '';
                //global.token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNzMxNzQiLCJpYXQiOjE2NDg1MzQ5MTksInN1YiI6IjE3MzE3NCJ9.XT9QuaeaDbvPJ_vbp5bPI0pQMbk6tYahSaRncVlQjbA';

                if (data[1] != 'undefined') {
                    global.tip = 0;
                }

                this.setState({
                    loaded: true
                })
            });
        }

        componentWillUnmount() {
            AliyunPush.removeAllListeners()
        }



        render() {
            if (!this.state.loaded) return null;

            return (
                <GestureHandlerRootView style={{flex: 1}}>
                    <App/>
                </GestureHandlerRootView>
                
            );
        }
    }

    return Root;
}

module.exports = setup;

