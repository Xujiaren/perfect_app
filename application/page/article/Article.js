import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, Image, FlatList, StyleSheet, Modal, ScrollView, ProgressBarAndroid, Platform, ProgressViewIOS, Alert, DeviceEventEmitter } from 'react-native';

import _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';

import ArticleCell from '../../component/cell/ArticleCell';
import CommentCell from '../../component/cell/CommentCell';
import HtmlView from '../../component/HtmlView';

import { CommentEmpty } from '../../component/Empty';

import { config, asset, theme, iconMap } from '../../config';

import * as WeChat from 'react-native-wechat-lib';
import * as  DataBase from '../../util/DataBase';

import HudView from '../../component/HudView';

class Article extends Component {

    static navigationOptions = ({ navigation }) => {
        const article = navigation.getParam('article', { title: '资讯详情' });
        return {
            title: article.title,
            headerRight: (
                <View>
                    {
                        article.canShare == 0 ?
                            null
                            :
                            <TouchableOpacity onPress={() => DeviceEventEmitter.emit('share', { title: article.title, img: article.articleImg, path: '/pages/index/consultDesc' + '?articleId=' + article.articleId + '&cousultName=' + article.title, articleId:article.articleId})} style={[styles.pr_15]}>
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
        this.article = navigation.getParam('article', {});

        this.ritems = [];
        this.citems = [];
        this.voteInfo = {}

        this.state = {
            totalTop: 0,
            total: 0,
            loaded: false,

            isLike: false,
            likeNum: 0,

            index: 0,
            preview: false,
            preview_index: 0,
            preview_imgs: [],
            shareType: false,

            isVote: 0,
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onAction = this._onAction.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);

        this._onShare = this._onShare.bind(this);
        this._toggleShare = this._toggleShare.bind();
        this._onArticle = this._onArticle.bind(this);

        this._onVoteImg = this._onVoteImg.bind(this);
        this._articleVote = this._articleVote.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();

        })
    }

    componentWillReceiveProps(nextProps) {
        const { article, relation, comment, acommentTop, navigation } = nextProps;

        if (article !== this.props.article) {
            this.article = article;
            this.voteInfo = this.article.voteInfo;
            this.setState({
                loaded: true,
                isLike: article.isLike,
                likeNum: article.likeNum,
                isVote: article.isVote
            })
        }

        if (relation !== this.props.relation) {
            this.ritems = relation;
        }

        if (comment !== this.props.comment) {

            this.setState({
                total: comment.total,
            })
        }

        if (acommentTop !== this.props.acommentTop) {

            this.citems = acommentTop.items;
            this.setState({
                totalTop: acommentTop.total,
            })
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
        actions.article.article(this.article.articleId);
        actions.article.relation(this.article.articleId);
        actions.article.comment(this.article.articleId, 0, 0);
        actions.article.acommentTop(this.article.articleId);

    }

    _onAction(action, args) {
        const { navigation, actions, user } = this.props;
        let { isLike, likeNum } = this.state;

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

                    navigation.navigate('PublishComment', { ctype: 11, content_id: this.article.articleId, isStar: 0, type: 1, whitetip: whitetip });
                });


            } else if (action == 'Like') {
                if (isLike) {
                    actions.article.removelike({
                        article_id: this.article.articleId,
                        resolved: (data) => {
                            likeNum--;

                            this.setState({
                                likeNum: likeNum,
                                isLike: false
                            })
                        },
                        rejected: (msg) => {

                        },
                    })
                } else {
                    actions.article.like({
                        article_id: this.article.articleId,
                        resolved: (data) => {
                            likeNum++;

                            this.setState({
                                likeNum: likeNum,
                                isLike: true
                            })
                        },
                        rejected: (msg) => {

                        },
                    })
                }
            } else if (action == 'Report') {
                let comment = this.citems[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.article.title })
            } else if (action == 'onUserInfo') {
                let comment = this.citems[args.index];
                navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.article.title, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            } else if (action == 'onComment') {
                let comment = this.citems[args.index];
                navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.article.title, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
            }
        }
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

    onLinkPress = (evt, href) => {

        const { navigation } = this.props;


        if (href.substring(0, 4) === 'http') {

            navigation.navigate('AdWebView', { link: href })

        } else {

            if (href.indexOf('courseDesc') !== -1) {

                let c_Id = href.split('=')[1]
                const vodcouse = { 'courseId': c_Id.split("&")[0] };
                navigation.navigate('Vod', { course: vodcouse, courseName: '' });

            }
        }
    }


    _onArticle = (article) => {

        this.scrollview.scrollToOffset({ offset: 0, animated: true });
        this.article = article
        this.setState({
            loaded: false,
        }, () => {
            this.ritems = [];
            this.citems = [];
        })
        this._onRefresh();

    }

    _onVoteImg() {

    }

    _articleVote(vt, ttype) {

        const { actions } = this.props;
        actions.article.articleVote({
            article_id: this.article.articleId,
            answer: vt.optionId,
            resolved: (data) => {
                this.refs.hud.show('投票成功', 1);
                actions.article.article(this.article.articleId);
            },
            rejected: (msg) => {
                console.log(msg)
            },
        });

    }

    _renderHeader() {
        const { navigation } = this.props;
        const { totalTop, isVote } = this.state;

        let html = this.article.content;

        let rritems = this.ritems.slice(0, 4);
        //console.info(html);

        html = html.replace(/<p([^<>]*)>([\s]*)<\/p>/g, '');
        //console.info(html);

        let sumVt = 0;

        this.voteInfo.optionList.map((vts, index) => {
            sumVt += vts.num;
        })


        return (
            <View>
                <View style={[styles.p_15, styles.bg_white]}>
                    <Image style={[styles.cover]} source={{ uri: this.article.articleImg }} />
                    <Text style={[styles.lg18_label, styles.lh20_label, styles.c33_label, styles.fw_label, styles.mt_15, styles.mb_10]}>{this.article.title}</Text>
                    <Text style={[styles.default_label, styles.tip_label, styles.right_label, styles.mt_5]}>{this.article.comment}评论 {this.article.pubTimeFt}</Text>
                    <View style={[styles.mt_10]}>
                        <HtmlView html={html} type={1} onLinkPress={this.onLinkPress} />
                    </View>

                </View>

                {
                    isVote === 1 && this.voteInfo.optionList.length > 0 ?
                        <View>
                            {
                                this.voteInfo.mtype === 0 ?
                                    <View style={[styles.voteBox, styles.bg_white, styles.mt_10, styles.mb_15, styles.p_15]}>
                                        <View style={[styles.voteHead, styles.border_bt, styles.fd_c, { width: theme.window.width - 30 }]}>
                                            <Text style={[styles.c33_label, styles.lg_label, styles.fw_label]}>投票</Text>
                                            <Text style={[styles.lg_label, styles.c33_label, styles.mt_15, styles.pb_10]}>{this.voteInfo.title}{this.voteInfo.ttype === 0 ? '' : '（多选）'}</Text>
                                        </View>
                                        <View style={styles.voteLists}>
                                            {
                                                this.voteInfo.optionList.map((vt, index) => {
                                                    return (
                                                        <View style={[styles.voteItem, styles.fd_c, styles.mt_10, styles.mb_10]} key={'vt' + index}>
                                                            <Text style={[styles.c33_label, styles.default_label]}>{vt.optionLabel}</Text>
                                                            <View style={[styles.fd_r, styles.ai_ct]}>
                                                                <View style={[styles.col_1]}>
                                                                    {
                                                                        Platform.OS === 'android' ?
                                                                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} progress={0.1} styleAttr="Horizontal" />
                                                                            :
                                                                            <ProgressViewIOS progress={0.1} style={{ width: '100%' }} trackTintColor={'#FFDFDE'} progressTintColor={'#FF5047'} />
                                                                    }
                                                                </View>
                                                                <View style={[styles.fd_r, styles.jc_fe, { width: 60 }]}>
                                                                    <Text style={[styles.red_label, styles.sm_label]}>{vt.num}票</Text>
                                                                </View>
                                                                {
                                                                    this.voteInfo.ttype === 0 ?
                                                                        <View>
                                                                            {
                                                                                vt.canVote ?
                                                                                    <TouchableOpacity style={[styles.voteBtn, styles.ml_10, this.voteInfo.canVote && styles.voteno_btn]}
                                                                                        onPress={this.voteInfo.canVote ? () => this._articleVote(vt, this.voteInfo.ttype) : () => { Alert.alert('温馨提示', '投票已结束') }}
                                                                                    >
                                                                                        <Text style={[styles.sm_label, styles.white_label, styles.fw_label]}>投票</Text>
                                                                                    </TouchableOpacity>
                                                                                    :
                                                                                    <View style={[styles.voteBtn, styles.ml_10, { backgroundColor: '#BFBFBF' }]} >
                                                                                        <Text style={[styles.sm_label, styles.white_label, styles.fw_label]}>已投票</Text>
                                                                                    </View>
                                                                            }
                                                                        </View>
                                                                        :
                                                                        <View>
                                                                            {
                                                                                vt.canVote ?
                                                                                    <TouchableOpacity style={[styles.voteBtn, styles.ml_10, this.voteInfo.canVote && styles.voteno_btn]}
                                                                                        onPress={this.voteInfo.canVote ? () => this._articleVote(vt, this.voteInfo.ttype) : () => { Alert.alert('温馨提示', '投票已结束') }}
                                                                                    >
                                                                                        <Text style={[styles.sm_label, styles.white_label, styles.fw_label]}>投票</Text>
                                                                                    </TouchableOpacity>
                                                                                    :
                                                                                    <View style={[{ backgroundColor: '#BFBFBF' }]}>
                                                                                        <Text style={[styles.sm_label, styles.white_label, styles.fw_label]}>已投票</Text>
                                                                                    </View>
                                                                            }
                                                                        </View>
                                                                }
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    :
                                    <View style={[styles.voteBox, styles.bg_white, styles.mt_10, styles.mb_15, styles.p_15]}>
                                        <View style={[styles.voteHead, styles.border_bt, styles.fd_c, { width: theme.window.width - 30 }]}>
                                            <Text style={[styles.c33_label, styles.lg_label, styles.fw_label]}>投票</Text>
                                            <Text style={[styles.lg_label, styles.c33_label, styles.mt_15, styles.pb_10]}>{this.voteInfo.title}{this.voteInfo.ttype === 0 ? '' : '（多选）'}</Text>
                                        </View>
                                        <View style={[styles.voteRLists, styles.fd_r, styles.f_wrap, styles.jc_sb]}>
                                            {
                                                this.voteInfo.optionList.map((vt, index) => {
                                                    console.log(vt)
                                                    return (
                                                        <View style={[styles.rowItem, { width: (theme.window.width - 40) / 2 }]} key={'vt' + index}>
                                                            <TouchableOpacity onPress={() => this._onVoteImg(vt.url)}>
                                                                <Image source={{ uri: vt.url }} style={[styles.rowItem_img]} />
                                                            </TouchableOpacity>
                                                            <View style={[styles.row_height, styles.mt_5]}>
                                                                <Text style={[styles.c33_label, styles.default_label]}>{vt.optionLabel}</Text>
                                                            </View>
                                                            {
                                                                this.voteInfo.ttype === 0 ?
                                                                    <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mt_10]}>
                                                                        <Text style={[styles.red_label, styles.sm_label]}>{vt.num}票</Text>
                                                                        {
                                                                            vt.canVote ?
                                                                                <TouchableOpacity style={[styles.rowItem_btn, styles.ml_10, this.voteInfo.canVote && styles.voteno_btn]}
                                                                                    onPress={this.voteInfo.canVote ? () => this._articleVote(vt, this.voteInfo.ttype) : () => { Alert.alert('温馨提示', '投票已结束') }}
                                                                                >
                                                                                    <Text style={[styles.white_label, styles.default_label, styles.fw_label]}>投票</Text>
                                                                                </TouchableOpacity>
                                                                                :
                                                                                <View style={[styles.rowItem_btn, { backgroundColor: '#BFBFBF' }]}>
                                                                                    <Text style={[styles.white_label, styles.default_label, styles.fw_label]}>已投票</Text>
                                                                                </View>
                                                                        }

                                                                    </View>
                                                                    :
                                                                    <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mt_10]}>
                                                                        <Text style={[styles.red_label, styles.sm_label]}>{vt.num}票</Text>
                                                                        {
                                                                            vt.canVote ?
                                                                                <TouchableOpacity style={[styles.rowItem_btn, this.voteInfo.canVote && styles.voteno_btn]}
                                                                                    onPress={this.voteInfo.canVote ? () => this._articleVote(vt, this.voteInfo.ttype) : () => { Alert.alert('温馨提示', '投票已结束') }}
                                                                                >
                                                                                    <Text style={[styles.white_label, styles.default_label, styles.fw_label]}>投票</Text>
                                                                                </TouchableOpacity>
                                                                                :
                                                                                <View style={[styles.rowItem_btn, { backgroundColor: '#BFBFBF' }]}>
                                                                                    <Text style={[styles.white_label, styles.default_label, styles.fw_label]}>已投票</Text>
                                                                                </View>
                                                                        }

                                                                    </View>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                            }
                        </View>
                        :
                        <View>

                        </View>
                }



                {rritems.length > 0 ?
                    <View style={[styles.p_15, styles.bg_white, styles.mt_8]}>
                        <Text style={[styles.lg18_label, styles.c33_label, styles.fw_label, styles.pb_10]}>相关推荐</Text>
                        {rritems.map((article, index) => {
                            return <ArticleCell article={article} key={'article_' + index} onPress={(article) => this._onArticle(article)} />
                        })}
                    </View>
                    : null}
                <View style={[styles.p_15, styles.bg_white, styles.mt_8]}>
                    <Text style={[styles.lg18_label, styles.c33_label, styles.fw_label]}>精选评论<Text style={[styles.tip_label, styles.default_label]}>({totalTop})</Text></Text>
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
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.bg_white, styles.border_top]} onPress={() => navigation.navigate('Comment', { ctype: 11, content_id: this.article.articleId, courseName: this.article.title })}>
                            <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                        </TouchableOpacity>
                        : null}
            </View>
        );
    }

    _onShare() {


        if (this.article.canShare === 0) {

            this.refs.hud.show('暂无分享权限', 1);

        } else {
            this.setState({
                shareType: true
            })
        }

    }

    _toggleShare = (type) => {

        if (type === 0) {
            WeChat.shareMiniProgram({
                title: this.article.title,
                description: this.article.summary,
                thumbImageUrl: this.article.articleImg,
                userName: 'gh_7bd862c3897e',
                path: '/pages/index/consultDesc' + '?articleId=' + this.article.articleId + '&cousultName=' + this.article.title,
                withShareTicket: 'true',
                scene: 0
            }).then(data => {
                Alert.alert('提示', data)
                this.setState({
                    shareType: false,
                }, () => {
                    this.refs.hud.show('分享成功', 1);
                })
            }).catch(error => {

            })
        } else if (type === 1) {
            WeChat.shareMiniProgram({
                title: this.article.title,
                description: this.article.summary,
                thumbImageUrl: this.article.articleImg,
                userName: 'gh_7bd862c3897e',
                path: '/pages/index/consultDesc' + '?articleId=' + this.article.articleId + '&cousultName=' + this.article.title,
                withShareTicket: 'true',
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

    render() {
        const { loaded, isLike, likeNum, preview, preview_imgs, preview_index, shareType } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )


        return (
            <View
                style={[styles.container]}
            >

                <FlatList
                    ref={(r) => this.scrollview = r}
                    data={this.citems}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
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
                <HudView ref={'hud'} />
                <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                    <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f]} onPress={() => this._onAction('PublishComment')}>
                        <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.col_1, styles.p_5, styles.ai_ct]} onPress={() => this._onAction('Like')}>
                        <Text style={[styles.icon, styles.tip_label, isLike && styles.red_label]}>{iconMap(isLike ? 'dianzan' : 'dianzan')}</Text>
                        {
                            likeNum > 0 ?
                                <View style={[styles.count]}>
                                    <Text style={[styles.sm9_label, styles.white_label]}>{likeNum > 999 ? '999+' : likeNum}</Text>
                                </View>
                                : null}
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    cover: {
        width: theme.window.width - 30,
        height: 130,
        borderRadius: 5,
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
    rowItem_img: {
        width: '100%',
        height: 110,
        backgroundColor: '#111111'
    },
    row_height: {
        height: 40,
        overflow: "hidden"
    },
    voteBtn: {
        width: 70,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowItem: {
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        padding: 10
    },
    rowItem_btn: {
        width: '60%',
        height: 32,
        backgroundColor: '#F4623F',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export const LayoutComponent = Article;

export function mapStateToProps(state) {
    return {
        article: state.article.article,
        relation: state.article.relation,
        comment: state.article.comment,
        acommentTop: state.article.acommentTop,
        user: state.user.user,
    };
}
