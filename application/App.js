//import liraries
import React, { Component } from 'react';
import { View, StatusBar, StyleSheet, TouchableOpacity, Image, Text, Modal, DeviceEventEmitter, ActivityIndicator, Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Provider } from 'react-redux';
import configureStore from './redux';
import { AppNav } from './config/route';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SplashScreen from 'react-native-splash-screen';
import * as WeChat from 'react-native-wechat-lib';
import request from './util/net'
import asset from './config/asset';
import theme from './config/theme';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';
import * as  DataBase from './util/DataBase';
const store = configureStore();

// create a component
class App extends Component {

    state = {
        load: false,
        net: true,
        share: false,
        adver: false,
        wait: true,
        adv: [],
        ad_video: [],
        seconds: 5,
        currentAd: 0,
        forWeb: false,
        loading: false,
        linkUrl: '',
        process: false,
        pr_list: [
            "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1649813174375.png",
            "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1649813179033.png",
            "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1649813183190.png",
            "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1649813187093.png"
        ],
        pindex: 0,
        intes: false,
        integral: 0,
    }
    timer = null
    share = {}
    intes = {}
    componentWillMount() {
        global.theme = '#0067E2';
    }

    componentDidMount() {
        SplashScreen.hide();

        this.shareSub = DeviceEventEmitter.addListener('share', (data) => {
            this.share = data;
            this.setState({
                share: true,
            })
        });

        this.interSub = DeviceEventEmitter.addListener('inter', (data) => {
            this.intes = data;
            this.setState({
                intes: true,
                integral: data.integral
            })
        });

        this.unsubscribe = NetInfo.addEventListener(state => {
            this.setState({
                net: state.isConnected
            })
        });
        
        request.get('/config/ad/8', {
        }).then(res => {
            if (res.length > 0) {
                if (res.filter(item => item.adId == 9).length > 0) {
                    let arr = []
                    arr.push(res.filter(item => item.adId == 9)[0])
                    this.setState({
                        ad_video: arr,
                        adver: true,
                        wait: false,
                        seconds: 59,
                        adv: []
                    }, () => {
                        this.seconds()
                    })
                } else {
                    this.setState({
                        adv: res,
                        adver: true,
                        wait: false
                    }, () => {
                        this.seconds()
                    })
                }
            } else {
                this.setState({
                    adver: false,
                    wait: false,
                })
            }
        });
        this.getProcess();
    }
    getProcess = () => {
        DataBase.getItem('process').then(data => {
            if (data == null) {
                this.setState({
                    process: true
                })
            } else {
                this.setState({
                    process: false
                })
            }
        })
    }
    setProcess = () => {
        DataBase.setItem('process', 'process')
    }
    seconds = () => {
        this.timer = setInterval(() => {
            if (this.state.seconds > 0) {
                this.setState({
                    seconds: this.state.seconds - 1
                }, () => {
                    if (this.state.seconds == 0) {
                        setTimeout(() => {
                            this.setState({
                                adver: false
                            })
                        }, 1000);
                    }
                })
            }
        }, 1000);
    }
    componentWillUnmount() {
        this.shareSub && this.shareSub.remove();
        this.interSub && this.interSub.remove();
        this.unsubscribe && this.unsubscribe();
        clearInterval(this.timer)
    }

    onShare = (index) => {
        this.setState({
            share: false,
        }, () => {
            WeChat.isWXAppInstalled().then((installed) => {
                if (installed) {
                    if (this.share.courseId) {
                        request.post('/user/share/course/' + this.share.courseId)
                    }
                    if (this.share.articleId) {
                        request.post('/user/log', {
                            log_type: 1,
                            type: 1,
                            device_id: 0,
                            intro: '分享资讯',
                            content_id: this.share.articleId,
                            param: JSON.stringify({ name: this.share.title, cctype: 6, ttype: 0 }),
                            from: 0,
                        })
                        request.post('/user/save/share/user/history', {
                            cctype: 1,
                            content_id: this.share.articleId,
                            ctype: 11,
                            etype: 16,
                        })
                    }
                    if (index == 0) {
                        WeChat.shareMiniProgram({
                            title: this.share.title,
                            description: this.share.title,
                            thumbImageUrl: this.share.img ? this.share.img : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',
                            userName: "gh_7bd862c3897e",
                            webpageUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.perfectapp',
                            path: this.share.path,
                            withShareTicket: 'true',
                            scene: 0,
                        }).then((onFulfilled, onRejected) => {
                            if (this.share.courseId) {
                                request.get('/user/check/user/event')
                                    .then(res => {
                                        if (res) {
                                            this.setState({
                                                intes: true,
                                                integral: parseInt(res)
                                            })
                                        }
                                    })
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {

                        // WeChat.shareMiniProgram({
                        //     title: this.share.title,
                        //     thumbImageUrl: this.share.img,
                        //     userName: "gh_7bd862c3897e",
                        //     webpageUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.perfectapp',
                        //     hdImageUrl: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',
                        //     path: this.share.path,
                        //     scene: 1,
                        // }).then((onFulfilled, onRejected) => {

                        // }).catch(err => {
                        //     console.log(err)
                        // })

                        WeChat.shareWebpage({
                            title: this.share.title,
                            description: this.share.title,
                            thumbImageUrl: this.share.img,
                            webpageUrl: 'https://cloud1-9gte9vuwb998210f-1305702264.tcloudbaseapp.com/ad.html?page='+encodeURIComponent(this.share.path)+'&title='+encodeURIComponent(this.share.title),
                            scene: 1
                        })

                        // Alert.alert('提示', '是否跳转到小程序分享朋友圈', [
                        //     {
                        //         text: '取消'
                        //     }, {
                        //         text: '跳转', onPress: () => {
                        //             WeChat.launchMiniProgram({
                        //                 userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        //                 miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        //                 path: this.share.path
                        //             }).then(res => {
                        //             }).catch(err => {
                        //                 console.log(err)
                        //             })
                        //         }
                        //     }])
                    }

                }
            });
        })
    }
    _onLoadEnd = () => {
        console.log('加载完成')
        this.setState({
            loading: true
        })
    }
    onOpen = (item) => {
        if (item.link) {
            if (item.link.slice(0, 4) == 'http') {
                this.setState({
                    forWeb: true,
                    linkUrl: item.link,
                    adver: false
                })
            }
        }
    }
    render() {
        const { share, currentAd, loading, linkUrl, pr_list, pindex, intes, integral } = this.state;

        if (!this.state.net) {
            return (
                <View style={styles.econtainer}>
                    <Image source={asset.perfect_icon.pf_net} style={styles.eicon} resizeMode={'contain'} />
                    <Text style={{ color: '#999999', fontSize: 14, marginTop: 15, }}>网络不给力哦</Text>
                </View>
            )
        }
        if (this.state.wait) {
            return null
        }
        if (this.state.adver) {
            return (
                <Modal visible={this.state.adver} transparent={true} onRequestClose={() => {
                    this.setState({ adver: false })
                }}>
                    <View style={[{ width: theme.window.width, height: theme.window.height }, styles.bg_white]}>
                        <TouchableOpacity style={[styles.set]} onPress={() => this.setState({ adver: false }, () => {
                            clearInterval(this.timer)
                        })}>
                            <View style={[styles.close, styles.row, styles.jc_ct, styles.ai_ct]}>
                                <Text style={[{ fontSize: 14, color: '#ffffff' }]}>跳过 {this.state.seconds}</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            this.state.adv.length > 1 && this.state.ad_video.length == 0 ?
                                <View>
                                    <Carousel
                                        useScrollView={true}
                                        data={this.state.adv}
                                        autoplay={true}
                                        loop={true}
                                        autoplayDelay={5000}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity onPress={() => this.onOpen(item)}>
                                                    <View>
                                                        <Image source={{ uri: item.fileUrl }} style={[{ width: theme.window.width, height: theme.window.height }]} resizeMode={'contain'} />
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }}

                                        itemWidth={theme.window.width}
                                        itemHeight={theme.window.height}
                                        sliderWidth={theme.window.width}
                                        sliderHeight={theme.window.height}
                                        activeSlideAlignment={'center'}
                                        inactiveSlideScale={0.7}

                                        onSnapToItem={(index) => this.setState({ currentAd: index })}
                                    />
                                    <Pagination
                                        dotsLength={this.state.adv.length}
                                        activeDotIndex={currentAd}
                                        containerStyle={styles.ad_page}
                                        dotStyle={styles.ad_dot}
                                        inactiveDotOpacity={0.4}
                                        inactiveDotScale={0.6}
                                    />
                                </View>
                                : this.state.adv.length == 1 && this.state.ad_video.length == 0 ?
                                    <TouchableOpacity onPress={() => this.onOpen(this.state.adv[0])}>
                                        <View>
                                            <Image source={{ uri: this.state.adv[0].fileUrl }} style={[{ width: theme.window.width, height: theme.window.height }]} resizeMode={'contain'} />
                                        </View>
                                    </TouchableOpacity>
                                    : this.state.ad_video.length > 0 && this.state.adv.length == 0 ?
                                        <View style={[{ width: theme.window.width, height: theme.window.height, backgroundColor: '#000000' }]}>
                                            <Video
                                                audioOnly={true}
                                                controls={false}
                                                source={{ uri: this.state.ad_video[0].fileUrl }}
                                                style={[{ width: theme.window.width, height: theme.window.height }]}
                                                ref={ref => (this.player = ref)}
                                                pictureInPicture={true}
                                                playInBackground={true}
                                                playWhenInactive={true}
                                                resizeMode={'contain'}
                                                onEnd={(data) => {
                                                    this.player.seek(0);
                                                }}
                                            />
                                        </View>
                                        : null
                        }
                    </View>
                </Modal>
            )
        }

        return (
            <Provider store={store}>
                <View style={styles.flex_1}>
                    <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'} />
                    <AppNav />
                    <Modal visible={share} transparent={true} onRequestClose={() => {
                        this.setState({ share: false })
                    }}>
                        <TouchableOpacity style={[styles.modal]} onPress={() => this.setState({ share: false })} />
                        <View style={styles.wechatType}>
                            <View style={[styles.wechatIcons, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                    onPress={() => this.onShare(0)}
                                >
                                    <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]}>
                                        <Image source={asset.wechat} style={[styles.item_box]} />
                                    </View>
                                    <Text style={[styles.default_label, styles.m_5]}>微信好友</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                    onPress={() => this.onShare(1)}
                                >
                                    <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]} >
                                        <Image source={asset.friends} style={[styles.item_box]} />
                                    </View>
                                    <Text style={[styles.default_label, styles.m_5]}>朋友圈</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={intes} transparent={true}>
                        <TouchableOpacity style={[{ flex: 1 }]} onPress={() => this.setState({ intes: false })} />
                        <View style={[styles.box]}>
                            <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/base/model.score.png' }} style={[styles.piccs]} />
                            <View style={[styles.row, styles.jc_ct, { marginTop: 60 }]}>
                                <Text style={[styles.mt]}>恭喜您</Text>
                            </View>
                            <View style={[styles.row, styles.jc_ct, styles.mt_5]}>
                                <Text style={[styles.mts]}>获得 {integral} 学分</Text>
                            </View>
                            <View style={[styles.row, styles.jc_ct, styles.mt_10]}>
                                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/eaf0f6ec-af98-45ef-940a-cf8034f14d62.gif' }} style={[{ width: 100, height: 100 }]} resizeMode='cover' />
                            </View>
                            <View style={[styles.row, styles.jc_ct, styles.mt_20]}>
                                <TouchableOpacity style={[styles.row, styles.jc_ct, styles.ai_ct, styles.btnn]} onPress={() => this.setState({ intes: false })}>
                                    <Text style={[styles.white_label]}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={this.state.forWeb} transparent={true} onRequestClose={() => {
                        this.setState({ adver: false, forWeb: false })
                    }}>
                        <View style={[{ width: theme.window.width, height: theme.window.height }]}>
                            <TouchableOpacity style={[styles.set]} onPress={() => { this.setState({ adver: false, forWeb: false }) }}>
                                <View style={[styles.close, styles.row, styles.jc_ct, styles.ai_ct]}>
                                    <Text style={[{ fontSize: 14, color: '#ffffff' }]}>返回</Text>
                                </View>
                            </TouchableOpacity>
                            <WebView
                                ref={"webView"}
                                useWebKit={true}
                                source={{ uri: linkUrl }}
                                urlPrefixesForDefaultIntent={['http', 'https']}
                                onLoadEnd={this._onLoadEnd}
                                onNavigationStateChange={this._onNavigationStateChange}
                                onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest} />
                            {
                                !loading ?
                                    <View style={[styles.dot]}>
                                        <ActivityIndicator size="small" color="#FFA38D" />
                                        <Text style={{ color: '#FFA38D', fontSize: 12, marginTop: 8, }}>加载中</Text>
                                    </View>
                                    : null}
                        </View>
                    </Modal>
                    {
                        !this.state.forWeb ?
                            <Modal visible={this.state.process} transparent={true} onRequestClose={() => {
                                this.setState({ process: false })
                            }}>
                                <View style={[styles.pr_lst]}>
                                    <TouchableOpacity style={[styles.to_lst]} onPress={() => {
                                        if (pindex < 3) {
                                            this.setState({
                                                pindex: pindex + 1
                                            })
                                        } else {
                                            this.setState({
                                                process: false
                                            }, this.setProcess)
                                        }
                                    }}>
                                        <Text style={[styles.white_label, styles.lg18_label]}>下一步</Text>
                                    </TouchableOpacity>
                                    <Image source={{ uri: pr_list[pindex] }} style={[{ width: theme.window.width + 4, height: theme.window.height + 4, margin: 0 }]} resizeMode={'stretch'} />
                                </View>
                            </Modal> : null
                    }
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    flex_1: {
        flex: 1,
    },
    econtainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    eicon: {
        width: 200,
        height: 200,
    },
    wechatType: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 120,
        borderRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#ffffff'
    },
    wechatIcons: {
        width: '100%',
        backgroundColor: '#ffffff',
        height: 100
    },
    item_box: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    close: {
        width: 64,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000000',
        opacity: 0.5
    },
    set: {
        position: 'absolute',
        right: 30,
        top: 50,
        zIndex: 99,
    },
    seconds: {
        position: 'absolute',
        right: 56,
        top: 54,
    },
    ad_page: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 5
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#cccccc',
    },
    dot: {
        position: 'absolute',
        top: 180,
        width: theme.window.width,
        alignItems: 'center',
        justifyContent: 'center',

    },
    pr_lst: {
        backgroundColor: '#ffffff',
        padding: 0,
        marginLeft: -2,
        marginTop: -3,
        position: 'relative'
    },
    to_lst: {
        position: 'absolute',
        width: theme.window.width * 0.4,
        height: theme.window.height * 0.06,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: theme.window.height * 0.25,
        left: theme.window.width * 0.31,
        zIndex: 99
    },
    box: {
        position: 'absolute',
        width: 280,
        height: 305,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        top: theme.window.height * 0.36,
        left: 48
    },
    piccs: {
        position: 'absolute',
        top: -200,
        left: -20,
        width: 320,
        height: 249,
    },
    mt: {
        fontSize: 28
    },
    mts: {
        fontSize: 18
    },
    btnn: {
        width: 250,
        height: 34,
        borderRadius: 5,
        backgroundColor: '#F4623F',
    }
});



export default App;


