import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';

import Tabs from '../../../component/Tabs';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import HudView from '../../../component/HudView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';
import iconMap from '../../../config/font';


class UserBuyCourse extends Component {

    static navigationOptions = {
        title:'已购课程',
        headerRight: <View/>,
    };

    constructor(props){
        super(props)

        this.course = []
        this.page = 0;
		this.totalPage = 1;

        this.state = {
            status:0,
            nowdate:0,
            ctype:0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._onPress = this._onPress.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {userContent} = nextProps ;

        if(userContent !== this.props.userContent){
            this.course = this.course.concat(userContent.items);
			this.page = userContent.page ;
			this.totalPage = userContent.pages;
        }


        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    _onHeaderRefresh(){
        const {actions} = this.props;
        const {ctype} = this.state;

        this.course = [];
        this.page = 0 ;

        actions.user.userContent(ctype,this.page);

        this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh(){
        const {actions} = this.props;
        const {ctype} = this.state;

		if (this.page < this.totalPage) {

			this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page = this.page + 1;
            
            actions.user.userContent(ctype,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}


    }


    _renderItem(item){
        const course = item.item;

        return(
            <TouchableOpacity style ={[styles.fd_r, styles.pb_20]} onPress={() => this._onPress(course)}>
                <View>
                    <Image source={{uri:course.courseImg}} mode='aspectFit' style ={[styles.item_cover]}/>
                    <View style ={[styles.item_tips_hit]}>
                        <Text style={[styles.icon, styles.sm8_label ,styles.white_label]}>{iconMap('youyinpin')}</Text>
                        <Text style ={[styles.sm8_label ,styles.white_label, styles.ml_5]}>{course.chapter}讲</Text>
                    </View>
                </View>
                <View style ={[styles.fd_c, styles.pl_10 ,styles.jc_sb ,styles.col_1]}>
                    <View style ={[styles.fd_c]}>
                        <Text style ={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1}>{course.courseName}</Text>
                        <Text style ={[styles.sml_label ,styles.tip_label,styles.mt_5]} numberOfLines={1}>{course.summary}</Text>
                    </View>

                    <View style ={[styles.fd_r ,styles.ai_ct ,styles.mt_5 ,styles.jc_sb]}>
                        <View style ={[styles.fd_r ,styles.ai_ct]}>
                            <Text style ={[styles.sm_label, styles.c33_label, styles.ml_5]}>{course.integral}学分</Text>
                        </View>
                        <View  style={[styles.view_play, styles.fd_r ,styles.ai_ct]}>
                            <View style={[styles.view_icon]}></View>
                            <Text style={[styles.sred_label,styles.sm_label,styles.pl_3]}>播放</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onPress(course){
        const {navigation} = this.props;
        const {status} = this.state;
        if(status === 0 ){
            navigation.navigate('Vod', {course: course})
        } else {
            navigation.navigate('Audio', {course: course})
        }
    }

    _onSelect = (index) => {
        this.setState({
            status:index,
            ctype:index
        },()=>{
            this._onHeaderRefresh();
        })
    }


    render() {
        const {status} = this.state;
        return (
            <View style={styles.container}>
                <View style={[styles.atabs]}>
                    <Tabs items={['视频课程', '音频课程','直播课程']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>
                <View style={styles.wrap}>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.course}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                        onFooterRefresh={this._onFooterRefresh}
                    />
                </View>
                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff'
    },
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#fafafa',
        backgroundColor:'#ffffff'
    },
    wrap:{
        paddingLeft:20,
        paddingRight:24,
        marginTop:15
    },
    item_cover:{
        width:136,
        height:72,
        borderRadius:5,
        backgroundColor:'#fafafa',
    },
    item_tips_hit:{
        position:'absolute',
        bottom: 5,
        right: 5,
        height:14,
        width: 40,
        backgroundColor:'rgba(0,0,0,0.65)',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    cate_new_cover: {
        position:'absolute',
        top: -5,
        right: -5,
    },
    cate_new_icon: {
        width: 18,
        height: 12
    },
    view_play:{
        width:46,
        height:18,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F',
        borderRadius:3,
        justifyContent:'center'
    },
    view_icon:{
        width:0,
        height:0,
        borderTopColor:'transparent',
        borderTopWidth:4,
        borderStyle:'solid',
        borderLeftColor:'#F4623F',
        borderLeftWidth:6,
        borderBottomColor:'transparent',
        borderBottomWidth:4,
    }
})

export const LayoutComponent = UserBuyCourse;

export function mapStateToProps(state) {
	return {
        userContent:state.user.userContent
	};
}
