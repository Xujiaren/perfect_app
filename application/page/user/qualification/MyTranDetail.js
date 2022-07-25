import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl, DeviceEventEmitter } from 'react-native';
import _ from 'lodash';
import HtmlView from '../../../component/HtmlView';
import HudView from '../../../component/HudView';
import CommentCell from '../../../component/cell/CommentCell';
import * as  DataBase from '../../../util/DataBase';
import { config, asset, theme, iconMap } from '../../../config';
import { dateDiff, formatTimeStampToTime, getExactTimes } from '../../../util/common';


class MyTranDetail extends Component {

    static navigationOptions = ({ navigation }) => {

        const o2o = navigation.getParam('o2o', { squadName: '活动报名' });
        let url = ''
        let o2oDetail = o2o
        let type = 0
        let nowTimes = (new Date()).getTime();
        if (o2oDetail.applyBegin * 1000 > nowTimes) {
            type= 0
        } else if (o2oDetail.applyBegin * 1000 < nowTimes && o2oDetail.applyEnd * 1000 > nowTimes) {
            if (o2oDetail.canApply) {
                type= 1
            } else {
                type= 2
            }
        } else if (o2oDetail.applyEnd * 1000 < nowTimes) {
            type= 3
        }
        if(o2o.stype==8){
            url = '/subPages/pages/user/qualification/downActivity?squadId=' + o2o.squadId + '&squadName=' + o2o.squadName+ '&type= 0' + '&stype=0'
        }else{
            url = '/subPages/pages/user/qualification/myTranDetail?squadId=' + o2o.squadId + '&squadName=' + o2o.squadName+'&type= '+type + '&stype=0'
        }
        return {
            title: o2o.squadName,
            headerRight: (
                <View>
                    {
                        o2o.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', { title: o2o.squadName, img: o2o.squadImg, path: url})} style={[styles.pr_15]}>
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
        this.nowTime = (new Date()).getTime();
        this.o2o = navigation.getParam('o2o', {});
        this.stype = navigation.getParam('stype', 0);
        this.citems = []
        this.state = {
            loaded: false,
            type: 0,
            enrollNum: 0,
            registeryNum: 0,
            stype: this.stype,
            squadId: 0,
            userId: 0,
            isRefreshing: false,
            totalTop: 0,
            preview: false,
            preview_index: 0,
            preview_imgs: [],
        }

        this._singUp = this._singUp.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { o2oDetail, user, pCommentTop } = nextProps;



        if (o2oDetail !== this.props.o2oDetail) {
            this.o2o = o2oDetail
            this.setState({
                loaded: true,
                enrollNum: o2oDetail.enrollNum,
                registeryNum: o2oDetail.registeryNum,
                stype: o2oDetail.stype,
                squadId: o2oDetail.squadId,
            })

            // if(o2oDetail.hasFlag){
            //     // 报名开始时间 大于 当前时间 

            // } else {
            //     this.setState({
            //         type:4
            //     })
            // }
            if (o2oDetail.applyBegin * 1000 > this.nowTime) {
                this.setState({
                    type: 0
                })
            } else if (o2oDetail.applyBegin * 1000 < this.nowTime && o2oDetail.applyEnd * 1000 > this.nowTime) {
                if (o2oDetail.canApply) {
                    this.setState({
                        type: 1
                    })
                } else {
                    this.setState({
                        type: 2
                    })
                }
            } else if (o2oDetail.applyEnd * 1000 < this.nowTime) {
                this.setState({
                    type: 3
                })
            }
        }
        if (pCommentTop !== this.props.pCommentTop) {

            this.citems = pCommentTop.items;
            this.setState({
                totalTop: pCommentTop.total,
            })
        }
        if (user !== this.props.user) {
            this.setState({
                userId: user.userId
            })
        }
    }

    componentDidMount() {

        const { navigation, actions } = this.props;
        actions.train.o2oDetail(this.o2o.squadId);
        actions.user.user();
        actions.site.pCommentTop(this.o2o.squadId, 54, 2, 0);
    }

    _onRefresh() {
        const { actions } = this.props;
        actions.train.o2oDetail(this.o2o.squadId);

        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        }, 2000)
    }

    _singUp() {
        const { navigation, user } = this.props;

        const { userId, enrollNum, registeryNum, stype, squadId } = this.state;

        if (userId > 0) {
            if (enrollNum <= registeryNum) {
                this.refs.hud.show('报名人数已满', 2);
            } else {
                navigation.navigate('MyTrainClassSignUp', { squad_id: squadId, applyBegin: this.o2o.applyBegin, applyend: this.o2o.applyend, refresh: this._onRefresh })
            }
        } else {
            navigation.navigate('PassPort')
        }
    }
    _onAction = (action, args) => {
        const { actions, navigation, user } = this.props;
        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (action == 'PublishComment') {
                let whitetip = 0;

                DataBase.getItem('whitetip').then(data => {
                    if (data != null) {
                        whitetip = data
                    }

                    navigation.navigate('PublishComment', { ctype: 54, content_id: this.o2o.squadId, isStar: 0, type: 1, whitetip: whitetip });

                });
            } else if (action == 'Report') {

                let comment = this.citems[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.activity.title });

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

    render() {
        const { navigation } = this.props;
        const { loaded, type, totalTop } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )

        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            tintColor="#2c2c2c"
                            title="加载中..."
                            titleColor="#2c2c2c"
                            colors={['#2c2c2c', '#2c2c2c', '#2c2c2c']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    <View style={[styles.content_wrap]}>
                        <View style={[styles.img_wrap]}>
                            <Image style={[styles.class_img]} source={{ uri: this.o2o.squadImg }} />
                        </View>
                        <View style={[styles.title]}>
                            <Text style={[styles.c33_label, styles.lg18_label, styles.fw_label]}>{this.o2o.squadName}</Text>
                        </View>
                        {
                            this.o2o.summary.length > 0 ?
                                <Text style={[styles.gray_label, styles.sm_label]}>{this.o2o.summary}</Text>
                                : null}
                        <View style={[styles.fd_r, styles.jc_sb, styles.mb_5, styles.mt_5]}>
                            <Text style={[styles.tip_label, styles.sm_label]}>报名时间：{getExactTimes(this.o2o.applyBegin)} - {getExactTimes(this.o2o.applyEnd)}</Text>
                        </View>
                        <View style={[styles.fd_r, styles.jc_sb, styles.mb_5,]}>
                            <Text style={[styles.tip_label, styles.sm_label]}>活动时间：{getExactTimes(this.o2o.beginTime)} - {getExactTimes(this.o2o.endTime)}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}>{dateDiff(this.o2o.pubTime)}</Text>
                        </View>
                        <View style={[styles.fd_r, styles.jc_sb, styles.mb_5,]}>
                            <Text style={[styles.tip_label, styles.sm_label]}>招生人数：{this.o2o.enrollNum}  报名人数：{this.o2o.registeryNum}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}>地点：{this.o2o.location}</Text>
                        </View>
                    </View>
                    <View style={[styles.cons, styles.bg_white, styles.pl_15, styles.pr_15]}>
                        <HtmlView html={this.o2o.content} type={1} onLinkPress={this.onLinkPress} />
                    </View>
                    {
                        this.o2o.stype === 8 ?
                            <View style={[styles.btn_wrap]}>
                                {
                                    type === 0 ?
                                        <View style={[styles.btn, styles.lock]} >
                                            <Text>未开始</Text>
                                        </View>
                                        : null}
                                {
                                    type === 1 ?
                                        <TouchableOpacity style={[styles.btn]} hoverClass='on_btn' onPress={() => this._singUp()}>
                                            <Text style={[styles.white_label, styles.default_label]}>立即报名</Text>
                                        </TouchableOpacity>
                                        : null}
                                {
                                    type === 2 ?
                                        <View style={[styles.btn, styles.lock]} >
                                            <Text style={[styles.white_label, styles.default_label]}>已报名</Text>
                                        </View>
                                        : null}
                                {
                                    type === 3 ?
                                        <View style={[styles.btn, styles.lock]} >
                                            <Text style={[styles.white_label, styles.default_label]}>已结束</Text>
                                        </View>
                                        : null}
                                {
                                    type === 4 ?
                                        <View style={[styles.btn, styles.lock]}>
                                            <Text style={[styles.white_label, styles.default_label]}>暂无报名权限</Text>
                                        </View>
                                        : null}
                            </View>
                            : null
                    }
                    {
                        this.o2o.stype === 8 ?
                            <View style={[styles.content_wrap]}>
                                <View style={[styles.pt_15, styles.border_top, styles.pb_10, styles.mr_15, styles.mt_15]}>
                                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>精选评论<Text style={[styles.tip_label, styles.default_label]}>({totalTop})</Text></Text>
                                </View>
                                {
                                    this.citems.map((item, idx) => {
                                        let comment = item;
                                        let index = idx;
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

                                    })
                                }
                            </View>
                            : null
                    }
                    {
                        this.o2o.stype == 8 ?
                            <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.border_top]}
                                onPress={() => navigation.navigate('Comment', { ctype: 54, content_id: this.o2o.squadId, courseName: this.o2o.title })}
                            >
                                <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                            </TouchableOpacity>
                            : null
                    }

                </ScrollView>
                {
                    this.o2o.stype !== 8 ?
                        <View style={[styles.btn_wrap]}>
                            {
                                type === 0 ?
                                    <View style={[styles.btn, styles.lock]} >
                                        <Text>未开始</Text>
                                    </View>
                                    : null}
                            {
                                type === 1 ?
                                    <TouchableOpacity style={[styles.btn]} hoverClass='on_btn' onPress={() => this._singUp()}>
                                        <Text style={[styles.white_label, styles.default_label]}>立即报名</Text>
                                    </TouchableOpacity>
                                    : null}
                            {
                                type === 2 ?
                                    <View style={[styles.btn, styles.lock]} >
                                        <Text style={[styles.white_label, styles.default_label]}>已报名</Text>
                                    </View>
                                    : null}
                            {
                                type === 3 ?
                                    <View style={[styles.btn, styles.lock]} >
                                        <Text style={[styles.white_label, styles.default_label]}>已结束</Text>
                                    </View>
                                    : null}
                            {
                                type === 4 ?
                                    <View style={[styles.btn, styles.lock]}>
                                        <Text style={[styles.white_label, styles.default_label]}>暂无报名权限</Text>
                                    </View>
                                    : null}
                        </View>
                        :
                        <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                            <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f]} onPress={() => this._onAction('PublishComment')}>
                                <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Collect')}>
                                <Text style={[styles.icon, styles.tip_label, isCollect && styles.red_label]}>{iconMap(isCollect ? 'yishoucang' : 'weishoucang')}</Text>
                                <View style={[styles.count]}>
                                    <Text style={[styles.sm9_label, styles.white_label]}>{collectNum > 999 ? '999+' : collectNum < 0 ? 0 : collectNum}</Text>
                                </View>
                            </TouchableOpacity> */}
                        </View>
                }
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FBFDFF',
    },
    content_wrap: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingRight: 15
    },
    title: {
        paddingTop: 15,
        paddingBottom: 5
    },
    class_img: {
        width: '100%',
        height: 130,
    },
    btn_wrap: {
        paddingTop: 8,
        paddingBottom: 8,
        width: '100%',
        borderTopColor: '#F0F0F0',
        borderTopWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#ffffff'
    },
    btn: {
        height: 30,
        width: theme.window.width - 30,
        marginLeft: 15,
        borderRadius: 5,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lock: {
        backgroundColor: '#CBCBCB'
    },
    share_icon: {
        width: 20,
        height: 20
    },
})

export const LayoutComponent = MyTranDetail;

export function mapStateToProps(state) {
    return {
        o2oDetail: state.train.o2oDetail,
        user: state.user.user,
        pCommentTop: state.site.pCommentTop,
    };
}


