import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import asset from '../../config/asset';
import theme from '../../config/theme';
import Tabs from '../../component/Tabs';

class Rank extends Component {

    static navigationOptions = ({ navigation }) => {

        const back_val = navigation.getParam('back_val', 0);

        let backVal = '#FF8137';

        if (back_val === 0) {
            backVal = '#FF8137';
        } else if (back_val === 1) {
            backVal = '#FEBC3A';
        } else if (back_val === 2) {
            backVal = '#291CF9';
        }

        return {
            title: '排行榜',
            headerRight: (
                <View style={[styles.fd_r, styles.ai_ct]}>
                    <TouchableOpacity style={[styles.pr_15]} onPress={() => navigation.navigate('WinRecord', { type: back_val })}>
                        <Text style={[styles.default_label, styles.white_label, styles.fw_label]}>中奖纪录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.pr_15]} onPress={() => navigation.navigate('WinRules')}>
                        <Text style={[styles.default_label, styles.white_label, styles.fw_label]}>规则</Text>
                    </TouchableOpacity>
                </View>
            ),
            headerTintColor: '#ffffff',
            headerStyle: Platform.OS === 'android' ? {
                paddingTop: StatusBar.currentHeight,
                height: StatusBar.currentHeight + 44,
                backgroundColor: backVal,
                borderBottomWidth: 0,
                elevation: 0,
            } : {
                backgroundColor: backVal,
                borderBottomWidth: 0,
                elevation: 0,
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
            },
        }

    }


    constructor(props) {
        super(props);

        this.rankintegral = [];
        this.rankmonth = [];
        this.ranktotal = [];

        this.state = {
            status: 0,
            rankintegral: [],
            rankmonth: [],
            ranktotal: [],
            rankintegral_rk: [],
            rankmonth_rk: [],
            ranktotal_rk: [],
            rank_list: [],
            rank_list_rk: [],
            userInfo: {},
            studyRank: [],
            studyRank_rk: [],
        };

        this._onSelect = this._onSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { rankintegral, rankmonth, ranktotal, user, studyRank } = nextProps;
        if (rankintegral !== this.props.rankintegral) {
            this.rankintegral = rankintegral;
            this.setState({
                rankintegral: rankintegral,
                rankintegral_rk: rankintegral,
            });
        }
        if (rankmonth !== this.props.rankmonth) {
            this.setState({
                rankmonth: rankmonth,
                rankmonth_rk: rankmonth,
            });
        }
        if (ranktotal !== this.props.ranktotal) {
            this.setState({
                ranktotal: ranktotal,
                ranktotal_rk: ranktotal,
                rank_list: ranktotal,
                rank_list_rk: ranktotal,
            });
        }
        if (user !== this.props) {
            this.setState({
                userInfo: user,
            });
        }

        if (studyRank !== this.props.studyRank) {
            this.setState({
                studyRank: studyRank,
                studyRank_rk: studyRank,
            });
        }
    }


    componentDidMount() {
        const { actions } = this.props;
        actions.user.user();
        actions.study.rankintegral(1);
        actions.study.rankmonth(2);
        actions.study.ranktotal(0);

        actions.study.studyRank(2); // 学霸榜activity_id = 2, 财富榜 = 3， 活跃棒= 4
    }

    _onSelect(index) {
        const { navigation } = this.props;
        const { rankintegral, rankmonth, ranktotal, studyRank } = this.props;

        let rank_list = [];
        let rank_list_rk = [];

        if (index === 0) {
            rank_list = ranktotal;
            rank_list_rk = ranktotal;
            navigation.setParams({ back_val: 0 })
        } else if (index === 1) {
            rank_list = rankintegral;
            rank_list_rk = rankintegral;
            navigation.setParams({ back_val: 1 })
        } else if (index === 2) {
            rank_list = rankmonth;
            rank_list_rk = rankmonth;
            navigation.setParams({ back_val: 2 })
        }

        this.setState({
            status: index,
            rank_list: rank_list,
            rank_list_rk: rank_list_rk,
        });
    }

    render() {
        const { rank_list, userInfo, rank_list_rk, status } = this.state;


        if (userInfo !== undefined) {
            if (rank_list.length > 0 && rank_list.length < 101) {
                if (rank_list[rank_list.length - 1].userId === userInfo.userId) {
                    rank_list.pop();
                }
            }
        }

        let myRank = {};
        let rankhead = rank_list.slice(0, 3);
        let rankbody = rank_list.length > 3 ? rank_list.slice(3, 100) : []; //第四名以后展示的列表

        if (rankhead.length > 1) {
            let fuser = rankhead[0];
            rankhead[0] = rankhead[1];
            rankhead[1] = fuser;
        }

        // for (let i = 0; i < rank_list_rk.length; i++ ){
        //     if (rank_list_rk[i].userId === userInfo.userId){
        //         myRank = rank_list_rk[i];
        //     } else {

        //     }
        // }
        if (rank_list.length > 0) {
            myRank = rank_list[rank_list.length - 1]
        }

        let rank_bg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/f86e9d5b-8970-47d8-87b7-19684d15f0a0.png';
        let backBar = '#FF8137';

        if (status === 1) {
            rank_bg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/bcfe5c61-be45-4b64-b1af-34e193ff4122.png';
            backBar = '#FEBC3A';
        } else if (status === 2) {
            rank_bg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/779b5f1d-f92a-4ced-a85f-5c509101dcc6.png';
            backBar = '#291CF9';
        }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Image source={{ uri: rank_bg }} style={[styles.headerImg]} />

                    <View style={styles.rankcons}>
                        <View style={[styles.ranktop, styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                            <View style={[styles.ranktop_s, styles.fd_r, styles.ai_end, styles.mt_20]}>
                                {
                                    rankhead.map((rank, index) => {
                                        let color_arr = ['#F4FAFE', '#E4E4E5']
                                        let rankBox_w = styles.rankBox_l;
                                        let rank_head_box_w = styles.rank_head_box_l;
                                        let rank_cover_w = styles.rank_cover;
                                        let rank_icon = asset.study.rank_sec
                                        let idx = 2

                                        if (index === 1) {

                                            rankBox_w = styles.rankBox_c;
                                            rank_head_box_w = styles.rank_head_box_c;
                                            rank_cover_w = styles.rank_cover_c;
                                            color_arr = ['#FFFEE9', '#FED789']
                                            rank_icon = asset.study.rank_fir
                                            idx = 1

                                        } else if (index === 2) {

                                            rankBox_w = styles.rankBox_r;
                                            rank_head_box_w = styles.rank_head_box_r;
                                            color_arr = ['#FFFAF1', '#FED4AB'];
                                            rank_icon = asset.study.rank_thr;
                                            idx = 3

                                        }

                                        return (
                                            <LinearGradient colors={color_arr} style={[rankBox_w]} key={'rank' + index}>
                                                <View style={[styles.rank_tips, styles.d_flex, styles.fd_c, styles.ai_ct]}>
                                                    <View style={[rank_head_box_w]}>
                                                        <Image source={{ uri: rank.avatar }} style={[rank_cover_w]} />
                                                        <View style={[styles.auth_icon_cover, idx == 1 ? { bottom: 6, right: 6 } : {}]}>
                                                            <Image source={asset.study.auth_iocn} style={[styles.auth_icon]} />
                                                        </View>
                                                    </View>
                                                    <View style={[styles.rank_tip]} >
                                                        <Image source={rank_icon} style={[styles.rank_tip_icon]} />
                                                        <View style={[styles.rank_tip_box]}>
                                                            <Text style={[styles.sm_label, styles.white_label, styles.d_flex, styles.jc_ct, styles.ai_ct]}>{idx}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <Text style={[styles.c33_label, styles.default_label, styles.mt_15]} numberOfLines={1}>{rank.nickname}</Text>
                                                <View style={[styles.mt_5]}>
                                                    {
                                                        status === 1 ?
                                                            <Text style={[styles.sm_label, styles.sbrown_label]} numberOfLines={1}>{rank.integral}学分</Text>
                                                            : status === 0 ?
                                                                <Text style={[styles.sm_label, styles.sbrown_label]} numberOfLines={1}> {(rank.duration / 3600).toFixed(1)}小时</Text>
                                                                : status === 2 ?
                                                                    <Text style={[styles.sm_label, styles.sbrown_label]} numberOfLines={1}> {rank.duration}次</Text>
                                                                    : null
                                                    }
                                                </View>
                                            </LinearGradient>
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View>

                    <View style={[styles.rankList]}>
                        <View style={[styles.atabs]}>
                            <Tabs items={['学霸周榜', '学分月榜', '活跃月榜']} atype={0} selected={status} onSelect={this._onSelect} />
                        </View>
                        {
                            Object.keys(myRank).length > 0 ?
                                <View style={[styles.items, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct, styles.pt_10, styles.pb_10, styles.pl_10, styles.pr_30, styles.mt_10, { backgroundColor: backBar, }]} >
                                    <View style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.col_1]}>
                                        <View style={[styles.items_rank, styles.d_flex, styles.fd_c, styles.ai_ct]}>
                                            <Text style={[styles.lg20_label, styles.morange_label]}>{myRank.index > 500 ? '500+' : myRank.index}</Text>
                                            <Text style={[styles.smm_label, styles.morange_label]}>我的排名</Text>
                                        </View>
                                        <View style={[styles.item_rank_cover]}>
                                            <Image source={{ uri: myRank.avatar }} style={[styles.rank_cover]} />
                                            {
                                                myRank.isAuth === 1 ?
                                                    <View style={[styles.auth_icon_cover]}>
                                                        <Image source={asset.study.auth_iocn} style={[styles.auth_icon]} />
                                                    </View>
                                                    : null
                                            }

                                        </View>
                                        <View style={[styles.col_1, styles.ml_5, styles.mr_15]}>
                                            <Text style={[styles.default_label, styles.white_label, styles.wordstyle]}>{myRank.nickname}</Text>
                                        </View>
                                    </View>
                                    {
                                        status === 1 ?
                                            <Text style={[styles.default_label, styles.white_label]}>{myRank.integral}学分</Text>
                                            : status === 0 ?
                                                <Text style={[styles.default_label, styles.white_label]}>{(myRank.duration / 3600).toFixed(1)}小时</Text>
                                                : status === 2 ?
                                                    <Text style={[styles.default_label, styles.white_label]}>{myRank.duration}次</Text>
                                                    : null
                                    }
                                </View>
                                : null}


                        <View style={[styles.ranks]}>
                            {
                                rankbody.map((rank, index) => {
                                    let bg_color = styles.bg_wred;
                                    if (index % 2 === 0) {
                                        bg_color = styles.bg_white;
                                    }
                                    return (
                                        <View style={[styles.items_bg, bg_color]} key={'rank' + index}>
                                            <View style={[styles.rank_items, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct, styles.pt_10, styles.pb_10]}>
                                                <View style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.col_1]}>
                                                    <View style={[styles.items_rank]}>
                                                        <Text style={[styles.default_label, styles.torange_label, styles.fw_label]}>{index + 4}</Text>
                                                    </View>
                                                    <View style={[styles.item_rank_cover]}>
                                                        <Image source={{ uri: rank.avatar }} style={[styles.rank_cover]} />
                                                        {
                                                            rank.isAuth === 1 ?
                                                                <View style={[styles.auth_icon_cover]}>
                                                                    <Image source={asset.study.auth_iocn} style={[styles.auth_icon]} />
                                                                </View>
                                                                : null}
                                                    </View>
                                                    <View style={[styles.col_1, styles.ml_5, styles.mr_15]}>
                                                        <Text style={[styles.default_label, styles.c33_label, styles.wordstyle]}>{rank.nickname}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    status === 1 ?
                                                        <Text style={[styles.default_label, styles.tip_label]}>{rank.integral}学分</Text>
                                                        : status === 0 ?
                                                            <Text style={[styles.default_label, styles.tip_label]}>{(rank.duration / 3600).toFixed(1)}小时</Text>
                                                            : status === 2 ?
                                                                <Text style={[styles.default_label, styles.tip_label]}>{rank.duration}次</Text>
                                                                : null
                                                }
                                            </View>
                                        </View>
                                    );
                                })
                            }

                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    headerImg: {
        width: theme.window.width,
        height: 170,
    },
    rankcons: {
        width: theme.window.width,
        position: 'absolute',
        top: 0,
    },
    ranktop: {
        height: 170,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ranktop_s: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankBox_l: {
        width: 108,
        height: 132,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: '#E4E4E5',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    rankBox_c: {
        width: 120,
        height: 156,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#FED789',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    rankBox_r: {
        width: 108,
        height: 132,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#FED4AB',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    rank_head_box_l: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#CEE1EE',
        position: 'relative',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rank_head_box_c: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFD26A',
        position: 'relative',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rank_head_box_r: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#FBAC93',
        position: 'relative',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rank_cover: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f5f5f5',
    },
    rank_cover_c: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f5f5f5',
    },
    auth_icon_cover: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
    },
    auth_icon: {
        width: 14,
        height: 14,
    },
    rankList: {
        margin: 15,
        marginTop: 30,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop: 5,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
    },
    items: {
        backgroundColor: '#F4623F',
    },
    items_rank: {
        width: 60,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    item_rank_cover: {
        width: 50,
        justifyContent: 'center',
        position: 'relative',
    },
    items_bg: {
        paddingLeft: 10,
        paddingRight: 30,
    },
    rank_tip: {
        width: 20,
        height: 20,
        marginTop: -10,
        position: "relative",
    },
    rank_tip_icon: {
        width: 20,
        height: 20,
    },
    rank_tip_box: {
        width: 20,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        top: 0
    }
});

export const LayoutComponent = Rank;

export function mapStateToProps(state) {
    return {
        rankintegral: state.study.rankintegral,
        rankmonth: state.study.rankmonth,
        ranktotal: state.study.ranktotal,
        user: state.user.user,
        studyRank: state.study.studyRank,
    };
}
