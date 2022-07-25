import React, { Component } from 'react'
import { Text, View ,Image,StyleSheet, TouchableOpacity, ScrollView,RefreshControl} from 'react-native'

import theme from '../../../config/theme';
import HudView from '../../../component/HudView';

class TopicSort extends Component {


    static navigationOptions = {
        title:'题目分类',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.squadId = navigation.getParam('squadId', 0);
        
        this.sort = [];

        this.state = {
            squadId:this.squadId,
            vedioStatus:false,
            exerciseStatus:false,
            isRefreshing: false,
        }

        this._toTopic =this._toTopic.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {configCateNewCert,studyStatus} = nextProps;

        if(configCateNewCert !== this.props.configCateNewCert){

            this.sort = configCateNewCert;

        }

        if(studyStatus !== this.props.studyStatus){

            this.setState({
                vedioStatus:studyStatus.vedioStatus,
                exerciseStatus:studyStatus.exerciseStatus
            })
            if(!studyStatus.vedioStatus){
                this.refs.hud.show('请先完成视频必修课程学习', 2);
            }

        }
       
    }

    componentDidMount(){
        
        this._onRefresh();
    }




    _toTopic(categoryId){
        const {navigation} = this.props;
        const {vedioStatus,exerciseStatus} = this.state;

        let test_id = 0 

        if(!exerciseStatus){
            test_id = -1
        }

        if(vedioStatus){

            navigation.navigate('DoingTopic',{categoryId:categoryId,test_id:test_id,squadId:this.squadId});

        } else {

            this.refs.hud.show('请先完成视频必修课程学习', 2);

        }
        
    }  
    
    _onRefresh(){
        const {actions} = this.props;
        const {squadId} = this.state;
        actions.train.configCateNewCert(squadId,96);
        actions.train.studyStatus(squadId);
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        },2000)
    }

    render() {

        let chooseExam = [];
        let mustExam = [];

        this.sort.map((cate,index)=>{
            if(cate.isMust === 0){
                chooseExam.push(this.sort[index])
            } else {
                mustExam.push(this.sort[index])
            }
        })


        return (
            <View style={[styles.container]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}  
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={this._onRefresh}
                          tintColor="#2c2c2c"
                          title="Loading..."
                          titleColor="#2c2c2c"
                          colors={['#2c2c2c', '#2c2c2c', '#2c2c2c']}
                          progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    <View style={[styles.sortBox]}>  
                        <View style={[styles.block_wrap]}>
                            <View style={[styles.title,styles.fd_r,styles.ai_ct,styles.pt_10,styles.pr_12,styles.pb_10]}>
                                <Text style={[styles.black_label,styles.lg20_label]}>必考</Text><Text style={[styles.tip_label,styles.sm_label]}>({mustExam.length})</Text>
                            </View>
                            {
                                mustExam.map((cate,index)=>{
                                    return(
                                        <TouchableOpacity style={[styles.item,styles.pt_15,styles.pb_15]} key={'cate' + index }
                                            onPress = {()=>this._toTopic(cate.categoryId)}
                                        >
                                            <Image style={[styles.item_icon]} source={{uri:cate.link}} />
                                            <Text style={[styles.black_label ,styles.default_label,styles.mt_10]} numberOfLines={1}>{cate.categoryName}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        <View style={[styles.block_wrap]}>
                            <View style={[styles.title,styles.fd_r,styles.ai_ct,styles.pt_10,styles.pr_12,styles.pb_10]}>
                                <Text style={[styles.black_label,styles.lg20_label]}>选考</Text><Text style={[styles.tip_label,styles.sm_label]}>({chooseExam.length})</Text>
                            </View>
                            {
                                chooseExam.map((cate,index)=>{

                                    return(
                                        <TouchableOpacity style={[styles.item,styles.pt_15,styles.pb_15]} key={'cate' + index }
                                            onPress = {()=>this._toTopic(cate.categoryId)}
                                        >
                                            <Image style={[styles.item_icon]} source={{uri:cate.link}} />
                                            <Text style={[styles.black_label ,styles.default_label,styles.mt_10]} numberOfLines={1}>{cate.categoryName}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>

                    <HudView ref={'hud'} />
                </ScrollView>
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
    sortBox:{
        width:theme.window.width * 0.84,
        marginLeft:theme.window.width * 0.08
    },
    item:{
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:1,
        borderStyle:'solid'
    },
    item_icon:{
        width:'100%',
        height:130,
        borderRadius:5,
        backgroundColor:'#fafafa'
    }
})

export const LayoutComponent = TopicSort;

export function mapStateToProps(state) {
	return {
        configCateNewCert:state.train.configCateNewCert,
        studyStatus:state.train.studyStatus,
	};
}
