import React, { Component } from 'react';
import { View, Text ,StyleSheet,TouchableOpacity, ScrollView,Linking, Alert} from 'react-native';
import * as WeChat from 'react-native-wechat-lib';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import Tabs from '../../component/Tabs';
import VodCell from '../../component/cell/VodCell';

import {theme, iconMap} from '../../config';

class CourseCategory extends Component {
    
    static navigationOptions = {
        title:'课程分类',
    };

    constructor(props) {
        super(props);

        this.category = [];
        this.citems = [];

        this.sort = ['最热','最新'];
        this.ctype = ['全部课程','视频课程','音频课程','直播回放','图文课程'];
        this.typeList=['全部','学分','免费'];
        this.page = 0;
        this.pages = 1;

        this.state = {
            sort: 1,
            ctype: 0,
            type:0,
            cindex: 0,
            ccindex: 0,

            total: 0,

            refreshState: RefreshState.Idle,
            ctip: false,
            stip: false,
            tip:false,
        };

        this._onSort = this._onSort.bind(this);
        this._onSortToggle = this._onSortToggle.bind(this);
        
        this._onCtype = this._onCtype.bind(this);
        this._onCtypeToggle = this._onCtypeToggle.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);

        this._onLink = this._onLink.bind(this)
        this._toWxchat = this._toWxchat.bind(this)
        
    }

    componentWillReceiveProps(nextProps){
        const {category, course} = nextProps;

        if (category !== this.props.category){
            this.category = category;

            if (category.length > 0) {
                this._onHeaderRefresh();
            }
        }

        if (course !== this.props.course){
            this.citems = this.citems.concat(course.items);
            this.pages = course.pages;

            this.setState({
                total: course.total
            })
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.course.category();
    }

    componentWillUnmount(){
      
        this.setState({
            ctip: false,
            stip: false,
        })
    }

    _onHeaderRefresh(){
        const {actions} = this.props;
        const {cindex, ccindex, sort, ctype,type} = this.state;

        this.page = 0;
        this.pages = 1;
        this.citems = [];

        if (this.category.length > cindex) {
            const category = this.category[cindex];

            let ccategoryId = 0;
            if (ccindex > 0 && category.child.length >= ccindex) {
                ccategoryId = category.child[ccindex - 1].categoryId;
            }

            let _ctype = ctype;
            let _sort  = sort ;

            if(ctype === 0){
                _ctype = 9; 
            } else if (ctype === 1){
                _ctype = 0;  // 点播
            } else if(ctype === 2){
                _ctype = 1;  // 音频
            } else if(ctype === 3){
                _ctype = 2   // 直播
            } else if(ctype === 4){
                _ctype = 3   // 图文
            }
            let paytype = -1;
            if(type==1){
                paytype = 1
            }else if(type==2){
                paytype = 0
            }else if(type==4){
                paytype = 3
            }else if(type==3){
                paytype = 2
            }else if(type==5){
                paytype = 4
            }
            _sort = sort == 1 ? 0 : 1

            actions.course.courses(category.categoryId, ccategoryId, _ctype, _sort,paytype, this.page,2);
        }
    }

    _onFooterRefresh(){
        const {actions} = this.props;
        const {cindex, ccindex, ctype, sort,type} = this.state;

		if (this.page < this.pages) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page++;
            
            if (this.category.length > cindex) {
                const category = this.category[cindex];
    
                let ccategoryId = 0;
                if (ccindex > 0 && category.child.length >= ccindex) {
                    ccategoryId = category.child[ccindex - 1].categoryId;
                }
    
                let _ctype = ctype;
                let _sort  = sort ;


                

                if(ctype === 0){
                    _ctype = 9; 
                } else if (ctype === 1){
                    _ctype = 0;  // 点播
                } else if(ctype === 2){
                    _ctype = 1;  // 音频
                } else if(ctype === 3){
                    _ctype = 2   // 直播
                } else if(ctype === 4){
                    _ctype = 3   // 图文
                }
                let paytype = -1;
                if(type==1){
                    paytype = 1
                }else if(type==2){
                    paytype = 0
                }else if(type==4){
                    paytype = 3
                }else if(type==3){
                    paytype = 2
                }else if(type==5){
                    paytype = 4
                }
                _sort = sort == 1 ? 0 : 1
    
                actions.course.courses(category.categoryId, ccategoryId, _ctype, _sort,paytype, this.page,2);
            }
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _onLink(courseId,courseName,ctype){

        Linking.canOpenURL('weixin://').then(supported => {
            if (supported) {
                if(ctype === 0 ){
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

    _onSort(sort){

        this.setState({
            sort: sort,
            stip: false,
        }, () => {
            this._onHeaderRefresh();
        });
    }

    _onSortToggle(){
        this.setState({
            stip: !this.state.stip,
        });
    } 

    _onCtype(ctype) {

        this.setState({
            ctype: ctype,
            ctip: false,
        }, () => {
            this._onHeaderRefresh();
        });
    }
    _onType=(type)=>{
        this.setState({
            type: type,
            tip: false,
        }, () => {
            this._onHeaderRefresh();
        });
    }

    _onCtypeToggle() {
        this.setState({
            ctip: !this.state.ctip,
        });
    }
    _onTypeToggle=()=>{
        this.setState({
            tip: !this.state.tip,
        })
    }

    _renderItem(item){
        const {navigation} = this.props;
        const course = item.item;

        if(course.ctype === 3){
            return <VodCell course={course} key={'channel_' + course.courseId} onPress={(course) => navigation.navigate('Graphic', {course: course})}/>;
        } else if(course.ctype === 2 || course.ctype === 0){
            return  <VodCell course={course}  
                        onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName,course.ctype) : navigation.navigate('Vod', {course: course})}
                    />;
        }  else if(course.ctype === 1){
            return <VodCell course={course}   
                        onPress={(course) => course.plant === 1 ? this._toWxchat(course.courseId,course.courseName,course.ctype) : navigation.navigate('Audio', {course: course})}
                    />;

        }
        
    }

    
    render() {
        const {cindex, ccindex, sort, ctype, ctip, stip, total,type,tip} = this.state;

        let citems = [];
        this.category.map((category, index) => {
            citems.push(category.categoryName);
        })

        let ccitems = [];
        if (this.category.length > this.state.cindex) {
            ccitems = this.category[this.state.cindex].child;
        }

        ccitems = [{categoryName: '全部'}].concat(ccitems);


        return (
            <View style={[styles.container, styles.bg_white]}>
                <View style={[styles.filter]}>
                    <Tabs items={citems} selected={cindex} type={0} atype={1} onSelect={(index) => {
                        this.setState({
                            cindex: index,
                            ccindex: 0,
                        }, () => {
                            this._onHeaderRefresh();
                        })
                    }}/>
                </View>
                <View style={[styles.filter, styles.border_bt]}>
                    <ScrollView 
                        contentContainerStyle={[styles.p_10,styles.fd_r,styles.ai_ct]}
                        horizontal 
                        showsVerticalScrollIndicator={false}      
                        showsHorizontalScrollIndicator={false}>
                        {ccitems.map((ccategory, index) => {
                            const on = index == ccindex;
                            
                            return (
                                <TouchableOpacity  style={styles.catePerBox} key={'ccategory_' + index} onPress={() => {
                                    this.setState({
                                        ccindex: index
                                    }, () => {
                                        this._onHeaderRefresh();
                                    })
                                }}>
                                    <Text style={[styles.pl_5, styles.pr_5,styles.sm_label, styles.gray_label, on && styles.sred_label]}>{ccategory.categoryName}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={[styles.border_bt, styles.row, styles.jc_sb, styles.p_15, styles.pt_8, styles.pb_8]}>
                    <Text style={[styles.tip_label, styles.sm_label]}>共{total}个内容</Text>
                    <View style={[styles.row, styles.jc_sb]}>
                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct]}
                            onPress={this._onTypeToggle}
                        >
                            <Text style={[styles.sm_label, styles.gray_label]}>{this.typeList[type]}</Text>
                            <Text style={[styles.icon, styles.sm8_label, styles.ml_5]}>{iconMap('xiasanjiao')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.ml_10]}
                            onPress={this._onCtypeToggle}
                        >
                            <Text style={[styles.sm_label, styles.gray_label]}>{this.ctype[ctype]}</Text>
                            <Text style={[styles.icon, styles.sm8_label, styles.ml_5]}>{iconMap('xiasanjiao')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.fd_r ,styles.ai_ct , styles.ml_10]}
                            onPress={this._onSortToggle}
                        >
                            <Text style={[styles.sm_label, styles.gray_label]}>{this.sort[sort]}</Text>
                            <Text style={[styles.icon, styles.sm8_label, styles.ml_5]}>{iconMap('xiasanjiao')}</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                <RefreshListView
                    contentContainerStyle={[styles.p_10]}
                    data={this.citems}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
                {stip ?
                    <View style={[styles.sort_box]}>
                        <View style={[styles.bg_white]}>
                            {
                                this.sort.map((item,index)=>{
                                    const on = index === sort;
                                    return (
                                        <TouchableOpacity style={[styles.p_10, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]} onPress={() => this._onSort(index)} key={'sort_' + index}>
                                            <Text style={[styles.default_label, on ? styles.red_label : styles.c33_label]}>{item}</Text>
                                            {on ?
                                            <Text style={[styles.icon, styles.red_label]}>{iconMap('gou')}</Text>
                                            : null}
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                        <TouchableOpacity style={[styles.col_1]} onPress={this._onSortToggle}/>
                    </View>
                : null}
                {ctip ?
                    <View style={[styles.sort_box]}>
                        <View style={[styles.bg_white]}>
                            {
                                this.ctype.map((item,index)=>{
                                    const on = index === ctype;
                                    return (
                                        <TouchableOpacity style={[styles.p_10, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]} onPress={() => this._onCtype(index)} key={'ctype_' + index}>
                                            <Text style={[styles.default_label, on ? styles.red_label : styles.c33_label]}>{item}</Text>
                                            {on ?
                                            <Text style={[styles.icon, styles.red_label]}>{iconMap('gou')}</Text>
                                            : null}
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                        <TouchableOpacity style={[styles.col_1]} onPress={this._onSortToggle}/>
                    </View>
                : null}
                {tip ?
                    <View style={[styles.sort_box]}>
                        <View style={[styles.bg_white]}>
                            {
                                this.typeList.map((item,index)=>{
                                    const on = index === type;
                                    return (
                                        <TouchableOpacity style={[styles.p_10, styles.fd_r, styles.ai_ct, styles.jc_sb, styles.border_bt]} onPress={() => this._onType(index)} key={'type_' + index}>
                                            <Text style={[styles.default_label, on ? styles.red_label : styles.c33_label]}>{item}</Text>
                                            {on ?
                                            <Text style={[styles.icon, styles.red_label]}>{iconMap('gou')}</Text>
                                            : null}
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                        <TouchableOpacity style={[styles.col_1]} onPress={this._onSortToggle}/>
                    </View>
                : null}
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    filter: {
        height: 42,
    },
    catePerBox:{
        height:24,
        flexDirection:'row',
        alignItems:'center',
    },
    sort_box: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
});


export const LayoutComponent = CourseCategory;

export function mapStateToProps(state) {
	return {
        category:state.course.category,
        course:state.course.courses,
	};
}
