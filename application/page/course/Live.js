import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, PermissionsAndroid, Platform, KeyboardAvoidingView, Keyboard, DeviceEventEmitter, Alert } from 'react-native';
import _ from 'lodash';
import qs from 'query-string';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import Carousel from 'react-native-looped-carousel';
import ActionButton from 'react-native-action-button';
import * as WeChat from 'react-native-wechat-lib';

import Tabs from '../../component/Tabs';
import { Emoji } from '../../component/emoji';
import LivePlayer from '../../component/live/LivePlayer';
import LiveShop from '../../component/live/LiveShop';
import LiveMsg from '../../component/live/LiveMsg';
import LiveGift from '../../component/live/LiveGift';
import HudView from '../../component/HudView';
import { textToEmoji } from '../../util/emoji';
import request from '../../util/net';
import getExactTimes from '../../util/common';
import { config, asset, theme, iconMap } from '../../config';

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
    quality: 0.2, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class Live extends Component {

    static navigationOptions = ({ navigation }) => {
        const course = navigation.getParam('course', { courseName: '直播' });
        const fullscreen = navigation.getParam('fullscreen', false);

        return {
            headerShown: !fullscreen,
            title: course.courseName,
            headerRight: (
                <View>
                    {
                        course.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', { title: course.courseName, img: course.courseImg, path: '/pages/index/liveDesc?courseId=' + course.courseId + '&liveStatus=' + course.liveStatus + '&liveName=' + course.courseName })} style={[styles.pr_15]}>
                                <Image source={asset.share_icon} style={styles.share_icon} />
                            </TouchableOpacity>
                    }
                </View>
            ),
        }
    };

    constructor(props) {
        super(props);
        const { navigation } = props;

        this.course = navigation.getParam('course', {});
        this.liveType = navigation.getParam('liveType', 0)

        this.gift = [];
        this.giftMap = {};
        this.aitems = [];
        this.items = [];
        this.goods_list = [];
        this.goodsMap = {};
        this.ws = null;
        this.tims = null;
        this.state = {
            loaded: false,
            index: 0,

            shop: true,

            gift: false,
            gift_id: 0,
            gift_integral: 0,
            user_integral: 0,

            id: '',

            preview: false,
            preview_imgs: [],

            totalCount: 0,
            liveStatus: 0,
            roomStatus: 0,
            book: false,
            bookNum: 0,

            live_integral: 0,
            canBuy: false,

            content: '',
            shareType: false,

            isEmoji: false, // 显示表情选择， 隐藏表情选择
            isTopic: false,
            isCollect: false,
            giftType: false,
            isLive: false,

            keyboardSpace: 0,
            liveType: this.liveType, // 0 app 进入  1 连接打开app 进入
            ttime: 0,
            activityDTO: {},
            questionActivityDTOs: {},
            shows: true,
            open: 0,
            prize_type: 0,
            userAvatar: '',
            userName: '',
            showShops: false,
            l_name: '',
            l_mobile: '',
            l_address: '',
            rewardId: 0,
            userId: 0,
            lottery: [],
            lotteryList: [],
            views: 0,
            vantCount: 0,
            seconds: '00',
            minutes: '00',
            activityId: 0
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onMsg = this._onMsg.bind(this);
        this._onWs = this._onWs.bind(this);

        this._onAction = this._onAction.bind(this);

        this._onPub = this._onPub.bind(this);
        this._onPubPic = this._onPubPic.bind(this);

        this._onGiftToggle = this._onGiftToggle.bind(this);
        this._onGift = this._onGift.bind(this);


        this._renderMsg = this._renderMsg.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._editImg = this._editImg.bind(this);
        this._toggleShare = this._toggleShare.bind(this);

        this._onEmoji = this._onEmoji.bind(this);

        this._updateKeyboardSpace = this._updateKeyboardSpace.bind(this);
        this._resetKeyboardSpace = this._resetKeyboardSpace.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })

        const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

        this._listeners = [
            Keyboard.addListener(updateListener, this._updateKeyboardSpace),
            Keyboard.addListener(resetListener, this._resetKeyboardSpace)
        ];
        this.activityLst();
        this.timeOut();
    }
    timeOut = () => {
        this.tims = setInterval(() => {
            let myDate = new Date();
            let seconds = myDate.getSeconds();
            let ttime = new Date().getTime()
            this.activityLst()
            this.setState({
                ttime: ttime
            }, () => {
                this.forTimes()
            })
        }, 1000)
    }
    activityLst = () => {
        const { actions } = this.props
        actions.course.liveActivitys({
            course_id: this.course.courseId,
            type: 0,
            resolved: (res) => {
                let activityDTOs = res
                if (activityDTOs.length > 0) {
                    var ttime = new Date().getTime()
                    let list = activityDTOs

                    list = list.filter(item => item.endTime * 1000 + 180000 >= ttime)
                    if (list.length > 0) {
                        var act = Math.min.apply(Math, list.map((e) => { return e.endTime }))
                        list = list.filter(itm => itm.endTime == act)
                        if (this.state.activityId != list[0].activityId) {
                            this.setState({
                                activityDTO: list[0],
                                activityId: list[0].activityId,
                            })
                        }
                    } else {
                        this.setState({
                            activityDTO: {},
                            activityId: 0,
                        })
                    }

                }
            },
            rejected: (err) => {

            }
        })
    }
    forTimes = () => {
        const { activityDTO, ttime } = this.state

        if (activityDTO) {
            let minutes = 0
            let seconds = 0
            minutes = parseInt(((activityDTO.endTime * 1000 - ttime) % (1000 * 60 * 60)) / (1000 * 60))
            seconds = parseInt(((activityDTO.endTime * 1000 - ttime) % (1000 * 60)) / 1000)
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            this.setState({
                minutes: minutes,
                seconds: seconds
            })
            if (minutes == '00' && seconds == '0-1' || minutes == '00' && seconds == '00') {
                this.setState({
                    prize_type: 1
                }, () => {
                    setTimeout(() => {
                        this.forLottery()
                    }, 2000);
                })
            }
            if ((ttime - activityDTO.endTime * 1000) / 1000 == 0 || (ttime - activityDTO.endTime * 1000) / 1000 == 1) {
                this.setState({
                    open: 1,
                })
            }
        }

    }
    leaves = () => {
        this.props.actions.user.leaveRoom({
            cctype: 0,
            content_id: this.course.courseId,
            type: 1,
            resolved: (res) => {

            }
        });
    }
    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
        this.ws && this.ws.close();
        this.props.actions.user.leaveRoom({
            cctype: 1,
            content_id: this.course.courseId
        })
        clearInterval(this.tims)
    }

    componentWillReceiveProps(nextProps) {
        const { info, goods, gift, user, navigation } = nextProps;

        if (info !== this.props.info) {
            this.course = info;
            if (info.status == 0) {
                Alert.alert('提示', '该直播间已下架', [
                    {
                        text: '取消', onPress: () => {
                            navigation.goBack()
                        }
                    }, {
                        text: '确定', onPress: () => {
                            navigation.goBack()

                        }
                    }])
            }
            this.setState({
                shop: info.isShop == 1,
                totalCount: info.hit,
                liveStatus: info.liveStatus,
                roomStatus: info.roomStatus,
                bookNum: info.bookNum,
                book: info.book,
                loaded: true,
                isCollect: info.isCollect,
                collectNum: info.collectNum,
                live_integral: info.integral,
                canBuy: info.canBuy
            })
        }

        if (goods !== this.props.goods) {
            this.goods_list = goods;
            let goodsMap = {};
            goods.map((g, index) => {
                goodsMap[g.goodsId] = g;
            });

            this.goodsMap = goodsMap;
        }

        if (gift !== this.props.gift) {
            this.gift = gift;

            let giftMap = {};
            gift.map((g, index) => {
                giftMap[g.giftId] = g;
            })

            this.giftMap = giftMap;
        }

        if (user !== this.props.user) {
            if (!_.isEmpty(user)) {
                this._onWs(user);
                this.leaves();
                this.setState({
                    user_integral: user.integral,
                    userAvatar: user.avatar,
                    userName: user.nickname,
                    userId: user.userId
                })
                let ads = user.addressList[0]
                if (user.addressList.length > 0) {
                    this.setState({
                        l_name: ads.realname,
                        l_mobile: ads.mobile,
                        l_address: ads.province + ads.city + ads.district + ads.address
                    })
                }
            }
        }

        if (navigation !== this.props.navigation) {
            const { params } = navigation.state;
            if (params.shareType) {
                this._onShare();
            }
        }
    }

    _onRefresh() {
        const { actions } = this.props;
        actions.site.gift(1);
        actions.course.info(this.course.courseId);
        actions.course.goods(this.course.courseId);
        actions.user.user();
    }

    _onShare() {
        this.setState({
            shareType: true
        })
    }

    _toggleShare = (type) => {
        WeChat.shareWebpage({
            title: this.course.courseName,
            description: this.course.summary,
            thumbImageUrl: this.course.courseImg,
            webpageUrl: config.cUrl + '/event/share/live.html?id=' + this.course.courseId,
            scene: type
        }).then(data => {
            this.setState({
                shareType: false,
            }, () => {
                this.refs.hud.show('分享成功', 1);
            })
        }).catch(error => {

        })

    }

    _onEmoji() {
        const { isEmoji } = this.state;
        Keyboard.dismiss();
        if (isEmoji) {
            this.refs.emoji.hide();
        } else {
            this.refs.emoji.show();
        }

        this.setState({
            isEmoji: !isEmoji
        })
    }

    _onMsg(msg) {
        const { navigation } = this.props;
        const { liveType } = this.state;

        if (msg.type == 'event-system') {           //在线情况

            if (this.state.totalCount != msg.totalCount) {
                this.setState({
                    totalCount: msg.totalCount,
                })
            }

        } else if (msg.type == 'event-live') {      //直播情况

            this.setState({
                liveStatus: msg.liveStatus,
                roomStatus: msg.roomStatus,
            })

        } else if (msg.type == 'event-join') {      //有人进来


            this.refs.livemsg.push(msg.user.name + '来了');

        } else if (msg.type == 'event-leave') {     //有人离开

        } else if (msg.type == 'event-keyword') {   //触发关键词

            this.refs.hud.show(msg.msg.msg, 1);

        } else if (msg.type == 'event-msg') {       //用户发言

            const id = msg.id;
            const mtype = msg.msg.mtype;
            const admin = msg.user.admin;

            if (mtype == 'goods') {
                const goodsId = parseInt(msg.msg.msg);

                if (goodsId in this.goodsMap) {
                    let goods = this.goodsMap[goodsId];
                    goods.id = msg.id;
                    this.refs.shop.push(goods);
                }


            } else if (mtype == 'gift') {

                const arr = msg.msg.msg.split('&');
                const giftId = parseInt(arr[1]);

                if (giftId in this.giftMap) {
                    this.refs.livegift.push(arr[0], this.giftMap[giftId]);
                }


            } else {

                if (admin == 1) {
                    this.aitems.push(msg);
                }

                if (this.items.length > 200) {
                    this.items.shift();
                }
                if (admin == 0) {
                    this.items.push(msg);
                }

            }

            this.setState({
                id: id,
            }, () => {
                if (liveType === 0) {
                    setTimeout(() => this.refs.msg.scrollToEnd(), 200);
                }
            })

        } else if (msg.type == 'event-cancel') {    //撤销发言
            const id = msg.msg.msg;

            let items = [];
            let aitems = [];
            this.items.map((item, index) => {
                if (item.id != id) items.push(item);
            })

            this.aitems.map((item, index) => {
                if (item.id != id) aitems.push(item);
            })

            this.items = items;
            this.aitems = aitems;

            this.setState({
                id: id,
            })

        } else if (msg.type == 'event-mute') {     //禁言

            this.refs.hud.show(msg.msg.msg, 1);

        } else if (msg.type == 'event-restore') {   //恢复发言

            this.refs.hud.show(msg.msg.msg, 1);

        } else if (msg.type == 'event-kick-user') { //被踢出房间
            this.refs.hud.show(msg.msg.msg, 1, () => {
                navigation.goBack();
            });
        }

    }

    _onWs(user) {
        if (this.ws) return;
        // const {user} = this.props;

        const params = {
            name: user.nickname,
            avatar: user.avatar,
            uid: user.userId,
        }

        const url = config.ws + this.course.courseId + '?' + qs.stringify(params);

        this.ws = new WebSocket(url);

        this.ws.onmessage = (e) => {
            this._onMsg(JSON.parse(e.data));
        }

        this.ws.onclose = (e) => {
            console.info(e);
        }
    }

    _onAction(action, args) {
        const { navigation, actions, user } = this.props;
        let { isCollect, collectNum, isFollow, techScore, courseScore, courseId } = this.state;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (action == 'Gift') {
                this._onGiftToggle();
            } else if (action == 'shops') {
                this.goods_list.map(item => {
                    this.refs.shop.push(item);
                })
            } else if (action == 'PubPic') {
                this._onPubPic();
            } else if (action == 'Pub') {
                this.refs.emoji.hide();
                this._onPub('text', this.state.content);

            } else if (action == 'Reward') {

                let gift = {};
                this.gift.map((item, i) => {
                    if (item.giftId == this.state.gift_id) {
                        gift = item;
                    }
                })

                actions.user.publishreward({
                    gift_id: this.state.gift_id,
                    course_id: this.course.courseId,
                    resolved: (data) => {
                        this._onGiftToggle();
                        actions.user.user();

                        this._onPub('gift', user.nickname + '&' + this.state.gift_id);
                    },
                    rejected: (res) => {

                    },
                })

            } else if (action == 'Book') {
                actions.course.book({
                    course_id: this.course.courseId,
                    resolved: (data) => {
                        actions.course.info(this.course.courseId);
                        this.setState({
                            isLive: true
                        })
                    },
                    rejected: (msg) => {

                    }
                })
            } else if (action == 'Collect') {
                if (isCollect) {
                    actions.course.removecollect({
                        course_id: this.course.courseId,
                        resolved: (data) => {
                            collectNum--;

                            this.setState({
                                collectNum: collectNum,
                                isCollect: false
                            })
                        },
                        rejected: (msg) => {

                        },
                    })
                } else {
                    actions.course.collect({
                        course_id: this.course.courseId,
                        resolved: (data) => {
                            collectNum++;

                            this.setState({
                                collectNum: collectNum,
                                isCollect: true
                            })
                        },
                        rejected: (msg) => {

                        },
                    })
                }
            } else if (action == 'onBuy') {
                navigation.navigate('PayCourse', { course: this.course })
            }
        }
    }

    _onPub(mtype, msg) {
        const param = {
            mtype: mtype,
            msg: msg,
        }

        this.ws && this.ws.send(JSON.stringify(param));

        this.setState({
            index: 1,
            content: '',
        }, () => {
            Keyboard.dismiss();
        })
    }

    _onPubPic() {
        const { actions } = this.props;

        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {

                if (result["android.permission.CAMERA"] === "granted" && result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {

                    this._editImg()

                }

            })

        } else {
            this._editImg()
        }

    }

    _editImg() {
        const { actions } = this.props;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file: 'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        this._onPub('img', data);
                    },
                    rejected: (msg) => {
                    },
                });
            }
        });
    }

    _onGiftToggle() {
        this.setState({
            gift: !this.state.gift
        })
    }

    _onGift(id, integral) {
        if (id == this.state.gift_id) {
            this.setState({
                gift_id: 0,
                gift_integral: 0,
            })
        } else {
            this.setState({
                gift_id: id,
                gift_integral: integral,
            })
        }
    }

    _updateKeyboardSpace(event) {
        if (!event.endCoordinates) {
            return;
        }

        if (Platform.OS !== 'ios') {
            this.setState({
                keyboardSpace: event.endCoordinates.screenY,
                isKeyboardOpened: true
            });
        }
    }

    _resetKeyboardSpace(event) {
        this.setState({
            keyboardSpace: 0,
            isKeyboardOpened: false
        });
    }
    onAdresse = () => {
        const { rewardId, l_address, l_name, l_mobile } = this.state
        request.post('/activity/lottery/receive/' + rewardId, {
            address: l_address,
            mobile: l_mobile,
            realname: l_name
        })
        this.refs.hud.show('填写成功', 1);
        this.setState({
            open: 0,
            prize_type: 0
        })
    }
    forLottery = () => {
        var that = this
        const { activityDTO, userId } = this.state
        const { actions } = this.props
        actions.course.forLottery({
            activity_id: activityDTO.activityId,
            index: 0,
            resolved: (res) => {

                this.setState({
                    lottery: res,
                    // prize_type:1
                })
                let lst = res.filter(item => item.userId == userId)
                this.setState({
                    rewardId: lst[0].rewardId
                })
                that.setState({
                    open: 2
                })
            },
            rejected: (err) => {
                that.setState({
                    open: 2
                })
            }
        })

    }
    onWatch = () => {
        const { activityDTO } = this.state
        request.get('/activity/lottery/reward/', {
            activity_id: activityDTO.activityId,
            page: 0,
            user_id: this.state.userId
        }).then(res => {
            this.setState({
                lotteryList: res.items,
                open: 3
            })
        })
    }
    _onOut = () => {
        this.setState({
            open: 1,
        })
    }

    _renderMsg(msg, owner) {
        const { index } = this.state;
        let replyList = textToEmoji(msg.msg);
        let on = index === 1;

        if (msg.mtype == 'img') {
            return (
                <TouchableOpacity onPress={() => this.setState({
                    preview: true,
                    preview_imgs: [{
                        url: msg.msg,
                    }]
                })} style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                    <Image source={{ uri: msg.msg }} style={styles.thumb} resizeMode={'contain'} />
                </TouchableOpacity>
            )
        } else if (msg.mtype == 'url') {
            return (
                <TouchableOpacity>
                    <Text style={[styles.default_label, owner && styles.white_label]}>{msg.msg}</Text>
                </TouchableOpacity>
            )
        }


        // return <View style={[styles.msgwidth,styles.fd_r,styles.ai_ct,{flexWrap:'wrap'}]}>
        //             <EmojiView content={msg.msg} fontStyle={[styles.default_label, owner && styles.white_label]}/>
        //         </View>;

        return <View style={[styles.msgwidth, styles.fd_r, styles.ai_ct, { flexWrap: 'wrap' }]}>
            {
                replyList.map((rpy, idx) => {
                    return (
                        <View key={'rpy' + idx} style={[styles.chatmsg_txt, styles.fd_r]}>
                            {
                                rpy.msgType === 'text' ?
                                    <Text style={[styles.default_label, styles.c33_label, owner && on && styles.white_label]}>{rpy.msgCont}</Text>
                                    :
                                    <Image source={{ uri: rpy.msgImage }} style={{ width: 20, height: 20 }} />
                            }
                        </View>
                    )
                })
            }
        </View>;
    }

    _renderItem(item) {
        const { user } = this.props;
        const { index } = this.state;
        const message = item.item;

        const msg = message.msg;
        const muser = message.user;
        const owner = muser.uid == user.userId;

        if (owner) {
            return (
                <View style={[styles.p_10, styles.row, styles.ai_ct, styles.jc_fe]}>
                    <View style={styles.avatar_small} />
                    <View style={[styles.mr_10]}>
                        {msg.mtype == 'img' ?
                            <View style={[styles.row, styles.jc_fe, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.circle_8, styles.over_h]}>
                                    {this._renderMsg(msg, owner)}
                                </View>
                            </View>
                            :
                            <View style={[styles.row, styles.jc_fe, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.bg_dblue, styles.circle_8, styles.p_8, styles.pl_12, styles.pr_12]}>
                                    {this._renderMsg(msg, owner)}
                                </View>
                                <View style={styles.rtriangle} />
                            </View>
                        }
                    </View>
                    <Image source={{ uri: muser.avatar.length > 0 ? muser.avatar : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png' }} style={styles.avatar_small} />
                </View>
            )
        }

        return (
            <View style={[styles.p_10, styles.row, styles.ai_ct, styles.jc_fs]}>
                <Image source={{ uri: muser.avatar.length > 0 ? muser.avatar : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png' }} style={styles.avatar_small} />
                <View style={[styles.ml_10]}>
                    <Text style={[styles.sm_label, styles.tip_label, muser.admin == 1 && styles.orange_label]}>{muser.name}</Text>
                    {msg.mtype == 'img' ?
                        <View style={[styles.row, styles.jc_fs, styles.ai_ct, styles.mt_5, styles.msg]}>
                            <View style={[styles.circle_8, styles.over_h]}>
                                {this._renderMsg(msg, owner)}
                            </View>
                        </View>
                        :
                        <View style={[styles.row, styles.jc_fs, styles.ai_ct, styles.mt_5, styles.msg]}>
                            <View style={styles.ltriangle} />
                            <View style={[styles.bg_white, styles.circle_8, styles.p_8, styles.pl_12, styles.pr_12]}>
                                {this._renderMsg(msg, owner)}
                            </View>
                        </View>
                    }
                </View>
            </View>
        )
    }

    render() {
        const { navigation } = this.props;
        const { loaded, index, preview, preview_imgs, content, book, bookNum, roomStatus, liveStatus, totalCount, gift, gift_id, gift_integral, user_integral, shareType, isTopic, isCollect, collectNum, live_integral, canBuy, isLive, keyboardSpace, activityDTO, ttime, questionActivityDTOs, shows, open, prize_type, userAvatar, showShops, l_name, l_address, l_mobile, rewardId, userId, lottery, lotteryList, views, vantCount, seconds, minutes, userName } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )

        const gifts = _.chunk(this.gift, 8);

        const reward_enable = user_integral >= gift_integral && gift_id > 0;

        const buyStatus = canBuy && live_integral > 0;

        const kType = Platform.OS == 'ios' ? 'padding' : 'height';
        return (
            // <TouchableWithoutFeedback onPress={() => {
            //     this.refs.emoji.hide();
            //     this.setState({
            //         isEmoji: false
            //     })
            // }}>
               
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={kType} keyboardVerticalOffset={Platform.OS == 'ios' ? this.state.keyboardSpace + 65 : '-' + this.state.keyboardSpace}>
                        <View style={[styles.container]} onTouchStart={()=>{
                            this.refs.emoji.hide();
                                this.setState({
                                    isEmoji: false
                                })
                        }}>
                            <LivePlayer
                                ref={e => { this.player = e; }}
                                source={{
                                    cover: this.course.courseImg,
                                    uri: this.course.liveUrl,
                                    restTime: this.course.resetTime,

                                }} ad={{
                                    preVideos: this.course.preVideos,
                                    inVideos: this.course.inVideos,
                                    endVideos: this.course.endVideos
                                }}
                                book={book}
                                bookNum={bookNum}
                                liveStatus={liveStatus}
                                roomStatus={roomStatus}
                                totalCount={totalCount}
                                canBuy={buyStatus}

                                onBook={() => this._onAction('Book')}
                                onBuy={() => this._onAction('onBuy')}
                                onFullScreen={(status) => {

                                    navigation.setParams({ 'fullscreen': status });
                                }}
                            />

                            <Tabs style={[styles.bg_white]} items={['主讲', '互动']} selected={index} onSelect={(index) => {
                                this.setState({
                                    index: index,
                                    liveType: 0,
                                }, () => {
                                    setTimeout(() => this.refs.msg.scrollToEnd(), 200);
                                })
                            }} />
                            <FlatList
                                ref={'msg'}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.p_10}
                                data={index == 0 ? this.aitems : this.items}
                                extraData={this.state.id}
                                // keyExtractor={(item, index) => index +  ''}
                                _keyExtractor={(item, index) => item.transDt + index.toString()}
                                renderItem={this._renderItem}
                            />

                            {
                                (activityDTO.beginTime * 1000) - ttime <= 0 && ttime <= (activityDTO.endTime * 1000) ?
                                    <View style={[styles.prize]}>
                                        <TouchableOpacity onPress={() => { this.setState({ open: 1 }) }}>
                                            <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c06a3b61-f220-47d0-bccc-45166691de97.png' }} style={[{ width: 60, height: 60 }]} />
                                        </TouchableOpacity>
                                        {
                                            ttime <= (activityDTO.endTime * 1000) ?
                                                <View style={[styles.mt_10, styles.row, styles.jc_ct]}>
                                                    <Text style={[{ color: '#000000', fontSize: 16 }]}>{minutes}:{seconds}</Text>
                                                </View>
                                                : null}
                                    </View> : null
                            }
                            {
                                ttime >= (activityDTO.endTime * 1000) && ttime <= (activityDTO.endTime * 1000 + 180000) ?
                                    <View style={[styles.prize]}>
                                        <TouchableOpacity onPress={() => this.forLottery()}>
                                            <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c06a3b61-f220-47d0-bccc-45166691de97.png' }} style={[{ width: 60, height: 60 }]} />
                                        </TouchableOpacity>
                                        <View style={[styles.mt_10, styles.row, styles.jc_ct]}>
                                            <Text style={[{ color: '#000000ß', fontSize: 16 }]}>已开奖</Text>
                                        </View>
                                    </View> : null
                            }

                            {/* {
                            index === 1 ? 
                            <View>
                                {
                                    live_integral > 0 && canBuy  ?
                                    <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                                        <TouchableOpacity style={[styles.p_5,styles.pl_12, styles.ai_ct]} onPress={() => this._onAction('Gift')}>
                                            <Image source={asset.gift} style={{width:21,height:21}} /> 
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.p_5,styles.count_box, styles.ai_ct]} onPress={() => this._onAction('Collect')}>
                                            <Image source={isCollect ? asset.collected :   asset.heart_icon  } style={{width:23,height:20}} />
                                            <View style={[styles.count_left]}>
                                                <Text style={[styles.sm9_label ,styles.white_label]}>{collectNum > 999 ? '999+' : collectNum}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.buy_btn]} onPress={()=> navigation.navigate('PayCourse',{course:this.course})}>
                                            <Text style={[styles.default_label,styles.white_label,styles.fw_label]}>{live_integral}学分</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <View style={[styles.bg_white, styles.toolbar, styles.border_top, styles.p_5, styles.pl_10, styles.pr_10, styles.row, styles.ai_ct, styles.jc_sb]}>
                                        <TouchableOpacity style={[styles.pl_10,styles.pr_5]} 
                                            onPress={this._onEmoji}
                                        >
                                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('biaoqing')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.pl_10,styles.pr_15]} onPress={() => this._onAction('PubPic')}>
                                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('tupian')}</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.col_6, styles.row, styles.ai_ct, styles.jc_sb]}>
                                            <TextInput
                                                style={[styles.p_5,styles.pt_3,styles.pb_3,styles.bg_gray, styles.circle_5, styles.col_1,styles.input]}
                                                placeholder={'写留言，发表看法'}
                                                clearButtonMode={'while-editing'}
                                                underlineColorAndroid={'transparent'}
                                                autoCorrect={false} autoCapitalize={'none'}
                                                placeholderTextSize = {12}
                                                value={content}  keyboardType={'default'}
                                                onChangeText={(text) => {this.setState({content:text});}}
                                            />
                                            <TouchableOpacity style={[styles.p_5, styles.pl_10, styles.pr_10, styles.ml_10, content.length == 0 && styles.disabledContainer]} disabled={content.length == 0} onPress={() => this._onAction('Pub')}>
                                                <Text>发送</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                        :null} */}

                            {
                                index === 1 ?
                                    <View style={[styles.bg_white, styles.toolbar, styles.border_top, styles.p_5, styles.pl_10, styles.pr_10, styles.row, styles.ai_ct, styles.jc_sb, { marginBottom: 10 }]}>
                                        <TouchableOpacity style={[styles.pl_10, styles.pr_5]}
                                            onPress={this._onEmoji}
                                        >
                                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('biaoqing')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.pl_10, styles.pr_15]} onPress={() => this._onAction('PubPic')}>
                                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('tupian')}</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.col_6, styles.row, styles.ai_ct, styles.jc_sb]}>
                                            <TextInput
                                                style={[styles.p_5, styles.pt_3, styles.pb_3, styles.bg_gray, styles.circle_5, styles.col_1, styles.input]}
                                                placeholder={'写留言，发表看法'}
                                                clearButtonMode={'while-editing'}
                                                underlineColorAndroid={'transparent'}
                                                autoCorrect={false} autoCapitalize={'none'}
                                                placeholderTextSize={12}
                                                value={content}
                                                onChangeText={(text) => { this.setState({ content: text }); }}
                                            />
                                            <TouchableOpacity style={[styles.p_5, styles.pl_10, styles.pr_10, styles.ml_10, content.length == 0 && styles.disabledContainer]} disabled={content.length == 0} onPress={() => this._onAction('Pub')}>
                                                <Text>发送</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    : null}




                            <ActionButton buttonColor="rgba(255,255,255,1)"
                                size={28}
                                position='left'
                                style={{ position: 'absolute', bottom: 100, zIndex: 300 }}
                                renderIcon={() => (
                                    <View>
                                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/gift.png' }} style={styles.returnTop_cover} />
                                    </View>
                                )}
                                onPress={() => this._onAction('Gift')}
                            >
                            </ActionButton>
                            {
                                this.goods_list.length > 0 ?
                                    <TouchableOpacity style={[{ position: 'absolute', left: 26, bottom: 70, zIndex: 300 }]} onPress={() => this._onAction('shops')}>
                                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7a2307cf-c512-47d7-a53b-4b1cdf402f40.png' }} style={styles.returnTop_cover} />
                                    </TouchableOpacity>
                                    : null
                            }
                           

                            <LiveShop ref={'shop'} action={this.props} />
                            <LiveMsg ref={'livemsg'} />
                            <LiveGift ref={'livegift'} />

                            <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                                <ImageViewer imageUrls={preview_imgs} onClick={() => {
                                    this.setState({
                                        preview: false,
                                    });
                                }}
                                    menuContext={{ 'saveToLocal': '保存至本地', 'cancel': '取消' }}
                                />
                            </Modal>

                            <Modal visible={gift} transparent={true} onRequestClose={() => { }}>
                                <TouchableOpacity style={styles.modal} onPress={this._onGiftToggle} />
                                <View style={[styles.gift_box, styles.bg_white, styles.pt_15]}>
                                    <Carousel
                                        useScrollView={true}
                                        delay={2000}
                                        style={[styles.gift]}
                                        autoplay={false}
                                        swiper
                                        bullets={true}
                                        isLooped={false}
                                        pageInfo={false}
                                        bulletStyle={styles.gift_dot}
                                        chosenBulletStyle={styles.gift_dot_on}
                                    >
                                        {gifts.map((gitems, i) => {
                                            return (
                                                <View key={'gitem_' + i} style={[styles.gift, styles.row, styles.f_wrap]}>
                                                    {gitems.map((gift, j) => {
                                                        const on = gift.giftId == gift_id;
                                                        return (
                                                            <TouchableOpacity style={[styles.gift_item, on && styles.gift_item_on, styles.ai_ct, styles.jc_ct]} key={'gift_' + gift.giftId} onPress={() => this._onGift(gift.giftId, gift.integral)}>
                                                                <Image source={{ uri: gift.giftImg }} style={[styles.gift_icon]} />
                                                                <Text style={[styles.sm_label, styles.c33_label, styles.mt_2]}>{gift.giftName}</Text>
                                                                <Text style={[styles.sm_label, styles.tip_label, styles.mt_1]}>{gift.integral}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </View>
                                            )
                                        })}
                                    </Carousel>
                                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pt_5, styles.pb_5, styles.pl_30, styles.pr_20, styles.border_top]}>
                                        <View style={[styles.fd_r, styles.ai_ct]}>
                                            <Text style={[styles.icon, styles.sm_label, styles.orange_label]}>{iconMap('jinbi')}</Text>
                                            {/* <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_10]}>{user_integral >= gift_integral ? user_integral - gift_integral : '学分不足'}</Text> */}
                                            <Text style={[styles.sm_label, styles.c33_label, styles.ml_10]}>{user_integral}</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.bg_orange, styles.rewardBtn, !reward_enable && styles.disabledContainer]} disabled={!reward_enable} onPress={() => this._onAction('Reward')}>
                                            <Text style={[styles.white_label, styles.sm_label]}>打赏</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>

                            <Modal visible={shareType} transparent={true} onRequestClose={() => { }}>
                                <TouchableOpacity style={[styles.bg_container]} onPress={() => this.setState({ shareType: false })}></TouchableOpacity>
                                <View style={styles.wechatType}>
                                    <View style={[styles.wechatIcons, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                            onPress={() => this._toggleShare(0)}
                                        >
                                            <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]}>
                                                <Image source={asset.wechat} style={[styles.item_box]} />
                                            </View>
                                            <Text style={[styles.default_label, styles.m_5]}>微信好友</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                            onPress={() => this._toggleShare(1)}
                                        >
                                            <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]} >
                                                <Image source={asset.friends} style={[styles.item_box]} />
                                            </View>
                                            <Text style={[styles.default_label, styles.m_5]}>朋友圈</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>

                            {/* <Modal  visible={isTopic} transparent={true} onRequestClose={() => {}}>
                            <TouchableOpacity style={[styles.bg_container]} onPress={()=>this.setState({shareType:false})}></TouchableOpacity>
                            <View style={[styles.liveTopic,styles.pt_15,styles.pb_30,styles.pl_20,styles.pr_20]}>
                                <View style={[styles.fd_c]}>
                                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb]}>
                                        <Text style={[styles.fw_label,styles.c33_label,styles.default_label]}>骆驼的驼峰是储存什么的？</Text>
                                        <TouchableOpacity >
                                            <Image source={asset.dete_icon}  style={{width:20,height:20}} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.liveItems]}>
                                        <TouchableOpacity style={[styles.liveItem]}>
                                            <Text>水</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.liveItem]}>
                                            <Text>蛋白质</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.liveItem]}>
                                            <Text>脂肪</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.liveItem]}>
                                            <Text>氨基酸</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal> */}


                            {
                                isLive ?
                                    <View style={[styles.coupons]}>
                                        <View style={styles.scoreBox}>
                                            <View style={[styles.evalBox]}>
                                                <Image source={asset.bg.redhot} style={[styles.coupon_cover]} />
                                                <View style={[styles.fd_c, styles.ai_ct, styles.mt_15]}>
                                                    <Text style={{ color: '#000000', fontSize: 18 }}>预约成功</Text>
                                                    <Text style={{ fontSize: 15, color: '#888888', marginTop: 2 }}>开播前10分钟将收到直播通知</Text>
                                                </View>
                                                <View style={[styles.fd_r, styles.mt_30, styles.eval_btns]}>
                                                    <TouchableOpacity style={[styles.col_1, styles.ai_ct, styles.jc_ct, styles.pt_12, styles.pb_12]} onPress={() => this.setState({ isLive: false })} >
                                                        <Text style={[styles.lg16_label, styles.c33_label]}>确定</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    : null}
                            <Modal visible={open > 0 ? true : false} transparent={true} onRequestClose={() => { }}>
                                <View style={[styles.prizes, open == 1 ? styles.height : open == 2 || open == 3 || open == 4 ? styles.heights : null]}>
                                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mtl]}>
                                        {
                                            open == 4 ?
                                                null
                                                :
                                                <TouchableOpacity style={[styles.ml_15]} onPress={() => { this.setState({ open: 0 }) }} >
                                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/v2/asset/close_w.png' }} style={[styles.closed]} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            open == 3 || open == 4 ?
                                                null :
                                                <TouchableOpacity style={[styles.mr_15]} onPress={() => this.onWatch()}>
                                                    <Text style={[styles.white_label, styles.default_label]}>中奖记录</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    {
                                        open == 1 ?
                                            <View style={[styles.prize_body, styles.mt_10]}>
                                                <View style={[styles.row, styles.jc_ct]}>
                                                    <Text style={[styles.white_label, styles.default_label, styles.font_l]}>{activityDTO.title} 抽{activityDTO.num}人</Text>
                                                </View>
                                                <View style={[styles.row, styles.jc_ct, { marginTop: 8 }]}>
                                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c06a3b61-f220-47d0-bccc-45166691de97.png' }} style={[styles.prize_ic]} />
                                                </View>
                                                {
                                                    prize_type == 1 ?
                                                        <View style={[styles.row, styles.jc_ct, styles.mt_15]}><Text style={[styles.lg_label, styles.bg_ye]}>开奖中...</Text></View>
                                                        :
                                                        <View style={[styles.row, styles.jc_ct, styles.mt_15]}><Text style={[styles.lg_label, styles.bg_ye]}>开奖倒计时</Text></View>
                                                }
                                                {
                                                    prize_type == 1 ?
                                                        null
                                                        :
                                                        <View style={[styles.row, styles.jc_ct, styles.mt_5]}><Text style={[{ fontSize: 36 }, styles.white_label]}>{minutes ? minutes : '00'}:{seconds ? seconds : '00'}</Text></View>
                                                }
                                                <View style={[styles.row, styles.jc_ct, styles.mt_20]}><Text style={[styles.sm_label, styles.font_l, styles.white_label]}>耐心等待主播开奖</Text></View>
                                            </View>
                                            : open == 2 ?
                                                <View style={[styles.mt_10]}>
                                                    <View style={[styles.row, styles.jc_ct]}><Text style={[styles.white_label, styles.default_label, styles.font_l]}>{activityDTO.title} 抽{activityDTO.num}人</Text></View>
                                                    <View style={[styles.row, styles.jc_ct, { marginTop: 8 }]}>
                                                        {/* <View style={styles.tipss}> */}
                                                        <Image source={{ uri: userAvatar }} style={styles.tipss} />
                                                        {/* </View> */}
                                                    </View>
                                                    {
                                                        lottery.length > 0 && lottery.filter(item => item.userId == userId).length > 0 ?
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_15]}><Text style={[styles.default_label, styles.bg_ye]}>{userName}，恭喜中奖！</Text></View>
                                                            :
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_15]}><Text style={[styles.default_label, styles.bg_ye]}>很遗憾，没有中奖！</Text></View>
                                                    }
                                                    {
                                                        lottery.length > 0 && lottery.filter(item => item.userId == userId).length > 0 ?
                                                            <View style={[styles.white_label, styles.row, styles.jc_ct, styles.mt_15]}>
                                                                {
                                                                    lottery.filter(item => item.userId == userId).length > 0 && lottery.filter(item => item.userId == userId)[0].address ?
                                                                        <View style={[styles.adress, styles.row, styles.jc_ct, styles.ai_ct]}>
                                                                            <Text style={[styles.label_12, styles.white_label]}>已填写</Text>
                                                                        </View>
                                                                        :
                                                                        <TouchableOpacity style={[styles.adress, styles.row, styles.jc_ct, styles.ai_ct]} onPress={() => { this.setState({ open: 4 }) }}>
                                                                            <Text style={[styles.label_12, styles.white_label]}>填写地址</Text>
                                                                        </TouchableOpacity>
                                                                }

                                                            </View>
                                                            : null
                                                    }
                                                    <View style={[styles.row, styles.jc_ct, styles.mt_20]}>
                                                        <View style={[styles.lig]}></View>
                                                    </View>
                                                    <View style={[styles.row, styles.jc_ct, styles.mt_20]}>
                                                        <View style={[styles.prize_list]}>
                                                            <View>
                                                                <Text style={[styles.white_label, styles.default_label, { fontWeight: 'bold' }]}>获奖名单</Text>
                                                            </View>
                                                            <View style={[styles.mt_10]}>
                                                                <ScrollView
                                                                    style={[{ height: 100, flex: 1 }]}
                                                                    scrollY
                                                                    showsVerticalScrollIndicator={false}
                                                                    showsHorizontalScrollIndicator={false}
                                                                >
                                                                    {
                                                                        lottery.map((item, index) => {
                                                                            return (
                                                                                <View style={[styles.row, styles.ai_ct, styles.mt_10]}>
                                                                                    {/* <View style={[styles.lists]}> */}
                                                                                    <Image source={{ uri: item.userDTO.avatar }} style={[{ width: 30, height: 30, borderRadius: 15 }]} />
                                                                                    {/* </View> */}
                                                                                    <View style={[styles.ml_10]}>
                                                                                        <Text style={[styles.default_label, styles.white_label, styles.font_l]}>{item.nickname}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            )
                                                                        })
                                                                    }
                                                                </ScrollView>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                : open == 3 ?
                                                    <View style={[styles.mt_10]}>
                                                        <View style={[styles.row, styles.jc_ct]}>
                                                            <Text style={[styles.white_label, styles.lg_label, { fontWeight: 'bold' }]}>中奖记录</Text>
                                                        </View>
                                                        <View style={[styles.row, styles.jc_ct, styles.mt_15]}>
                                                            {
                                                                lotteryList.length > 0 ?
                                                                    <View style={[styles.prize_list]}>
                                                                        {
                                                                            lotteryList.map((item, index) => {
                                                                                return (
                                                                                    <View style={[styles.prize_list, styles.mt_10, index == lotteryList.length - 1 ? null : styles.bod]}>
                                                                                        <View>
                                                                                            <Text style={[styles.white_label, styles.default_label, { fontWeight: 'bold' }]}>{item.itemName}</Text>
                                                                                        </View>
                                                                                        <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.mt_5]}>
                                                                                            <View>
                                                                                                <Text style={[styles.default_label, styles.white_label, styles.lighter]}>{getExactTimes(item.pubTime)}</Text>
                                                                                            </View>
                                                                                            <TouchableOpacity onPress={() => { this.setState({ open: 4, activityId: item.activityId }) }}>
                                                                                                <Text style={[styles.default_label, styles.bg_ye, { fontWeight: 'bold' }]}>中奖</Text>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </View>
                                                                                )
                                                                            })
                                                                        }
                                                                    </View>
                                                                    : null
                                                            }
                                                        </View>
                                                    </View>
                                                    : open == 4 ?
                                                        <View>
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_15]}>
                                                                <Text style={[styles.white_label, { fontSize: 26 }]}>中奖啦</Text>
                                                            </View>
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_20]}>
                                                                <View style={[styles.inpt]}>
                                                                    <TextInput
                                                                        style={[styles.col_1, styles.input]}
                                                                        placeholder={'姓名'}
                                                                        clearButtonMode={'while-editing'}
                                                                        underlineColorAndroid={'transparent'}
                                                                        autoCorrect={false} autoCapitalize={'none'}
                                                                        placeholderTextSize={12}
                                                                        value={l_name}
                                                                        onChangeText={(text) => { this.setState({ l_name: text }); }}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_12]}>
                                                                <View style={[styles.inpt]}>
                                                                    <TextInput
                                                                        style={[styles.col_1, styles.input]}
                                                                        placeholder={'手机'}
                                                                        clearButtonMode={'while-editing'}
                                                                        underlineColorAndroid={'transparent'}
                                                                        autoCorrect={false} autoCapitalize={'none'}
                                                                        placeholderTextSize={12}
                                                                        value={l_mobile}
                                                                        onChangeText={(text) => { this.setState({ l_mobile: text }); }}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_12]}>
                                                                <View style={[styles.inpt]}>
                                                                    <TextInput
                                                                        style={[styles.col_1, styles.input]}
                                                                        placeholder={'默认个人中心地址'}
                                                                        clearButtonMode={'while-editing'}
                                                                        underlineColorAndroid={'transparent'}
                                                                        autoCorrect={false} autoCapitalize={'none'}
                                                                        placeholderTextSize={12}
                                                                        value={l_address}
                                                                        onChangeText={(text) => { this.setState({ l_address: text }); }}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={[styles.row, styles.jc_ct, styles.mt_20]}>
                                                                <TouchableOpacity style={[styles.ok_btn, styles.row, styles.jc_ct, styles.ai_ct]} onPress={this.onAdresse}>
                                                                    <Text style={[styles.white_label, styles.default_label]}>确定</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        : null
                                    }
                                </View>
                            </Modal>
                            <HudView ref={'hud'} />
                        </View>
                        <Emoji ref={'emoji'} onSelect={(key) => {
                                let _content = content;
                                this.setState({
                                    content: _content + key,
                                })
                            }} />
                    </KeyboardAvoidingView>
            // </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    msg: {
        width: theme.window.width * 0.6,
    },
    ltriangle: {
        marginRight: -2,
        borderTopWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 0,
        borderTopColor: 'transparent',
        borderRightColor: 'white',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    rtriangle: {
        marginLeft: -2,
        borderTopWidth: 5,
        borderRightWidth: 0,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#0A86F9',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    thumb: {
        width: 120,
        height: 160,
    },

    shop_icon: {
        width: 32,
        height: 32
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        marginBottom: 50,
    },
    gift_box: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
    },
    gift: {
        width: theme.window.width,
        height: (theme.window.width / 2) * 1,
    },
    gift_dot: {
        backgroundColor: '#C5C5C5',
        width: 6,
        height: 6,
        borderRadius: 3,
        borderColor: '#C5C5C5',
        marginTop: 40,
        marginBottom: 5,
        marginLeft: 6,
        marginRight: 6,
    },
    gift_dot_on: {
        backgroundColor: '#545454',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 40,
        marginBottom: 5,
        marginLeft: 6,
        marginRight: 6,
    },
    gift_item: {
        width: theme.window.width / 4,
        height: (theme.window.width / 4) * 0.8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'white'
    },
    gift_icon: {
        width: 30,
        height: 30
    },
    gift_item_on: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,206,71,1)',
    },
    input: {
        paddingVertical: 0,
    },
    rewardBtn: {
        width: 65,
        height: 25,
        borderRadius: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    msgwidth: {
        maxWidth: theme.window.width * 0.65 - 24
    },
    returnTop_cover: {
        width: 36,
        height: 36,
    },
    share_icon: {
        width: 20,
        height: 20
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    liveTopic: {
        width: '100%',
        backgroundColor: '#ffffff',
    },
    liveItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 25
    },
    liveItem: {
        width: (theme.window.width - 50) / 2,
        height: 40,
        backgroundColor: '#EDEDED',
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    count_box: {
        width: 50
    },
    count_left: {
        position: 'absolute',
        top: 0,
        backgroundColor: '#FF5047',
        height: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        right: 5,
        minWidth: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 4,
        paddingRight: 4,
    },
    buy_btn: {
        // width:220,
        flex: 1,
        height: 36,
        borderRadius: 5,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },
    coupons: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    coupon_cons: {
        position: 'absolute',
        left: '50%',
        width: 280,
        marginLeft: -140,
        borderRadius: 5,
    },
    coupon_box: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        position: 'relative'
    },
    eval_btns: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        borderStyle: 'solid'
    },
    coupon_cover: {
        width: 280,
        height: 175,
        marginTop: -80
    },
    scoreBox: {
        position: 'absolute',
        left: '50%',
        width: 280,
        marginLeft: -140,
        backgroundColor: '#ffffff'
    },
    prize: {
        position: 'absolute',
        left: 25,
        top: theme.window.height * 0.34,
        zIndex: 99
    },
    prizes: {
        width: 280,
        backgroundColor: '#4E54C8',
        position: 'absolute',
        zIndex: 9999,
        top: 250,
        borderRadius: 4,
        left: (theme.window.width - 280) / 2,
    },
    mtl: {
        paddingTop: 12
    },
    closed: {
        width: 15,
        height: 15,
    },
    font_l: {
        fontWeight: '400'
    },
    prize_ic: {
        width: 42,
        height: 42
    },
    bg_ye: {
        color: '#FFFF73'
    },
    height: {
        height: 259
    },
    heights: {
        paddingBottom: 35
    },
    tipss: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: '#ffffff'
    },
    adress: {
        width: 82,
        height: 28,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 3,
    },
    lig: {
        width: 209,
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        borderStyle: 'dashed'
    },
    prize_list: {
        width: 209
    },
    lists: {
        width: 30,
        height: 30,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 15,
    },
    lighter: {
        fontWeight: '300'
    },
    bod: {
        width: 209,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#cccccc',
        paddingBottom: 10
    },
    inpt: {
        width: 240,
        height: 34,
        borderRadius: 5,
        backgroundColor: '#fafafa',
        paddingLeft: 5,
        paddingRight: 5
    },
    ok_btn: {
        width: 250,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FF8960'
    },
    size_34: {
        width: 19,
        height: 19
    },
});

export const LayoutComponent = Live;

export function mapStateToProps(state) {
    return {
        gift: state.site.gift,
        info: state.course.info,
        goods: state.course.goods,
        user: state.user.user,
    };
}
