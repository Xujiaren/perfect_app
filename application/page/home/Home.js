import React, { Component } from 'react';
import { LogBox, View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, RefreshControl, Keyboard, Platform, Alert, Linking, DeviceEventEmitter, ImageBackground, BackHandler, Modal, PermissionsAndroid } from 'react-native';

import _ from 'lodash';
import Orientation from 'react-native-orientation';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ActionButton from 'react-native-action-button';

import { config, asset, theme, iconMap } from '../../config';

import HudView from '../../component/HudView';
import VodCell from '../../component/cell/VodCell';
import VVodCell from '../../component/cell/VVodCell';
import GraphicCell from '../../component/cell/GraphicCell';
import ArticleCell from '../../component/cell/ArticleCell';
import TeacherCell from '../../component/cell/TeacherCell';
import ActivityCell from '../../component/cell/ActivityCell'
import SpecialCell from '../../component/cell/SpecialCell'
import Tabs from '../../component/Tabs'
import ProjectCell from '../../component/cell/ProjectCell';
import * as  DataBase from '../../util/DataBase';
import * as WeChat from 'react-native-wechat-lib';
import Picker from 'react-native-picker';
import { liveday } from '../../util/common';
import request from '../../util/net';
import * as Download from '../../util/download'
const slideWidth = theme.window.width;

class Home extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.advert = [];
        this.adpopup = [];
        this.live = [];
        this.liveSlist = [];
        this.channel = [];

        this.leader = [];
        this.tearcher_recomm = [];

        this.recomm = [];

        this.article_recomm = [];
        this.msgread = {};

        this.sitemenu = [];
        this.siteindex = [];
        this.indexMenuTab = [];

        this.page = 0;
        this.pages = 0;

        this.menuList = []
        this.field = {}
        this.state = {
            isRefreshing: false,
            status: 0,
            message: 0,
            remind: 0,
            courseRemind: 0,
            statusBarHeight: global.statusBarHeight, //状态栏的高度
            navHeight: global.navigationHeight,
            currentAd: 0,
            tabStatus: 0, // tab 默认值
            livebackidx: 0,
            popupidx: 0,
            nullData: false,

            Spopup: 0,
            popupType: false,

            keyword: '',
            topview: false,

            infoType: false,

            infoStatus: 3, // 0   没有同意 1  同意个人信息保护指引

            agree: true,

            isCoupon: false,
            isLive: false,

            indexSite_menu: [],
            searchdefult: [],
            num: 0,
            areas: ['全部'],
            region: [],
            regionId: 0,
            area: '全部',
            qiandao: 0,
            qian_img: '',
            statuss: 0,
            mon: '',
            date: '',
            qd_pic: '',
            showPic: false
        };

        this._onRefresh = this._onRefresh.bind(this);

        this._onAd = this._onAd.bind(this);
        this._onRefreshRecomm = this._onRefreshRecomm.bind(this);

        this._onChannel = this._onChannel.bind(this);
        this._onCourse = this._onCourse.bind(this);
        this._onBook = this._onBook.bind(this);
        this._onSelect = this._onSelect.bind(this)

        this._renderAdItem = this._renderAdItem.bind(this);
        this._renderLiveback = this._renderLiveback.bind(this);
        this._renderLive = this._renderLive.bind(this);
        this._renderLeader = this._renderLeader.bind(this);
        this._renderChannel = this._renderChannel.bind(this);
        this._renderArticle = this._renderArticle.bind(this);
        this._renderTeacher = this._renderTeacher.bind(this);
        this._renderRecomm = this._renderRecomm.bind(this);
        this._renderSiteMenu = this._renderSiteMenu.bind(this);
        this._renderSiteIndex = this._renderSiteIndex.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._contentViewScroll = this._contentViewScroll.bind(this);

        this._offAdtip = this._offAdtip.bind(this);
        this._renderPopItem = this._renderPopItem.bind(this);
        this._tipPopup = this._tipPopup.bind(this);

        this._onLink = this._onLink.bind(this);
        this._toWxchat = this._toWxchat.bind(this);

        this._rdLiveBack = this._rdLiveBack.bind(this);

        this._toTop = this._toTop.bind(this);

        this._serviceAgreement = this._serviceAgreement.bind(this);
        this._privacyPolicy = this._privacyPolicy.bind(this);
        this._infoBtns = this._infoBtns.bind(this);
        this._onMessage = this._onMessage.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        const { config, advert, adpopup, live, leader, channel, tearcher_recomm, course_recomm, article_recomm, msgread, sitemenu, liveback, siteindex } = nextProps;

        const { tabStatus, infoStatus } = this.state

        if (config !== this.props.config) {
            let lst = JSON.parse(config.ui_choose_field)
            this.field = lst
            if (config.search_def.length > 0) {
                let searchdefult = config.search_def.split('|');
                let inputxt = searchdefult[Math.floor(Math.random() * searchdefult.length)];
                this.setState({
                    keyword: inputxt,
                    searchdefult: searchdefult,
                    qiandao: parseInt(config.user_day_checkin_img_status),
                    qian_img: config.user_day_checkin_button_img
                });
            }
        }


        if (advert !== this.props.advert) {
            this.advert = advert;
        }

        if (live !== this.props.live) {
            this.live = live.items;
        }

        if (liveback !== this.props.liveback) {
            this.liveSlist = liveback.items;
        }

        if (leader !== this.props.leader) {
            this.leader = leader;
        }

        if (channel !== this.props.channel) {
            this.channel = channel;
            setTimeout(() => this.setState({ isRefreshing: false }), 300);
        }

        if (tearcher_recomm !== this.props.tearcher_recomm) {
            this.tearcher_recomm = tearcher_recomm;
        }

        if (course_recomm !== this.props.course_recomm) {
            this.recomm = course_recomm;
        }

        if (article_recomm !== this.props.article_recomm) {
            this.article_recomm = article_recomm;
        }

        if (sitemenu !== this.props.sitemenu) {
            this.sitemenu = sitemenu.menu
            this.indexMenuTab = []
            if (sitemenu.menu.length > 0) {
                for (let j = 0; j < sitemenu.menu.length; j++) {
                    this.indexMenuTab.push(sitemenu.menu[j].type)
                }
            }

            if (sitemenu.data !== null) {

                if (tabStatus > 0) {
                    if (this.indexMenuTab[tabStatus - 1] === 'article' & this.page > 0) {
                        this.menuList = this.menuList.concat(sitemenu.data.items);
                    } else {

                        this.menuList = sitemenu.data.items
                    }
                }


                this.page = sitemenu.data.page
                this.pages = sitemenu.data.pages

            }
        }

        if (siteindex !== this.props.siteindex) {
            this.siteindex = siteindex
        }

        if (msgread !== this.props.msgread) {
            this.msgread = msgread;
            this.setState({
                message: msgread.message === undefined ? 0 : msgread.message,
                remind: msgread.remind === undefined ? 0 : msgread.remind,
                courseRemind: msgread.courseRemind === undefined ? 0 : msgread.courseRemind
            });
        }

        if (adpopup !== this.props.adpopup) {

            this.adpopup = adpopup

            if (Platform.OS === 'ios') {
                if (this.adpopup.length > 0) {
                    this._tipPopup()
                }
            } else {
                if (this.adpopup.length > 0 && infoStatus === 1) {
                    this._tipPopup()
                }
            }

        }

        // if (Platform.OS !== 'ios') {
        //     setTimeout(() => {
        //         BackHandler.exitApp();
        //     }, 2000);
        // }

    }

    componentWillMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        Orientation.lockToPortrait();

        // DataBase.setItem('adpopup', 0);
        DataBase.getItem('adpopup').then(data => {
            if (data != null) {

                this.setState({
                    Spopup: data
                })

            } else {
                this.setState({
                    Spopup: 0
                })
            }
        });

        setInterval(() => {
            if (this.state.searchdefult.length > 0) {
                if (this.state.num < this.state.searchdefult.length - 1) {
                    this.setState({
                        num: this.state.num + 1
                    })
                } else {
                    this.setState({
                        num: 0
                    })
                }
            }
        }, 5000);

    }

    componentDidMount() {

        const { navigation, actions } = this.props

        DeviceEventEmitter.addListener('infos', (data) => { // 建立一个通知
            this.setState({
                infoStatus: data.infoStatus
            });
        });

        this.msgSub = DeviceEventEmitter.addListener('msg', (data) => {
            navigation.navigate(_.isEmpty(this.props.user) ? 'PassPort' : 'MsgList');
        });


        this.focuSub = navigation.addListener('didFocus', (route) => {
            actions.user.user();
            actions.message.msgread();
            if (Platform.OS !== 'ios') {
                DataBase.getItem('infoStatus').then(data => {
                    this.setState({
                        agree: data != null
                    })

                });
            }
        })

        DataBase.getItem('infoStatus').then(data => {
            if (data !== null) {
                this.setState({
                    infoStatus: data
                })
            }
        });

        Linking.addEventListener('url', this._handleOpenURL);

        //android
        Linking.getInitialURL().then(url => {

            if (url && url.length > 0) {
                let linkArrs = url.split("//");
                let linkArr = linkArrs[linkArrs.length - 1].split("/");
                let linkPage = linkArr[0];
                let linkId = linkArr[1];
                let linkname = linkArr[2];

                if (linkPage === 'course') {

                    const vodcouse = { 'courseId': linkId, courseName: linkname };
                    navigation.navigate('Vod', { course: vodcouse });
                } else if (linkPage === 'article') {
                    const vodarticle = { 'articleId': linkId, title: linkname };
                    navigation.navigate('Article', { article: vodarticle })
                } else if (linkPage === 'live') {
                    const vodcouse = { 'courseId': linkId, courseName: linkname };
                    navigation.navigate('Live', { course: vodcouse, liveType: 1 });
                }
            }

        })

        this._onRefresh();

        actions.site.adpopup();
        actions.message.msgread();
        actions.site.config();

        //navigation.navigate('Forest');
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
        this.msgSub && this.msgSub.remove();
    }

    //ios
    _handleOpenURL = (event) => {
        // perfectapp://course/100/sdhscsdcsh
        let url = event.url

        const { navigation } = this.props;

        if (url && url.length > 0) {
            let linkArrs = url.split("//");
            let linkArr = linkArrs[linkArrs.length - 1].split("/");
            let linkPage = linkArr[0];
            let linkId = linkArr[1];
            let linkname = linkArr[2];

            if (linkPage === 'course') {
                const course = { 'courseId': linkId, courseName: linkname };
                navigation.navigate('Vod', { course: course });
            } else if (linkPage === 'article') {
                const course = { 'articleId': linkId, title: linkname };
                navigation.navigate('Article', { article: course })
            } else if (linkPage === 'live') {
                const course = { 'courseId': linkId, courseName: linkname };
                navigation.navigate('Live', { course: course, liveType: 1 });
            }
        }
    }

    _onLink(courseId, courseName, ctype) {
        // 音频未做处理
        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                if (ctype === 0) {
                    WeChat.launchMiniProgram({
                        userName: config.wxapp, // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/courseDesc?course_id=' + courseId + '&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                } else if (ctype === 1) {

                    WeChat.launchMiniProgram({
                        userName: config.wxapp, // 拉起的小程序的username
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
                    this._onLink(courseId, courseName, ctype);

                }
            }])
    }

    _onRefresh() {
        const { actions } = this.props;

        this.setState({
            isRefreshing: true
        }, () => {
            actions.site.advert(1);
            actions.home.sitemenu('', '', '');
            actions.home.siteindex();
            actions.course.live(-1, 0, 0, this.state.regionId);
            actions.course.liveback(-1, 1, 0, 0);
            actions.site.channel();
            actions.teacher.leaderrecomm();
            actions.teacher.recomm();
            actions.site.config()
            this.getRegion()
            this.getSigins()
            // actions.article.recomm();
        })

    }
    getSigins = () => {
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,                 //月份 
                "d+": this.getDate(),                    //日 
                "h+": this.getHours(),                   //小时 
                "m+": this.getMinutes(),                 //分 
                "s+": this.getSeconds(),                 //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds()             //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        let dates = new Date().format("yyyy-MM-dd");
        let mon = dates.split('-')[1];
        let date = dates.split('-')[2];
        this.setState({
            mon: mon,
            date: date
        })
        request.get('/user/signin')
            .then(res => {
                let time = res.filter(item => item.date == dates)
                this.setState({ statuss: time[0].status })
            })
    }
    _onSign = () => {
        const { actions } = this.props

        actions.user.signIn({
            resolved: (data) => {
                actions.user.user();
                this.getSigins()
                request.get('/config/day/check/img')
                    .then(res => {
                        if (res) {
                            this.setState({
                                qd_pic: res,
                                showPic: true
                            })
                        }
                    })
            },
            rejected: (msg) => {
                this.refs.hud.show('请先登录！', 1);
            }
        })

    }
    _onChannel(channel) {
        const { navigation } = this.props;

        if (channel.ctype == 0) {
            navigation.navigate('VodChannel', { channel: channel });
        } else if (channel.ctype == 3) {
            navigation.navigate('GraphicChannel');
        }
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

    // 猜你喜欢 跳转不同的页面
    _onCourse(course) {
        const { navigation } = this.props;

        if (course.ctype == 0) {

            if (course.plant === 1) {
                this._toWxchat(course.courseId, course.courseName, course.ctype);
            } else {
                navigation.navigate('Vod', { course: course, courseName: course.courseName });
            }

        } else if (course.ctype === 1) {
            if (course.plant === 1) {
                this._toWxchat(course.courseId, course.courseName, course.ctype);
            } else {
                navigation.navigate('Audio', { course: course, courseName: course.courseName });
            }
        } else if (course.ctype == 3) {
            navigation.navigate('Graphic', { course: course, courseName: course.courseName });
        }
    }


    // 广告
    _onAd(item) {
        const { navigation } = this.props;
        let adlink = item.link;

        if (adlink.substring(0, 4) === 'http') {

            navigation.navigate('AdWebView', { link: adlink })

        } else {

            if (adlink.indexOf('courseDesc') !== -1) {

                let courseId = adlink.split('=')[1]
                const couse = { 'courseId': courseId.split("&")[0] };
                navigation.navigate('Vod', { course: couse, courseName: '' });

            } else if (adlink.indexOf('consultDesc') !== -1) {

                let courseId = adlink.split('=')[1]
                const article = { 'articleId': courseId.split("&")[0] };
                navigation.navigate('Article', { article: article })

            } else if (adlink.indexOf('liveDesc') !== -1) {

                let courseId = adlink.split('=')[1];
                let courseName = '直播';

                if (adlink.split('=').length === 3) {
                    courseName = adlink.split('=')[2]
                }

                const course = { 'courseId': courseId.split("&")[0], courseName: courseName };

                navigation.navigate('Live', { course: course })
            } else if (adlink.indexOf('activityDesc') !== -1) {
                let acts = adlink.split('=')[1]
                request.get('/activity/' + acts.split("&")[0])
                    .then(res => {
                        navigation.navigate('Activity', { activity: res })
                    })
            } else if (adlink.indexOf('mailDesc') !== -1) {
                let goodsId = adlink.split('=')[1];
                request.get('/shop/goods/' + goodsId)
                    .then(res => {
                        navigation.navigate('MailDetail', { cate: res })
                    })
            } else if (adlink == '/comPages/pages/user/downLoad') {
                navigation.navigate('Channel')
            }
        }
    }

    _onBook(course) {
        const { user, navigation, actions } = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            actions.course.book({
                course_id: course.courseId,
                resolved: (data) => {
                    this.refs.hud.show('预约成功', 1);
                    actions.course.live(-1, 0, 0, this.state.regionId);

                    this.setState({
                        isLive: true,
                    })
                },
                rejected: (msg) => {

                }
            })
        }
    }

    _onSelect = (status) => {
        const { actions, navigation } = this.props
        this.page = 0;
        this.menuList = [],

            // navigation.Test();


            this.setState({
                tabStatus: status,
                page: 0,
                nullData: false,
                topview: false
            }, () => {
                if (status === 0) {
                    actions.home.siteindex();
                } else {
                    this._getIndexTabList();
                }
            })
    }

    _getIndexTabList() {
        const { actions } = this.props
        const { tabStatus, IndexMenus } = this.state


        let arr_index = [];
        // for (let i = 0; i < this.sitemenu.length; i++) {
        //     if (this.sitemenu[i].name === 'activity') {
        //         arr_index.push('活动')
        //     } else if (this.sitemenu[i].name === 'column') {
        //         arr_index.push('专题')
        //     } else {
        //         arr_index.push(this.sitemenu[i])
        //     }
        //     arr_index.push(this.sitemenu[i])
        // }


        if (tabStatus > 0) {
            actions.home.sitemenu(this.sitemenu[tabStatus - 1].type, this.sitemenu[tabStatus - 1].mark, this.page);

        }

    }

    _onFollow(index) {

        const { user, actions, navigation } = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            let teacher = this.menuList[index];

            if (teacher.isFollow) {
                teacher.isFollow = false;
                actions.teacher.removefollow({
                    teacherId: teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('取消关注', 1);
                    },
                    rejected: (res) => {

                    },
                });

            } else {
                teacher.isFollow = true;
                actions.teacher.follow({
                    teacherId: teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);
                    },
                    rejected: (res) => {

                    },
                });
            }
            this._getIndexTabList();

            this.menuList[index] = teacher;

        }
    }


    onArea = () => {
        Keyboard.dismiss();

        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '地区',
            pickerData: this.state.areas,
            selectedValue: [this.state.types],
            onPickerConfirm: pickedValue => {
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
                    this.props.actions.course.live(-1, 0, 0, this.state.regionId);
                })
            },
        });

        Picker.show();
    }

    _onRefreshRecomm() {
        const { actions } = this.props;
        actions.course.recomm(8);
    }

    _renderAdItem({ item, index }) {
        return (
            <TouchableOpacity onPress={() => this._onAd(item)} >
                <View style={[styles.ad_item, styles.live_box, styles.circle_10]}>
                    <Image roundAsCircle={true} source={{ uri: item.fileUrl }} style={[styles.ad_img, styles.circle_10]} />
                </View>
            </TouchableOpacity>
        );
    }


    // tab 
    _renderSiteMenu() {

        const { tabStatus } = this.state

        let IndexMenus = new Array("全部")

        for (let j = 0; j < this.sitemenu.length; j++) {
            if (this.sitemenu[j].name === 'teacher') {
                IndexMenus.push('讲师专区')
            } else if (this.sitemenu[j].name === 'leader') {
                IndexMenus.push('领导风采')
            } else if (this.sitemenu[j].name === 'article') {
                IndexMenus.push('资讯专栏')
            } else if (this.sitemenu[j].name === 'activity') {
                IndexMenus.push('活动')
            } else if (this.sitemenu[j].name === 'column') {
                IndexMenus.push('专题')
            } else {
                IndexMenus.push(this.sitemenu[j].name)
            }
        }


        return (
            <View style={[styles.mb_10]}>
                {
                    IndexMenus.length > 1 ?
                        <View className='tabbox pb_10'>
                            <Tabs items={IndexMenus} atype={0} type={0} selected={tabStatus} onSelect={this._onSelect} />
                        </View>
                        : null}
            </View>
        )
    }


    _rdLiveBack({ item, index }) {

        const { navigation } = this.props
        return (
            <TouchableOpacity style={styles.rdLiveBack}
                onPress={() => navigation.navigate('Vod', { course: item })}
            >
                <Text numberOfLines={1}>{item.courseName}</Text>
            </TouchableOpacity>
        );
    }

    // 直播回放
    _renderLiveback() {
        const { navigation } = this.props;
        const { livebackidx } = this.state
        return (
            <View style={[styles.liveback_box, styles.d_flex, styles.fd_r, styles.ai_ct, styles.ml_15, styles.mr_15, styles.mt_15]}>
                <View style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.pl_15, styles.mr_10]}>
                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/live_replay.png' }} mode='aspectFit' style={[styles.back_cover, styles.mr_10]} />
                </View>
                <Carousel
                    useScrollView={true}
                    data={this.liveSlist}
                    autoplay={true}
                    loop={true}
                    vertical={true}
                    autoplayDelay={3000}
                    renderItem={this._rdLiveBack}
                    itemWidth={theme.window.width * 0.5}
                    itemHeight={20}
                    sliderWidth={theme.window.width}
                    sliderHeight={20}
                    activeSlideAlignment={'center'}
                    inactiveSlideScale={1}
                    removeClippedSubviews={false}

                    onSnapToItem={(index) => this.setState({ livebackidx: index })}
                />
                <Pagination
                    dotsLength={this.liveSlist.length}
                    activeDotIndex={livebackidx}
                    containerStyle={styles.ad_page}
                    dotStyle={styles.ad_page}
                    inactiveDotOpacity={0}
                    inactiveDotScale={0}
                />
                <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.pr_15, styles.pl_12]}
                    onPress={() => navigation.navigate('LivePback')}
                >
                    <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>全部</Text>
                    <Image source={asset.arrow_right} style={styles.arrow_right} />
                </TouchableOpacity>
            </View>
        )
    }

    _renderLive() {
        const { navigation } = this.props;

        return (
            <View style={[styles.live_box, styles.ml_15, styles.mr_15]}>
                {
                    this.live.length === 0 ?
                        <View style={[styles.mt_15, styles.livecons]}>
                            <View style={[styles.p_15, styles.bg_white, styles.fd_r, styles.jc_sb]}>
                                <View style={[styles.row]}>
                                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>直播课程</Text>
                                    <TouchableOpacity onPress={this.onArea}>
                                        <View style={[styles.otip, styles.row]}>
                                            <Text style={[{ fontSize: 11 }, styles.sred_label]}>{this.state.area}</Text>
                                            <Text style={[styles.icon, styles.sred_label, { fontSize: 10, marginLeft: 2 }]}>{iconMap('right')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('LivePreview')}>
                                    <View style={[styles.row, styles.ai_ct]}>
                                        <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>更多</Text>
                                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null
                }
                {
                    this.live.map((course, index) => {
                        return (
                            <View style={[styles.mt_15, styles.livecons]}>
                                {index === 0 ?
                                    <View style={[styles.p_15, styles.bg_white, styles.fd_r, styles.jc_sb]}>
                                        <View style={[styles.row]}>
                                            <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>直播课程</Text>
                                            <TouchableOpacity onPress={this.onArea}>
                                                <View style={[styles.otip, styles.row]}>
                                                    <Text style={[{ fontSize: 11 }, styles.sred_label]}>{this.state.area}</Text>
                                                    <Text style={[styles.icon, styles.sred_label, { fontSize: 10, marginLeft: 2 }]}>{iconMap('right')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.navigate('LivePreview')}>
                                            <View style={[styles.row, styles.ai_ct]}>
                                                <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>更多</Text>
                                                <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> : null}
                                <TouchableOpacity style={[styles.p_15, styles.bg_white, styles.circle_5]} key={'live' + index} onPress={() => navigation.navigate(course.ctype == 52 ? 'ActiveLive' : 'Live', { course: course })}>
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
                            </View>
                        );
                    })
                }
            </View>
        )
    }


    // 领导模块
    _renderLeader(leaderData) {
        const { navigation } = this.props;
        return (
            <View style={[styles.ml_15, styles.mr_15]}>
                <View style={[styles.teachzone, styles.border_bt, styles.pb_20, styles.pl_15, styles.pr_15, styles.bg_white]}>
                    <View style={[styles.head, styles.pl_2, styles.pr_2, styles.d_flex, styles.fd_r, styles.ai_ct]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>领导风采</Text>
                    </View>
                    <ScrollView
                        scrollX
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={[styles.teach, styles.fd_r, styles.mt_15]}>
                            {
                                leaderData.map((leader, index) => {
                                    return <TeacherCell teacher={leader} key={'leader_' + index} onPress={(leader) => navigation.navigate('Leader', { teacher: leader })} />
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }


    // 资讯模块
    _renderArticle(articleData) {
        const { navigation } = this.props;
        if (articleData.length == 0) return null;

        return (
            <View style={[styles.recomm, styles.pt_25, styles.ml_15, styles.mr_15]} >
                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pb_12, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>资讯</Text>
                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]}
                        onPress={() => navigation.navigate('ArticleChannel', { type: 0, teacher_id: 0 })}
                    >
                        <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>全部</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                </View>
                {articleData.map((article, index) => {
                    return <ArticleCell key={'article_' + index} article={article} onPress={(article) => article.isLink === 1 ? navigation.navigate('AdWebView', { link: article.link }) : navigation.navigate('Article', { article: article })} />
                })}
            </View>
        )
    }


    // 活动模块
    _renderActivity(activityData) {
        const { navigation } = this.props;

        let aitivityList = activityData.slice(0, 2)

        return (
            <View style={[styles.recomm, styles.pt_25, styles.ml_15, styles.mr_15]} >
                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pb_12, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>活动</Text>
                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]}
                        onPress={() => navigation.navigate('ArticleChannel')}
                    >
                        <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>全部</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                </View>

                {aitivityList.map((activity, index) => {

                    let on;
                    if (aitivityList.length === 1) {
                        on = true
                    } else if (aitivityList.length > 1) {
                        on = index === 1
                    }

                    return <ActivityCell key={'activity' + index} activity={activity} type={on} onPress={(activity) => navigation.navigate('Activity', { activity: activity })} />
                })}
            </View>
        )
    }

    // 专题
    _renderspecial(special) {
        const { navigation } = this.props;
        let specialList = special.slice(0, 2)

        return (
            <View style={[styles.recomm, styles.pt_25, styles.ml_15, styles.mr_15]} >
                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pb_12, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>专题</Text>
                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]}
                        onPress={() => navigation.navigate('ArticleChannel')}
                    >
                        <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>全部</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                </View>

                {specialList.map((special, index) => {

                    let on;
                    if (specialList.length === 1) {
                        on = true
                    } else if (specialList.length > 1) {
                        on = index === 1
                    }

                    return <SpecialCell key={'special' + index} special={special} type={on} onPress={(special) => navigation.navigate('Project', { project: special })} />
                })}
            </View>
        )
    }


    // 讲师模块
    _renderTeacher(siteData) {
        const { navigation } = this.props;
        return (
            <View style={[styles.pl_15, styles.pr_15]}>
                <View style={[styles.teachzone, styles.border_bt, styles.pb_20, styles.pl_15, styles.pr_15, styles.bg_white]}>
                    <View style={[styles.head, styles.pl_2, styles.pr_2, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>讲师专区</Text>
                        <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]}
                            onPress={() => navigation.navigate('TeacherChannel', { refresh: () => this._onRefresh() })}
                        >
                            <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>全部</Text>
                            <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        scrollX
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    // style={{height:'380rpx'}}
                    >
                        <View style={[styles.teach, styles.fd_r, styles.mt_15]}>
                            {
                                siteData.map((teacher, index) => {
                                    return <TeacherCell teacher={teacher} ttype={1} key={'teacher_' + index} onPress={(teacher) => navigation.navigate('Teacher', { teacher: teacher })} />
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }

    //  猜你喜欢
    _renderRecomm() {
        const { navigation } = this.props;

        return (
            <View style={[styles.pl_15, styles.pr_15]}>
                <View style={[styles.recomm]} >
                    <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pb_12, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                        <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>猜你喜欢</Text>
                        <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]} onPress={this._onRefreshRecomm}>
                            <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>换一批</Text>
                            <Image source={asset.update_icon} style={[styles.update_icon, styles.ml_5]} />
                        </TouchableOpacity>
                    </View>
                    {
                        this.recomm.map((course, index) => {
                            return <VodCell course={course} key={'recomm_' + index}
                                onPress={() => this._onCourse(course)}
                            />
                        })
                    }
                </View>
            </View>
        )
    }

    _renderChannel(ctype, ttype, course_list) {
        const { navigation } = this.props;


        if (ctype == 0) {
            if (ttype == 0) {
                return (
                    <View style={[styles.row, styles.f_wrap, styles.jc_sb]}>
                        {
                            course_list.map((course, index) => {
                                return <VVodCell style={[styles.item]} course={course} key={'channel_' + course.courseId}
                                    onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, ctype) : navigation.navigate('Vod', { course: course })}
                                />
                            })
                        }
                    </View>
                )
            } else if (ttype == 1) {
                return course_list.map((course, index) => {
                    return <VodCell course={course} key={'channel_' + index}
                        onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, ctype) : navigation.navigate('Vod', { course: course })}
                    />
                })
            }
        } else if (ctype == 1) {
            return course_list.map((course, index) => {
                return <VodCell course={course} key={'channel_' + index}
                    onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId, course.courseName, ctype) : navigation.navigate('Vod', { course: course })}
                />
            })
        } else if (ctype == 2) {
        } else if (ctype == 3) {
            return (
                <View style={[styles.graphic_items]}>
                    {course_list.map((course, index) => {
                        return <GraphicCell course={course} key={'channel_' + course.courseId} onPress={(course) => navigation.navigate('Graphic', { course: course })} />
                    })}
                </View>
            )
        }

        return null;
    }


    // 模块列表数据
    _renderSiteIndex() {
        // this.siteindex
        let IndexSort = [] //  首页模版排序

        for (let i = 0; i < this.siteindex.length; i++) {
            if (this.siteindex[i].data === null || this.siteindex[i].data === '' || this.siteindex[i].data === undefined) {

            } else {
                IndexSort.push(this.siteindex[i])
            }
        }



        return (
            <View>
                {
                    IndexSort.map((site, index) => {
                        return (
                            <View key={'site' + index}>
                                {
                                    site.type === 'channel' && site.data.courseList.length > 0 && (site.data.ctype === 0 || site.data.ctype === 3) ?
                                        <View style={[styles.pl_15, styles.pr_15]}>
                                            <View style={[styles.recomm, styles.pt_25]} key={'item' + index} >
                                                <View style={[styles.head, styles.pl_2, styles.pr_2, styles.pb_12, styles.d_flex, styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                                    <Text style={[styles.lg_label, styles.c33_label, styles.fw_label]}>{site.data.channelName}</Text>
                                                    <TouchableOpacity style={[styles.d_flex, styles.fd_r, styles.ai_ct, styles.jc_ct]}
                                                        onPress={() => this._onChannel(site.data)}
                                                    >
                                                        <Text style={[styles.tip_label, styles.default_label, styles.fw_label]}>全部</Text>
                                                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {this._renderChannel(site.data.ctype, site.data.ttype, site.data.courseList)}
                                            </View>
                                        </View>
                                        : null}

                                {
                                    site.type === 'teacher' && site.data.length > 0 ?
                                        <View>
                                            {this._renderTeacher(site.data)}
                                        </View>
                                        : null}

                                {
                                    site.type === 'leader' && site.data.length > 0 ?
                                        <View>
                                            {this._renderLeader(site.data)}
                                        </View>
                                        : null}
                                {
                                    site.type === 'activity' && site.data.length > 0 ?
                                        <View>
                                            {this._renderActivity(site.data)}
                                        </View>
                                        : null}

                                {
                                    site.type === 'column' && site.data.length > 0 ?
                                        <View>
                                            {this._renderspecial(site.data)}
                                        </View>
                                        : null}

                                {
                                    site.type === 'article' && site.data.length > 0 ?
                                        <View>
                                            {this._renderArticle(site.data.slice(0, 4))}
                                        </View>
                                        : null}

                            </View>
                        )
                    })
                }
            </View>
        )
    }


    _tipPopup() {
        const { Spopup } = this.state

        const popupidx = this.adpopup.length
        const popuID = this.adpopup[popupidx - 1].billboardId;

        if (Spopup !== popuID) {
            this.setState({
                popupType: true
            })
        }
    }

    onAdPopupLink(popup) {
        const { navigation } = this.props
        let adlink = popup.link;

        // let adlink = '/pages/index/courseDesc?course_id=851&coursename=路'

        if (adlink.length > 0) {

            this._offAdtip();

            if (adlink.substring(0, 4) === 'http') {

                navigation.navigate('AdWebView', { link: adlink })

            } else {

                if (adlink.indexOf('courseDesc') !== -1) {

                    let courseId = adlink.split('=')[1]
                    const couse = { 'courseId': courseId.split("&")[0] };
                    navigation.navigate('Vod', { course: couse, courseName: '' });

                } else if (adlink.indexOf('consultDesc') !== -1) {

                    let courseId = adlink.split('=')[1]
                    const article = { 'articleId': courseId.split("&")[0] };
                    navigation.navigate('Article', { article: article })

                } else if (adlink.indexOf('liveDesc') !== -1) {

                    let courseId = adlink.split('=')[1];
                    let courseName = '直播';

                    if (adlink.split('=').length === 3) {
                        courseName = adlink.split('=')[2]
                    }

                    const course = { 'courseId': courseId.split("&")[0], courseName: courseName };

                    navigation.navigate('Live', { course: course })
                } else if (adlink.indexOf('activityDesc') !== -1) {
                    let acts = adlink.split('=')[1]
                    request.get('/activity/' + acts.split("&")[0])
                        .then(res => {
                            navigation.navigate('Activity', { activity: res })
                        })
                } else if (adlink.indexOf('mailDesc') !== -1) {
                    let goodsId = adlink.split('=')[1];
                    request.get('/shop/goods/' + goodsId)
                        .then(res => {
                            navigation.navigate('MailDetail', { cate: res })
                        })
                } else if (adlink == '/comPages/pages/user/downLoad') {
                    navigation.navigate('DownloadChannel')
                }
            }

        }

    }

    // 关闭弹窗 
    _offAdtip() {

        const popupidx = this.adpopup.length
        const popuID = this.adpopup[popupidx - 1].billboardId;


        DataBase.setItem('adpopup', popuID);

        this.setState({
            popupType: false
        })

    }



    _renderPopItem({ item, index }) {
        return (
            <TouchableOpacity onPress={() => this.onAdPopupLink(item)}>
                <View style={[styles.fd_c, styles.ai_ct, styles.circle_10, styles.over_h, { height: 270 }]}>
                    <Image source={{ uri: item.fileUrl }} roundAsCircle={true} style={[styles.popupImg]} />
                    <Text style={[styles.lg_label, styles.black_label, styles.fw_label, styles.mt_5]}>{item.billboardName}</Text>
                    <View style={[styles.fd_r, styles.tips_cont]}>
                        <Text style={[styles.default_label, styles.c33_label, styles.mt_5, styles.pl_10]} numberOfLines={2}>{item.content}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }



    // 隐私
    _serviceAgreement() {
        const { navigation } = this.props


        this.setState({
            agree: true
        }, () => {
            navigation.navigate('ServiceAgreement', { type: 1 })
        })

    }

    // 隐私条款
    _privacyPolicy() {
        const { navigation } = this.props


        this.setState({
            agree: true
        }, () => {
            navigation.navigate('PrivacyPolicy', { type: 1 })
        })
    }


    // 个人信息
    _infoBtns() {
        DataBase.setItem('infoStatus', 1);

        this.setState({
            agree: true,
            infoStatus: 1
        }, () => {
            if (Platform.OS === 'android') {
                PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {

                })
            }
        })
    }


    _renderItem(item) {
        const { navigation } = this.props
        const index = item.index
        const menu = item.item
        const { tabStatus } = this.state

        let arr_menu = [];

        for (let i = 0; i < this.indexMenuTab.length; i++) {
            arr_menu.push(this.indexMenuTab[i])
        }

        if (arr_menu[tabStatus - 1] === 'channel') {

            let _nav = '';
            if (menu.ctype === 0) {
                _nav = 'Vod'
            } else if (menu.ctype === 1) {
                _nav = 'Audio'
            } else if (menu.ctype === 3) {
                _nav = 'Graphic'
            }


            return (
                <VodCell course={menu} key={'channel_' + index}
                    onPress={(menu) => menu.plant === 1 ? this._toWxchat(menu.courseId, menu.courseName, menu.ctype) : navigation.navigate(_nav, { course: menu })}
                />
            )
        } else if (arr_menu[tabStatus - 1] === 'article') {
            return (
                <ArticleCell key={'article_' + index} article={menu} onPress={(menu) => menu.isLink === 1 ? navigation.navigate('AdWebView', { link: menu.link }) : navigation.navigate('Article', { article: menu })} />
            )
        } else if (arr_menu[tabStatus - 1] === 'teacher' || arr_menu[tabStatus - 1] === 'leader') {

            let _teach = ''
            if (arr_menu[tabStatus - 1] === 'teacher') {
                _teach = 'Teacher'
            } else if (arr_menu[tabStatus - 1] === 'leader') {
                _teach = 'Leader'
            }

            return (
                <TouchableOpacity style={[styles.mb_25]} onPress={() => navigation.navigate(_teach, { teacher: menu })}>
                    <View style={[styles.fd_r]}>
                        <View style={[styles.item_cover]}>
                            <Image source={{ uri: menu.teacherImg }} style={[styles.item_cover]} />
                        </View>
                        <View style={[styles.fd_c, styles.jc_sb, styles.ml_10, styles.col_1]}>
                            <View>
                                <View style={[styles.fd_r, styles.jc_sb, styles.ai_ct]}>
                                    <Text style={[styles.lg_label, styles.black_label, styles.fw_label]}>{menu.teacherName}</Text>
                                    <TouchableOpacity style={[styles.focuson, styles.d_flex, styles.jc_ct, styles.ai_ct]} onPress={() => this._onFollow(index)}>
                                        <Text style={[styles.red_label, styles.sm_label]}>{menu.isFollow ? '已关注' : '+ 关注'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.default_label, styles.gray_label, styles.mt_5, styles.lh18_label]}>{(menu.honor !== '' && menu.honor !== undefined) ? menu.honor.split('&').join('\n') : ''}</Text>

                            </View>
                            <Text style={[styles.sm_label, styles.tip_label]} >共 {menu.course} 课</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )

        } else if (arr_menu[tabStatus - 1] === 'activity') {
            return (
                <ActivityCell activity={menu} onPress={(findt) => navigation.navigate('Activity', { activity: menu })} />
            )
        } else if (arr_menu[tabStatus - 1] === 'column') {
            return (
                <ProjectCell project={menu} key={'specia' + index} onPress={(specia) => navigation.navigate('Project', { project: menu })} />
            )
        }

        return null;
    }


    _contentViewScroll = (e) => {
        const { actions } = this.props;
        const { tabStatus } = this.state

        if (tabStatus > 0) {
            if (this.indexMenuTab[tabStatus - 1] === 'article') {


                if (this.page < this.pages) {
                    // this.setState({refreshState: RefreshState.FooterRefreshing});

                    this.page = this.page + 1;

                    // actions.user.userReward(1,this.page);
                    this._getIndexTabList()

                }
                else {
                    this.setState({
                        // refreshState: RefreshState.NoMoreData,
                        nullData: true
                    });
                }
            }
        }

        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

        if (offsetY + oriageScrollHeight >= 2000) {

            this.setState({
                topview: true,
            })
        } else {

            this.setState({
                topview: false
            })
        }

    }

    _toTop() {

        this.setState({
            topview: false
        })
        this.scrollview.scrollTo({ x: 0, y: 0, animated: true });
    }


    _onMessage() {

        const { navigation, user } = this.props


        if (!_.isEmpty(user)) {

            navigation.navigate('Message')

        } else {

            navigation.navigate('PassPort');

        }

    }
    onMap = () => {
        const { navigation, user } = this.props
        if (!_.isEmpty(user)) {
            if (user.isAuth === 1) {
                navigation.navigate('StudyMap')
            } else {
                this.refs.hud.show('学习地图仅对特定对象可见', 1);
            }

        } else {

            navigation.navigate('PassPort');

        }
    }
    _toggleShare = (val) => {
        if (val == 0) {
            // WeChat.shareImage({
            //     imageUrl: this.state.qd_pic,
            //     scene: val,
            // }).then(res => {
            //     this.setState({
            //         showPic: false
            //     })
            // })
            WeChat.shareMiniProgram({
                title: '每日签到',
                description: '每日签到',
                thumbImageUrl: this.state.qd_pic,
                userName: "gh_7bd862c3897e",
                webpageUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.perfectapp',
                path: '/comPages/pages/index/qiandaoImg?path=' + this.state.qd_pic,
                withShareTicket: 'true',
                scene: 0,
            }).then((onFulfilled, onRejected) => {

            }).catch(err => {
                console.log(err)
            })
        } else {
            let title = '每日签到'
            let path = '/comPages/pages/index/qiandaoImg?path=' + this.state.qd_pic
            WeChat.shareWebpage({
                title: title,
                description: title,
                thumbImageUrl: this.state.qd_pic,
                webpageUrl: 'https://cloud1-9gte9vuwb998210f-1305702264.tcloudbaseapp.com/ad.html?page=' + encodeURIComponent(path) + '&title=' + encodeURIComponent(title),
                scene: 1
            })
        }

    }
    _getPost = () => {
        Download.DownloadMedia(this.state.qd_pic, false)
        this.setState({
            showPic: false
        }, () => {
            this.refs.hud.show('下载成功', 1);
        })
    }


    render() {

        const { navigation } = this.props;
        const { courseRemind, message, remind, statusBarHeight, navHeight, currentAd, livebackidx, tabStatus, nullData, keyword, topview, infoStatus, agree, popupidx, popupType, isCoupon, isLive, searchdefult, num } = this.state;

        let totalMsg = message + remind + courseRemind;
        return (
            <View style={styles.container}>
                <View style={{ paddingTop: statusBarHeight }}>
                    <View style={[styles.fd_r, styles.jc_ct, styles.ai_ct, styles.pb_10, styles.pt_10, { height: navHeight, width: slideWidth }]}>
                        <Image source={asset.headertit} style={[styles.headertit]} />
                    </View>
                </View>


                <View style={[styles.topHeader]}>
                    <View style={[styles.searchbox, styles.fd_r, styles.pb_12, styles.ai_ct, styles.pl_10, styles.pr_15]}>
                        <TouchableOpacity style={[styles.search_action, styles.ml_15]}
                            onPress={this._onMessage}
                        >
                            <Image source={asset.msg_icon} style={[styles.msg_icon]} />
                            {
                                totalMsg > 0 ?
                                    <View style={[styles.search_tip]}>
                                        <Text style={[styles.sm9_label, styles.white_label]}>{totalMsg > 99 ? '99+' : totalMsg}</Text>
                                    </View>
                                    : null}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.search_input, styles.fd_r, styles.ai_ct, styles.col_1, styles.pl_12]}
                            onPress={() => navigation.navigate('Search', { keyword: searchdefult.length > 0 ? searchdefult[num] : '' })}
                        >
                            <Image source={asset.search} style={[styles.search_icon]} />
                            <Text style={[styles.default_label, styles.tip_label, styles.pl_5]}>{searchdefult.length > 0 ? searchdefult[num] : ''}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('CourseCategory')}
                        >
                            <Image source={asset.cate_h_icon} style={styles.cate_h_icon} />
                        </TouchableOpacity>
                    </View>
                    {this._renderSiteMenu()}
                </View>

                {
                    tabStatus === 0 ?
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            onMomentumScrollEnd={this._contentViewScroll}
                            style={{ position: 'relative', paddingBottom: 50 }}
                            ref={(r) => this.scrollview = r}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh}
                                    tintColor="#999999"
                                    title="松开刷新"
                                    titleColor="#999999"
                                />
                            }
                        >
                            {
                                this.state.qiandao ?
                                    <TouchableOpacity style={[styles.qiandao]} onPress={() => {
                                        if (this.state.statuss == 0) {
                                            this._onSign()
                                        } else {
                                            this.refs.hud.show('已经签到！', 1);
                                            request.get('/config/day/check/img')
                                                .then(res => {
                                                    if (res) {
                                                        this.setState({
                                                            qd_pic: res,
                                                            showPic: true
                                                        })
                                                    }
                                                })
                                        }
                                    }}>
                                        <Image source={{ uri: this.state.qian_img }} style={[styles.qiandao_img]} resizeMode='stretch' />
                                        {
                                            this.state.statuss == 0 ?
                                                <View style={[styles.qd_btn]} >
                                                    <Text style={[styles.white_label]}>立即签到</Text>
                                                </View>
                                                :
                                                <View style={[styles.qd_btns]}>
                                                    <Text style={[styles.white_label]}>已签到</Text>
                                                </View>
                                        }
                                        <View style={[styles.row, styles.ai_ct, styles.datess]}>
                                            <View style={[{ marginLeft: 2 }, styles.das, styles.bg_blacks]}>
                                                <Text style={[styles.white_label, styles.sm_label]}>{this.state.mon}</Text>
                                            </View>
                                            <View style={[{ marginLeft: 2 }]}>
                                                <Text style={[styles.white_label]}>月</Text>
                                            </View>
                                            <View style={[{ marginLeft: 2 }, styles.das, styles.bg_blacks]}>
                                                <Text style={[styles.white_label, styles.sm_label]}>{this.state.date}</Text>
                                            </View>
                                            <View style={[{ marginLeft: 2 }]}>
                                                <Text style={[styles.white_label]}>日</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                            }

                            <View>
                                <Carousel
                                    useScrollView={true}
                                    data={this.advert}
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
                                    dotsLength={this.advert.length}
                                    activeDotIndex={currentAd}
                                    containerStyle={styles.ad_page}
                                    dotStyle={styles.ad_dot}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                />
                            </View>

                            <View style={[styles.row, styles.f_wrap, styles.p_20]}>
                                {/* <TouchableOpacity style={[styles.menu_item, styles.ai_ct, styles.mb_10]} onPress={() => navigation.navigate('LivePreview')}>
                                    <Image source={{ uri: asset.home.menu.live }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>直播</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct]} onPress={() => this.onMap()}>
                                    <Image source={{ uri: this.field.map }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>学习地图</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct]} onPress={() => navigation.navigate('CourseCategory')}>
                                    <Image source={{ uri: this.field.cate }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>全部课程</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct, styles.mb_10]} onPress={() => navigation.navigate('ProfesSkill')}>
                                    <Image source={{ uri: this.field.squad }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>培训班</Text>
                                </TouchableOpacity>
                                {/* {1 ? null :
                                    <TouchableOpacity style={[styles.menu_item, styles.ai_ct, styles.mb_10]}>
                                        <Image source={{ uri: this.field.pk }} style={[styles.menu_icon]} />
                                        <Text style={[styles.mt_5]}>PK赛场</Text>
                                    </TouchableOpacity>
                                }
                                {1 ? null :
                                    <TouchableOpacity style={[styles.menu_item, styles.ai_ct, styles.mb_10]} onPress={() => navigation.navigate('Forest')}>
                                        <Image source={{ uri: this.field.forest }} style={[styles.menu_icon]} />
                                        <Text style={[styles.mt_5]}>完美林</Text>
                                    </TouchableOpacity>
                                } */}
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct]} onPress={() => navigation.navigate('Mail')}>
                                    <Image source={{ uri: this.field.mall_icon }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>学分换购</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct, styles.mb_10]} onPress={() => navigation.navigate('Ask')}>
                                    <Image source={{ uri: this.field.forum }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>问吧</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={[styles.menu_item, styles.ai_ct]} onPress={() => navigation.navigate('Meet')}>
                                    <Image source={{ uri: this.field.seminar }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>研讨会</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct]} onPress={() => navigation.navigate('CourseChannel', { ctype: 0 })}>
                                    <Image source={{ uri: this.field.course }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>视频课程</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.menu_item, styles.ai_ct]} onPress={() => navigation.navigate('CourseChannel', { ctype: 1 })}>
                                    <Image source={{ uri: this.field.audio }} style={[styles.menu_icon]} />
                                    <Text style={[styles.mt_5]}>音频课程</Text>
                                </TouchableOpacity> */}

                            </View>

                            {this._renderLiveback()}
                            {this._renderLive()}
                            {this._renderSiteIndex()}
                            {this._renderRecomm()}

                            <View style={{ width: '100%', height: 40 }}></View>
                        </ScrollView>
                        : null}

                {
                    tabStatus > 0 ?
                        <ScrollView style={[styles.pl_10, styles.pr_10, styles.pb_50]}
                            //触底事件 这个很重要
                            onMomentumScrollEnd={this._contentViewScroll}
                            automaticallyAdjustContentInsets={false}
                            //是否新显示滚动条
                            showsVerticalScrollIndicator={false}
                            scrollsToTop={true}
                            ref={(r) => this.scrollview = r}
                        >

                            <FlatList
                                data={this.menuList}
                                renderItem={this._renderItem}
                                extraData={this.state}
                            />
                            {
                                nullData ?
                                    <View style={[styles.loaddata, styles.d_flex, styles.ai_ct, styles.jc_ct, styles.pt_10, styles.pb_10]}>
                                        <Text style={[styles.sm_label, styles.tip_label]}>没有更多数据了</Text>
                                    </View>
                                    : null}

                            <View style={{ width: '100%', height: 40 }}></View>
                        </ScrollView>

                        : null}


                {
                    !agree ?
                        <View style={styles.modal}>
                            <View style={[styles.modal_container, styles.bg_white, styles.circle_5]}>
                                <ScrollView
                                    automaticallyAdjustContentInsets={false}
                                    //是否新显示滚动条
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={[styles.fd_c, styles.pt_20, styles.pl_15, styles.pr_15]}>
                                        <View style={[styles.fd_r, styles.jc_ct, styles.ai_ct, styles.mb_15]}>
                                            <Text style={[styles.black_label, styles.lg18_label, styles.fw_label]}>个人信息保护指引</Text>
                                        </View>
                                        <Text style={[styles.black_label, styles.default_label, styles.fw_label, styles.lh20_label]}>请充分阅读并理解</Text>
                                        <View style={[styles.fd_r, { flexWrap: 'wrap' }]}>
                                            <TouchableOpacity
                                                onPress={this._serviceAgreement}
                                            >
                                                <Text style={[styles.red_label, styles.default_label, styles.fw_label, styles.lh20_label]}>《用户服务协议》</Text>
                                            </TouchableOpacity>
                                            <Text style={[styles.c33_label, styles.default_label, styles.lh20_label]}>和</Text>
                                            <TouchableOpacity
                                                onPress={this._privacyPolicy}
                                            >
                                                <Text style={[styles.red_label, styles.default_label, styles.fw_label, styles.lh20_label]}>《隐私政策》<Text style={[styles.black_label]}>，点</Text></Text>
                                            </TouchableOpacity>
                                            <View>
                                                <Text style={[styles.black_label, styles.default_label, styles.fw_label, styles.lh20_label]}>击按钮代表你已同意前述协议及以下约定。</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.c33_label, styles.default_label, styles.lh20_label]}>1、为向你提供学习相关基本功能，我们会收集、使用必要的信息；</Text>
                                        <Text style={[styles.c33_label, styles.default_label, styles.lh20_label]}>2、为保障你的账户与使用安全，你需要授权我们获取你的设备权限，你有权拒绝或取消授权，取消后将不影响你使用我们提供的其他服务；</Text>
                                        <Text style={[styles.c33_label, styles.default_label, styles.lh20_label]}>3、为了正常识别手机设备，运营商网络，保证账户安全，我们需要获取手机/电话权限；</Text>
                                        <Text style={[styles.c33_label, styles.default_label, styles.lh20_label]}>4、未经你同意，我们不会从第三方处获取、共享或向其提供你的信息；</Text>
                                    </View>
                                </ScrollView>
                                <View style={[styles.row, styles.ai_ct]}>
                                    <TouchableOpacity style={[styles.infoBtns]}
                                        onPress={() => BackHandler.exitApp()}
                                    >
                                        <Text style={[styles.black_label, styles.lg18_label, styles.fw_label]}>暂不使用</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.infoBtns]}
                                        onPress={this._infoBtns}
                                    >
                                        <Text style={[styles.black_label, styles.lg18_label, styles.fw_label]}>同意</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        : null}


                {
                    popupType ?
                        <View style={styles.popModal}>
                            <View style={[styles.returnTop]}>
                                <View style={[styles.tips_box, styles.d_flex, styles.ai_ct, styles.fd_c]}>
                                    <View style={styles.carousel_box}>
                                        <Carousel
                                            useScrollView={true}
                                            data={this.adpopup}
                                            autoplay={true}
                                            loop={true}
                                            autoplayDelay={5000}
                                            renderItem={this._renderPopItem}

                                            itemWidth={300}
                                            itemHeight={200}

                                            sliderWidth={300}
                                            sliderHeight={200}

                                            activeSlideAlignment={'center'}
                                            inactiveSlideScale={1}

                                            onSnapToItem={(index) => this.setState({ popupidx: index })}

                                        />
                                        <Pagination
                                            dotsLength={this.adpopup.length}
                                            activeDotIndex={popupidx}
                                            containerStyle={styles.ad_page}
                                            dotStyle={[styles.ad_dot, { width: 6, height: 6, borderRadius: 3, backgroundColor: '#333333' }]}
                                            inactiveDotOpacity={0.4}
                                            inactiveDotScale={0.6}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        onPress={this._offAdtip}
                                    >
                                        <Image source={asset.tip_dele} style={styles.tips_dete} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    isCoupon ?
                        <View style={[styles.coupons]}>
                            <View style={[styles.coupon_cons]}>
                                <View style={[styles.fd_c, styles.coupon_box, styles.pb_25]}>
                                    <TouchableOpacity style={[styles.dete_icons]}>
                                        <Image source={asset.common.c_delete} style={[styles.dete_icon]} />
                                    </TouchableOpacity>
                                    <Image source={asset.bg.redhot} style={[styles.coupon_cover]} />
                                    <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, styles.mt_10]}>
                                        <Text style={[styles.lg20_label, styles.c33_label, styles.fw_label]}>恭喜您获得2张优惠券</Text>
                                        <Text style={[styles.sm_label, styles.c33_label, styles.mt_5]}>请在有效期内使用</Text>
                                    </View>
                                    <View style={[styles.fd_c, styles.ml_12, styles.mt_20]}>
                                        <TouchableOpacity>
                                            <ImageBackground style={[styles.fd_r, styles.ai_ct, styles.coupon_img]} source={asset.user.get_coupon}>
                                                <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, { width: 85 }]}>
                                                    <Text style={[styles.lg26_label, styles.white_label, styles.fw_label]}><Text style={[styles.white_label, styles.smm_label, styles.fw_label]}>￥</Text>20</Text>
                                                    <Text style={[styles.smm_label, styles.white_label]}>满100元可用</Text>
                                                </View>
                                                <View style={[styles.fd_c, styles.pl_20]}>
                                                    <Text style={[styles.lg_label, styles.white_label, styles.fw_label]}>直播课程专享</Text>
                                                    <Text style={[styles.smm_label, styles.mt_5, styles.white_label]}>2019.12.19 - 2020.1.1</Text>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.mt_5]}>
                                            <ImageBackground style={[styles.fd_r, styles.ai_ct, styles.coupon_img]} source={asset.user.get_coupon}>
                                                <View style={[styles.fd_c, styles.jc_ct, styles.ai_ct, { width: 85 }]}>
                                                    <Text style={[styles.lg26_label, styles.white_label, styles.fw_label]}><Text style={[styles.white_label, styles.smm_label, styles.fw_label]}>￥</Text>20</Text>
                                                    <Text style={[styles.smm_label, styles.white_label]}>满100元可用</Text>
                                                </View>
                                                <View style={[styles.fd_c, styles.pl_20]}>
                                                    <Text style={[styles.lg_label, styles.white_label, styles.fw_label]}>直播课程专享</Text>
                                                    <Text style={[styles.smm_label, styles.mt_5, styles.white_label]}>2019.12.19 - 2020.1.1</Text>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={[styles.coupon_btn, styles.fd_r, styles.ai_ct, styles.jc_ct, styles.mt_25, styles.ml_15]}>
                                        <Text style={[styles.sred_label, styles.default_label]}>立即领取</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        : null}

                {
                    isLive ?
                        <View style={[styles.coupons]}>
                            <View style={styles.scoreBox}>
                                <View style={[styles.evalBox]}>
                                    <Image source={asset.bg.redhot} style={[styles.coupon_cover]} />
                                    <View style={[styles.fd_c, styles.ai_ct, styles.mt_15]}>
                                        <Text style={{ color: '#000000', fontSize: 18 }}>预约成功</Text>
                                        <Text style={{ fontSize: 15, color: '#888888', marginTop: 2 }}>开播前10分钟将收到直播通知</Text>
                                    </View>
                                    <View style={[styles.fd_r, styles.mt_30, styles.eval_btns]}>
                                        <TouchableOpacity style={[styles.col_1, styles.ai_ct, styles.jc_ct, styles.pt_12, styles.pb_12]} onPress={() => this.setState({ isLive: false })} >
                                            <Text style={[styles.lg16_label, styles.c33_label]}>确定</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}

                <Modal visible={this.state.showPic} transparent={true} onRequestClose={() => { }}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={() => this.setState({ showPic: false })}></TouchableOpacity>
                    <TouchableOpacity style={[styles.close, styles.row, styles.jc_ct, styles.ai_ct]} onPress={() => this.setState({ showPic: false })}>
                        <Text style={[{ fontSize: 14, color: '#ffffff' }]}>关闭</Text>
                    </TouchableOpacity>
                    <View style={styles.imgType}>
                        <Image source={{ uri: this.state.qd_pic }} style={[styles.img_pic]} resizeMode='contain' />
                    </View>
                    <View style={styles.wechatType}>
                        <View style={[styles.wechatIcons, styles.fd_r, styles.ai_ct, styles.jc_ct]}>
                            <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                onPress={() => this._toggleShare(0)}
                            >
                                <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]}>
                                    <Image source={asset.wechat} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label, styles.m_5]}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                onPress={() => this._getPost()}
                            >
                                <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]} >
                                    <Image source={asset.local} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label, styles.m_5]}>保存本地</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item, styles.fd_c, styles.jc_ct, styles.ai_ct, styles.col_1]}
                                onPress={() => this._toggleShare(1)}
                            >
                                <View style={[styles.item_box, styles.jc_ct, styles.ai_ct]} >
                                    <Image source={asset.friends} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label, styles.m_5]}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {
                    topview ?
                        <ActionButton buttonColor="rgba(255,255,255,1)"
                            size={28}
                            position='right'
                            style={{ position: 'absolute', bottom: 80 }}
                            renderIcon={() => (
                                <View>
                                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/top_icon.png' }} style={styles.returnTop_cover} />
                                </View>
                            )}
                            onPress={this._toTop}
                        >
                        </ActionButton>
                        : null}
                <HudView ref={'hud'} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container: {
        // position:'relative',
        backgroundColor: '#FAFAFA',
        flex: 1
    },
    search_input: {
        height: 35,
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
    search_action: {
        width: 40,
        height: 18,
        textAlign: 'center',
        position: 'relative',
    },
    msg_icon: {
        width: 20,
        height: 18,
    },
    search_tip: {
        position: 'absolute',
        top: -8,
        right: 12,
        width: 18,
        height: 18,
        borderRadius: 9,
        flexDirection: 'row',
        backgroundColor: '#FF0013',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cate_h_icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    rdLiveBack: {
        height: 20,
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
    },
    ad_item: {
        overflow: 'hidden',
    },
    ad_img: {
        width: theme.window.width * 0.9,
        height: (theme.window.width * 0.9) * 0.39,
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
    menu_item: {
        width: (theme.window.width - 40) / 5,
    },
    menu_icon: {
        width: 55,
        height: 55,
    },
    live_summary: {
        width: theme.window.width - 140,
    },
    recomm: {
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        shadowOffset: { width: 1, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2,//安卓，让安卓拥有阴影边框
    },
    update_icon: {
        width: 14,
        height: 14,
    },
    item: {
        width: '48%',
    },
    teachzone: {
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        elevation: 2,//安卓，让安卓拥有阴影边框
        shadowOffset: { width: 1, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
    },
    teach: {
        width: '100%',
    },

    headertit: {
        width: 87,
        height: 20,
    },
    cate_cover: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    liveback_box: {
        height: 46,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        shadowOffset: { width: 1, height: 5 },
        shadowColor: 'rgba(240,240,240,1)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    back_cover: {
        width: 64,
        height: 15,
    },
    liveback_sw: {
        flex: 1,
        height: 20
    },
    liveback_sw_it: {
        height: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    live_box: {
        shadowOffset: { width: 1, height: 2 },
        shadowColor: 'rgba(233,233,233, 1.0)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    livecons: {
        borderRadius: 5,
        backgroundColor: '#ffffff',
        shadowOffset: { width: 1, height: 3 },
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
    item_cover: {
        width: 64,
        height: 80,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    focuson: {
        width: 53,
        height: 22,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(244,98,63,1)',
        borderStyle: 'solid',
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    returnTop: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: 300,
        height: 348,
        marginLeft: -150,
        marginTop: -174,
        borderRadius: 5,
    },
    carousel_box: {
        width: 300,
        height: 300,
        borderRadius: 10,
        backgroundColor: '#ffffff'
    },
    tips_dete: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginTop: 18
    },
    popupImg: {
        width: 300,
        height: 200
    },
    tips_cont: {
        width: '100%'
    },
    returnTop_cover: {
        width: 36,
        height: 36,
    },
    infoBox: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: 300,
        height: 280,
        marginLeft: -150,
        marginTop: -140,
        borderRadius: 5,
    },
    info_box: {
        width: 300,
        height: 280,
        borderRadius: 5,
        backgroundColor: '#ffffff'
    },
    infoBtns: {
        width: '50%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#f1f1f1',
        borderTopWidth: 1,
        borderStyle: 'solid',
        marginTop: 20,
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 40,
        paddingTop: 150,
    },
    modal_container: {
        height: 280,
    },
    popModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)'
    },
    coupons: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    coupon_cons: {
        position: 'absolute',
        left: '50%',
        width: 280,
        marginLeft: -140,
        borderRadius: 5,
    },
    coupon_box: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        position: 'relative'
    },
    coupon_btn: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#F4623F',
        width: 250,
        height: 32,
        borderRadius: 5
    },
    coupon_cover: {
        width: 280,
        height: 175,
        marginTop: -80
    },
    coupon_img: {
        width: 252,
        height: 64,
    },
    dete_icons: {
        position: 'absolute',
        top: -60,
        right: 20
    },
    dete_icon: {
        width: 24,
        height: 24,
        zIndex: 999
    },
    scoreBox: {
        position: 'absolute',
        left: '50%',
        width: 280,
        marginLeft: -140,
        backgroundColor: '#ffffff'
    },
    modal_img: {
        width: 280,
        height: 175,
        marginTop: -80
    },
    eval_btns: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        borderStyle: 'solid'
    },
    otip: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#FFF1E8',
        marginLeft: 8
    },
    qiandao: {
        width: theme.window.width - 30,
        height: 46,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        position: 'relative'
    },
    qiandao_img: {
        width: theme.window.width - 30,
        height: 46,
        borderRadius: 10
    },
    qd_btn: {
        position: 'absolute',
        top: 8,
        right: 20,
        width: 80,
        height: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4623F'
    },
    qd_btns: {
        position: 'absolute',
        top: 8,
        right: 20,
        width: 80,
        height: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc'
    },
    datess: {
        position: 'absolute',
        left: 130,
        bottom: 11,
    },
    das: {
        width: 20,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#000000',
        opacity: 0.7
    },
    share_icon: {
        width: 20,
        height: 20
    },
    bg_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    wechatType: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 120,
        borderRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#ffffff'
    },
    wechatIcons: {
        width: '100%',
        backgroundColor: '#ffffff',
        height: 100
    },
    item_box: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    imgType: {
        position: 'absolute',
        top: 100,
        left: 50,
        width: theme.window.width - 100,
        height: theme.window.height - 300,
    },
    img_pic: {
        width: theme.window.width - 100,
        height: theme.window.height - 300,
    },
    close: {
        width: 64,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000000',
        opacity: 0.5,
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

export const LayoutComponent = Home;

export function mapStateToProps(state) {
    return {
        advert: state.site.advert,
        adpopup: state.site.adpopup,

        sitemenu: state.home.sitemenu,

        live: state.course.live,
        liveback: state.course.liveback,
        channel: state.site.channel,

        leader: state.teacher.leader,
        tearcher_recomm: state.teacher.tearcherrecomm,
        course_recomm: state.course.courserecom,

        article_recomm: state.article.recomm,

        msgread: state.message.msgread,
        user: state.user.user,

        siteindex: state.home.siteindex,
        config: state.site.config,
    };
}

