import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import RefreshListView, { RefreshState } from '../../component/RefreshListView';

import Tabs from '../../component/Tabs';
import ActivityCell from '../../component/cell/ActivityCell';
import ProjectCell from '../../component/cell/ProjectCell';

import { theme } from '../../config';

class Find extends Component {

    static navigationOptions = {
        title: '发现',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.articleList = [];
        this.specialList = [];
        this.o2olist = []
        this.page = 0;
        this.totalPage = 1;

        this.state = {
            status: 0,
            now: 0,
            isRefreshing: false,

        };

        this._onSelect = this._onSelect.bind(this);

        this._contentViewScroll = this._contentViewScroll.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onRefresh_time = this._onRefresh_time.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        const { project, activity, o2o } = nextProps;

        if (activity !== this.props.activity) {
            if (activity.page == 0) {
                this.articleList = activity.items;

                this.page = activity.page;
                this.totalPage = activity.pages;
            } else {
                this.articleList = this.articleList.concat(activity.items);

                this.page = activity.page;
                this.totalPage = activity.pages;
            }

        }

        if (project !== this.props.project) {
            this.specialList = this.unique(this.specialList.concat(project.items));

            this.page = project.page;
            this.totalPage = project.pages;
        }
        if (o2o !== this.props.o2o) {
            if (o2o.page == 0) {
                if (o2o.items.length > 0) {
                    this.o2olist = o2o.items;
                }
            } else {
                if (o2o.items.length > 0) {
                    this.o2olist = this.o2olist.concat(o2o.items);
                }
            }

        }

    }


    componentDidMount() {

        this._onRefresh();

        this._onRefresh_time();
    }



    _onSelect = (index) => {

        this._onRefresh_time();
        this.page = 0
        this.totalPage = 1
        this.articleList = []
        this.specialList = []
        this.o2olist = []
        this.setState({
            status: index
        }, () => {
            this._onRefresh()
        })
    }

    _onRefresh_time() {

        const now = new Date();
        this.setState({
            now: now.getTime()
        })
    }

    _onRefresh() {

        const { actions } = this.props;
        const { status } = this.state;

        this.page = 0

        this.articleList = []
        this.specialList = []
        this.o2olist = []

        this._onRefresh_time();

        if (status === 0) {
            actions.find.activity('', 0, 100);
            actions.train.o2o(8, 0)
        } else {
            actions.find.project(0);
        }

    }


    _contentViewScroll = (e) => {

        const { actions } = this.props;
        const { status } = this.state

        if (this.page < this.totalPage - 1) {
            this.setState({ refreshState: RefreshState.FooterRefreshing });

            this.page = this.page + 1;

            if (status === 0) {
                actions.find.activity('', this.page, 100);
                actions.train.o2o(8, this.page)
            } else if (status === 1) {
                actions.find.project(this.page);
            }

        }
        else {
            this.setState({ refreshState: RefreshState.NoMoreData });
        }

    }
    compares = (property) => {
        return function (obj1, obj2) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value2 - value1;     // 降序
        }
    }
    onpress = (article) => {
        let arr = Object.keys(article).includes('squadId')
        if (!arr) {
            this.props.navigation.navigate('Activity', { activity: article })
        } else {
            this.props.navigation.navigate('MyTranDetail', { o2o: article, stype: article.stype })
        }
    }
    unique = (arr) => {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i].articleId == arr[j].articleId) {         //第一个等同于第二个，splice方法删除第二个
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }
    render() {
        const { navigation } = this.props;
        const { status, now } = this.state;

        let act_bgn = [];  // 进行中
        let act_end = [];   // 结束
        let act_N_bgn = [];  // 未开始
        let lists = this.articleList.concat(this.o2olist)
        // for(let i = 0 ; i < this.articleList.length ; i++){
        //     if(now < this.articleList[i].beginTime * 1000){

        //         act_N_bgn.push(this.articleList[i])

        //     } else if(now > this.articleList[i].beginTime * 1000  &&  now < this.articleList[i].endTime * 1000 ){
        //         act_bgn.push(this.articleList[i])
        //     } else {
        //         act_end.push(this.articleList[i])
        //     }
        // }
        var nowTime = new Date();
        let nowdate = nowTime.getTime()
        let beg = []
        let ins = []
        let ends = []
        for (let i = 0; i < lists.length; i++) {
            if (nowdate < lists[i].startTime * 1000) {
                act_N_bgn.push(lists[i])
                beg = act_N_bgn.sort(this.compares("startTime"))
                beg.map((item, index) => {
                    if (item.isRecomm == 1) {
                        let arr = beg
                        let itm = arr.splice(index, 1)
                        arr.splice(0, 0, itm[0])
                        beg = arr
                    }

                })
            } else if (nowdate > lists[i].startTime * 1000 && nowdate < lists[i].endTime * 1000) {
                act_bgn.push(lists[i])
                ins = act_bgn.sort(this.compares("startTime"))
                ins.map((item, index) => {
                    if (item.isRecomm == 1) {
                        let arr = ins
                        let itm = arr.splice(index, 1)
                        arr.splice(0, 0, itm[0])
                        ins = arr
                    }

                })
            } else {
                act_end.push(lists[i])
                ends = act_end.sort(this.compares("endTime"))
                ends.map((item, index) => {
                    if (item.isRecomm == 1) {
                        let arr = ends
                        let itm = arr.splice(index, 1)
                        arr.splice(0, 0, itm[0])
                        ends = arr
                    }

                })
            }
        }
        return (
            <View style={[styles.rankList]}>
                <View style={[styles.atabs]}>
                    <Tabs items={['活动', '专题']} atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this._contentViewScroll}
                    ref={(r) => this.scrollview = r}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            tintColor="#2c2c2c"
                            title="刷新中..."
                            titleColor="#2c2c2c"
                            colors={['#2c2c2c', '#2c2c2c', '#2c2c2c']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    {
                        status === 0 ?
                            <View style={[styles.p_10, styles.mb_20]}>
                                {
                                    ins.length > 0 ?
                                        <View>
                                            <View style={[styles.pb_10]}>
                                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>进行中</Text>
                                            </View>
                                            {
                                                ins.length > 0 && ins.map((findt, index) => {
                                                    const on = ins.length === index + 1;
                                                    return (
                                                        <ActivityCell activity={findt} type={on} onPress={(findt) => this.onpress(findt)} key={'findt' + index} />
                                                    )
                                                })
                                            }
                                        </View>
                                        : null}
                                {
                                    beg.length > 0 ?
                                        <View>
                                            <View style={[styles.pb_10, (act_bgn.length > 0) && styles.article_top]}>
                                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>未开始</Text>
                                            </View>
                                            {
                                                beg.length > 0 && beg.map((findt, index) => {

                                                    const on = beg.length === index + 1;

                                                    return (
                                                        <ActivityCell activity={findt} type={on} onPress={(findt) => this.onpress(findt)} key={'findt' + index} />
                                                    )
                                                })
                                            }
                                        </View>
                                        : null}

                                {
                                    ends.length > 0 ?
                                        <View>
                                            <View style={[styles.pb_10, (act_N_bgn.length > 0 || act_bgn.length > 0) && styles.article_top]}>
                                                <Text style={[styles.default_label, styles.c33_label, styles.fw_label]}>已结束</Text>
                                            </View>
                                            {
                                                ends.length > 0 && ends.map((findt, index) => {

                                                    const on = ends.length === index + 1;
                                                    return (
                                                        <ActivityCell activity={findt} type={on} onPress={(findt) => this.onpress(findt)} key={'findt' + index} />
                                                    )
                                                })
                                            }
                                        </View>
                                        : null}

                            </View>
                            :
                            <View style={[styles.p_10]}>
                                <View>
                                    <Text style={[{ fontSize: 16 }, styles.mb_20, styles.mt_5]}>热门专题</Text>
                                </View>
                                {
                                    this.specialList && this.specialList.map((specia, index) => {

                                        const on = this.specialList.length === index + 1;

                                        return (
                                            <ProjectCell project={specia} ctype={on} key={'specia' + index} onPress={(specia) => navigation.navigate('Project', { project: specia })} />
                                        )
                                    })
                                }
                            </View>
                    }
                </ScrollView>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    atabs: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#f1f1f1',
        backgroundColor: '#ffffff'
    },
    article_top: {
        paddingTop: 20,
        borderTopColor: '#f0f0f0',
        borderTopWidth: 1,
        borderStyle: 'solid'
    }
});

export const LayoutComponent = Find;

export function mapStateToProps(state) {
    return {
        activity: state.find.activity,
        project: state.find.project,
        o2o: state.train.o2o,
    };
}
