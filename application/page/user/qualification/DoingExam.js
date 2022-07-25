import React, { Component } from 'react'
import { Text, View ,Image,StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native'

import Carousel from 'react-native-looped-carousel';

import HudView from '../../../component/HudView';

import theme from '../../../config/theme';

import {countDown} from '../../../util/common';
function del(arr){
    for(let i = 0 ; i < arr.length;i++){
        if(arr[i] === ''){
            arr.splice(i,1);
            i = i-1;
        } 
    }
    return arr;
}

class DoingExam extends Component {

    static navigationOptions = ({navigation}) => {
        const paperName = navigation.getParam('paperName', {paperName: '课程详情'});
    
        let pName = '试题'

        if(paperName != '' && paperName != undefined){
            pName = paperName
        }

		return {
            title: pName,
            headerRight: <View/>,
		}
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;

        this.squadId = navigation.getParam('squadId', 0);
        this.paperName = navigation.getParam('paperName', '');
        this.e_percentage = navigation.getParam('e_percentage', 0);
        this.e_duration = navigation.getParam('e_duration', 0);
        this.paper_id = navigation.getParam('paper_id', 0);


        this.state = {
            status:2,
            topicNum:0,
            isAnswer:false,
            categoryId:0,
            paper_id:this.paper_id,
            topic_index:0,
            answer_list:{},
            answer_lists:{},
            duration:0,
            topicList:[],
            page:0,
            ttype:0, // 0 单选  3 多选
            testId:0,
            paperIsExam:true,
            topicStaus:0, // 考试中
            isAudio:false,
            percentage:0,
            paperName:'',
            exerciseStatus:false,
            squadId:this.squadId,
            duration:this.e_duration,
        }

        this._onNext = this._onNext.bind(this);
        this._onPrev = this._onPrev.bind(this);
        this._renderTopic = this._renderTopic.bind(this);
        this._onSumit = this._onSumit.bind(this);
        this._onAnswer = this._onAnswer.bind(this);
        this._selectCard = this._selectCard.bind(this);

    }

    componentWillReceiveProps(nextProps){

        const {examPaper} = nextProps;
        const { topicStaus } = this.state
        if(examPaper !== this.props.examPaper){

            let answer_list = {};
            let answer_lists = {};


            examPaper.topicList.map((topic,index)=>{

                answer_list[topic.topicId] = null;
                answer_lists[topic.topicId] = null;

                answer_list[topic.topicId] =  '';
                answer_lists[topic.topicId] = '';

            })

            this.setState({
                topicList:examPaper.topicList,
                topicNum:examPaper.topicNum,
                status:examPaper.status,
                testId:examPaper.testId,
                answer_list:answer_list,
                answer_lists:answer_lists
            },()=>{
                if(topicStaus === 0 ){
                    this.timer = setInterval(() => this._onCountDown(), 1000);
                }
            })

        }
    }
    _onCountDown() {
        var that = this;
        let { duration } = that.state

        duration--;

        if (duration === 0) {
            that.setState({
                topicStaus: 1
            })
            clearInterval(this.timer);
            Alert.alert('考试','考试时间到',[
                { text: 'ok', onPress: () => {
                    that._onSubmit()
                }
            }])
        }

        that.setState({
            duration: duration
        })
    }

    componentDidMount(){
        const {actions} = this.props;
        const {paper_id} = this.state;
        actions.user.examPaper(paper_id,0);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    _onNext(){
        let {topicList,topic_index} = this.state;

        if (topic_index < (topicList.length - 1)) {
			topic_index++;

			this.setState({
				topic_index: topic_index
			})
        } else if(topic_index == (topicList.length - 1)) {

            this.refs.hud.show('已是最后一题', 1);
        }
    }

    _onPrev(){
        let {topic_index} = this.state;

        if (topic_index > 0) {
            topic_index--;
        }

        this.setState({
            topic_index: topic_index
        }) 
    }


    _onAnswer(ttype,topic_id,ctopic_id,index,optionId){

        const {answer_list,answer_lists} = this.state;

        if(ttype === 0 ||  ttype === 1){
            let answer_arr_num = (optionId + '' ).split(",").map(Number)
            answer_list[parseInt(topic_id)] = (optionId + '' ).split(",")
            answer_lists[parseInt(topic_id)] = answer_arr_num


        } else if(ttype === 3){

            if(answer_list[topic_id] === undefined || answer_list[topic_id] === "" ){
                let answer_ids = []

                if(answer_ids.indexOf(optionId + '') > -1){
                    answer_ids.splice(answer_ids.indexOf(optionId+''),1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str=  answer_ids.join(",")
                
                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ids.map(Number)

            } else {
                let  answer_ids  = answer_list[topic_id].split(",")
                if(answer_ids.indexOf(optionId + '') > -1){
                    answer_ids.splice(answer_ids.indexOf(optionId+ ''),1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str =  answer_ids.join(",")

                let answer_ar = answer_ids.map(Number)

                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ar


            } 
        }

        this.setState({
            answer_list:answer_list,
            answer_lists:answer_lists
        })
    }


    _onSumit(){
        const {actions,navigation} = this.props;
        const { duration ,testId,paper_id,answer_lists,percentage,squadId} = this.state;

        actions.train.userExam({
            test_id:testId,
            levelId:0,
            duration:duration,
            answer:JSON.stringify(answer_lists),
            resolved: (data) => {
                this.refs.hud.show('提交成功', 1);
                let key =navigation.state.key
                setTimeout(()=>{navigation.navigate('ExerciseResult',{type:'exam',paper_id:paper_id,e_percentage:percentage,squadId:squadId,key:key,refresh:this.onbacks})},1000)
            },
            rejected: (res) => {
                
            },
        })

    }
    onbacks=()=>{
        this.props.navigation.goBack()
        this.props.navigation.state.params.refresh()
    }
    _renderTopic(){
        const {topic_index,answer_list,topicList,isAudio} = this.state;

        let qust = topicList[topic_index];

        if(qust.ttype === 0 || qust.ttype === 1){

            return(
                <View style={[styles.topic_content_wrap]}>
                    <View style={[styles.topic_type]}>
                        <Text style={[styles.topic_type_title]}>{qust.ttype === 0?'单选':'判断'}</Text>
                        <Text style={[styles.topic_type_num]}><Text style={[styles.text_bold]}>{topic_index+1}</Text>/{topicList.length}</Text>
                    </View>
                    <View style={[styles.topic_content]}>
                        <View><Text style={[styles.lh20_label,styles.lg_label,styles.c33_label]}>{qust.title}</Text></View>
                        {
                            topicList[topic_index].optionList.map((qustion,index)=>{
                                

                                const on = answer_list[topicList[topic_index].topicId] == qustion.optionId;

                                return(
                                    <TouchableOpacity key={index+'_index'} style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20,{marginRight:34}]} onPress={()=> this._onAnswer(qust.ttype,qust.topicId,0,index,qustion.optionId)}>
                                        <View  style={[styles.item_icon ,on&&styles.item_onicon,styles.ai_ct,styles.jc_ct ,styles.mr_20]}>
                                            <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                        </View>
                                        <View style={[styles.viewEword,styles.mr_15]}  >
                                            <Text style={[styles.lh18_label,styles.lg_label,styles.c33_label,on&&styles.item_ontxt]}>{qustion.optionLabel}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    
                                )
                            })
                        }  

                    </View>
                </View>
            )

        } else {

            return(
                <View style={styles.topic_content_wrap}>
                <View style={[styles.topic_type]}>
                    <Text style={[styles.topic_type_title]}>多选</Text>
                    <Text style={[styles.topic_type_num]}><Text style={[styles.text_bold]}>{topic_index+1}</Text>/{topicList.length}</Text>
                </View>
                <View style={styles.topic_content}>
                    <View><Text style={[styles.lg_label,styles.c33_label,styles.lh20_label]}>{qust.title}</Text></View>
                    {
                        topicList[topic_index].optionList.map((qustion,index)=>{

                            let on = false;
                            if(answer_list[topicList[topic_index].topicId] !== undefined){
                                on = (answer_list[topicList[topic_index].topicId]).indexOf(qustion.optionId)  > -1 ;
                            }

                            return(
                                <TouchableOpacity key={index+'_index'} style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20,{marginRight:34}]} onPress={()=> this._onAnswer(qust.ttype,qust.topicId,0,index,qustion.optionId)}>
                                    <View  style={[styles.item_icon ,on&&styles.item_onicon,styles.ai_ct,styles.jc_ct ,styles.mr_20]}>
                                        <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                    </View>
                                    <View style={[styles.viewEword,styles.mr_15]}>
                                        <Text style={[styles.lh18_label,styles.lg_label,styles.c33_label,on&&styles.item_ontxt]}>{qustion.optionLabel}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </View>
            )
        }

        
    }

    // 选择答题卡中题目
    _selectCard(index,topic){


        this.setState({
            topic_index:index,
            isAnswer:false,
        })        
    }


    render() {

        const {duration,topicList ,isAnswer,status,answer_lists,topic_index} = this.state;

        let outside_box = [];
        for(let i = 0 ; i < topicList.length ; i+=15){
            outside_box.push(topicList.slice(i,i+15));
        }


        return (
            <View style={[styles.container]}>
                <View style={[styles.head ,styles.fd_r ,styles.ai_ct,styles.jc_sb]}>
                    <View style={[styles.fd_r ,styles.ai_ct ,styles.pl_20]}>
                        <TouchableOpacity style={[styles.text_c ]} onPress={this._onNext}>
                            <Text>下一题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pl_20]} onPress={this._onPrev}>
                            <Text>上一题</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.fd_r ,styles.ai_ct ,styles.pr_20]}>
                        <Text>{countDown(duration)}</Text>
                    </View>
                </View>
                
                <ScrollView
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        status === 0 ?
                        <View style={[styles.topic_wrap,styles.pl_20,styles.pr_20,styles.pb_20]}>
                            {this._renderTopic()}
                        </View>
                    :null}
                </ScrollView>
                

                {/* 底部 */}
                <View style={[styles.topic_menu]}>
                    <View style={[styles.btn_wrap ,styles.col_1]}>
                        <TouchableOpacity style={[styles.submit_btn ,styles.col_1]}
                            onPress = {this._onSumit}
                        >
                            <Text style={[styles.lg_label,styles.c33_label]}>交卷</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.card_btn ,styles.col_1,styles.ai_ct,styles.jc_ct,styles.fd_r]}
                            onPress={()=>this.setState({isAnswer:true})}
                        >
                            <Image style={[styles.card_icon]} mode='aspectFit' source={{uri:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9ae54da2-cec8-4a4d-9f48-5dad17d8d1af.png'}}/>
                            <Text style={[styles.lg_label,styles.gray_label]}>答题卡</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal  visible={isAnswer} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={()=>this.setState({isAnswer:false})}></TouchableOpacity>
                    <View style={styles.wechatType}>
                        <View style={[styles.wechatIcons,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <View style={[styles.pannel,styles.bg_white]}>
                                <View style={[styles.pannel_head,styles.fd_r,styles.ai_ct,styles.jc_sb]}>
                                <Text style={[styles.lg18_label,styles.c33_label]}>答题卡</Text>

                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <View style={[styles.disc]}></View>
                                    <Text style={[styles.default_label,styles.c33_label]} space='nbsp'>已做  {del(Object.values(answer_lists)).length}</Text>
                                </View>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <View style={[styles.disc ,styles.bg_orange]}></View>
                                    <Text style={[styles.default_label,styles.c33_label]} space='nbsp'>未做  {topicList.length - del(Object.values(answer_lists)).length}</Text>
                                </View>
                                <Text style={[styles.gray_label]}>{topic_index+1}/{topicList.length}</Text>
                            </View>
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
                                    outside_box.map((top,index)=>{

                                        return(
                                            <View key={'top' + index} style={styles.swiper_single_box}>
                                                {
                                                    top.map((_ele,idx)=>{
                                                        let on = false;

                                                        if(del(Object.values(answer_lists)).length > 0){
                                                            on = answer_lists[_ele.topicId]  !== ''
                                                        }


                                                        return(
                                                            <View key={'_ele' + idx} style={[styles.w_20]}>
                                                                {
                                                                    on ?
                                                                    <TouchableOpacity style={[styles.swiper_item_wrap,styles.bg_green]}
                                                                        onPress={()=> this._selectCard(15*index + idx,_ele)}
                                                                    >
                                                                        <Text style={[styles.white_label,styles.default_label]}>{index * 15 + idx + 1 }</Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <TouchableOpacity style={[styles.swiper_item_wrap,styles.bg_white]}
                                                                        onPress={()=> this._selectCard(15*index + idx,_ele)}
                                                                    >
                                                                        <Text style={[styles.gray_label,styles.default_label]}>{index * 15 + idx + 1 }</Text>
                                                                    </TouchableOpacity>
                                                                }
                                                                
                                                                
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
                        </View>
                    </View>
                </Modal>
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    head:{
        backgroundColor:'#ffffff',
        zIndex:9999,
        paddingTop:12,
        paddingBottom:12
    },
    topic_menu:{
        backgroundColor:'#ffffff',
        zIndex:2,
        height:60,
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flexWrap:'nowrap'
    },
    btn_wrap:{
        height:40,
        flexDirection:'row',
        alignItems:'stretch',
        flexWrap:'nowrap'
    },
    submit_btn:{
        borderRightWidth:1,
        borderRightColor:'#EEEEEE',
        borderStyle:'solid',
        justifyContent:'center',
        alignItems:'center'
    },
    card_icon:{
        width:17,
        height:17,
        marginRight:8
    },
    topic_content_wrap:{
        paddingBottom:60,
    },
    topic_type:{
        paddingLeft:20,
        paddingTop:20,
        paddingRight:16,
        paddingBottom:18,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    topic_content:{
        paddingLeft:20,
        paddingRight:5
    },
    item_icon:{
        width:30,
        height:30,
        borderRadius:15,
        backgroundColor:'#EBEBEB'
    },
    item_onicon:{
        backgroundColor:'#99D321'
    },
    topic_menu:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flexWrap:'wrap',
        backgroundColor:'#ffffff',
        height:50,
        zIndex:2,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 1
    },
    item_ontxt:{
        color:'#99D321'
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    wechatType:{
        position: 'absolute',
        bottom:0,
        left:0,
        width:theme.window.width,
        height:348,
        borderRadius:5,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        backgroundColor:'#ffffff'
    },
    wechatIcons:{
        width:theme.window.width,
        backgroundColor:'#ffffff',
        height:318
    },
    gift: {
        width: theme.window.width,
        height: 217,
        backgroundColor:'#ffffff'
    },
    bg_green:{
        backgroundColor:'#99D321',
    },
    bg_orange1:{
        backgroundColor:'#F4623F',
    },
    bg_white:{
        backgroundColor:'#ffffff',
        borderColor:'rgba(151,151,151,1)',
    },
    item_onerr:{
        backgroundColor:'#F4623F'
    },
    swiper_single_box:{
        width: theme.window.width,
        height:'100%',
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    w_20:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:(theme.window.width - 20 )/ 5 ,
        marginTop:25,
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
    mutibtn:{
        width:130,
        height:28,
        borderRadius:14,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#333333',
    },
    pannel_head:{
        flexWrap:'nowrap',
        paddingTop:19,
        paddingBottom:19,
        marginLeft:30,
        marginRight:30,
        borderBottomColor:'#EFEFEF',
        borderBottomWidth:1,
        borderStyle:'solid'
    },
    disc:{
        width:8,
        height:8,
        borderRadius:4,
        marginRight:5,
        backgroundColor:'#99D321'
    }
})

export const LayoutComponent = DoingExam;

export function mapStateToProps(state) {
	return {
        examPaper:state.user.examPaper
	};
}


