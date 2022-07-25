import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,ScrollView } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import _ from 'lodash';
import RefreshListView, { RefreshState } from '../../component/RefreshListView';
import ActionButton from 'react-native-action-button';

import HudView from '../../component/HudView';
import Tabs from '../../component/Tabs';
import AskHotCell from '../../component/cell/AskHotCell'
import AskRecmCell from '../../component/cell/AskRecmCell'

import { asset, theme } from '../../config';

class Ask extends Component {

    static navigationOptions = {
        header: null,
    }

    item = []
    page = 0
    pages = 1
    admail = [];
    cate_arr = []
    tap = []
    state = {
        status: 0,
        statusBarHeight: global.statusBarHeight, //状态栏的高度
        navHeight: global.navigationHeight,
        refreshState: RefreshState.Idle,
        currentAd: 0,
        index:0,
        category_id:0,
    }

    componentDidMount() {
        const { actions } = this.props;
        actions.user.user()
        this._onHeaderRefresh()
        actions.ask.category()
    }

    componentWillReceiveProps(nextProps) {
        const { channel, advert, category } = nextProps;

        if (channel !== this.props.channel) {
            this.pages = channel.pages
            this.item = this.item.concat(channel.items)
        }
        if (advert !== this.props.advert) {
            this.admail = advert;
        }
        if (category !== this.props.category) {
            let cateList = []
            if (category.length > 0) {
                for (let i = 0; i < category.length; i++) {
                    cateList.push(category[i].categoryName)
                }
            }
            this.cate_arr = category
            this.tap = cateList
        }
        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }

    onAction = (action, args) => {
        const { navigation, user } = this.props

        if (!user.userId) {
            navigation.navigate('PassPort')
        } else {
            if (action == 'AskQust') {
                navigation.navigate('AskQust')
            }
        }
    }

    _onHeaderRefresh = () => {
        const { actions } = this.props;
        const { status ,category_id} = this.state;

        this.item = []
        this.page = 0
        this.pages = 1

        actions.ask.channel(category_id, '', 0, status)
        actions.site.advert(6)
        this.setState({ refreshState: RefreshState.HeaderRefreshing });
    }

    _onFooterRefresh = () => {
        const { actions } = this.props;
        const { status ,category_id} = this.state;

        if (this.page < this.pages) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page++;

            actions.ask.channel(category_id, '', this.page, status)
        } else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
    }

    _renderItem = (item) => {
        const { navigation } = this.props;
        const { status } = this.state
        const ask = item.item;

        if (status === 0) {
            return (
                <View>
                    {
                        this.admail.length > 0 && item.index === 0 ?
                            <View style={[styles.mt_5, styles.mb_5]}>
                                <Carousel
                                    useScrollView={true}
                                    data={this.admail}
                                    autoplay={true}
                                    loop={true}
                                    autoplayDelay={5000}
                                    renderItem={this._renderAdItem}

                                    itemWidth={theme.window.width * 0.9}
                                    itemHeight={theme.window.width * 0.9 * 0.39}

                                    sliderWidth={theme.window.width}
                                    sliderHeight={theme.window.width * 0.39}

                                    activeSlideAlignment={'center'}
                                    inactiveSlideScale={0.7}

                                    onSnapToItem={(index) => this.setState({ currentAd: index })}
                                />
                                <Pagination
                                    dotsLength={this.admail.length}
                                    activeDotIndex={this.state.currentAd}
                                    containerStyle={styles.ad_page}
                                    dotStyle={styles.ad_dot}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                />
                            </View>
                            : null
                    }
                    <AskRecmCell ask={ask} onPress={() => navigation.navigate('Question', { ask: ask })} />
                </View>
            )
        }

        return (
            <AskHotCell ask={ask} onPress={() => navigation.navigate('Question', { ask: ask })} />
        )
    }
    _onAd(val) {

    }
    _renderAdItem({ item, index }) {
        return (
            <View>
                <TouchableOpacity onPress={() => this._onAd(item)} >
                    <View style={[styles.ad_item, styles.live_box]}>
                        <Image roundAsCircle={true} source={{ uri: item.fileUrl }} style={[styles.ad_img]} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const { status, statusBarHeight, currentAd,index } = this.state;

        return (
            <View style={[styles.container, styles.bg_white]}>
                <View style={{ paddingTop: statusBarHeight, backgroundColor: '#ffffff', }}>
                    <View style={[styles.fd_r, styles.ai_ct, styles.pl_15, styles.pr_15, styles.pt_12, styles.pb_12, styles.jc_ct]}>
                        <TouchableOpacity style={[styles.pl_10, styles.pr_10]} onPress={() => navigation.goBack()}>
                            <Image source={asset.left_arrows} style={[styles.left_icon]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.search_input, styles.fd_r, styles.ai_ct, styles.col_1, styles.pl_10, styles.mr_20, styles.ml_5]}
                            onPress={() => navigation.navigate('AskSearch')}
                        >
                            <Image source={asset.search} style={[styles.search_icon]} />
                            <Text style={[styles.default_label, styles.tip_label, styles.pl_5]}>{'搜索问题'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.searchbtn, styles.ai_ct, styles.fd_r, styles.jc_ct]} onPress={() => navigation.navigate('AskSearch')}>
                            <Image source={asset.search} style={[styles.msg_icon]} />
                        </TouchableOpacity>
                    </View>
                    <Tabs items={['推荐', '热榜']} selected={status} atype={1} onSelect={(index) => {
                        this.setState({
                            status: index,
                            category_id:0,
                        }, () => {
                            this._onHeaderRefresh()
                        })
                    }} />
                    {
                        status == 1 ?
                            <View style={[{ width: '100%' }]}>
                                <ScrollView
                                    contentContainerStyle={[styles.p_10, styles.fd_r, styles.ai_ct]}
                                    horizontal
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity style={styles.catePerBox} onPress={() => {
                                      this.setState({
                                          index:0,
                                          category_id:0
                                      },this._onHeaderRefresh)
                                    }}>
                                        <Text style={[styles.pl_5, styles.pr_5, styles.sm_label, styles.gray_label, index === 0 && styles.sred_label]}>{'全部'}</Text>
                                    </TouchableOpacity>
                                    {this.cate_arr.map((item, idx) => {

                                        return (
                                            <TouchableOpacity style={styles.catePerBox} key={'i' + idx} onPress={()=>{this.setState({index:idx+1,category_id:item.categoryId},this._onHeaderRefresh)}}>
                                                <Text style={[styles.pl_5, styles.pr_5, styles.sm_label, styles.gray_label, index==idx+1 && styles.sred_label]}>{item.categoryName}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                            : null
                    }
                </View>

                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.item}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />

                <ActionButton buttonColor="#F4623F"
                    size={55}
                    position='right'
                    style={{ position: 'absolute', bottom: 40 }}
                    renderIcon={() => (
                        <TouchableOpacity style={[styles.fd_c, styles.jc_ct, styles.ai_ct]} onPress={() => this.onAction('AskQust')}>
                            <Image source={asset.edit_icon} style={[styles.edit_icon]} />
                            <Text style={[styles.default_label, styles.white_label, styles.mt_2]}>提问</Text>
                        </TouchableOpacity>
                    )}
                >
                </ActionButton>

                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    search_input: {
        height: 30,
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
    },
    search_icon: {
        width: 16,
        height: 16,
    },
    search_text: {
        height: 20,
    },
    msg_icon: {
        width: 20,
        height: 18,
    },
    left_icon: {
        width: 10,
        height: 17,
    },
    edit_icon: {
        width: 17,
        height: 17,
    },
    ad_img: {
        width: theme.window.width * 0.9,
        height: 135,
        borderRadius: 8
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
    live_box: {
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'rgba(233,233,233, 1.0)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
        borderRadius: 8
    },
});

export const LayoutComponent = Ask;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        channel: state.ask.channel,
        advert: state.site.advert,
        category: state.ask.category,
    };
}
