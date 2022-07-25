//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';

import theme from '../../../config/theme'

// create a component
class Shop extends Component {

    static navigationOptions = ({navigation}) => {
        
		return {
            title: '商店',
            headerRight: (
                <TouchableOpacity style={[styles.pr_15]} onPress={() => navigation.navigate('ForestOrderHistory')}>
                    <Text>购买记录</Text>
                </TouchableOpacity>
            ),
		}
    };

    ads = ['', '', '']
    seeds = []
    goods = []
    state = {
        currentAd: 0,
    }

    componentDidMount() {
        this.onRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {shop, seed} = nextProps

        if (shop !== this.props.shop) {
            this.goods = shop
        }

        if (seed !== this.props.seed) {
            this.seeds = seed
        }
    }

    onRefresh = () => {
        const {actions} = this.props
        actions.forest.seeds()
        actions.forest.shop()
    }

    _renderAdItem = (item) => {
        return (
            <View style={[styles.ad, styles.bg_wred, styles.circle_10]}/>
        )   
    }

    render() {
        const {navigation} = this.props
        const {currentAd} = this.state

        return (
            <View style={styles.container}>
                <ScrollView 
                    contentContainerStyle={[styles.p_15]}
                >
                    <View>
                        <Carousel
                            useScrollView={true}
                            data={this.ads}
                            autoplay={true}
                            loop={true}
                            autoplayDelay={5000}
                            renderItem={this._renderAdItem}
                            
                            itemWidth={theme.window.width - 30}
                            itemHeight={(theme.window.width - 30) * 0.39}

                            sliderWidth={theme.window.width - 30}
                            sliderHeight={(theme.window.width - 30) * 0.39}

                            activeSlideAlignment={'center'}
                            inactiveSlideScale={0.7}
                            
                            onSnapToItem = {(index) => this.setState({currentAd: index})}
                        />
                        <Pagination
                            dotsLength={this.ads.length}
                            activeDotIndex={currentAd}
                            containerStyle={styles.ad_page}
                            dotStyle={styles.ad_dot}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>
                    <View style={[styles.bg_white, styles.p_15, styles.mt_15, styles.row]}>
                        <View style={[styles.col_1, styles.ai_ct, styles.jc_ct]}>
                            <Text>兑换券</Text>
                            <Text style={[styles.lg24_label, styles.forest_green_label, styles.mt_5]}>4223</Text>
                        </View>
                        <View style={[styles.col_1, styles.ai_ct, styles.jc_ct]}>
                            <Text>当前学分</Text>
                            <Text style={[styles.lg24_label, styles.forest_green_label, styles.mt_5]}>4223</Text>
                        </View>
                        <View style={[styles.col_1, styles.ai_ct, styles.jc_ct]}>
                            <Text>种子数</Text>
                            <Text style={[styles.lg24_label, styles.forest_green_label, styles.mt_5]}>4223</Text>
                        </View>
                    </View>
                    <View style={[styles.bg_white, styles.p_15, styles.mt_15]}>
                        <Text style={[styles.lg18_label]}>购买种子</Text>
                        <View style={[styles.row, styles.f_wrap, styles.mt_10]}>
                            {this.seeds.map((seed, index) => {
                                return (
                                    <View style={[styles.sitem, styles.ai_ct, styles.jc_ct, styles.mt_15]} key={'seed_' + index}>
                                        <Image source={{uri: seed.img}} style={[styles.scover, styles.bg_wred]}/>
                                        <Text style={[styles.mt_10]}>{seed.name}</Text>
                                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>学分 {seed.integral}</Text>
                                        <View style={[styles.row, styles.ai_ct, styles.mt_15]}>
                                            <TouchableOpacity style={[styles.bg_fgreen, styles.p_5, styles.pl_10, styles.pr_10, styles.circle_10]}>
                                                <Text style={[styles.sm_label, styles.white_label]}>购买</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.bg_white, styles.p_5, styles.pl_10, styles.pr_10, styles.circle_10, styles.ml_5]}>
                                                <Text style={[styles.sm_label, styles.forest_green_label]}>兑换</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    <View style={[styles.bg_white, styles.p_15, styles.mt_15]}>
                        <Text style={[styles.lg18_label]}>兑换商品</Text>
                        <View style={[styles.row, styles.f_wrap, styles.mt_10]}>
                            {this.goods.map((goods, index) => {
                                return (
                                    <View style={[styles.gitem, styles.mt_15]} key={'goods_' + index}>
                                        <Image source={{uri: goods.goodsImg}} style={[styles.gcover, styles.bg_wred]}/>
                                        <Text style={[styles.mt_10, styles.lg_label]}>{goods.goodsName}</Text>
                                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                                            <Text style={[styles.forest_green_label]}>{goods.cardNum}兑换券</Text>
                                            <Text style={[styles.tip_label]}>已兑{goods.saleNum}</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.bg_fgreen, styles.p_10, styles.pl_15, styles.pr_15, styles.circle_20, styles.ai_ct, styles.mt_10]} onPress={() => navigation.navigate('ForestGoods', {goods: goods})}>
                                            <Text style={[styles.white_label]}>兑换</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    ad: {
        width: theme.window.width - 30,
        height:(theme.window.width - 30) * 0.39,
    },
    ad_page: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 5
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    sitem: {
        width: '33%',
    },
    scover: {
        width: 100,
        height: 100,
    },
    gitem: {
        width: '46%',
        margin: '2%',
    },
    gcover: {
        width: 140,
        height: 140,
    }
});

export const LayoutComponent = Shop;

export function mapStateToProps(state) {
	return {
        seed: state.forest.seed,
        shop: state.forest.shop,
	};
}
