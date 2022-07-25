import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity ,Alert, Linking} from 'react-native';
import * as Animatable from 'react-native-animatable';
import request from '../../util/net'
import { config, asset, theme, iconMap } from '../../config';
import * as WeChat from 'react-native-wechat-lib';
class LiveShop extends Component {

    constructor(props) {
        super(props);
        this.action =this.props.action
        this.state = {
            goods_list: [],
        }

        this.push = this.push.bind(this);
    }

    push(goods) {
        let goods_list = this.state.goods_list;

        if (goods_list.length >= 3) {
            goods_list.shift();
        }

        goods_list.push(goods);

        this.setState({
            goods_list: goods_list
        })
    }
    onMall=(goods)=>{
        const{navigation}=this.action
        let adlink = goods.goodsLink
        if (adlink.substring(0, 4) == 'http') {
            navigation.navigate('AdWebView', { link:adlink })
        }else if(adlink.substring(1, 5) == 'mail'){
            let goodId = adlink.split('=')[1]
            request.get('/shop/goods/'+goodId)
            .then(res=>{
                navigation.navigate('MailDetail',{cate:res})
            })
        }else{
            Linking.canOpenURL('weixin://').then(supported => {
                if (supported) {
                    WeChat.launchMiniProgram({
                        userName: config.yc_wxapp, // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: adlink
                    });
    
                } else {
                    Alert.alert('温馨提示', '请先安装微信');
                }
            })
        }
    }

    render() {
        const {goods_list} = this.state;

        return (
            <View style={styles.container}>
                {goods_list.map((goods, index) => {
                    return (
                        <TouchableOpacity key={'goods_' + index} onPress={()=>this.onMall(goods)}>
                            <Animatable.View useNativeDriver animation={'bounceInLeft'} delay={index * 100} ref={'goods_' + index} style={[styles.goods, styles.mb_10, styles.circle_5, styles.p_10, styles.bg_white, styles.row]} onAnimationEnd={() => {
                                setTimeout(() => {
                                    this.refs['goods_' + index] && this.refs['goods_' + index].fadeOutUp(150).then(() => {
                                        goods_list.shift();

                                        this.setState({
                                            goods_list: goods_list,
                                        })
                                    })
                                }, 5000 + index * 200)
                            }}>
                                <Image source={{uri: goods.goodsImg}} style={styles.goods_img}/>
                                <View style={[styles.jc_sb, styles.goods_intro, styles.ml_10]}>
                                    <Text style={[styles.sm_label]}>{goods.goodsName}</Text>
                                    <Text style={[styles.sm_label, styles.red_label]}>¥{goods.goodsPrice}</Text>
                                </View>
                            </Animatable.View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    container: {
        position: 'absolute',
        left: 20,
        bottom: 60,
        right: 80,
        zIndex:288,
    },
    goods: {
        height: 75,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    goods_img: {
        width: 94,
        height: 55,
    },
    goods_intro: {
        width: theme.window.width * 0.6 - 130,
        height: 55,
    },
});

export default LiveShop;
