import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Image, Modal, Linking, DeviceEventEmitter } from 'react-native'

import _ from 'lodash';
import Scratch from '../../component/Scratch';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as WeChat from 'react-native-wechat-lib';
import CommentCell from '../../component/cell/CommentCell';
import HudView from '../../component/HudView';
import HtmlView from '../../component/HtmlView';
import { CommentEmpty } from '../../component/Empty';

import * as  DataBase from '../../util/DataBase';
import { formatTimeStampToTime } from '../../util/common';

import { config, asset, theme, iconMap } from '../../config';

class Activity extends Component {

    static navigationOptions = ({ navigation }) => {
        const activity = navigation.getParam('activity', { title: '活动详情' });
        const fullscreen = navigation.getParam('fullscreen', false);
        return {
            headerShown: !fullscreen,
            title: activity.title,
            headerRight: (
                <View>
                    {
                        activity.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', { title: activity.title, img: activity.activityImg, path: '/subPages/pages/find/activityDesc?activityId=' + activity.activityId + '&articleName=' + activity.title + '&atype=' + activity.atype })} style={[styles.pr_15]}>
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
        this.activity = navigation.getParam('activity', {});
        this.citems = [];
        this.voteList = [];
        this.state = {
            total: 0,
            totalTop: 0,
            comment: 0,
            loaded: false,
            isFollow: false,
            isCollect: false,
            collectNum: 0,
            num: 0,
            follow: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            canApply: false,

            isApply: false,

            atype: 0,  // 0 无活动类型  2 主题活动 3 投票 4 问卷
            ctype: 0,   //  {atype = 2 >   16 视频  17 图片} {}
            status: 0,  // 1 未开始 2 进行中 3 已结束
            activiType: 0, // 0 未开始 马上参加不显示 1 马上参加发布作品  2 进行中 展示投票 投票  3 投票时间截止展示排名 
            autoType: 0, // 自主投票  0 未开始 1 进行中 2 已结束
            voteList: [], //  投票
            isShow: false, // 是否显示刮刮卡 
            isBack: 0, // 0 本页面 1 上一个页面 
            showVote: 0, // 0 不显示 1 显示
            etype: 20, // 14/点赞  20/投票
            beginTime: 0,
            endTime: 0,
            signendTime: 0,
            voteendTime: 0,

            topicDTO: {},
            answer_list: {},
            isVideo: false,
            vid_url: '',
            isLoading: false,
            shareType: false,
            showScratch: false
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onAction = this._onAction.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._toSignUp = this._toSignUp.bind(this);
        this._onRefuse = this._onRefuse.bind(this);
        this.onViewImgs = this.onViewImgs.bind(this);

        this._loadData = this._loadData.bind(this);
        this._questSurvey = this._questSurvey.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        const { activity, pComment, pCommentTop, user, navigation } = nextProps;

        var nowTime = new Date();
        let newtime = nowTime.getTime();

        if (pComment !== this.props.pComment) {

            this.setState({
                total: pComment.total,
            })
        }
        if (navigation !== this.props.navigation) {
            const { params } = navigation.state;
            if (params.shareType) {
                this._onShare();
            }
        }
        if (pCommentTop !== this.props.pCommentTop) {

            this.citems = pCommentTop.items;
            this.setState({
                totalTop: pCommentTop.total,
            })
        }

        if (activity !== this.props.activity) {
            this.activity = activity
            this.setState({
                loaded: true,
                isCollect: activity.isCollect,
                comment: activity.comment,
                isFollow: activity.isFollow,
                num: activity.num,
                follow: activity.follow,
                collectNum: activity.collect,
                canApply: activity.canApply,
                isApply: activity.isApply,
                beginTime: activity.beginTime,
                signendTime: activity.signendTime,
                voteendTime: activity.voteendTime,
                endTime: activity.endTime,
                etype: activity.etype,
                atype: activity.atype, //
                ctype: activity.ctype,
                status: activity.status,
                topicDTO: activity.topicDTO,
                showVote: activity.showVote,
            }, () => {
                if (newtime < activity.beginTime * 1000) {
                    this.setState({
                        activiType: 0,
                    })
                    if (activity.atype === 3) {
                        this.setState({
                            autoType: 0
                        })
                    }
                } else if (newtime < activity.signendTime * 1000 && newtime > activity.beginTime * 1000) {
                    this.setState({
                        activiType: 1
                    })
                } else if (newtime < activity.voteendBeginTime * 1000 && newtime > activity.signendTime * 1000) {
                    this.setState({
                        activiType: 9
                    })
                } else if (newtime < activity.voteendTime * 1000 && newtime > activity.voteendBeginTime * 1000) {
                    this.setState({
                        activiType: 2
                    })
                } else if (newtime > activity.showTime * 1000) {
                    this.setState({
                        activiType: 3
                    })
                }

                if (newtime > activity.beginTime * 1000 && newtime < activity.endTime * 1000) {
                    this.setState({
                        autoType: 1
                    })
                }

                if (newtime > activity.endTime * 1000) {
                    if (activity.atype === 4) {
                        this.setState({
                            activiType: 4
                        })
                    }

                    if (activity.atype === 3) {
                        this.setState({
                            autoType: 2
                        })
                    }
                }


            })
        }


    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }
    _onShare() {
        if (this.activity.canShare == 0) {
            this.refs.hud.show('不可分享', 1);
        } else {
            this.setState({
                shareType: true
            })
        }

    }
    _onRefresh() {
        const { actions } = this.props;

        actions.user.user()
        actions.activity.activity(this.activity.activityId);
        actions.site.pComment(this.activity.activityId, 2, 0, 0);
        actions.site.pCommentTop(this.activity.activityId, 2, 2, 0);
    }

    _toggleShare = (type) => {

        if (type === 0) {
            WeChat.shareWebpage({
                title: this.activity.title,
                description: this.activity.subTitle,
                thumbImageUrl: this.activity.activityImg,
                webpageUrl: config.cUrl + '/event/share/activity.html?id=' + this.activity.activityId,
                scene: 0
            }).then(data => {
                this.setState({
                    shareType: false,
                }, () => {
                    this.refs.hud.show('分享成功', 1);
                })
            }).catch(error => {

            })
        } else if (type === 1) {
            WeChat.shareWebpage({
                title: this.activity.title,
                description: this.activity.subTitle,
                thumbImageUrl: this.activity.activityImg,
                webpageUrl: config.cUrl + '/event/share/activity.html?id=' + this.activity.activityId,
                scene: 1
            }).then(data => {
                this.setState({
                    shareType: false,
                }, () => {
                    this.refs.hud.show('分享成功', 1);
                })
            }).catch(error => {

            })
        }
    }
    componentDidMount() {
        const { navigation } = this.props
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })
    }


    _toSignUp(activityId, ctype) {

        const { user, navigation } = this.props;

        const { beginTime, signendTime } = this.state;
        var nowTime = new Date();
        let newtime = nowTime.getTime();

        if (_.isEmpty(user)) {

            navigation.navigate('PassPort');

        } else {

            if (newtime < signendTime * 1000 && newtime > beginTime * 1000) {

                navigation.navigate('ActivitySignUp', { activityId: this.activity.activityId, ctype: ctype, signendTime: signendTime, beginTime: beginTime })

            } else {
                this.refs.hud.show('时间已截止', 2);
            }
        }

    }


    _onRefuse() {
        this.refs.hud.show('很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！', 2);
    }

    onViewImgs(pics) {

        let images = [];

        images.push({
            url: pics,
        });

        this.setState({
            preview: true,
            preview_index: 0,
            preview_imgs: images,
        });

    }


    // 跳转 调查问卷
    _questSurvey() {
        const { navigation } = this.props;

        navigation.navigate('QuestSurvey', { activityId: this.activity.activityId });
    }


    onLinkPress = (evt, href) => {

        const { navigation } = this.props;

        let adlink = href;
        if (href.substring(0, 4) === 'http') {

            navigation.navigate('AdWebView', { link: href })

        }else{
            if (adlink.indexOf('courseDesc') !== -1) {
    
                let courseId = adlink.split('=')[1]
                const couse = { 'courseId': courseId.split("&")[0] };
                navigation.navigate('Vod', { course: couse, courseName: '' });

            } else if (adlink.indexOf('consultDesc') !== -1) {

                let courseId = adlink.split('=')[1]
                const article = { 'articleId': courseId.split("&")[0] };
                navigation.navigate('Article', { article: article })

            } else if (adlink.indexOf('liveDesc') !== -1) {

                let courseId = adlink.split('=')[1];
                let courseName = '直播';

                if (adlink.split('=').length === 3) {
                    courseName = adlink.split('=')[2]
                }

                const course = { 'courseId': courseId.split("&")[0], courseName: courseName };

                navigation.navigate('Live', { course: course })
            } else if (adlink.indexOf('activityDesc') !== -1) {
                let acts = adlink.split('=')[1]
                request.get('/activity/' + acts.split("&")[0])
                    .then(res => {
                        navigation.navigate('Activity', { activity: res })
                    })
            } else if (adlink.indexOf('mailDesc') !== -1) {
                let goodsId = adlink.split('=')[1];
                request.get('/shop/goods/' + goodsId)
                    .then(res => {
                        navigation.navigate('MailDetail', { cate: res })
                    })
            } else if(adlink='/comPages/pages/user/downLoad'){
                navigation.navigate('Channel')
            }
        }
    }
    _renderHeader() {


        const { navigation } = this.props;
        const { isFollow, follow, num, totalTop, canApply, activiType, isApply, atype, ctype, etype, topicDTO, autoType, showVote, shareType } = this.state;

        let html = this.activity.content;
        html = html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');


        let pushArr = []
        if (topicDTO !== null) {
            pushArr = Array.isArray(topicDTO.optionList) ? topicDTO.optionList : []
        }

        return (
            <View style={[styles.wrapdesc]}>
                <Image source={{ uri: this.activity.activityImg }} style={[styles.headCover]} />
                <View style={[styles.d_flex, styles.fd_c, styles.mt_10]}>
                    <Text style={[styles.lg18_label, styles.c33_label, styles.fw_label]}>{this.activity.title}</Text>
                    <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>活动时间：{formatTimeStampToTime(this.activity.beginTime * 1000)} - {formatTimeStampToTime(this.activity.endTime * 1000)}</Text>
                    <View style={[styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                        <Text style={[styles.sm_label, styles.tip_label]}>{follow}人关注{this.activity.atype !== 0 ? `·${num}人参加` : ''}</Text>
                        <TouchableOpacity style={[styles.focusBtn]}
                            onPress={() => this._onAction('Follow')}
                        >
                            <Text style={[styles.sred_label, styles.sm_label]}>{isFollow ? '已关注' : '关注'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.d_flex, styles.fd_c, styles.mt_15]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>活动详情</Text>
                    <View style={[styles.cons, styles.bg_white, styles.pt_10]}>
                        <HtmlView html={html || ''} type={1} onLinkPress={this.onLinkPress} />
                    </View>
                </View>

                <View style={[styles.act_box]}>

                    {/* atype === 2主题投票 ; activiType:0 , // 0 未开始 马上参加不显示 1 马上参加发布作品  2 进行中 展示投票 投票  3 投票时间截止展示排名 */}
                    {
                        atype === 2 ?
                            <View>
                                {
                                    activiType === 1 && !isApply ?
                                        <View style={[styles.wrapbtm]}>
                                            {
                                                canApply ?
                                                    <TouchableOpacity style={[styles.wrapbox]}
                                                        onPress={() => this._toSignUp(this.activity.activityId, ctype)}
                                                    >
                                                        <Text style={[styles.default_label, styles.white_label]}>马上参加</Text>
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity style={[styles.wrapbox, { backgroundColor: '#BFBFBF' }]} onPress={this._onRefuse}>
                                                        <Text style={[styles.default_label, styles.white_label]}>马上参加</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                        : null}

                                {/* 作品展示/投票 */}
                                {
                                    activiType === 2 ?
                                        <TouchableOpacity style={[styles.makeBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.ml_20, styles.mr_20, styles.mb_20, styles.mt_10, !canApply && { backgroundColor: '#BFBFBF' }]}
                                            onPress={() => this._onAction('toVote')}
                                        >
                                            <Text style={[styles.default_label, styles.white_label]} >我要{etype === 14 ? '点赞' : '投票'}</Text>
                                        </TouchableOpacity>

                                        : null}
                                  {
                                    activiType === 3||activiType === 4 ?
                                        <TouchableOpacity style={[styles.makeBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.ml_20, styles.mr_20, styles.mb_20, styles.mt_10, !canApply && { backgroundColor: '#BFBFBF' }]}
                                            onPress={() => this._onAction('toVote')}
                                        >
                                            <Text style={[styles.default_label, styles.white_label]} >查看作品</Text>
                                        </TouchableOpacity>

                                        : null}

                            </View>
                            : null}

                    {/* 投票   19文字  17图片 16视频*/}

                    {
                        atype === 3 ?
                            <View>
                                {
                                    ctype === 19 ?
                                        <View style={[styles.votes, styles.pl_5, styles.pr_5]}>

                                            <View style={[styles.fd_c, styles.mb_10, styles.mt_15]}>
                                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>投票主题</Text>
                                                <Text style={[styles.default_label, styles.c33_label, styles.mt_10]}>{this.activity.rule}</Text>
                                            </View>

                                            {
                                                pushArr.map((push, index) => {
                                                    return (
                                                        <View style={[styles.vote, styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mb_10]} key={'push' + index}>
                                                            <Text style={[styles.default_label, styles.c30_label, styles.pl_20, styles.col_1, styles.pr_5]} >{push.optionLabel}</Text>
                                                            {
                                                                topicDTO.canVote && autoType === 1 ?
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.pr_10]}>
                                                                        {
                                                                            showVote === 1 ?
                                                                                <Text style={[styles.default_label, styles.sred_label]}>{push.num}票</Text>
                                                                                : null}
                                                                        <TouchableOpacity style={[styles.voteBtn]} onPress={() => this._onAction('onVote', { push: push })}>
                                                                            <Text style={[styles.white_label, styles.default_label]}>投票</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    :
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.pr_10]}>
                                                                        {
                                                                            showVote === 1 ?
                                                                                <Text style={[styles.default_label, styles.sred_label]}>{push.num}票</Text>
                                                                                : null}
                                                                        <View style={[styles.voteBtn, { backgroundColor: '#BFBFBF' }]}>
                                                                            <Text style={[styles.white_label, styles.default_label]}>{push.canVote ? '投票' : '已投票'}</Text>
                                                                        </View>
                                                                    </View>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }

                                        </View>
                                        : null}

                                {
                                    ctype === 17 ?
                                        <View style={[styles.fd_c]}>
                                            <View style={[styles.fd_c, styles.mb_10, styles.mt_15]}>
                                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>投票主题</Text>
                                                <Text style={[styles.default_label, styles.c33_label, styles.mt_10]}>{this.activity.rule}</Text>
                                            </View>
                                            <View style={[styles.voteList, styles.mb_15, styles.fd_r, styles.jc_sb]}>
                                                {
                                                    pushArr.map((push, idx) => {
                                                        return (
                                                            <View style={[styles.pic_item]} key={'pic', idx}>
                                                                <View style={[styles.m_10, styles.fd_c]}>
                                                                    <TouchableOpacity onPress={() => this.onViewImgs(push.url)}>
                                                                        <Image source={{ uri: push.url }} style={[styles.pic_itemCover]} />
                                                                    </TouchableOpacity>
                                                                    <View style={[styles.fd_r, styles.jc_sb, styles.mt_10]}>
                                                                        <Text style={[styles.default_label, styles.c33_label, styles.fw_label]} numberOfLines={1}>{push.optionLabel}</Text>
                                                                    </View>
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.jc_sb, styles.mt_5]}>
                                                                        {
                                                                            showVote === 1 ?
                                                                                <Text style={[styles.sred_label, styles.default_label]}>{push.num}票</Text>
                                                                                : null}
                                                                        {
                                                                            topicDTO.canVote && autoType === 1 ?
                                                                                <TouchableOpacity style={[styles.pic_voteBtn, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={() => this._onAction('onVote', { push: push })}>
                                                                                    <Text style={[styles.white_label, styles.default_label]}>投票</Text>
                                                                                </TouchableOpacity>
                                                                                :
                                                                                <View style={[styles.pic_voteBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, { backgroundColor: '#BFBFBF' }]}>
                                                                                    <Text style={[styles.white_label, styles.default_label]}>{push.canVote ? '投票' : '已投票'}</Text>
                                                                                </View>
                                                                        }
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>

                                        : null}

                                {
                                    ctype === 16 ?
                                        <View style={[styles.fd_c]}>
                                            <View style={[styles.fd_c, styles.mb_10, styles.mt_15]}>
                                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>投票主题</Text>
                                                <Text style={[styles.default_label, styles.c33_label, styles.mt_10]}>{this.activity.rule}</Text>
                                            </View>
                                            <View style={[styles.voteList, styles.mb_15, styles.fd_r, styles.jc_sb]}>
                                                {
                                                    pushArr.map((push, idx) => {
                                                        return (
                                                            <View style={[styles.vid_item]} key={'pic', idx}>
                                                                <View style={[styles.m_10, styles.fd_c]}>

                                                                    <TouchableOpacity style={[styles.videoBox]}
                                                                        onPress={() => this._onAction('Video', { url: push.url })}
                                                                    >
                                                                        <Video
                                                                            paused={true}
                                                                            ref={e => { this.player = e; }}
                                                                            source={{ uri: push.url }}
                                                                            poster={push.url + '?x-oss-process=video/snapshot,t_2000,m_fast'}
                                                                            style={[styles.pic_video]}
                                                                        />
                                                                        <View style={[styles.videoCons]}>
                                                                            <Image source={asset.video_icon} style={[styles.video_icon]} />
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    <Text style={[styles.default_label, styles.c33_label, styles.fw_label]} numberOfLines={2}>{push.optionLabel}</Text>
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.jc_sb, styles.mt_5]}>
                                                                        {
                                                                            showVote === 1 ?
                                                                                <Text style={[styles.sred_label, styles.default_label]}>{push.num}票</Text>
                                                                                : null}
                                                                        {
                                                                            topicDTO.canVote && autoType === 1 ?
                                                                                <TouchableOpacity style={[styles.pic_voteBtn, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={() => this._onAction('onVote', { push: push })}>
                                                                                    <Text style={[styles.white_label, styles.default_label]}>投票</Text>
                                                                                </TouchableOpacity>
                                                                                :
                                                                                <View style={[styles.pic_voteBtn, styles.fd_r, styles.ai_ct, styles.jc_ct, { backgroundColor: '#BFBFBF' }]}>
                                                                                    <Text style={[styles.white_label, styles.default_label]}>{push.canVote ? '投票' : '已投票'}</Text>
                                                                                </View>
                                                                        }
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>

                                        : null}
                            </View>
                            : null}

                    {
                        atype === 4 ?
                            <View>
                                {
                                    activiType === 4 ?
                                        <View style={[styles.makeBtn, { backgroundColor: '#BFBFBF' }]}>
                                            <Text style={[styles.default_label, styles.white_label]}>时间已截止</Text>
                                        </View>
                                        : null}
                                {
                                    (activiType === 2 || activiType === 1 || activiType === 3 || activiType === 9) && !this.activity.isFinish ?
                                        <TouchableOpacity style={[styles.makeBtn, canApply ? {} : { backgroundColor: '#BFBFBF' }]}
                                            onPress={canApply ? this._questSurvey : this._onRefuse}
                                        >
                                            <Text style={[styles.default_label, styles.white_label]}>开始问卷</Text>
                                        </TouchableOpacity>
                                        : null}
                            </View>
                            : null}
                </View>


                {/* <TouchableOpacity style={[styles.makeBtn,!canApply&&styles.bg_bf]}
                    onPress={()=>this._onAction('questSurvey')}
                >
                    <Text style={[styles.default_label,styles.white_label]}>开始问卷</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={[styles.makeBtn,!canApply&&styles.bg_bf]}
                    onPress={()=>this._onAction('ActivitySignUp')}
                >
                    <Text style={[styles.default_label,styles.white_label]}>发布作品</Text>
                </TouchableOpacity> 
                
                <TouchableOpacity style={[styles.makeBtn,!canApply&&styles.bg_bf]}
                    onPress={()=>this._onAction('ActivityProduction')}
                >
                    <Text style={[styles.default_label,styles.white_label]}>我要投票</Text>
                </TouchableOpacity>  */}
                <View style={[styles.pt_15, styles.border_top, styles.pb_10, styles.mr_15, styles.mt_15]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>精选评论<Text style={[styles.tip_label, styles.default_label]}>({totalTop})</Text></Text>
                </View>

            </View>
        )
    }

    _renderItem(item) {
        const { navigation } = this.props;
        const comment = item.item;
        const index = item.index;
        let lastIdx = this.citems.length - 1 !== index;

        return <CommentCell index={index} comment={comment} lastIdx={lastIdx}
            onReport={(index) => this._onAction('Report', { index: index })}
            onPraise={(index) => this._onAction('Praise', { index: index })}
            onUserInfo={(index) => this._onAction('onUserInfo', { index, index })}
            onComment={(index) => this._onAction('onComment', { index, index })}
            onPreview={(galleryList, index) => {
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

            }} />;
    }

    _renderFooter() {
        const { navigation } = this.props;
        const { total, totalTop } = this.state

        return (
            <View>

                {
                    this.citems.length === 0 ?
                        <CommentEmpty />
                        : null}

                {
                    total > 0 ?
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.border_top]}
                            onPress={() => navigation.navigate('Comment', { ctype: 2, content_id: this.activity.activityId, courseName: this.activity.title })}
                        >
                            <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                        </TouchableOpacity>
                        : null}

            </View>


        );
    }






    _onAction(action, args) {

        const { actions, navigation, user } = this.props;
        let { isCollect, isFollow, collectNum, canApply, etype, ctype, answer_list } = this.state;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (action == 'PublishComment') {

                let whitetip = 0;

                DataBase.getItem('whitetip').then(data => {
                    if (data != null) {
                        whitetip = data
                    }

                    navigation.navigate('PublishComment', { ctype: 2, content_id: this.activity.activityId, isStar: 0, type: 1, whitetip: whitetip });

                });
            } else if (action == 'Collect') {
                if (isCollect) {
                    actions.user.aremovecollect({
                        content_id: this.activity.activityId,
                        ctype: 2,
                        resolved: (data) => {
                            collectNum--;
                            this.setState({
                                isCollect: false,
                                collectNum: collectNum
                            })
                            this.refs.hud.show('取消成功', 1);
                        },
                        rejected: (msg) => {

                        },
                    })
                } else {
                    actions.user.acollect({
                        content_id: this.activity.activityId,
                        ctype: 2,
                        resolved: (data) => {
                            collectNum++;
                            this.setState({
                                isCollect: true,
                                collectNum: collectNum
                            })
                            this.refs.hud.show('收藏成功', 1);
                        },
                        rejected: (msg) => {

                        },
                    })
                }
            } else if (action == 'Follow') {
                if (canApply) {
                    if (isFollow) {
                        actions.user.aremoveFollow({
                            content_id: this.activity.activityId,
                            ctype: 2,
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
                        actions.user.auserfollow({
                            content_id: this.activity.activityId,
                            ctype: 2,
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
                } else {
                    this.refs.hud.show('很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！', 1);
                }
            } else if (action == 'questSurvey') {
                if (canApply) {
                    navigation.navigate('QuestSurvey', { activityId: this.activity.activityId })
                } else {
                    this.refs.hud.show('很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！', 1);
                }
            } else if (action == 'ActivitySignUp') {
                navigation.navigate('ActivitySignUp', { activityId: this.activity.activityId })
            } else if (action == 'ActivityProduction') {
                navigation.navigate('ActivityProduction', { activityId: this.activity.activityId,type: ctype, etype: etype,activiType:this.state.activiType })
            } else if (action == 'Report') {

                let comment = this.citems[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.activity.title });

            } else if (action == 'toVote') {
                if (!canApply) {
                    this.refs.hud.show('很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！', 2);
                    return;
                } else {
                    navigation.navigate('ActivityProduction', { activityId: this.activity.activityId, ctype: ctype, etype: etype,activiType:this.state.activiType })
                }
            } else if (action === 'onVote') {

                const push = args.push;

                if (!canApply) {
                    this.refs.hud.show('很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！', 2);
                    return;
                } else {
                    let answer_arr_num = (push.optionId + '').split(",").map(Number);
                    answer_list[parseInt(push.topicId)] = answer_arr_num;

                    actions.activity.activityAnswer({
                        activity_id: this.activity.activityId,
                        answer: JSON.stringify(answer_list),
                        resolved: (data) => {
                            actions.activity.activity(this.activity.activityId);
                            this.setState({
                                showScratch: true
                            })
                        },
                        rejected: (msg) => {

                        }
                    })
                }
            } else if (action === 'Video') {
                const url = args.url;

                this.setState({
                    vid_url: url,
                    isVideo: true
                })
            } else if (action == 'onUserInfo') {
                let comment = this.citems[args.index];
                navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.activity.title, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'onComment') {
                let comment = this.citems[args.index];
                navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.activity.title, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
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

            }
        }


    }


    _keyExtractor(item, index) {
        return index + '';
    }


    // 下啦刷新
    _loadData() {

        this._onRefresh();
        this.setState({
            isLoading: true
        })
        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        }, 2000);
    }
    _onLoadCallBack = () => {
        this.setState({
            showScratch: false
        })
        this._onRefresh()
    }
    render() {
        const { isCollect, collectNum, preview, preview_imgs, preview_index, loaded, isVideo, vid_url, isLoading, shareType } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )

        return (
            <View style={[styles.container, styles.bg_white]}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.citems}
                    extraData={this.state}
                    //下拉刷新
                    refreshing={isLoading}
                    onRefresh={() => {
                        this._loadData(); //下拉刷新加载数据
                    }}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
                />
                <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                    <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f]} onPress={() => this._onAction('PublishComment')}>
                        <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Collect')}>
                        <Text style={[styles.icon, styles.tip_label, isCollect && styles.red_label]}>{iconMap(isCollect ? 'yishoucang' : 'weishoucang')}</Text>
                        <View style={[styles.count]}>
                            <Text style={[styles.sm9_label, styles.white_label]}>{collectNum > 999 ? '999+' : collectNum < 0 ? 0 : collectNum}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} />
                </Modal>

                <Modal visible={isVideo} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={() => this.setState({ isVideo: false })}></TouchableOpacity>
                    <View style={[styles.row,styles.jc_ct,styles.ai_ct,{position:'absolute',top:theme.window.height*0.3,left:0}]}>
                        <Video
                            ref={e => { this.player = e; }}
                            source={{ uri: vid_url }}
                            poster={vid_url + '?x-oss-process=video/snapshot,t_2000,m_fast'}
                            style={[styles.modal_video]}
                        />
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
                <HudView ref={'hud'} />
                {
                    this.state.showScratch ?
                        <Scratch actions={this.props.actions} scratchId={this.activity.activityId} success={() => {
                            this._onLoadCallBack()
                        }} />
                        : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    wrapdesc: {
        margin: 15,
    },
    headCover: {
        width: '100%',
        height: 130,
        borderRadius: 5,
        backgroundColor: '#fbfbfb',
    },
    focusBtn: {
        width: 55,
        height: 22,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(244, 98, 63, 1)',
    },
    cons: {
        paddingBottom: 10,
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
    bg_bf: {
        backgroundColor: '#BFBFBF'
    },
    makeBtn: {
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
        height: 36,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4623F'
    },
    wrapbtm: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,1)'
    },
    wrapbox: {
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        height: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4623F',
        flex: 1
    },
    vote: {
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },
    voteBtn: {
        width: 70,
        height: 32,
        backgroundColor: '#F4623F',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,
    },
    pic_item: {
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        width: (theme.window.width - 40) / 2,
    },
    pic_itemCover: {
        width: '100%',
        height: 130,
    },
    pic_voteBtn: {
        width: 60,
        height: 24,
        backgroundColor: '#F4623F',
        borderRadius: 5,
    },
    voteList: {
        flexWrap: 'wrap'
    },
    vid_item: {
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        width: (theme.window.width - 40) / 2,
    },
    videoBox: {
        position: 'relative',
        width: '100%',
        height: 130,
        marginBottom: 10,
    },
    videoCons: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 130,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pic_video: {
        width: '100%',
        height: 130,
        marginBottom: 15,
    },
    video_icon: {
        width: 36,
        height: 36,
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    wechatType: {
        position: 'absolute',
        top: '50%',
        left: 0,
        width: theme.window.width,
        marginTop: -(theme.window.width * 0.5625 / 2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal_video: {
        width: theme.window.width,
        height: theme.window.width * 0.5625,
    },
    share_icon: {
        width: 20,
        height: 20
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
})

export const LayoutComponent = Activity;

export function mapStateToProps(state) {
    return {
        activity: state.activity.activity,
        pComment: state.site.pComment,
        pCommentTop: state.site.pCommentTop,
        user: state.user.user,
        joinInfo: state.activity.joinInfo,
    };
}
