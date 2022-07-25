import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, Modal, Platform, PermissionsAndroid } from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';
import Carousel from 'react-native-snap-carousel';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import HudView from '../../component/HudView';

import * as WeChat from 'react-native-wechat-lib';

const slideWidth = Dimensions.get('window').width;

class ShareInvite extends Component {
    static navigationOptions = {
        title: '邀请好友一起学习',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.inviteImgs = [];
        this.inviteList = [];
        this.page = 1;
        this.totalPage = 1;

        this.state = {
            userInfo: {},
            integral: 100,
            user: 0,
            items: ['', '', '', '', '', ''],
            currentIdx: 0,
            today: 0,
            total: 0,
            learn: 0,
            rank: 0,
            codeImg: '',
            tips: false,
            activeIndex: 0,
            shareType: 0,
            ios_Img: '',
        };
        this._toggleCanvas = this._toggleCanvas.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._getPost = this._getPost.bind(this);
        this._userInvite = this._userInvite.bind(this);
        this._keepImg = this._keepImg.bind(this);

        this._unwind = this._unwind.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { invitestat, study, userinvite, user, inviteImgs, userintegral } = nextProps;

        if (invitestat !== this.props.invitestat) {
            this.setState({
                integral: invitestat.integral,
                user: invitestat.user,
            });
        }

        if (study !== this.props.study) {
            this.learnList = study.learnList;
            this.setState({
                today: study.today,
                total: study.total,
                learn: study.learn,
                rank: study.rank,
            });
        }

        if (userinvite !== this.props.userinvite) {

            this.inviteList = this.inviteList.concat(userinvite.items);
            this.page = userinvite.page + 1;
            this.totalPage = userinvite.pages;

        }


        if (inviteImgs !== this.props.inviteImgs) {
            let invitImg = []
            for (let i = 0; i < inviteImgs.length; i++) {
                invitImg.push(inviteImgs[i].fpath)
            }
            this.inviteImgs = invitImg
        }

        if (user !== this.props.user) {
            this.setState({
                userInfo: user,
            });
        }
    }

    componentDidMount() {
        const { actions } = this.props;
        this._getCodeImg();
        actions.user.invitestat();
        actions.user.userinvite(0);
        actions.study.study();
        actions.user.user();
        actions.user.inviteImgs()
    }

    _getCodeImg() {
        const { actions } = this.props;
        actions.user.invitecode({
            resolved: (data) => {
                this.setState({
                    codeImg: data,
                });
            },
            rejected: (msg) => {
            },
        });
    }

    _toggleCanvas(type) {
        this.setState({
            shareType: type,
        }, () => {
            this.setState({
                tips: true,
            });
        });
    }


    _getPost() {
        const { actions } = this.props;

        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {

                if (result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {


                    this._keepImg()

                }

            })

        } else {
            this._keepImg()
        }

    }

    // 保存 
    _keepImg() {
        this.refs.viewShot.capture().then(uri => {

            CameraRoll.saveToCameraRoll(uri).then(result => {

                this.setState({
                    tips: false,
                }, () => {
                    this.refs.hud.show('保存成功', 2);
                });
            }).catch(error => {
                this.refs.hud.show('保存失败', 2);
            });
        });
    }



    _userInvite() {
        const { actions } = this.props;

        if (this.page < this.totalPage) {

            this.page = this.page + 1;

            actions.user.userinvite(this.page);

        }
    }

    _renderItem({ item, index }) {
        const { today, total, rank, userInfo, codeImg } = this.state;
        return (
            <View style={[styles.levels]}>
                <View style={[styles.sharebox]}>
                    <Image source={{ uri: item }} style={styles.shareImg} resizeMode={'contain'} />
                    {
                        index < 2 ?
                            <View style={[styles.sharecon]}>
                                <View style={[styles.sharecons_header, styles.fd_r, styles.ai_ct]}>
                                    <Image source={{ uri: userInfo.avatar }} style={[styles.sharecons_header_img]} />
                                    <Text style={[styles.sm9_label, styles.black_label, styles.ml_5]}>{userInfo.nickname}</Text>
                                </View>
                                <View style={[styles.fd_r, styles.jc_sb, styles.mt_5]}>
                                    <View style={[styles.fd_c, styles.ai_ct]}>
                                        <Text style={[styles.smm_label, styles.tip_label]}>累计学习</Text>
                                        <View style={[styles.fd_r]}  >
                                            <Text style={[styles.default_label, styles.black_label]}>{parseFloat(total / 3600).toFixed(1)}</Text>
                                            <Text style={[styles.sm9_label, styles.black_label, styles.mt_5]}>小时</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.fd_c, styles.ai_ct]}>
                                        <Text style={[styles.smm_label, styles.tip_label]}>今日学习</Text>
                                        <View style={[styles.fd_r]}  >
                                            <Text style={[styles.default_label, styles.black_label]}>{parseFloat(today / 3600).toFixed(1)}</Text>
                                            <Text style={[styles.sm9_label, styles.black_label, styles.mt_5]}>小时</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.fd_c, styles.ai_ct]}>
                                        <Text style={[styles.smm_label, styles.tip_label]}>行动力超过</Text>
                                        <View style={[styles.fd_r]}  >
                                            <Text style={[styles.default_label, styles.black_label]}>{rank}</Text>
                                            <Text style={[styles.sm9_label, styles.black_label, styles.mt_5]}>%的同学</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : null
                    }
                    <View>
                        <Image style={[styles.shareImgcode]} source={{ uri: codeImg }} />
                    </View>
                </View>
            </View>
        );
    }

    _onShare(shareType) {

        const { actions } = this.props;

        WeChat.isWXAppInstalled().then(isInstalled => {

            if (isInstalled) {
                this.refs.viewShot.capture().then(uri => {

                    if (Platform.OS === 'android') {
                        WeChat.shareImage({
                            imageUrl: uri,
                            scene: shareType
                        }).then(data => {
                            this.setState({
                                tips: false,
                            }, () => {
                                this.refs.hud.show('分享成功', 1);
                            })
                        }).catch(error => {

                        })
                    } else {

                        WeChat.shareImage({
                            imageUrl: 'file:/' + uri,
                            scene: shareType
                        }).then(data => {
                            this.setState({
                                tips: false,
                            }, () => {
                                this.refs.hud.show('分享成功', 1);
                            })
                        }).catch(error => {

                        })
                    }


                });
            }
        })


    }

    _unwind() {
        // console.log('展开');

    }

    render() {
        const { integral, user, items, currentIdx, activeIndex, codeImg, today, total, rank, userInfo, shareType } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView
                    //触底事件 这个很重要
                    onMomentumScrollEnd={this._userInvite}
                    automaticallyAdjustContentInsets={false}
                    //是否新显示滚动条
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={true}
                >
                    <View style={[styles.headbox, styles.pl_50, styles.pr_50, styles.pt_25, styles.fd_c, styles.jc_ct, styles.ai_ct]}>
                        <Carousel
                            useScrollView={true}
                            ref={(ref) => { //方法对引用Carousel元素的ref引用进行操作
                                this._carousel = ref;
                            }}
                            currentIndex={currentIdx}
                            data={this.inviteImgs}
                            // loop={true}
                            layout={'default'}
                            renderItem={this._renderItem}
                            sliderWidth={slideWidth}
                            itemWidth={270}
                            layoutCardOffset={18}
                            removeClippedSubviews={false}
                            onSnapToItem={(index) =>
                                this.setState({ activeIndex: index })
                            }
                        />
                        <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, styles.mt_20]}>
                            <Text style={[styles.lg_label, styles.c33_label]}>成功邀请新用户</Text>
                        </View>
                        <View style={[styles.items, styles.fd_r, styles.ai_ct, styles.mt_15]}>
                            <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct]}
                                onPress={() => this._toggleCanvas(0)}
                            >
                                <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]}>
                                    <Image source={asset.wechat} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label, styles.m_5]}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.ml_20, styles.mr_20]}
                                onPress={() => this._toggleCanvas(1)}
                            >
                                <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]} >
                                    <Image source={asset.friends} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label, styles.m_5]}>朋友圈</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct]}
                                onPress={() => this._toggleCanvas(2)}
                            >
                                <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]}>
                                    <Image source={asset.local} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label, styles.m_5]}>保存本地</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.invitebox, styles.mt_10]}>
                        <View style={[styles.fd_c]}>
                            <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>邀请明细</Text>
                            <View style={[styles.fd_r, styles.jc_sb, styles.mt_5]}>
                                <View style={[styles.fd_r, styles.ai_ct]}>
                                    <Text style={[styles.gray_label, styles.sm_label]}>已邀请<Text style={[styles.orange_label, styles.sm_label]}>{user}</Text>
                                        <Text style={[styles.gray_label, styles.sm_label]}>个好友，获得</Text><Text style={[styles.orange_label, styles.sm_label]}>{integral}</Text>学分</Text>
                                </View>
                                <TouchableOpacity style={[styles.fd_r, styles.ai_ct]} onPress={this._unwind}>
                                    <Text style={[styles.gray_label, styles.sm_label]}>展开</Text>
                                    <Image source={asset.arrow_bt} style={[styles.arrowbt]} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {
                            this.inviteList.length > 0 ?
                                <View style={[styles.invite_items, styles.p_20, styles.mt_15]}>
                                    {
                                        this.inviteList.map((item, index) => {
                                            return (
                                                <View key={'item' + index} style={[styles.border_bt, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.pt_10, styles.pb_10]}>
                                                    <View style={[styles.col_1]}>
                                                        <Text style={[styles.default_label, styles.c33_label]}>{item.nickname}</Text>
                                                    </View>
                                                    <View style={[styles.fd_r, styles.ml_15, styles.mr_15, styles.jc_sb, styles.col_1]}>
                                                        <Text style={[styles.default_label, styles.orange_label, styles.w30]}>+{item.integral}</Text>
                                                        <Text style={[styles.default_label, styles.tip_label, styles.txt_right, styles.ml_15]}>{(item.pubTimeFt).substring(0, 10)}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                                : null}

                    </View>
                    <Modal transparent={true} visible={this.state.tips} onRequestClose={() => { }}>
                        <View style={[styles.bg_container]}></View>
                        <View style={styles.tip}>
                            <ViewShot style={[{padding:0}]} ref='viewShot' options={{ format: 'png', quality: 0.1, result: Platform.OS === 'ios' ? 'tmpfile' : 'tmpfile' }}>
                                <View style={styles.canvas_tip}>
                                    <Image source={{ uri: this.inviteImgs[activeIndex] }} style={styles.canvas_cover} resizeMode={'cover'} />
                                    {
                                        activeIndex < 2 ?
                                            <View style={[styles.sharecon]}>
                                                <View style={[styles.sharecons_header, styles.fd_r, styles.ai_ct]}>
                                                    <Image source={{ uri: userInfo.avatar }} style={[styles.sharecons_header_img]} />
                                                    <Text style={[styles.sm9_label, styles.black_label, styles.ml_5]}>{userInfo.nickname}</Text>
                                                </View>
                                                <View style={[styles.fd_r, styles.jc_sb, styles.mt_5, styles.pl_5, styles.pr_5]}>
                                                    <View style={[styles.fd_c, styles.ai_ct]}>
                                                        <Text style={[styles.smm_label, styles.tip_label]}>累计学习</Text>
                                                        <View style={[styles.fd_r]}  >
                                                            <Text style={[styles.default_label, styles.black_label]}>{parseFloat(total / 3600).toFixed(1)}</Text>
                                                            <Text style={[styles.sm9_label, styles.black_label, styles.mt_5]}>小时</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.fd_c, styles.ai_ct]}>
                                                        <Text style={[styles.smm_label, styles.tip_label]}>今日学习</Text>
                                                        <View style={[styles.fd_r]}  >
                                                            <Text style={[styles.default_label, styles.black_label]}>{parseFloat(today / 3600).toFixed(1)}</Text>
                                                            <Text style={[styles.sm9_label, styles.black_label, styles.mt_5]}>小时</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.fd_c, styles.ai_ct]}>
                                                        <Text style={[styles.smm_label, styles.tip_label]}>行动力超过</Text>
                                                        <View style={[styles.fd_r]}  >
                                                            <Text style={[styles.default_label, styles.black_label]}>{rank}</Text>
                                                            <Text style={[styles.sm9_label, styles.black_label, styles.mt_5]}>%的同学</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            : null
                                    }
                                    <View>
                                        <Image style={[styles.shareImgcode]} source={{ uri: codeImg }} />
                                    </View>
                                </View>
                            </ViewShot>
                            <View style={[styles.canvas_btns, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                <TouchableOpacity style={[styles.layer_btn, styles.mt_10]} onPress={() => this.setState({ tips: false })}>
                                    <Text style={[styles.default_label, styles.white_label]}>取消</Text>
                                </TouchableOpacity>
                                {
                                    shareType === 0 ?
                                        <TouchableOpacity style={[styles.layer_btn, styles.mt_10, styles.ml_20]}
                                            onPress={() => this._onShare(shareType)}
                                        >
                                            <Text style={[styles.default_label, styles.white_label]}>分享</Text>
                                        </TouchableOpacity>
                                        : null}
                                {
                                    shareType === 1 ?
                                        <TouchableOpacity style={[styles.layer_btn, styles.mt_10, styles.ml_20]}
                                            onPress={() => this._onShare(shareType)}
                                        >
                                            <Text style={[styles.default_label, styles.white_label]}>分享</Text>
                                        </TouchableOpacity>
                                        : null}
                                {
                                    shareType === 2 ?
                                        <TouchableOpacity style={[styles.layer_btn, styles.mt_10, styles.ml_20]} onPress={this._getPost}>
                                            <Text style={[styles.default_label, styles.white_label]}>保存本地</Text>
                                        </TouchableOpacity>
                                        : null}
                            </View>
                        </View>
                    </Modal>
                    <HudView ref={'hud'} />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    headbox: {
        backgroundColor: '#ffffff',
        paddingBottom: 12,
    },
    item: {
        textAlign: 'center',
    },
    item_box: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    invitebox: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 4,
    },
    arrowbt: {
        width: 12,
        height: 12,
    },
    invite_items: {
        paddingTop: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    sharebox: {
        height: 450,
        width: 270,
        borderRadius: 3,
        position: 'relative',
    },
    shareImg: {
        height: 450,
        width: 270,
    },
    sharecon: {
        position: 'absolute',
        bottom: 0,
        left: 30,
        height: 100,
        width: 210,
        marginBottom: 45,
    },
    sharecons_header_img: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    shareImgcode: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginRight: 35,
        marginBottom: 40,
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    tip: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        width: 270,
        height: 490,
        marginLeft: -135,
        marginTop: -240,
        borderRadius: 5,
    },
    canvas_tip: {
        width: 270,
        height: 450,
        position: 'relative',
    },
    canvas_cover: {
        width: 270,
        height: 450,
    },
    layer_btn: {
        width: 100,
        height: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ffffff',
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const LayoutComponent = ShareInvite;

export function mapStateToProps(state) {
    return {
        invitestat: state.user.invitestat,
        inviteImgs: state.user.inviteImgs,
        study: state.study.study,
        user: state.user.user,
        userintegral: state.user.userintegral,
        userinvite: state.user.userinvite
    };
}
