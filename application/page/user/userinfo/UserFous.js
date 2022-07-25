import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image,TouchableOpacity} from 'react-native'

import asset from '../../../config/asset';
import theme from '../../../config/theme';

import Tabs from '../../../component/Tabs';

import HudView from '../../../component/HudView';
import ActivityCell from '../../../component/cell/ActivityCell';
import AskCell from '../../../component/cell/AskCell';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';


class UserFous extends Component {

    static navigationOptions = {
        title:'我的关注',
        headerRight: <View/>,
    };


    constructor(props){
        super(props)

        this.userFollow = []
        this.page = 1;
		this.totalPage = 1;

        this.state = {
            status:0,
            nowdate:0,
            refreshState: RefreshState.Idle,
        }

        this._onSelect = this._onSelect.bind(this)
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {userFollow} = nextProps 

        if (userFollow !== this.props.userFollow) {

            this.userFollow = this.userFollow.concat(userFollow.items);
			this.page = userFollow.page  + 1 ;
            this.totalPage = userFollow.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }


    componentWillMount(){
        var nowTime = new Date();
        this.setState({
            nowdate:nowTime.getTime()
        })
    }


    componentDidMount(){

        this._onHeaderRefresh();
    }

    _onHeaderRefresh(){
        const {actions} = this.props;
        const {status} = this.state

		this.userFollow = [];
        this.page = 1;
        
        let idx = 0
        if(status === 0 ){
            idx = 1
        } else if (status === 1) {
            idx = 2
        } else {
            idx = 10
        }


		actions.user.userFollow(idx,this.page);

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onSelect = (index) => {

        this.userFollow = [];

        this.setState({
            status:index
        },()=>{
            this._onHeaderRefresh()
        })
    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {status} = this.state

        let idx = 0
        if(status === 0 ){
            idx = 1
        } else if (status === 1) {
            idx = 2
        } else {
            idx = 10
        }

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.user.userFollow(idx,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _offFollow(item,index){

        const {actions} = this.props


        actions.user.removeFollow({
            teacher_id:item.teacherId,
            resolved: (data) => {
                this.refs.hud.show('取消成功', 1);
                this._onHeaderRefresh();
            },
            rejected: (msg) => {
                
            }
        })

    }

    _renderItem(item){
        const {navigation} = this.props;
        const {status,nowdate} = this.state
        const rowdata = item.item
        const index = item.index

        if(status === 0){

            let lectArray = []
            let lectString = rowdata.honor
            if(lectString.indexOf('&') != -1){
                lectArray.push(lectString.split('&')[0],lectString.split('&')[1])
            } else {
                lectArray.push(rowdata.honor)
            }

            return(
                <View style={[styles.item]} >
                    <TouchableOpacity style={[styles.fd_r ,styles.item_right ]} onPress={()=>navigation.navigate('Teacher', { teacher: rowdata })}>   
                        <View style={[styles.item_cover]}> 
                            <Image style={[styles.item_cover]}  source={{uri:rowdata.teacherImg}} />
                        </View>
                        <View style={[styles.d_flex ,styles.fd_c ,styles.jc_sb ,styles.ml_10 ,styles.col_1]}>
                            <View>
                                <View style={[styles.fd_r ,styles.jc_sb ,styles.ai_ct]}>
                                    <Text style={[styles.lg_label ,styles.black_label ,styles.fw_label]}>{rowdata.teacherName}</Text>
                                    <TouchableOpacity style={[styles.focuson ,styles.d_flex ,styles.jc_ct ,styles.ai_ct]} 
                                        onPress={this._offFollow.bind(this,rowdata,index)}
                                    >
                                        <Text style={[styles.red_label ,styles.sm_label]}>取消关注</Text>
                                    </TouchableOpacity>
                                        
                                </View>
                                <View style={[styles.fd_c]}>
                                    {
                                        lectArray.map((lectstr,idx)=>{
                                            return(
                                                <Text style={[styles.default_label ,styles.gray_label ,styles.mt_5]} style={{lineHeight:15,}} key={'lectstr'+idx}>{lectstr}</Text>
                                            )
                                        })
                                    } 
                                </View>
                            </View>
                            <Text style={[styles.sm_label ,styles.tip_label]}>共 {rowdata.course} 课</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else if (status == 1) {
            let tip = '';
            if(rowdata.beginTime * 1000 > nowdate){
                tip = '未开始';
            } else if(rowdata.beginTime * 1000 < nowdate && rowdata.endTime * 1000 > nowdate ){
                tip = '进行中';
            } else {
                tip = '已结束';
            }
            return(
                <ActivityCell activity={rowdata} onPress={(rowdata) => navigation.navigate('Activity', {activity: rowdata})}/>
            )
        }

        return <AskCell ask={rowdata} onPress={()=>navigation.navigate('Question', {ask: rowdata})}/>

    }


    render() {
        const {status} = this.state

        return (
            <View >
                <View style={[styles.atabs]}>
                    <Tabs items={['讲师', '活动', '问答']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                <View style={styles.wrap}>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.userFollow}
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
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#fafafa',
        backgroundColor:'#ffffff'
    },
    wrap:{
        paddingTop:10,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20
    },
    item:{
        paddingTop:10,
        paddingBottom:10,
    },
    item_cover:{
        width:64,
        height:80,
        backgroundColor:'#f5f5f5',
        borderRadius:5
    },
    focuson:{
        width:53,
        height:22,
        backgroundColor:'rgba(255,255,255,1)',
        borderRadius:5,
        borderColor:'rgba(244,98,63,1)',
        borderWidth:1,
        borderStyle:'solid'
    },
});


export const LayoutComponent = UserFous;

export function mapStateToProps(state) {
	return {
        userFollow:state.user.userFollow
	};
}

