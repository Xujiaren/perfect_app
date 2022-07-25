import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity, Keyboard} from 'react-native';
import _ from 'lodash';

import HudView from '../../component/HudView';
import Picker from 'react-native-picker';
import {liveday} from '../../util/common'
import { config, asset, theme, iconMap } from '../../config';
import request from '../../util/net';

class LivePreview extends Component {
    static navigationOptions = {
        title:'直播预告',
        headerRight: <View/>,
    };
    constructor(props){
        super(props);
        this.state={
            types:['全部','课程直播','活动直播'],
            ttype:'全部',
            areas:['全部'],
            area:'全部',
            ttype_ctype:-1,
            live:[],
            region: [],
            regionId: 0,
        }
    }
    live = []

    componentDidMount() {
        this._onRefresh()
    }

    componentWillReceiveProps(nextProps){
        const {live} = nextProps;

        if (live !== this.props.live) {
            // this.live = live.items.concat(live.items);
            this.live = live.items
        }
    }

    _onRefresh = () => {
        const {actions} = this.props;
        actions.user.user();
        actions.course.live(this.state.ttype_ctype,0, 0,this.state.regionId);
        this.getRegion()
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
    _onBook = (course) => {
        const {user, navigation, actions} = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            actions.course.book({
                course_id: course.courseId,
                resolved: (data) => {
                    this.refs.hud.show('预约成功', 1);
                    actions.course.live(this.state.ttype_ctype,0, 0,this.state.regionId);

                    this.setState({
                        isLive:true,
                    })
                },
                rejected: (msg) => {

                }
            })
        }
    }
    onType=()=>{
        Keyboard.dismiss();

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择类型',
            pickerData:this.state.types,
            selectedValue: [this.state.types],
            onPickerConfirm: pickedValue => {
                let lst = -1
                if(pickedValue[0]=='课程直播'){
                    lst =2
                }else if(pickedValue[0]=='活动直播'){
                    lst = 52
                }
                this.setState({
                    ttype:pickedValue[0],
                    ttype_ctype:lst
                },()=>{
                    this._onRefresh()
                })
            },
        });

        Picker.show();
    }
    onArea=()=>{
        Keyboard.dismiss();

        Picker.init({
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '地区',
            pickerData:this.state.areas,
            selectedValue: [this.state.types],
            onPickerConfirm: pickedValue => {
                console.log(pickedValue[0])
                let id = 0
                let area = pickedValue[0]
                let lst = this.state.areas.filter(item=>item==area).length
                if (pickedValue[0] == '全部'||lst==0) {
                    area = '全部'
                    id = 0
                }else{
                    id = this.state.region.filter(item => item.regionName == pickedValue)[0].regionId
                }
                this.setState({
                    area: area,
                    regionId: id
                }, () => {
                    this.props.actions.course.live(this.state.ttype_ctype,0, 0,this.state.regionId);
                })
            },
        });

        Picker.show();
    }
    _renderLive = () => {
        const {navigation} = this.props;
        const{ttype,area}=this.state
        return (
            <View style={[styles.live_box,styles.ml_15,styles.mr_15]}>
                <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct,styles.mb_10,styles.mt_25,{width:'100%',height:36}]}>
                    <TouchableOpacity style={[styles.btnss,styles.fd_r,styles.jc_sb,styles.ai_ct]} onPress={this.onArea}>
                        <Text>{area}</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.btnss,styles.fd_r,styles.jc_sb,styles.ai_ct]} onPress={this.onType}>
                        <Text>{ttype}</Text>
                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.live.map((course, index)=> {
                        return (
                            <TouchableOpacity style={[styles.livecons,styles.p_15,styles.bg_white,styles.circle_5,styles.mt_15]} key={'live' + index} onPress={() => navigation.navigate(course.ctype == 52 ? 'ActiveLive' : 'Live', { course: course })}>
                                <View style={[styles.fd_r,styles.jc_sb,styles.pb_10,styles.border_bt]}>
                                    {
                                        course.liveStatus === 0 && course.roomStatus === 0 ?
                                        <Text style={[styles.gray_label,styles.sm_label]}>{liveday(course.beginTime)} </Text>
                                    :null}
                                    {
                                        course.liveStatus === 1 && course.roomStatus === 2 ?
                                        <Text style={[styles.red_label,styles.sm_label]}>直播中</Text>
                                    :null}

                                    {
                                        (course.liveStatus === 2  && course.roomStatus === 0) || (course.liveStatus === 2  && course.roomStatus === 1) ?
                                        <Text style={[styles.gray_label,styles.sm_label]}>休息中</Text>
                                    :null}
                                    {
                                        course.liveStatus === 2  && course.roomStatus === 3 ? 
                                        <Text style={[styles.red_label,styles.sm_label]}>已结束</Text>
                                    :null}

                                    {
                                        course.liveStatus === 0 && course.roomStatus === 0 ?
                                        <Text style={[styles.sm_label,styles.tip_label]}>{ course.bookNum + '人已预约' }</Text>
                                        :
                                        <Text style={[styles.sm_label,styles.tip_label]}>{ course.hit + '人在线' }</Text>
                                    }
                                </View>
                                <View style={[styles.pt_10]}>
                                    <Text style={[styles.c33_label, styles.lg_label, styles.fw_label]}>{course.courseName}</Text>
                                    <View style={[styles.fd_r, styles.jc_sb, styles.pt_5, styles.ai_end]}>
                                        <Text style={[styles.sm_label, styles.gray_label, styles.live_summary]}>{course.summary}</Text>
                                        {
                                            course.liveStatus === 0 && course.roomStatus === 0  && !course.book  ? 
                                            <TouchableOpacity style={[styles.live_ofbtn]} onPress={() => this._onBook(course)} disabled={course.book}>
                                                <Text style={[styles.sm_label,styles.white_label]}>预约</Text>
                                            </TouchableOpacity>
                                            :
                                            <View style={[styles.live_btn]}>
                                                <Text style={[styles.sm_label,styles.red_label]}>进入</Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        )
    }


    render() {
        return (
            <View style={styles.container}>
                {this._renderLive()}
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    live_box:{
        shadowOffset:{  width: 0,  height:2},
        shadowColor: 'rgba(233,233,233, 1.0)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    livecons:{
        borderRadius:5,
        backgroundColor:'#ffffff',
        shadowOffset:{  width: 0,  height:3},
        shadowColor: 'rgba(240,240,240,1)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    live_btn:{
        borderWidth:1,
        borderColor:'#F4623F',
        borderStyle:'solid',
        width:54,
        height:23,
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    live_ofbtn:{
        width:54,
        height:23,
        borderRadius:5,
        backgroundColor:'#F4623F',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    arrow_right:{
        width: 6,
        height: 11,
        marginLeft:5
    },
    item_h:{
        height: 36,
        
    },
    btnss:{
        width:150,
        height:36,
        backgroundColor:'#FFFFFF',
        borderRadius:5,
        paddingLeft:10,
        paddingRight:10,
        shadowOffset:{  width: 0,  height:3},
        shadowColor: 'rgba(240,240,240,1)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
    }
});

export const LayoutComponent = LivePreview;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        live: state.course.live,
	};
}


