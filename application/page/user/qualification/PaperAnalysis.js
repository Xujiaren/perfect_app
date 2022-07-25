import React, { Component } from 'react'
import { Text, View ,Image,StyleSheet, TouchableOpacity, ScrollView,Modal} from 'react-native'

import Carousel from 'react-native-looped-carousel';
import HudView from '../../../component/HudView';

import theme from '../../../config/theme';

class PaperAnalysis extends Component {


    static navigationOptions = ({navigation}) => {
        const paperName = navigation.getParam('paperName', {paperName: ''});
    
        let pName = '试题分析'

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
            ttype:0, // 0 单选 1判断 3 多选
            testId:0,
            userAnswer:'',
            topicAnswer:'',
            correctNum:0
        }

        this._renderTopic = this._renderTopic.bind(this);
        this._onNext = this._onNext.bind(this);
        this._onPrev = this._onPrev.bind(this);
        this._selectCard= this._selectCard.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {examPaper} = nextProps;

        if(examPaper !== this.props.examPaper){

            let answer_list = {};
            let answer_lists = {};


            examPaper.topicList.map((topic,index)=>{

                answer_list[topic.topicId] = null;
                answer_lists[topic.topicId] = null;

                answer_list[topic.topicId] =  topic.userAnswer.answer;
                answer_lists[topic.topicId] =  topic.userAnswer.topicAnswer;

            })

            this.setState({
                answer_lists:answer_lists,
                topicList:examPaper.topicList,
                topicNum:examPaper.topicNum,
                status:examPaper.status,
                answer_list:answer_list,
                correctNum:examPaper.correctNum
            })

        }
    }

    componentDidMount(){
        const {actions} = this.props;
        const {paper_id} = this.state;
        actions.user.examPaper(paper_id,0);
    }



    _onNext(){
        let {topic_index,topicList} = this.state;

        if (topic_index < (topicList.length - 1)) {
			topic_index++;

			this.setState({
                topic_index: topic_index,
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
            topic_index: topic_index,
        })  
    }

    _selectCard(index){

        this.setState({
            topic_index:index,
            isAnswer:false
        })
    }

    _renderTopic(){
        const {topic_index,answer_list,topicList,answer_lists} = this.state;

        let qust = topicList[topic_index];

        if(qust.ttype === 0 || qust.ttype ===1){

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

                                const _on = answer_list[topicList[topic_index].topicId].split(",").indexOf(qustion.optionId + '') > -1
                                const _ok = answer_lists[topicList[topic_index].topicId].split(",").indexOf(qustion.optionId + '') > -1


                                return(
                                    <View key={index+'_index'} style={[{marginRight:34}]}>
                                        { 
                                            topicList[topic_index].userAnswer.answer == "" ?
                                            <TouchableOpacity style={[styles.mt_20,styles.fd_r,styles.jc_fs,styles.ai_ct]} >
                                                <View  style={[styles.item_icon ,_on&&styles.item_onicon,styles.ai_ct,styles.jc_ct ,styles.mr_20]}>
                                                    <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                                </View>
                                                <View style={[styles.viewEword]}  >
                                                    <Text style={[styles.lh18_label,styles.lg_label,styles.c33_label, _on&&styles.item_ontxt]}>{qustion.optionLabel}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        :
                                            <View>
                                                {
                                                    _ok ? 
                                                    <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                        <View style={[styles.item_icon ,styles.item_onicon,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                            <Text>{String.fromCodePoint(index+65)}</Text>
                                                        </View>
                                                        <View style={[styles.viewEword]}>
                                                            <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel + '  '}<Text style={[styles.item_ontxt,styles.lg16_label ,styles.ml_15]}>正确</Text></Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View>
                                                        {
                                                            _on ?
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon ,styles.item_onerr,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.default_label,styles.white_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword]}>
                                                                    <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel + '  '}<Text style={[styles.error_txt ,styles.lg16_label,styles.pl_10]}>错误</Text></Text>
                                                                </View>
                                                            </View>
                                                            :
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword]}>
                                                                    <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel}</Text>
                                                                </View>
                                                            </View>
                                                        }   
                                                    </View>
                                                }
                                            </View>
                                    }
                                    </View>
                                    
                                )
                            })
                        }  


                        {
                            topicList[topic_index].userAnswer.answer !== ""  ?
                            <View style={[styles.answer_wrap,styles.mt_25]}>
                                <View style={[styles.answer_title]}><Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>解析</Text></View>
                                <Text style={[styles.answer_content,styles.tip_label,styles.default_label,styles.mt_15]}>
                                    {topicList[topic_index].analysis}
                                </Text>
                            </View>
                        :null}


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
                            const ok = answer_lists[topicList[topic_index].topicId].split(",").indexOf(qustion.optionId + '')  > -1
                            if(answer_list[topicList[topic_index].topicId] !== undefined){
                                on = (answer_list[topicList[topic_index].topicId]).indexOf(qustion.optionId + '')  > -1 ;
                            }


                            return(
                                <View key={index+'_index'} style={[{marginRight:34}]}>
                                    { 
                                        topicList[topic_index].userAnswer.answer == "" ?
                                            <TouchableOpacity style={[styles.mt_20,styles.fd_r,styles.jc_fs,styles.ai_ct]} >
                                                <View  style={[styles.item_icon ,on&&styles.item_onicon,styles.ai_ct,styles.jc_ct ,styles.mr_20]}>
                                                    <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                                </View>
                                                <View style={[styles.viewEword]} >
                                                    <Text style={[styles.lh18_label,styles.lg_label,styles.c33_label, on&&styles.item_ontxt]}>{qustion.optionLabel}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        :
                                        <View>
                                            {
                                                ok ?
                                                <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                    <View style={[styles.item_icon ,styles.item_onicon,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                        <Text>{String.fromCodePoint(index+65)}</Text>
                                                    </View>
                                                    <View style={[styles.viewEword]}>
                                                        <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel+ '  '}<Text style={[styles.item_ontxt ,styles.pl_10]}>正确</Text></Text>
                                                    </View>
                                                </View>
                                                :
                                                <View>
                                                        {
                                                            on ?
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon ,styles.item_onerr,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.default_label,styles.white_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword]}>
                                                                    <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel+ '  '}<Text style={[styles.error_txt ,styles.pl_10]}>错误</Text></Text>
                                                                </View>
                                                            </View>
                                                            :
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword]}>
                                                                    <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel}</Text>
                                                                </View>
                                                            </View>
                                                        }   
                                                    </View>
                                            }
                                        </View>
                                    }
                                </View>
                            )
                        })
                    }

                    {
                        topicList[topic_index].userAnswer.answer != ""  ?
                        <View style={[styles.answer_wrap,styles.mt_25]}>
                            <View style={[styles.answer_title]}><Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>解析</Text></View>
                            <Text style={[styles.answer_content,styles.tip_label,styles.default_label,styles.mt_15]}>
                                {topicList[topic_index].analysis}
                            </Text>
                        </View>
                    :null} 

                </View>
            </View>
            )
        }
        
    }




    render() {
        const {duration,topicList ,isAnswer,status,answer_list,paper_id,answer_lists,topic_index,correctNum} = this.state;

        let outside_box = [];

        for(let i = 0 ; i < topicList.length ; i+=15){
            outside_box.push(topicList.slice(i,i+15));
        }


        return (
            <View style={[styles.container]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        status === 0 || status === 1 ?
                        <View style={[styles.topic_wrap,styles.pl_20,styles.pr_20,styles.pb_20]}>
                            {this._renderTopic()}
                        </View>
                    :null}
                </ScrollView>
                {/* 底部 */}
                <View style={[styles.topic_menu]}>
                    <View style={[styles.btn_wrap]}>
                        <View style={[styles.btn_wrap_l,styles.fd_r,styles.ai_ct]}>
                            <TouchableOpacity style={[styles.col_1 ,styles.ai_ct ,styles.jc_ct]} onPress={this._onNext}>
                                <Text style={[styles.lg_label,styles.gray_label]}>下一题</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1 ,styles.ai_ct ,styles.jc_ct]} onPress={this._onPrev}>
                                <Text style={[styles.lg_label,styles.gray_label]}>上一题</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.card_btn]}
                            onPress={()=>{this.setState({ isAnswer:true })}}
                        >
                            <Image style={[styles.card_icon]}  source={{uri:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9ae54da2-cec8-4a4d-9f48-5dad17d8d1af.png"}}/>
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
                                    <Text style={[styles.default_label,styles.c33_label]} space='nbsp'>正确  {correctNum}</Text>
                                </View>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <View style={[styles.disc ,styles.bg_orange1]}></View>
                                    <Text style={[styles.default_label,styles.c33_label]} space='nbsp'>错误  {topicList.length - correctNum }</Text>
                                </View>
                                <Text style={[styles.gray_label]}>{topic_index + 1}/{topicList.length}</Text>
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
                                                        const on = index * 15 + idx === topic_index;

                                                        return(
                                                            <View key={'_ele' + idx} style={[styles.w_20]}>
                                                                {
                                                                    _ele.userAnswer.answer == ""  ?
                                                                    <TouchableOpacity style={[styles.swiper_item_wrap,styles.bg_white,on ?{borderColor:'#99D321'}:{}]}
                                                                        onPress={()=> this._selectCard(15*index + idx,_ele)}
                                                                    >
                                                                        <Text style={[styles.gray_label,styles.default_label]}>{index * 15 + idx + 1 }</Text>
                                                                    </TouchableOpacity>
                                                                    : 
                                                                    _ele.userAnswer.isCorrect === 0 ?
                                                                    <TouchableOpacity style={[styles.swiper_item_wrap,styles.bg_orange1]}
                                                                        onPress={()=> this._selectCard(15*index + idx,_ele)}
                                                                    >
                                                                        <Text style={[styles.white_label,styles.default_label]}>{index * 15 + idx + 1 }</Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <TouchableOpacity style={[styles.swiper_item_wrap,styles.bg_green,on ?{borderColor:'#99D321'}:{}]}
                                                                        onPress={()=> this._selectCard(15*index + idx,_ele)}
                                                                    >
                                                                        <Text style={[styles.white_label,styles.default_label]}>{index * 15 + idx + 1 }</Text>
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
    
    
    submit_btn:{
        borderRightWidth:1,
        borderRightColor:'#EEEEEE',
        borderStyle:'solid',
        justifyContent:'center',
        alignItems:'center'
    },
    btn_wrap_l:{
        width:theme.window.width * 0.5,
    },
    card_btn:{
        width:theme.window.width * 0.5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
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
        backgroundColor:'#ffffff',
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

export const LayoutComponent = PaperAnalysis;

export function mapStateToProps(state) {
	return {
        examPaper:state.user.examPaper
	};
}


