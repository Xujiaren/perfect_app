import React, { Component } from 'react'
import { Text, View ,Image,StyleSheet, TouchableOpacity, ScrollView } from 'react-native'

import Carousel from 'react-native-looped-carousel';
import theme from '../../../config/theme';

class PracticeResult extends Component {

    static navigationOptions = {
        title:'练习结果',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);
        const {navigation} = this.props;
        this.test_id = navigation.getParam('test_id', 0);
        this.squadId = navigation.getParam('squadId',0)
        this.testInfo = {},

        this.state = {
            type:'',
            test_id:this.test_id,
            topicNum:0,
            correctNum:0,
            status:0,
            topicList:[],
            great_img:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/55aa1ef3-1c03-428d-a9c5-7d380dc1150e.png",
            good_img:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c94fdd9e-3727-4fb0-8934-7e03faaefb6a.png",
            nopass_img:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/04650cfa-e390-4418-b88c-4e1e124ffe1b.png",
            share_icon:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24889223-5a1b-4d7b-a05f-4b26dd8bc3b9.png",
            percentage:0,
            score:0,
            squadId:0,
            exerciseStatus:true,
        }

        this._toTest = this._toTest.bind(this);
    }


    componentWillReceiveProps(nextProps){
        const {studyStatus,testInfo} = nextProps;

        if(studyStatus !== this.props.studyStatus){

            this.setState({
                vedioStatus:studyStatus.vedioStatus,
                exerciseStatus:studyStatus.exerciseStatus
            })

        }

        if(testInfo !== this.props.testInfo){

            this.setState({
                topicNum:testInfo.topicNum,
                correctNum:testInfo.correctNum,
                status:testInfo.status,
                topicList:testInfo.topicList,
                score:testInfo.score
            })
        }




    }

    componentDidMount(){
        const {actions} = this.props;
        const {squadId} = this.state;

        actions.train.studyStatus(this.squadId);
        actions.train.testInfo(this.test_id);

    }



    _toTest(){

    }


    render() {

        const {topicNum,correctNum,great_img,share_icon,topicList,score,exerciseStatus} = this.state;

        let all_box = [];

        for(let i = 0 ; i < topicList.length ; i+=15){
            all_box.push(topicList.slice(i,i+15));
        }


        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={[styles.img_bg_wrap]}>
                        <Image source={{uri:great_img}} style={[styles.img_bg]} mode='aspectFit'/>
                        <View style={[styles.result_wrap]}>
                            <View style={[styles.text_wrap]}>
                                <Text style={[styles.text_top]}>{score}</Text>
                                <Text style={[styles.c33_label,styles.default_label]}>成绩</Text>
                            </View>
                            <View style={[styles.text_wrap]}>
                                <Text style={[styles.text_top]}>{correctNum}</Text>
                                <Text style={[styles.c33_label,styles.default_label]}>答对</Text>
                            </View>
                            <View style={[styles.text_wrap]}>
                                <Text style={[styles.text_top]}>{topicNum - correctNum > 0 ? topicNum - correctNum : 0}</Text>
                                <Text style={[styles.c33_label,styles.default_label]}>答错</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.title_wrap]}>
                        <Text style={[styles.title_bold]}>练习回顾</Text>
                        <View style={[styles.tips_wrap,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <View style={[styles.radius]}></View>
                            <Text space='nbsp' style={[styles.sm_label,styles.c33_label]}>正确</Text>
                            <View style={[styles.radius ,styles.bg_orange]}></View>
                            <Text space='nbsp' style={[styles.sm_label,styles.c33_label]}>错误</Text>
                        </View>
                    </View>

                    {
                        all_box.length > 0 ?
                        <View style={styles.swiper_wrap}>
                            <Text style={[styles.c33_label,styles.default_label,styles.ml_30,styles.mt_25,styles.mb_15]}>题目</Text>
                            <Carousel
                                useScrollView={true}
                                delay={6000}
                                style={[styles.gift]}
                                autoplay={false}
                                swiper
                                bullets={true}
                                isLooped={false}
                                pageInfo={false} 
                                bulletStyle={styles.gift_dot}
                                chosenBulletStyle={styles.gift_dot_on}
                            >
                                {
                                    all_box.map((top,index)=>{

                                        return(
                                            <View key={'top' + index} style={styles.swiper_single_box}>
                                                {
                                                    top.map((_ele,idx)=>{
                                                        const on = (_ele.userAnswer.answer === _ele.userAnswer.topicAnswer) && _ele.userAnswer.answer !== '' ;
                                                        return(
                                                            <View key={'_ele' + idx} style={[styles.w_20]}>
                                                                <View style={[styles.swiper_item_wrap,styles.bg_orange,on&&styles.bg_green]}>
                                                                    <Text style={[styles.white_label,styles.default_label]}>{index * 15 + idx + 1 }</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                        
                                                    })
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </Carousel>
                        </View>
                    :null}
                    
                    <View style={[styles.hr_line]}></View>
                </ScrollView>
                
                {
                    exerciseStatus  ?
                    <View style={[styles.bottom_btn]}>
                        <TouchableOpacity style={[styles.inner_btn,styles.fd_r,styles.jc_ct,styles.ai_ct]} 
                            onPress={this._toTest}
                        >
                            <Text style={[styles.white_label,styles.default_label]}>再次练习</Text>
                        </TouchableOpacity>
                    </View>
                :null}
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#fafafa'
    },
    img_bg_wrap:{
        width:theme.window.width,
        height:271,
        position:'relative',
    },
    img_bg:{
        width:'100%',
        height:'100%',
    },
    share_icon:{
        position:'absolute',
        width:19,
        height:19,
        top:31,
        right:13,
    },
    result_wrap:{
        position:'absolute',
        bottom:22,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15,
    },
    text_wrap:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'space-between',
        height:56,
    },
    text_top:{
        color:'#00559F',
        fontSize:20,
    },
    title_wrap:{
        borderBottomColor:'#EFEFEF',
        borderBottomWidth:1,
        borderStyle:'solid',
        paddingTop:18,
        paddingBottom:18,
        marginLeft:31,
        marginRight:31,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flexWrap:'nowrap',
    } ,
    radius:{
        borderRadius:4,
        width:8,
        height:8,
        backgroundColor:'#99D321',
        marginRight:5
    },
    bg_orange:{
        backgroundColor:'#F4623F',
        marginLeft:12,
        marginRight:5
    },
    hr_line:{
        padding:25,
    },
    bottom_btn:{
        width:theme.window.width,
        height:50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
        marginTop:100,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(240,240,240,1)',
        shadowOpacity: 1.0,
        elevation: 2,
    },
    inner_btn:{
        width:340,
        height:36,
        backgroundColor:'#F4623F',
        borderRadius:5,
    },
    gift: {
        width: theme.window.width,
        height: 200,
    },
    swiper_single_box:{
        width:theme.window.width,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    w_20:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:25,
        width:(theme.window.width) /5,
    },
    swiper_item_wrap:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:30,
        height:30,
        borderRadius:15,
        backgroundColor:'#EBEBEB',
        borderStyle:'solid',
        borderColor:'transparent',
        borderWidth:1
    },
    gift_dot: {
        backgroundColor: '#C5C5C5',
        width: 6,
        height: 6,
        borderRadius: 3,
        borderColor: '#C5C5C5',
        marginTop: 40,
        marginBottom:5,
        marginLeft:6,
        marginRight:6,
    },
    gift_dot_on: {
        backgroundColor: '#545454',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 40,
        marginBottom:5,
        marginLeft:6,
        marginRight:6,
    },
    bg_green:{
        backgroundColor:'#99D321',
    }
})

export const LayoutComponent = PracticeResult;

export function mapStateToProps(state) {
	return {
        studyStatus:state.train.studyStatus,
        testInfo:state.train.testInfo
	};
}


