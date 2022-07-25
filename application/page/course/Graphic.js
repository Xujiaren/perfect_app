import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Linking, Image, TouchableOpacity, DeviceEventEmitter, FlatList, Modal, ScrollView, Alert } from 'react-native';

import _ from 'lodash';
import HtmlView from '../../component/HtmlView';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as WeChat from 'react-native-wechat-lib';
import Gift from '../../component/Gift';
import HudView from '../../component/HudView';
import CommentCell from '../../component/cell/CommentCell';
import { CommentEmpty } from '../../component/Empty';

import { config, asset, theme, iconMap } from '../../config';

import * as  DataBase from '../../util/DataBase';

class Graphic extends Component {

    static navigationOptions = ({ navigation }) => {

        const course = navigation.getParam('course', { courseName: '图文课程' });
        return {
            title: course.courseName,
            headerRight: (
                <View>
                    {
                        course.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => {
                                DeviceEventEmitter.emit('share', { title: course.courseName, img: course.courseImg,courseId:course.courseId, path: '/pages/index/grapWbdesc?course_id=' + course.courseId + '&courseName=' + course.courseName })
                            }} style={[styles.pr_15]}>
                                <Image source={asset.share_icon} style={styles.share_icon} />
                            </TouchableOpacity>
                    }
                </View>
            ),
        }
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;

        this.course = navigation.getParam('course', {});
        this.levelId = navigation.getParam('levelId', 0);
        this.lodding = null

        this.citems = [];
        this.gift = [];
        this.state = {
            loaded: false,
            index: 0,

            preview: false,
            preview_index: 0,
            preview_imgs: [],


            total: 0,
            totalTop: 0,
            collectNum: 0,
            isCollect: false,

            gift_id: 0,
            user_nickname: '',
            gift: false,
            giftImg: '',
            publishGift: false,
            user_integral: 0,
            gift_integral: 0,

        };

        this._onRefresh = this._onRefresh.bind(this);
        this._onAction = this._onAction.bind(this);
        this._onPreview = this._onPreview.bind(this);

        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {

        const { navigation, actions } = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {

            const { params } = navigation.state
            const { course } = params


            actions.user.user();

            actions.course.info(course.courseId);
            this._onRefresh();
        })
        if (this.levelId != 0) {
            setTimeout(() => {
                actions.course.learnGrap({
                    course_id: course.courseId,
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
            }, 60000);
        }
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {

        const { info, comment, gift, user, commentTop } = nextProps;

        if (!_.isEmpty(user)) {
            this.setState({
                user_integral: user.integral,
                user_nickname: user.nickname
            })
        }

        if (info !== this.props.info) {
            this.course = info
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
                loaded: true,
                isLike: info.isLike,
                likeNum: info.likeNum,
                collectNum: info.collectNum,
                isCollect: info.collect,
                loaded: true
            })
        }



        if (!_.isEqual(commentTop, this.props.commentTop)) {
            this.citems = commentTop.items;
            this.setState({
                totalTop: commentTop.total,
            })
        }

        if (comment !== this.props.comment) {

            this.setState({
                total: comment.total,
            })
        }

        if (gift !== this.props.gift) {
            this.gift = gift;
        }
    }

    _onRefresh() {
        const { actions } = this.props;

        this.setState({
            loaded: false
        }, () => {
            actions.site.gift(0);
            // actions.course.info(this.course.courseId);
            actions.course.comment(this.course.courseId, 0, 0);
            actions.course.commentTop(this.course.courseId)
        })
    }
    _onLink(courseId, courseName, ctype) {

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                if (ctype === 0) {
                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/courseDesc?course_id=' + courseId + '&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                } else if (ctype === 1) {
                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/audioDesc?course_id=' + courseId + '&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                }

            } else {
                Alert.alert('温馨提示', '请先安装微信');
                setTimeout(() => {
                    this.props.navigation.goBack()
                }, 3000);
            }
        })
    }
    _onAction(action, args) {
        const { navigation, actions, user } = this.props;
        let { isCollect, collectNum } = this.state;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (action == 'Praise') {
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
            } else if (action == 'Report') {
                let comment = this.citems[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.course.courseName })
            } else if (action == 'onUserInfo') {
                let comment = this.citems[args.index];
                navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.course.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'onComment') {
                let comment = this.citems[args.index];
                navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.course.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            }
        }
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

    onLinkPress = (evt, href) => {

        const { navigation } = this.props;


        if (href.substring(0, 4) === 'http') {

            navigation.navigate('AdWebView', { link: href })

        } else {

            if (href.indexOf('courseDesc') !== -1) {

                let c_Id = href.split('=')[1]
                const vodcouse = { 'courseId': c_Id.split("&")[0] };
                navigation.navigate('Vod', { course: vodcouse, courseName: '' });

            } else if (href.indexOf('consultDesc') !== -1) {

                let courseId = href.split('=')[1]
                const vodarticle = { 'articleId': courseId.split("&")[0] };
                navigation.navigate('Article', { article: vodarticle })


            }else if (href.indexOf('liveDesc') !== -1) {

                let courseId = href.split('=')[1];
                let courseName = '直播';

                if (href.split('=').length === 3) {
                    courseName = href.split('=')[2]
                }

                const course = { 'courseId': courseId.split("&")[0], courseName: courseName };

                navigation.navigate('Live', { course: course })
            } else if (href.indexOf('activityDesc') !== -1) {
                let acts = href.split('=')[1]
                request.get('/activity/' + acts.split("&")[0])
                    .then(res => {
                        navigation.navigate('Activity', { activity: res })
                    })
            } else if (href.indexOf('mailDesc') !== -1) {
                let goodsId = href.split('=')[1];
                request.get('/shop/goods/' + goodsId)
                    .then(res => {
                        navigation.navigate('MailDetail', { cate: res })
                    })
            }
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

    _renderHeader() {

        const { totalTop, loaded } = this.state;


        return (
            <View>
                <View style={[styles.ml_15, styles.mr_15, styles.mt_15]}>
                    <Image style={[styles.cover]} resizeMode={'contain'} source={{ uri: this.course.courseImg }} />
                    <Text style={[styles.lg18_label, styles.c33_label, styles.fw_label, styles.mt_15, styles.mb_10]}>{this.course.courseName}</Text>
                    <View style={[styles.row, styles.jc_sb]}>
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            {this.course.teacherId > 0 ?
                                <Image style={[styles.avatar]} source={{ uri: this.course.teacher.teacherImg }} />
                                : null}
                            <Text style={[styles.default_label, styles.black_label, styles.mr_10]}>{this.course.teacherName || '油葱学堂'}</Text>
                            <Text style={[styles.default_label, styles.tip_label]}>{this.course.pubTimeFt}</Text>
                        </View>
                        <View>
                            <Text style={[styles.default_label, styles.tip_label]}>{this.course.hit}人已阅</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.pl_15,styles.pr_15]}>
                    <HtmlView html={this.course.content} type={1} onLinkPress={this.onLinkPress} />
                </View>
                <View style={[styles.ml_15, styles.mr_15]}>
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
                    <View style={[styles.pt_15, styles.border_top, styles.pb_10]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>精选评论<Text style={[styles.tip_label, styles.default_label]}>({totalTop})</Text></Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderFooter() {
        const { navigation } = this.props;
        const { total } = this.state

        return (
            <View>

                {
                    this.citems.length === 0 ?
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

    _renderItem(item) {
        const comment = item.item;
        const index = item.index;

        let lastIdx = this.citems.length - 1 !== index

        return <CommentCell index={index} comment={comment} lastIdx={lastIdx}
            onUserInfo={(index) => this._onAction('onUserInfo', { index, index })}
            onComment={(index) => this._onAction('onComment', { index, index })}
            onReport={(index) => this._onAction('Report', { index: index })}
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

    render() {
        const { loaded, isCollect, collectNum, preview, preview_index, preview_imgs, gift, gift_id, gift_integral, user_integral, user_nickname, giftImg, publishGift } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )

        const gifts = _.chunk(this.gift, 8);

        const reward_enable = user_integral >= gift_integral && gift_id > 0;

        return (
            <View style={[styles.container]}>
                <FlatList
                    data={this.citems}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
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
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const hstyles = StyleSheet.create({
    div: {
        overflow: 'hidden'
    },
})

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    share_icon: {
        width: 20,
        height: 20
    },
    cover: {
        width: theme.window.width - 30,
        height: 130,
        borderRadius: 5,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
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
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        marginBottom: 40,
    },
    gift_box: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
    gift: {
        width: theme.window.width,
        height: (theme.window.width / 2) * 0.8,
    },
    gift_dot: {
        backgroundColor: '#C5C5C5',
        width: 6,
        height: 6,
        borderRadius: 3,
        borderColor: '#C5C5C5',
        marginTop: 60,
        marginBottom: 5,
        marginLeft: 6,
        marginRight: 6,
    },
    gift_dot_on: {
        backgroundColor: '#545454',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 60,
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

export const LayoutComponent = Graphic;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        gift: state.site.gift,
        info: state.course.info,
        comment: state.course.comment,
        user: state.user.user,
        commentTop: state.course.commentTop
    };
}
