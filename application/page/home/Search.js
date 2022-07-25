import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Linking, Alert } from 'react-native';


import * as  DataBase from '../../util/DataBase';
import { learnNum } from '../../util/common';

import VodCell from '../../component/cell/VodCell';
import GraphicCell from '../../component/cell/GraphicCell';
import ArticleCell from '../../component/cell/ArticleCell';

import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';

import * as WeChat from 'react-native-wechat-lib';

class Search extends Component {
    static navigationOptions = {
        title: '油葱学堂',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props
        this.keyword = navigation.getParam('keyword', '');

        this.courserecom = [];
        this.vcourseList = [];
        this.vcourseTotal = [];

        this.state = {
            keyword: '',
            p_keyword: this.keyword,
            search_hot: '',
            search_def: '',
            searchhot: [],
            type: 0,

            historyType: 0,
            historyList: [],
            historyLists: [],
            atabs: ['最新发布', '最多播放'],
            status: 0,

            vcourseList: [], // 视频
            vcourseTotal: 0,
            acourseList: [], // 图文
            acourseTotal: 0,
            articleList: [], // 资讯
            articleTotal: 0,
            audioList: [], // 音频
            audioTotal: 0,
            replayList: [], // 回放
            replayTotal: 0,
            teacherList: [],
            teacherTotal: 0,

        };

        this._onSearch = this._onSearch.bind(this);
        this._onHot = this._onHot.bind(this);
        this._deteHistory = this._deteHistory.bind(this);
        this._liteSearch = this._liteSearch.bind(this);
        this._allDelete = this._allDelete.bind(this);
        this._update_recom = this._update_recom.bind(this);
        this._onSelect = this._onSelect.bind(this);

        this._onLink = this._onLink.bind(this);
        this._toWxchat = this._toWxchat.bind(this);

        this._onLect = this._onLect.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        const { config, courserecom, search } = nextProps;
        if (config !== this.props.config) {
            if (config.search_def.length > 0) {
                let searchdefult = config.search_def.split('|');
                let searchhot = config.search_hot.split('|');
                // let inputxt = searchdefult[Math.floor(Math.random() * searchdefult.length)];
                this.setState({
                    // keyword:inputxt,
                    search_hot: config.search_hot,
                    search_def: config.search_def,
                    searchhot: searchhot,
                });
            }
        }

        if (courserecom !== this.props.courserecom) {
            this.courserecom = courserecom;
        }

        if (search !== this.props.search) {

            let acourseList = search.acourse.items;
            let acourseTotal = search.acourse.total;

            let articleList = search.article.items;
            let articleTotal = search.article.total;

            let replayList = search.replaycourse.items;
            let replayTotal = search.replaycourse.total;

            let teacherList = search.teacher.items;
            let teacherTotal = search.teacher.total;

            let audioList = search.audiocourse.items;
            let audioTotal = search.audiocourse.total;

            // let activityList = search.activity.items
            // let activityTotal = search.activity.total
            // let specialList = search.special.items
            // let specialTotal = search.special.total
            // let o2oList = search.o2o.items
            // let o2oTotal = search.o2o.total


            let vcourseList = search.vcourse.items;
            let vcourseTotal = search.vcourse.total;

            if (vcourseList.length > 0 || articleList.length > 0 || replayList.length > 0 || teacherList.length > 0 || audioList.length > 0) {
                this.setState({
                    type: 2,
                });
            } else {
                this.setState({
                    type: 1,
                }, () => {
                    this._update_recom();
                });
            }
            this.setState({
                acourseList: acourseList,
                acourseTotal: acourseTotal,

                vcourseList: vcourseList,
                vcourseTotal: vcourseTotal,

                articleList: articleList,
                articleTotal: articleTotal,

                replayList: replayList,
                replayTotal: replayTotal,

                teacherList: teacherList,
                teacherTotal: teacherTotal,

                audioList: audioList,
                audioTotal: audioTotal,

                p_keyword: '',
            });
        }

    }

    componentWillMount() {

        const { navigation } = this.props
        const { params } = navigation.state

        this.setState({
            p_keyword: params.keyword
        })
    }

    componentDidMount() {
        const { actions } = this.props;
        this._getHistory();
        actions.site.config();
        actions.course.recomm(8);
    }

    _onSearch() {
        const { actions } = this.props;
        const { keyword, p_keyword } = this.state;


        if (keyword.length > 0 || p_keyword.length > 0) {

            if (p_keyword.length > 0) {
                this.setState({
                    keyword: p_keyword
                }, () => {

                    actions.home.search(keyword);
                    this._getkeywordHis(p_keyword);
                })
            }

            if (keyword.length > 0) {

                actions.home.search(keyword);
                this._getkeywordHis(keyword);
            }


            actions.user.userLog({
                log_type: 1,
                type: 0,
                device_id: 0,
                intro: '首页搜索',
                content_id: 0,
                param: keyword,
                from: 1,
                resolved: (data) => {
                },
                rejected: (msg) => {
                }
            })

            // actions.user.userLog({1,0,0,'首页搜索',0,keyword,1});
        }
    }
    _update_recom() {
        const { actions } = this.props;
        actions.course.recomm(8);
    }
    _onHot(item) {
        this.setState({
            p_keyword: '',
            keyword: item,
        }, () => {
            this._onSearch();
        });

    }


    //切换
    _onSelect(index) {
        this.setState({
            status: index,
            sort: index,
            vcourseList: [],
        }, () => {
            this._onSearch();
        });
    }

    _onLink(courseId, courseName, ctype) {

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                if (ctype === 0 || ctype === 2) {
                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/courseDesc?course_id=' + courseId + '&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });

                } else if (ctype === 1) {

                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/audioDesc?course_id=' + courseId + '&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                }

            } else {
                Alert.alert('温馨提示', '请先安装微信');
            }
        })
    }

    _toWxchat(courseId, courseName, ctype) {

        Alert.alert('课程提示', '此课程只能在微信小程序观看', [
            {
                text: '取消', onPress: () => {

                }
            }, {
                text: '跳转', onPress: () => {
                    this._onLink(courseId, courseName, ctype)

                }
            }])
    }


    //得到本地缓存记录
    _getHistory() {
        // 查询本地历史
        DataBase.getItem('searchHistory').then(data => {
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

    //搜索时储存关键词
    _getkeywordHis(keyword) {
        const { historyList } = this.state;
        if (keyword.length > 0) {
            if (historyList.indexOf(keyword) !== -1) {

                let index = historyList.indexOf(keyword);
                historyList.splice(index, 1);
                historyList.unshift(keyword);
                DataBase.setItem('searchHistory', historyList);

            } else {
                // 本地历史 无 搜索内容
                historyList.unshift(keyword);
                DataBase.setItem('searchHistory', historyList);
            }
        }

    }

    //展示全部记录
    _allSearch() {
        DataBase.getItem('searchHistory').then(data => {
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

    _liteSearch(type) {

        let { historyList } = this.state;
        this.setState({
            historyList: historyList.slice(0, 3),
            historyType: 0,
        });
    }

    //删除单个历史记录
    _deteHistory(item, index) {
        const { historyList, historyType } = this.state;

        if (historyType === 0) {
            DataBase.getItem('searchHistory').then(data => {
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
                    DataBase.setItem('searchHistory', perhis);
                }
            });
        } else {
            historyList.splice(index, 1);
            this.setState({
                historyList: historyList,
                historyType: 1,
            });
            DataBase.setItem('searchHistory', historyList);
        }
    }

    //全部清空搜索记录
    _allDelete() {
        this.setState({
            historyList: [],
        });
        DataBase.setItem('searchHistory', []);
    }

    _oncourseDesc = (recom) => {
        const { navigation } = this.props;
        navigation.navigate('CourseDesc', { course: recom, courseName: recom.courseName });
    }

    _onLect(lect) {
        const { navigation } = this.props;

        navigation.navigate('Teacher', { teacher: lect })

    }

    render() {
        const { navigation } = this.props;
        const { p_keyword, keyword, searchhot, type, historyList, historyType, status, atabs, vcourseList, vcourseTotal, replayList, replayTotal, acourseList, acourseTotal, articleList, articleTotal, teacherList, teacherTotal, audioTotal, audioList } = this.state;

        // let teacherLists = teacherList.slice(0,4);
        // let vcourseLists = vcourseList.slice(0,4);


        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={[styles.searchbox]}>

                        <View style={[styles.fd_r, styles.ai_ct, styles.pl_15, styles.pr_15, styles.pt_12, styles.pb_12, styles.jc_ct]}>
                            <View style={[styles.searchleft, styles.fd_r, styles.ai_ct, styles.col_1]}>
                                <Image source={asset.search} style={[styles.s_img]} />
                                <TextInput
                                    style={[styles.ml_10, styles.col_1, styles.input]}
                                    placeholder={p_keyword.length > 0 ? p_keyword : '搜索课程或老师'}
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
                                    onChangeText={(text) => { this.setState({ keyword: text, p_keyword: '' }); }}
                                />
                            </View>
                            <TouchableOpacity style={[styles.searchbtn, styles.ai_ct, styles.fd_r, styles.jc_ct]} onPress={this._onSearch}>
                                <Text style={[styles.black_label, styles.default_label]}>搜索</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            type === 0 ?
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
                                                        <TouchableOpacity onPress={() => this._onHot(item)} style={[styles.col_1]}>
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
                                                searchhot.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity style={[styles.search_item]} key={'item' + index} onPress={() => this._onHot(item)}>
                                                            <Text style={[styles.sm_label, styles.sred_label]}>{item}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                                : null}


                        {
                            type === 1 ?
                                <View style={[styles.pt_20, styles.pb_20, styles.search_his, styles.ai_ct, styles.jc_ct, styles.mt_10]}>
                                    <View style={[styles.d_flex, styles.fd_c, styles.ai_ct, styles.search_full]}>
                                        <Image source={asset.perfect_icon.pf_search} style={[styles.no_search]} />
                                        <Text style={[styles.default_label, styles.tip_label, styles.mt_15]}>搜索记录为空</Text>
                                    </View>
                                </View>
                                : null}

                        {
                            type === 1 ?
                                <View>
                                    <View style={[styles.recomm, styles.pl_12, styles.pr_12]}>
                                        <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_20, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                            <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>猜你喜欢</Text>
                                            <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]}
                                                onPress={this._update_recom}
                                            >
                                                <Text style={[styles.tip_label, styles.default_label]}>换一批</Text>
                                                <Image source={asset.update_icon} style={[styles.update_icon, styles.ml_5]} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.recomm_items]}>
                                            {
                                                this.courserecom.map((recom, index) => {
                                                    let course = recom
                                                    return (
                                                        <TouchableOpacity onPress={() => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, course.ctype) : navigation.navigate('Vod', { course: course })}>
                                                            <View style={[styles.item, styles.fd_r, styles.pb_20]} key={'recom' + index}
                                                            >
                                                                <View style={[styles.item_cover_cons]}>
                                                                    <Image source={{ uri: recom.courseImg }} style={[styles.item_cover]} />
                                                                    <View style={[styles.item_tips_hit]}>
                                                                        <Image source={asset.cover_tips_icon} style={[styles.item_hit_cover]} />
                                                                        <Text style={[styles.sm8_label, styles.white_label, styles.mt_3]}>{recom.chapter}讲</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={[styles.d_flex, styles.fd_c, styles.pl_10, styles.jc_sb, styles.col_1]}>
                                                                    <View style={[styles.d_flex, styles.fd_c]}>
                                                                        <Text style={[styles.default_label, styles.c33_label, styles.fw_label]} numberOfLines={1}>{recom.courseName}</Text>
                                                                        <Text style={[styles.sml_label, styles.tip_label, styles.mt_5]} numberOfLines={1}>{recom.summary}</Text>
                                                                    </View>
                                                                    <View style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.mt_5]}>
                                                                        {
                                                                            recom.teacherId > 0 ?
                                                                                <View style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.mr_15]}>
                                                                                    <Image source={asset.per_icon} style={[styles.item_head_cover]} />
                                                                                    <Text style={[styles.sm_label, styles.c33_label, styles.ml_5]}>{recom.teacherName}</Text>
                                                                                </View>
                                                                                : null}
                                                                        <View style={[styles.view_play, styles.fd_r, styles.ai_ct]}>
                                                                            <Image source={asset.pay_icon} style={[styles.view_icon]} />
                                                                            <Text style={[styles.sm_label, styles.gray_label, styles.ml_5]}>{learnNum(recom.hit)}人已学</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                                : null}

                        {
                            type === 2 ?
                                <View>

                                    {/* 讲师 */}
                                    {
                                        teacherList.length > 0 ?
                                            <View style={[styles.recomm, styles.pl_12, styles.pr_12, styles.bg_white]} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_12, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.default_label, styles.gray_label]}>讲师 {teacherTotal > 99 ? '99+' : teacherTotal}</Text>
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct,]} onPress={() => navigation.navigate('TeacherChannel')}>
                                                        <Text style={[styles.sm_label, styles.tip_label]}>查看更多</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View>
                                                    {
                                                        teacherList.map((lect, index) => {
                                                            return (
                                                                <View style={[styles.fd_r, styles.pt_5, styles.pb_5]} key={'lect' + index}>
                                                                    <View style={[styles.fd_r, styles.jc_sb]}>
                                                                        <Image source={{ uri: lect.teacherImg }} style={[styles.lect_img]} />
                                                                        <View style={[styles.fd_c, styles.jc_sb, styles.ml_5]}>
                                                                            <View style={[styles.fd_c]}>
                                                                                <Text style={[styles.c33_label, styles.default_label, styles.fw_label]}>{lect.teacherName}</Text>
                                                                                <Text style={[styles.c33_label, styles.default_label, styles.mt_5]}>{lect.honor}</Text>
                                                                            </View>
                                                                            <Text style={[styles.tip_label, styles.sm_label]}>共 {lect.course} 讲</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={[styles.fd_r, styles.ai_ct, styles.jc_fe, styles.col_1]}>
                                                                        <TouchableOpacity style={[styles.lect_btn]} onPress={() => this._onLect(lect)}>
                                                                            <Text style={[styles.sm_label, styles.sred_label]}>进入主页</Text>
                                                                        </TouchableOpacity>
                                                                    </View>

                                                                </View>
                                                            )
                                                        })
                                                    }

                                                </View>
                                            </View>
                                            : null}

                                    {/* {
                                        vcourseList.length > 0 ? 
                                        <View style={[styles.atabs]}>
                                            {
                                                atabs.map((tab,index)=>{
                                                    const on = status === index;
                                                    return (
                                                        <TouchableOpacity style={[styles.onItems ,styles.pl_20 ,styles.pr_20  ,styles.fd_c ,styles.ai_ct ,styles.jc_ct ,styles.col_1]} key={'tab' + index}
                                                            onPress={()=>this._onSelect(index)}>
                                                            <Text style={[styles.default_label,on ? styles.c33_label : styles.gray_label , on ? styles.fw_label : null]}>{tab}</Text>
                                                            <View  style={[on ? styles.border_bt_ed : styles.border_bt_ned ]}></View>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            }
                                        </View>
                                    :null} */}

                                    {/* 视频 */}
                                    {
                                        vcourseList.length > 0 ?
                                            <View style={[styles.recomm, styles.pl_12, styles.pr_12, styles.search_his]} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_12, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.default_label, styles.gray_label]}>视频课程 {vcourseTotal > 99 ? '99+' : vcourseTotal}</Text>
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct,]} onPress={() => navigation.navigate('SearchChannel', { keyword: keyword, ctype: 0, btype: 0 })}>
                                                        <Text style={[styles.sm_label, styles.tip_label]}>查看更多</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.recomm_items]}>
                                                    {
                                                        vcourseList.map((course, index) => {
                                                            return (
                                                                <VodCell course={course} key={'recomm_' + course.courseId}
                                                                    onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, course.ctype) : navigation.navigate('Vod', { course: course })}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}

                                    {
                                        audioList.length > 0 ?
                                            <View style={[styles.recomm, styles.pl_12, styles.pr_12, styles.search_his]} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_12, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.default_label, styles.gray_label]}>音频课程 {audioTotal > 99 ? '99+' : audioTotal}</Text>
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct,]} onPress={() => navigation.navigate('SearchChannel', { keyword: keyword, ctype: 1, btype: 0 })}>
                                                        <Text style={[styles.sm_label, styles.tip_label]}>查看更多</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.recomm_items]}>
                                                    {
                                                        audioList.map((course, index) => {
                                                            return (
                                                                <VodCell course={course} key={'recomm_' + course.courseId + index}
                                                                    onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, course.ctype) : navigation.navigate('Audio', { course: course })}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}

                                    {/* 回放 */}
                                    {
                                        replayList.length > 0 ?
                                            <View style={[styles.recomm, styles.pl_12, styles.pr_12, styles.search_his]} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_12, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.default_label, styles.gray_label]}>回播课程 {replayTotal > 99 ? '99+' : replayTotal}</Text>
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct,]} onPress={() => navigation.navigate('SearchChannel', { keyword: keyword, ctype: 2, btype: 0 })}>
                                                        <Text style={[styles.sm_label, styles.tip_label]}>查看更多</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.recomm_items]}>
                                                    {
                                                        replayList.map((course, index) => {
                                                            return (
                                                                <VodCell course={course} key={'recomm_' + course.courseId}
                                                                    onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, course.ctype) : navigation.navigate('Vod', { course: course })}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}

                                    {/* 图文 */}
                                    {
                                        acourseList.length > 0 ?
                                            <View style={[styles.recomm, styles.pl_12, styles.pr_12, styles.search_his]} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_12, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.default_label, styles.gray_label]}>图文课程 {acourseTotal > 99 ? '99+' : acourseTotal}</Text>
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct,]} onPress={() => navigation.navigate('SearchChannel', { keyword: keyword, ctype: 3, btype: 1 })}>
                                                        <Text style={[styles.sm_label, styles.tip_label]}>查看更多</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.recomm_items]}>
                                                    {
                                                        acourseList.map((course, index) => {
                                                            return (
                                                                <GraphicCell course={course} key={'channel_' + course.courseId} onPress={(course) => navigation.navigate('Graphic', { course: course })} />
                                                            );
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}

                                    {/* 资讯 */}
                                    {
                                        articleList.length > 0 ?
                                            <View style={[styles.recomm, styles.pl_12, styles.pr_12, styles.search_his]} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pt_12, styles.pb_12, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.default_label, styles.gray_label]}>资讯 {articleTotal > 99 ? '99+' : articleTotal}</Text>
                                                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct,]} onPress={() => navigation.navigate('ArticleChannel', { type: 0, teacherId: 0 })}>
                                                        <Text style={[styles.sm_label, styles.tip_label]}>查看更多</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.recomm_items]}>
                                                    {
                                                        articleList.map((article, index) => {
                                                            return (
                                                                <ArticleCell key={'article_' + index} article={article} onPress={(article) => article.isLink === 1 ? navigation.navigate('AdWebView', { link: article.link }) : navigation.navigate('Article', { article: article })} />
                                                            );
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}





                                </View>
                                : null}


                    </View>
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    searchleft: {
        height: 30,
        backgroundColor: '#f5f5f5',
        paddingLeft: 12,
        borderRadius: 5,
    },
    s_img: {
        width: 16,
        height: 16,
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
    no_search: {
        width: 140,
        height: 130,
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
    dete_icon: {
        width: 16,
        height: 16,
    },
    search_box: {
        borderTopColor: '#FAFAFA',
        borderTopWidth: 5,
        borderStyle: 'solid',
    },
    update_icon: {
        width: 14,
        height: 14,
    },
    recomm: {
        borderTopColor: '#FAFAFA',
        borderTopWidth: 5,
        borderStyle: 'solid',
    },
    item_cover_cons: {
        position: 'relative',
        height: 72,
    },
    item_cover: {
        width: 129,
        height: 72,
        borderRadius: 5,
        backgroundColor: '#dddddd',
    },
    item_tips_hit: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 14,
        width: 40,
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item_hit_cover: {
        width: 8,
        height: 9,
        marginRight: 6,
    },
    item_head_cover: {
        width: 10,
        height: 10,
        marginRight: 5,
    },
    view_icon: {
        width: 14,
        height: 14,
    },
    border_bt_ed: {
        width: 10,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#F4623F',
        marginTop: 5,
    },
    border_bt_ned: {
        width: 10,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        marginTop: 5,
    },
    atabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        // borderBottom:1,
        borderColor: '#f5f5f5',
        borderStyle: 'solid',
    },
    search_his: {
        borderBottomColor: '#F5F5F5',
        borderBottomWidth: 10,
        borderStyle: 'solid'
    },
    input: {
        paddingVertical: 0,
    },
    lect_img: {
        width: 65,
        height: 80,
        borderRadius: 5,
    },
    lect_btn: {
        width: 65,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#F4623F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export const LayoutComponent = Search;

export function mapStateToProps(state) {
    return {
        search: state.home.search,
        config: state.site.config,
        courserecom: state.course.courserecom,
    };
}
