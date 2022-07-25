import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter, Platform, ScrollView, NativeModules, StatusBar, ImageBackground } from 'react-native';

const { StatusBarManager } = NativeModules;

import _ from 'lodash';
import { Header } from 'react-navigation-stack';
import Carousel from 'react-native-looped-carousel';



import theme from '../../config/theme';
import asset from '../../config/asset';
import iconMap from '../../config/font'

import LabelBtn from '../../component/LabelBtn';
import HudView from '../../component/HudView';

class User extends Component {

    userlevel = []
    adverts = []
    level = 0
    state = {
        loginStatus: false,
        userInfo: {},
        nowLevel: 0,
        integral: 0,
        lottery: 0,
        prestige: 0,
        userId: 0,
        avatar: '',
        medalNum: 0,
        teacher: false,
        user_bg: asset.user.user_v2,

        statusBarHeight: 20, //状态栏的高度
        navHeight: 20,
        billImg: '',
        isOpne: 1,
        closeText: '',
        courseOpen: 1,
        teacherDTO:0,
    }

    componentWillMount() {

        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight(statusBarHeight => {
                this.setState({
                    statusBarHeight: statusBarHeight.height,
                });
            });
        } else {
            const statusBarHeight = StatusBar.currentHeight;
            this.setState({
                statusBarHeight: statusBarHeight,
            });
        }

        let navigationHeight = Header.HEIGHT;//即获取导航条高度
        this.setState({
            navHeight: navigationHeight,
        });
    }

    componentDidMount() {
        const { navigation } = this.props;

        this._onRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })

        this.jls = DeviceEventEmitter.addListener('jump', (page) => {
            navigation.navigate(page);
        })

        //navigation.navigate('DownloadChannel')
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
        this.jls && this.jls.remove();
    }

    componentWillReceiveProps(nextProps) {
        const { user, userlevel, aduser, config, userbills } = nextProps;

        if (!_.isEqual(user, this.props.user)) {
            this.level = user.level
            this.setState({
                loginStatus: !_.isEmpty(user),
                userInfo: user,
                integral: user.integral || 0,
                lottery: user.lottery || 0,
                prestige: user.prestige || 0,
                userId: user.userId || 0,
                avatar: user.avatar || '',
                teacher: user.teacher || false,
                medalNum: user.medalNum || 0,
            });
            if(user.teacher){
                this.setState({
                    teacherDTO:user.teacherDTO
                })
            }
        }

        if (aduser !== this.props.aduser) {
            this.adverts = aduser;
        }

        if (!_.isEqual(userlevel, this.props.userlevel)) {
            this.userlevel = userlevel;
        }

        if (config !== this.props.config && config.ui_choose_field) {
            const ui = JSON.parse(config.ui_choose_field);
            this.setState({
                user_bg: { uri: ui.user_bg },
                isOpne: parseInt(config.user_apply_status),
                closeText: config.user_apply_close_text,
                courseOpen: parseInt(config.course_agent_status)
            })
        }
    }

    _onRefresh = () => {
        const { actions } = this.props;
        actions.user.user();
        actions.user.userlevel();
        actions.site.aduser();
        actions.site.config();
        let date = new Date()
        let year = date.getFullYear()
        actions.user.userBills({
            year: year,
            resolved: (res) => {
                if (res.bill_info) {
                    let list = res.bill_info
                    this.setState({
                        billImg: list.billImg,
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }

    _onPage = (nav_val) => {
        const { navigation } = this.props;
        const { loginStatus, userInfo, integral, lottery, nowLevel, userId, avatar, isOpne, closeText } = this.state;

        if (loginStatus || nav_val == 'Setting') {

            if (nav_val == 'GrowthEquity') {

                navigation.navigate('GrowthEquity', { integral: userInfo.integral, prestige: userInfo.prestige, nowLevel: nowLevel, avatar: userInfo.avatar });

            } else if (nav_val == 'Lucky') {

                navigation.navigate('Lucky', { integral: integral, lottery: lottery, nowLevel: nowLevel, avatar: userInfo.avatar });

            } else if (nav_val == 'RealAuth') {
                if (userInfo.isAuth === 1) {
                    this.refs.hud.show('已认证', 1);
                } else {
                    navigation.navigate('RealAuth');
                }

            } else if (nav_val == 'UserIntegral') {
                navigation.navigate('UserIntegral', { integral: integral });
            } else if (nav_val == 'UserCard') {
                navigation.navigate('UserCard', { userId: userId, avatar: avatar, username: userInfo.nickname, totalLearn: userInfo.totalLearn, learn: userInfo.learn });
            } else if (nav_val == 'UserMedal') {
                navigation.navigate('UserMedal');
            } else if (nav_val == 'UserFous') {
                navigation.navigate('UserFous');
            } else if (nav_val == 'UserSignIn') {
                navigation.navigate('UserSignIn');
            } else if (nav_val == 'UserReward') {
                navigation.navigate('UserReward');
            } else if (nav_val == 'UserPersonal') {
                navigation.navigate('UserPersonal', { userId: userId, avatar: avatar, commentName: userInfo.nickname })
            } else if (nav_val == 'PushClass') {
                if (this.state.courseOpen == 0) {
                    this.refs.hud.show('暂未开启', 1);
                } else {
                    navigation.navigate('PushClass');
                }
            } else if (nav_val == 'LectApply') {
                if (isOpne === 0) {
                    this.refs.hud.show(closeText, 1);
                } else {
                    navigation.navigate(nav_val);
                }
            } else if(nav_val =='LectReward'){
                navigation.navigate(nav_val,{type:this.state.teacher?1:0});
            }else if(nav_val =='LectCourse'){
                navigation.navigate(nav_val,{teacherDTO:this.state.teacherDTO});
            }else{
                navigation.navigate(nav_val);
            }

        } else {
            navigation.navigate('PassPort');
        }

    }

    render() {
        const { navigation } = this.props
        const { userInfo, integral, loginStatus, teacher, user_bg, medalNum } = this.state;

        let avatar = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/5750b2cd-58b9-47b6-938f-41b5adca8f3b.png';

        if (loginStatus && userInfo.avatar != '') {
            avatar = userInfo.avatar;
        }
        let nowLevel = 0
        if (this.userlevel.length > 0) {
            for (let i = 0; i < this.userlevel.length; i++) {
                if (this.userlevel[i].levelId === this.level + 1) {
                    nowLevel = i;
                    break;
                }
            }
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <ImageBackground source={user_bg} resizeMode='cover' style={[styles.userbox, styles.fd_c, styles.jc_ct]}>
                        <View style={[styles.fd_r, styles.jc_fe, styles.pr_25]}>
                            <TouchableOpacity onPress={() => this._onPage('Message')}>
                                <Text style={[styles.icon, styles.white_label]}>{iconMap('xiaoxi')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ml_15]} onPress={() => this._onPage('Setting')}>
                                <Text style={[styles.icon, styles.white_label]}>{iconMap('shezhi')}</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            loginStatus ?

                                <View style={[styles.fd_r, styles.ai_ct, styles.pl_25, styles.pr_20, styles.pt_10]}>
                                    <TouchableOpacity style={[styles.jc_ct, styles.ai_ct]} onPress={() => this._onPage('UserPersonal')}>
                                        <Image source={{ uri: avatar }} style={styles.header_cover} />
                                    </TouchableOpacity>
                                    <View style={[styles.fd_c, styles.ml_8, styles.jc_sb, styles.col_1]} >
                                        <View style={[styles.fd_r, styles.ai_ct]}>
                                            <Text style={[styles.lg_label, styles.white_label]}>{userInfo.nickname}</Text>
                                            {
                                                teacher ?
                                                    <View style={[styles.tips_btn, styles.fd_r, styles.jc_ct, styles.ai_ct, styles.pl_5, styles.pr_5, styles.ml_5]}>
                                                        <Text style={[styles.smm_label, styles.white_label]}>{userInfo.teacherDTO.wtype == 0 ? '讲师' : userInfo.teacherDTO.wtype == 1 ? '经销商讲师' : userInfo.teacherDTO.wtype == 2 ? '外部讲师' : userInfo.teacherDTO.wtype == 3 ? '内部讲师' : null}</Text>
                                                    </View>
                                                    : null
                                            }
                                            <View style={[styles.tips_btn, styles.fd_r, styles.jc_ct, styles.ai_ct, styles.pl_5, styles.pr_5, styles.ml_5]}>
                                                <Text style={[styles.smm_label, styles.white_label]}>Lv.{nowLevel}</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.edit_info, styles.ml_10, styles.fd_r, styles.ai_ct]} onPress={() => this._onPage('UserInfo')}>
                                                <Image source={asset.edit} style={[styles.tips_edit]} />
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            teacher ?
                                                <View style={[styles.tips_btn, styles.fd_r, styles.jc_ct, styles.ai_ct, styles.pl_5, styles.pr_5, styles.ml_5, styles.mt_5, { width: 120 }]}>
                                                    <Text style={[styles.smm_label, styles.white_label]}>粉丝数：{userInfo.teacherDTO.follow}</Text>
                                                </View>
                                                : null
                                        }
                                        <View style={[styles.row, styles.ai_fs, styles.jc_sb, styles.mt_5]}>
                                            <View style={[styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                                <View style={[styles.modelbox]}>
                                                    <Image source={asset.user.user_model} style={[styles.user_model]} />
                                                    <View style={[styles.modeldot, styles.fd_r, styles.jc_fe, styles.ai_ct]}>
                                                        <Text style={[styles.white_label, styles.sm_label]}>{medalNum}勋章</Text>
                                                    </View>
                                                </View>
                                                <View style={[styles.tips_btn, styles.jc_ct, styles.ai_ct, styles.ml_5, styles.mr_5, styles.pl_5, styles.pr_5, { backgroundColor: '#F25D13' }]}>
                                                    <Text style={[styles.smm_label, styles.white_label]}>{userInfo.isAuth === 1 ? '已实名' : '未认证'}</Text>
                                                </View>
                                                {
                                                    userInfo.isAuth ?
                                                        <View style={[styles.tips_btn, styles.jc_ct, styles.ai_ct, styles.mr_5, styles.pl_5, styles.pr_5, { backgroundColor: '#F25D13' }]}>
                                                            <Text style={[styles.smm_label, styles.white_label]}>{userInfo.isPrimary === 0 && userInfo.isAuth == 1 ? '副卡' : userInfo.isPrimary === 1 && userInfo.isAuth == 1 ? '正卡' : ''}</Text>
                                                        </View>
                                                        : null
                                                }
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('UserInfo')}
                                            >
                                                <Text style={[styles.icon, styles.white_label]}>{iconMap('right')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[styles.white_label, styles.mt_5, styles.sm_label]}>我的学分 {integral}</Text>
                                    </View>
                                </View>
                                :
                                <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pl_30, styles.pr_20, styles.pt_10]} onPress={() => this._onPage('UserInfo')}>
                                    <View style={[styles.cover]}>
                                        <Image source={asset.user.u_header} style={styles.header_cover} />
                                    </View>
                                    <Text style={[styles.white_label, styles.ml_10]}>点击登录</Text>
                                </TouchableOpacity>
                        }
                    </ImageBackground>

                    <View style={styles.headbox}>
                        <View style={[styles.cate_box, styles.bg_white, styles.fd_r, styles.circle_10, styles.m_20]}>
                            <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1, styles.pt_20, styles.pb_20]} onPress={() => this._onPage('UserCollect')}>
                                <Image source={asset.user.user_collect} style={[styles.icon_item]} />
                                <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的收藏</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1, styles.pt_20, styles.pb_20]} onPress={() => this._onPage('UserFous')}>
                                <Image source={asset.user.user_focus} style={[styles.icon_item]} />
                                <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的关注</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1, styles.pt_20, styles.pb_20]} onPress={() => this._onPage('LectReward')}>
                                <Image source={asset.user.user_intergral} style={[styles.icon_item]} />
                                <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的打赏</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1, styles.pt_20, styles.pb_20]}
                                onPress={() => this._onPage('UserBuyCourse')}
                            >
                                <Image source={asset.user.user_hascourse} style={[styles.icon_item]} />
                                <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>已购课程</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.pl_15, styles.pr_15]}>
                        <View style={[styles.dshadow, styles.circle_10, styles.bg_white, styles.mb_15, styles.p_15]}>
                            <Text style={[styles.lg_label, styles.mb_15]}>常用功能</Text>
                            <View style={[styles.bg_white, styles.fd_r, styles.mt_5, styles.mb_15]}>
                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('UserIntegral')}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_accout} mode='aspectFit' style={{ width: 23, height: 28 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的账户</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this.props.navigation.navigate('GrowthEquity', { integral: userInfo.integral, prestige: userInfo.prestige, nowLevel: nowLevel, avatar: userInfo.avatar })}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_growth} mode='aspectFit' style={{ width: 28, height: 25 }} />
                                    </View>

                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>成长特权</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('UserCoupon')}  >
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_coupon} mode='aspectFit' style={{ width: 30, height: 25 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>优惠券</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('PushClass')}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_const} mode='aspectFit' style={{ width: 24, height: 26 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>推课赚钱</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={[styles.bg_white, styles.fd_r, styles.mt_15, styles.mb_15]}>
                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('UserAsk')}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_studydata} mode='aspectFit' style={{ width: 22, height: 26 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的内容</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('UserCert')}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_cert} mode='aspectFit' style={{ width: 23, height: 26 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的证书</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('UserMedal')}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.user_reward} mode='aspectFit' style={{ width: 24, height: 26 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>我的勋章</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.d_flex, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]} onPress={() => this._onPage('DownloadChannel')}>
                                    <View style={[styles.icon_w, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                        <Image source={asset.user.download} mode='aspectFit' style={{ width: 28, height: 23 }} />
                                    </View>
                                    <Text style={[styles.sm_label, styles.c33_label, styles.pt_10, styles.fw_label]}>下载专区</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            this.state.billImg ?
                                <TouchableOpacity onPress={() => navigation.navigate('Niandu')}>
                                    <Image source={{ uri: this.state.billImg }} style={[styles.bill]} />
                                </TouchableOpacity>
                                : null
                        }

                        <View style={[styles.bg_white, styles.dshadow, styles.p_15, styles.circle_10, styles.mt_15, styles.mb_15]}>
                            <Text style={[styles.lg_label, styles.mb_15]}>互动签到</Text>
                            <View style={[styles.row, styles.ai_fs, styles.f_wrap, styles.jc_sb]}>
                                {1 ? null :
                                    <View>
                                        <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.sitem, styles.pr_25, styles.mb_15]} onPress={() => this._onPage('Forest')}>
                                            <View>
                                                <Text>完美林</Text>
                                                <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>积累绿色能量 &gt;</Text>
                                            </View>
                                            <Image source={asset.user.forest} style={{ width: 18, height: 31 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.sitem, styles.pr_25]} onPress={() => this._onPage('Step')}>
                                            <View>
                                                <Text>健康步数</Text>
                                                <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>步数领学分 &gt;</Text>
                                            </View>
                                            <Image source={asset.user.step} style={{ width: 25, height: 27 }} />
                                        </TouchableOpacity>
                                    </View>
                                }
                                <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.sitem, styles.pr_25, styles.mb_15]} onPress={() => this._onPage('UserSignIn')}>
                                    <View>
                                        <Text>每日签到</Text>
                                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>连续签到 &gt;</Text>
                                    </View>
                                    <Image source={asset.user.signin} style={{ width: 21, height: 19 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.row, styles.ai_ct, styles.jc_sb, styles.sitem, styles.pr_25]} onPress={() => this._onPage('Lucky')}>
                                    <View>
                                        <Text>翻牌抽奖</Text>
                                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>幸运翻牌 &gt;</Text>
                                    </View>
                                    <Image source={asset.user.lucky} style={{ width: 21, height: 27 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {
                        this.adverts.length > 0 ?
                            <View style={[styles.swiper, styles.row, styles.jc_ct, styles.ai_ct]}>
                                <Carousel
                                    useScrollView={true}
                                    delay={5000}
                                    style={[styles.swpiceImg, styles.over_h]}
                                    autoplay
                                    swiper
                                    bullets={true}
                                    pageInfo={false}
                                    bulletStyle={{//未选中的圆点样式
                                        backgroundColor: '#ffffff',
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        borderColor: '#ffffff',
                                        margin: 6,
                                        opacity: 0.49,
                                    }}
                                    chosenBulletStyle={{    //选中的圆点样式
                                        backgroundColor: '#ffffff',
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        margin: 6,
                                    }}
                                >
                                    {
                                        this.adverts.map((img, index) => {
                                            return (
                                                <TouchableOpacity key={index} style={[styles.over_h]}>
                                                    <Image key={index} style={[styles.swpiceImg]} source={{ uri: img.fileUrl }} />
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </Carousel>
                            </View>
                            : null}

                    <View style={[styles.bg_white, styles.pl_20, styles.pr_20, styles.mt_15]}>
                        <LabelBtn label={'我的学生证'} pdf={0} nav_val={'UserCard'} clickPress={this._onPage} />
                        <LabelBtn label={'培训班'} pdf={0} nav_val={'ProfesSkill'} clickPress={this._onPage} />
                        {/* {
                            Platform.OS === 'ios' ?
                                <View>
                                    {
                                        loginStatus && userInfo.isAuth == 0 ?
                                            <LabelBtn label={'实名认证'} pdf={0} nav_val={'RealAuth'} clickPress={this._onPage} />
                                            : null}
                                </View>
                                : <LabelBtn label={'实名认证'} pdf={0} nav_val={'RealAuth'} clickPress={this._onPage} />} */}
                        <LabelBtn label={'实名认证'} pdf={0} nav_val={'RealAuth'} clickPress={this._onPage} />

                        {
                            teacher ?
                                <LabelBtn label={'讲师晋级'} pdf={0} nav_val={'Promotion'} clickPress={this._onPage} />
                                : null}
                        <LabelBtn label={'邀请有礼'} pdf={0} nav_val={'ShareInvite'} clickPress={this._onPage} />
                        {
                            teacher ?
                                null
                                :
                                <LabelBtn label={'申请讲师'} pdf={0} nav_val={'LectApply'} clickPress={this._onPage} />
                        }
                        <LabelBtn label={'帮助反馈'} pdf={0} nav_val={'FdBack'} clickPress={this._onPage} />
                        {
                            teacher?
                            <LabelBtn label={'我的课程'} pdf={0} nav_val={'LectCourse'} clickPress={this._onPage} />
                            :null
                        }
                    </View>
                </ScrollView>

                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    userbox: {
        width: theme.window.width,
        height: theme.window.width * 0.52,
    },
    header: {
        height: 170,
    },
    user_bg: {
        width: '100%',
        height: 170,
    },
    headbox: {
        marginTop: -40
    },
    header_cover: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    tips_edit: {
        width: 12,
        height: 12,
    },
    right_arrow: {
        width: 14,
        height: 16,
    },
    tips_btn: {
        borderRadius: 7,
        backgroundColor: 'rgba(0,0,0,0.25)',
        height: 13,
    },
    modelbox: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    user_model: {
        width: 20,
        height: 20,
        zIndex: 5,
    },
    modeldot: {
        height: 13,
        paddingLeft: 5,
        paddingRight: 5,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        backgroundColor: '#F9A600',
        // zIndex:-5,
        marginLeft: -4,
    },
    cate_box: {
        marginTop: 10,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2,//安卓，让安卓拥有阴影边框
    },
    icon_item: {
        width: 36,
        height: 36,
    },
    icon_w: {
        width: 30,
        height: 30
    },
    bill: {
        width: theme.window.width - 30,
        height: (theme.window.width - 30) * 0.23,
        borderRadius: 5
    },
    swiper: {
        width: theme.window.width,
        height: theme.window.width * 0.29,
    },
    swpiceImg: {
        width: theme.window.width,
        height: theme.window.width * 0.29,
    },
    sitem: {
        width: '48%',
    }
})
export const LayoutComponent = User;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        userlevel: state.user.userlevel,
        logout: state.passport.logout,
        aduser: state.site.aduser,
        config: state.site.config,
    };
}