import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter, Modal } from 'react-native';

import _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';
import HtmlView from '../../component/HtmlView';
import RefreshListView, { RefreshState } from '../../component/RefreshListView';
import CommentCell from '../../component/cell/CommentCell';
import HudView from '../../component/HudView';
import * as WeChat from 'react-native-wechat-lib';
import { config, asset, theme, iconMap } from '../../config';

import { dateDiff } from '../../util/common'
import * as  DataBase from '../../util/DataBase';
class Question extends Component {

    static navigationOptions = {
        header: null,
    };

    ask = this.props.navigation.getParam('ask', { askId: 0, title: '' })

    state = {
        loaded: false,
        sort: 0,
        status: 1000,
        statusBarHeight: global.statusBarHeight, //状态栏的高度
        navHeight: global.navigationHeight,

        refreshState: RefreshState.Idle,

        isFollow: false,
        reply_index: 0,

        preview: false,
        preview_index: 0,
        preview_imgs: [],
        shareType: false,
        citem: [],
    }

    page = 0
    pages = 1
    item = []
    itms = []
    citem = []

    componentDidMount() {
        const { actions } = this.props;
        actions.user.user();
        actions.ask.ask(this.ask.askId)
        this._onHeaderRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const { ask, reply } = nextProps;

        if (ask !== this.props.ask) {
            this.ask = ask
            this.citem = ask.commentList
            this.setState({
                isFollow: ask.isFollow,
                loaded: true,
                citem: ask.commentList
            })
        }

        if (reply !== this.props.reply) {
            this.item = this.item.concat(reply.items)
            this.pages = reply.pages
        }
        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }


    _onSelect = (idx) => {

        this.setState({
            status: idx
        })

    }

    onAction = (action, args) => {
        const { navigation, actions, user } = this.props

        if (!user.userId) {
            navigation.navigate('PassPort')
        } else {
            if (action == 'AskInvite') {
                navigation.navigate('AskInvite', { ask: this.ask })
            } else if (action == 'WriteQust') {
                navigation.navigate('WriteQust', { ask: this.ask })
            } else if (action == 'Follow') {
                actions.user.auserfollow({
                    content_id: this.ask.askId,
                    ctype: 10,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);
                        this.setState({
                            isFollow: true,
                        })
                    },
                    rejected: (msg) => {
                        this.refs.hud.show('关注失败', 1);
                    }
                })
            } else if (action == 'UnFollow') {
                actions.user.aremoveFollow({
                    content_id: this.ask.askId,
                    ctype: 10,
                    resolved: (data) => {
                        this.refs.hud.show('取消成功', 1);
                        this.setState({
                            isFollow: false,
                        })
                    },
                    rejected: (msg) => {
                        this.refs.hud.show('关注失败', 1);
                    }
                })
            } else if (action == 'Approval') {
                let reply = this.item[args.index]

                actions.ask.action({
                    ctype: 34,
                    etype: 100,
                    content_id: reply.replyId,
                    resolved: (data) => {
                        this.refs.hud.show('操作成功', 1);

                        reply.approval++
                        reply.accept = true
                        this.item[args.index] = reply

                        this.setState({
                            reply_index: args.index,
                        })
                    },
                    rejected: (msg) => {

                    }
                })
            } else if (action == 'inApproval') {
                let reply = this.item[args.index]

                actions.ask.inaction({
                    ctype: 34,
                    etype: 100,
                    content_id: reply.replyId,
                    resolved: (data) => {
                        this.refs.hud.show('操作成功', 1);

                        reply.approval--
                        reply.accept = false
                        this.item[args.index] = reply

                        this.setState({
                            reply_index: args.index,
                        })
                    },
                    rejected: (msg) => {

                    }
                })
            } else if (action == 'Share') {
                // DeviceEventEmitter.emit('share', { title: this.ask.title, img: this.ask.gallery.length > 0 ? this.ask.gallery[0].fpath : '' })
                if (this.ask.isShare === 0) {
                    this.setState({ shareType: true })
                } else {
                    this.refs.hud.show('该问题不可分享', 1);
                }
            } else if (action == 'Report') {
                let comment = this.citem[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.courseName })
            } else if (action == 'onUserInfo') {
                let comment = this.citem[args.index];
                navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'onComment') {
                let comment = this.citem[args.index];
                navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if(action == 'Delete'){
                actions.ask.publish({
                    ask_id: this.ask.askId,
                    category_id: 0,
                    title:this.ask.title,
                    content: this.ask.content,
                    integral: 0,
                    pics: '',
                    videos: 'xc',
                    is_delete: 1,
                    resolved:(res)=>{
                        this.refs.hud.show('删除成功', 1);
                        setTimeout(() => {
                            navigation.goBack()
                        }, 1000);
                    }
                })
            }else if(action == 'Edit'){
                navigation.navigate('AskQust', {ask:this.ask})
            }else if(action == 'PublishComment'){
                let whitetip = 0;

                DataBase.getItem('whitetip').then(data => {
                    if (data != null) {
                        whitetip = data
                    }

                    navigation.navigate('PublishComment', { ctype: 10, content_id: this.ask.askId, isStar: 0, type: 1, whitetip: whitetip });

                });
            }

        }
    }
    _toggleShare = (type) => {

        if (type === 0) {
            WeChat.shareWebpage({
                title: this.ask.title,
                description: this.ask.summary,
                thumbImageUrl: this.ask.gallery.length > 0 ? this.ask.gallery[0].fpath : '',
                webpageUrl: config.cUrl + '/event/share/question.html?id=' + this.ask.askId,
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
                title: this.course.courseName,
                description: this.course.summary,
                thumbImageUrl: this.course.courseImg,
                webpageUrl: config.cUrl + '/event/share/question.html?id=' + this.ask.askId,
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
    _onHeaderRefresh = () => {
        const { actions } = this.props
        const { sort } = this.state

        this.page = 0
        this.pages = 1
        this.item = []

        actions.ask.reply(this.ask.askId, 0, 0, sort, 5)
        this.setState({ refreshState: RefreshState.HeaderRefreshing });
    }

    _onFooterRefresh = () => {
        const { actions } = this.props;
        const { sort } = this.state
        if (this.page < this.pages) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page++;

            actions.ask.reply(this.ask.askId, 0, this.page, sort, 5)
        } else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
    }
    onPraise = (index) => {
        const { actions } = this.props
        let comment = this.citem[index];

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
        this.citem[index] = comment;
        this.setState({
            citem: this.state.citem.map((item, idx) => index == idx ? comment : item)
        })
    }
    _renderHeader = () => {
        const { sort, isFollow } = this.state

        return (
            <View style={[styles.wrap]}>
                <View style={[styles.pl_20, styles.pr_20]}>
                    <View style={[styles.pt_20, styles.pt_15, styles.row, styles.ai_ct]}>
                        {this.ask.integral > 0 ?
                            <View style={[styles.fd_r, styles.gold_btn, styles.mr_5]}>
                                <Image source={asset.gold_icon} style={[styles.gold_cover]} />
                                <Text style={[styles.cf5_label, styles.smm_label]}>{this.ask.integral}金币</Text>
                            </View> : null}
                        <Text style={[styles.lg_label, styles.c33_label]}>{this.ask.title}</Text>
                    </View>
                    <View style={[styles.header, styles.fd_r, styles.ai_ct, styles.pt_15, styles.pb_10]}>
                        <Image source={{ uri: this.ask.avatar }} style={[styles.header_img]} />
                        <Text style={[styles.default_label, styles.c33_label, styles.fw_label, styles.pl_10]}>{this.ask.nickname}</Text>
                    </View>
                    <HtmlView html={this.ask.content} onLinkPress={this.onLinkPress} />
                    {/* <Text style={[styles.default_label, styles.c33_label, styles.lh18_label]}>{this.ask.content}</Text> */}
                    {this.ask.gallery && this.ask.gallery.length > 0 ?
                        <Image source={{ uri: this.ask.gallery[0].fpath }} mode="widthFix" style={[styles.q_img, styles.mt_10]} />
                        : null}
                    {
                        this.ask.userId == this.props.user.userId ?
                            <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mt_10, styles.mb_20]}>
                                <View>
                                    <Text style={[styles.tip_label, styles.sm_label]}>{this.ask.followNum}个关注</Text>
                                </View>
                                <View style={[styles.fd_r, styles.ai_ct]}>
                                    <TouchableOpacity style={[styles.share_btn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.ml_10]} onPress={() => this.onAction('Delete')}>
                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646812757013.png' }} style={[styles.ask_icon]} />
                                        <Text style={[styles.sm_label, styles.gray_label,styles.ml_5]}>删除</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.share_btn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.ml_10]} onPress={() => this.onAction('Edit')}>
                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646812768871.png' }} style={[styles.ask_icon]} />
                                        <Text style={[styles.sm_label, styles.gray_label,styles.ml_5]}>编辑</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.share_btn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.ml_10]} onPress={() =>{ 
                                        if(this.ask.canShare==0){
                                            this.refs.hud.show('该问题不可分享', 1);
                                            return;
                                        }
                                        DeviceEventEmitter.emit('share', { title: this.ask.title, img: this.ask.gallery.length>0?this.ask.gallery[0].fpath:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',path:'/comPages/pages/ask/question?askId=' + this.ask.askId + '&title=' + this.ask.title })
                                        }}>
                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646804963102.png' }} style={[styles.ask_icon]} />
                                        <Text style={[styles.sm_label, styles.gray_label,styles.ml_5]}>分享</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mt_10, styles.mb_20]}>
                                <View>
                                    <Text style={[styles.tip_label, styles.sm_label]}>{this.ask.replyNum}个回答 · {this.ask.followNum}个关注 · {this.ask.hit}个浏览</Text>
                                </View>
                                <View style={[styles.fd_r, styles.ai_ct]}>
                                    {isFollow ?
                                        <TouchableOpacity style={[styles.focus_btn, styles.bg_f7f, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('UnFollow')}>
                                            <Text style={[styles.sm_label]}>取消关注</Text>
                                        </TouchableOpacity>
                                        : <TouchableOpacity style={[styles.focus_btn, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={() => this.onAction('Follow')}>
                                            <Text style={[styles.sm_label, styles.sred_label]}>+关注问题</Text>
                                        </TouchableOpacity>}
                                    <TouchableOpacity style={[styles.share_btn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.ml_10]} onPress={() =>{ 
                                        if(this.ask.canShare==0){
                                            this.refs.hud.show('该问题不可分享', 1);
                                            return;
                                        }
                                        DeviceEventEmitter.emit('share', { title: this.ask.title, img: this.ask.gallery.length>0?this.ask.gallery[0].fpath:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',path:'/comPages/pages/ask/question?askId=' + this.ask.askId + '&title=' + this.ask.title })
                                        }}>
                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646804963102.png' }} style={[styles.ask_icon]} />
                                        <Text style={[styles.sm_label, styles.gray_label,styles.ml_5]}>分享</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </View>
                <View style={[styles.tog_boxs, styles.fd_r, styles.ai_ct]}>
                    <TouchableOpacity style={[styles.tog_box, styles.tog_left]} onPress={() => this.onAction('AskInvite')}>
                        <Image source={asset.ask.invite} style={[styles.act_icon]} />
                        <Text style={[styles.c33_label, styles.sm_label, styles.fw_label]}>邀请回答</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tog_box]} onPress={() => this.onAction('WriteQust', { ask: this.ask })}>
                        <Image source={asset.ask.edit} style={[styles.act_icon]} />
                        <Text style={[styles.c33_label, styles.sm_label, styles.fw_label]}>写回答</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.p_15, styles.layer_bt]}>
                    <View style={[styles.fd_r, styles.ai_ct]}>
                        <Text style={[styles.c33_label, styles.lg_label, styles.fw_label]}>回答</Text>
                        <Text style={[styles.default_label, styles.tip_label, styles.pl_5]}>{this.ask.replyNum}</Text>
                    </View>
                    <View style={[styles.fd_r, styles.ai_ct]}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                sort: 0
                            }, () => {
                                this._onHeaderRefresh()
                            })
                        }}>
                            <Text style={[styles.default_label, styles.tip_label, sort == 0 && styles.sred_label]}>最新</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                sort: 1
                            }, () => {
                                this._onHeaderRefresh()
                            })
                        }}>
                            <Text style={[styles.default_label, styles.tip_label, sort == 1 && styles.sred_label, styles.ml_20]}>最热</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    !this.ask.replyNum ?
                        <View style={[{ width: '100%' }, styles.row, styles.jc_ct, styles.mt_10]}>
                            <View>
                                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/289f1c16-c466-4ab0-8460-c0629a741688.png' }} style={[{ width: 156, height: 123 }]} />
                                <View style={[styles.row, styles.jc_ct]}>
                                    <Text style={[styles.mt_15, styles.sm_label, styles.tip_label]}>还没有评论，快来抢沙发</Text>
                                </View>
                            </View>
                        </View>
                        : null
                }
            </View>
        )
    }

    _renderItem = (item) => {
        const { status } = this.state
        const{navigation}=this.props
        const reply = item.item
        const index = item.index;


        const on = status === index
        return (
            <View style={[styles.qust, styles.border_bt, styles.pl_20, styles.pr_20]} >
                <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pb_10, styles.pt_10]}>
                    <View style={[styles.fd_r, styles.ai_ct]}>
                        <Image source={{ uri: reply.avatar }} style={[styles.qust_img]} />
                        <View style={[styles.fd_c, styles.ml_10]}>
                            <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>{reply.nickname}</Text>
                            <Text style={[styles.default_label, styles.tip_label, styles.mt_5]}>{dateDiff(reply.pubTime)}</Text>
                        </View>
                    </View>
                    {1 ? null :
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <TouchableOpacity style={[styles.f_btn]}>
                                <Text style={[styles.sred_label, styles.sm_label]}>+关注</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.togle_btn, styles.ml_15]}
                                onPress={() => this._onSelect(index)}
                            >
                                <Image source={asset.threedot} style={[styles.threedCover]} />
                            </TouchableOpacity>
                        </View>}
                </View>
                <Text style={[styles.default_label, styles.c33_label, styles.lh18_label]}>{reply.content}</Text>
                <View style={[styles.fd_r, styles.jc_sb, styles.pt_10, styles.pb_15]}>
                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.col_1]} onPress={() => {
                        if (reply.accept === true) {
                            this.onAction('inApproval', { index: index })
                        } else {
                            this.onAction('Approval', { index: index })
                        }
                    }}>
                        {
                            reply.accept === true ?
                                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646804951553.png' }} style={[styles.ask_icon]} />
                                :
                                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646804945422.png' }} style={[styles.ask_icon]} />
                        }
                        <Text style={[styles.sm_label, styles.tip_label, styles.ml_5]}>{reply.approval}赞同</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.col_1]} onPress={()=>navigation.navigate('Comment',{ctype:34,content_id:reply.replyId,courseName:reply.title})}>
                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646804957235.png' }} style={[styles.ask_icon]} />
                        <Text style={[styles.sm_label, styles.tip_label, styles.ml_5]}>{reply.comment}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.col_1]} onPress={() =>{ 
                                        if(this.ask.canShare==0){
                                            this.refs.hud.show('该问题不可分享', 1);
                                            return;
                                        }
                                        DeviceEventEmitter.emit('share', { title: this.ask.title, img: this.ask.gallery.length>0?this.ask.gallery[0].fpath:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',path:'/comPages/pages/ask/question?askId=' + this.ask.askId + '&title=' + this.ask.title })
                                        }}>
                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646804963102.png' }} style={[styles.ask_icon]} />
                        <Text style={[styles.sm_label, styles.tip_label, styles.ml_5]}>分享</Text>
                    </TouchableOpacity>
                </View>
                {
                    on ?
                        <TouchableOpacity style={[styles.layer_t]} onPress={() => this.setState({ status: 1000 })}>
                            <View style={[styles.layer_box]}>
                                <View style={[styles.layer_actgle]}></View>
                                <View style={[styles.fd_c, styles.p_15]}>
                                    <TouchableOpacity style={[styles.fd_r, styles.si_ct, styles.layer_bt, styles.jc_ct, styles.pt_5, styles.pb_5]}>
                                        <Text style={[styles.gray_label, styles.sm_label]}>收藏</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.fd_r, styles.si_ct, styles.jc_ct, styles.pt_5, styles.pb_5]}>
                                        <Text style={[styles.gray_label, styles.sm_label]}>举报</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                        : null}
                {
                    index === this.item.length - 1 && this.page < this.pages - 1 ?
                        <View style={[styles.mt_10]}>
                            <TouchableOpacity style={[styles.row, styles.jc_ct]} onPress={() => this._onFooterRefresh()}>
                                <Text style={[styles.gray_label]}>查看更多</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
        )

    }


    _renderFooter = () => {
        const { navigation } = this.props

        return (
            <View>
                <View style={[styles.p_15]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>评论<Text style={[styles.default_label_label, styles.tip_label, styles.fw_label]}>（{this.ask.comment}） </Text></Text>
                </View>
                {this.state.citem.map((comment, index) => {
                    return (
                        <CommentCell index={index} comment={comment}
                            onUserInfo={(index) => this.onAction('onUserInfo', { index, index })}
                            onComment={(index) => this.onAction('onComment', { index, index })}
                            onReport={(index) => this.onAction('Report', { index: index })}
                            onPraise={(index) => this.onPraise(index)} onPreview={(galleryList, index) => {
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

                            }} />
                    )
                })}
                {
                    this.citem.length === 0 ?
                        <View style={[{ width: '100%' }, styles.row, styles.jc_ct, styles.mt_10, styles.mb_10]}>
                            <View>
                                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/289f1c16-c466-4ab0-8460-c0629a741688.png' }} style={[{ width: 156, height: 123 }]} />
                                <View style={[styles.row, styles.jc_ct]}>
                                    <Text style={[styles.mt_15, styles.sm_label, styles.tip_label]}>还没有评论，快来抢沙发</Text>
                                </View>
                            </View>
                        </View>
                        : null
                }
                <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.border_top]} onPress={() => navigation.navigate('Comment', { ctype: 10, content_id: this.ask.askId, courseName: this.ask.title })}>
                    <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { navigation } = this.props;
        const { loaded, statusBarHeight, preview, preview_index, preview_imgs, shareType } = this.state;

        if (!loaded) return null;

        return (
            <View style={styles.container}>
                <View style={{ paddingTop: statusBarHeight, backgroundColor: '#ffffff', }}>
                    <View style={[styles.fd_r, styles.ai_ct, styles.pl_15, styles.pr_15, styles.pt_12, styles.pb_12, styles.jc_ct]}>
                        <TouchableOpacity style={[styles.pl_10, styles.pr_10]} onPress={() => navigation.goBack()}>
                            <Image source={asset.left_arrows} style={[styles.left_icon]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.search_input, styles.fd_r, styles.ai_ct, styles.col_1, styles.pl_10, styles.mr_20, styles.ml_5]}
                            onPress={() => navigation.navigate('AskSearch')}
                        >
                            <Image source={asset.search} style={[styles.search_icon]} />
                            <Text style={[styles.default_label, styles.tip_label, styles.pl_5]}>{'搜索问题'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.searchbtn, styles.ai_ct, styles.fd_r, styles.jc_ct]} onPress={() => navigation.navigate('AskSearch')}>
                            <Image source={asset.search} style={[styles.msg_icon]} />
                        </TouchableOpacity>
                    </View>
                </View>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.item}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                // onFooterRefresh={this._onFooterRefresh}
                />

                <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                    <Text style={[styles.fw_label, styles.sm_label]}>{this.ask.comment}人评论</Text>
                    <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f, styles.input]}   onPress={() => this.onAction('PublishComment')} >
                        <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                    </TouchableOpacity>
                </View>

                <HudView ref={'hud'} />

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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    search_input: {
        height: 30,
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
    },
    search_icon: {
        width: 16,
        height: 16,
    },
    search_text: {
        height: 20,
    },
    msg_icon: {
        width: 20,
        height: 18,
    },
    left_icon: {
        width: 10,
        height: 17,
    },
    edit_icon: {
        width: 17,
        height: 17,
    },
    act_icon: {
        width: 14,
        height: 14,
    },
    header_img: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#dddddd',
    },
    q_img: {
        width: '100%',
        height: 128,
        backgroundColor: '#dddddd',
        borderRadius: 5,
    },
    focus_btn: {
        width: 70,
        height: 22,
        backgroundColor: '#FFEAE5',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    share_btn: {
        width: 52,
        height: 22,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tog_boxs: {
        height: 44,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F0F0F0',
        borderTopColor: '#F0F0F0',
    },
    tog_box: {
        height: 44,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tog_left: {
        borderRightColor: '#F0F0F0',
        borderRightWidth: 1,
        borderStyle: 'solid',
    },
    layer_bt: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderStyle: 'solid',
    },
    input: {
        height: 36,
        marginLeft: 8,
        marginRight: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    qust_img: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#dddddd',
    },
    f_btn: {
        width: 50,
        height: 22,
        borderColor: '#F4623F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    threedCover: {
        width: 20,
        height: 20,
    },
    qust: {
        position: 'relative',
    },
    layer_t: {
        position: 'absolute',
        width: theme.window.width,
        height: '100%',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingTop: 15,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    layer_box: {
        position: 'relative',
        width: 86,
        height: 74,
        marginRight: 10,
        marginTop: 28,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    layer_actgle: {
        position: 'absolute',
        width: 0,
        height: 0,
        top: -4,
        right: 18,
        borderBottomWidth: 4,
        borderBottomColor: '#ffffff',
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderRightWidth: 4,
    },
    gold_btn: {
        width: 50,
        height: 16,
        borderRadius: 12,
        paddingLeft: 2,
        paddingRight: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#F5A623',
    },
    gold_cover: {
        width: 10,
        height: 8,
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
    ask_icon: {
        width: 13,
        height: 13
    }
});

export const LayoutComponent = Question;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        ask: state.ask.ask,
        reply: state.ask.reply,
    };
}
