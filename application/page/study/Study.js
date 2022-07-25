import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Alert, ImageBackground } from 'react-native';

import _ from 'lodash';
import * as WeChat from 'react-native-wechat-lib';
import Tabs from '../../component/Tabs';
import VVodCell from '../../component/cell/VVodCell';
import PVodCell from '../../component/cell/PVodCell'
import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';

class Study extends Component {
    static navigationOptions = {
        title: '学习',
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.learnList = [];
        this.learncourse = [];
        this.ranktotal = [];

        this.state = {
            loginStatus: false,
            status: 0,
            courserecom: [],
            today: 0,
            total: 0,
            learn: 0,
            rank: 0,
        };

        this._refreshStudy = this._refreshStudy.bind(this);
        this._refreshRecomm = this._refreshRecomm.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._studyData = this._studyData.bind(this);
        this._checkRank = this._checkRank.bind(this);

        this._onCourse = this._onCourse.bind(this);
        this._toWxchat = this._toWxchat.bind(this);
        this._onLink = this._onLink.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { courserecom, user, study, learncourse, ranktotal } = nextProps;

        if (!_.isEqual(courserecom, this.props.courserecom)) {
            this.setState({
                courserecom: courserecom,
            });
        }

        if (_.isEmpty(user) && !this.state.loginStatus) {
            this.setState({
                loginStatus: false
            })
        } else if (!_.isEqual(user, this.props.user)) {
            this.setState({
                loginStatus: !_.isEmpty(user)
            })
        }

        if (ranktotal !== this.props.ranktotal) {
            this.ranktotal = ranktotal
        }

        if (!_.isEmpty(study)) {
            this.learnList = study.learnList;

            this.setState({
                today: study.today,
                total: study.total,
                learn: study.learn,
                rank: study.rank,
            });
        }

        if (!_.isEmpty(learncourse)) {
            this.learncourse = learncourse.items;
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._refreshRecomm();


        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._refreshStudy();
        })
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }

    _refreshRecomm() {
        const { actions } = this.props;
        actions.course.recomm(8);
        actions.study.ranktotal();
    }

    _refreshStudy() {
        const { actions } = this.props;
        this.learnList = [];
        this.learncourse = [];

        this.setState({
            today: 0,
            total: 0,
            learn: 0,
            rank: 0,
        }, () => {
            actions.user.user();
            actions.study.study();
            actions.study.learncourse(0, 0);
        });
    }

    _oncourseDesc(item) {
        const { navigation } = this.props;
        navigation.navigate('Vod', { course: item });
    }

    _onSelect = (index) => {
        const { navigation, user } = this.props

        if (index === 1) {
            if (!_.isEmpty(user)) {
                if (user.isAuth === 1) {
                    navigation.navigate('StudyMap')
                } else {
                    this.refs.hud.show('学习地图仅对特定对象可见', 1);
                }

            } else {

                navigation.navigate('PassPort');

            }
        } else {
            this.setState({
                status: index
            })
        }

    }


    // 跳转到学习数据
    _studyData() {
        const { navigation, user } = this.props


        if (!_.isEmpty(user)) {

            navigation.navigate('StudyData')

        } else {

            navigation.navigate('PassPort');

        }
    }

    // 查看学习排名
    _checkRank() {
        const { navigation,user } = this.props
        if (!_.isEmpty(user)) {
            navigation.navigate('Rank')
        } else {
            navigation.navigate('PassPort');
        }
    }



    _onLink(courseId, courseName, ctype) {
        // 音频未做处理
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
            }
        })
    }

    _toWxchat(courseId, courseName, ctype) {
        Alert.alert('课程提示', '此课程只能在微信小程序观看', [
            {
                text: '取消', onPress: () => {

                }
            }, {
                text: '跳转', onPress: () => {
                    this._onLink(courseId, courseName, ctype);

                }
            }])
    }


    _onCourse(course) {
        const { navigation } = this.props;

        if (course.ctype == 0) {

            if (course.plant === 1) {
                this._toWxchat(course.courseId, course.courseName, course.ctype);
            } else {
                navigation.navigate('Vod', { course: course, courseName: course.courseName });
            }

        } else if (course.ctype === 1) {
            if (course.plant === 1) {
                this._toWxchat(course.courseId, course.courseName, course.ctype);
            } else {
                navigation.navigate('Audio', { course: course, courseName: course.courseName });
            }
        } else if (course.ctype == 3) {
            navigation.navigate('Graphic', { course: course, courseName: course.courseName });
        }
    }



    render() {
        const { navigation } = this.props;
        const { courserecom, today, total, learn, rank, loginStatus, status } = this.state;


        let rankTotal = []
        if (Array.isArray(this.ranktotal)) {
            rankTotal = this.ranktotal.slice(0, 3)
        }


        return (
            <View style={[styles.container]}>

                <View style={[styles.atabs]}>
                    <Tabs items={['学习记录', '学习地图']} atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={[styles.study_head, styles.mt_15]}>
                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/6577a052-8501-422a-a71e-254619bbdf07.png' }} mode='aspectFit' style={[styles.study_bg]} />
                        <View style={[styles.study_head_desc, styles.d_flex, styles.fd_c, styles.jc_sb, styles.ai_ct]} >
                            <View style={[styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mt_25, styles.study_desc_wd]}>
                                <TouchableOpacity style={[styles.col_1, styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct]}
                                    onPress={this._studyData}
                                >
                                    <Text style={[styles.white_label, styles.sm_label]}>今日学习</Text>
                                    <Text style={[styles.white_label, styles.lg24_label, styles.mt_5]}>{(today / 3600).toFixed(1)}<Text style={[styles.smm_label, styles.pl_5, styles.white_label]}>小时</Text></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.col_1, styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.borderSty]}
                                    onPress={this._studyData}
                                >
                                    <Text style={[styles.white_label, styles.sm_label]}>累计学习</Text>
                                    <Text style={[styles.white_label, styles.lg24_label, styles.mt_5]}>{(total / 3600).toFixed(1)}<Text style={[styles.smm_label, styles.pl_5, styles.white_label]}>小时</Text></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.col_1, styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct]}
                                    onPress={this._studyData}
                                >
                                    <Text style={[styles.white_label, styles.sm_label]}>连续学习</Text>
                                    <Text style={[styles.white_label, styles.lg24_label, styles.mt_5]}>{learn}<Text style={[styles.smm_label, styles.white_label]}> 天</Text></Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.mt_20]}
                                onPress={this._studyData}
                            >
                                <Text style={[styles.sm_label, styles.learntxt]}>学习数据</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.jb_sb, styles.ai_ct, styles.jc_sb, styles.study_rank]}
                        onPress={this._checkRank}
                    >
                        <View style={[styles.d_flex, styles.fd_r, styles.ai_ct]}>
                            <Image source={asset.study.r_rank} style={[styles.rank_cover]} />
                            <Text style={[styles.default_label, styles.ml_5, { color: '#FFA349' }]}>学习排行榜</Text>
                        </View>
                        <View style={[styles.d_flex, styles.fd_r, styles.ai_ct]} >
                            {
                                rankTotal.map((rt, index) => {
                                    return (
                                        <Image source={{ uri: rt.avatar }} key={'rt' + index} style={[styles.rtAvatar]} />
                                    )
                                })
                            }
                            <Image source={asset.arrow_right} style={[styles.rightArrow, styles.ml_15]} />
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.s_box, styles.pl_15, styles.pr_15, styles.mb_10, styles.fd_r, styles.ai_ct]}>
                        <TouchableOpacity style={[{ position: 'relative' }]} onPress={() => navigation.navigate('ProvinData')}>
                            <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/397f2f6b-71c7-41dc-b974-35e823b0a2df.png' }} style={[styles.s_box_item, styles.fd_r, styles.ai_ct]} />
                            <View style={[{ position: 'absolute', left: 7, top: 30 }]}>
                                <Text style={[styles.white_label, styles.default_label, styles.default_label, styles.pl_10]}>各省学习排行</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{ position: 'relative' }]} onPress={this._checkRank}>
                            <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/07caec41-b58a-4c17-848b-1ccbf5c9d8cc.png' }} style={[styles.s_box_item, styles.ml_10, styles.fd_r, styles.ai_ct]} />
                            <View style={[{ position: 'absolute', left: 7, top: 30 }]}>
                                <Text style={[styles.white_label, styles.default_label, styles.default_label, styles.pl_10]}>个人学习排行</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.pl_15, styles.pr_15, styles.mt_5]}>
                        <View style={[styles.study_course, styles.bg_white, styles.d_flex, styles.fd_c, styles.pl_15, styles.pr_15, styles.pt_15, styles.pb_15]}>
                            <View style={[styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>在学课程</Text>
                                <TouchableOpacity style={[styles.d_flex, styles.ai_ct, styles.fd_r]}
                                    onPress={() => navigation.navigate(loginStatus ? 'StudyRecord' : 'PassPort')}
                                >
                                    <Text style={[styles.default_label, styles.tip_label, styles.fw_label]}>全部</Text>
                                    <Image source={asset.arrow_right} style={[styles.arrow_right, styles.ml_2]} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.c_items, styles.mt_10]}>
                                {
                                    this.learncourse.map((stu, index) => {
                                        const on = (this.learncourse.length - 1) === index;

                                        return (
                                            <PVodCell course={stu} type={on} onPress={(stu) => navigation.navigate('Vod', { course: stu })} />
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View>

                    <View style={[styles.pl_15, styles.pr_15, styles.mt_15]}>
                        <View style={[styles.video, styles.border_bt, styles.pl_10, styles.pr_10, styles.bg_white, styles.mt_25]}>
                            <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_15, styles.pb_15, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>课程推荐</Text>
                                <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._refreshRecomm}>
                                    <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>换一批</Text>
                                    <Image source={asset.update_icon} style={[styles.update_icon, styles.ml_5]} />
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.fd_r, styles.f_wrap, styles.jc_sb]}>
                                {
                                    courserecom.map((item, index) => {
                                        return (
                                            <VVodCell course={item} style={styles.vvitem} key={'recomm_' + index}
                                                onPress={() => this._onCourse(item)}
                                            />
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    <View style={[styles.d_flex, styles.ai_ct, styles.jc_ct, styles.pt_15]}>
                        <Text style={[styles.sm_label, styles.tip_label]}>没有更多数据了</Text>
                    </View>
                </ScrollView>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FBFDFF',
    },
    atabs: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#fafafa',
        backgroundColor: '#ffffff'
    },
    study_head: {
        width: '100%',
        height: 135,
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
    },
    study_bg: {
        width: theme.window.width - 30,
        height: 130,
        position: 'absolute',
        top: 0,
        left: 15,
        borderRadius: 10
    },
    study_head_desc: {
        width: theme.window.width - 30,
        zIndex: 99,
        position: 'absolute',
        top: 0,
        left: 15
    },
    borderSty: {
        borderRightWidth: 1,
        borderRightColor: '#f3f3f3',
        borderStyle: 'solid',
        borderLeftWidth: 1,
        borderLeftColor: '#f3f3f3',
    },
    study_desc_wd: {
        width: theme.window.width - 30,
    },
    learntxt: {
        color: '#FBE59A'
    },
    study_course: {
        borderRadius: 5,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2,//安卓，让安卓拥有阴影边框
    },
    vvitem: {
        width: '48%',
    },
    item: {
        width: (theme.window.width - 46) / 3,
        height: 60,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#dddddd',
    },
    conx: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#dddddd',
        paddingLeft: 2,
        paddingRight: 2,
        marginTop: 10,
    },

    video: {
        borderRadius: 5,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2,//安卓，让安卓拥有阴影边框
    },
    arrow_right: {
        width: 6,
        height: 11,
        marginLeft: 5,
    },
    items: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemList: {
        width: '48%',
    },
    update_icon: {
        width: 14,
        height: 14,
    },
    item_cover_cons: {
        position: 'relative',
        height: 81,
    },
    item_cover: {
        width: '100%',
        height: 81,
        borderRadius: 4,
    },


    rank_cover: {
        width: 18,
        height: 18,
    },
    c_item: {
        position: 'relative',
    },
    rtAvatar: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: -5
    },
    study_rank: {
        margin: 15,
        backgroundColor: '#ffffff',
        height: 44,
        borderRadius: 5,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    rightArrow: {
        width: 6,
        height: 11,
    },

    s_box_item: {
        width: (theme.window.width - 40) / 2,
        height: 70,
        borderRadius: 8,
    }

});


export const LayoutComponent = Study;


export function mapStateToProps(state) {
    return {
        user: state.user.user,
        courserecom: state.course.courserecom,
        study: state.study.study,
        learncourse: state.study.learncourse,
        ranktotal: state.study.ranktotal,
    };
}
