import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextInput,Text } from 'react-native';

import _ from 'lodash';
import RefreshListView, { RefreshState } from '../../component/RefreshListView';
import * as  DataBase from '../../util/DataBase';
import HudView from '../../component/HudView';
import AskCell from '../../component/cell/AskCell'
import AskRecmCell from '../../component/cell/AskRecmCell'
import { asset, theme } from '../../config';

class AskSearch extends Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        statusBarHeight: global.statusBarHeight, //状态栏的高度
        navHeight: global.navHeight,
        keyword: '',
        refreshState: RefreshState.Idle,
        stat: 0,
        historyList: [],
        historyLists: [],
        historyType: 0
    }

    page = 0
    pages = 1
    item = []

    componentWillReceiveProps(nextProps) {
        const { channel } = nextProps;

        if (channel !== this.props.channel) {
            this.pages = channel.pages
            this.item = this.item.concat(channel.items)
        }

        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }
    componentDidMount() {
        const { actions } = this.props
        this._getHistory();
    }
    _getHistory = () => {
        // 查询本地历史
        DataBase.getItem('askHistory').then(data => {
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
    _getkeywordHis = (keyword) => {
        const { historyList } = this.state;
        if (keyword.length > 0) {
            if (historyList.indexOf(keyword) !== -1) {

                let index = historyList.indexOf(keyword);
                historyList.splice(index, 1);
                historyList.unshift(keyword);
                DataBase.setItem('askHistory', historyList);

            } else {
                // 本地历史 无 搜索内容
                historyList.unshift(keyword);
                DataBase.setItem('askHistory', historyList);
            }
        }

    }
    //展示全部记录
    _allSearch = () => {
        DataBase.getItem('askHistory').then(data => {
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
    _liteSearch = (type) => {

        let { historyList } = this.state;
        this.setState({
            historyList: historyList.slice(0, 3),
            historyType: 0,
        });
    }
    //删除单个历史记录
    _deteHistory = (item, index) => {
        const { historyList, historyType } = this.state;

        if (historyType === 0) {
            DataBase.getItem('askHistory').then(data => {
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
                    DataBase.setItem('askHistory', perhis);
                }
            });
        } else {
            historyList.splice(index, 1);
            this.setState({
                historyList: historyList,
                historyType: 1,
            });
            DataBase.setItem('askHistory', historyList);
        }
    }

    //全部清空搜索记录
    _allDelete = () => {
        this.setState({
            historyList: [],
        });
        DataBase.setItem('askHistory', []);
    }
    _onHeaderRefresh = () => {
        const { actions } = this.props;
        const { keyword } = this.state;

        this.page = 0
        this.pages = 1
        this.item = []

        actions.ask.channel(0, keyword, 0, 0)

        this.setState({ refreshState: RefreshState.HeaderRefreshing});
    }
    _onSearch = () => {
        const { actions } = this.props;
        const { keyword } = this.state;

        this.page = 0
        this.pages = 1
        this.item = []

        actions.ask.channel(0, keyword, 0, 0)
        this._getkeywordHis(keyword);
        this.setState({ refreshState: RefreshState.HeaderRefreshing, stat: 1 });
    }
    _onFooterRefresh = () => {
        const { actions } = this.props;
        const { keyword } = this.state;

        if (this.page < this.pages) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page++;

            actions.ask.channel(0, keyword, this.page, 0)
        } else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
    }


    _renderItem = (item) => {
        const { navigation } = this.props;
        const ask = item.item

        return (
            <AskRecmCell ask={ask} onPress={() => navigation.navigate('Question', { ask: ask })} />
        )

    }

    render() {
        const { navigation } = this.props;
        const { statusBarHeight, keyword, historyList, historyLists, historyType } = this.state;

        return (
            <View style={styles.container}>
                <View style={{ paddingTop: statusBarHeight, backgroundColor: '#ffffff' }}>
                    <View style={[styles.fd_r, styles.ai_ct, styles.pl_15, styles.pr_15, styles.pt_12, styles.pb_12, styles.jc_ct, styles.header]}>
                        <TouchableOpacity style={[styles.pl_10, styles.pr_10]} onPress={() => navigation.goBack()}>
                            <Image source={asset.left_arrows} style={[styles.left_icon]} />
                        </TouchableOpacity>
                        <View style={[styles.search, styles.fd_r, styles.ai_ct, styles.col_1, styles.pl_10, styles.mr_20, styles.ml_5]}
                        >
                            <Image source={asset.search} style={[styles.search_icon]} />
                            <TextInput defaultValue={keyword} 
                            placeholder={'搜索问题'} 
                            style={[styles.search_input]} 
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            blurOnSubmit={true}
                            returnKeyType='search'
                            autoCapitalize={'none'}
                            placeholderTextSize={12}
                            keyboardType={'default'}
                            onChangeText={(text) => { this.setState({ keyword: text }); }} />
                        </View>
                        <TouchableOpacity style={[styles.searchbtn, styles.ai_ct, styles.fd_r, styles.jc_ct]} onPress={this._onSearch} disabled={keyword.length == 0}>
                            <Image source={asset.search} style={[styles.msg_icon]} />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.stat === 0 ?
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
                                            <TouchableOpacity onPress={() => { this.setState({ keyword: item }, this._onSearch) }} style={[styles.col_1]}>
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
                        :
                        <View style={[styles.wrap, styles.bg_white, styles.pl_15, styles.pr_15]}>
                            <RefreshListView
                                showsVerticalScrollIndicator={false}
                                data={this.item}
                                extraData={this.state}
                                renderItem={this._renderItem}
                                refreshState={this.state.refreshState}
                                onHeaderRefresh={this._onHeaderRefresh}
                                onFooterRefresh={this._onFooterRefresh}
                            />
                        </View>
                }


                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    tabs: {
        backgroundColor: '#ffffff',
    },
    search: {
        height: 34,
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
    },
    search_icon: {
        width: 16,
        height: 16,
    },
    search_input: {
        width: '90%',
        flex: 1,
        paddingVertical: 0,
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
    header: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#FAFAFA',
    },
    item: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#F0F0F0',
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
    search_his: {
        borderBottomColor: '#F5F5F5',
        borderBottomWidth: 10,
        borderStyle: 'solid'
    },
    dete_icon:{
        width:16,
        height:16,
    },
});

export const LayoutComponent = AskSearch;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        channel: state.ask.channel,
    };
}
