import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

import RefreshListView, { RefreshState } from '../../component/RefreshListView';
import GoodsCell from '../../component/cell/GoodsCell'
import * as  DataBase from '../../util/DataBase';
import asset from '../../config/asset';
import theme from '../../config/theme';
import { reduce } from 'lodash';
import key from '../../redux/key';

class MailSearch extends Component {

    static navigationOptions = {
        title: '严选商城',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props
        this.keyword = navigation.getParam('keyword', '电脑');

        this.items = [];
        this.itemtype = null;
        this.page = 0;
        this.totalPage = 1;
        this.hotList = [];
        this.state = {
            keyword: this.keyword,
            refreshState: RefreshState.Idle,
            stat: 0,
            historyList: [],
            historyLists: [],
            historyType:0
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

    }

    componentDidMount() {
        const { actions } = this.props
        actions.site.config();
        this._getHistory();
    }

    componentWillReceiveProps(nextProps) {
        const { shopSearch, config } = nextProps;
        if (shopSearch !== this.props.shopSearch) {

            this.items = this.items.concat(shopSearch.items);
            this.page = shopSearch.page;
            this.totalPage = shopSearch.pages;

        }
        if (config !== this.props.config) {
            let lst = []
            lst = config.search_goods_hot.split('|')
            this.hotList = lst
        }

        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }

    componentWillUnmount() {

    }
    _getHistory=()=>{
        // 查询本地历史
        DataBase.getItem('mallHistory').then(data => {
            if (data == null) {
                this.setState({
                    historyList: [],
                });
            } else {
                this.setState({
                    historyList: data.slice(0, 3),
                });
            }
        });
    }
    _getkeywordHis=(keyword)=>{
        const { historyList } = this.state;
        if (keyword.length > 0) {
            if (historyList.indexOf(keyword) !== -1) {

                let index = historyList.indexOf(keyword);
                historyList.splice(index, 1);
                historyList.unshift(keyword);
                DataBase.setItem('mallHistory', historyList);

            } else {
                // 本地历史 无 搜索内容
                historyList.unshift(keyword);
                DataBase.setItem('mallHistory', historyList);
            }
        }

    }
    //展示全部记录
    _allSearch=()=>{
        DataBase.getItem('mallHistory').then(data => {
            if (data == null) {
                this.setState({
                    historyList: [],
                });
            } else {
                this.setState({
                    historyList: data,
                });
            }
        });
        this.setState({
            historyType: 1,
        });
    }
    _liteSearch=(type)=>{

        let { historyList } = this.state;
        this.setState({
            historyList: historyList.slice(0, 3),
            historyType: 0,
        });
    }
    //删除单个历史记录
    _deteHistory=(item, index)=>{
        const { historyList, historyType } = this.state;

        if (historyType === 0) {
            DataBase.getItem('mallHistory').then(data => {
                if (data == null) {
                    this.setState({
                        historyList: [],
                    });
                } else {
                    let perhis = data;
                    perhis.splice(index, 1);
                    this.setState({
                        historyList: perhis.slice(0, 3),
                        historyType: 0,
                    });
                    DataBase.setItem('mallHistory', perhis);
                }
            });
        } else {
            historyList.splice(index, 1);
            this.setState({
                historyList: historyList,
                historyType: 1,
            });
            DataBase.setItem('mallHistory', historyList);
        }
    }

    //全部清空搜索记录
    _allDelete=()=>{
        this.setState({
            historyList: [],
        });
        DataBase.setItem('mallHistory', []);
    }

    _onHeaderRefresh() {
        const { actions } = this.props;
        const { keyword } = this.state;

        this.items = [];
        this.page = 0;

        actions.mall.shopSearch(keyword, this.page);
        this.setState({
            stat: 1
        })
    }

    _onFooterRefresh() {
        const { actions } = this.props;
        const { keyword } = this.state;

        if (this.page < this.totalPage) {

            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page = this.page + 1;

            actions.mall.shopSearch(keyword, this.page);

        }
        else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
        this.setState({
            stat: 1
        })
    }
    _onSearch=()=>{
        const { actions } = this.props;
        const { keyword } = this.state;

        this.items = [];
        this.page = 0;

        actions.mall.shopSearch(keyword, this.page);
        this.setState({
            stat: 1
        })
    }
    _renderItem(item) {

        const { navigation } = this.props;
        const good = item.item;
        const index = item.index;
        const on = index % 2 === 1;

        return (
            <View style={[on && styles.ml_12]}>
                <GoodsCell style={{ width: (theme.window.width - 48) / 2 }} good={good} type={3} btype={1} etype={1} itype={0}
                    onPress={(good) => navigation.navigate('MailDetail', { cate: good })}
                />
            </View>
        )
    }


    render() {

        const { keyword, stat,historyList,historyType } = this.state;
        return (
            <View style={styles.container}>
                <View style={[styles.bg_white, styles.fd_r, styles.ai_ct, styles.pl_15, styles.pb_15, styles.pr_15, styles.pt_12, styles.jc_ct]}>
                    <View style={[styles.searchleft, styles.fd_r, styles.ai_ct, styles.col_1]}>
                        <Image source={asset.search} style={[styles.s_img]} />
                        <TextInput
                            style={[styles.ml_10, styles.col_1, styles.input]}
                            placeholder={keyword}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            blurOnSubmit={true}
                            returnKeyType='search'
                            autoCapitalize={'none'}
                            placeholderTextSize={12}

                            value={keyword}
                            keyboardType={'default'}
                            onSubmitEditing={this._onSearch}
                            onChangeText={(text) => { this.setState({ keyword: text, }); }}
                        />
                    </View>
                    <TouchableOpacity style={[styles.searchbtn, styles.ai_ct, styles.fd_r, styles.jc_ct]} onPress={this._onSearch}>
                        <Text style={[styles.black_label, styles.default_label]}>搜索</Text>
                    </TouchableOpacity>
                </View>
                {stat === 0 ?
                    <View>
                        <View style={[styles.search_his, styles.mt_15]}>
                            {
                                historyList.length > 0 ?
                                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.jc_fe, styles.ai_ct, styles.pb_5, styles.pr_15]}
                                        onPress={this._allDelete}
                                    >
                                        <Text style={[styles.default_label, styles.tip_label]}>清除历史</Text>
                                    </TouchableOpacity>
                                    : null}
                            {
                                historyList && historyList.map((item, index) => {
                                    return (
                                        <View key={'item' + index} style={[styles.p_15, styles.fd_r, styles.jc_sb, styles.ai_ct, styles.border_bt]}>
                                            <TouchableOpacity onPress={() => { this.setState({ keyword: item}, this._onSearch)}} style={[styles.col_1]}>
                                                <Text style={[styles.default_label, styles.tip_label]}>{item}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this._deteHistory(item, index)}>
                                                <Image source={asset.dete_icon} style={[styles.dete_icon]} />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })
                            }
                            {
                                historyList.length > 0 ?
                                    <View>
                                        {
                                            historyType === 0 ?
                                                <TouchableOpacity style={[styles.d_flex, styles.jc_ct, styles.ai_ct, styles.pt_15, styles.pb_15]} onPress={() => this._allSearch(this, 0)}>
                                                    <Text style={[styles.sm_label, styles.gray_label]}>全部搜索记录</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={[styles.d_flex, styles.jc_ct, styles.ai_ct, styles.pt_15, styles.pb_15]} onPress={() => this._liteSearch(this, 1)}>
                                                    <Text style={[styles.sm_label, styles.gray_label]}>收回全部搜索记录</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    : null}
                        </View>
                        <View style={[styles.search_box, styles.fd_c, styles.ml_20, styles.mr_20]}>
                            <Text style={[styles.lg_label, styles.pt_15, styles.pb_20, styles.c33_label, styles.fw_label]}>热门搜索</Text>
                            <View style={[styles.search_hot, styles.fd_r]}>
                                {
                                    this.hotList.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={[styles.search_item]} key={'item' + index} onPress={() => {
                                                this.setState({
                                                    keyword: item
                                                }, this._onSearch)
                                            }}>
                                                <Text style={[styles.sm_label, styles.sred_label]}>{item}</Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                        <RefreshListView
                            contentContainerStyle={[styles.mt_10]}
                            showsVerticalScrollIndicator={false}
                            data={this.items}
                            exdata={this.state}
                            count={2}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this._onHeaderRefresh}
                            onFooterRefresh={this._onFooterRefresh}
                        />
                    </View>
                }
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
    search_box: {
        borderTopColor: '#FAFAFA',
        borderTopWidth: 5,
        borderStyle: 'solid',
    },
    search_his: {
        borderBottomColor: '#F5F5F5',
        borderBottomWidth: 10,
        borderStyle: 'solid'
    },
    s_img: {
        width: 16,
        height: 16,
    },
    dete_icon:{
        width:16,
        height:16,
    },
    searchleft: {
        height: 30,
        backgroundColor: '#f5f5f5',
        paddingLeft: 12,
        borderRadius: 5,
    },
    input: {
        paddingVertical: 0,
    },
    searchbtn: {
        width: 40,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
    },
    search_hot: {
        flexWrap: 'wrap',
    },
    search_item: {
        paddingBottom: 2,
        paddingTop: 2,
        paddingLeft: 14,
        paddingRight: 14,
        marginRight: 5,
        marginBottom: 10,
        borderRadius: 15,
        borderColor: '#F4623F',
        borderWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export const LayoutComponent = MailSearch;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        shopSearch: state.mall.shopSearch,
        config: state.site.config
    };
}
