import React, { Component } from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import asset from '../config/asset';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import connectComponent from '../util/connect';
import request from '../util/net'
// 引导页
import * as Home from '../page/home/Home';
import * as AdWebView from '../page/home/AdWebView';

//搜索
import * as Search from '../page/home/Search';
import * as SearchChannel from '../page/home/SearchChannel';

//评论
import * as PublishComment from '../page/home/PublishComment';
import * as PersonalComment from '../page/home/PersonalComment';
import * as Comment from '../page/home/Comment';

//课程
import * as CourseCategory from '../page/course/CourseCategory';
import * as CourseChannel from '../page/course/CourseChannel'
import * as VodChannel from '../page/course/VodChannel';
import * as Vod from '../page/course/Vod';
import * as LiveChannel from '../page/course/LiveChannel';
import * as Live from '../page/course/Live';
import * as ActiveLive from '../page/course/ActiveLive';
import * as Audio from '../page/course/Audio';
import * as GraphicChannel from '../page/course/GraphicChannel';
import * as Graphic from '../page/course/Graphic';
import * as VodLink from '../page/course/VodLink';
import * as LivePback from '../page/course/LivePback';
import * as LivePreview from '../page/course/LivePreview';
import * as Ebook from '../page/course/Ebook';
import * as BangDan from '../page/course/BangDan';
//老师
import * as TeacherChannel from '../page/teacher/TeacherChannel';
import * as Teacher from '../page/teacher/Teacher';
import * as Leader from '../page/teacher/Leader';
import * as Promotion from '../page/teacher/Promotion';
import * as LectApply from '../page/teacher/LectApply';
import * as PushClass from '../page/teacher/PushClass';
import * as LectCourse from '../page/teacher/LectCourse';
import * as LectReturn from '../page/teacher/LectReturn';
import * as LectReward from '../page/teacher/LectReward';

//资讯
import * as ArticleChannel from '../page/article/ArticleChannel';
import * as Article from '../page/article/Article';
import * as OfflineSignup from '../page/article/OfflineSignup';
import * as OfflineAct from '../page/article/OfflineAct';

//发现
import * as Find from '../page/find/Find';
import * as Activity from '../page/find/Activity';
import * as ActivitySignUp from '../page/find/ActivitySignUp';
import * as Project from '../page/find/Project';
import * as QuestSurvey from '../page/find/QuestSurvey';
import * as ActivityProduction from '../page/find/ActivityProduction';
import * as ScratchCard from '../page/find/ScratchCard';

//学习
import * as Study from '../page/study/Study';
import * as Rank from '../page/study/Rank';
import * as StudyRecord from '../page/study/StudyRecord';
import * as StudyData from '../page/study/StudyData';
import * as StudyMap from '../page/study/StudyMap';
import * as StudyAnswer from '../page/study/StudyAnswer';
import * as ProvinData from '../page/study/ProvinData';
import * as WinRules from '../page/study/WinRules';
import * as WinRecord from '../page/study/WinRecord';
import * as Smap from '../page/study/Smap';

//我的
import * as PassPort from '../page/user/PassPort';
import * as SetPwd from '../page/user/SetPwd';
import * as ForgetPwd from '../page/user/ForgetPwd';

//用户信息
import * as User from '../page/user/User';
import * as Account from '../page/user/Account';
import * as ResetPwd from '../page/user/ResetPwd';
import * as BindAccount from '../page/user/BindAccount';
import * as Kefu from '../page/user/Kefu';
import * as AnnualBill from '../page/user/AnnualBill';
import * as RealAuth from '../page/user/RealAuth';
import * as Message from '../page/user/message/Message';
import * as MsgList from '../page/user/message/MsgList';
import * as RemindList from '../page/user/message/RemindList';
import * as MsgDesc from '../page/user/message/MsgDesc';
import * as MsgCourse from '../page/user/message/MsgCourse';
import * as MsgChat from '../page/user/message/MsgChat';
import * as UserInfo from '../page/user/userinfo/UserInfo';
import * as UserCollect from '../page/user/userinfo/UserCollect';
import * as UserCard from '../page/user/userinfo/UserCard';
import * as UserReward from '../page/user/userinfo/UserReward';
import * as UserIntegral from '../page/user/userinfo/UserIntegral';
import * as UserMedal from '../page/user/userinfo/UserMedal';
import * as MedalDesc from '../page/user/userinfo/MedalDesc';
import * as UserFous from '../page/user/userinfo/UserFous';
import * as UserSignIn from '../page/user/userinfo/UserSignIn';
import * as NickName from '../page/user/userinfo/NickName';
import * as UserPersonal from '../page/user/userinfo/UserPersonal';
import * as UserCert from '../page/user/userinfo/UserCert';
import * as UserQuestion from '../page/user/userinfo/UserQuestion';
import * as Certificate from '../page/user/userinfo/Certificate';
import * as UserBuyCourse from '../page/user/userinfo/UserBuyCourse';
import * as UserCoupon from '../page/user/userinfo/UserCoupon';
import * as ShareInvite from '../page/user/ShareInvite';
import * as GrowthEquity from '../page/user/GrowthEquity';
import * as EquityState from '../page/user/EquityState';
import * as Address from '../page/user/address/Address';
import * as DoneAddress from '../page/user/address/DoneAddress';
import * as Niandu from '../page/user/Niandu';
//下载专区
import * as DownloadChannel from '../page/user/download/Channel';
import * as DownloadGallery from '../page/user/download/Gallery';

//翻牌抽奖
import * as Lucky from '../page/user/lucky/Lucky';
import * as LuckyDraw from '../page/user/lucky/LuckyDraw';
import * as FilpCards from '../page/user/lucky/FilpCards';
import * as ActRule from '../page/user/lucky/ActRule';

//意见反馈
import * as FeedBack from '../page/user/feedback/FeedBack';
import * as FdBack from '../page/user/feedback/FdBack';
import * as FdBackDesc from '../page/user/feedback/FdBackDesc';
import * as Report from '../page/user/Report';

// 充值 支付
import * as Recharge from '../page/recharge/Recharge';
import * as RechargePay from '../page/recharge/RechargePay';
import * as RcRecord from '../page/recharge/RcRecord';
import * as PayCourse from '../page/recharge/PayCourse';
import * as PayProps from '../page/recharge/PayProps';

//设置
import * as SetPush from '../page/user/SetPush';

//关于
import * as Setting from '../page/user/setting/Setting';
import * as SetPwds from '../page/user/setting/SetPwds';
import * as SetMobile from '../page/user/setting/SetMobile';
import * as Blacklist from '../page/user/setting/Blacklist';
import About from '../page/user/setting/about/About';
import * as AboutUS from '../page/user/setting/about/AboutUS';
import * as PrivacyPolicy from '../page/user/setting/about/PrivacyPolicy';
import * as RprivacyPolicy from '../page/user/setting/about/RprivacyPolicy';
import * as ServiceAgreement from '../page/user/setting/about/ServiceAgreement';

import Progress from '../page/home/Progress';

// 资格认证
import * as CateExam from '../page/user/qualification/CateExam';
import * as CertificateSignUp from '../page/user/qualification/CertificateSignUp';
import * as DoingExam from '../page/user/qualification/DoingExam';
import * as DoingTopic from '../page/user/qualification/DoingTopic';
import * as ExerciseResult from '../page/user/qualification/ExerciseResult';
import * as HasCourse from '../page/user/qualification/HasCourse';
import * as LearnDesc from '../page/user/qualification/LearnDesc';
import * as MyTrainClassDetail from '../page/user/qualification/MyTrainClassDetail';
import * as MyTrainClassSignUp from '../page/user/qualification/MyTrainClassSignUp';
import * as MyTranDetail from '../page/user/qualification/MyTranDetail';
import * as OfflineSign from '../page/user/qualification/OfflineSign';
import * as PaperAnalysis from '../page/user/qualification/PaperAnalysis';
import * as PracticeResult from '../page/user/qualification/PracticeResult';
import * as PracticeRoom from '../page/user/qualification/PracticeRoom';
import * as ProfesSkill from '../page/user/qualification/ProfesSkill';
import * as Review from '../page/user/qualification/Review';
import * as TopicSort from '../page/user/qualification/TopicSort';
import * as VideoLearn from '../page/user/qualification/VideoLearn';

//商城
import * as Mail from '../page/mail/Mail';
import * as MailDetail from '../page/mail/MailDetail';
import * as MailSearch from '../page/mail/MailSearch';
import * as Order from '../page/mail/Order';
import * as MaiList from '../page/mail/MaiList';
import * as OrderDetail from '../page/mail/OrderDetail';
import * as MailCate from '../page/mail/MailCate';
import * as Settlement from '../page/mail/Settlement';
import * as GeneralList from '../page/mail/GeneralList';
import * as Cart from '../page/mail/Cart';
import * as OrderPay from '../page/mail/OrderPay';
import * as CartSettlement from '../page/mail/CartSettlement';

//研讨会
import * as Meet from '../page/meet/Meet'
import * as MeetLiveChannel from '../page/meet/LiveChannel'
import * as MeetCheckPoint from '../page/meet/CheckPoint'
import * as MeetMomentChannel from '../page/meet/moment/Channel'
import * as MeetWall from '../page/meet/wall/Wall'
import * as MeetWallOwner from '../page/meet/wall/Wall'
import * as MeetWallPublish from '../page/meet/wall/Publish'
import * as MeetChannel from '../page/meet/Channel'
import * as MeetPaperChannel from '../page/meet/paper/Channel'
import * as MeetPaper from '../page/meet/paper/Paper'
import * as MeetPaperStat from '../page/meet/paper/Stat'
import * as MeetMoment from '../page/meet/moment/Moment'
import * as MeetMomentVideoChannel from '../page/meet/moment/VChannel'
import * as MeetMomentVideo from '../page/meet/moment/Video'
import * as MeetMomentGallery from '../page/meet/moment/Gallery'

//完美林
import * as Forest from '../page/forest/Forest'
import * as ForestMoment from '../page/forest/Moment'
import * as ForestFriend from '../page/forest/Friend'
import * as ForestAchieve from '../page/forest/Achieve'
import * as ForestUser from '../page/forest/User'
import * as ForestStep from '../page/forest/Step'
import * as ForestKnowledge from '../page/forest/Knowledge'
import * as ForestShop from '../page/forest/shop/Shop'
import * as ForestGoods from '../page/forest/shop/Goods'
import * as ForestOrder from '../page/forest/shop/Order'
import * as ForestOrderHistory from '../page/forest/shop/OrderHistory'

//PK答题
import * as PkHome from '../page/pk/PkHome';
import * as PkRank from '../page/pk/PkRank';
import * as PkQuestion from '../page/pk/PkQuestion';
import * as PkPublishQuestion from '../page/pk/PkPublishQuestion';
import * as PkCard from '../page/pk/PkCard';
import * as PkSpecialChannel from '../page/pk/PkSpecialChannel';
import * as PkSpecial from '../page/pk/PkSpecial';
import * as PkEntry from '../page/pk/PkEntry';
import * as PkFriend from '../page/pk/PkFriend';
import * as PkTeam from '../page/pk/PkTeam';

//问吧
import * as Ask from '../page/ask/Ask';
import * as AskSearch from '../page/ask/AskSearch';
import * as WriteQust from '../page/ask/WriteQust';
import * as AskInvite from '../page/ask/AskInvite';
import * as UserAsk from '../page/ask/UserAsk';
import * as AskQust from '../page/ask/AskQust';
import * as Question from '../page/ask/Question';
import * as UserQust from '../page/ask/UserQust';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import promise from 'redux-promise';

// nav = (val) => {
//     request.get('/config')
//         .then(config => {
//             const ui = JSON.parse(config['ui_choose_field'])
//             let lst = []
//             if (val === 1) {
//                 lst = [ui['index_dark'] ? { uri: ui['index_dark'] } : asset.tab.home, ui['index_light'] ? { uri: ui['index_light'] } : asset.tab.home_on]
//             } else if (val === 2) {
//                 lst = [ui['discover_dark'] ? { uri: ui['discover_dark'] } : asset.tab.find, ui['discover_light'] ? { uri: ui['discover_light'] } : asset.tab.find_on]
//             } else if (val === 3) {
//                 lst = [ui['study_dark'] ? { uri: ui['study_dark'] } : asset.tab.study, ui['study_light'] ? { uri: ui['study_light'] } : asset.tab.study_on]
//             } else if (val === 4) {
//                 lst = [ui['my_dark'] ? { uri: ui['my_dark'] } : asset.tab.user, ui['my_light'] ? { uri: ui['my_light'] } : asset.tab.user_on]
//             }
//             return lst
//         })
// }
const TabNav = createBottomTabNavigator({
    Home: {
        screen: connectComponent(Home),
        navigationOptions: {
            title: '首页',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.tab.home_on : asset.tab.home} style={{ width: 20, height: 20 }} />;
            },
        },
    },
    Find: {
        screen: connectComponent(Find),
        navigationOptions: {
            title: '发现',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.tab.find_on : asset.tab.find} style={{ width: 20, height: 20 }} />;
            },
        },
    },
    Study: {
        screen: connectComponent(Study),
        navigationOptions: {
            title: '学习',
            header: null,
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.tab.study_on : asset.tab.study} style={{ width: 20, height: 20 }} />;
            },
        },
    },
    User: {
        screen: connectComponent(User),
        navigationOptions: ({ navigation, screenProps }) => ({
            title: '我的',
            header: null,
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.tab.user_on : asset.tab.user} style={{ width: 20, height: 20 }} />;
            },
        }),
    }
}, {
    initialRouteName: 'Home',
    swipeEnabled: false,
    lazy: false,
    //是否可以左右滑动切换tab
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: '#FF5047',
        inactiveTintColor: '#999999',
        tabStyle: {
            padding: 5,
        },
    },
});

TabNav.navigationOptions = ({ navigation }) => {

    const { key } = navigation.state.routes[navigation.state.index];
    let show = false;
    let title = '';
    let options = {};

    if (key == 'Find') {
        show = true;
        title = '发现';
    } else if (key == 'Study') {
        title = '学习';
        show = true;
    } else if (key == 'User') {
        show = false;
        title = '我的';
        options = {
            headerTintColor: '#ffffff',
            headerStyle: Platform.OS === 'android' ? {
                backgroundColor: '#EB6533',
                borderBottomWidth: 0,
                elevation: 0,
                paddingTop: StatusBar.currentHeight,
            } : {
                backgroundColor: '#EB6533',
                borderBottomWidth: 0,
                elevation: 0,
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontSize: 16,
            },
        }
    }

    return {
        title: title,
        headerShown: show,
        ...options,
    }

};

const MeetTabNav = createBottomTabNavigator({
    Meet: {
        screen: connectComponent(Meet),
        navigationOptions: {
            title: '首页',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.meet.tab.home_on : asset.meet.tab.home} style={{ width: 20, height: 20 }} />;
            },
        },
    },
    MeetLiveChannel: {
        screen: connectComponent(MeetLiveChannel),
        navigationOptions: {
            title: '精彩直播',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.meet.tab.live_on : asset.meet.tab.live} style={{ width: 20, height: 18 }} />;
            },
        },
    },
    MeetCheckPoint: {
        screen: connectComponent(MeetCheckPoint),
        navigationOptions: {
            title: '闯关打卡',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.meet.tab.checkpoint_on : asset.meet.tab.checkpoint} style={{ width: 18, height: 20 }} />;
            },
        },
    },
    MeetMomentChannel: {
        screen: connectComponent(MeetMomentChannel),
        navigationOptions: {
            title: '精彩瞬间',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.meet.tab.moment_on : asset.meet.tab.moment} style={{ width: 20, height: 20 }} />;
            },
        },
    },
    MeetWall: {
        screen: connectComponent(MeetWall),
        navigationOptions: {
            title: '心情墙',
            tabBarIcon: ({ focused }) => {
                return <Image source={focused ? asset.meet.tab.wall_on : asset.meet.tab.wall} style={{ width: 20, height: 20 }} />;
            },
        },
    },
}, {
    initialRouteName: 'Meet',
    swipeEnabled: false,
    lazy: true,
    //是否可以左右滑动切换tab
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: '#FF5047',
        inactiveTintColor: '#999999',
        tabStyle: {
            padding: 5,
        },
    },
});

MeetTabNav.navigationOptions = ({ navigation }) => {
    return {
        title: '海外研讨会',
    }
};

const MainNav = createStackNavigator({
    TabNav: { screen: TabNav },
    MeetTabNav: { screen: MeetTabNav },

    Search: { screen: connectComponent(Search) },
    SearchChannel: { screen: connectComponent(SearchChannel) },

    PublishComment: { screen: connectComponent(PublishComment) },
    PersonalComment: { screen: connectComponent(PersonalComment) },
    Comment: { screen: connectComponent(Comment) },

    CourseCategory: { screen: connectComponent(CourseCategory) },
    CourseChannel: { screen: connectComponent(CourseChannel) },
    VodChannel: { screen: connectComponent(VodChannel) },
    Vod: { screen: connectComponent(Vod) },
    LiveChannel: { screen: connectComponent(LiveChannel) },
    Live: { screen: connectComponent(Live) },
    ActiveLive: { screen: connectComponent(ActiveLive) },
    Audio: { screen: connectComponent(Audio) },
    GraphicChannel: { screen: connectComponent(GraphicChannel) },
    Graphic: { screen: connectComponent(Graphic) },
    VodLink: { screen: connectComponent(VodLink) },
    LivePback: { screen: connectComponent(LivePback) },
    LivePreview: { screen: connectComponent(LivePreview) },
    Ebook: { screen: connectComponent(Ebook) },
    BangDan: { screen: connectComponent(BangDan) },

    TeacherChannel: { screen: connectComponent(TeacherChannel) },
    Teacher: { screen: connectComponent(Teacher) },
    Leader: { screen: connectComponent(Leader) },
    Promotion: { screen: connectComponent(Promotion) },
    LectApply: { screen: connectComponent(LectApply) },
    PushClass: { screen: connectComponent(PushClass) },
    LectCourse: { screen: connectComponent(LectCourse) },
    LectReturn: { screen: connectComponent(LectReturn) },
    LectReward: { screen: connectComponent(LectReward) },

    ArticleChannel: { screen: connectComponent(ArticleChannel) },
    Article: { screen: connectComponent(Article) },
    OfflineSignup: { screen: connectComponent(OfflineSignup) },
    OfflineAct: { screen: connectComponent(OfflineAct) },


    Find: { screen: connectComponent(Find) },
    ActivitySignUp: { screen: connectComponent(ActivitySignUp) },
    Activity: { screen: connectComponent(Activity) },
    Project: { screen: connectComponent(Project) },
    QuestSurvey: { screen: connectComponent(QuestSurvey) },
    ActivityProduction: { screen: connectComponent(ActivityProduction) },
    ScratchCard: { screen: connectComponent(ScratchCard) },

    Rank: { screen: connectComponent(Rank) },
    StudyRecord: { screen: connectComponent(StudyRecord) },
    StudyData: { screen: connectComponent(StudyData) },
    StudyMap: { screen: connectComponent(StudyMap) },
    StudyAnswer: { screen: connectComponent(StudyAnswer) },
    ProvinData: { screen: connectComponent(ProvinData) },
    WinRules: { screen: connectComponent(WinRules) },
    WinRecord: { screen: connectComponent(WinRecord) },
    Smap: { screen: connectComponent(Smap) },

    Message: { screen: connectComponent(Message) },
    MsgList: { screen: connectComponent(MsgList) },
    RemindList: { screen: connectComponent(RemindList) },
    MsgDesc: { screen: connectComponent(MsgDesc) },
    MsgCourse: { screen: connectComponent(MsgCourse) },
    MsgChat: { screen: connectComponent(MsgChat) },


    NickName: { screen: connectComponent(NickName) },
    RealAuth: { screen: connectComponent(RealAuth) },
    UserPersonal: { screen: connectComponent(UserPersonal) },

    FeedBack: { screen: connectComponent(FeedBack) },
    FdBack: { screen: connectComponent(FdBack) },
    FdBackDesc: { screen: connectComponent(FdBackDesc) },

    Report: { screen: connectComponent(Report) },


    UserInfo: { screen: connectComponent(UserInfo) },
    UserCollect: { screen: connectComponent(UserCollect) },
    UserCard: { screen: connectComponent(UserCard) },
    UserReward: { screen: connectComponent(UserReward) },
    UserIntegral: { screen: connectComponent(UserIntegral) },
    UserMedal: { screen: connectComponent(UserMedal) },
    UserFous: { screen: connectComponent(UserFous) },
    MedalDesc: { screen: connectComponent(MedalDesc) },
    UserSignIn: { screen: connectComponent(UserSignIn) },
    UserCert: { screen: connectComponent(UserCert) },
    UserQuestion: { screen: connectComponent(UserQuestion) },
    Certificate: { screen: connectComponent(Certificate) },
    UserBuyCourse: { screen: connectComponent(UserBuyCourse) },
    UserCoupon: { screen: connectComponent(UserCoupon) },
    RprivacyPolicy: { screen: connectComponent(RprivacyPolicy) },

    ResetPwd: { screen: connectComponent(ResetPwd) },
    ShareInvite: { screen: connectComponent(ShareInvite) },
    ActRule: { screen: connectComponent(ActRule) },
    FilpCards: { screen: connectComponent(FilpCards) },


    GrowthEquity: { screen: connectComponent(GrowthEquity) },
    EquityState: { screen: connectComponent(EquityState) },
    AdWebView: { screen: connectComponent(AdWebView) },

    Lucky: { screen: connectComponent(Lucky) },
    LuckyDraw: { screen: connectComponent(LuckyDraw) },
    FilpCards: { screen: connectComponent(FilpCards) },
    ActRule: { screen: connectComponent(ActRule) },

    DownloadChannel: { screen: connectComponent(DownloadChannel) },
    DownloadGallery: { screen: connectComponent(DownloadGallery) },

    Setting: { screen: connectComponent(Setting) },
    SetPwds: { screen: connectComponent(SetPwds) },

    Account: { screen: connectComponent(Account) },
    SetPush: { screen: connectComponent(SetPush) },
    SetMobile: { screen: connectComponent(SetMobile) },
    Blacklist: { screen: connectComponent(Blacklist) },
    Kefu: { screen: connectComponent(Kefu) },
    AnnualBill: { screen: connectComponent(AnnualBill) },

    Address: { screen: connectComponent(Address) },
    DoneAddress: { screen: connectComponent(DoneAddress) },
    Niandu: { screen: connectComponent(Niandu) },

    About: { screen: About },
    AboutUS: { screen: connectComponent(AboutUS) },

    Progress: { screen: Progress },

    CateExam: { screen: connectComponent(CateExam) },
    CertificateSignUp: { screen: connectComponent(CertificateSignUp) },
    DoingExam: { screen: connectComponent(DoingExam) },
    DoingTopic: { screen: connectComponent(DoingTopic) },
    ExerciseResult: { screen: connectComponent(ExerciseResult) },
    HasCourse: { screen: connectComponent(HasCourse) },
    LearnDesc: { screen: connectComponent(LearnDesc) },
    MyTrainClassDetail: { screen: connectComponent(MyTrainClassDetail) },
    MyTrainClassSignUp: { screen: connectComponent(MyTrainClassSignUp) },
    MyTranDetail: { screen: connectComponent(MyTranDetail) },
    OfflineSign: { screen: connectComponent(OfflineSign) },
    PaperAnalysis: { screen: connectComponent(PaperAnalysis) },
    PracticeResult: { screen: connectComponent(PracticeResult) },
    PracticeRoom: { screen: connectComponent(PracticeRoom) },
    ProfesSkill: { screen: connectComponent(ProfesSkill) },
    Review: { screen: connectComponent(Review) },
    TopicSort: { screen: connectComponent(TopicSort) },
    VideoLearn: { screen: connectComponent(VideoLearn) },

    Mail: { screen: connectComponent(Mail) },
    MailDetail: { screen: connectComponent(MailDetail) },
    MailSearch: { screen: connectComponent(MailSearch) },
    Order: { screen: connectComponent(Order) },
    MaiList: { screen: connectComponent(MaiList) },
    OrderDetail: { screen: connectComponent(OrderDetail) },
    MailCate: { screen: connectComponent(MailCate) },
    Settlement: { screen: connectComponent(Settlement) },
    GeneralList: { screen: connectComponent(GeneralList) },
    Cart: { screen: connectComponent(Cart) },
    OrderPay: { screen: connectComponent(OrderPay) },
    CartSettlement: { screen: connectComponent(CartSettlement) },
    ServiceAgreement: { screen: connectComponent(ServiceAgreement) },

    Recharge: { screen: connectComponent(Recharge) },
    RcRecord: { screen: connectComponent(RcRecord) },
    RechargePay: { screen: connectComponent(RechargePay) },
    PayCourse: { screen: connectComponent(PayCourse) },
    PayProps: { screen: connectComponent(PayProps) },

    MeetChannel: { screen: connectComponent(MeetChannel) },
    MeetPaperChannel: { screen: connectComponent(MeetPaperChannel) },
    MeetPaper: { screen: connectComponent(MeetPaper) },
    MeetPaperStat: { screen: connectComponent(MeetPaperStat) },
    MeetMoment: { screen: connectComponent(MeetMoment) },
    MeetMomentVideoChannel: { screen: connectComponent(MeetMomentVideoChannel) },
    MeetMomentVideo: { screen: connectComponent(MeetMomentVideo) },
    MeetMomentGallery: { screen: connectComponent(MeetMomentGallery) },
    MeetWallOwner: { screen: connectComponent(MeetWallOwner) },
    MeetWallPublish: { screen: connectComponent(MeetWallPublish) },

    Forest: { screen: connectComponent(Forest) },
    ForestMoment: { screen: connectComponent(ForestMoment) },
    ForestFriend: { screen: connectComponent(ForestFriend) },
    ForestUser: { screen: connectComponent(ForestUser) },
    ForestAchieve: { screen: connectComponent(ForestAchieve) },
    ForestStep: { screen: connectComponent(ForestStep) },
    ForestKnowledge: { screen: connectComponent(ForestKnowledge) },
    ForestShop: { screen: connectComponent(ForestShop) },
    ForestGoods: { screen: connectComponent(ForestGoods) },
    ForestOrder: { screen: connectComponent(ForestOrder) },
    ForestOrderHistory: { screen: connectComponent(ForestOrderHistory) },

    PkHome: { screen: connectComponent(PkHome) },
    PkRank: { screen: connectComponent(PkRank) },
    PkQuestion: { screen: connectComponent(PkQuestion) },
    PkPublishQuestion: { screen: connectComponent(PkPublishQuestion) },
    PkCard: { screen: connectComponent(PkCard) },
    PkSpecialChannel: { screen: connectComponent(PkSpecialChannel) },
    PkSpecial: { screen: connectComponent(PkSpecial) },
    PkEntry: { screen: connectComponent(PkEntry) },
    PkFriend: { screen: connectComponent(PkFriend) },
    PkTeam: { screen: connectComponent(PkTeam) },

    Ask: { screen: connectComponent(Ask) },
    AskSearch: { screen: connectComponent(AskSearch) },
    WriteQust: { screen: connectComponent(WriteQust) },
    AskInvite: { screen: connectComponent(AskInvite) },
    UserAsk: { screen: connectComponent(UserAsk) },
    AskQust: { screen: connectComponent(AskQust) },
    Question: { screen: connectComponent(Question) },
    UserQust: { screen: connectComponent(UserQust) },

}, {
    defaultNavigationOptions: {
        headerTintColor: '#000000',
        headerBackTitle: null,
        headerBackTitleVisible: false,
        headerStyle: Platform.OS === 'android' ? {
            paddingTop: StatusBar.currentHeight,
            height: StatusBar.currentHeight + 44,
            backgroundColor: '#ffffff',
            borderBottomWidth: 0,
            elevation: 0,
        } : {
            backgroundColor: '#ffffff',
            borderBottomWidth: 0,
            elevation: 0,
        },
        headerTitleStyle: {
            textAlign: 'center',
            fontSize: 16,
        },
    },
})

const PassPortNav = createStackNavigator({
    PassPort: { screen: connectComponent(PassPort) },
    SetPwd: { screen: connectComponent(SetPwd) },
    ForgetPwd: { screen: connectComponent(ForgetPwd) },
    BindAccount: { screen: connectComponent(BindAccount) },
    PrivacyPolicy: { screen: connectComponent(PrivacyPolicy) },
}, {
    defaultNavigationOptions: {
        headerTintColor: '#000000',
        headerBackTitle: null,
        headerBackTitleVisible: false,
        headerStyle: Platform.OS === 'android' ? {
            paddingTop: StatusBar.currentHeight,
            height: StatusBar.currentHeight + 44,
            backgroundColor: '#ffffff',
            borderBottomWidth: 0,
            elevation: 0,
        } : {
            backgroundColor: '#ffffff',
            borderBottomWidth: 0,
            elevation: 0,
        },
        headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
            fontSize: 16,
        },
    },
})

const RootNav = createStackNavigator({
    MainNav: MainNav,
    PassPortNav: PassPortNav,
}, {
    mode: 'modal',
    headerMode: 'none'
})

export const AppNav = createAppContainer(RootNav);
