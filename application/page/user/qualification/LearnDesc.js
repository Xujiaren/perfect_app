import React, { Component } from 'react'
import { ActivityIndicator, Text, View, Platform, StyleSheet } from 'react-native'

import VodPlayer from '../../../component/vod/VodPlayer';
import theme from '../../../config/theme';

class LearnDesc extends Component {

    static navigationOptions = {
        title:'活动报名',
        headerRight: <View/>,
    };

    static navigationOptions = ({navigation}) => {
        const course = navigation.getParam('stu', {courseName: '课程详情'});
        const fullscreen = navigation.getParam('fullscreen', false);

        let courseName = '课程详情'

        if(course.courseName != '' && course.courseName != undefined){
            courseName = course.courseName
        }

        return {
            headerShown: !fullscreen,
            title: courseName,
            headerRight: <View/>,
		}
    }


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.course = navigation.getParam('stu', {});

        this.sync = 0;

        this.state = {

            playUrl: '',
            duration: 0,
            mediaId:'',

        }

        this._onPlay = this._onPlay.bind(this);
        this._onSync = this._onSync.bind(this);
        this._onNext = this._onNext.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {info} = nextProps;

        if (info !== this.props.info) {
            this.course = info;

            this.setState({
                loaded: true,
                mediaId:info.mediaId,
            }, () => {
                this._onPlay();
            })
        }
    }

    componentDidMount() {
        const {navigation,actions} = this.props;

        actions.course.info(this.course.courseId);
    }

    _onPlay(){
        const {actions} = this.props;
        actions.course.verify({
            media_id: this.course.mediaId,
            resolved: (data) => {
                this.setState({
                    duration: data.duration,
                    playUrl: data.m38u,
                })
            },
            rejected: (res) => {
                
            },
        })
    }

    _onSync(duration){
        const {actions} = this.props;


        if (this.sync % 16 == 0) {
            actions.course.learn({
                course_id: this.course.courseId,
                chapter_id: 0,
                cchapter_id: 0,
                duration: duration,
                course_name:this.course.courseName,
                resolved: (data) => {
                },
                rejected: (res) => {
                    
                },
            })
        }

        this.sync++;
    }

    _onNext(){

    }


    render() {

        const {navigation} = this.props;
        const {loaded,playUrl,duration,mediaId} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )

        return (
            <View style={[styles.container, styles.bg_white]}>
                <VodPlayer 
                    ref={e => { this.player = e; }}
                    source={{
                        cover: this.course.courseImg,
                        key: mediaId,
                        url: playUrl,
                        duration: duration,
                    }}
                    navigation={navigation}
                    onEnd={() => {
                        // this._onNext();
                        this.props.actions.course.learn({
                            course_id: this.course.courseId,
                            chapter_id: 0,
                            cchapter_id: 0,
                            duration:this.course.duration,
                            course_name:this.course.courseName,
                            resolved: (data) => {
                            },
                            rejected: (res) => {
                                
                            },
                        })
                    }}

                    onProgress={(duration) => {
                        this._onSync(duration);
                    }}

                    onFullscreen={(full) => {
                        navigation.setParams({fullscreen:full})
                    }}
                />
                <View style={[styles.d_flex ,styles.fd_c ,styles.pl_15 ,styles.pr_15 ,styles.mt_20]}>
                    <Text style={[styles.lg20_label ,styles.c33_label ,styles.fw_label]}>{this.course.courseName}</Text>
                    <Text style={[styles.gray_label ,styles.sm_label ,styles.mt_5]}>共1讲  {this.course.hit}人已学</Text>
                </View>

                <View style={[styles.pl_15 ,styles.pr_15]}>
                    <View style={[styles.pb_15 ,styles.pt_10 ,styles.d_flex ,styles.fd_c ]}>
                        <Text style={[styles.lg18_label ,styles.c33_label ,styles.fw_label]}>课程简介</Text>
                        <Text style={[styles.default_label ,styles.lh20_label ,styles.pt_10 ,styles.gray_label]}>{this.course.content}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
})

export const LayoutComponent = LearnDesc;

export function mapStateToProps(state) {
	return {
        info: state.course.info,
	};
}


