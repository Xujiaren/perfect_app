import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Picker from 'react-native-picker';
import * as WeChat from 'react-native-wechat-lib';

import HudView from '../../component/HudView';
import Tabs from '../../component/Tabs'
import RefreshListView, { RefreshState } from '../../component/RefreshListView';

import { getExactTime } from '../../util/common'

import theme from '../../config/theme';
import asset from '../../config/asset';
import { State } from 'react-native-image-zoom-viewer/built/image-viewer.type';



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


class Order extends Component {

    static navigationOptions = {
        title: '订单管理',
        headerRight: <View />,
        defaultNavigationOptions: {
            headerLeft: null,//隐藏返回箭头
        }
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.totalPage = 1;
        this.items = [];
        this.itemtype = null;

        this.order = {}
        this.list = []

        this.state = {
            refreshState: RefreshState.Idle,
            status: 0,
            tabbarIndex: 3,
            tabbar_bottom: [{
                text: '首页',
                link: 'Mail',
                icon: asset.mail.mail_icon,
                iconfull: asset.mail.mail_icon_full
            }, {
                text: '分类',
                link: 'MailCate',
                icon: asset.mail.cate_icon,
                iconfull: asset.mail.cate_icon_full
            }
                , {
                text: '购物车',
                link: 'Cart',
                icon: asset.mail.cart_icon,
                iconfull: asset.mail.cart_icon_full
            }
                , {
                text: '订单',
                link: 'Order',
                icon: asset.mail.order_icon,
                iconfull: asset.mail.order_icon_full
            }],

            afterType: false,
            logType: false,
            afterTypeId: 25,
            afterTypeList: [{ text: '我要退款（无需退货）', afterTypeId: 25 }, { text: '我要退货退款', afterTypeId: 26 }, { text: '换货', afterTypeId: 27 }],
            afterReason: ['商品瑕疵', '质量问题', '漏发/错发', '收到商品时有划痕或破损', '包装/商品污渍/变形'],
            afterReasonIndex: 0,
            afterExplain: '',// 退换货原因 
            afterImgs: [], // 上传凭证
            preview: false,
            preview_index: 0,
            images: [],
            shipType: false,
            saleTypeShopName: '',
            saleTypeShopNumber: '',

            otype: 0 // 现金2， 学分 3ß


        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._onSelect = this._onSelect.bind(this);

        this._toOrder = this._toOrder.bind(this);


        this._orderConfirm = this._orderConfirm.bind(this);


        this._slectAfterType = this._slectAfterType.bind(this);
        this.onViewImgs = this.onViewImgs.bind(this);
        this._onDetele = this._onDetele.bind(this);
        this._onChangeImg = this._onChangeImg.bind(this);
        this._onRate = this._onRate.bind(this);
        this._onRefundType = this._onRefundType.bind(this);

        this._onRequst = this._onRequst.bind(this);


    }

    componentDidMount() {
        const { navigation, actions } = this.props;

        this._onHeaderRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {

            this._onHeaderRefresh();

        })
    }

    componentWillReceiveProps(nextProps) {

        const { order,ems } = nextProps;

        if (order !== this.props) {

            this.itemtype = [];
            this.page = order.page;
            this.totalPage = order.pages;
            this.items = this.items.concat(order.items);

        }
        if(ems !== this.props.ems){
            this.list = ems
        }

        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }

    _onHeaderRefresh() {

        const { actions } = this.props;
        const { status } = this.state;

        this.page = 0;
        this.items = [];
        this.itemtype = null;

        actions.mall.order(status, this.page);

    }

    _onFooterRefresh() {
        const { actions } = this.props;
        const { status } = this.state


        if (this.page < this.totalPage) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page = this.page + 1;

            actions.mall.order(status, this.page);

        }
        else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
    }

    _onSelect(index) {

        this.setState({
            status: index
        }, () => {
            this._onHeaderRefresh();
        })

    }

    _onRequst(order) {

        this.order = order;

        this.setState({
            afterType: true,
            otype: order.otype,
        })
    }

    _toOrder(item) {

        const { navigation } = this.props;

        navigation.navigate('OrderPay', { goodsAmount: item.goodsAmount, orderSn: item.orderSn })

    }


    _orderConfirm(orderId) {
        const { actions } = this.props;

        actions.mall.orderConfirm({
            order_id: orderId,
            resolved: (data) => {

                this.refs.hud.show('收货成功', 2);
                this._onHeaderRefresh();

            },
            rejected: (msg) => {
                this.refs.hud.show('提交失败', 2);
            }
        });
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
                    afterImgs: [],
                    status: 5,
                    otype: 0,
                }, () => {
                    this._onHeaderRefresh();
                })

            },
            rejected: (msg) => {
            }
        })

    }


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

    _onDetele(index) {

        const { afterImgs } = this.state
        afterImgs.splice(index, 1)

        this.setState({
            afterImgs: afterImgs
        })
    }


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

    _slectAfterType(aft) {
        this.setState({
            afterTypeId: aft.afterTypeId
        })
    }

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

    _orderCancel = (item) => {
        const { actions } = this.props
        actions.mall.orderCancel({
            order_id: item.orderId,
            resolved: (res) => {
                this.refs.hud.show('取消成功', 2);
                this._onHeaderRefresh()
            },
            rejected: (err) => {

            }
        })
    }

    _checkLog = (item) => {
        const{actions}=this.props
        actions.mall.getEms(item.orderId)
        this.setState({
            logType: true
        })
    }

    _renderItem(item) {
        const { navigation } = this.props;
        const order = item.item;
        let odr_val = ''
        let odr_tips = ''
        let odr_status = 100

        if (order.orderStatus === 0) {
            if (order.payStatus === 0) {
                odr_val = '待付款'
                odr_status = 0
            } else if (order.payStatus === 1) {
                if (order.shippingStatus === 0) {
                    odr_val = '待发货'
                    odr_status = 1
                } else if (order.shippingStatus === 1) {
                    odr_val = '待收货'
                    odr_status = 2
                } else if (order.shippingStatus === 2) {
                    odr_val = '已收货'
                    odr_status = 3
                }
            }
        } else if (order.orderStatus === 1) {
            odr_val = '已取消'
            odr_status = 7
        } else if (order.orderStatus === 2) {
            if (order.orderReturnList.length > 0) {
                if (order.orderReturnList[0].status === 0) {
                    if (order.orderReturnList[0].adminStatus === 0) {
                        odr_val = '待处理'
                        odr_status = 4
                    } else if (order.orderReturnList[0].adminStatus === 1) {
                        odr_val = '退款中'
                        odr_status = 5
                    } else {
                        odr_val = '拒绝'
                        odr_status = 6
                    }
                } else if (order.orderReturnList[0].status === 1) {
                    odr_val = '订单关闭'
                    odr_status = 14
                }
            }

        } else if (order.orderStatus === 3) {

            if (order.orderReturnList.length > 0) {
                if (order.orderReturnList[0].status === 0) {
                    if (order.orderReturnList[0].adminStatus === 0) {
                        odr_val = '待处理'
                        odr_status = 8
                    } else if (order.orderReturnList[0].adminStatus === 1) {
                        odr_val = '处理中'
                        odr_status = 9
                    } else {
                        odr_val = '拒绝'
                        odr_status = 10
                    }
                } else if (order.orderReturnList[0].status === 1) {
                    odr_val = '订单关闭'
                    odr_status = 14
                }

            }
        } else if (order.orderStatus === 4) {
            if (order.orderReturnList.length > 0) {
                if (order.orderReturnList[0].status === 0) {
                    if (order.orderReturnList[0].adminStatus === 0) {
                        odr_val = '待处理'
                        odr_status = 11
                    } else if (order.orderReturnList[0].adminStatus === 1) {
                        odr_val = '处理中'
                        odr_status = 12
                    } else {
                        odr_val = '拒绝'
                        odr_status = 13
                    }
                } else if (order.orderReturnList[0].status === 1) {
                    odr_val = '订单关闭'
                    odr_status = 14
                }

            }
        }

        return (
            <TouchableOpacity style={[styles.item, styles.pb_15]}
                onPress={() => navigation.navigate('OrderDetail', { order: order, orderId: order.orderId })}
            >

                <View style={[styles.itemHead, styles.fd_r, styles.jc_sb, styles.pt_15, styles.pb_10]}>
                    <Text style={[styles.sm_label, styles.c33_label]}>下单时间：{getExactTime(parseInt(order.payTime))}</Text>
                    {
                        odr_status === 5 || odr_status === 9 || odr_status === 12 ?
                            <Text style={[styles.sred_label, styles.sm_label]}>{odr_val}</Text>
                            :
                            <Text style={[styles.c33_label, styles.sm_label]}>{odr_val}</Text>
                    }
                </View>
                <View style={[styles.itemLists]} >
                    {
                        order.orderGoods.map((odr, idx) => {

                            return (
                                <View style={[styles.itemList, styles.fd_r, styles.pt_15, styles.pb_10]} key={'odr' + idx}>
                                    <Image source={{ uri: odr.goodsImg }} style={[styles.itemCover]} />
                                    <View style={[styles.fd_c, styles.jc_sb, styles.col_1]}>
                                        <View style={[styles.fd_r, styles.jc_sb]}>
                                            <Text style={[styles.c33_label, styles.default_label, styles.fw_label, styles.col_1]} numberOfLines={2}>{odr.goodsName}</Text>
                                            {
                                                order.otype === 2 ?
                                                    <Text style={[styles.sm_label, styles.c33_label]}>¥{odr.goodsAmount}</Text>
                                                    : null}
                                            {
                                                order.otype === 3 ?
                                                    <Text style={[styles.sm_label, styles.c33_label]}>{odr.integralAmount}学分</Text>
                                                    : null}
                                        </View>
                                        <View style={[styles.fd_r, styles.jc_sb]}>
                                            <Text style={[styles.tip_label, styles.default_label]}>{odr.goodsAttr}</Text>
                                            <Text style={[styles.sm_label, styles.black_label, styles.fw_label]}>x{odr.goodsNum}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <View style={[styles.fd_c, styles.jc_fe, styles.pt_10, styles.itemBottom]}>
                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_fe]}>
                        <Text style={[styles.sm_label, styles.c33_label, styles.fw_label]}>共{order.totalNum}件</Text>
                        {/* <Text style={[styles.sm_label, styles.c33_label, styles.fw_label, styles.pl_10]}>邮费{order.shippingAmount}元</Text> */}
                        <View style={[styles.fd_r, styles.ai_ct, styles.ml_10]}>
                            <Text style={[styles.sm_label, styles.tip_label]}>合计：</Text>
                            {
                                order.otype === 2 ?
                                    <Text style={[styles.sred_label, styles.sm_label]}>¥{order.orderAmount}</Text>
                                    : null}
                            {
                                order.otype === 3 ?
                                    <Text style={[styles.sred_label, styles.sm_label]}>{order.integralAmount}学分</Text>
                                    : null}
                        </View>
                    </View>
                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_fe]}>
                        {
                            odr_status === 0 || odr_status === 1 ?
                                <TouchableOpacity style={[styles.itemCancel, styles.ai_ct, styles.jc_ct, styles.mt_5]} onPress={() => this._orderCancel(order)}>
                                    <Text style={[styles.default_label, styles.c33_label]}>取消订单</Text>
                                </TouchableOpacity>
                                : null}
                        {
                            odr_status === 0 ?
                                <TouchableOpacity style={[styles.itemPlay, styles.ai_ct, styles.jc_ct, styles.m_5]} onPress={() => this._toOrder(order)}>
                                    <Text style={[styles.default_label, styles.sred_label]}>去付款</Text>
                                </TouchableOpacity>
                                : null}
                        {
                            odr_status === 2 ?
                                <TouchableOpacity style={[styles.itemCancel, styles.ai_ct, styles.jc_ct, styles.mt_5]}
                                    onPress={() => this._checkLog(order)}
                                >
                                    <Text style={[styles.default_label, styles.c33_label]}>查看物流</Text>
                                </TouchableOpacity>
                                : null}

                        {
                            odr_status === 1 || odr_status === 2 ?
                                <TouchableOpacity style={[styles.itemCancel, styles.ai_ct, styles.jc_ct, styles.mt_5]}
                                    onPress={() => this._onRequst(order)}
                                >
                                    <Text style={[styles.default_label, styles.c33_label]}>申请售后</Text>
                                </TouchableOpacity>
                                : null}

                        {
                            odr_status === 2 ?
                                <TouchableOpacity style={[styles.itemCancel, styles.ai_ct, styles.jc_ct, styles.mt_5]} onPress={() => this._orderConfirm(order.orderId)}>
                                    <Text style={[styles.default_label, styles.sred_label]}>确认收货</Text>
                                </TouchableOpacity>
                                : null}


                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    _keyExtractor(item, index) {
        return index + '';
    }

    render() {
        const { navigation } = this.props;
        const { tabbarIndex, tabbar_bottom, status, afterType, afterTypeList, afterReason, afterReasonIndex, afterTypeId, afterExplain, afterImgs, preview, preview_index, images, otype } = this.state;


        return (
            <View style={styles.container}>
                <View style={[styles.filter,styles.bg_white]}>
                    <Tabs items={['全部', '待付款', '待发货', '待收货', '已完成', '售后']} selected={status} type={0} atype={1} onSelect={this._onSelect} />
                </View>
                {
                    this.items.length === 0 ?
                        <View style={[{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                            <View style={[{ width: 150 }]}>
                                <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646370444729.png' }} style={[{ width: 150, height: 150 }]} />
                                <View style={[{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5 }]}>
                                    <Text style={[{ fontSize: 12, color: '#999999' }]}>一个订单都没有哦~</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <RefreshListView
                            contentContainerStyle={[styles.mt_10]}
                            showsVerticalScrollIndicator={false}
                            data={this.items}
                            exdata={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this._onHeaderRefresh}
                            onFooterRefresh={this._onFooterRefresh}
                        />
                }
                <View style={[styles.tabbar]}>
                    {
                        tabbar_bottom.map((item, idx) => {

                            const on = tabbarIndex === idx;

                            return (
                                <TouchableOpacity key={'item' + idx} style={[styles.tabItem]}
                                    onPress={() => navigation.navigate(item.link)}
                                >
                                    <Image source={on ? item.iconfull : item.icon} style={[styles.tabItem_cover]} />
                                    <Text style={[styles.sm_label, styles.gray_label, on && styles.red_label]}>{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>



                {/* 售后类型 */}
                <Modal visible={afterType} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} ></TouchableOpacity>
                    <View style={[styles.afteristics]}>
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
                                    style={[styles.count_count, styles.pl_12, styles.col_1,{flex:1,paddingVertical: 0}]}
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
                            <TouchableOpacity style={[styles.log_btn_l, styles.col_1, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ afterType: false, otype: 0 })}>
                                <Text style={[styles.lg18_label, styles.tip_label]}>关闭</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.log_btn_r, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={this._onRefundType}>
                                <Text style={[styles.lg18_label, styles.red_label]}>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal visible={this.state.logType} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} ></TouchableOpacity>
                    <View style={[styles.afteristics]}>
                        <View style={[styles.socvs]}>
                            <ScrollView style={[styles.col_1]}>
                                <View style={[styles.pl_10,styles.pt_10,styles.pr_30,styles.pb_10]}>
                                    {
                                        this.list.map((item, index) => {
                                            if (item.opDesc)
                                                return (
                                                    <View style={[styles.mb_15,styles.row,styles.ai_ct]}>
                                                        <View style={[{width:12,height:12,borderRadius:6,backgroundColor:'#bdbdbd'}]}>
                                                        </View>
                                                        <View style={[styles.ml_10]}>
                                                            <View>
                                                                <Text style={[styles.c33_label, styles.default_label]}>{item.opDesc}</Text>
                                                            </View>
                                                            <View style={[{ marginTop: 3 }]}>
                                                                <Text style={[styles.c33_label, styles.sm_label]}>{item.opTime}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                        })
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        <View style={[styles.log_btn]}>
                            <TouchableOpacity style={[styles.log_btn_l, styles.col_1, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ logType: false })}>
                                <Text style={[styles.lg18_label, styles.tip_label]}>关闭</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.log_btn_r, styles.fd_r, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ logType: false })}>
                                <Text style={[styles.lg18_label, styles.red_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal visible={preview} transparent={true} onRequestClose={() => { }}>
                    <ImageViewer imageUrls={images} index={preview_index} onClick={() => {
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
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    tabbar: {
        width: theme.window.width,
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopColor: '#fafafa',
        borderTopWidth: 1,
        borderStyle: 'solid'
    },
    tabItem: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItem_cover: {
        width: 24,
        height: 24,
    },
    bg_red: {
        backgroundColor: '#F46643'
    },
    item: {
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: '#ffffff',
        marginBottom: 10,
    },
    itemHead: {
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: 1,
        borderStyle: 'solid'
    },
    itemCover: {
        width: 65,
        height: 65,
        marginRight: 15,
    },
    itemBottom: {
        borderTopColor: '#FAFAFA',
        borderTopWidth: 1,
        borderStyle: 'solid'
    },
    itemCancel: {
        width: 70,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        marginLeft: 12
    },
    itemPlay: {
        width: 70,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(244,98,63,1)'
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    afteristics: {
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
    socvs: {
        width: 280,
        height: 500,
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
        height: 32,
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
});

export const LayoutComponent = Order;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        order: state.mall.order,
        ems:state.mall.ems
    };
}
