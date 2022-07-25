import React, { Component } from 'react'
import { View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,RefreshControl,NativeModules} from 'react-native';


import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import Tabs from '../../../component/Tabs';

import {formatTimeStampToTime} from '../../../util/common';


import asset from '../../../config/asset';
import theme from '../../../config/theme';

class ProfesSkill extends Component {


    static navigationOptions = {
        title:'培训班',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        this.page = 0;
        this.totalPage = 1;

        this.o2o = [];
        this.squad = [];
        this.o2oSkill = [];
        
        this.state = {
            status:0,
            toggle_index:0,
            nowdate:0,
            isRefreshing: false,
        }

        this._onSelect = this._onSelect.bind(this);
        this._toggleIdx = this._toggleIdx.bind(this);
        this._o2oTDesc = this._o2oTDesc.bind(this);
        this._artDesc = this._artDesc.bind(this);
        this._o2oDesc = this._o2oDesc.bind(this);

        this._contentViewScroll = this._contentViewScroll.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._onRefresh = this._onRefresh.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {status , toggle_index} = this.state;
        const {o2o,articleSquad,o2oSkill} = nextProps;

        if(o2o !== this.props.o2o){

            if(status === 0 && toggle_index === 0){

                this.o2o = this.o2o.concat(o2o.items);
                this.page = o2o.page;
                this.totalPage = o2o.pages;

            }

            if(status === 1 && o2o !== undefined){

                this.o2oSkill = this.o2oSkill.concat(o2o.items);

                this.page = o2o.page;
                this.totalPage = o2o.pages;

            }
        }

        if(articleSquad !== this.props.articleSquad){
            
            if(status === 0 && toggle_index === 1){

                this.squad = this.squad.concat(articleSquad.items);

                this.page = articleSquad.page;
                this.totalPage = articleSquad.pages;
            }
        }

        // if(o2oSkill !== this.props.o2oSkill){

        //     if(status === 1 && o2oSkill !== undefined){

        //         this.o2oSkill = this.o2oSkill.concat(o2oSkill.items);

        //         this.page = o2oSkill.page;
        //         this.totalPage = o2oSkill.pages;

        //     }
        // }



    }

    componentDidMount(){
        this._onRefresh();
    }

    _onRefresh(){
        const {actions} = this.props;
        const {status,toggle_index} = this.state;

        this.o2o = [];
        this.squad = [];
        this.o2oSkill = [];

        this.page = 0;

        
        var nowTime = new Date();


        this.setState({
            nowdate:nowTime.getTime(),
        })

        if(status === 0 ){

            if(toggle_index === 0 ){
                actions.train.o2o(0,this.page);
            } else if(toggle_index === 1) {
                actions.article.articleSquad(this.page);
            }
        } else if(status === 1){
            // actions.train.o2oSkill(this.page);
            actions.train.o2o(2,this.page);
        }


        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        },2000);

    }

    _onSelect = (index) => {

        const {navigation,user,actions} = this.props;
        const {toggle_index} = this.state;

        this.o2o = [];
        this.squad = [];
        this.o2oSkill = [];

        this.setState({
            status:index
        },()=>{
            if(index === 0 ){
                if(toggle_index === 0 ){
                    actions.train.o2o(0,0);
                } else if(toggle_index === 1) {
                    actions.article.articleSquad(0)
                }
            } else if(index === 1){
                // actions.train.o2oSkill(0);
                actions.train.o2o(2,0);
            }
        })
    }

    _toggleIdx(idx){
        const {actions} = this.props;

        this.page = 0;
        this.o2o = [];
        this.squad = [];
        this.o2oSkill = [];


        this.setState({
            toggle_index:idx,
        },()=>{
            if(idx === 0 ){
                actions.train.o2o(0,0);

            } else if(idx === 1) {
                actions.article.articleSquad(0)
            }
        })
    }


    _o2oTDesc(o2o){
        const {navigation} = this.props;

        navigation.navigate('MyTranDetail',{o2o:o2o,stype:0})
    }

    _o2oDesc(o2o){
        const {navigation} = this.props;

        navigation.navigate('MyTrainClassDetail',{o2o:o2o,stype:1})
    }

    _artDesc(sqd){

        const {navigation} = this.props;
        navigation.navigate('Review',{sqd:sqd});
        
    }

    _contentViewScroll = (e) =>{

        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

        this._onFooterRefresh();

    }


    _onFooterRefresh(){
        const {actions} = this.props;
        const {status,toggle_index} = this.state


		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page = this.page + 1;

            if(status === 0 ){
                if(toggle_index === 0 ){
                    actions.train.o2o(0,this.page);
                } else if(toggle_index === 1) {
                    actions.article.articleSquad(this.page);
                }
            } else if(status === 1){
                // actions.train.o2oSkill(this.page);
                actions.train.o2o(2,this.page);
            }

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    render() {
        const {status,toggle_index,nowdate} = this.state;

        let training = [];
        let trained = [];
        let skill_training = [];
        let skill_trained = [];


        if(this.o2o.length > 0){
            for(let i = 0 ; i < this.o2o.length ; i++){
                if(this.o2o[i].endTime * 1000 > nowdate){
                    training.push(this.o2o[i])
                } else {
                    trained.push(this.o2o[i])
                }
            }
        }

        if(this.o2oSkill.length > 0){
            for(let i = 0 ; i < this.o2oSkill.length ; i++){
                if(this.o2oSkill[i].endTime * 1000 > nowdate){
                    skill_training.push(this.o2oSkill[i])
                } else {
                    skill_trained.push(this.o2oSkill[i])
                }
            }
        }


        return (
            <View style={styles.container}>
                <View style={[styles.atabs]}>
                    <Tabs items={['系统教育培训', '专业技能培训']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd = {this._contentViewScroll}
                    ref={(r) => this.scrollview = r}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={this._onRefresh}
                          tintColor="#2c2c2c"
                          title="刷新中..."
                          titleColor="#2c2c2c"
                          colors={['#2c2c2c', '#2c2c2c', '#2c2c2c']}
                          progressBackgroundColor="#ffffff"
                        />
                    }
                    
                >
                    {
                        status === 0 ?
                        <View style={[styles.fd_c,styles.jc_ct,styles.ai_ct,styles.mt_20,styles.pl_15,styles.pr_15]}>


                            <View style={[styles.toggle ,styles.fd_r, styles.jc_ct, styles.ai_ct]}>
                                <TouchableOpacity 
                                    style = {[styles.fd_r,styles.jc_ct, styles.ai_ct,styles.toggle_item,(toggle_index === 0)&&styles.active]}
                                    onPress = {()=>this._toggleIdx(0)}
                                >
                                    <Text style={[styles.sm_label,styles.c48_label ,(toggle_index === 0)&&styles.white_label]}>系统教育培训</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {[styles.fd_r,styles.jc_ct, styles.ai_ct,styles.toggle_item,(toggle_index === 1)&&styles.active]}
                                    onPress = {()=>this._toggleIdx(1)}
                                >
                                    <Text style={[styles.sm_label,styles.c48_label,(toggle_index === 1)&&styles.white_label]}>精彩回顾</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                (toggle_index === 0  && this.o2o.length === 0 ) ?
                                <View style={[styles.empty_wrap,styles.fd_c,styles.jc_ct,styles.ai_ct]}>
                                    <Text style={[styles.tip_label,styles.default_label,{marginTop:80}]}>暂无培训班</Text>
                                </View>
                            
                            :
                                <View style={[styles.content_wrap]}>
                                    {
                                        training.length > 0 ?
                                        <View style={[styles.pt_15,styles.pb_15]}>
                                            <Text style={[styles.c33_label,styles.fw_label,styles.lg_label]}>正在进行中</Text>
                                        </View>
                                    :null}

                                    {
                                        training.map((o2o,index)=>{
                                            return(
                                                <TouchableOpacity style={[styles.item]}
                                                        key={'o2o'+index}
                                                        onPress={()=> this._o2oTDesc(o2o,0,0)}
                                                    >
                                                    <Image style={[styles.item_img]} resizeMode='stretch' source={{uri:o2o.squadImg}}/>
                                                    <View style={[styles.fd_r  ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                        <Text style={[styles.fw_label,styles.lg_label,styles.c33_label]} numberOfLines={1}>{o2o.squadName}</Text>
                                                    </View>
                                                    {
                                                        o2o.summary.length > 0 ? 
                                                        <Text style={[styles.gray_label ,styles.sm_label,styles.mt_2]} numberOfLines={1}>{o2o.summary}</Text>
                                                    :null}
                                                    <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.mt_5]}>
                                                        <Text style={[styles.gray_label,styles.sm_label]}>招生人数：{o2o.enrollNum}  报名人数：{o2o.registeryNum}</Text>
                                                        {
                                                            o2o.location.length === 0 ?
                                                            null:
                                                            <Text style={[styles.sm_label,styles.tip_label]}>地点：{o2o.location}</Text>
                                                        }
                                                    </View>
                                                    <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                        <Text style={[styles.sm_label,styles.tip_label]}>{formatTimeStampToTime(o2o.beginTime*1000)} - {formatTimeStampToTime(o2o.endTime*1000)}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }

                                    {
                                        trained.length > 0 ?
                                        <View style={[styles.pb_15]}>
                                            <Text style={[styles.c33_label,styles.fw_label,styles.lg_label]}>已结束</Text>
                                        </View>
                                    :null}

                                    {
                                        trained.map((o2o,index)=>{
                                            return(
                                                <TouchableOpacity style={[styles.item]}
                                                    key={'o2o'+index}
                                                    onPress={()=>this._o2oTDesc(o2o,1,0)}
                                                >
                                                    <Image style={[styles.item_img]} resizeMode='stretch' source={{uri:o2o.squadImg}}/>
                                                    <View style={[styles.fd_r  ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                        <Text style={[styles.fw_label,styles.lg_label,styles.c33_label]} numberOfLines={1}>{o2o.squadName}</Text>
                                                    </View>
                                                    {
                                                        o2o.summary.length > 0 ? 
                                                        <Text style={[styles.gray_label ,styles.sm_label,styles.mt_2]} numberOfLines={1}>{o2o.summary}</Text>
                                                    :null}
                                                    <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.mt_5]}>
                                                        <Text style={[styles.gray_label,styles.sm_label]}>招生人数：{o2o.enrollNum}  报名人数：{o2o.registeryNum}</Text>
                                                        {
                                                            o2o.location.length === 0 ?
                                                            null:
                                                            <Text style={[styles.sm_label,styles.tip_label]}>地点：{o2o.location}</Text>
                                                        }
                                                    </View>
                                                    <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                        <Text style={[styles.sm_label,styles.tip_label]}>{formatTimeStampToTime(o2o.beginTime*1000)} - {formatTimeStampToTime(o2o.endTime*1000)}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            }
                            {
                                toggle_index === 1  && this.squad.length === 0 ?
                                <View style={[styles.empty_wrap,styles.fd_c,styles.jc_ct,styles.ai_ct]}>
                                    <Text style={[styles.tip_label,styles.default_label,{marginTop:80}]}>暂无培训班</Text>
                                </View>
                                :
                                <View>
                                    {
                                        this.squad.map((sqd,index)=>{
                                            return(
                                                <TouchableOpacity style={[styles.item]}
                                                    key={'sqd'+index}
                                                    onPress={()=>this._artDesc(sqd)}
                                                >
                                                    <Image style={[styles.item_img]} resizeMode='stretch' source={{uri:sqd.articleImg}}/>
                                                    <View style={[styles.fd_c,styles.mt_20]}>
                                                        <Text style={[styles.lg_label,styles.fw_label,styles.c33_label]} numberOfLines={1}>{sqd.title}</Text>
                                                        <Text style={[styles.sm_label,styles.tip_label ,styles.mt_5]}>{sqd.pubTimeFt}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>

                            }


                        </View>
                        :
                        <View style={[styles.pl_15,styles.pr_15]}>
                            {
                                skill_training.length > 0 ?
                                <View style={[styles.pt_15,styles.pb_15]}>
                                    <Text style={[styles.c33_label,styles.fw_label,styles.lg_label]}>正在进行中</Text>
                                </View>
                            :null}

                            {
                                skill_training.map((o2o,index)=>{
                                    return(
                                        <TouchableOpacity style={[styles.item]}
                                                key={'o2o'+index}
                                                onPress={()=> this._o2oDesc(o2o,0,1)}
                                            >
                                            <Image style={[styles.item_img]} resizeMode='stretch' source={{uri:o2o.squadImg}}/>
                                            <View style={[styles.fd_r  ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                <Text style={[styles.fw_label,styles.lg_label,styles.c33_label]} numberOfLines={1}>{o2o.squadName}</Text>
                                            </View>
                                            {
                                                o2o.summary.length > 0 ? 
                                                <Text style={[styles.gray_label ,styles.sm_label,styles.mt_2]} numberOfLines={1}>{o2o.summary}</Text>
                                            :null}
                                            <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.mt_5]}>
                                                <Text style={[styles.gray_label,styles.sm_label]}>招生人数：{o2o.enrollNum}  报名人数：{o2o.registeryNum}</Text>
                                                {
                                                    o2o.location.length === 0 ?
                                                    null:
                                                    <Text style={[styles.sm_label,styles.tip_label]}>地点：{o2o.location}</Text>
                                                }
                                            </View>
                                            <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                <Text style={[styles.sm_label,styles.tip_label]}>{formatTimeStampToTime(o2o.beginTime*1000)} - {formatTimeStampToTime(o2o.endTime*1000)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }

                            {
                                skill_trained.length > 0 ?
                                <View style={[styles.pb_15,styles.mt_10]}>
                                    <Text style={[styles.c33_label,styles.fw_label,styles.lg_label]}>已结束</Text>
                                </View>
                            :null}

                            {
                                skill_trained.map((o2o,index)=>{
                                    return(
                                        <TouchableOpacity style={[styles.item]}
                                            key={'o2o'+index}
                                            onPress={()=>this._o2oDesc(o2o,1,1)}
                                        >
                                            <Image style={[styles.item_img]} resizeMode='stretch' source={{uri:o2o.squadImg}}/>
                                            <View style={[styles.fd_r  ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                <Text style={[styles.fw_label,styles.lg_label,styles.c33_label]} numberOfLines={1}>{o2o.squadName}</Text>
                                            </View>
                                            {
                                                o2o.summary.length > 0 ? 
                                                <Text style={[styles.gray_label ,styles.sm_label,styles.mt_2]} numberOfLines={1}>{o2o.summary}</Text>
                                            :null}
                                            <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.mt_5]}>
                                                <Text style={[styles.gray_label,styles.sm_label]}>招生人数：{o2o.enrollNum}  报名人数：{o2o.registeryNum}</Text>
                                                {
                                                    o2o.location.length === 0 ?
                                                    null:
                                                    <Text style={[styles.sm_label,styles.tip_label]}>地点：{o2o.location}</Text>
                                                }
                                            </View>
                                            <View style={[styles.fd_r ,styles.jc_sb ,styles.row ,styles.ai_ct ,styles.pt_5]}>
                                                <Text style={[styles.sm_label,styles.tip_label]}>{formatTimeStampToTime(o2o.beginTime*1000)} - {formatTimeStampToTime(o2o.endTime*1000)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    }
                </ScrollView>
                
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FBFDFF',
    },
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#f1f1f1',
        backgroundColor:'#ffffff'
    },
    c48_label:{
        color:'#484848'
    },
    toggle:{
        width:150,
        height:24,
        borderRadius:3,
        marginBottom:10,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#484848'
    },
    toggle_item:{
        height:'100%',
        width:'50%',
    },  
    active:{
        color:'#ffffff',
        backgroundColor:'#484848'
    },
    item:{
        paddingBottom:15,
        marginBottom:15,
        borderBottomColor:'#f0f0f0',
        borderStyle:'solid',
        borderBottomWidth:1,
    },
    item_img:{
        borderRadius:5,
        width:theme.window.width - 30,
        height:130,
    },
})

export const LayoutComponent = ProfesSkill;

export function mapStateToProps(state) {
	return {
        o2o:state.train.o2o,
        articleSquad:state.article.articleSquad,
        o2oSkill:state.train.o2oSkill
	};
}


