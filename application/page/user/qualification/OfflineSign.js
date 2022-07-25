import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image,TouchableOpacity, Alert} from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import HudView from '../../../component/HudView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

class OfflineSign extends Component {


    static navigationOptions = {
        title:'线下报名',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        this.page = 0 ;
        this.totalPage = 1;
        this.items = [];
        this.itemtype = null;

        const {navigation} = this.props;
        this.squadId = navigation.getParam('squadId', 0);

        this.state = {
            refreshState: RefreshState.Idle,
            squadId:0,
            loadding:false,
            enrollNum:0,
            registeryNum:0,
            canApply:true,
            type:100,
            passStatus:100,
            canSign:true, // 已报名  true 可以报名
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._actions = this._actions.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {o2o,o2oDetail,studyStatus,o2oExamPaper} = nextProps;

        if(o2o !== this.props.o2o){

            this.itemtype = [];
            this.items = this.items.concat(o2o.items);
            this.page = o2o.page;
            
        }

        if(o2oDetail !== this.props.o2oDetail){

            this.setState({
                canSign:o2oDetail.canSign
            })
        }
        if(o2oExamPaper !== this.props.o2oExamPaper){
            if(o2oExamPaper){
                let lst = []
                lst = o2oExamPaper.data.filter(item=>item.userScore>o2oExamPaper.perp)
                if(lst&&lst.length>=o2oExamPaper.passNumber){
                    this.setState({
                        passStatus:2
                    })
                }else{
                    if(studyStatus !== this.props.studyStatus){

                        this.setState({
                            passStatus:studyStatus.passStatus,
                        },()=>{
                            if(studyStatus.passStatus !== 2){
                                this.refs.hud.show('请先通过在线考试！', 2);
                            }
                        })
                    }
            
                }
            }
            
        }
        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        const {actions} = this.props;
        this._onHeaderRefresh();

        actions.train.studyStatus(this.squadId);
        actions.train.o2oExamPaper(this.squadId);
    }

    _onHeaderRefresh(){

        const {actions} = this.props;

        this.items = [];
		this.page = 0;
        this.totalPage = 1;
        this.itemtype = null;
        
        actions.train.o2o(3,this.page);
        

        this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh(){

        const {actions} = this.props;

        if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.train.o2o(3,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }


    _keyExtractor(item, index) {
	    return index + '';
    }

    _onSelect(sign){
        const {actions,navigation} = this.props;
        const {squadId} = this.state;

        let  nowTime = (new Date()).getTime();

        if(squadId === sign.squadId){
            this.setState({
                squadId:0,
                enrollNum:0,
                registeryNum:0,
                type:100,
            })
        } else {
            actions.train.o2oDetail(sign.squadId);

            this.setState({
                squadId:sign.squadId,
                enrollNum:sign.enrollNum,
                registeryNum:sign.registeryNum,
                canApply:sign.canApply,
            },()=>{

                // navigation.navigate('HasCourse',{squadId:sign.squadId,page:this.page})
                let type = 0 ;

                if(nowTime < sign.beginTime * 1000){
                    type = 4 // 未开始
                } else if(sign.endTime * 1000 > nowTime && nowTime > sign.beginTime * 1000){
                    if(sign.enrollNum <= sign.registeryNum){
                        type = 2 // 人数已满
                    } 

                    if(sign.canApply){
                        type = 1  // 已报名
                    }

                } else if(sign.endTime * 1000 < nowTime)  {
                    type = 3 // 已截止
                }

                this.setState({
                    type:type
                })

            })
        }
    }

    _actions(type){
        const {actions,navigation} = this.props;
        const {squadId,passStatus} = this.state;

        if(type === 0){

            if(passStatus === 2){

                Alert.alert('线下报名','一旦报名，不能更改，是否提交',[
                    { text: '否', onPress: () => {
                    }
                },{
                    text: '是', onPress: () => {
                        this._onSubmit();
                    }
                }])


            } else {
                this.refs.hud.show('请先通过在线考试！', 2);
            }

        } else {
            navigation.navigate('HasCourse',{squadId:squadId,page:this.page})
        }
    }

    _onSubmit(){
        const {actions,navigation} = this.props;

        const {squadId,passStatus,canSign,bsquadId} = this.state;

        if(canSign){
            if(passStatus === 2){

                if(squadId > 0){

                    actions.train.squadApplys({
                        squad_id:squadId,
                        stype:3,
                        from_id:this.squadId,
                        resolved: (data) => {
                            this.refs.hud.show('报名成功', 1);

                            setTimeout(()=>{
                                navigation.navigate('HasCourse',{squadId:squadId,page:this.page})
                            },1000)
                            
                        },
                        rejected: (res) => {
                            let tip = '报名失败'
                            if(res === 'SQUAD_MAX_NUM'){
                                tip = '超出人数范围'
                            }
                            this.refs.hud.show(tip, 1);
                        },
                    })
                    
                } else {
                    this.refs.hud.show('请选择线下课程', 2);
                }
            } else {
                this.refs.hud.show('请先通过在线考试！', 2);
            }
        } else {
            this.refs.hud.show('您已报名同分类的线下培训班，你选择其他班级报名！', 2);
        }
    }



    _renderItem(item){
        const {squadId} = this.state;
        const sign = item.item;
        const on = squadId === sign.squadId;

        return(
            <TouchableOpacity  style={[styles.course ,styles.fd_r ,styles.ai_ct ,styles.mt_20]}
                onPress={()=>this._onSelect(sign)}
            >
                <View style={[styles.fd_c ,styles.col_1]}>
                    <Text style={[styles.lg_label ,styles.c33_label ,styles.mb_15 ,styles.fw_label]}>{sign.squadName}</Text>
                    <View style={[styles.d_flex ,styles.fd_r ,styles.mb_15]}>
                        <Text  style={[styles.default_label ,styles.c33_label]}>班级人数：{sign.enrollNum}</Text>
                        <Text  style={[styles.default_label ,styles.c33_label ,styles.pl_10]}>已报名：{sign.registeryNum}</Text>
                    </View>
                    <Text style={[styles.default_label ,styles.gray_label ,styles.mb_5]}>报名时间：{sign.endTimeFt}</Text>
                    <Text style={[styles.default_label ,styles.gray_label]}>上课地点：{sign.location}</Text>
                </View>
                <View style={[styles.iconCover]}>
                    <Image  source={on ? asset.radio_full : asset.radio} style={[styles.icon]} />
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const {O2oList,squadId,type,canSign} = this.state;

        let typestr = '提交';

        if(type === 0){
            typestr = '提交'
        } else if(type === 1){
            typestr = '已报名'
        } else if(type === 2){
            typestr = '人数已满'
        } else if(type === 3){
            typestr = '已截止'
        } else if(type === 4){
            typestr = '未开始'
        } else if(type === 100){
            typestr = '提交'
        }

        return (
            <View style={[styles.container]}>
                {
                    this.items.length > 0 ?
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.items}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                        onFooterRefresh={this._onFooterRefresh}
                    />
                :null}

                {
                    this.itemtype !== null ?
                    <View style={[styles.btm]}>
                        {
                            type === 2 || type === 3 || type === 4 || type === 100 ?
                            <View style={[styles.submit ,styles.lock]}>
                                <Text style={[styles.white_label ,styles.default_label]}>{typestr}</Text>
                            </View>
                            :
                            <TouchableOpacity style={[styles.submit]}
                                onPress={()=>this._actions(type)}
                            >
                                <Text style={[styles.white_label ,styles.default_label]}>{typestr}</Text>
                            </TouchableOpacity>
                        }
                    </View>

                :null}

                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex: 1,
        backgroundColor:'#ffffff',
    },
    course:{
        marginLeft:15,
        marginRight:15,
        borderRadius:5,
        backgroundColor:'#ffffff',
        padding:20,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(240,240,240,1)',
        shadowOpacity: 1.0,
        elevation: 2,
    },
    iconCover:{
        width:15,
        height:15,
    },
    icon:{
        width:15,
        height:15,
    },
    btm:{
        width:'100%',
        height:50,
        backgroundColor:'#ffffff',
    },
    submit:{
        marginLeft:15,
        marginRight:15,
        backgroundColor:'#F4623F',
        borderRadius:5,
        height:36,
        marginTop:7,
        borderTopColor:'rgba(240,240,240,1)',
        borderTopWidth:1,
        borderStyle:'solid',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    lock:{
        backgroundColor:'#BFBFBF'
    }
});


export const LayoutComponent = OfflineSign;

export function mapStateToProps(state) {
	return {
        o2o:state.train.o2o,
        o2oDetail:state.train.o2oDetail,
        studyStatus:state.train.studyStatus,
        o2oExamPaper:state.train.o2oExamPaper,
	};
}


