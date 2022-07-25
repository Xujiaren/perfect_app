import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native'

import HudView from '../../component/HudView';

import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';


class PayCourse extends Component {

    static navigationOptions = {
        title: '购买课程',
        headerRight: <View />,
    };

    constructor(props) {
        super(props)

        const { navigation } = this.props;
        this.course = navigation.getParam('course', {});


        this.state = {
            isPay: false,
            payId: 5,
            integral: 0,
            selectIntegral: false,
            cop: null
        }

        this._SelectPay = this._SelectPay.bind(this);
        this._onPay = this._onPay.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;

        if (user !== this.props.user) {

            this.setState({
                integral: user.integral
            })
        }
    }


    componentWillMount() {

    }

    componentWillUnmount() {

    }


    componentDidMount() {
        const { actions, navigation } = this.props;
        actions.user.user();
    }

    _SelectPay(type) {
        const { payId } = this.state;

        if (type === payId) {
            this.setState({
                payId: 5
            })
        } else {
            this.setState({
                payId: type
            })
        }

    }
    _onPay() {
        const { actions, navigation } = this.props;
        const { payId, integral } = this.state;


        if (payId < 5) {

            if (integral > this.course.integral) {

                if (payId === 0) {
                    let ucid = 0
                    if(this.state.cop){
                        ucid = this.state.cop.ucId
                    }
                    actions.course.payCourse({
                        from_uid: 0,
                        pay_type: 3,
                        course_id: this.course.courseId,
                        chapter_id: 0,
                        uc_id:ucid,
                        resolved: (data) => {
                            this.refs.hud.show('购买成功', 1);

                            DeviceEventEmitter.emit('payStatus', {
                                payStatus: true,
                            });

                            setTimeout(() => { navigation.goBack() }, 1000)
                        },
                        rejected: (res) => {

                        },
                    })
                } else {
                    this.refs.hud.show('暂未开通其他购买方式', 1);
                }

            } else {
                this.refs.hud.show('学分不足', 1);
            }

        } else {
            this.refs.hud.show('购买请选择学分成功', 1);
        }



    }


    render() {
        const { navigation } = this.props;
        const { payId, integral } = this.state;


        return (
            <View style={[styles.container]}>
                <ScrollView style={[styles.col_1]}>
                    <View style={[styles.head, styles.bg_white, styles.pl_20, styles.pr_20, styles.pt_20, styles.pb_12]}>
                        <Text style={[styles.tip_label, styles.sm_label]}>课程信息</Text>
                        <View style={[styles.fd_r, styles.mt_10]}>
                            <Image source={{ uri: this.course.courseImg }} style={[styles.img_cover]} />
                            <View style={[styles.fd_c, styles.jc_sb, styles.col_1, styles.ml_15]}>
                                <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]} numberOfLines={1}>{this.course.courseName}</Text>
                                <Text style={[styles.sm_label, styles.tip_label]} numberOfLines={1}>简介</Text>
                                <Text style={[styles.sm_label, styles.tip_label]} numberOfLines={1}>{Object.keys(this.course.teacher).length > 0 ? this.course.teacher.honor : null}</Text>
                                {/* <Text><Text style={[styles.lg18_label,styles.sred_label]}><Text style={[styles.sred_label,styles.default_label]}>￥</Text>234</Text><Text style={[styles.smm_label,styles.tip_label,{textDecorationLine:"line-through"}]}>￥324</Text></Text> */}
                                <Text style={[styles.lg_label, styles.sred_label]}>{this.course.integral}学分</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('UserCoupon', {
                        couponList:this.course.couponList,
                        type:1,
                        callBack: (params) => {
                            this.setState({
                                cop: params
                            })
                        }
                    })} style={[styles.bg_white, styles.fd_r, styles.jc_sb, styles.ai_ct, styles.mt_10, styles.pt_12, styles.pb_12, styles.pl_20, styles.pr_15]}>
                        <Text style={[styles.default_label, styles.c33_label]}>优惠券</Text>
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <Text style={[styles.sred_label, styles.sm_label, { backgroundColor: '#FFECEB' }]}>{this.state.cop ? '减' + this.state.cop.integral : '优惠券'}</Text>
                            <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.pl_20, styles.pr_15, styles.pt_12, styles.pb_12, styles.bg_white, styles.mb_10, styles.mt_10, styles.fd_r, styles.ai_ct, styles.jc_sb]}
                        onPress={() => this._SelectPay(0)}
                    >
                        <Text style={[styles.default_label, styles.c33_label]}>可用学分 {integral}</Text>
                        <Image source={payId === 0 ? asset.radio_full : asset.radio} style={[styles.icon_cover]} />
                    </TouchableOpacity>

                    <View style={[styles.bg_white, styles.mt_10, styles.pl_20, styles.pt_12, styles.pb_12, styles.pr_15]}>
                        <Text style={[styles.default_label, styles.c33_label, styles.lh20_label, styles.mb_15]}>价格明细</Text>
                        <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.default_label, styles.c33_label]}>课程总价：</Text>
                            <Text style={[styles.default_label, styles.c33_label]}>{this.course.integral}学分</Text>
                        </View>
                        <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.mt_10, styles.bt_border]}>
                            <Text style={[styles.default_label, styles.c33_label]}>优惠券抵扣：</Text>
                            <Text style={[styles.default_label, styles.c33_label]}>{this.state.cop ?this.state.cop.integral:'0'}学分</Text>
                        </View>
                        <View style={[styles.fd_r, styles.jc_fe]}>
                            <Text style={[styles.default_label, styles.c33_label]}>支付金额：<Text style={[styles.default_label, styles.sred_label]}>{this.state.cop ?this.course.integral-this.state.cop.integral:this.course.integral}学分</Text></Text>
                        </View>
                    </View>

                    {/* <View style={[styles.bg_white,styles.mt_10,styles.pl_20,styles.pt_12,styles.pb_12,styles.pr_15]}>
                        <Text style={[styles.default_label,styles.c33_label,styles.lh20_label,styles.mb_5]}>支付方式</Text>

                        <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.pt_15,styles.pb_15,styles.bb_boder]}
                            onPress={()=>this._SelectPay(1)}
                        >
                            <View style={[styles.fd_r,styles.ai_ct]}>
                                <Image source={asset.pay.ali_pay} style={[styles.pay_icon,styles.mr_10]} />
                                <Text style={[styles.gray_label,styles.default_label]}>支付宝</Text>
                            </View>
                            <Image source={ payId === 1 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ai_ct,styles.fd_r,styles.jc_sb,styles.bg_white,styles.pt_15,styles.pb_15]}
                            onPress={()=>this._SelectPay(2)}
                        >
                            <View style={[styles.fd_r,styles.ai_ct]}>
                                <Image source={asset.pay.wechat_pay} style={[styles.pay_icon,styles.mr_10]} />
                                <Text style={[styles.gray_label,styles.default_label]}>微信支付</Text>
                            </View>
                            <Image source={ payId === 2 ? asset.radio_full : asset.radio} style={styles.icon_cover} />
                        </TouchableOpacity>
                    </View> */}

                    <View style={[styles.fd_r, styles.pl_20, styles.pr_15, styles.pt_10]}>
                        <Image source={asset.mark_icon} style={[styles.tips, styles.mt_5]} />
                        <View style={[styles.fd_c, styles.pl_3]}>
                            <Text style={[styles.sm_label, styles.tip_label, styles.lh18_label]}>您将购买的商品为虚拟内容服务，不支持退订、转让以及退换，请慎重确认。</Text>
                            <Text style={[styles.sm_label, styles.tip_label, styles.lh18_label]}>购买后可在“直播列表·精彩回放”中查看。</Text>
                        </View>
                    </View>

                </ScrollView>
                <View style={[styles.fd_r, styles.ai_ct, styles.bg_white, styles.jc_sb, styles.pl_20, styles.pr_10, styles.pt_12, styles.pb_12]}>
                    {/* <Text style={[styles.default_label,styles.c33_label]}>支付金额：<Text style={[styles.lg20_label,styles.sred_label]}><Text style={[styles.sred_label,styles.default_label]}>￥</Text>234</Text></Text> */}
                    <Text style={[styles.default_label, styles.c33_label]}>支付金额：<Text style={[styles.lg20_label, styles.sred_label]}>{this.state.cop ?this.course.integral-this.state.cop.integral:this.course.integral}学分</Text></Text>
                    <TouchableOpacity style={[styles.payBtn]} onPress={this._onPay}>
                        <Text style={[styles.default_label, styles.white_label, styles.fw_label]}>立即支付</Text>
                    </TouchableOpacity>
                </View>

                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    head: {
        borderTopColor: '#F0F0F0',
        borderTopWidth: 1,
        borderStyle: 'solid'
    },
    img_cover: {
        width: 146,
        height: 76,
        backgroundColor: '#FAFAFA'
    },
    radio: {
        width: 16,
        height: 16,
    },
    bt_border: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F0F0F0',
        paddingBottom: 15,
        marginBottom: 18
    },
    payBtn: {
        width: 178,
        height: 36,
        backgroundColor: '#F4623F',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#F0F0F0',
        borderTopWidth: 1,
        borderStyle: 'solid'
    },
    pay_icon: {
        width: 20,
        height: 20,
    },
    icon_cover: {
        width: 14,
        height: 14
    },
    bb_boder: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F0F0F0',
    },
    tips: {
        width: 14,
        height: 14
    }
})

export const LayoutComponent = PayCourse;

export function mapStateToProps(state) {
    return {
        user: state.user.user
    };
}