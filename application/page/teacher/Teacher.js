import React, { Component } from 'react';
import { Text, View ,StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList,Linking, Alert} from 'react-native';

import _ from 'lodash';
import Carousel from 'react-native-looped-carousel';
import * as WeChat from 'react-native-wechat-lib';

import HudView from '../../component/HudView';
import Tabs from '../../component/Tabs';
import VodCell from '../../component/cell/VodCell';

import theme from '../../config/theme';


class Teacher extends Component {
    static navigationOptions = {
        title:'讲师主页',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = props;
        this.teacher = navigation.getParam('teacher', {});

        this.galleryList = [];
        this.aitems = [];
        this.category = [];
        this.course = [];

        this.state = {
            loaded: false,
            isFollow: false,
            status:0,
        };

        this._onFollow = this._onFollow.bind(this);
        this._onSelect = this._onSelect.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);

        this._onLink = this._onLink.bind(this)
        this._toWxchat = this._toWxchat.bind(this)
    }

    componentWillReceiveProps(nextProps){
        const { teacher} = nextProps;
        if (teacher !== this.props.teacher){

            this.galleryList = teacher.teacher.galleryList;
            this.category = teacher.category;
            this.course = teacher.course;

            this.setState({
                loaded: true,
                isFollow: teacher.teacher.isFollow
            })
        }
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.teacher.teacher(this.teacher.teacherId);
    }
    componentWillUnmount(){
  
    }
    _onFollow(){
        const {actions,navigation,user} = this.props;
        const {isFollow} = this.state;


        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if (isFollow) {
                
                actions.teacher.removefollow({
                    teacherId: this.teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('取消关注', 1);
    
                        this.setState({
                            isFollow: false,
                        });
        
                    },
                    rejected: (res) => {
                        
                    },
                });
    
            } else {

                actions.teacher.follow({
                    teacherId: this.teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);
    
                        this.setState({
                            isFollow: true,
                        });
        
                    },
                    rejected: (res) => {
                        
                    },
                });
            }
        }


        
    }

    _onSelect(index){
        this.setState({
            status: index,
        });
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _onLink(courseId,courseName,ctype){

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {

                if(ctype === 2 || ctype === 0){

                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/courseDesc?course_id=' + courseId +'&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });

                } else if(ctype === 1){

                    WeChat.launchMiniProgram({
                        userName: "gh_7bd862c3897e", // 拉起的小程序的username
                        miniProgramType: 0, // 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
                        path: '/pages/index/audioDesc?course_id=' + courseId +'&courseName=' + courseName // 拉起小程序页面的可带参路径，不填默认拉起小程序首页
                    });
                    
                }   
                
            } else {
                Alert.alert('温馨提示', '请先安装微信');
            }
        })
    }

    _toWxchat(courseId,courseName,ctype){
        Alert.alert('课程提示','此课程只能在微信小程序观看',[
            { text: '取消', onPress: () => {
                
            }
        },{
            text: '跳转', onPress: () => {
                this._onLink(courseId,courseName,ctype)

            }
        }])
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const course = item.item;

        if(course.ctype === 3){
            return <VodCell style={[styles.ml_20, styles.mr_20]} course={course} key={'channel_' + course.courseId} onPress={(course) => navigation.navigate('Graphic', {course: course})}/>
        }   else if(course.ctype === 2 || course.ctype === 0){
            return <VodCell course={course} key={'channel_' + course.courseId}  style={[styles.ml_20, styles.mr_20]}
                        onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName,course.ctype) : navigation.navigate('Vod', {course: course})}
                    />
        }   else if(course.ctype === 1){

            return <VodCell course={course} key={'channel_' + course.courseId}  style={[styles.ml_20, styles.mr_20]}
                        onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName,course.ctype) : navigation.navigate('Audio', {course: course})}
                    />
        } 

    }

    _renderHeader() {
        const {isFollow, status} = this.state;

        let cateItems = new Array('全部');
        for (let i = 0; i < this.category.length; i++){
            cateItems.push(this.category[i].categoryName);
        }

        return (
            <View style={[styles.teachHead]}>
                <View style={[styles.swiper]}>
                    <Carousel
                        useScrollView={true}
                        delay={5000}
                        style={styles.swpiceImg}
                        autoplay
                        swiper
                        bullets={true}
                        pageInfo={false}
                        bulletStyle={{//未选中的圆点样式
                            backgroundColor: '#ffffff',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            borderColor: '#ffffff',
                            margin:6,
                            opacity:0.49,
                        }} 
                        chosenBulletStyle={{    //选中的圆点样式
                            backgroundColor: '#ffffff',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            margin:6,
                        }}
                    >
                        {
                            this.galleryList.map((img,index)=>{
                                return (
                                    <View key={index}>
                                        <Image key={index} style={styles.swpiceImg} source={{uri:img.fpath}}/>
                                    </View>
                                );
                            })
                        }
                    </Carousel>
                </View>
                <View style={[styles.teach_head ,styles.bg_white ,styles.d_flex ,styles.fd_c ,styles.p_10]}>
                    <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb]}>
                        <Text style={[styles.lg18_label ,styles.c33_label ,styles.fw_label]}>讲师：{this.teacher.teacherName}</Text>
                        <TouchableOpacity style={[styles.focuson]} onPress={this._onFollow} >
                            <Text style={[styles.default_label ,styles.red_label]}>{isFollow ? '已关注' : '+ 关注'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.default_label, styles.tip_label,styles.mt_20, styles.lh18_label]}>{this.teacher.honor.split('&').join('\n')}</Text>
                    <Text style={[styles.default_label,styles.tip_label,styles.lh20_label]}>{this.teacher.content}</Text>
                </View>

                {
                    this.course.length > 0 ?
                    <View style={[styles.atabs,styles.border_bt, styles.mb_20]}>
                        <Tabs items={cateItems}  selected={status} onSelect={this._onSelect} type={0}  />
                    </View>
                :null}
                
            </View>
        )
    }

    render() {
        const {loaded, status} = this.state;
        
        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )

        let courses = [];

        this.course.map((course, index) => {
            if (status == 0 || this.category[status - 1].categoryId == course.categoryId) {
                courses.push(course);
            }
        })

        return (
            <View style={[styles.container, styles.bg_white]}>
                
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={courses}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                />
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    focuson:{
        width:53,
        height:22,
        backgroundColor:'#ffffff',
        borderRadius:5,
        borderWidth:1,
        borderColor:'rgba(244,98,63,1)',
        borderStyle:'solid',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    recomm_items:{
        paddingTop:20,
    },
    item_cover:{
        width:129,
        height:72,
        borderRadius:5,
        backgroundColor:'#f5f5f5',
    },
    item_head_cover:{
        width:10,
        height:10,
        borderRadius:5,
    },
    view_icon:{
        width:14,
        height:14,
    },
    atabs:{
        borderTopColor:'#F5F5F5',
        borderTopWidth:8,
        borderStyle:'solid',
    },
    swiper:{
        width:theme.window.width,
        height:208,
        backgroundColor:'#fafafa',
    },
    swpiceImg:{
        width:theme.window.width,
        height:208,
        backgroundColor:'#fafafa',
    },
});

export const LayoutComponent = Teacher;

export function mapStateToProps(state) {
	return {
        teacher:state.teacher.teacher,
        user: state.user.user,
	};
}

