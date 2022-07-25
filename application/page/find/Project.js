import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Image, ScrollView, Modal,DeviceEventEmitter } from 'react-native'

import _ from 'lodash';
import * as WeChat from 'react-native-wechat-lib';
import ImageViewer from 'react-native-image-zoom-viewer';

import VodPlayer from '../../component/vod/VodPlayer';
import CommentCell from '../../component/cell/CommentCell';
import HudView from '../../component/HudView';
import { CommentEmpty } from '../../component/Empty';

import * as  DataBase from '../../util/DataBase';

import { config, asset, theme } from '../../config';
import { action } from '../../redux/service/ask';

class Project extends Component {


    static navigationOptions = ({ navigation }) => {
        const project = navigation.getParam('project', { title: '专题详情' });
        return {
            title: project.title,
            headerRight: (
                <View>
                </View>
            ),
        }
    };


    constructor(props) {
        super(props);
        const { navigation } = props;
        this.project = navigation.getParam('project', {});
        this.citems = [];

        this.state = {
            playUrl: '',
            mediaId: '',
            isLike: false,
            likeNum: 0,
            loaded: false,
            duration: 0,
            total: 0,
            totalTop: 0,
            isCollect: false,
            comment: 0,
            gallery: [],
            galleryIndex: 100,
            shareType: false,

            preview: false,
            preview_index: 0,
            preview_imgs: [],
            citems:[],
            definition: '',
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onAction = this._onAction.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._getPVideo = this._getPVideo.bind(this);
        this._toggleShare = this._toggleShare.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { article, pComment, pCommentTop } = nextProps;

        if (article !== this.props.article) {
            this.article = article
            this.setState({
                loaded: true,
                isLike: article.isLike,
                likeNum: article.likeNum,
                mediaId: article.mediaId,
                isCollect: article.isCollect,
                comment: article.comment,
                gallery: article.gallery,
            }, () => {

                if (Array.isArray(article.gallery) && article.gallery.length > 0) {

                    this._getPVideo(article.gallery[0].link, 0);
                    this.setState({
                        galleryIndex: 0
                    })

                } else {

                    if (article.mediaId != '') {
                        this._onPlay();
                    }

                }
            })
        }


        if (pComment !== this.props.pComment) {

            this.setState({
                total: pComment.total,
            })
        }

        if (pCommentTop !== this.props.pCommentTop) {

            this.citems = pCommentTop.items;
            this.setState({
                totalTop: pCommentTop.total,
                citems:pCommentTop.items
            })
        }

    }

    componentDidMount() {
        const { navigation } = this.props
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }

    _onRefresh() {
        const { actions } = this.props;
        actions.user.user()
        actions.article.article(this.project.articleId);
        actions.site.pComment(this.project.articleId, 15, 0, 0);
        actions.site.pCommentTop(this.project.articleId, 15, 2, 0);
    }


    _onPlay() {
        const { actions } = this.props;
        const { mediaId } = this.state;
        actions.course.verify({
            media_id: mediaId,
            resolved: (data) => {
                this.setState({
                    duration: data.duration,
                    playUrl: data.m38u,
                })
            },
            rejected: (res) => {

            },
        })
    }

    _keyExtractor(item, index) {
        return index + '';
    }

    _toggleShare = (type) => {
        WeChat.isWXAppInstalled().then(isInstalled => {

            if (isInstalled) {
                WeChat.shareWebpage({
                    title: this.project.title,
                    description: this.project.summary,
                    thumbImageUrl: this.project.articleImg,
                    webpageUrl: config.cUrl + '/event/share/course.html?id=' + this.project.articleId,
                    scene: type
                }).then(data => {
                    this.setState({
                        shareType: false,
                    }, () => {
                        this.refs.hud.show('分享成功', 1);
                    })
                }).catch(error => {

                })
            } else {
                this.refs.hud.show('未找到微信！', 1);
            }
        })
    }

    _onDefinition = (vals) => {
        const { actions, user } = this.props;
        const { mediaId } = this.state;
        actions.course.verify({
            media_id: mediaId,
            definition: vals,
            resolved: (data) => {
                this.setState({
                    playUrl: data.m38u,
                    definition: vals
                })
            }
        })
    }
    _onAction(val) {
        const { actions, navigation, user } = this.props;
        let { isLike, likeNum, isCollect } = this.state;


        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (val === 'Collect') {

                if (isCollect) {
                    actions.user.aremovecollect({
                        content_id: this.project.articleId,
                        ctype: 15,
                        resolved: (data) => {
                            this.setState({
                                isCollect: false
                            })
                            action.user.userHistory({
                                etype: 12,
                                ctype: 15,
                                cctype: 2,
                                content_id: this.project.articleId
                            })
                            this.refs.hud.show('取消成功', 1);
                        },
                        rejected: (msg) => {

                        },
                    })
                } else {
                    actions.user.acollect({
                        content_id: this.project.articleId,
                        ctype: 15,
                        resolved: (data) => {
                            actions.user.userHistory({

                            })
                            this.setState({
                                isCollect: true
                            })
                            this.refs.hud.show('收藏成功', 1);
                        },
                        rejected: (msg) => {

                        },
                    })
                }

            } else if (val == 'PublishComment') {

                let whitetip = 0;

                DataBase.getItem('whitetip').then(data => {
                    if (data != null) {
                        whitetip = data
                    }

                    navigation.navigate('PublishComment', { ctype: 15, content_id: this.project.articleId, isStar: 0, type: 1, whitetip: whitetip });

                });


            } else if (val === 'Share') {
                if (this.project.canShare === 0) {
                    this.refs.hud.show('该专题不可分享', 1);
                } else {
                    this.setState({
                        shareType: true,
                    })
                }

            } else if (val === 'Praise') {

                if (isLike) {
                    actions.article.removelike({
                        article_id: this.article.articleId,
                        resolved: (data) => {
                            if (likeNum > 0) {
                                likeNum--;
                            } else {
                                likeNum = 0
                            }
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
                        article_id: this.project.articleId,
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
            } else if (val == 'Report') {
                let comment = this.citems[args.index];
                navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.project.title })
            }
        }
    }
    onAction = (action, args) => {
        const { navigation } = this.props
        if (action == 'Report') {
            let comment = this.citems[args.index];
            navigation.navigate('Report', { commentTxt: comment.content, commentName: comment.username, courseName: this.courseName })
        } else if (action == 'onUserInfo') {
            let comment = this.citems[args.index];
            navigation.navigate('UserPersonal', { commentTxt: comment.content, commentName: comment.username, courseName: this.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
        } else if (action == 'onComment') {
            let comment = this.citems[args.index];
            navigation.navigate('PersonalComment', { commentTxt: comment.content, commentName: comment.username, courseName: this.courseName, avatar: comment.avatar, pubTimeFt: comment.pubTimeFt, userId: comment.userId })
        }
    }
    onPraise = (index) => {
        const { actions } = this.props
        let comment = this.citems[index];

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
        console.log(this)
        this.citems[index] = comment;
        this.setState({
            citems: this.state.citems.map((item, idx) => index == idx ? comment : item)
        })
    }
    _getPVideo(link, index) {
        const { actions } = this.props;
        actions.course.verify({
            media_id: link,
            resolved: (data) => {
                this.setState({
                    duration: data.duration,
                    playUrl: data.m38u,
                    galleryIndex: index,
                    mediaId: link,
                })

            },
            rejected: (res) => {

            },
        })

    }

    _renderHeader() {
        const { navigation } = this.props;
        const { mediaId, playUrl, duration, likeNum, isLike, isCollect, total, comment, gallery, galleryIndex, totalTop } = this.state;
        return (
            <View>
                <View>
                    {
                        playUrl.length > 0 ?
                            <View>
                                <VodPlayer
                                    ref={e => { this.player = e; }}
                                    source={{
                                        cover: this.project.articleImg,
                                        key: mediaId,
                                        url: playUrl,
                                        duration: duration,
                                    }}
                                    navigation={navigation}
                                    onFullscreen={(full) => {
                                        navigation.setParams({ fullscreen: full })
                                    }}
                                    onDefin={(val) => {
                                        this._onDefinition(val)
                                    }}
                                />
                            </View>
                            :
                            <Image source={{ uri: this.project.articleImg }} style={styles.articleImg} />
                    }
                </View>
                <View style={styles.wrapHead}>
                    <View style={styles.artdesc_tip}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label, styles.title]}>{this.project.title}</Text>
                        <Text style={[styles.default_label, styles.gray_label]}>{this.project.summary}</Text>
                        <View style={[styles.artdesc_date]}>
                            <Text style={[styles.tip_label, styles.sm_label]}>发布时间：{this.project.pubTimeFt}</Text>
                            <TouchableOpacity style={[styles.artdesc_parse]} onPress={() => this._onAction('Praise')}>
                                <Image source={isLike ? asset.onpraise : asset.praise} style={styles.parse_cover} />
                                <Text style={isLike ? [styles.red_label, styles.sm_label] : [styles.tip_label, styles.sm_label]}>{likeNum}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.articons]}>
                        <View style={[styles.articon]}>
                            <Image source={asset.video_icon} style={[styles.icon]} />
                            <Text style={[styles.sm_label, styles.gray_label]}>{this.project.hit}播放</Text>
                        </View>
                        <TouchableOpacity style={[styles.articon]}
                            onPress={() => navigation.navigate('Comment', { ctype: 15, content_id: this.project.articleId, courseName: this.project.title })}
                        >
                            <Image source={asset.eval_icon} style={[styles.icon]} />
                            <Text style={[styles.sm_label, styles.gray_label]}>{comment}评论</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.articon]} onPress={() => this._onAction('Collect')}>
                            <Image source={isCollect ? asset.collected : asset.ct_icon} style={[styles.collect_icon]} />
                            <Text style={isCollect ? [styles.sm_label, styles.red_label] : [styles.sm_label, styles.gray_label]} >收藏</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.fd_r, styles.ai_ct]}  onPress={() => {
                            if(this.project.canShare==0){
                                this.refs.hud.show('该专题不可分享', 1);
                                return;
                            }
                            DeviceEventEmitter.emit('share', { title: this.project.title, img: this.project.articleImg, path: '/subPages/pages/find/projectDesc?articleId=' + this.project.articleId + '&articleName=' + this.project.title })
                        }} >
                            <Image source={{uri:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1650430644073.png'}} style={[styles.shart_icon]} />
                            <Text style={[styles.sm_label, styles.gray_label]}>分享</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        gallery.length > 0 ?
                            <View style={[styles.mt_20]}>
                                <View style={[styles.head]}>
                                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>选集</Text>
                                </View>
                                <ScrollView
                                    scrollX
                                    horizontal={true}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={[styles.mt_20, { height: 140 }]}
                                >
                                    <View style={[styles.teach, styles.fd_r]}>
                                        {
                                            gallery.map((item, index) => {
                                                const on = galleryIndex === index;
                                                return (
                                                    <TouchableOpacity style={[styles.teach_item, styles.mr_10, styles.d_flex, styles.fd_c, styles.ai_ct]} key={'item' + index}
                                                        onPress={() => this._getPVideo(item.link, index)}
                                                    >
                                                        <Image source={{ uri: item.fpath }} style={[styles.teach_cover, styles.gall_wborder, on && styles.gall_rborder]} />
                                                        <Text style={[styles.sm_label, styles.fw_label, styles.mt_10, styles.c33_label, on && styles.red_label]} numberOfLines={2}>{item.title}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                            : null}
                    <View style={[styles.pt_15, styles.pb_10, styles.mr_15]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>精选评论<Text style={[styles.tip_label, styles.default_label]}>({totalTop})</Text></Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderItem(item) {
        const { navigation } = this.props;
        const comment = item.item;
        const index = item.index;
        let lastIdx = this.citems.length - 1 !== index;

        return <CommentCell index={index} comment={comment} lastIdx={lastIdx} onReport={(index) => this.onAction('Report', { index: index })}
            onUserInfo={(index) => this.onAction('onUserInfo', { index, index })}
            onComment={(index) => this.onAction('onComment', { index, index })}
            onPraise={(index) => this.onPraise(index)}
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

            }} />
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
                        <TouchableOpacity style={[styles.p_15, styles.ai_ct, styles.mb_20, styles.border_top]}
                            onPress={() => navigation.navigate('Comment', { ctype: 15, content_id: this.project.articleId, courseName: this.project.title })}
                        >
                            <Text style={[styles.sm_label, styles.gray_label, { color: '#f6613f' }]}>查看全部评论&gt;</Text>
                        </TouchableOpacity>
                        : null}

            </View>


        );
    }

    render() {
        const { navigation } = this.props;
        const { mediaId, playUrl, duration, loaded, shareType, preview, preview_imgs, preview_index } = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )



        return (
            <View style={[styles.container, styles.bg_white]}>
                {/* <View>
                    {
                        playUrl.length > 0 ?
                        <View>
                            <VodPlayer 
                                ref={e => { this.player = e; }}
                                source={{
                                    cover: this.project.articleImg,
                                    key: mediaId,
                                    url: playUrl,
                                    duration: duration,
                                }}
                                navigation={navigation}
                                onFullscreen={(full) => {
                                    navigation.setParams({fullscreen:full})
                                }}
                            />
                        </View>
                        :
                        <Image source={{uri:this.project.articleImg}} style={styles.articleImg} />
                    }
                </View> */}


                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.citems}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
                />

                <View style={[styles.fd_r, styles.ai_ct, styles.pt_8, styles.pb_8, styles.pl_15, styles.pr_15, styles.border_top, styles.toolbar]}>
                    <TouchableOpacity style={[styles.col_8, styles.p_8, styles.bg_f7f]} onPress={() => this._onAction('PublishComment')}>
                        <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                    </TouchableOpacity>
                </View>

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

                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} />
                </Modal>

                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    articleImg: {
        width: theme.window.width,
        height: theme.window.width * 0.5625
    },
    wrapHead: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 10,
        marginBottom: 15,
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    artdesc_tip: {
        marginTop: 16,
        flexDirection: 'column'
    },
    title: {
        marginBottom: 10,
    },
    artdesc_date: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
    },
    artdesc_parse: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    parse_cover: {
        width: 13,
        height: 13,
        marginRight: 5,
    },
    articons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    articon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 6
    },
    collect_icon: {
        width: 14,
        height: 14,
        marginRight: 6,
    },
    shart_icon: {
        width: 17,
        height: 17,
        marginRight: 6,
    },
    teach: {
        width: '100%'
    },
    teach_cover: {
        width: theme.window.width * 0.4,
        height: theme.window.width * 0.4 * 0.56,
        borderRadius: 5,
        backgroundColor: '#fafafa'
    },
    reach_bt: {
        borderRadius: 11,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#dddddd',
        borderStyle: 'solid',
        borderWidth: 1
    },
    gall_rborder: {
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 1
    },
    gall_wborder: {
        borderColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1
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
    teach_item: {
        width: theme.window.width * 0.4,
    },
    share_icon: {
        width: 20,
        height: 20
    },
})

export const LayoutComponent = Project;

export function mapStateToProps(state) {
    return {
        article: state.article.article,
        pComment: state.site.pComment,
        pCommentTop: state.site.pCommentTop,
        user: state.user.user,
    };
}
