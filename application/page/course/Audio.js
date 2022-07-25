//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, Text, Image, View, StyleSheet, FlatList, Linking, TouchableOpacity, DeviceEventEmitter, Modal, ScrollView, Alert, ProgressViewIOS, ProgressBarAndroid, Platform } from 'react-native';

import _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';
import Slider from '@react-native-community/slider';
import Picker from 'react-native-picker';

import Tabs from '../../component/Tabs';
import VodChapter from '../../component/vod/Chapter';
import Score from '../../component/Score';
import CommentCell from '../../component/cell/CommentCell';
import Star from '../../component/Star';
import { CommentEmpty } from '../../component/Empty';
import Gift from '../../component/Gift';
import HudView from '../../component/HudView';

import AudPlayer from '../../component/aud/AudPlayer';

import * as DataBase from '../../util/DataBase';
import * as tool from '../../util/common';

import { config, asset, theme, iconMap } from '../../config';

import * as WeChat from 'react-native-wechat-lib';

import { forTimer } from '../../util/common'
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
// create a component
class Audio extends Component {

    static navigationOptions = ({ navigation }) => {
        const audio = navigation.getParam('course', { courseName: '音频课程' });

        let courseName = '音频课程'

        if (audio.courseName != '' && audio.courseName != undefined) {
            courseName = audio.courseName
        }

        return {
            title: courseName,
            headerRight: (
                <View>
                    {
                        audio.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', { title: audio.courseName, img: audio.courseImg, courseId: audio.courseId, path: '/pages/index/audioDesc?course_id=' + audio.courseId + '&courseName=' + audio.courseName })} style={[styles.pr_15]}>
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
        this.audio = navigation.getParam('course', {});
        this.levelId = navigation.getParam('levelId', 0);
        this.citems = [];
        this.gift = [];

        this.sync = 0;

        this.watcher = null;
        this.sound = null;

        this.state = {
            loaded: false,
            duration: 0,
            current: 0,
            mediaId: '',
            cindex: 0,
            ccindex: 0,
            audioImg: '',
            playUrl: '',
            pause: true,
            speed: [0.5, 1, 1.5, 2],
            speeds: ['0.5', '1', '1.5', '2'],
            speed_idx: 1,
            t_left: 0,
            shareType: false,

            gift: false,
            giftImg: '',
            publishGift: false,
            user_nickname: '',
            user_integral: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            pindex: 0,

            isScore: false,

            techScore: 0,
            courseScore: 0,

            audioList: [],

            c_integral: 0,
            canBuy: false, // false  已购买 true 未购买

            audlistType: false, // 音频列表弹窗

            cchapterId: 0,

            score: 0,
            cchapterName: '',
            tip: false,

        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onAudio = this._onAudio.bind(this);
        this._onAction = this._onAction.bind(this);
        this._onPlay = this._onPlay.bind(this);



        this._renderFooter = this._renderFooter.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderScore = this._renderScore.bind(this);

        this._onShare = this._onShare.bind(this);
        this._toggleShare = this._toggleShare.bind(this);

        this._onStar1 = this._onStar1.bind(this);
        this._onStar2 = this._onStar2.bind(this);

        this._onPre = this._onPre.bind(this);
        this._onNext = this._onNext.bind(this);
        this._onSync = this._onSync.bind(this);
        this._onSlider = this._onSlider.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { info, comment, gift, user, commentTop, navigation, infoScore } = nextProps;

        if (!_.isEmpty(user)) {
            this.setState({
                user_integral: user.integral,
                user_nickname: user.nickname
            })
        }

        if (gift !== this.props.gift) {
            this.gift = gift;
        }

        if (comment !== this.props.comment) {

            this.setState({
                total: comment.total,
            })
        }

        if (commentTop !== this.props.commentTop) {

            this.setState({
                totalTop: commentTop.total,
            })

            if (Array.isArray(commentTop.items)) {
                this.citems = [{}, {}, {}].concat(commentTop.items);
            } else {
                this.citems = [{}, {}, {}];
            }
        }

        if (info !== this.props.info) {
            this.audio = info;
            if (info.plant == 1) {
                Alert.alert('课程提示', '此课程只能在微信小程序观看', [
                    {
                        text: '取消', onPress: () => {
                            navigation.goBack()
                        }
                    }, {
                        text: '跳转', onPress: () => {
                            this._onLink(info.courseId, info.courseName, info.ctype)

                        }
                    }])
            }
            if (info.chapterList.length > 0) {

                if (info.chapterList[0].child.length > 0) {

                    this.setState({
                        cchapterId: info.chapterList[0].child[0].chapterId,
                        cchapterName: info.chapterList[0].child[0].chapterName,
                    })
                }

            }

            this.setState({
                collectNum: info.collectNum,
                isCollect: info.collect,
                isFollow: this.audio.teacher && this.audio.teacher.isFollow,
                loaded: true,
                canPlay: info.canPlay,
                c_integral: info.integral,
                canBuy: info.canBuy,
                score: info.score
            }, () => {
                this._onAudio();
            })
        }

        if (navigation !== this.props.navigation) {
            const { params } = navigation.state;
            if (params.shareType) {
                this._onShare();
            }
        }

        if (infoScore !== this.props.infoScore) {

            this.setState({
                score: infoScore.score
            })
        }

    }

    componentWillMount() {
    }

    componentDidMount() {
        const { navigation, actions } = this.props
        this._onRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {

            const { params } = route.state

            actions.user.user();

            DeviceEventEmitter.addListener('payStatus', (data) => { // 建立一个通知

                if (data.payStatus) {
                    actions.course.info(this.audio.courseId);
                }

            });


        })

    }
    onLoad=()=>{
        const {playUrl} = this.state;
        if (playUrl == '') return;

        if (this.sound) {
            this.sound.release();
        }

        this.sound = new Sound(playUrl, null, error => this.onPlay(error, this.sound));
    }
    onPlay=(error, sound)=>{
        if (error) {
            return;
        }

        this.setState({
            paused: false,
        })

        this.mts && BackgroundTimer.clearInterval(this.mts);
        this.mts = BackgroundTimer.setInterval(() => {
            sound.getCurrentTime(sec => {
                this.props.onProgress && this.props.onProgress(parseInt(sec));
                this.setState({
                    current: sec
                })
                this._onSync(parseInt(sec))
            })
        }, 250);

        sound.play(() => {
            this.setState({
                paused: true,
            })

            this.mts && BackgroundTimer.clearInterval(this.mts);
            this.props.onEnd && this.props.onEnd();
            sound.release();
        })
    }
    componentWillUnmount() {
        this.mts && BackgroundTimer.clearInterval(this.mts);
        this.sound && this.sound.release();
        this.focuSub && this.focuSub.remove();
        Picker.hide();
    }

    _onRefresh() {

        const { actions } = this.props;

        this.setState({
            loaded: false,
        }, () => {
            actions.site.gift(0);
            actions.course.info(this.audio.courseId);
            actions.course.comment(this.audio.courseId, 0, 0);
            actions.course.commentTop(this.audio.courseId)
        })
    }

    _onLink(courseId, courseName, ctype) {

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                WeChat.launchMiniProgram({
                    userName: "gh_7bd862c3897e", // 拉起的小程序的username
                    miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                    path: '/pages/index/audioDesc?course_id=' + courseId + '&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                });

            } else {
                Alert.alert('温馨提示', '请先安装微信');
                setTimeout(() => {
                    this.props.navigation.goBack()
                }, 3000);
            }
        })
    }
    _onShare() {

        this.setState({
            shareType: true
        })

    }

    _toggleShare = (type) => {

        WeChat.shareWebpage({
            title: this.audio.courseName,
            description: this.audio.summary,
            thumbImageUrl: this.audio.courseImg,
            webpageUrl: config.cUrl + '/event/share/course.html?id=' + this.audio.courseId,
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



    _onAudio() {

        const { actions } = this.props;
        const { mediaId, cindex, ccindex } = this.state;

        if (this.audio.chapterList[cindex] && this.audio.chapterList[cindex].child[ccindex]) {

            const chapter = this.audio.chapterList[cindex].child[ccindex];

            actions.course.verify({
                media_id: chapter.mediaId,
                resolved: (data) => {
                    this.setState({
                        duration: data.duration,
                        playUrl: data.m38u,
                        audioImg: data.cover
                    })
                },
                rejected: (res) => {

                },
            })
        }


    }



    _onAction(action, args) {
        const { navigation, actions, user } = this.props;

        let { speeds, speed, speed_idx, isCollect, collectNum, isFollow, techScore, courseScore, courseId, c_integral, canBuy, pause } = this.state;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (action === 'Speed') {

                Picker.init({
                    pickerConfirmBtnText: '确定',
                    pickerCancelBtnText: '取消',
                    pickerTitleText: '选择速率',
                    pickerData: speeds,
                    selectedValue: [speed[speed_idx]],
                    onPickerConfirm: pickedValue => {
                        for (let i = 0; i < speed.length; i++) {
                            if (pickedValue[0] == speed[i]) {
                                if(speed_idx!=i){
                                    this.setState({
                                        speed_idx: i,
                                    },()=>{
                                        this.sound.setSpeed(this.state.speed[this.state.speed_idx])
                                    });
                                }
                            }
                        }
                    },
                });

                Picker.show();
            } else if (action == 'Follow') {

                if (isFollow) {
                    actions.teacher.removefollow({
                        teacherId: this.audio.teacherId,
                        resolved: (data) => {
                            this.refs.hud.show('取消关注', 1);

                            this.setState({
                                isFollow: false
                            })
                        },
                        rejected: (res) => {

                        },
                    });

                } else {
                    actions.teacher.follow({
                        teacherId: this.audio.teacherId,
                        resolved: (data) => {
                            this.refs.hud.show('关注成功', 1);

                            this.setState({
                                isFollow: true
                            })
                        },
                        rejected: (res) => {

                        },
                    });
                }

            } else if (action == 'Praise') {

                let comment = this.citems[args.index];
                if (comment.like) {
                    comment.like = false;
                    comment.praise--;

                    actions.user.removelike({
                        commentId: comment.commentId,
                        resolved: (data) => {

                        },
                        rejected: (msg) => {

                        }
                    })

                } else {
                    comment.like = true;
                    comment.praise++;

                    actions.user.pulishlike({
                        commentId: comment.commentId,
                        resolved: (data) => {

                        },
                        rejected: (msg) => {

                        }
                    })
                }

                this.citems[args.index] = comment;

                this.setState({
                    index: args.index
                })

            } else if (action == 'PublishComment') {

                let whitetip = 0;

                DataBase.getItem('whitetip').then(data => {
                    if (data != null) {
                        whitetip = data
                    }

                    navigation.navigate('PublishComment', { ctype: 3, content_id: this.audio.courseId, isStar: 0, type: 0, whitetip: whitetip });

                });

            } else if (action == 'Gift') {

                this.refs.gift.show();

            } else if (action == 'Reward') {

                const gift_id = args.gift_id;
                let gift = {};
                this.gift.map((item, i) => {
                    if (item.giftId == gift_id) {
                        gift = item;
                    }
                })

                this.setState({
                    giftImg: gift.giftImg
                })

                actions.user.publishreward({
                    gift_id: gift_id,
                    course_id: this.audio.courseId,
                    resolved: (data) => {
                        actions.user.user();

                        this.setState({
                            publishGift: true
                        }, () => {
                            setTimeout(() => this.setState({ publishGift: false }), 3000)
                        })
                    },
                    rejected: (res) => {

                    },
                })

            } else if (action == 'onBuy') {

                const gift_id = args.gift_id;
                let gift = {};

                this.gift.map((item, i) => {
                    if (item.giftId == gift_id) {
                        gift = item;
                    }
                })
                this.refs.gift.show();
                navigation.navigate('PayProps', { gift: gift });

            } else if (action == 'Collect') {

                if (isCollect) {

                    actions.course.removecollect({
                        course_id: this.audio.courseId,
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
                        course_id: this.audio.courseId,
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

            } else if (action == 'CoursePf') {

                this.setState({
                    isScore: true
                })

            } else if (action == 'EvalSubmit') {

                actions.home.publishcommt({
                    course_id: this.audio.courseId,
                    score: courseScore,
                    content: '',
                    gallery: '',
                    teacher_score: techScore,
                    resolved: (data) => {
                        actions.course.infoScore(this.audio.courseId);
                        this.setState({
                            isScore: false
                        }, () => {
                            setTimeout(() => {
                                this.refs.hud.show('评分成功', 1);
                            }, 1000)
                        })

                    },
                    rejected: (msg) => {

                    },
                });

            } else if (action == 'Report') {
                let comment = this.citems[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.audio.courseName })
            } else if (action == 'onUserInfo') {
                let comment = this.citems[args.index];
                navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.audio.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'onComment') {
                let comment = this.citems[args.index];
                navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.audio.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'aud_pre') {
                this._onPre();
            } else if (action == 'aud_next') {
                this._onNext();
            } else if (action == 'aud_list') {
                this.setState({
                    audlistType: true
                })
            } else if (action == 'pause') {

                if (c_integral > 0 && canBuy) {
                    this.refs.hud.show('购买后才播放', 1);
                } else {
                    if (pause) {
                        this.setState({
                            tip: true
                        })
                    }
                    if(this.sound){
                        if (this.sound.isPlaying()) {
                            this.sound.pause();
                        } else {
                            this.onPlay(null, this.sound)
                        }
                    }else{
                        this.onLoad()
                    }
                    this.setState({
                        pause: !pause,
                    })
                }
            } else if (action == 'chapter') {

                const { index, idx } = args;

                let _index = index;
                let _cindex = idx;

                this.setState({
                    cindex: _index,
                    ccindex: _cindex,
                    audlistType: false,
                    t_left: 0,

                }, () => {
                    this._onPlay();
                })

            }
        }
    }


    // 上一首
    _onPre() {
        let { cindex, ccindex } = this.state;
        const chapter = this.audio.chapterList[cindex];

        //cindex == 0 // 大目录 cindex 小节
        let _index = cindex;
        let _cindex = ccindex;

        if (_index === 0 && _cindex === 0) {
        } else {
            if ((_index === 0 && _cindex !== 0)) {
                _cindex--;
            } else if (_index !== 0 && _cindex === 0) {
                _index--;
                _cindex = this.audio.chapterList[_index - 1].child.length - 1;
            } else if (_index !== 0 && _cindex !== 0) {
                _cindex--;
            }
            // this.player.player.seek(0);
            this._onPlay();
        }

    }

    // 下一首
    _onNext() {

        let { cindex, ccindex } = this.state;
        const chapter = this.audio.chapterList[cindex];
        const { actions, navigation } = this.props;
        let _index = cindex;
        let _cindex = ccindex;


        if (_cindex < chapter.child.length - 1) {
            _cindex++;
        } else if (_index < this.audio.chapterList.length - 1) {
            _index++;
            _cindex = 0;
        } else {
            if (this.levelId > 0) {
                actions.course.LevelStatus({
                    levelId: this.levelId,
                    resolved: (res) => {
                        this.refs.hud.show('观看完成', 1);
                        setTimeout(() => {
                            navigation.goBack()
                            navigation.state.params.refresh()
                        }, 1000);
                    },
                    rejected: (err) => {

                    }
                })
                _index = 0;
                _cindex = 0;
            } else {
                _index = 0;
                _cindex = 0;
            }
        }


        this.setState({
            cindex: _index,
            ccindex: _cindex,
        }, () => {
            if (_cindex === 0 && _index === 0) {

            } else {
                // this.player.player.seek(0);
                this._onPlay();
            }
        })


    }

    _onSync(P_current) {
        const { duration, cindex, ccindex } = this.state;

        // if (this.sync % 4 == 0) {
        //     this.props.actions.course.learn({
        //         course_id: this.audio.courseId,
        //         chapter_id: this.audio.chapterList[cindex].chapterId,
        //         cchapter_id: this.audio.chapterList[cindex].child[ccindex].chapterId,
        //         duration: parseInt(P_current),
        //         levelId: this.levelId,
        //         resolved: (data) => {
        //         },
        //         rejected: (res) => {

        //         },
        //     })
        // }

        // if (this.sync % 2 == 0) {
        //     this.setState({
        //         t_left: (P_current * 1 / duration).toFixed(2)
        //     })

        //     if ((P_current / duration).toFixed(2) < 0.8) {
        //         this.setState({
        //             t_left: (P_current / duration).toFixed(2)
        //         })
        //     }
        //     this.setState({
        //         current: P_current,
        //     })
        // }

        // this.sync++;
        if(!this.state.pause){
            if ( P_current % 4 == 0) {
                this.props.actions.course.learn({
                    course_id: this.audio.courseId,
                    chapter_id: this.audio.chapterList[cindex].chapterId,
                    cchapter_id: this.audio.chapterList[cindex].child[ccindex].chapterId,
                    duration: parseInt(P_current),
                    levelId: this.levelId,
                    resolved: (data) => {
                    },
                    rejected: (res) => {
    
                    },
                })
            }
    
            this.setState({
                t_left: (P_current * 1 / duration).toFixed(2)
            })
    
            if ((P_current / duration).toFixed(2) < 0.8) {
                this.setState({
                    t_left: (P_current / duration).toFixed(2)
                })
            }
            this.setState({
                current: P_current,
            })
        }
    }

    _onSlider(value) {

        // this.setState({
        //     pause:false
        // })

        this.player.player.seek(value);
    }

    _onPlay() {
        const { actions } = this.props;
        const { cindex, ccindex, c_integral, canBuy } = this.state;

        if (c_integral > 0 && canBuy) {
            this.refs.hud.show('购买后才播放', 1);
        } else {

            if (this.audio.chapterList[cindex] && this.audio.chapterList[cindex].child[ccindex]) {
                const chapter = this.audio.chapterList[cindex].child[ccindex];

                actions.course.verify({
                    media_id: chapter.mediaId,
                    resolved: (data) => {
                        this.setState({
                            mediaId: chapter.mediaId,
                            cindex: cindex,
                            ccindex: ccindex,
                            duration: data.duration,
                            playUrl: data.m38u,
                            cchapterId: chapter.chapterId,
                            t_left: 0,
                            pause: false,
                            cchapterName: chapter.chapterName,
                            tip: true,
                        },()=>{
                            this.onLoad()
                        })
                    },
                    rejected: (res) => {

                    },
                })
            }
        }
    }

    _onStar1(score) {
        this.setState({
            techScore: score
        })
    }

    _onStar2(score) {
        this.setState({
            courseScore: score
        })
    }
    onBuys = (val) => {
        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                WeChat.launchMiniProgram({
                    userName: config.yc_wxapp, // 拉起的小程序的username
                    miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                    path: val.goodsLink
                });

            } else {
                Alert.alert('温馨提示', '请先安装微信');
            }
        })
    }

    _renderScore() {
        const { isScore } = this.state
        return (
            <Modal visible={isScore} transparent={true} onRequestClose={() => { }}>
                <View style={styles.scoreBox}>
                    <View style={[styles.evalBox]}>
                        <Image style={styles.modal_img} source={{ uri: "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png" }} />
                        <View style={[styles.d_flex, styles.fd_c, styles.pl_30]}>
                            <View style={[styles.ai_ct, styles.fd_r, styles.pt_12]}>
                                <Text style={[styles.lg_label, styles.black_label, styles.pr_15]}>讲师评分</Text>
                                <Star onChoose={this._onStar1} fontSize={28} />
                            </View>
                            <View style={[styles.ai_ct, styles.fd_r, styles.pt_12]}>
                                <Text style={[styles.lg_label, styles.black_label, styles.pr_15]}>课程评分</Text>
                                <Star onChoose={this._onStar2} fontSize={28} />
                            </View>
                        </View>
                        <View style={[styles.d_flex, styles.fd_r, styles.mt_30, styles.eval_btns]}>
                            <TouchableOpacity style={[styles.col_1, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.eval_btns_left, styles.pt_12, styles.pb_12]}
                                onPress={() => this.setState({ isScore: false })}>
                                <Text style={[styles.lg18_label, styles.tip_label]}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.pt_12, styles.pb_12]}
                                onPress={() => this._onAction('EvalSubmit')}>
                                <Text style={[styles.lg18_label, styles.c33_label]}>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    _renderItem(item) {

        const { navigation } = this.props
        const { totalTop, isFollow, cindex, ccindex, score } = this.state;
        const comment = item.item;
        const index = item.index;

        let lastIdx = this.citems.length - 1 !== index;


        if (index == 0) {
            return (
                <View style={[styles.ml_15, styles.mr_15, styles.mt_15]}>
                    <Text style={[styles.lg18_label, styles.lh20_label]}>{this.audio.courseName}</Text>
                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                        <View style={[styles.mt_20, styles.row, styles.ai_ct, styles.jc_fs]}>
                            <Score val={this.audio.score} />
                            <Text style={[styles.sm_label, styles.gray_label, styles.ml_10]}>综合评分 {score}</Text>
                        </View>
                        <TouchableOpacity style={[styles.title_btn, styles.ml_10, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.p_5, styles.pl_8, styles.pr_8]}
                            onPress={() => this._onAction('CoursePf')}
                        >
                            <Text style={[styles.sred_label, styles.sm_label]}>课程评分</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.mt_10, styles.row, styles.jc_sb]}>
                        <View>
                            <Text style={[styles.red_label, styles.lg_label, styles.fw_label]}>{this.audio.payType > 0 ? this.audio.integral + '学分' : '免费'}</Text>
                        </View>
                        <View>
                            <Text style={[styles.sm_label, styles.gray_label]}>共计{this.audio.chapter}讲 {this.audio.hit}人已学</Text>
                        </View>
                    </View>
                    {this.audio.teacherId > 0 ?
                        <View style={[styles.p_10, styles.bg_f7f, styles.mt_15]}>
                            <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                                <TouchableOpacity style={[styles.row, styles.ai_fs, styles.jc_fs, styles.pr_10]}
                                    onPress={() => navigation.navigate('Teacher', { teacher: this.audio.teacher })}
                                >
                                    <Image source={{ uri: this.audio.teacher.teacherImg }} style={styles.avatar_small} />
                                </TouchableOpacity>
                                <View style={[styles.fd_c, styles.col_1]}>
                                    <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                        <Text style={[styles.fd_r, styles.ai_ct]}>{this.audio.teacher.teacherName}</Text>
                                        <TouchableOpacity style={[styles.followBtn, styles.bg_white, styles.circle_5, styles.border_orange]} onPress={() => this._onAction('Follow')}>
                                            <Text style={[styles.orange_label, styles.sred_label]}>{isFollow ? '取消关注' : '+ 关注'}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>{this.audio.teacher.honor}</Text>

                                </View>
                            </View>
                            <Text style={[styles.sm_label, styles.gray_label, styles.lh18_label, styles.mt_10]}>{this.audio.teacher.content}</Text>
                        </View>
                        : null}

                    <View style={[styles.mt_15]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>课程介绍</Text>
                        <Text style={[styles.default_label, styles.gray_label, styles.lh20_label, styles.mt_10]}>
                            {this.audio.content}
                        </Text>
                    </View>
                </View>
            )
        } else if (index == 1) {
            return <View>
                <VodChapter items={this.audio.chapterList} cindex={cindex} ccindex={ccindex} style={styles.mt_15} onSelect={(cindex, ccindex) => {
                    this.setState({
                        cindex: cindex,
                        ccindex: ccindex,
                    }, () => {
                        this._onPlay();
                    })
                }} />
                {
                    this.audio.goodsList.length > 0 ?
                        <View style={[styles.border_top, styles.mt_10, styles.pl_15]}>
                            <Text style={[styles.lg_label, styles.fw_label, styles.black_label, styles.pt_12]}>相关产品</Text>
                            <View style={[styles.popularItem, styles.mt_20]}>
                                <ScrollView
                                    scrollX
                                    horizontal={true}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        this.audio.goodsList.map((good, index) => {
                                            return (
                                                <TouchableOpacity style={[{ width: 90 }, styles.fd_c, styles.pb_15]} onPress={() => this.onBuys(good)}>
                                                    <View style={[styles.imgBox, { width: 90, height: 90, paddingLeft: 8, paddingRight: 8, paddingTop: 8 }]}>
                                                        <Image source={{ uri: good.goodsImg }} mode='aspectFit' style={[styles.item_cover, styles.bgImg, { width: 90 - 16, height: 90 - 16 }]} />
                                                    </View>
                                                    <View style={[styles.fd_c, styles.pl_10, styles.jc_sb, styles.col_1, styles.mt_8]}>
                                                        <Text style={[styles.default_label, styles.c33_label, styles.fw_label]} numberOfLines={1}>{good.goodsName}</Text>
                                                        <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pr_10, styles.mt_5]}>
                                                            <Text style={[styles.sred_label, styles.default_label, styles.fw_label]}>¥{good.goodsPrice}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View> : null
                }
            </View>

        } else if (index == 2) {
            return (
                <View style={[styles.pt_15, styles.border_top, styles.pb_10, styles.ml_15, styles.mr_15, styles.mt_15]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>精选评论<Text style={[styles.tip_label, styles.default_label]}>({totalTop})</Text></Text>
                </View>
            )
        }

        return <CommentCell index={index} comment={comment} lastIdx={lastIdx}
            onReport={(index) => this._onAction('Report', { index: index })}
            onUserInfo={(index) => this._onAction('onUserInfo', { index, index })}
            onComment={(index) => this._onAction('onComment', { index, index })}
            onPraise={(index) => this._onAction('Praise', { index: index })} onPreview={(galleryList, index) => {
                let images = [];

                galleryList.map((gallery, i) => {
                    images.push({
                        url: gallery.fpath,
                    });
                });

                this.setState({
                    preview: true,
                    preview_index: index,
                    preview_imgs: images,
                });

            }}
        />;
    }

    _renderFooter() {
        const { navigation } = this.props;
        const { total, totalTop } = this.state


        return (
            <View>

                {
                    this.citems.length === 3 ?
                        <CommentEmpty />
                        : null}

                {
                    total > 0 ?
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.border_top]} onPress={() => navigation.navigate('Comment', { ctype: 3, content_id: this.audio.courseId, courseName: this.audio.courseName })}>
                            <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                        </TouchableOpacity>
                        : null}

            </View>


        );
    }

    render() {
        const { navigation } = this.props;
        const { loaded, cchapterId, duration, current, audioImg, playUrl, pause, speed, speed_idx, t_left, shareType, pindex, publishGift, user_nickname, giftImg, user_integral, preview, preview_imgs, preview_index, isCollect, collectNum, canBuy, c_integral, audlistType, mediaId } = this.state;



        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )

        return (
            <View style={[styles.container, styles.bg_white]}>
                <TouchableOpacity style={[styles.aud_head, styles.mt_20]}>
                    <Image source={{ uri: this.audio.courseImg }} style={[styles.headCover]} />
                </TouchableOpacity>
                {/*播放器*/}
                {/* <AudPlayer
                    ref={e => { this.player = e; }}
                    source={{
                        key: mediaId,
                        url: playUrl,
                        duration: duration,
                        speed: speed[speed_idx],
                        t_left: t_left,
                        paused: pause
                    }}
                    navigation={navigation}
                    onProgress={(duration) => {

                        this._onSync(duration);
                    }}

                    onEnd={() => {
                        this._onNext();
                    }}

                /> */}
                <View style={[styles.fd_c, styles.jc_ct, styles.mt_10, styles.sliderCons, styles.pl_15, styles.pr_15, styles.mb_10]}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        minimumTrackTintColor="#F4623F"
                        maximumTrackTintColor="#FFE0D9"
                        value={current}
                        thumbImage={asset.track}

                        onSlidingComplete={(value) => {
                            this.setState({
                                paused: false
                            })
                            // this.player.player.seek(value);
                            this.sound && this.sound.isPlaying() && this.sound.setCurrentTime(parseFloat(value));
                        }}
                    />
                    {/* <View style={[styles.sliderDot,{left:theme.window.width * 0.9 * t_left + theme.window.width * 0.08}]}>
                        <Text style={[styles.sm9_label, styles.white_label, styles.ml_5]}>{tool.formatSTime(current) + '/' + tool.formatSTime(duration)}</Text>
                    </View> */}
                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.sm_label, styles.tip_label]}>{tool.formatSTime(current)}</Text>
                        <Text style={[styles.sm_label, styles.tip_label]}>{tool.formatSTime(duration)}</Text>
                    </View>
                </View>

                {/* <View>
                    <AudSlider 
                        source={{
                            current:current,
                            duration:duration,
                            t_left:t_left
                        }}

                        onSlider={(value) => this._onSlider(value)}
                    />
                </View> */}

                {/* <View style={{height:20}}>
                    <Progress source={{
                        current:current,
                        duration:duration,
                        t_left:t_left
                    }} />
                </View> */}

                <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pl_15, styles.pr_15, styles.mt_10, styles.mb_10]} >
                    <TouchableOpacity style={[styles.pr_40, styles.fd_c, styles.ai_ct, styles.jc_ct]} onPress={() => this._onAction('aud_list')} >
                        <Image source={asset.audio.aud_list} style={[styles.aud_list]} />
                        <Text style={[styles.smm_label, styles.c33_label, styles.mt_5]}>播放列表</Text>
                    </TouchableOpacity>
                    <View style={[styles.col_1, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.audioPlay]}>
                        <TouchableOpacity onPress={() => this._onAction('aud_pre')}>
                            <Image source={asset.audio.aud_pre} style={[styles.aud_pre]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._onAction('pause')}>
                            <Image source={pause ? asset.audio.aud_pay : asset.audio.aud_pause} style={[styles.aud_pause]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._onAction('aud_next')}>
                            <Image source={asset.audio.aud_next} style={[styles.aud_next]} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.pl_40, styles.fd_c, styles.ai_ct, styles.jc_ct, styles.speedBox]} onPress={() => this._onAction('Speed')}>
                        <Image source={asset.audio.aud_speed} style={[styles.aud_speed]} />
                        <Text style={[styles.smm_label, styles.c33_label, styles.mt_5]}>倍速播放</Text>
                        <View style={styles.speedDot}>
                            <Text style={[styles.smm_label, styles.white_label]}>X{[speed[speed_idx]]}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Tabs items={['课程简介', '课程目录', `评论(${this.audio.comment})`]} selected={pindex} atype={1} onSelect={(index) => {
                    this.setState({
                        pindex: index
                    }, () => {
                        this.refs.scroll.scrollToIndex({
                            index: index,
                        })
                    })
                }} />

                <FlatList
                    ref={'scroll'}
                    data={this.citems}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    viewabilityConfig={{
                        waitForInteraction: true,
                        minimumViewTime: 100,
                        viewAreaCoveragePercentThreshold: 100,
                    }}
                    onViewableItemsChanged={this._onViewChange}
                />

                {
                    publishGift ?
                        <View style={[styles.goldbox]} >
                            <View style={[styles.goldbox_item, styles.d_flex, styles.fd_r, styles.ai_ct]}>
                                <Text style={[styles.sm_label, styles.white_label]}>{user_nickname} 送出  </Text>
                                <Image source={{ uri: giftImg }} style={[styles.giftimg]} />
                                <Text style={[styles.sm_label, styles.white_label]}> X1</Text>
                            </View>
                        </View>
                        : null}

                {
                    !(c_integral > 0 && canBuy) ?
                        <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                            <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f]} onPress={() => this._onAction('PublishComment')}>
                                <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Gift')}>
                                <Text style={[styles.icon, styles.tip_label]}>{iconMap('dashang')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Collect')}>
                                <Text style={[styles.icon, styles.tip_label, isCollect && styles.red_label]}>{iconMap(isCollect ? 'yishoucang' : 'weishoucang')}</Text>
                                <View style={[styles.count]}>
                                    <Text style={[styles.sm9_label, styles.white_label]}>{collectNum > 999 ? '999+' : collectNum}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        :

                        <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                            <TouchableOpacity style={[styles.p_5, styles.pl_12, styles.ai_ct]} onPress={() => this._onAction('Gift')}>
                                <Image source={asset.gift} style={{ width: 21, height: 21 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.p_5, styles.ai_ct, styles.pl_20]} onPress={() => this._onAction('PublishComment')}>
                                <Image source={asset.eval_icon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.p_5, styles.count_box, styles.ai_ct]} onPress={() => this._onAction('Collect')}>
                                <Image source={isCollect ? asset.collected : asset.heart_icon} style={{ width: 23, height: 20 }} />
                                <View style={[styles.count_left]}>
                                    <Text style={[styles.sm9_label, styles.white_label]}>{collectNum > 999 ? '999+' : collectNum}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buy_btn]} onPress={() => navigation.navigate('PayCourse', { course: this.audio })}>
                                <Text style={[styles.default_label, styles.white_label, styles.fw_label]}>立即购买</Text>
                            </TouchableOpacity>
                        </View>
                }

                {/* <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                    <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f]} onPress={() => this._onAction('PublishComment')}>
                        <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Gift')}>
                        <Text style={[styles.icon, styles.tip_label]}>{iconMap('dashang')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Collect')}>
                        <Text style={[styles.icon, styles.tip_label, isCollect && styles.red_label]}>{iconMap(isCollect ? 'yishoucang' : 'weishoucang')}</Text>
                        <View style={[styles.count]}>
                            <Text style={[styles.sm9_label, styles.white_label]}>{collectNum > 999 ? '999+' : collectNum}</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}



                <Gift gift={this.gift} ref={'gift'} integral={user_integral}
                    onSelect={(gift_id) => { this._onAction('Reward', { gift_id: gift_id }) }}
                    onBuy={(gift_id) => { this._onAction('onBuy', { gift_id: gift_id }) }}
                />

                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} />
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

                <Modal visible={audlistType} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={() => this.setState({ audlistType: false })}></TouchableOpacity>
                    <View style={styles.paylist}>
                        <View style={[styles.paycons]}>
                            <View style={[styles.payhead]}>
                                <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>播放列表（{this.audio.chapter}）</Text>
                            </View>
                            <ScrollView style={{ height: 200, overflowX: 'auto' }}>
                                <View style={[styles.pl_20, styles.pr_20,]}>

                                    {
                                        this.audio.chapterList && this.audio.chapterList.map((aud, index) => {
                                            return (
                                                <View key={'aud' + index}>
                                                    {
                                                        aud.child && aud.child.map((caud, idx) => {
                                                            const on = cchapterId === caud.chapterId;

                                                            return (
                                                                <TouchableOpacity style={[styles.fd_c, styles.paylist_item]} key={'caud' + idx}
                                                                    onPress={() => this._onAction('chapter', { index, idx })}
                                                                >
                                                                    <Text style={[styles.c33_label, styles.default_label, on && styles.sred_label]}>{index + 1 + '-' + (idx + 1) + ' ' + caud.chapterName}</Text>
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.mt_2]}>
                                                                        <Text style={[styles.sm_label, styles.tip_label,]}>{forTimer(caud.duration)}</Text>
                                                                        <Text style={[styles.sm_label, styles.tip_label, styles.ml_10]}>{`第${index + 1}章` + aud.chapterName}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                    }
                                                </View>

                                            )
                                        })
                                    }

                                </View>
                            </ScrollView>
                            <TouchableOpacity style={[styles.pt_15, styles.pb_15, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({ audlistType: false })}>
                                <Text style={[styles.c33_label, styles.lg_label]}>关闭</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.tip ?
                        <View style={[styles.tanp_box, styles.row, styles.jc_sb]}>
                            <View style={[styles.pics]}>
                                <Image source={{ uri: this.audio.courseImg }} style={[styles.pics]} />
                            </View>
                            <View style={[styles.tanp_body]}>
                                <View>
                                    <Text style={[styles.tanp_tit]}>{this.state.cchapterName.length>8?this.state.cchapterName.slice(0,8)+'...':this.state.cchapterName}</Text>
                                </View>
                                <View style={[styles.mt_5]}>
                                    <Text style={[styles.tanp_txt]}>时长{forTimer(duration)}</Text>
                                </View>
                            </View>
                            <View style={[styles.tanp_taps, styles.row, styles.jc_ct, styles.ai_ct]}>
                                <View style={[styles.btnss, styles.row, styles.jc_ct, styles.ai_ct]}>
                                    <TouchableOpacity onPress={() => this._onAction('pause')}>
                                        <Image source={pause ? asset.audio.aud_pay : asset.audio.aud_pause} style={[{ width: 12, height: 12 }]} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.row, styles.jc_ct, styles.ai_ct, styles.ml_10, styles.mr_10]}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ tip: false, pause: true })
                                    }}>
                                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/v2/asset/dete_icon.png' }} style={[{ width: 20, height: 20 }]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <View style={[styles.progs]}>
                        {
                            Platform.OS === 'android' ?
                                <ProgressBarAndroid indeterminate={false} color={'#FF5047'} style={{ width: '100%' }} progress={(current / duration)} styleAttr="Horizontal" />
                                :
                                <ProgressViewIOS progress={(current / duration)} style={{ width: '100%' }} trackTintColor={'#FFDFDE'} progressTintColor={'#FF5047'} />
                        }
                    </View> */}
                        </View> : null
                }

                {this._renderScore()}
                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    aud_head: {
        width: theme.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headCover: {
        height: 168,
        width: 168,
        shadowOffset: { width: 0, height: 0.5 },
        shadowColor: '#161616',
        shadowOpacity: 0.5,
        elevation: 1,
        borderRadius: 10
    },
    share_icon: {
        width: 20,
        height: 20
    },
    slider: {
        width: '100%',
        height: 20,
    },
    sliderCons: {
        position: 'relative',
        height: 30,
    },
    sliderDot: {
        position: 'absolute',
        top: 5,
        left: 0,
        backgroundColor: '#F4623F',
        borderRadius: 12,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 3,
        paddingBottom: 3
    },
    aud_list: {
        width: 19,
        height: 17
    },
    aud_pre: {
        width: 18,
        height: 18,
    },
    aud_next: {
        width: 18,
        height: 18,
    },
    aud_pause: {
        width: 20,
        height: 26,
    },
    aud_speed: {
        width: 15,
        height: 15,
    },
    speedBox: {
        position: 'relative'
    },
    speedDot: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#F4623F',
        width: 24,
        height: 12,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
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
    goldbox: {
        position: 'absolute',
        bottom: 100,
        left: 0,
    },
    paylist: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        borderRadius: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#ffffff'
    },

    paycons: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    payhead: {
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 12,
        marginBottom: 5,
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },

    paylist_item: {
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#EFEFEF'
    },

    goldbox_item: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        paddingLeft: 12,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },

    giftimg: {
        width: 12,
        height: 12,
        marginLeft: 5,
        marginRight: 5
    },
    followBtn: {
        width: 80,
        height: 24,
        borderRadius: 10,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar_small: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    count: {
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
    scoreBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    evalBox: {
        width: 280,
        height: 184,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative'
    },
    modal_img: {
        position: 'absolute',
        left: '50%',
        top: -230,
        width: 375,
        height: 260,
        marginLeft: -187.5,
    },
    eval_btns: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        borderStyle: 'solid'
    },
    eval_btns_left: {
        borderRightWidth: 1,
        borderRightColor: '#E5E5E5',
        borderStyle: 'solid'
    },
    title_btn: {
        backgroundColor: 'rgba(244,244,244,1)',
        borderRadius: 5,
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
    item_cover: {
        width: 136,
        height: 72,
        borderRadius: 5,
        backgroundColor: '#fafafa',
    },
    item_tips_hit: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 14,
        width: 40,
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cate_new_cover: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    cate_new_icon: {
        width: 18,
        height: 12
    },
    tanp_box: {
        width: 375,
        height: 60,
        backgroundColor: '#ffffff',
        position: 'absolute',
        left: 0,
        bottom: 50,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        elevation: 2,
    },
    pics: {
        width: 88,
        height: 60
    },
    tanp_body: {
        width: 200,
        height: 60,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 8
    },
    tanp_tit: {
        color: '#333333',
        fontSize: 13
    },
    tanp_txt: {
        color: '#999999',
        fontSize: 12
    },
    tanp_taps: {
        width: 87,
        height: 60
    },
    btnss: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#E3E3E3',
        borderStyle: 'solid',
        borderWidth: 1
    },
    progs: {
        width: 375,
        height: 5,
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'flex-end'
    }
});

export const LayoutComponent = Audio;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        gift: state.site.gift,
        info: state.course.info,
        infoScore: state.course.infoScore,
        comment: state.course.comment,
        commentTop: state.course.commentTop,
    };
}