import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, Modal, TextInput, Platform,Alert } from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import _ from 'lodash';
import HtmlView from '../../component/HtmlView';
import HudView from '../../component/HudView';

import theme from '../../config/theme';
import asset from '../../config/asset';



class MailDetail extends Component {

    static navigationOptions = {
        title: '商品详情',
        headerRight: <View />,
    };


    constructor(props) {
        super(props);

        const { navigation } = this.props;
        this.goods = navigation.getParam('cate', {});
        this.goods_id = this.goods.goodsId

        this.state = {
            goods_id: this.goods_id,
            currentAd: 0,
            gType: false, // 显示购物车 直接购买弹窗
            gTypeIdx: 0, // 0 加入购物车 1 直接购买
            goodsAttrIds: {},
            goodsAttr: [],
            goods_number: 1,
            stock: 0,
            stocks: 0,
            goodsIntro: "",
            goodsAttr_str: "",
            userId: 0,
            stockMap: [],
            Introlst: [],
        }

        this._renderAdItem = this._renderAdItem.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);

        this._onViewChange = this._onViewChange.bind(this);

        this._minus = this._minus.bind(this);
        this._add = this._add.bind(this);

        this._toOrder = this._toOrder.bind(this);

        this._selectAttr = this._selectAttr.bind(this);

        this._goodStr = this._goodStr.bind(this);

        this._addGoods = this._addGoods.bind(this);

    }

    componentDidMount() {
        const { actions } = this.props;
        const { goods_id } = this.state;

        actions.mall.goods(goods_id);
    }

    componentWillReceiveProps(nextProps) {

        const { goods } = nextProps;

        if (goods !== this.props.goods) {

            this.goods = goods;
            let maps = []
            if (goods.attrStockMapDTOS.length > 0) {
                goods.attrStockMapDTOS.map(item => {
                    let vas = { goodsAttrIds: item.goodsAttrIds, stock: item.stock }
                    maps.push(vas)
                })
            }
            let Introlst = goods.goodsIntro.split("<p></p>")
            this.setState({
                stock: goods.stock,
                goodsAttr: goods.goodsAttr,
                stockMap: maps,
                Introlst: Introlst
            })
            if(goods.status===0){
                Alert.alert('提示', '该商品已下架', [
                    {
                        text: '确定', onPress: () => {
                            this.props.navigation.goBack()
                        }
                    }])
            }

        }
    }

    componentWillUnmount() {

    }

    _renderAdItem({ item, index }) {
        return (
            <View>
                <View style={[styles.ad_item, styles.live_box]}>
                    <Image roundAsCircle={true} source={{ uri: item.fpath }} style={[styles.ad_img]} />
                </View>
            </View>
        );
    }



    _onViewChange() { }

    _minus() {

        let { goods_number } = this.state;

        if (goods_number > 1) {

            this.setState({
                goods_number: goods_number - 1
            })
        }
    }

    _add() {

        let { goods_number, stock } = this.state;

        if (goods_number < stock) {

            this.setState({
                goods_number: goods_number + 1,
            })
        } else {
            this.refs.hud.show('库存不足', 2);
        }

    }

    _selectAttr(attr, idx, index) {

        const { goodsAttrIds, stockMap } = this.state;

        if (goodsAttrIds[attr.attrId] === undefined || goodsAttrIds[attr.attrId] === "") {

            goodsAttrIds[attr.attrId] = attr.goodsAttrId + ''

        } else {
            let attr_ids = [];

            attr_ids = goodsAttrIds[attr.attrId].split(",")

            if (attr_ids.indexOf(attr.goodsAttrId + '') > -1) {
                attr_ids.splice(attr_ids.indexOf(attr.goodsAttrId + ''), 1)
            } else {
                attr_ids[0] = attr.goodsAttrId + ''
            }

            let attr_str = attr_ids.join(",")

            goodsAttrIds[attr.attrId] = attr_str;


        }
        let lst = Object.values(goodsAttrIds)
        let stocks = 0
        if (stockMap.length > 0) {
            stockMap.map(itm => {
                if (lst.length == 1) {
                    if (itm.goodsAttrIds.indexOf(lst.toLocaleString()) != -1) {
                        stocks = stocks + itm.stock
                    }
                }
                if (lst.length == 2) {
                    if (itm.goodsAttrIds.indexOf(lst[0]) != -1 && itm.goodsAttrIds.indexOf(lst[1]) != -1) {
                        stocks = stocks + itm.stock
                    }
                }
                if (lst.length == 3) {
                    if (itm.goodsAttrIds.indexOf(lst[0]) != -1 && itm.goodsAttrIds.indexOf(lst[1]) != -1 && itm.goodsAttrIds.indexOf(lst[2]) != -1) {
                        stocks = stocks + itm.stock
                    }
                }
                if (lst.length == 4) {
                    if (itm.goodsAttrIds.indexOf(lst[0]) != -1 && itm.goodsAttrIds.indexOf(lst[1]) != -1 && itm.goodsAttrIds.indexOf(lst[2]) != -1 && itm.goodsAttrIds.indexOf(lst[3]) != -1) {
                        stocks = stocks + itm.stock
                    }
                }
                if (lst.length == 5) {
                    if (itm.goodsAttrIds.indexOf(lst[0]) != -1 && itm.goodsAttrIds.indexOf(lst[1]) != -1 && itm.goodsAttrIds.indexOf(lst[2]) != -1 && itm.goodsAttrIds.indexOf(lst[3]) != -1 && itm.goodsAttrIds.indexOf(lst[4]) != -1) {
                        stocks = stocks + itm.stock
                    }
                }
            })
        }

        this.setState({
            goodsAttrIds: goodsAttrIds,
            stock: stocks,
            goods_number: 1
        }, () => {
            this._goodStr();
        })

    }

    _goodStr() {
        const { goodsAttr, goodsAttrIds } = this.state;

        let attrs = [];

        for (let i = 0; i < goodsAttr.length; i++) {
            for (let j = 0; j < goodsAttr[i].goodsAttrMapList.length; j++) {
                if (goodsAttr[i].goodsAttrMapList[j].goodsAttrId === parseInt(goodsAttrIds[goodsAttr[i].attrId])) {
                    attrs.push(goodsAttr[i].goodsAttrMapList[j].attrVal)
                }
            }
        }

        this.setState({
            goodsAttr_str: attrs.join(",")
        })

    }

    _addGoods(type) {
        const { user, navigation } = this.props
        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
            return;
        }
        if(this.goods.status==0){
            this.refs.hud.show('该商品已下架', 2);
            return;
        }
        if (user.level < this.goods.ulevel) {
            this.refs.hud.show('该等级无法兑换', 2);
            return;
        }
        if (!user.teacher && this.goods.tlevel > 0) {
            this.refs.hud.show('抱歉，您不是讲师', 2);
            return;
        }
        if (this.goods.tlevel > 0 && user.teacherDTO.level + 1 < this.goods.tlevel) {
            this.refs.hud.show('该等级无法兑换', 2);
            return;
        }
        this.setState({
            gTypeIdx: type,
            gType: true,
        })
    }

    _toOrder() {

        const { navigation, actions } = this.props;
        const { goods_number, goodsAttrIds, goodsAttr, goodsAttr_str, stock, goods_id, gTypeIdx } = this.state;

        let attrids = Object.values(goodsAttrIds).join(",");
        if (Object.values(goodsAttrIds).length >= goodsAttr.length) {

            if (goods_number < stock) {

                if (gTypeIdx === 0) {

                    actions.mall.addCart({
                        goods_id: goods_id,
                        attr_ids: attrids,
                        goods_number: goods_number,
                        device_id: 0,
                        resolved: (data) => {
                            this.refs.hud.show('加入购物车成功', 2);

                            this.setState({
                                gType: false,
                            })
                        },
                        rejected: (msg) => {
                        }
                    })

                } else {

                    this.setState({
                        gType: false,
                    }, () => {
                        navigation.navigate('Settlement', {
                            goodsName: this.goods.goodsName,
                            goods_id: goods_id,
                            goodsIntegral: this.goods.goodsIntegral,
                            goodsImg: this.goods.goodsImg,
                            goods_number: goods_number,
                            goodsAttrIds: JSON.stringify(goodsAttrIds),
                            goodsAttr_str: goodsAttr_str,
                            goods: this.goods,
                            gtype: this.goods.gtype,
                            goodsActivityDTO: this.goods.goodsActivityDTO,
                            activityId: this.goods.goodsActivityDTO.activityId
                        });
                    })

                }

            } else {
                this.refs.hud.show('库存不足', 2);
            }

        } else {
            this.refs.hud.show('请选择规格', 2);
        }

    }

    _renderHeader() {
        const { currentAd } = this.state;

        return (
            <View>
                <View>
                    <Carousel
                        useScrollView={true}
                        data={this.goods.galleryList}
                        autoplay={true}
                        loop={true}
                        autoplayDelay={5000}
                        renderItem={this._renderAdItem}

                        itemWidth={theme.window.width}
                        itemHeight={theme.window.width}

                        sliderWidth={theme.window.width}
                        sliderHeight={theme.window.width}

                        activeSlideAlignment={'center'}

                        onSnapToItem={(index) => this.setState({ currentAd: index })}


                    />
                    <Pagination
                        dotsLength={this.goods.galleryList.length}
                        activeDotIndex={currentAd}
                        containerStyle={styles.ad_page}
                        dotStyle={styles.ad_dot}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </View>
                <View style={[styles.p_15, styles.bg_white]}>
                    <Text style={[styles.black_label, styles.lg18_label]} numberOfLines={1}>{this.goods.goodsName}</Text>
                    <Text style={[styles.gray_label, styles.default_label, styles.mt_5]} numberOfLines={1}>{this.goods.summary}</Text>
                    <View style={[styles.fd_r, styles.ai_ct, styles.mt_5]}>
                        {
                            this.goods.gtype == 2 ?
                                <Text style={[styles.lg_label, styles.red_label, styles.fw_label]}>¥{this.goods.goodsAmountDTO.goodsAmount ? this.goods.goodsAmountDTO.goodsAmount : this.goods.goodsAmount}</Text>
                                : null}
                        {
                            this.goods.gtype == 3 ?
                                <Text style={[styles.lg_label, styles.red_label, styles.fw_label]}>{this.goods.goodsIntegral}学分</Text>
                                : null}
                        {
                            this.goods.gtype == 4 ?
                                <Text style={[styles.lg_label, styles.red_label, styles.fw_label]}>¥{this.goods.goodsAmount}+{this.goods.goodsIntegral}学分</Text>
                                : null}

                        {
                            this.goods.goodsActivityDTO.activityId !== 0 ?
                                <View>
                                    {
                                        this.goods.goodsActivityDTO.way === 0 ?
                                            <View style={[styles.count_tip]}>
                                                <Text style={[styles.smm_label, styles.red_label]}>满{this.goods.goodsActivityDTO.condFir}减{this.goods.goodsActivityDTO.condSec}</Text>
                                            </View>
                                            :
                                            <View style={[styles.count_tip]}>
                                                <Text style={[styles.smm_label, styles.red_label]}>满{this.goods.goodsActivityDTO.condFir}件{this.goods.goodsActivityDTO.condSec * 10}折</Text>
                                            </View>
                                    }
                                </View>
                                : null}
                    </View>
                    <View style={[styles.fd_r, styles.ai_ct, styles.mt_15]}>
                        <Text style={[styles.sm_label, styles.tip_label]}>{this.goods.isFree === 1 ? '包邮' : '不包邮'}</Text>
                        <Text style={[styles.sm_label, styles.tip_label]}>{'   '}月销<Text style={[styles.sm_label, styles.c33_label]}>{this.goods.saleNum}</Text></Text>
                    </View>
                </View>

                {
                    this.goods.goodsActivityDTO.activityId !== 0 ?
                        <View style={[styles.countBox]}>
                            <Image source={asset.mail.countIcon} style={[styles.countBox_icon]} />
                            {/*  way 0 满减  1 满折 */}
                            {
                                this.goods.goodsActivityDTO.way === 0 ?
                                    <View style={[styles.fd_r, styles.ai_ct]}>
                                        <Text style={[styles.tip_label, styles.sm_label]}>促销: </Text>
                                        <Text style={[styles.c33_label, styles.sm_label]}>满{this.goods.goodsActivityDTO.condFir}减{this.goods.goodsActivityDTO.condSec}</Text>
                                    </View>
                                    :
                                    <View style={[styles.fd_r, styles.ai_ct]}>
                                        <Text style={[styles.tip_label, styles.sm_label]}>促销: </Text>
                                        <Text style={[styles.c33_label, styles.sm_label]}>满{this.goods.goodsActivityDTO.condFir}件{this.goods.goodsActivityDTO.condSec * 10}折</Text>
                                    </View>
                            }
                        </View>
                        : null}

            </View>
        )

    }

    _renderFooter() {
        const { Introlst } = this.state
        return (
            <View style={[styles.desc, styles.bg_white, styles.fd_c]}>
                <View style={[styles.fd_r, styles.pt_12, styles.ai_ct]}>
                    <View style={[styles.left_border]}></View>
                    <Text style={[styles.black_label, styles.default_label, styles.fw_label]}>商品详情</Text>
                </View>
                <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, { width: theme.window.width }, styles.pt_10]}>
                    <HtmlView html={this.goods.goodsIntro} onLinkPress={this.onLinkPress} type={2} />
                </View>
            </View>
        )
    }


    _renderItem(item) {
        return (
            <View></View>
        )
    }

    render() {
        const { navigation } = this.props;
        const { gType, goodsAttrIds, goods_number, gTypeIdx } = this.state;


        return (
            <View style={styles.container}>

                <FlatList
                    ref={'scroll'}
                    data={[]}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent={this._renderFooter}
                    viewabilityConfig={{
                        waitForInteraction: true,
                        minimumViewTime: 100,
                        viewAreaCoveragePercentThreshold: 100,
                    }}
                    onViewableItemsChanged={this._onViewChange}
                />

                {
                    this.goods.gtype === 3 ?
                        <View style={[styles.fd_r]}>
                            {
                                this.goods.status == 0 ?
                                    <TouchableOpacity style={[styles.btns]}>
                                        <Text style={[styles.white_label, styles.default_label]}>已下架</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={[styles.btn]} onPress={() => this._addGoods(1)}>
                                        <Text style={[styles.white_label, styles.default_label]}>立即购买</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                        :
                        <View style={[styles.fd_r]}>
                            <TouchableOpacity style={[styles.cart_box, styles.fd_c, styles.jc_ct, styles.ai_ct]} onPress={() => navigation.navigate('Cart')}>
                                <Image source={asset.mail.cart} style={[styles.cart_icon]} />
                                <Text style={[styles.tip_label, styles.sm_label, styles.mt_5]}>购物车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: '#FFC107' }]} onPress={() => this._addGoods(0)}>
                                <Text style={[styles.white_label, styles.default_label]}>加入购物车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn]} onPress={() => this._addGoods(1)}>
                                <Text style={[styles.white_label, styles.default_label]}>立即购买</Text>
                            </TouchableOpacity>
                        </View>
                }


                <Modal visible={gType} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={() => this.setState({ gType: false })}></TouchableOpacity>
                    <View style={styles.goodsCons}>
                        <View style={[styles.goodsBox]}>

                            <View style={[styles.cartBox_head]}>
                                <Image source={{ uri: this.goods.goodsImg }} style={[styles.goodsCover]} />
                                <View style={[styles.fd_r, styles.jc_sb, styles.cartBox_head_right]}>
                                    <View style={[styles.fd_c, styles.mt_10]}>
                                        {
                                            this.goods.gtype === 2 ?
                                                <Text style={[styles.default_label, styles.red_label]}>¥{this.goods.goodsAmount}</Text>
                                                : null}
                                        {
                                            this.goods.gtype === 3 ?
                                                <Text style={[styles.default_label, styles.red_label]}>{this.goods.goodsIntegral}学分</Text>
                                                : null}

                                        <Text style={[styles.gray_label, styles.sm_label, styles.mt_5]}>请选择规格</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ gType: false })}>
                                        <Image source={asset.dete_icon} style={[styles.dete_icon]} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {
                                this.goods.goodsAttr.map((attrs, index) => {
                                    return (
                                        <View style={[styles.fd_c, styles.pl_20, styles.pr_20, styles.pt_15]} key={'attrs' + index}>
                                            <Text style={[styles.default_label, styles.c33_label]}>{attrs.name}</Text>
                                            <View style={[styles.type_boxs, styles.mt_15, styles.fd_r,]}>
                                                {
                                                    attrs.goodsAttrMapList.map((attr, idx) => {
                                                        let on = parseInt(goodsAttrIds[attr.attrId]) === attr.goodsAttrId;
                                                        return (
                                                            <TouchableOpacity
                                                                style={[styles.type_box, styles.ai_ct, styles.jc_ct, styles.mb_10, on && styles.border_red,]} key={'attr' + idx}
                                                                onPress={() => this._selectAttr(attr, idx, index)}
                                                            >
                                                                <Text style={[styles.sm_label, styles.gray_label, on && styles.red_label]}>{attr.attrVal}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }

                            <View style={[styles.pl_20, styles.pr_20]}>
                                <View style={[styles.countpay, styles.fd_r, styles.ai_ct, styles.jc_sb]}>
                                    <Text style={[styles.c33_label, styles.default_label]}>数量选择</Text>
                                    <View style={[styles.fd_r, styles.ai_ct, styles.count_cons]}>
                                        <TouchableOpacity style={[styles.count_minus]} onPress={this._minus}>
                                            <Text style={[styles.default_label, styles.c33_label]}>-</Text>
                                        </TouchableOpacity>
                                        <TextInput
                                            style={[styles.count_count]}
                                            type='number'
                                            clearButtonMode={'never'}
                                            underlineColorAndroid={'transparent'}
                                            autoCorrect={false}
                                            autoCapitalize={'none'}
                                            value={goods_number + ''}
                                            keyboardType={'phone-pad'}
                                            onChangeText={(text) => { this.setState({ goods_number: text }); }}
                                        />
                                        <TouchableOpacity style={[styles.count_add]} onPress={this._add}>
                                            <Text style={[styles.default_label, styles.c33_label]}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[{ marginBottom: 10 }]}><Text>库存:{this.state.stock}</Text></View>
                            </View>
                            <TouchableOpacity style={[styles.makebtn]} onPress={this._toOrder}>
                                <Text style={[styles.default_label, styles.white_label]}>确定</Text>
                            </TouchableOpacity>
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
    ad_img: {
        width: theme.window.width,
        height: theme.window.width
    },
    ad_page: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        paddingVertical: 5
    },
    btn: {
        flex: 1,
        height: 50,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btns: {
        flex: 1,
        height: 50,
        backgroundColor: '#cccccc',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    left_border: {
        width: 4,
        height: 14,
        backgroundColor: '#F4623F',
        borderRadius: 3,
        marginLeft: 18,
        marginRight: 8,
    },
    desc: {
        borderTopWidth: 10,
        borderTopColor: '#FAFAFA',
        borderStyle: 'solid',
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    goodsCons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        borderRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#ffffff'
    },
    goodsBox: {
        width: '100%',
        backgroundColor: '#ffffff',
    },
    cartBox_head: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 20,
        marginTop: -30
    },
    goodsCover: {
        width: 80,
        height: 80,
        backgroundColor: '#ffffff'
    },
    cartBox_head_right: {
        height: 50,
        flex: 1,
        paddingLeft: 10,
        paddingRight: 20,
    },
    dete_icon: {
        width: 20,
        height: 20,
        marginTop: 6
    },
    type_boxs: {
        flexWrap: 'wrap'
    },
    type_box: {
        height: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EDECEC',
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 4,
        minWidth: 24,
        marginRight: 10,
    },
    countpay: {
        borderTopColor: '#EFEFEF',
        borderTopWidth: 1,
        borderStyle: 'solid',
        marginTop: 15,
        paddingTop: 15,
        paddingBottom: 50,
    },
    count_cons: {
        width: 84,
        height: 28,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DDDDDD',
        borderRadius: 5,
    },
    count_minus: {
        width: 26,
        height: 28,
        borderRightColor: '#DDDDDD',
        borderStyle: 'solid',
        borderRightWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    count_count: {
        width: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        paddingVertical: 0,
    },
    count_add: {
        width: 26,
        height: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderLeftWidth: 1,
        borderLeftColor: '#DDDDDD'
    },
    makebtn: {
        width: '100%',
        height: 50,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    border_red: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#FF5047'
    },
    cart_icon: {
        width: 23,
        height: 20,
    },
    cart_box: {
        width: 70
    },
    count_tip: {
        width: 56,
        height: 13,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        marginTop: 2,
        borderWidth: 1,
        borderColor: 'rgba(244,98,63,1)',
        borderStyle: 'solid',
    },
    countBox: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    countBox_icon: {
        width: 16,
        height: 16,
        marginLeft: 10,
        marginRight: 4,
    }
});

export const LayoutComponent = MailDetail;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        goods: state.mall.goods,
    };
}
