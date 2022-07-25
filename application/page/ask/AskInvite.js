import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';

import _ from 'lodash';

import HudView from '../../component/HudView';
import Tabs from '../../component/Tabs';

import { config, theme } from '../../config';
import { action } from '../../redux/service/ask';
import * as WeChat from 'react-native-wechat-lib';
class AskInvite extends Component {

    static navigationOptions = {
        title: '邀请回答',
        headerRight: <View />,
    };

    state = {
        status: 0,
        shareType: false
    }

    ask = this.props.navigation.getParam('ask', { askId: 0, title: '' })
    item = []
    userFollows = []
    componentDidMount() {
        this._onHeaderRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const { follower, userFollows } = nextProps

        if (follower !== this.props.follower) {
            this.item = follower
        }
        if (userFollows !== this.props.userFollows) {
            this.userFollows = userFollows.items
        }
    }

    _onHeaderRefresh = () => {
        const { actions } = this.props;
        actions.ask.follower(this.ask.askId)
        actions.user.userFollows(this.ask.askId, 1, 1)
    }
    _onInvite = (val) => {
        const { actions } = this.props
        if (val.isInvite || val.askInvite) {
            this.refs.hud.show('已邀请', 1);
            return;
        }
        actions.ask.invite({
            ask_id: this.ask.askId,
            target_uid: val.userId,
            ctype: this.state.status,
            resolved: (res) => {
                this._onHeaderRefresh()
                this.refs.hud.show('邀请成功', 1);
            },
            rejected: (err) => {
                if(err=='target not follow'){
                    this.refs.hud.show('未关注此用户', 1);
                }else{
                    this.refs.hud.show('邀请失败', 1);
                }
            }
        })

    }
    _toggleShare = () => {
        WeChat.shareMiniProgram({
            title: this.ask.title,
            description: this.ask.title,
            thumbImageUrl: this.ask.gallery.length > 0 ? this.ask.gallery[0].fpath : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',
            userName: "gh_7bd862c3897e",
            webpageUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.perfectapp',
            hdImageUrl: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',
            path: '/comPages/pages/ask/question?askId=' + this.ask.askId + '&title=' + this.ask.title,
            withShareTicket: 'true',
            scene: 0,
        }).then(res=>{
            this.refs.hud.show('分享成功', 1);
        })
    }
    _renderItem = (item) => {

        const u = item.item
        if (this.state.status == 0)
            return (
                <View style={[styles.item, styles.fd_r, styles.jc_sb, styles.pt_15, styles.pb_15]}>
                    <View style={[styles.fd_r, styles.ai_ct]}>
                        <Image source={{ uri: u.avatar }} style={[styles.avatar]} />
                        <Text style={[styles.c33_label, styles.default_label, styles.pl_5]}>{u.nickname}</Text>
                    </View>
                    <TouchableOpacity style={[styles.btn, !u.isInvite && styles.bg_cfee]} onPress={() => this._onInvite(u)}>
                        <Text style={[styles.default_label, styles.tip_label, !u.isInvite && styles.cfee_label]}>{u.isInvite ? '已邀请' : '邀请'}</Text>
                    </TouchableOpacity>
                </View>
            )
        else
            return (
                <View style={[styles.item, styles.fd_r, styles.jc_sb, styles.pt_15, styles.pb_15]}>
                    <View style={[styles.fd_r, styles.ai_ct]}>
                        <Image source={{ uri: u.teacherImg }} style={[styles.avatar]} />
                        <Text style={[styles.c33_label, styles.default_label, styles.pl_5]}>{u.teacherName}</Text>
                    </View>
                    <TouchableOpacity style={[styles.btn, !u.isInvite && styles.bg_cfee]} onPress={() => this._onInvite(u)}>
                        <Text style={[styles.default_label, styles.tip_label, !u.isInvite && styles.cfee_label]}>{u.askInvite ? '已邀请' : '邀请'}</Text>
                    </TouchableOpacity>
                </View>
            )

    }

    render() {
        const { status } = this.state;

        return (
            <View style={styles.container}>

                <View style={[styles.tabs]}>
                    <Tabs items={['推荐', '讲师', '好友']} selected={status} atype={1} onSelect={(index) => {
                        this.setState({
                            status: index
                        }, () => {
                            this._onHeaderRefresh()
                        })
                    }} />
                </View>
                {status == 0 ?
                    <View style={[styles.wrap, styles.bg_white]}>

                        <View style={[styles.fd_r, styles.jc_ct, styles.pt_15, styles.pb_15]}>
                            <Text style={[styles.tip_label, styles.default_label]}>你可以邀请下面用户快速获得回答</Text>
                        </View>

                        <View style={[styles.pl_15, styles.pr_15]}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.item}
                                extraData={this.state}
                                renderItem={this._renderItem}
                            />
                        </View>
                    </View> :
                    status == 1 ?
                        <View style={[styles.wrap, styles.bg_white]}>

                            <View style={[styles.fd_r, styles.jc_ct, styles.pt_15, styles.pb_15]}>
                                <Text style={[styles.tip_label, styles.default_label]}>你可以邀请下面用户快速获得回答</Text>
                            </View>

                            <View style={[styles.pl_15, styles.pr_15]}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.userFollows}
                                    extraData={this.state}
                                    renderItem={this._renderItem}
                                />
                            </View>
                        </View>
                        : status == 2 ?
                            <View style={[styles.wrap, styles.bg_white]}>

                                <View style={[styles.fd_r, styles.jc_ct, styles.pt_15, styles.pb_15]}>
                                    <Text style={[styles.tip_label, styles.default_label]}>你可以邀请微信用户快速获得回答</Text>
                                </View>
                                <View style={[styles.mt_10, styles.fd_r, styles.jc_ct, styles.pt_15, styles.pb_15]}>
                                    <TouchableOpacity onPress={() => this._toggleShare()}>
                                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/v2/asset/wechat_icon.png' }} style={[{ width: 40, height: 40 }]} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.mt_5, styles.fd_r, styles.jc_ct, styles.pt_15, styles.pb_15]}>
                                    <Text style={[styles.sm_label, styles.gray_label]}>微信好友</Text>
                                </View>
                            </View> : null
                }
                {/* <Modal visible={shareType} transparent={true} onRequestClose={() => { }}>
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
                </Modal> */}
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    tabs: {
        borderWidth: 1,
        borderColor: '#F6F6F6',
        backgroundColor: '#ffffff',
        paddingTop: 5,
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
    avatar: {
        width: 30,
        height: 30,
        backgroundColor: '#dddddd',
        borderRadius: 15,
    },
    item: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F0F0F0',
    },
    btn: {
        width: 65,
        height: 26,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F1F1',
    },
    bg_cfee: {
        backgroundColor: '#FFEAE5',
    },
    cfee_label: {
        color: '#F4623F',
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

export const LayoutComponent = AskInvite;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        follower: state.ask.follower,
        userFollows: state.user.userFollows,
    };
}
