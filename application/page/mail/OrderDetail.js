import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, NativeModules, Platform, StatusBar, ProgressBarAndroid, Clipboard, Modal, TextInput, ToastAndroid } from 'react-native';

const { StatusBarManager } = NativeModules;

import { Header } from 'react-navigation-stack';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

import asset from '../../config/asset';
import theme from '../../config/theme';
import HudView from '../../component/HudView';

import { getExactTime } from '../../util/common'

const slideWidth = theme.window.width;

const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.2, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};


class OrderDetail extends Component {

    static navigationOptions = {
        header: null,
    };


    constructor(props) {
        super(props);

        const { navigation } = this.props;
        this.order = navigation.getParam('order', {});
        this.orderId = navigation.getParam('orderId', 0);

        this.state = {
            orderId: this.orderId,
            statusBarHeight: 0,
            navHeight: 0,
            afterType: false,
            afterTypeId: 25,
            afterTypeList: [{ text: '我要退款（无需退货）', afterTypeId: 25 }, { text: '我要退货退款', afterTypeId: 26 }, { text: '换货', afterTypeId: 27 }],
            afterReason: ['不喜欢/不想要', '空包裹', '未按约定时间发货', '快递/物流一直未送到', '快递/无跟踪记录', '快递破损已拒签'],
            afterReasonIndex: 0,
            afterExplain: '',// 退换货原因 
            afterImgs: [], // 上传凭证
            preview: false,
            preview_index: 0,
            images: [],
            shipType: false,
            saleTypeShopName: '',
            saleTypeShopNumber: '',

            invoiceType: false,
            invoiceIdx: 0, // 0 个人 普通发票 1 企业 普通发票

            invoice_rise: '', // 抬头
            invoice_mobile: '', // 手机号
            invoice_email: '', // 邮箱
            invoice_unit: '', // 单位全称
            invoice_code: '',// 纳税人识别码

            otype: 0, //  订单


        }

        this._onCopy = this._onCopy.bind(this);
        this._orderConfirm = this._orderConfirm.bind(this);
        this._saleType = this._saleType.bind(this),
            this._refundType = this._refundType.bind(this),
            this._orderCancle = this._orderCancle.bind(this);
        this._slectAfterType = this._slectAfterType.bind(this);
        this.onViewImgs = this.onViewImgs.bind(this);
        this._onDetele = this._onDetele.bind(this);
        this._onChangeImg = this._onChangeImg.bind(this);
        this._onRate = this._onRate.bind(this);
        this._onRefundType = this._onRefundType.bind(this);
        this._onsaleTypeSunmit = this._onsaleTypeSunmit.bind(this);
        this._toPay = this._toPay.bind(this);
        this._onInvoice = this._onInvoice.bind(this);
    }

    UNSAFE_componentWillMount() {

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


    componentWillReceiveProps(nextProps) {
        const { orderDetail } = nextProps;

        if (orderDetail !== this.props.orderDetail) {
            this.order = orderDetail;

            this.setState({
                otype: orderDetail.otype
            })

        }
    }

    componentDidMount() {
        const { actions, navigation } = this.props;
        const { orderId } = this.state;

        actions.mall.orderDetail(orderId);

        this.focuSub = navigation.addListener('didFocus', (route) => {

            actions.mall.orderDetail(orderId);

        })
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
        Picker.hide();
    }

    // 确认收获
    _orderConfirm() {
        const { actions } = this.props;
        const { orderId } = this.state;
        actions.mall.orderConfirm({
            order_id: orderId,
            resolved: (data) => {

                this.refs.hud.show('提交成功', 2);

                actions.mall.orderDetail(this.order.orderId);

            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败', 2);
            }
        });
    }

    _saleType() {

        this.setState({
            shipType: true
        })
    }

    _onsaleTypeSunmit() {
        const { actions } = this.props;
        const { saleTypeShopName, saleTypeShopNumber } = this.state;

        let on = true;
        let tip = "";
        if (saleTypeShopName.length === '') {
            on = false
            tip = '请输入快递名称'
        } else if (saleTypeShopNumber === '') {
            on = false
            tip = '请输入快递单号'
        }

        if (on) {
            actions.mall.orderShip({
                return_id: this.order.orderReturnList[0].returnId,
                ship_name: saleTypeShopName,
                ship_sn: saleTypeShopNumber,
                resolved: (data) => {

                    actions.mall.orderDetail(this.order.orderId);
                    this.setState({
                        shipType: false
                    }, () => {
                        this.refs.hud.show('提交成功', 2);
                    })

                },
                rejected: (msg) => {
                    this.refs.hud.show('提交失败', 2);
                }
            })
        } else {
            this.refs.hud.show(tip, 2);
        }

    }

    _refundType() {

    }

    _orderCancle() {
        const { actions } = this.props;
        const { afterReasonIndex, afterImgs, afterReason, afterTypeId, afterExplain } = this.state;
        actions.mall.orderReturn({
            order_id: this.order.orderId,
            goods_id: this.order.orderGoods[0].goodsId,
            etype: this.order.orderReturnList[0].etype,
            reason: this.order.orderReturnList[0].reason,
            action: 'cancel',
            picString: '',
            resolved: (data) => {

                this.refs.hud.show('提交成功', 2);

                this.setState({
                    afterType: false,
                    afterImgs: []
                }, () => {
                    actions.mall.orderDetail(this.order.orderId);
                })

            },
            rejected: (msg) => {
            }
        })
    }


    _onRefundType() {
        const { actions } = this.props;
        const { afterReasonIndex, afterImgs, afterReason, afterTypeId, afterExplain } = this.state;

        actions.mall.orderReturn({
            order_id: this.order.orderId,
            goods_id: this.order.orderGoods[0].goodsId,
            etype: afterTypeId,
            reason: afterReason[afterReasonIndex] + afterExplain,
            picString: afterImgs.join(","),

            resolved: (data) => {

                this.refs.hud.show('提交成功', 2);

                this.setState({
                    afterType: false,
                    afterImgs: []
                }, () => {
                    actions.mall.orderDetail(this.order.orderId);
                })

            },
            rejected: (msg) => {
            }
        })

    }

    // 查看图片
    onViewImgs(afterImgs, index) {

        let images = [];

        for (let i = 0; i < afterImgs.length; i++) {

            images.push({
                url: afterImgs[i],
            });
        }

        this.setState({
            preview: true,
            preview_index: index,
            images: images,
        });

    }

    // 删除上传图片
    _onDetele(index) {

        const { afterImgs } = this.state
        afterImgs.splice(index, 1)

        this.setState({
            afterImgs: afterImgs
        })
    }

    //  上传图片
    _onChangeImg() {

        const { actions } = this.props;
        const { afterImgs } = this.state;

        ImagePicker.showImagePicker(options, (response) => {

            if (response.uri) {

                actions.site.upload({
                    file: 'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        afterImgs.push(data);
                        this.setState({
                            afterImgs: afterImgs,
                        });
                    },
                    rejected: (msg) => {
                    },
                });
            }
        });

    }


    // 退款原因
    _onRate() {
        const { afterReason, afterReasonIndex } = this.state;

        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '退款原因',
            pickerData: afterReason,
            selectedValue: [afterReason[afterReasonIndex]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < afterReason.length; i++) {
                    if (pickedValue[0] === afterReason[i]) {
                        this.setState({
                            afterReasonIndex: i,
                        });
                    }
                }
            },
        });

        Picker.show();
    }


    // 选择方式
    _slectAfterType(aft) {
        this.setState({
            afterTypeId: aft.afterTypeId
        })
    }

    // 复制
    async _onCopy(shippingSn) {

        Clipboard.setString(shippingSn);

        try {
            var content = await Clipboard.getString();
            this.refs.hud.show('已复制', 1);
            ToastAndroid.show('粘贴板的内容为:' + content, ToastAndroid.SHORT);
        } catch (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        }

    }

    // 支付
    _toPay(order) {

        const { navigation } = this.props;

        navigation.navigate('OrderPay', { goodsAmount: order.orderAmount, orderSn: order.orderSn });
    }

    // 申请发票
    _onInvoice() {
        const { actions } = this.props;
        const { invoiceIdx, invoice_rise, invoice_mobile, invoice_email, invoice_code, invoice_unit } = this.state;

        let isPush = true;
        let tip = ''; // 弹窗提示
        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        var szReg = /^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; // 判断邮箱


        if (invoiceIdx === 0) {

            if (invoice_rise === '') {
                isPush = false,
                    tip = '请填写发票抬头'
            } else if (!pattern.test(invoice_mobile)) {
                isPush = false
                tip = '请填写正确的手机号'
            } else if (!szReg.test(invoice_email)) {
                isPush = false
                tip = '请填写正确的邮箱'
            }

            if (isPush) {

                actions.mall.orderInvoice({
                    order_id: this.orderId,
                    invoice_name: invoice_rise,
                    mobile: invoice_mobile,
                    email: invoice_email,
                    resolved: (data) => {

                        this.setState({
                            invoiceType: false,
                            invoice_rise: '',
                            invoice_mobile: '',
                            invoice_email: '',
                        }, () => {
                            setTimeout(() => {
                                this.refs.hud.show('稍后发送到你的邮箱中', 2);
                            }, 1000);
                        })
                    },
                    rejected: (msg) => {

                    },
                })

            } else {
                this.refs.hud.show(tip, 2);
            }

        } else {

            if (invoice_unit === '') {
                isPush = false,
                    tip = '请填写单位全称'
            } else if (invoice_code === '') {
                isPush = false,
                    tip = '请填写纳税人识别号'
            } else if (!pattern.test(invoice_mobile)) {
                isPush = false
                tip = '请填写正确的手机号'
            } else if (!szReg.test(invoice_email)) {
                isPush = false
                tip = '请填写正确的邮箱'
            }

            if (isPush) {

                actions.mall.orderInvoice({
                    order_id: this.orderId,
                    invoice_name: invoice_unit,
                    invoice_sn: invoice_code,
                    mobile: invoice_mobile,
                    email: invoice_email,
                    resolved: (data) => {

                        this.setState({
                            invoiceType: false,
                            invoice_code: '',
                            invoice_rise: '',
                            invoice_mobile: '',
                            invoice_email: '',
                        }, () => {
                            setTimeout(() => {
                                this.refs.hud.show('稍后发送到你的邮箱中', 2);
                            }, 1000);
                        })
                    },
                    rejected: (msg) => {
                    },
                })

            } else {
                this.refs.hud.show(tip, 2);
            }


        }
    }


    render() {
        const { navigation } = this.props;
        const { statusBarHeight, navHeight, afterType, afterTypeList, afterReason, afterReasonIndex, afterTypeId, afterExplain, afterImgs, preview, preview_index, images, shipType, saleTypeShopName, saleTypeShopNumber, invoiceType, invoiceIdx, invoice_rise, invoice_mobile, invoice_email, invoice_code, invoice_unit, otype } = this.state;

        let odr_val = '';
        let odr_tips = '';
        let odr_status = 100;

        if (this.order.orderStatus === 0) {
            if (this.order.payStatus === 0) {
                odr_val = '待付款';
                odr_status = 0;
            } else if (this.order.payStatus === 1) {
                if (this.order.shippingStatus === 0) {
                    odr_val = '待发货';
                    odr_status = 1;
                } else if (this.order.shippingStatus === 1) {
                    odr_val = '待收货';
                    odr_status = 2;
                } else if (this.order.shippingStatus === 2) {
                    odr_val = '已收货';
                    odr_status = 3;
                }
            }
        } else if (this.order.orderStatus === 1) {
            odr_val = '已取消';
            odr_status = 7;
        } else if (this.order.orderStatus === 2) {
            if (this.order.orderReturnList.length > 0) {

                if (this.order.orderReturnList.length > 0) {
                    if (this.order.orderReturnList[0].status === 0) {
                        if (this.order.orderReturnList[0].adminStatus === 0) {
                            odr_val = '待处理';
                            odr_status = 4;
                        } else if (this.order.orderReturnList[0].adminStatus === 1) {
                            odr_val = '退款中';
                            odr_status = 5;
                        } else {
                            odr_val = '拒绝';
                            odr_status = 6;
                        }
                    } else if (this.order.orderReturnList[0].status === 1) {
                        odr_val = '订单关闭';
                        odr_status = 14;
                    }
                }
            }

        } else if (this.order.orderStatus === 3) {
            if (this.order.orderReturnList.length > 0) {
                if (this.order.orderReturnList[0].status === 0) {
                    if (this.order.orderReturnList[0].adminStatus === 0) {
                        odr_val = '待处理';
                        odr_status = 8;
                    } else if (this.order.orderReturnList[0].adminStatus === 1) {
                        odr_val = '处理中';
                        odr_status = 9;
                    } else {
                        odr_val = '拒绝';
                        odr_status = 10;
                    }
                } else if (this.order.orderReturnList[0].status === 1) {
                    odr_val = '订单关闭';
                    odr_status = 14;
                }

            }
        } else if (this.order.orderStatus === 4) {
            if (this.order.orderReturnList.length > 0) {
                if (this.order.orderReturnList[0].status === 0) {
                    if (this.order.orderReturnList[0].adminStatus === 0) {
                        odr_val = '待处理';
                        odr_status = 11;
                    } else if (this.order.orderReturnList[0].adminStatus === 1) {
                        odr_val = '处理中';
                        odr_status = 12;
                    } else {
                        odr_val = '拒绝';
                        odr_status = 13;
                    }
                } else if (this.order.orderReturnList[0].status === 1) {
                    odr_val = '订单关闭';
                    odr_status = 14;
                }
            }
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={[styles.orderwrap]}>
                        <Image source={asset.mail.order_head} style={[styles.order_head]} />
                        <View style={[styles.orderCons]}>
                            <View style={[{ height: 134 }]}>

                                <View style={{ height: statusBarHeight, width: theme.window.width }}></View>

                                {/* <View style={{height:navHeight,width:slideWidth},[styles.fd_r,styles.jc_sb, styles.ai_ct,styles.pb_10,styles.pt_10,styles.pl_15,styles.pr_15]}> */}
                                <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct, styles.pb_10, styles.pt_10, styles.pl_15, styles.pr_15]}>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Image source={asset.left_arrow} style={[styles.left_arrow]} />
                                    </TouchableOpacity>
                                    <Text style={[styles.lg18_label, styles.white_label, styles.fw_label]}>订单详情</Text>
                                    <View style={[styles.left_arrow]}></View>
                                </View>

                                <View style={[styles.pl_40, styles.orderStatus]}>
                                    <Text style={[styles.lg20_label, styles.fw_label, styles.white_label]}>{odr_val}</Text>
                                    {
                                        odr_status === 4 || odr_status === 8 || odr_status === 11 ?
                                            <View style={[styles.orderH_tip, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                                <Text style={[styles.smm_label, styles.white_label]}>{'请等待处理'}</Text>
                                            </View>
                                            : null}
                                    {
                                        odr_status === 5 || odr_status === 9 || odr_status === 12 ?
                                            <View style={[styles.orderH_tip, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                                <Text style={[styles.smm_label, styles.white_label]}>{'审核已通过'}</Text>
                                            </View>
                                            : null}
                                    {
                                        odr_status === 6 || odr_status === 10 || odr_status === 13 ?
                                            <View style={[styles.orderH_tip, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                                                <Text style={[styles.smm_label, styles.white_label]}>{'审核未通过'}</Text>
                                            </View>
                                            : null}
                                </View>

                            </View>

                        </View>
                        <View style={[{ width: theme.window.width, maxHeight: theme.window.height }]}>
                            <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.p_20, styles.bg_white]}>
                                <Image source={asset.mail.location} style={[styles.location]} />
                                <View style={[styles.fd_c, styles.ml_15]}>
                                    <Text style={[styles.c33_label, styles.default_label, styles.fw_label]}>{this.order.realname} {' '}{this.order.mobile}</Text>
                                    <Text style={[styles.gray_label, styles.default_label, styles.mt_5]}>{this.order.province} {this.order.city} {this.order.district} {this.order.address}</Text>
                                </View>
                            </TouchableOpacity>



                            <View style={[styles.mt_10]}>
                                {
                                    this.order.orderGoods.map((good, index) => {
                                        return (
                                            <View style={[styles.good, styles.fd_r]} key={'good' + index}>
                                                <View style={[styles.goodsCover, styles.mr_5]}>
                                                    <Image source={{ uri: good.goodsImg }} style={[styles.goodsImg]} />
                                                </View>
                                                <View style={[styles.fd_c, styles.jc_sb, styles.col_1]}>
                                                    <View style={[styles.fd_c,]}>
                                                        <Text style={[styles.c33_label, styles.default_label, styles.fw_label]} numberOfLines={1}>{good.goodsName}</Text>
                                                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>{good.goodsAttr}</Text>
                                                    </View>
                                                    <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                        {
                                                            otype === 2 ?
                                                                <Text style={[styles.sred_label, styles.default_label]}>¥{good.goodsAmount}</Text>
                                                                : null}
                                                        {
                                                            otype === 3 ?
                                                                <Text style={[styles.sred_label, styles.default_label]}>{good.integralAmount}学分</Text>
                                                                : null}

                                                        <Text style={[styles.c33_label, styles.default_label]}>X{good.goodsNum}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>


                            <View style={[styles.fd_r, styles.ai_ct, styles.jc_fe, styles.bg_white, styles.pt_20, styles.pb_20, styles.pr_15]}>
                                <Text style={[styles.sm_label, styles.tip_label, styles.pr_15]}>邮费：¥{this.order.shippingAmount}</Text>
                                {
                                    otype === 2 ?
                                        <Text style={[styles.sm_label, styles.tip_label]}>合计：<Text style={[styles.sred_label, styles.default_label]}>¥{this.order.orderAmount}</Text></Text>
                                        : null}
                                {
                                    otype === 3 ?
                                        <Text style={[styles.sm_label, styles.tip_label]}>合计：<Text style={[styles.sred_label, styles.default_label]}>{this.order.integralAmount}学分</Text></Text>
                                        : null}

                            </View>



                            {
                                odr_status !== 2 ?
                                    <View style={[styles.mt_10, styles.fd_c]}>
                                        <View style={[styles.pt_12, styles.pb_12, styles.bg_white, styles.mb_1]}>
                                            <Text style={[styles.tip_label, styles.sm_label, styles.pl_15]}>订单号:{this.order.orderSn}</Text>
                                        </View>
                                        <View style={[styles.pt_12, styles.pb_12, styles.bg_white]}>
                                            <Text style={[styles.tip_label, styles.sm_label, styles.pl_15]}>下单时间: {getExactTime(parseInt(this.order.payTime))}</Text>
                                        </View>
                                    </View>
                                    : null}

                            {
                                odr_status === 2 ?
                                    <View style={[styles.fd_c]}>
                                        <View style={[styles.order_log, styles.fd_r, styles.jc_sb, styles.border_bt]}>
                                            <View>
                                                <View style={[styles.fd_r, styles.ai_ct]}>
                                                    <View style={[styles.order_left]}></View>
                                                    <Text style={[styles.fw_label, styles.default_label, styles.black_label, styles.ml_10]}>物流信息</Text>
                                                </View>
                                                <Text style={[styles.gray_label, styles.sm_label, styles.mt_5]}>{this.order.shippingName}：{this.order.shippingSn}</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.order_copy, styles.ai_ct, styles.jc_ct]} onPress={() => this._onCopy(this.order.shippingSn)}>
                                                <Text style={[styles.default_label, styles.c33_label]}>复制</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.pt_12, styles.pb_12, styles.bg_white, styles.border_bt]}>
                                            <Text style={[styles.tip_label, styles.sm_label, styles.pl_15]}>下单时间: {getExactTime(parseInt(this.order.payTime))}</Text>
                                        </View>
                                        <View style={[styles.pt_12, styles.pb_12, styles.bg_white]}>
                                            <Text style={[styles.tip_label, styles.sm_label, styles.pl_15]}>发货时间: {getExactTime(parseInt(this.order.shippingTime))}</Text>
                                        </View>
                                    </View>

                                    : null}

                            {
                                this.order.orderReturnList.length > 0 && this.order.orderReturnList[0].reason.length > 0 ?
                                    <View style={[styles.p_20]}>
                                        <Text style={[styles.default_label, styles.c33_label]}>原因：{this.order.orderReturnList[0].reason}</Text>
                                    </View>
                                    : null}


                            {
                                odr_status === 9 || odr_status === 12 ?
                                    <TouchableOpacity style={[styles.make_btn, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._saleType}>
                                        <Text style={[styles.default_label, styles.white_label]}>我已寄出（填写物流号）</Text>
                                    </TouchableOpacity>
                                    : null}

                            {
                                odr_status === 6 || odr_status === 10 ?
                                    <TouchableOpacity style={[styles.make_btn, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._refundType}>
                                        <Text style={[styles.default_label, styles.white_label]}>修改申请</Text>
                                    </TouchableOpacity>
                                    : null}

                            {
                                odr_status === 4 || odr_status === 5 || odr_status === 6 ?
                                    <TouchableOpacity style={[styles.make_btnm, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._orderCancle}>
                                        <Text style={[styles.default_label, styles.sred_label]}>取消退款</Text>
                                    </TouchableOpacity>
                                    : null}

                            {
                                odr_status === 8 || odr_status === 9 || odr_status === 10 ?
                                    <TouchableOpacity style={[styles.make_btnm, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._orderCancle}>
                                        <Text style={[styles.default_label, styles.sred_label]}>取消退货/退款</Text>
                                    </TouchableOpacity>
                                    : null}

                            {
                                odr_status === 11 || odr_status === 12 || odr_status === 13 ?
                                    <TouchableOpacity style={[styles.make_btnm, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._orderCancle}>
                                        <Text style={[styles.default_label, styles.sred_label]}>取消换货</Text>
                                    </TouchableOpacity>
                                    : null}


                        </View>


                    </View>


                </ScrollView>

                {/* 售后类型 */}
                <Modal visible={afterType} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} ></TouchableOpacity>
                    <View style={[styles.afteristicss]}>
                        <View style={[styles.log_head]}>
                            <View style={[styles.fd_r, styles.ai_ct]}>
                                <View style={[styles.headBorder]}></View>
                                <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>售后类型</Text>
                            </View>
                            <View style={[styles.fd_c]}>
                                {
                                    afterTypeList.map((aft, index) => {

                                        let on = afterTypeId === aft.afterTypeId;

                                        return (
                                            <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pt_10, styles.pb_10]} key={'aft' + index}
                                                onPress={() => this._slectAfterType(aft)}
                                            >
                                                <Image source={on ? asset.radio_full : asset.radio} style={[styles.radio]} />
                                                <Text style={[styles.gray_label, styles.default_label, styles.pl_10, on && styles.red_label]} >{aft.text}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            <View style={[styles.fd_r, styles.ai_ct, styles.mt_10]}>
                                <View style={[styles.headBorder]}></View>
                                <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>退款原因</Text>
                            </View>

                            {
                                afterTypeId === 27 ?
                                    null :
                                    <View>
                                        <TouchableOpacity style={[styles.log_input, styles.mt_20]} onPress={this._onRate}>
                                            <Text style={[styles.smm_label, styles.c33_label, styles.pl_15]}>{afterReason[afterReasonIndex]}</Text>
                                            <Image source={asset.mail.down_arrow} style={[styles.down_arrow]} />
                                        </TouchableOpacity>
                                        <View style={[styles.fd_r, styles.ai_ct, styles.jc_sb, styles.mt_30]}>
                                            <View style={[styles.fd_r, styles.ai_ct]}>
                                                <View style={[styles.headBorder]}></View>
                                                <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>退款金额</Text>
                                            </View>
                                            {
                                                otype === 2 ?
                                                    <Text style={[styles.default_label, styles.red_label]}>¥{this.order.orderAmount}</Text>
                                                    : null}
                                            {
                                                otype === 3 ?
                                                    <Text style={[styles.default_label, styles.red_label]}>{this.order.integralAmount}学分</Text>
                                                    : null}

                                        </View>
                                        <View style={[styles.fd_r, styles.ai_ct, styles.jc_fe]}>
                                            {
                                                otype === 2 ?
                                                    <Text style={[styles.tip_label, styles.sm_label]}>不可修改，最多¥{this.order.orderAmount}</Text>
                                                    : null}
                                            {
                                                otype === 3 ?
                                                    <Text style={[styles.tip_label, styles.sm_label]}>不可修改，最多{this.order.integralAmount}学分</Text>
                                                    : null}
                                        </View>
                                    </View>

                            }

                            <View style={[styles.fd_r, styles.ai_ct, styles.mt_25]}>
                                <View style={[styles.headBorder]}></View>
                                <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>{afterTypeId === 27 ? '换货说明' : '退款说明'}</Text>
                            </View>

                            <View style={[styles.log_input]}>
                                <TextInput
                                    style={[styles.count_count, styles.pl_12, styles.col_1]}
                                    type='text'
                                    clearButtonMode={'never'}
                                    placeholder={'选填'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    value={afterExplain}
                                    keyboardType={'default'}
                                    onChangeText={(text) => { this.setState({ afterExplain: text }); }}
                                />
                            </View>

                            <View style={[styles.fd_r, styles.mt_20]}>
                                {
                                    afterImgs.map((img, index) => {
                                        return (
                                            <TouchableOpacity style={[styles._25, styles.mr_10, styles.log_pic]} onPress={() => this.onViewImgs(afterImgs, index)} key={'img' + index}>
                                                <Image source={{ uri: img }} style={[styles.uppic_img]} />
                                                <TouchableOpacity onPress={() => this._onDetele(index)} style={[styles.commt_tips]}>
                                                    <Image source={asset.i_dete} style={[styles.commt_tip]} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                                {
                                    afterImgs.length < 3 ?
                                        <TouchableOpacity style={[styles._25, styles.log_pic]} onPress={this._onChangeImg}>
                                            <Image source={asset.uppic} style={[styles.uppic]} />
                                            <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>上传凭证</Text>
                                        </TouchableOpacity>
                                        : null}
                            </View>
                        </View>
                        <View style={[styles.log_btn]}>
                            <TouchableOpacity style={[styles.log_btn_l, styles.col_1, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ afterType: false })}>
                                <Text style={[styles.lg18_label, styles.tip_label]}>关闭</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.log_btn_r, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={this._onRefundType}>
                                <Text style={[styles.lg18_label, styles.red_label]}>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* 查看照片 */}
                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={images} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} />
                </Modal>

                {/* 填写物流 */}
                <Modal visible={shipType} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} ></TouchableOpacity>
                    <View style={[styles.shipbox]}>
                        <View style={[styles.log_head]}>
                            <View style={[styles.fd_r, styles.ai_ct]}>
                                <View style={[styles.headBorder]}></View>
                                <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>寄回地址</Text>
                            </View>
                            <View style={[styles.fd_c, styles.pl_5, styles.pt_15, styles.mb_20]}>
                                <Text style={[styles.default_label, styles.gray_label, styles.mt_10]}>中国江苏南京完美大厦汉江路234号</Text>
                                <Text style={[styles.default_label, styles.gray_label, styles.mt_10]}>A座1933 售后服务部</Text>
                                <Text style={[styles.default_label, styles.gray_label, styles.mt_10]}>收件人：张晶晶</Text>
                                <Text style={[styles.default_label, styles.gray_label, styles.mt_10]}>电话：139877224345</Text>
                            </View>
                            <View style={[styles.fd_r, styles.ai_ct]}>
                                <View style={[styles.headBorder]}></View>
                                <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>退货物流</Text>
                            </View>
                            <View style={[styles.log_input]}>
                                <TextInput
                                    style={[styles.count_count, styles.pl_12, styles.col_1]}
                                    type='text'
                                    clearButtonMode={'never'}
                                    placeholder={'快递公司'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    value={saleTypeShopName}
                                    keyboardType={'default'}
                                    onChangeText={(text) => { this.setState({ saleTypeShopName: text }); }}
                                />
                            </View>
                            <View style={[styles.log_input]}>
                                <TextInput
                                    style={[styles.count_count, styles.pl_12, styles.col_1]}
                                    type='text'
                                    clearButtonMode={'never'}
                                    placeholder={'快递单号'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    value={saleTypeShopNumber}
                                    keyboardType={'default'}
                                    onChangeText={(text) => { this.setState({ saleTypeShopNumber: text }); }}
                                />
                            </View>

                        </View>
                        <View style={[styles.log_btn]}>
                            <TouchableOpacity style={[styles.log_btn_l, styles.col_1, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ shipType: false })}>
                                <Text style={[styles.lg18_label, styles.tip_label]}>关闭</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.log_btn_r, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={this._onsaleTypeSunmit}>
                                <Text style={[styles.lg18_label, styles.red_label]}>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* 发票 */}

                {
                    invoiceType ?
                        <View style={[styles.invoiceType_box]}>
                            <View style={[styles.afteristics]}>
                                <View style={[styles.log_head]}>
                                    <View style={[styles.fd_r, styles.ai_ct]}>
                                        <View style={[styles.headBorder]}></View>
                                        <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>发票类型</Text>
                                    </View>
                                    <View style={[styles.fd_c, styles.mt_25]}>
                                        {
                                            ['个人普通电子发票', '企业普通电子发票'].map((aft, index) => {

                                                let on = invoiceIdx === index;

                                                return (
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.pt_10, styles.pb_10]} key={'aft' + index}
                                                        onPress={() => this.setState({ invoiceIdx: index })}
                                                    >
                                                        <Image source={on ? asset.radio_full : asset.radio} style={[styles.radio]} />
                                                        <Text style={[styles.gray_label, styles.default_label, styles.pl_10, on && styles.red_label]} >{aft}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={[styles.fd_r, styles.ai_ct, styles.mt_10]}>
                                        <View style={[styles.headBorder]}></View>
                                        <Text style={[styles.c33_label, styles.default_label, styles.pl_10]}>信息填写</Text>
                                    </View>

                                    {
                                        invoiceIdx === 0 ?
                                            <View style={[styles.fd_c, styles.mt_10]}>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'发票抬头'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_rise}
                                                        keyboardType={'default'}
                                                        onChangeText={(text) => { this.setState({ invoice_rise: text }); }}
                                                    />
                                                </View>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'收件人手机'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_mobile}
                                                        keyboardType={'phone-pad'}
                                                        onChangeText={(text) => { this.setState({ invoice_mobile: text }); }}
                                                    />
                                                </View>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'邮箱'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_email}
                                                        keyboardType={'default'}
                                                        onChangeText={(text) => { this.setState({ invoice_email: text }); }}
                                                    />
                                                </View>
                                            </View>
                                            :
                                            <View style={[styles.fd_c, styles.mt_10]}>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'单位全称'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_unit}
                                                        keyboardType={'default'}
                                                        onChangeText={(text) => { this.setState({ invoice_unit: text }); }}
                                                    />
                                                </View>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'纳税人识别码'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_code}
                                                        keyboardType={'default'}
                                                        onChangeText={(text) => { this.setState({ invoice_code: text }); }}
                                                    />
                                                </View>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'手机'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_mobile}
                                                        keyboardType={'phone-pad'}
                                                        onChangeText={(text) => { this.setState({ invoice_mobile: text }); }}
                                                    />
                                                </View>
                                                <View style={[styles.log_input]}>
                                                    <TextInput
                                                        style={[styles.count_count, styles.pl_12, styles.col_1]}
                                                        type='text'
                                                        clearButtonMode={'never'}
                                                        placeholder={'邮箱'}
                                                        underlineColorAndroid={'transparent'}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        value={invoice_email}
                                                        keyboardType={'default'}
                                                        onChangeText={(text) => { this.setState({ invoice_email: text }); }}
                                                    />
                                                </View>
                                            </View>
                                    }


                                </View>
                                <View style={[styles.log_btn]}>
                                    <TouchableOpacity style={[styles.log_btn_l, styles.col_1, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ invoiceType: false })}>
                                        <Text style={[styles.lg18_label, styles.tip_label]}>关闭</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.col_1, styles.log_btn_r, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={this._onInvoice}>
                                        <Text style={[styles.lg18_label, styles.red_label]}>提交</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        : null}

                {/* 商品操作 */}
                <View style={[styles.order_btm]}>
                    {
                        odr_status === 0 ?
                            <TouchableOpacity style={[styles.order_btm_btn, styles.ai_ct, styles.jc_ct]} onPress={() => this._toPay(this.order)}>
                                <Text style={[styles.default_label, styles.sred_label]}>去付款</Text>
                            </TouchableOpacity>
                            : null}


                    {
                        odr_status === 1 || odr_status === 2 ?
                            <TouchableOpacity style={[styles.order_btm_btn, styles.ai_ct, styles.jc_ct, styles.mr_10]} onPress={() => this.setState({ afterType: true })}>
                                <Text style={[styles.default_label, styles.c33_label]}>申请售后</Text>
                            </TouchableOpacity>
                            : null}


                    {
                        odr_status === 2 ?
                            <TouchableOpacity style={[styles.order_btm_btn, styles.ai_ct, styles.jc_ct, styles.mr_10]} onPress={this._orderConfirm}>
                                <Text style={[styles.default_label, styles.sred_label]}>确认收货</Text>
                            </TouchableOpacity>
                            : null}

                    {
                        this.order.orderAmount!=0&&this.order.orderStatus === 0 && this.order.shippingStatus === 2 && this.order.invoiceUrl === '' ?
                            <TouchableOpacity style={[styles.order_btm_btn, styles.ai_ct, styles.jc_ct, styles.mr_10]} onPress={() => this.setState({ invoiceType: true })}>
                                <Text style={[styles.default_label, styles.sred_label]}>申请发票</Text>
                            </TouchableOpacity>
                            : null}

                    {
                        this.order.orderStatus === 0 && this.order.shippingStatus === 2 && this.order.invoiceUrl !== '' ?
                            <TouchableOpacity style={[styles.order_btm_btn, styles.ai_ct, styles.jc_ct, styles.mr_10]} >
                                <Text style={[styles.default_label, styles.sred_label]}>发票已开</Text>
                            </TouchableOpacity>
                            : null}
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
    orderwrap: {
        position: 'relative',
        paddingBottom: 20,
    },
    order_head: {
        width: theme.window.width,
        height: 134,
    },
    left_arrow: {
        width: 12,
        height: 24,
    },
    orderCons: {
        position: 'absolute',
        top: 0
    },
    orderStatus: {
        width: theme.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    orderH_tip: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff',
        borderRadius: 8,
        marginLeft: 8,
        width: 60,
        height: 16,
    },
    location: {
        width: 12,
        height: 16
    },
    good: {
        marginBottom: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#ffffff'
    },
    goodsCover: {
        width: 65,
        height: 65,
    },
    goodsImg: {
        width: 65,
        height: 65,
    },
    order_log: {
        padding: 12,
        backgroundColor: '#ffffff',
        marginTop: 10,
        alignItems: 'center',
    },
    order_left: {
        width: 4,
        height: 17,
        borderRadius: 3,
        backgroundColor: '#F4623F'
    },
    order_copy: {
        width: 58,
        height: 28,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
    },
    order_btm: {
        width: theme.window.width,
        height: 54,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    order_btm_btn: {
        width: 74,
        height: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderRadius: 3
    },
    order_btm_btnr: {
        borderWidth: 1,
        borderColor: '#F4623F',
        borderStyle: 'solid'
    },
    make_btn: {
        height: 44,
        margin: 22,
        marginTop: 12,
        borderRadius: 5,
        backgroundColor: '#F4623F'
    },
    make_btnm: {
        height: 44,
        margin: 22,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 5,
        borderColor: '#F4623F',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    invoiceType_box: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    afteristics: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        width: 280,
        height: 520,
    },
    afteristicss: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: theme.window.width,
        height: theme.window.height,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        width: 280,
        height: 550,
        marginLeft: -140,
        marginTop: -260,
        left: '50%',
        top: '50%',
    },
    log_head: {
        paddingLeft: 24,
        paddingTop: 26,
        paddingBottom: 13,
        paddingRight: 22
    },
    headBorder: {
        backgroundColor: '#F4623F',
        width: 4,
        height: 17,
        borderRadius: 3,
    },
    radio: {
        width: 15,
        height: 15
    },
    down_arrow: {
        width: 10,
        height: 10,
        marginTop: 5,
        marginRight: 20,
    },
    log_input: {
        width: 240,
        height: 40,
        backgroundColor: '#f3f3f3',
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    log_pic: {
        position: 'relative',
        width: 60,
        height: 60,
        borderWidth: 1,
        borderStyle: 'dotted',
        borderColor: '#E5E5E5',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    log_btn: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        borderStyle: 'solid',
        flexDirection: 'row'
    },
    uppic_img: {
        width: 60,
        height: 60,
    },
    uppic: {
        width: 20,
        height: 20,
    },
    log_btn_l: {
        borderRightWidth: 1,
        borderRightColor: '#E5E5E5',
        borderStyle: 'solid',
    },
    commt_tips: {
        width: 12,
        height: 12,
        position: 'absolute',
        top: -5,
        right: -5,
        borderRadius: 6,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    commt_tip: {
        width: 12,
        height: 12,
    },
    shipbox: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: theme.window.width,
        height: theme.window.height,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        width: 280,
        height: 416,
        marginLeft: -140,
        marginTop: -208,
        left: '50%',
        top: '50%',
    },
    count_count: {
        flex: 1,
        paddingVertical: 0,
    }
});

export const LayoutComponent = OrderDetail;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        orderDetail: state.mall.orderDetail
    };
}
