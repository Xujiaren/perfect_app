import React, { Component } from 'react';
import { ActivityIndicator, Text, Image, View, StyleSheet, Linking, FlatList, TouchableOpacity, Modal, Platform, ImageBackground, DeviceEventEmitter, ScrollView, Alert } from 'react-native';
import _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as WeChat from 'react-native-wechat-lib';

import { config, asset, theme, iconMap } from '../../config';

import Tabs from '../../component/Tabs';

import { CommentEmpty } from '../../component/Empty';

import VodPlayer from '../../component/vod/VodPlayer';

import VodChapter from '../../component/vod/Chapter';
import Score from '../../component/Score';
import CommentCell from '../../component/cell/CommentCell';
import Star from '../../component/Star';
import GoodsCell from '../../component/cell/GoodsCell'

import Gift from '../../component/Gift';
import HudView from '../../component/HudView';
import * as  DataBase from '../../util/DataBase';

class Vod extends Component {

    static navigationOptions = ({ navigation }) => {
        const course = navigation.getParam('course', { courseName: '课程详情' });
        const fullscreen = navigation.getParam('fullscreen', false);


        let courseName = '课程详情'

        if (course.courseName != '' && course.courseName != undefined) {
            courseName = course.courseName
        }

        return {
            headerShown: !fullscreen,
            title: courseName,
            headerRight: (
                <View>
                    {
                        course.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', { title: course.courseName, img: course.courseImg, courseId: course.courseId, path: '/pages/index/courseDesc?course_id=' + course.courseId + '&courseName=' + course.courseName })} style={[styles.pr_15]}>
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
        this.lashType = navigation.getParam('lashType', 0);
        this.ctype = navigation.getParam('ctype', 0);
        this.levelId = navigation.getParam('levelId', 0);
        this.citems = [];
        this.gift = [];
        this.sellTop = [];

        this.sync = 0;

        this.state = {
            loaded: false,

            index: 0,

            cindex: 0,
            ccindex: 0,
            mediaId: '',
            playUrl: '',
            duration: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            gift: false,
            giftImg: '',
            publishGift: false,
            user_nickname: '',
            user_integral: 0,

            total: 0,
            totalTop: 0,
            isFollow: false,
            isCollect: false,
            collectNum: 0,

            pindex: 0,

            isScore: false,

            techScore: 0,
            courseScore: 0,

            shareType: false,

            canPlay: false,

            c_integral: 0,
            canBuy: false, // false  已购买 true 未购买

            finishWatch: false,
            sync_ts: 0,

            score: 0,

            beginUrl: '', // 课前外链
            endUrl: '',  // 课后外链
            beginUrlType: 0, // 0  无 1 问卷  2 试卷  课前外链类型
            endUrlType: 0, // 0  无 1 问卷  2 试卷  课后外链类型
            durs: 0,
            definition: '',
            breave: false
        };

        this._onRefresh = this._onRefresh.bind(this);
        this._onPlay = this._onPlay.bind(this);
        this._onNext = this._onNext.bind(this);
        this._onSync = this._onSync.bind(this);
        this._onAction = this._onAction.bind(this);

        this._onPreview = this._onPreview.bind(this);

        this._onViewChange = this._onViewChange.bind(this);

        this._renderFooter = this._renderFooter.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderScore = this._renderScore.bind(this);

        this._onStar1 = this._onStar1.bind(this);
        this._onStar2 = this._onStar2.bind(this);

        this._onShare = this._onShare.bind(this);
        this._toggleShare = this._toggleShare.bind(this);

        this._juageToast = this._juageToast.bind(this);

    }

    componentDidMount() {
        const { navigation, actions } = this.props
        this._onRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {

            const { params } = route.state

            actions.user.user()
            actions.course.commentTop(this.course.courseId);
            actions.course.infoCanPlay(this.course.courseId);

            DeviceEventEmitter.addListener('payStatus', (data) => { // 建立一个通知

                if (data.payStatus) {
                    actions.course.info(this.course.courseId);
                }

            });

            if (params.lashType && params.lashType === 1) {
                this.setState({
                    loaded: false,
                }, () => {
                    this.course = params.course;
                    actions.site.gift(0);
                    actions.course.info(this.course.courseId);
                    actions.course.comment(this.course.courseId, 0, 0);
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const { info, comment, gift, user, commentTop, navigation, infoScore, infoCanPlay, sellTop } = nextProps;

        if (!_.isEmpty(user)) {
            this.setState({
                user_integral: user.integral,
                user_nickname: user.nickname
            })
        }

        if (gift !== this.props.gift) {
            this.gift = gift;
        }

        if (info !== this.props.info) {
            this.course = info;

            // if (this.ctype == 49 && info.prePaperList.length > 0) {
            //     navigation.navigate('MeetPaper', {paper: info.prePaperList[0]})
            // }
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
            this.setState({
                collectNum: info.collectNum,
                isCollect: info.collect,
                isFollow: this.course.teacher && this.course.teacher.isFollow,
                loaded: true,
                canPlay: info.canPlay,
                c_integral: info.integral,
                canBuy: info.canBuy,
                score: info.score,
                finishWatch: info.finishWatch,
                beginUrlType: info.beginUrlType ? info.beginUrlType : 0,
                endUrlType: info.endUrlType ? info.endUrlType : 0,
                beginUrl: info.beginUrl,
                endUrl: info.endUrl,
            }, () => {
                DataBase.getItem('v' + info.courseId).then(data => {
                    if (data == null) {
                        this._onPlay();
                    } else {
                        this.setState({
                            cindex: data.cindex,
                            ccindex: data.ccindex,
                            durs: data.durations
                        }, () => {
                            this._onPlay();
                        })
                    }
                })
            })
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

        if (navigation !== this.props.navigation) {
            const { params } = navigation.state;
            if (params.shareType) {
                this._onShare();
            }
        }

        if (infoScore !== this.props.infoScore) {

            this.setState({
                score: infoScore.score,
                finishWatch: infoScore.finishWatch,
            })
        }

        if (infoCanPlay !== this.props.infoCanPlay) {

            this.setState({
                canPlay: infoCanPlay.canPlay,
            })
        }

        if (sellTop !== this.props.sellTop) {
            this.sellTop = sellTop;
        }
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
    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }

    _onRefresh() {
        const { actions } = this.props;

        this.setState({
            loaded: false,
        }, () => {
            actions.site.gift(0);
            actions.mall.sellTop();
            actions.course.info(this.course.courseId);
            actions.course.comment(this.course.courseId, 0, 0);
            actions.course.commentTop(this.course.courseId)
        })

    }
    _onDefinition = (vals) => {
        const { actions, user } = this.props;
        const { mediaId } = this.state;
        DataBase.getItem('v' + this.course.courseId).then(val => {
            actions.course.verify({
                media_id: mediaId,
                definition: vals,
                resolved: (data) => {
                    this.setState({
                        playUrl: data.m38u,
                        definition: vals
                    }, () => {
                        if (Platform.OS !== 'ios') {
                            setTimeout(() => {
                                this.player._onSeek(val.durations)
                            }, 900);
                        }
                    })
                }
            })
        })
    }
    _onPlay() {
        const { actions, user } = this.props;
        const { cindex, ccindex, c_integral, canBuy, canPlay, durs } = this.state;

        if (c_integral > 0 && canBuy) {

            this.refs.hud.show('购买后才能观看', 1);
        } else {

            if (canPlay) {
                if (this.ctype == 0) {
                    if (this.course.chapterList[cindex] && this.course.chapterList[cindex].child[ccindex]) {
                        const chapter = this.course.chapterList[cindex].child[ccindex];

                        actions.course.verify({
                            media_id: chapter.mediaId,
                            definition: this.state.definition,
                            resolved: (data) => {
                                this.setState({
                                    mediaId: chapter.mediaId,
                                    cindex: cindex,
                                    ccindex: ccindex,
                                    duration: data.duration,
                                    playUrl: data.m38u,
                                }, () => {
                                    if (this.state.durs > 0) {
                                        setTimeout(() => {
                                            this.player._onSeek(this.state.durs)
                                        }, 900);
                                    }
                                })
                            },
                            rejected: (res) => {

                            },
                        })
                    }
                } else {
                    actions.course.verify({
                        media_id: this.course.mediaId,
                        definition: this.state.definition,
                        resolved: (data) => {
                            this.setState({
                                mediaId: this.course.mediaId,
                                cindex: cindex,
                                ccindex: ccindex,
                                duration: data.duration,
                                playUrl: data.m38u,
                            }, () => {
                                if (this.state.durs > 0) {
                                    setTimeout(() => {
                                        this.player._onSeek(this.state.durs)
                                    }, 800);
                                }
                            })
                        },
                        rejected: (res) => {

                        },
                    })
                }

            } else {
                this.refs.hud.show('该课程仅对特定用户可见，请认证', 1);
            }



        }


    }

    _onNext() {
        let cindex = this.state.cindex;
        let ccindex = this.state.ccindex;

        const chapter = this.course.chapterList[cindex];
        const { actions, navigation } = this.props
        if (chapter && ccindex < chapter.child.length - 1) {
            ccindex++;
        } else if (cindex < this.course.chapterList.length - 1) {
            cindex++;
            ccindex = 0;
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
                cindex = 0;
                ccindex = 0;
            } else {
                cindex = 0;
                ccindex = 0;
            }
        }

        this.setState({
            cindex: cindex,
            ccindex: ccindex,
            durs: 0,
        }, () => {
            if (ccindex === 0 && cindex === 0) {

            } else {
                this._onPlay();
            }
        })
    }

    _onSync(duration) {
        const { actions } = this.props;
        const { cindex, ccindex, finishWatch } = this.state;

        if (this.course.chapterList[cindex] && this.course.chapterList[cindex].child[ccindex]) {
            if (this.sync % 16 == 0) {
                actions.course.learn({
                    course_id: this.course.courseId,
                    chapter_id: this.course.chapterList[cindex].chapterId,
                    cchapter_id: this.course.chapterList[cindex].child[ccindex].chapterId,
                    duration: duration,
                    levelId: this.levelId,
                    resolved: (data) => {
                    },
                    rejected: (res) => {

                    },
                })

            }
            if (this.sync % 4 == 0) {
                DataBase.setItem('v' + this.course.courseId, {
                    durations: duration,
                    cindex: cindex,
                    ccindex: ccindex,
                    chapter_id: this.course.chapterList[cindex].chapterId,
                    cchapter_id: this.course.chapterList[cindex].child[ccindex].chapterId,
                });
                if (!finishWatch) {
                    actions.course.infoScore(this.course.courseId);
                }
            }
            this.sync++;
        }


        this.setState({
            sync_ts: this.sync
        })


    }

    _onAction(action, args) {
        const { navigation, actions, user } = this.props;
        let { isCollect, collectNum, isFollow, techScore, courseScore, courseId, sync_ts, endKsUrl, beginWjUrl } = this.state;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (action == 'Follow') {

                if (isFollow) {
                    actions.teacher.removefollow({
                        teacherId: this.course.teacherId,
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
                        teacherId: this.course.teacherId,
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

                    navigation.navigate('PublishComment', { ctype: 3, content_id: this.course.courseId, isStar: 0, type: 0, whitetip: whitetip });

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
                    course_id: this.course.courseId,
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
            } else if (action == 'CoursePf') {

                this.setState({
                    isScore: true
                })

            } else if (action == 'EvalSubmit') {

                actions.home.publishcommt({
                    course_id: this.course.courseId,
                    score: courseScore,
                    content: '',
                    gallery: '',
                    teacher_score: techScore,
                    resolved: (data) => {
                        actions.course.infoScore(this.course.courseId);
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
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.course.courseName })
            } else if (action == 'onUserInfo') {
                let comment = this.citems[args.index];
                navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.course.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'onComment') {
                let comment = this.citems[args.index];
                navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.course.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'Question') {
                if (beginWjUrl !== '') {
                    navigation.navigate('VodLink', { title: '问卷', link: beginWjUrl })
                }
            } else if (action == 'Exam') {
                if (endKsUrl !== '') {
                    navigation.navigate('VodLink', { title: '考试', link: endKsUrl })
                }
            }
        }
    }

    _onPreCourse(type) {
        const { navigation, actions, user } = this.props;
        let { beginUrl, beginUrlType } = this.state;


        var title = '问卷';

        if (beginUrlType === 2) {
            title = '考试';
        }

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (beginUrlType === 2) {
                if (this.course.prePaperList.length > 0) {
                    navigation.navigate('StudyAnswer', { paper_id: this.course.prePaperList[0].paperId, levelId: 0, refresh: () => { this._onRefresh() } })
                } else {
                    navigation.navigate('VodLink', { title: title, linkId: beginUrl })
                }
            }
            if (beginUrlType === 1) {
                if (beginUrl) {
                    if (beginUrl.slice(0, 4) == 'http') {
                        navigation.navigate('VodLink', { title: title, linkId: beginUrl })
                    } else {
                        navigation.navigate('VodLink', { title: title, linkId: beginUrl })
                    }

                } else {
                    navigation.navigate('QuestSurvey', { activityId: 0, courseId: this.course.courseId, stype: 3 });
                }
            }

        }

    }

    // 判断 是否完成
    _juageToast() {
        this.refs.hud.show('请学完本次课程，再来考试 ', 1);
    }


    // 课后考试
    _onNextCourse(type) {

        const { navigation, actions, user } = this.props;
        let { finishWatch, endUrl, endUrlType } = this.state;

        var title = '问卷';

        if (endUrlType === 2) {
            title = '考试';
        }

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (finishWatch) {
                if (endUrlType === 2) {
                    if (this.course.endPaperList.length > 0) {
                        navigation.navigate('StudyAnswer', { paper_id: this.course.endPaperList[0].paperId, levelId: 0, refresh: () => { this._onRefresh() } })
                    } else {
                        navigation.navigate('VodLink', { title: title, linkId: endUrl })
                    }
                }
                if (endUrlType === 1) {
                    if (endUrl) {
                        if (endUrl.slice(0, 4) == 'http') {
                            navigation.navigate('VodLink', { title: title, linkId: endUrl })
                        } else {
                            navigation.navigate('VodLink', { title: title, linkId: endUrl })
                        }
                    } else {
                        navigation.navigate('QuestSurvey', { activityId: 0, courseId: this.course.courseId, stype: 4 });
                    }
                }

            } else {
                this._juageToast();
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

    _onPreview(galleryList, index) {
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
    }

    _onViewChange(info) {
        if (info.viewableItems.length > 0) {
            let pindex = info.viewableItems[0].index;
            if (pindex > 2) pindex = 2;

            this.setState({
                pindex: pindex,
            })
        }
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
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.border_top]} onPress={() => navigation.navigate('Comment', { ctype: 3, content_id: this.course.courseId, courseName: this.course.courseName })}>
                            <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                        </TouchableOpacity>
                        : null}

            </View>


        );
    }

    _onShare() {

        this.setState({
            shareType: true
        })

    }


    _renderItem(item) {
        const { navigation } = this.props
        const { totalTop, isFollow, cindex, ccindex, c_integral, sync_ts, score, finishWatch, beginUrl, endUrl, beginUrlType, endUrlType } = this.state;
        const comment = item.item;
        const index = item.index;

        let lastIdx = this.citems.length - 1 !== index;


        // beginUrl:'', // 课前外链
        // endUrl:'',  // 课后外链
        // beginUrlType:0, // 0  无 1 问卷  2 试卷  课前外链类型
        // endUrlType:0, // 0  无 1 问卷  2 试卷  课后外链类型

        if (index == 0) {
            return (
                <View style={[styles.ml_15, styles.mr_15, styles.mt_15]}>
                    <Text style={[styles.lg18_label, styles.lh20_label]}>{this.course.courseName}</Text>
                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                        <View style={[styles.mt_20, styles.row, styles.ai_ct, styles.jc_fs]}>
                            <Score val={score} />
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
                            <Text style={[styles.red_label, styles.lg_label, styles.fw_label]}>{this.course.payType > 0 ? this.course.integral + '学分' : '免费'}</Text>
                        </View>
                        <View>
                            <Text style={[styles.sm_label, styles.gray_label]}>共计{this.course.chapter}讲 {this.course.hit}人已学</Text>
                        </View>
                    </View>
                    {this.course.teacherId > 0 ?
                        <View style={[styles.p_10, styles.bg_f7f, styles.mt_15]}>
                            <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                                <TouchableOpacity style={[styles.row, styles.ai_fs, styles.jc_fs, styles.pr_10]}
                                    onPress={() => navigation.navigate('Teacher', { teacher: this.course.teacher })}
                                >
                                    <Image source={{ uri: this.course.teacher.teacherImg }} style={styles.avatar_small} />
                                </TouchableOpacity>
                                <View style={[styles.fd_c, styles.col_1]}>
                                    <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                        <Text style={[styles.fd_r, styles.ai_ct]}>{this.course.teacher.teacherName}</Text>
                                        <TouchableOpacity style={[styles.followBtn, styles.bg_white, styles.circle_5, styles.border_orange]} onPress={() => this._onAction('Follow')}>
                                            <Text style={[styles.orange_label, styles.sred_label]}>{isFollow ? '取消关注' : '+ 关注'}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>{this.course.teacher.honor}</Text>

                                </View>
                            </View>
                            <Text style={[styles.sm_label, styles.gray_label, styles.lh18_label, styles.mt_10]}>{this.course.teacher.content}</Text>
                        </View>
                        : null}

                    <View style={[styles.mt_15]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>课程介绍</Text>
                        <Text style={[styles.default_label, styles.gray_label, styles.lh20_label, styles.mt_10]}>
                            {this.course.content}
                        </Text>
                    </View>
                </View>
            )
        } else if (index == 1) {
            return <View>
                <VodChapter items={this.course.chapterList} cindex={cindex} ccindex={ccindex} style={styles.mt_15} onSelect={(cindex, ccindex) => {
                    this.setState({
                        cindex: cindex,
                        ccindex: ccindex,
                        durs: 0,
                    }, () => {
                        this._onPlay()
                    })
                }} />

                {
                    beginUrlType === 0 && endUrlType === 0 ?
                        null :
                        <View style={[styles.fd_r, styles.jc_sb, styles.pt_20, styles.ml_15, styles.mr_15, styles.testBtns]}>
                            {
                                beginUrlType === 0 ?
                                    null :
                                    <View style={{ width: (theme.window.width - 44) / 2, }}>
                                        <TouchableOpacity
                                            style={[styles.testBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, { backgroundColor: '#F4623F' }]}
                                            onPress={() => this._onPreCourse(0)}
                                        >
                                            <Text style={[styles.lg_label, styles.white_label]}>{beginUrlType === 1 ? '问卷' : '考试'}</Text>
                                        </TouchableOpacity>
                                    </View>

                            }
                            {
                                endUrlType === 0 ?
                                    null :
                                    <View style={{ width: (theme.window.width - 44) / 2, }}>
                                        {
                                            !finishWatch ?
                                                <TouchableOpacity style={[styles.testBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, { backgroundColor: '#999999' }]}
                                                    onPress={this._juageToast}
                                                >
                                                    <Text style={[styles.lg_label, styles.white_label]}>{endUrlType === 1 ? '问卷' : '考试'}</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    style={[styles.testBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, { backgroundColor: '#F4623F' }]}
                                                    onPress={() => this._onNextCourse(1)}
                                                >
                                                    <Text style={[styles.lg_label, styles.white_label]}>{endUrlType === 1 ? '问卷' : '考试'}</Text>
                                                </TouchableOpacity>
                                        }

                                    </View>

                            }
                        </View>
                }
                {
                    this.course.goodsList.length > 0 ?
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
                                        this.course.goodsList.map((good, index) => {
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

    _toggleShare = (type) => {
        const { actions } = this.props
        if (type === 0) {
            WeChat.shareWebpage({
                title: this.course.courseName,
                description: this.course.summary,
                thumbImageUrl: this.course.courseImg,
                webpageUrl: config.cUrl + '/event/share/course.html?id=' + this.course.courseId,
                scene: 0
            }).then(data => {
                actions.course.shareCourse({
                    course_id: this.course.courseId,
                    resolved: (res) => {
                    }
                })
                this.setState({
                    shareType: false,
                }, () => {
                    this.refs.hud.show('分享成功', 1);
                })
            }).catch(error => {

            })
        } else if (type === 1) {
            WeChat.shareWebpage({
                title: this.course.courseName,
                description: this.course.summary,
                thumbImageUrl: this.course.courseImg,
                webpageUrl: config.cUrl + '/event/share/course.html?id=' + this.course.courseId,
                scene: 1
            }).then(data => {
                actions.course.shareCourse({
                    course_id: this.course.courseId,
                    resolved: (res) => {
                    }
                })
                this.setState({
                    shareType: false,
                }, () => {
                    this.refs.hud.show('分享成功', 1);
                })
            }).catch(error => {

            })
        }
    }
    forRight = (val) => {
        if (val) {
            this.setState({
                breave: true
            })
        } else {
            this.setState({
                breave: false
            })
        }
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

    render() {
        const { navigation, user } = this.props;
        const { loaded, pindex, preview, preview_imgs, preview_index, isCollect, collectNum, user_integral, mediaId, playUrl, duration, isScore, shareType, user_nickname, publishGift, giftImg, canPlay, canBuy, c_integral, breave } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )
        return (
            <View style={[styles.container, styles.bg_white]}>
                {
                    !(_.isEmpty(user)) ?
                        <View>
                            {
                                mediaId.length === 0 ?
                                    <ImageBackground source={{ uri: this.course.courseImg }} style={[styles.image_cover]} >
                                    </ImageBackground>
                                    :
                                    <View>
                                        {
                                            canPlay ?
                                                <View style={{ zIndex: 999 }}>
                                                    <VodPlayer
                                                        ref={e => { this.player = e; }}
                                                        source={{
                                                            cover: this.course.courseImg,
                                                            key: mediaId,
                                                            url: playUrl,
                                                            duration: duration,
                                                            levelId: this.levelId
                                                        }}
                                                        navigation={navigation}
                                                        onEnd={() => {
                                                            this._onNext();
                                                        }}

                                                        onProgress={(duration) => {
                                                            this._onSync(duration);
                                                        }}

                                                        onFullscreen={(full) => {
                                                            navigation.setParams({ fullscreen: full })
                                                        }}
                                                        onDefin={(val) => {
                                                            this._onDefinition(val)
                                                        }}
                                                        forRight={(val) => {
                                                            this.forRight(val)
                                                        }}
                                                    />
                                                </View>
                                                :
                                                <ImageBackground source={{ uri: this.course.courseImg }} style={[styles.image_cover]} >
                                                </ImageBackground>
                                        }

                                    </View>

                            }
                        </View>
                        :
                        <ImageBackground source={{ uri: this.course.courseImg }} style={[styles.image_cover]} >
                            <View style={[styles.pay_layer, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                {/* <TouchableOpacity  style={[styles.pay_btn]} onPress={()=> navigation.navigate('PayCourse',{course:this.course})}>
                                    <Text style={[styles.sm_label,styles.white_label]}>收费观看</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity style={[styles.pay_btn]} onPress={() => navigation.navigate('PassPort')}>
                                    <Text style={[styles.sm_label, styles.white_label]}>登录后观看</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                }

                {
                    breave ?
                        null :
                        <Tabs items={['课程简介', '课程目录', `评论(${this.course.comment})`]} selected={pindex} atype={1} onSelect={(index) => {
                            this.setState({
                                pindex: index
                            }, () => {
                                this.refs.scroll.scrollToIndex({
                                    index: index,
                                })
                            })
                        }} />

                }
                {
                    breave ?
                        null :
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
                }
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
                    !(c_integral > 0 && canBuy) && !breave ?
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
                        : (c_integral > 0 && canBuy) && !breave ?
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
                                <TouchableOpacity style={[styles.buy_btn]} onPress={() => navigation.navigate('PayCourse', { course: this.course })}>
                                    <Text style={[styles.default_label, styles.white_label, styles.fw_label]}>立即购买</Text>
                                </TouchableOpacity>
                            </View>
                            : null
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




                <Gift gift={this.gift} ref={'gift'} integral={user_integral} onSelect={(gift_id) => {
                    this._onAction('Reward', { gift_id: gift_id })
                }} />
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



                {this._renderScore()}

                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
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
    title_btn: {
        backgroundColor: 'rgba(244,244,244,1)',
        borderRadius: 5,
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
    image_cover: {
        width: theme.window.width,
        height: theme.window.width * 0.5625,
    },

    pay_layer: {
        width: theme.window.width,
        height: theme.window.width * 0.5625,
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    pay_btn: {
        width: 120,
        height: 30,
        backgroundColor: '#F4623F',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    testBtns: {
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: '#F0F0F0',
        marginTop: 15,
        paddingTop: 20,
    },
    testBtn: {
        flex: 1,
        height: 42,
        borderRadius: 5,
    },
    imgBox: {
        position: 'relative',
    },
    tips: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    vip_tips: {
        height: 15,
        width: 43,
        backgroundColor: '#FFEB3B',
    },
    lect_tips: {
        height: 15,
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: '#FF635B'
    },
    limit_tips: {
        position: 'absolute',
        top: 4,
        left: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        height: 15,
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: '#FF635B'
    },
    popu_tips: {
        position: 'absolute',
        top: 4,
        left: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 15,
        width: 26,
        borderTopLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    bgImg: {
        backgroundColor: '#F8F8F8'
    }

});

export const LayoutComponent = Vod;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        gift: state.site.gift,
        info: state.course.info,
        infoScore: state.course.infoScore,
        comment: state.course.comment,
        commentTop: state.course.commentTop,
        infoCanPlay: state.course.infoCanPlay,
        sellTop: state.mall.sellTop,
    };
}
