import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity,ScrollView,Dimensions,ProgressViewIOS,ProgressBarAndroid,Platform,ImageBackground} from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';

import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import HudView from '../../component/HudView';
const slideWidth = Dimensions.get('window').width;

class GrowthEquity extends Component {
    static navigationOptions = {
        title:'成长权益',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.userTask = [];
        this.state = {
            userlevel:[],
            integral:0,
            prestige:0,
            avatar:0,
            leveldot:0,
            level:0,
            equityList:[],
            activeSlide:0,
        };

        this._onTask = this._onTask.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onSwiper = this._onSwiper.bind(this);
    }

    componentWillReceiveProps(nextProps) {
		const {usertask,userlevel} = nextProps;
        const {level} = this.state;

		if (usertask !== this.props.usertask) {
            console.log(usertask,'usertask');
            
			this.userTask = usertask;
        }

        if (userlevel !== this.props.userlevel) {
            this.setState({
                userlevel:userlevel,
                equityList:userlevel[level].equityList,
            },()=>{
                setTimeout(() => {
                    this._onSwiper(this.state.level)
                }, 1000);
            });
        }
	}

    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state;
        this.setState({
            integral:params.integral,
            prestige:params.prestige,
            avatar:params.avatar,
            leveldot:params.nowLevel,
            level:params.nowLevel
        });

        // const carouselCurrIndex = this._carousel.currentIndex;
        // this._carousel.snapToItem(3) // 显示第二个item
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.user.usertask();
        actions.user.userlevel();

    }



    _onTask(task){

        const {navigation} = this.props;
        let taskLink = task.link;

        let toPage = '';
        let type = 0;

        if (taskLink.indexOf('/index/index') !== -1){
            toPage = 'Home';
        } else if (taskLink.indexOf('/user/realAuth') !== -1){
            toPage = 'RealAuth';
        } else if (taskLink.indexOf('/user/userInfo') !== -1){
            toPage = 'UserInfo';
        } else if (taskLink.indexOf('/index/search') !== -1){
            toPage = 'Search';
            type = 1;
        } else if(task.taskName=='资格认证'){
            toPage = 'ProfesSkill';
            navigation.navigate(toPage);
        }else if(task.taskName=='O2O培训'){
            toPage = 'ProfesSkill';
            navigation.navigate(toPage);
        }else if(task.taskName=='趣味探索'){
            this.refs.hud.show('暂未开启', 1);
            return;
        }else if(taskLink.indexOf('/comPages/pages/ask/ask') !== -1){
            toPage = 'Ask';
        }

        if (taskLink && type !== 1){

            navigation.navigate(toPage);
        }

        if(taskLink && type === 1){
            navigation.navigate(toPage,{keyword:''});
        }
    }

    _renderItem({item, index}){
        const {integral,prestige,leveldot} = this.state;
        let percent_val = 0;//progress值
        let prestige_tips = '';//完成 当前位置  未完成
        let prestige_num = '';

        if (prestige > item.beginPrestige){
            if (prestige > item.endPrestige){
                percent_val = 100;
                prestige_tips = '已完成';
            } else {
                percent_val = (parseInt(prestige)/item.endPrestige) * 100;
                prestige_tips = '当前等级';
                prestige_num = `还差 ${item.endPrestige - parseInt(prestige) + 1} 点升级`;
            }
        } else {
            percent_val = 0;
            prestige_tips = '未完成';
            prestige_num = `还需 ${item.endPrestige -  parseInt(prestige) + 1} 点升级`;
        }


        return (
            <View style={styles.slide}>
                {this._renderImg(index)}
                <View style={[styles.level]}>
                    <View style={styles.level_tips}>
                        <Text style={[styles.forangle_label, styles.sm8_label]}> {prestige_tips}</Text>
                    </View>
                    <View style={[styles.progress, styles.fd_c,  styles.pt_25 ]}>
                        <Text style={[styles.lg20_label ,styles.fw_label]}>Lv.{item.levelName}</Text>
                        <Text style={[styles.sm_label ,styles.pb_5 ,styles.fw_label]}>当前成长值{prestige}</Text>
                        {
                            Platform.OS === 'android' ?
                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} progress={(percent_val / 100)} styleAttr="Horizontal"/>
                            :
                            <ProgressViewIOS progress={(percent_val / 100)}  style={{width:'100%',height:4}} trackTintColor={'#EFEFEF'} progressTintColor={'#212128'} />
                        }
                        <View style= {[styles.fd_r, styles.jc_sb,styles.pt_5]}>
                            <Text style={[styles.smm_label ,styles.c33_label ,styles.fw_label]}>Lv.{index}</Text>
                            <Text style={[styles.smm_label ,styles.c33_label ,styles.fw_label]}>{prestige_num}</Text>
                            <Text style={[styles.smm_label ,styles.c33_label ,styles.fw_label ]}>Lv.{index + 1}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _renderImg(index){
        let url = asset.growth.g_lv0;
        if((index +  7 )% 7 === 0){
            url = asset.growth.g_lv0;
        } else if((index +  7 )% 7 === 1){
            url = asset.growth.g_lv1;
        } else if((index +  7 )% 7 === 2){
            url = asset.growth.g_lv2;
        } else if((index +  7 )% 7 === 3){
            url = asset.growth.g_lv3;
        } else if((index +  7 )% 7 === 4){
            url = asset.growth.g_lv4;
        } else if((index +  7 )% 7 === 5){
            url = asset.growth.g_lv5;
        } else if((index +  7 )% 7 === 6){
            url = asset.growth.g_lv6;
        }

        return (
            <Image source={url} style={styles.swiper_img}  />
        );
    }

    _onSwiper(index){
        const {userlevel} = this.props;

        this.setState({
            level:index,
            equityList:userlevel[index].equityList,
        });
    }

    render() {
        const {navigation} = this.props;
        const {userlevel,integral,prestige,avatar,leveldot,equityList,level} = this.state;


        if(this._carousel !== undefined){
            this._carousel.snapToItem(level)
        }

        return (

            <View style={styles.container}>
                <ScrollView style={styles.equitycons}
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                >
                    <ImageBackground style={styles.rectangle}  source={asset.bg.equity_bg} >
                        <View style={[styles.headbox]}>
                            <View style={[styles.head  ,styles.fd_r ,styles.jc_sb ]}>
                                <View style={[styles.fd_c ,styles.ai_ct]}>
                                    <Text style={[styles.lg30_label ,styles.dorangle_label]}>{integral}</Text>
                                    <Text style={[styles.sm_label ,styles.white_label ]}>学分</Text>
                                </View>
                                <View style={[styles.head_cover_boxs]}>
                                    <Image source={{uri:avatar}}  style={[styles.head_cover]} />
                                </View>
                                <View style={[styles.fd_c ,styles.ai_ct]}>
                                    <Text style={[styles.lg30_label ,styles.dorangle_label]}>{prestige}</Text>
                                    <Text style={[styles.sm_label ,styles.white_label ]}>成长值</Text>
                                </View>
                            </View>
                            <View style={[styles.linebox ,styles.mt_20,styles.mb_10]}>
                                <View style={[styles.lines]}></View>
                                <View style={[styles.levesbox ,styles.fd_r ,styles.ai_ct ,styles.jc_sb]}>
                                    {
                                        userlevel.map((item,index)=>{
                                            const on  = index < leveldot + 1;
                                            return (
                                                <View style={[styles.leves_item  ,styles.ai_ct ,styles.fd_c]} key={'levels' + index}>
                                                    {
                                                        on ?
                                                        <LinearGradient colors={['rgba(255,228,176,1)', 'rgba(212,176,127,1)']}  
                                                        style={[styles.leves_dot, styles.bgrangle]}></LinearGradient>
                                                    : 
                                                        <View style={[styles.leves_dot,styles.bg_rblack ]}></View>
                                                    }
                                                    <Text style={[styles.sm_label ,on ? styles.dorangle_label : styles.tip_label ,styles.mt_10]}>Lv.{index}</Text>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                            </View>
                            <Carousel
                                useScrollView={true}
                                ref={(c) => { this._carousel = c; }}
                                data={userlevel}
                                renderItem={this._renderItem}
                                sliderWidth={slideWidth}
                                firstItem={0} 
                                currentIndex={this.state.level}
                                itemWidth={250}
                                layoutCardOffset={18}
                                activeSlideOffset={0}
                                removeClippedSubviews={false}
                                // onSnapToItem={(index) => this.setState({ activeSlide: 3 }) }
                                onSnapToItem = {(index) => this._onSwiper(index)}
                            />
                        </View>
                    </ImageBackground>
                    <View >
                        <View style={[styles.privilege,styles.fd_c,styles.m_10,]}>
                            <View style={[styles.fd_r, styles.ai_ct ,styles.jc_sb,styles.pl_15,styles.pr_15]}>
                                <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label]}>Lv.{level}特权</Text>
                                <TouchableOpacity style={[styles.fd_r,styles.ai_ct]}
                                    onPress={()=>navigation.navigate('EquityState',{equityList:equityList})}
                                >
                                    <Text style={[styles.tip_label ,styles.default_label ,styles.fw_label]} >权益详情</Text>
                                    <Image source={asset.arrow_right}  style={[styles.arrow_right]}/>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.fd_r ,styles.ai_ct  ,styles.pt_12 ,styles.pb_12,styles.pr_10,styles.pl_10]}>
                                {
                                    equityList.map((equity,index)=>{
                                        return (
                                            <TouchableOpacity style={[styles.d_flex ,styles.fd_c  ,styles.ai_ct ,styles.equity_item]} key={'equity' + index} 
                                                onPress={()=>navigation.navigate('EquityState',{equityList:equityList,equityId:equity.equityId})}        
                                            >
                                                <Image style={[styles.priv_icon]} source={{uri:equity.equityImg}}  />
                                                <Text style={[styles.default_label ,styles.pt_10 ,styles.c33_label ,styles.fw_label]}>{equity.equityName}</Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    <View style={[styles.noviebox ,styles.pt_15 ,styles.pl_25 ,styles.pr_25 ,styles.pb_25]}>
                            <Text style={[styles.lg_label  ,styles.pb_10  ,styles.c33_label ,styles.fw_label]}>会员任务</Text>
                            <View style={[styles.novice]}>
                                {
                                    this.userTask.map((task,index)=>{
                                        const on  = this.userTask.length - 1 === index;
                                        return (
                                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]} key={'task' + index}>
                                                <Image source={{uri:task.taskImg}} style={[styles.task_cover]} />
                                                <View style={[styles.novice_item ,styles.fd_r ,styles.jc_sb ,styles.ai_ct ,styles.col_1 ,on ? null : styles.border_bt ,styles.pb_20 ,styles.pt_20]}>
                                                    <View style={[styles.d_flex ,styles.fd_c ,styles.ml_10]}>
                                                        <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                                            <Text style={[styles.default_label ,styles.c33_label]}>{task.taskName}</Text>
                                                            {
                                                                task.status === 1 ?
                                                                <View style={[styles.grothbtns ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct ,styles.ml_5]}>
                                                                    <Text style={[styles.smm_label ,styles.dorangle_label]}>成长值</Text>
                                                                </View>
                                                            : null}
                                                            <Text style={[styles.dorangle_label ,styles.sm_label ,styles.ml_5]}>+{task.integral}</Text>
                                                        </View>
                                                        <Text style={[styles.sm_label ,styles.tip_label,styles.mt_2]}>{task.taskSummary}</Text>
                                                    </View>
                                                    {
                                                        task.status === 0 ?
                                                        <TouchableOpacity style={[styles.level_btn ,styles.d_flex ,styles.jc_ct ,styles.ai_ct ]}  onPress={()=> this._onTask(task)}>
                                                            <Text style={[styles.sm_label ,styles.white_label]}>去完成</Text>
                                                        </TouchableOpacity>
                                                        :
                                                        <View style={[styles.level_btns ,styles.d_flex ,styles.jc_ct ,styles.ai_ct ]} >
                                                            <Text style={[styles.sm_label ,styles.white_label]}>已完成</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </View>
                </ScrollView>
                <HudView ref={'hud'} />
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    rectangle:{
        width:theme.window.width,
        height:310,
    },
    equity_bg:{
        width:theme.window.width,
        height:310,
    },
    equitycons:{
        flex:1,
        position:'relative',
    },
    headbox:{
        width:theme.window.width,
        height:272,
    },
    head:{
        paddingTop:25,
        paddingLeft:60,
        paddingRight:60,
    },
    head_cover_boxs:{
        width:62,
        height:62,
        borderRadius:31,
        borderWidth:2,
        borderStyle:'solid',
        borderColor:'#DBB177',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    head_cover:{
        width:60,
        height:60,
        borderRadius:30,
    },
    linebox:{
        width:'100%',
    },
    lines:{
        width:'100%',
        height:8,
        backgroundColor:'#414141',
    },
    levesbox:{
        paddingLeft:20,
        paddingRight:20,
    },
    leves_item:{
        marginTop:-9,
    },
    leves_dot:{
        width:10,
        height:10,
        borderRadius:5,
        shadowOffset:{  width: 2,  height:0},
        shadowColor: 'rgba(83,83,83,1)',
        shadowOpacity: 1.0,
    },
    privilege:{
        backgroundColor:'#ffffff',
        paddingTop:16,
        marginTop:-30,
        borderWidth:1,
        borderColor:'rgba(255, 255, 255, 0)',
        borderRadius:5,
        paddingBottom:10,
        shadowOffset:{  width: 2,  height:3},
        shadowColor: '#000000',
        shadowOpacity: 0.4,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    priv_icon:{
        width:40,
        height:40,
        borderRadius:20,
    },
    arrow_right:{
        width:6,
        height:11,
        marginLeft: 5,
    },
    equity_item:{
        width:'25%',
    },
    noviebox:{
        backgroundColor:'#ffffff',
        margin:15,
        borderColor:'rgba(255,255,255,0)',
        borderRadius:5,
        shadowOffset:{  width: 2,  height:3},
        shadowColor: '#000000',
        shadowOpacity: 0.4,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    task_cover:{
        width:30,
        height:30,
        borderRadius:15,
    },
    level_btn:{
        width:57,
        height:25,
        backgroundColor:'#DBB177',
        borderRadius:14,
    },
    level_btns:{
        width:57,
        height:25,
        backgroundColor:'#D3D3D3',
        borderRadius:14,
    },
    grothbtns:{
        paddingLeft:6,
        paddingRight:6,
        height:16,
        borderRadius:9,
        borderWidth:1,
        borderColor:'#DBB177',
        borderStyle:'solid',
    },
    slide:{
        width:250,
        height:110,
        borderRadius:6,
        backgroundColor:'#ffffff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    swiper_img:{
        width:250,
        height:110,
        borderRadius:6
    },
    level:{
        position: 'absolute',
        top:0,
        height:110,
        width:'100%',
        borderRadius:5,
        // backgroundColor:'#111111',
        // opacity:0.1,
    },
    progress:{
        width:155,
        paddingLeft:16,
    },
    progress_w:{
        width:155,
        borderRadius:100,
        overflow:'hidden',
    },
    level_tips:{
        height:13,
        width:38,
        backgroundColor:'rgba(51,51,51,1)',
        borderTopRightRadius:50,
        borderBottomRightRadius:50,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:11,
        left:-5,
    },

    bgrangle:{
        backgroundColor:'rgba(255,228,176,1) ',
        shadowOffset:{  width: 1,  height:1},
        shadowColor: 'rgba(211,171,107,1)',
        shadowOpacity: 1.0,
        elevation: 1,//安卓，让安卓拥有阴影边框
    }
});


export const LayoutComponent = GrowthEquity;

export function mapStateToProps(state) {
	return {
        usertask:state.user.usertask,
        userlevel:state.user.userlevel,
	};
}
