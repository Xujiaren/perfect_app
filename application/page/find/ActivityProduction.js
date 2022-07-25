import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, TextInput, SafeAreaView } from 'react-native'

import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';

import MasonryList from '../../component/MasonryList';
import HudView from '../../component/HudView';

import { learnNum } from '../../util/common'

import { asset, theme } from '../../config';

const itemWidth = (theme.window.width - 16) / 2;

class ActivityProduction extends Component {

    static navigationOptions = {
        title: '作品展示',
        headerRight: <View />,
    };


    constructor(props) {
        super(props);

        const { navigation } = props;

        this.activityId = navigation.getParam('activityId', 0);
        this.etype = navigation.getParam('etype', 0);
        this.ctype = navigation.getParam('ctype', 0);
        this.activiType = navigation.getParam('activiType', 0)

        this.voteList = [];

        this.page = 0;
        this.totalPage = 1;

        this.state = {

            ctype: this.ctype,
            refreshing: false,

            preview: false,
            preview_index: 0,
            preview_imgs: [],

            etype: this.etype,

            act_number: 0,

            isVideo: false,

            keyword: '',


            popup_url: '',
        }

        this.onRefreshing = this.onRefreshing.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._getHeightForItem = this._getHeightForItem.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onPressContent = this._onPressContent.bind(this);

        this._overImg = this._overImg.bind(this);
        this._onVote = this._onVote.bind(this);

        this._onSearch = this._onSearch.bind(this);

        this._coverplay = this._coverplay.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        const { joinInfo, activityVotes } = nextProps;

        if (joinInfo !== this.props.joinInfo) {
            this.voteList = this.voteList.concat(joinInfo.items);

            this.page = joinInfo.page;
            this.totalPage = joinInfo.pages;
        }

        this.setState({
            refreshing: false,
            act_number: activityVotes,
        })


    }

    componentDidMount() {

        this.onRefreshing();
    }


    onRefreshing() {

        const { actions } = this.props;
        const { keyword } = this.state;

        this.voteList = [];

        this.setState({
            refreshing: true,
        })

        actions.activity.joinInfo(this.activityId, keyword, 0);
        actions.activity.activityVote(this.activityId);

    }

    _onEndReached() {

        const { actions } = this.props;
        const { keyword } = this.state

        if (this.page < this.totalPage) {

            this.setState({
                refreshing: false,
            })

            this.page = this.page + 1;

            actions.activity.joinInfo(this.activityId, keyword, this.page);

        }
    }

    _keyExtractor = (item, index) => {
        return item.text + index;
    }

    _getHeightForItem(item) {
        return Math.max(itemWidth, itemWidth / 100 * 200);
    }

    // 查看图片
    _overImg(galleryList) {

        let images = [];

        galleryList.map((gey, i) => {
            images.push({
                url: gey.fpath,
            });
        });

        this.setState({
            preview: true,
            preview_index: 0,
            preview_imgs: images,
        });

    }

    _onVote(joinId) {
        const { actions } = this.props;
        const { etype } = this.state;

        let toastStr = '点赞';

        if (etype === 20) {
            toastStr = '投票'
        }

        actions.activity.activityPublishVote({
            join_id: joinId,
            number: 1,
            resolved: (data) => {

                this.onRefreshing();
                this.refs.hud.show('提交成功', 1);

            },
            rejected: (res) => {

            },
        })

    }

    _onSearch() {

        const { keyword, ctype } = this.state;
        if (keyword !== '') {

            this.onRefreshing();

        } else {

            this.refs.hud.show('请输入关键词', 2);
        }
    }

    _coverplay(info) {

        let uri = info.galleryList[0].fpath;

        this.setState({
            isVideo: true,
            popup_url: uri,
        })
    }

    _renderItem(item) {
        const { ctype, etype } = this.state;

        const info = item.item;
        const column = item.column;

        let textStr = '点赞';
        let textnum = '赞数'

        if (etype === 20) {
            textStr = '投票'
            textnum = '票数'
        }


        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._onPressContent(item)}
                style={[styles.item]}
            >
                <View style={[styles.item_box, styles.item_l, (column === 1) && styles.item_r]}>
                    <View style={[styles.p_10, styles.fd_c]}>
                        <View style={[styles.fd_c, styles.mb_5]}>
                            <View style={[styles.fd_r, styles.jc_sb]}>
                                <Text style={[styles.sm_label, styles.c33_label]}>排名 {info.sortOrder}</Text>
                                <Text style={[styles.sm_label, styles.c33_label]}>编号 {info.userId}</Text>
                            </View>
                            <View style={[styles.fd_r, styles.ai_ct, styles.mt_2]}>
                                <View style={[styles.avarar_cover]}>
                                    <Image source={{ uri: info.avatar }} style={[styles.headerCover]} />
                                </View>
                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label, styles.ml_5, styles.wordstyle]}>{info.username}</Text>
                            </View>
                        </View>
                        <Text style={[styles.default_label, styles.c33_label, styles.fw_label, styles.wordstyle]}>{info.workName}</Text>
                        <Text style={[styles.sm_label, styles.gray_label, styles.mb_10, styles.wordstyle, styles.lh18_label]}>{info.workIntro}</Text>
                        {
                            ctype === 17 ?
                                <TouchableOpacity onPress={() => this._overImg(info.galleryList)}>
                                    <Image source={{ uri: info.galleryList[0].fpath }} style={[styles.pic, styles.mt_15]} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={[styles.videoBox]}
                                    onPress={() => this._coverplay(info)}
                                >
                                    <Video
                                        paused={true}
                                        ref={e => { this.player = e; }}
                                        source={{ uri: info.galleryList[0].fpath }}
                                        poster={info.galleryList[0].fpath + '?x-oss-process=video/snapshot,t_2000,m_fast'}
                                        style={[styles.pic_video]}
                                    />
                                    <View style={[styles.videoCons]}>
                                        <Image source={asset.video_icon} style={[styles.video_icon]} />
                                    </View>
                                </TouchableOpacity>

                        }
                        {
                            this.activiType == 3 || this.activiType == 4 ?
                                <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                                    <Text style={[styles.default_label, styles.gray_label, styles.mr_10]}>{textnum}:{learnNum(info.number)}</Text>
                                    <View style={[styles.voteBtn]}>
                                        <Text style={[styles.white_label, styles.default_label]}>已结束</Text>
                                    </View>
                                </View>
                                :
                                <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                                    <Text style={[styles.default_label, styles.gray_label, styles.mr_10]}>{textnum}:{learnNum(info.number)}</Text>
                                    {
                                        info.isVote ?
                                            <View style={[styles.voteBtn]}>
                                                <Text style={[styles.white_label, styles.default_label]}>已{textStr}</Text>
                                            </View>
                                            :
                                            <TouchableOpacity style={[styles.voteonBtn]} onPress={() => this._onVote(info.joinId)}>
                                                <Text style={[styles.white_label, styles.default_label]}>{textStr}</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                        }

                    </View>

                </View>

            </TouchableOpacity>
        )
    }


    _onPressContent(item) {

        // console.log(item);
    }


    render() {
        const { keyword, refreshing, preview_imgs, preview, preview_index, etype, act_number, isVideo, popup_url } = this.state;

        let textStr = '点赞';
        let textnum = '赞数'

        if (etype === 20) {
            textStr = '投票'
            textnum = '票数'
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.wraphead, styles.bg_white]}>
                    <View style={[styles.wrapCons, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                        <View style={[styles.fd_r, styles.ai_ct, styles.searchBox]}>
                            <Image source={asset.search} style={[styles.s_img]} />
                            <TextInput
                                style={[styles.default_label, styles.ml_10, styles.col_1, styles.mt_2, { paddingVertical: 0 }]}
                                placeholder='搜索作品名称或作者'
                                value={keyword}
                                returnKeyType='search'
                                keyboardType={'default'}
                                onSubmitEditing={this._onSearch}
                                onChangeText={(text) => { this.setState({ keyword: text }); }}
                            />
                        </View>
                        <Text style={[styles.c33_label, styles.default_label, styles.pr_15, styles.ml_10]}>我的{textnum}：{act_number}</Text>
                    </View>
                </View>
                <MasonryList
                    data={this.voteList}
                    numColumns={2}
                    renderItem={this._renderItem}
                    getHeightForItem={this._getHeightForItem}
                    refreshing={refreshing}
                    onRefresh={this.onRefreshing}
                    onEndReachedThreshold={0.5}
                    onEndReached={this._onEndReached}
                    keyExtractor={this._keyExtractor}
                />
                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} />
                </Modal>

                <Modal visible={isVideo} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={() => this.setState({ isVideo: false })}></TouchableOpacity>
                    <View style={styles.wechatType}>
                        <Video
                            ref={e => { this.player = e; }}

                            source={{ uri: popup_url }}
                            poster={popup_url + '?x-oss-process=video/snapshot,t_2000,m_fast'}
                            style={[styles.modal_video]}
                        />
                    </View>
                </Modal>

                <HudView ref={'hud'} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    wraphead: {
        backgroundColor: '#ffffff',
        width: '100%',
        top: 0,
        zIndex: 9999,
        paddingBottom: 12,
        paddingTop: 12,
    },
    wrapCons: {
        paddingTop: 0,
        paddingRight: 10,
        paddingBottom: 0,
        paddingLeft: 15,
    },
    searchBox: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        height: 34,
        borderRadius: 5,
        paddingLeft: 15,
    },
    s_img: {
        width: 16,
        height: 16,
    },
    items: {
        marginTop: 65,
        marginRight: 15,
        marginBottom: 0,
        marginLeft: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    item: {
        width: theme.window.width / 2,
        marginBottom: 10
    },
    item_box: {
        borderRadius: 5,
        width: (theme.window.width - 40) / 2,
        backgroundColor: '#f5f5f5',
    },
    item_l: {
        marginLeft: 16,
    },
    item_r: {
        marginLeft: 4
    },
    avarar_cover: {
        width: 24,
        height: 24,
    },
    headerCover: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fafafa',
    },
    pic: {
        width: '100%',
        height: 130,
        marginBottom: 15
    },
    pic: {
        width: '100%',
        height: 130,
        marginBottom: 15
    },
    videoBox: {
        position: 'relative',
        width: '100%',
        height: 130,
        marginBottom: 10
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
    voteBtn: {
        width: '40%',
        height: 28,
        backgroundColor: '#BFBFBF',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    voteonBtn: {
        width: '40%',
        height: 28,
        backgroundColor: '#F4623F',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
    }
})

export const LayoutComponent = ActivityProduction;

export function mapStateToProps(state) {
    return {
        joinInfo: state.activity.joinInfo,
        activityVotes: state.activity.activityVotes,
    };
}
