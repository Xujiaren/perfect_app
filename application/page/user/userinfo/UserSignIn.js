import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Button, Alert } from 'react-native'

import asset from '../../../config/asset';
import theme from '../../../config/theme';
import iconMap from '../../../config/font';
import HudView from '../../../component/HudView';

import { formatdaymonths } from '../../../util/common'



class UserSignIn extends Component {

    static navigationOptions = {
        title: '签到',
        headerRight: <View />,
    };


    constructor(props) {
        super(props)

        this.activityList = [];
        this.state = {
            day: [1, 2, 3, 4, 5, 6, 7],
            checkin: 0,
            integral: 0,
            lottery: 0,
            status: 0,
            isTips: false,
            isSign: false,
        }

        this._onSign = this._onSign.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const { user, activity } = nextProps

        if (user != this.props.user) {
            this.setState({
                checkin: user.checkin,
                integral: user.integral,
                lottery: user.lottery,
            })
        }

        if (activity !== this.props.activity) {
            this.activityList = activity.items
        }
    }


    componentDidMount() {
        const { actions } = this.props
        actions.site.config();
        actions.user.user();
        actions.find.activity('', 0)
        this.getSign()
    }
    getSign = () => {
        const { actions } = this.props
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,                 //月份 
                "d+": this.getDate(),                    //日 
                "h+": this.getHours(),                   //小时 
                "m+": this.getMinutes(),                 //分 
                "s+": this.getSeconds(),                 //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds()             //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        let dates = new Date().format("yyyy-MM-dd");
        actions.user.signIns({
            resolved: (res) => {
                let time = res.filter(item => item.date == dates)
                this.setState({ status: time[0].status })
            }
        })
    }
    // 签到
    _onSign() {
        const { actions } = this.props

        actions.user.signIn({
            resolved: (data) => {
                this.setState({
                    isSign: true
                })
                actions.user.user();
                this.getSign()
            },
            rejected: (msg) => {
                this.refs.hud.show('已经签到！', 1);
            }
        })
    }


    render() {
        const { checkin, integral, isTips, isSign, lottery, status } = this.state
        const { navigation, config } = this.props

        const checkintype = config.user_week_checkin_type || 0

        let checkinnum = 0
        if (checkintype == 0) {
            checkinnum = (config.user_week_checkin_integral || '').split(',').length
        } else {
            checkinnum = (config.user_week_checkin_lottery || '').split(',').length
        }

        return (
            <View style={[styles.signBox]}>
                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/bd126556-1db7-4cf2-ae3c-f26ad4c034bd.png' }} style={styles.signCover} />
                <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct, styles.pl_20, styles.pr_20, styles.mt_10]}>
                    <Text style={[styles.default_label, styles.c33_label]}>我的学分：{integral + '  '} 抽奖机会：{lottery}</Text>
                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct]} onPress={() => navigation.navigate('Mail')}>
                        <Image source={asset.user.user_sign.mall} style={[styles.main_icon, styles.mr_10]} />
                        <Text style={[styles.sm_label, styles.c33_label]}>学分换购</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.d_flex, styles.fd_c, styles.ai_ct, styles.signcons, styles.mt_15]}>
                    <Text style={{ color: '#45B750', fontSize: 16 }}>已连续签到</Text>
                    <Text style={{ color: '#45B750', fontSize: 16, marginTop: 10 }}>{checkin}天</Text>
                    <View style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.mt_10, styles.mb_2]}>
                        {/* <Text style={[styles.default_label]}>连续签到7天后每日得{checkinnum}{checkintype == 0 ? '学分' : '抽奖机会'}</Text> */}
                        <Text style={[styles.default_label]}>连续签到，翻牌机会更多</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({ isTips: true })}
                        >
                            <Image source={asset.user.user_sign.tip} style={[styles.quest_icon, styles.ml_5]} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.signLines, styles.mt_30]}>
                        <View style={[styles.sign_line]}></View>
                        <View style={[styles.d_flex, styles.fd_r, styles.jc_sb, styles.sign_dayt]}>
                            {
                                [1, 2, 3, 4, 5, 6, 7].map((day, index) => {
                                    const on = index < checkin;

                                    return (
                                        <View key={'day' + index} style={[on ? styles.sign_day : styles.sign_ofday, styles.ai_ct, styles.jc_ct]}>
                                            <Text style={[styles.lg_label, styles.white_label]}>{day}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                {
                    status == 0 ?
                        <TouchableOpacity style={[styles.m_20, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.circle_5, styles.pt_10, styles.pb_10, styles.signInBtn]}
                            onPress={this._onSign}
                        >
                            <Text style={[styles.lg_label, styles.white_label]}>今日签到</Text>
                        </TouchableOpacity>
                        :
                        <View style={[styles.m_20, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.circle_5, styles.pt_10, styles.pb_10, styles.signInBtns]}>
                            <Text style={[styles.lg_label, styles.white_label]}>已签到</Text>
                        </View>
                }


                {
                    this.activityList.length > 0 ?

                        <View style={[styles.pl_15]}>
                            <View style={[styles.teachzone, styles.pb_20, styles.pl_15]}>
                                <View style={[styles.head, styles.pl_2, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>精彩活动</Text>
                                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={() => navigation.navigate('Find')}>
                                        <Text style={[styles.tip_label, styles.sm_label, styles.fw_label]}>查看全部</Text>
                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{ height: 160, overflowY: 'auto' }}
                                >
                                    <ScrollView
                                        scrollX
                                        horizontal={true}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        <View style={[styles.teach, styles.fd_r, styles.mt_15]}>
                                            {
                                                this.activityList.map((item, index) => {
                                                    return <TouchableOpacity style={[styles.teach_item, styles.mr_20, styles.d_flex, styles.fd_c]} key={'item' + index} onPress={() => navigation.navigate('Activity', { activity: item })}>
                                                        <Image style={[styles.teach_cover]} source={{ uri: item.activityImg }} />
                                                        <Text style={[styles.c33_label, styles.default_label, styles.fw_label, styles.mt_10]} numberOfLines={1}>{item.title}</Text>
                                                        <Text style={[styles.smm_label, styles.gray_label]} numberOfLines={1}>活动时间：{formatdaymonths(item.beginTime * 1000)}-{formatdaymonths(item.endTime * 1000)}</Text>
                                                    </TouchableOpacity>
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                </View>

                            </View>
                        </View>

                        : null}


                <Modal
                    visible={isTips}
                    transparent={true}
                >
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                        <View style={[styles.tips]}>
                            <View style={[styles.tipdesc]}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={[styles.fd_r, styles.jc_ct, styles.mb_20]}>
                                        <Text style={[styles.lg18_label, styles.c33_label, styles.fw_label]}>签到规则</Text>
                                    </View>
                                    <View style={[styles.fd_c, styles.tip_cons, styles.pt_10]}>
                                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label, styles.pb_10]}>{this.props.config.teacher_qiandao_text || ''}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                            <TouchableOpacity style={[styles.tip_btn]} onPress={() => this.setState({
                                isTips: false
                            })}>
                                <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={isSign} transparent={true} onRequestClose={() => { }}>
                    <View style={styles.scoreBox}>
                        <View style={[styles.evalBox]}>
                            <Image style={styles.modal_img} source={asset.user.user_sign.ok} />
                            <View style={[styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                <Text style={[styles.lg20_label, styles.c33_label]}>签到成功</Text>
                            </View>
                            <View style={[styles.fd_r, styles.mt_30, styles.eval_btns]}>
                                <TouchableOpacity style={[styles.col_1, styles.ai_ct, styles.jc_ct, styles.eval_btns_left, styles.pt_12, styles.pb_12]}
                                    onPress={() => this.setState({ isSign: false })}>
                                    <Text style={[styles.lg18_label, styles.tip_label]}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    signBox: {},
    signCover: {
        width: '100%',
        height: 116,
    },
    main_icon: {
        width: 20,
        height: 18
    },

    signcons: {
        height: 150,
        backgroundColor: '#FBFFF2',
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 18,
        paddingLeft: 10,
        paddingRight: 10,
    },
    quest_icon: {
        width: 16,
        height: 16,
        backgroundColor: '#fafafa',
        borderRadius: 8,
    },
    signLines: {
        width: '100%',
        position: 'relative'
    },
    sign_line: {
        width: '100%',
        height: 1,
        backgroundColor: '#DAE0CC'
    },
    sign_dayt: {
        position: 'absolute',
        width: '100%',
        top: -13,
    },
    sign_day: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FBD547',
    },
    sign_ofday: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#DAE0CC',
    },
    signInBtn: {
        backgroundColor: '#45B750',
        borderRadius: 5,
    },
    signInBtns: {
        backgroundColor: '#cccccc',
        borderRadius: 5,
    },
    teachzone: {
        padding: 15,
        paddingRight: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    teach: {
        width: '100%',
        flexDirection: 'row'
    },
    teach_item: {
        width: 120
    },
    teach_cover: {
        width: 120,
        height: 86,
        borderRadius: 5,
        backgroundColor: '#fafafa'
    },
    tips: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 20,
        width: 300,
    },
    tipdesc: {
        height: 460,
        overflow: 'hidden',
    },
    tip_cons: {
        flexDirection: 'column',
        paddingBottom: 20,
        marginBottom: 20,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderStyle: 'solid'
    },
    tip_btn: {
        margin: 20,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9D200',
        marginTop: 30
    },
    scoreBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    evalBox: {
        width: 280,
        height: 160,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative'
    },
    modal_img: {
        position: 'absolute',
        left: '50%',
        top: -230,
        width: 375,
        height: 260,
        marginLeft: -187.5,
    },
    eval_btns_left: {
        borderTopColor: '#E5E5E5',
        borderStyle: 'solid',
        borderTopWidth: 1
    }
});


export const LayoutComponent = UserSignIn;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        activity: state.find.activity,
        config: state.site.config,
    };
}

