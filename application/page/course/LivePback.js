import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import _ from 'lodash';
import Picker from 'react-native-picker';

import RefreshListView, { RefreshState } from '../../component/RefreshListView';
import HudView from '../../component/HudView';
import VodCell from '../../component/cell/VodCell';

import { theme, iconMap } from '../../config';

import { liveday } from '../../util/common'

class LivePback extends Component {
    static navigationOptions = {
        title: '直播回放',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.liveSlist = [];
        this.live = [];
        this.page = 0;
        this.totalPage = 0;

        this.state = {
            status: 0,
            sort: 0,
            a_Index: 0, //  
            b_Index: 0,
            d_Index: 0,
            a_List: ['全部'], // 
            b_List: ['课程回放', '活动回放'], // 
            d_List: ['最新', '最热'], //
            areas: ['全部'],
            area: '全部',
            region: [],
            regionId: 0,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._renderLive = this._renderLive.bind(this);

    }

    componentDidMount() {
        const { navigation, actions } = this.props;
        this._onHeaderRefresh()
        actions.course.live(-1, 0, 0, 0);
    }

    componentWillReceiveProps(nextProps) {
        const { user, liveback, live } = nextProps;

        if (liveback !== this.props.liveback) {

            this.liveSlist = this.liveSlist.concat(liveback.items);
            this.page = liveback.page;
            this.totalPage = liveback.pages;

        }

        if (live !== this.props.live) {
            this.live = live.items.concat(live.items);
        }


        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }

    componentWillUnmount() {
        Picker.hide();
    }


    _onRefresh() {
        const { actions } = this.props;
        actions.user.user();

    }
    getRegion = () => {
        const { actions } = this.props
        actions.user.getRegion({
            resolved: (res) => {
                if (res.length > 0) {
                    let lst = this.state.areas
                    res.map(item => {
                        lst.push(item.regionName)
                    })
                    this.setState({
                        areas: lst,
                        region: res
                    })
                }
            },
            rejected: (err) => {

            }
        })
    }
    _onHeaderRefresh() {
        const { actions } = this.props;

        const { sort } = this.state;

        this.liveSlist = [];
        this.page = 0;
        let ctype = 2
        if (this.state.b_Index == 1) {
            ctype = 52
        }
        actions.course.liveback(ctype, 1, sort, this.page, this.state.regionId);
        this.getRegion()

        this.setState({ refreshState: RefreshState.HeaderRefreshing });
    }

    _onFooterRefresh() {
        const { actions } = this.props;
        const { sort } = this.state;

        if (this.page < this.totalPage-1) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page = this.page + 1;
            let ctype = 2
            if (this.state.b_Index == 1) {
                ctype = 52
            }
            actions.course.liveback(ctype, 1, sort, this.page, this.state.regionId);

        }
        else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }
    }


    _renderItem(item) {
        const { navigation } = this.props
        const course = item.item
        return (
            <View style={[styles.p_5,styles.bg_white]}>
                <VodCell course={course} key={'recomm_' + course.courseId}
                    onPress={(course) => navigation.navigate('Vod', { course: course })}
                />
            </View>
        )
    }
    _onBook = (course) => {
        const { user, navigation, actions } = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            actions.course.book({
                course_id: course.courseId,
                resolved: (data) => {
                    this.refs.hud.show('预约成功', 1);
                    actions.course.live(-1, 0, 0, 0);

                    this.setState({
                        isLive: true,
                    })
                },
                rejected: (msg) => {

                }
            })
        }
    }

    _onSelect = () => {

        const { a_Index, a_List } = this.state;

        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '地区',
            pickerData: this.state.areas,
            selectedValue: [this.state.types],
            onPickerConfirm: pickedValue => {
                console.log(pickedValue[0])
                let id = 0
                let area = pickedValue[0]
                let lst = this.state.areas.filter(item => item == area).length
                if (pickedValue[0] == '全部' || lst == 0) {
                    area = '全部'
                    id = 0
                } else {
                    id = this.state.region.filter(item => item.regionName == pickedValue)[0].regionId
                }
                this.setState({
                    area: area,
                    regionId: id
                }, () => {
                    this._onHeaderRefresh()
                })
            },
        });

        Picker.show();

    }
    _onSelects = () => {

        const { b_Index, b_List } = this.state;

        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '回放类型',
            pickerData: b_List,
            selectedValue: [b_List[b_Index]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < b_List.length; i++) {
                    if (pickedValue[0] === b_List[i]) {
                        this.setState({
                            b_Index: i,
                        }, () => {
                            this._onHeaderRefresh()
                        });
                    }
                }
            },
        });

        Picker.show();

    }
    _onSelectss = () => {

        const { d_Index, d_List } = this.state;

        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '类型',
            pickerData: d_List,
            selectedValue: [d_List[d_Index]],
            onPickerConfirm: pickedValue => {
                for (let i = 0; i < d_List.length; i++) {
                    if (pickedValue[0] === d_List[i]) {
                        this.setState({
                            d_Index: i,
                            sort: i,
                        }, () => {
                            this._onHeaderRefresh()
                        });
                    }
                }
            },
        });

        Picker.show();

    }


    _renderLive(course) {
        const { navigation } = this.props;

        return (
            <TouchableOpacity style={[styles.livecons, styles.p_15, styles.bg_white, styles.circle_5]}
                onPress={() => navigation.navigate(course.ctype == 52 ? 'ActiveLive' : 'Live', { course: course })}>
                <View style={[styles.fd_r, styles.jc_sb, styles.pb_10, styles.border_bt]}>
                    {
                        course.liveStatus === 0 && course.roomStatus === 0 ?
                            <Text style={[styles.gray_label, styles.sm_label]}>{liveday(course.beginTime)} </Text>
                            : null}
                    {
                        course.liveStatus === 1 && course.roomStatus === 2 ?
                            <Text style={[styles.red_label, styles.sm_label]}>直播中</Text>
                            : null}

                    {
                        (course.liveStatus === 2 && course.roomStatus === 0) || (course.liveStatus === 2 && course.roomStatus === 1) ?
                            <Text style={[styles.gray_label, styles.sm_label]}>休息中</Text>
                            : null}
                    {
                        course.liveStatus === 2 && course.roomStatus === 3 ?
                            <Text style={[styles.red_label, styles.sm_label]}>已结束</Text>
                            : null}

                    {
                        course.liveStatus === 0 && course.roomStatus === 0 ?
                            <Text style={[styles.sm_label, styles.tip_label]}>{course.bookNum + '人已预约'}</Text>
                            :
                            <Text style={[styles.sm_label, styles.tip_label]}>{course.hit + '人在线'}</Text>
                    }
                </View>
                <View style={[styles.pt_10]}>
                    <Text style={[styles.c33_label, styles.lg_label, styles.fw_label]}>{course.courseName}</Text>
                    <View style={[styles.fd_r, styles.jc_sb, styles.pt_5, styles.ai_end]}>
                        <Text style={[styles.sm_label, styles.gray_label, styles.live_summary]}>{course.summary}</Text>
                        {
                            course.liveStatus === 0 && course.roomStatus === 0 && !course.book ?
                                <TouchableOpacity style={[styles.live_ofbtn]} onPress={() => this._onBook(course)} disabled={course.book}>
                                    <Text style={[styles.sm_label, styles.white_label]}>预约</Text>
                                </TouchableOpacity>
                                :
                                <View style={[styles.live_btn]}>
                                    <Text style={[styles.sm_label, styles.red_label]}>进入</Text>
                                </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }



    render() {
        const { loginStatus, cacheSize, unit, a_Index, b_Index, d_Index, a_List, b_List, d_List } = this.state;

        return (
            <View style={[styles.container]}>
                <View style={[styles.pl_15, styles.pr_15, styles.recomm]}>
                    <View style={[styles.popularItem, styles.mt_20]}>
                        <ScrollView
                            scrollX
                            horizontal={true}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                this.live.map((good, index) => {
                                    return (
                                        <View style={[styles.mr_8, styles.live_cons]} >
                                            {this._renderLive(good)}
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.mt_15, styles.mr_15, styles.ml_15, styles.fd_r]}>
                    <TouchableOpacity style={[styles.item_h, styles.col_1, styles.bg_white, styles.circle_5, styles.fd_r, styles.jc_sb, styles.ai_ct]}
                        onPress={this._onSelect}
                    >
                        <Text style={[styles.default_label, styles.gray_label, styles.pl_15]}>{this.state.area}</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.default_label, styles.pr_10]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.item_h, styles.col_1, styles.bg_white, styles.ml_25, styles.circle_5, styles.fd_r, styles.jc_sb, styles.ai_ct]}
                        onPress={this._onSelects}
                    >
                        <Text style={[styles.default_label, styles.gray_label, styles.pl_15]}>{b_List[b_Index]}</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.default_label, styles.pr_10]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.item_h, styles.col_1, styles.bg_white, styles.ml_25, styles.circle_5, styles.fd_r, styles.jc_sb, styles.ai_ct]}
                        onPress={this._onSelectss}
                    >
                        <Text style={[styles.default_label, styles.gray_label, styles.pl_15]}>{d_List[d_Index]}</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.default_label, styles.pr_10]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                </View>

                <RefreshListView
                    style={[styles.pb_50, styles.pl_12, styles.pr_12, styles.pt_15]}
                    showsVerticalScrollIndicator={false}
                    data={this.liveSlist}
                    exdata={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    item_h: {
        height: 36,
    },
    live_box: {
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'rgba(233,233,233, 1.0)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    livecons: {
        borderRadius: 5,
        backgroundColor: '#ffffff',
        shadowOffset: { width: 0, height: 3 },
        shadowColor: 'rgba(240,240,240,1)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    live_btn: {
        borderWidth: 1,
        borderColor: '#F4623F',
        borderStyle: 'solid',
        width: 54,
        height: 23,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    live_ofbtn: {
        width: 54,
        height: 23,
        borderRadius: 5,
        backgroundColor: '#F4623F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow_right: {
        width: 6,
        height: 11,
        marginLeft: 5
    },
    live_cons: {
        width: 300,
    }
});

export const LayoutComponent = LivePback;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
        liveback: state.course.liveback,
        live: state.course.live,
    };
}
