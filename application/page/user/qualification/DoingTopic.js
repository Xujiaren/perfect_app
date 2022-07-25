import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native'

import Carousel from 'react-native-looped-carousel';
import HudView from '../../../component/HudView';
import theme from '../../../config/theme';

class DoingTopic extends Component {


    static navigationOptions = ({navigation}) => {
        
        const title = navigation.getParam('title', '题目分类');
		return {
            title: title,
            headerRight: <View/>,
		}
	};


    constructor(props){
        super(props);

        const {navigation} = this.props;

        this.categoryId = navigation.getParam('categoryId', 0);
        this.test_id = navigation.getParam('test_id', 0);
        this.squadId = navigation.getParam('squadId',0)
        this.topicPaper = [];


        this.state = {
            categoryId:this.categoryId,
            test_id:this.test_id,
            isHide:false,
            left:0,
            worry:0,
            count:0,
            total:0,
            topic_id:0,
            correctNum:0, //做了多少道
            doneNum:0,
            topicNum:0,
            isAudio:false,
            isJump:false,
            topic_index:0,
            realAnswer:[],
            answer_list:[],
            isAnswer:false
        }

        this._toTopic  = this._toTopic.bind(this);
        this._onNext = this._onNext.bind(this);
        this._onPrev = this._onPrev.bind(this);
        this._onSumit = this._onSumit.bind(this);
        this._renderTopic = this._renderTopic.bind(this);
        this._onAnswer = this._onAnswer.bind(this);
        this._selectCard= this._selectCard.bind(this);
        this._mutiSibmit = this._mutiSibmit.bind(this);

    }

    componentWillReceiveProps(nextProps){

        const {o2oTopic,studyInfo} = nextProps;
        const {isJump} = this.state;
        if(o2oTopic !== this.props.o2oTopic){

            this.topicPaper = o2oTopic.topicList

            this.setState({
                test_id:o2oTopic.testInfo.testId,
                correctNum:o2oTopic.testInfo.correctNum,
                topicNum:o2oTopic.testInfo.topicNum,
                doneNum:o2oTopic.testInfo.doneNum,
            },()=>{
                if(!isJump){
                    if(o2oTopic.topicList.length > 0 && Array.isArray(o2oTopic.topicList)){
                        for(let i = 0 ; i < o2oTopic.topicList.length ; i++){
                            if(o2oTopic.topicList[i].userAnswer.answer === ''){
    
                                this.setState({
                                    topic_index:i
                                })
    
                                break;
                            }
                        }
                    }
                }
            })
        }

        if(studyInfo !== this.props.studyInfo){

            this.setState({
                all: studyInfo.all,
                count: studyInfo.count,
                left: studyInfo.left,
                total: studyInfo.total,
                worry: studyInfo.worry,
            })
        }

    }

    componentDidMount(){
        const {actions} = this.props;
        const {categoryId,test_id} = this.state;
        actions.train.o2oTopic(categoryId,test_id);
        actions.train.studyInfo(categoryId);
    }

    // 练习
    _toTopic(){
        const {navigation} = this.props;
        const {all} = this.state;

        if(all > 0){

            this.setState({
                isHide:true
            })

            navigation.setParams({title: '练习'});

        } else {
            this.refs.hud.show('暂无试题', 2);
        }
    }

    _selectCard(index){

        this.setState({
            topic_index:index,
            isAnswer:false
        })
    }

    _onNext(){
        let {topic_index} = this.state;

        if (topic_index < (this.topicPaper.length - 1)) {
			topic_index++;

			this.setState({
                topic_index: topic_index,
                isJump:true
			})
        } else if(topic_index == (this.topicPaper.length - 1)) {

            this.setState({
                isJump:true
            })

            this.refs.hud.show('已是最后一题', 1);
        }
        
        this.setState({
            realAnswer:[]
        })
    }

    _onPrev(){
        let {topic_index} = this.state;

        if (topic_index > 0) {
			topic_index--;
		}

		this.setState({
            topic_index: topic_index,
            realAnswer:[],
            isJump:true
        })  
    }


    _onAnswer=(ttype,topic_id,ctopic_id,index,optionId)=>{
        const {actions} = this.props;
        const {answer_list,categoryId,test_id,realAnswer} = this.state;
        let answer_str = '';

        this.setState({
            isJump:true
        })

        if(ttype === 0 ||  ttype === 1){

            answer_str = optionId
            answer_list[0] = optionId
            realAnswer[0] = optionId
            this.refs.hud.show('正在解析，请稍等', 1);
            actions.train.topicAnswer({
                test_id:test_id,
                topic_id:topic_id,
                answer:answer_str,
                resolved: (data) => {
                    actions.train.o2oTopic(categoryId,test_id);
                },
                rejected: (res) => {
                    
                },
            })


        } else if(ttype === 3){
            if(answer_list.indexOf(optionId) > -1){
                answer_list.splice(answer_list.indexOf(optionId),1)
                realAnswer.splice(answer_list.indexOf(optionId),1)
            } else {
                answer_list.push(optionId)
                realAnswer.push(optionId)
            }

            answer_list.sort();
            realAnswer.sort();

            answer_str = answer_list.sort().join(",");
        }

        this.setState({
            answer_list:answer_list,
            realAnswer:realAnswer,
            topic_id:topic_id,
        })
    }

    _onSumit(){
        const {navigation} = this.props;
        const {doneNum,topicNum,test_id} = this.state;

        let ishow = 0 ; // 默认不显示
        if(doneNum === topicNum){
            ishow = 1;
        }

        navigation.navigate('PracticeResult',{test_id:test_id,ishow:ishow,squadId:this.squadId})

    }


    _mutiSibmit(){
        const {actions} = this.props;
        const {answer_list,test_id,topic_id,categoryId,realAnswer} = this.state;

        let answer_str = ''
        answer_str = realAnswer.sort().join(",");
        this.refs.hud.show('正在解析，请稍等', 2);
        actions.train.topicAnswer({
            test_id:test_id,
            topic_id:topic_id,
            answer:answer_str,
            resolved: (data) => {
                actions.train.o2oTopic(categoryId,test_id);
            },
            rejected: (res) => {
                
            },
        })

    }





    _renderTopic(){
        const {topic_index,answer_list,topicPaper,correctNum,topicNum,doneNum,isAudio} = this.state;
        let qust = this.topicPaper[topic_index];

        if(qust.ttype === 0 || qust.ttype ===1){
            return(
                <View style={[styles.topic_content_wrap]}>
                    <View style={[styles.topic_type]}>
                        <Text style={[styles.topic_type_title]}>{qust.ttype === 0?'单选':'判断'}</Text>
                        <Text style={[styles.topic_type_num]}><Text style={[styles.text_bold]}>{topic_index+1}</Text>/{this.topicPaper.length}</Text>
                    </View>
                    <View style={[styles.topic_content]}>
                        <View><Text style={[styles.lh20_label,styles.lg_label,styles.c33_label]}>{qust.title}</Text></View>
                        {
                            this.topicPaper[topic_index].optionList.map((qustion,index)=>{
                                
                                let _on = false;
                                if(answer_list.length > 0){
                                    _on  = parseInt(answer_list[0]) === qustion.optionId;
                                }
                            
                                if(this.topicPaper[topic_index].userAnswer.answer.length > 0){
                                    _on = parseInt(this.topicPaper[topic_index].userAnswer.answer) === qustion.optionId
                                }

                                let _ok  = parseInt( this.topicPaper[topic_index].answer) === qustion.optionId

                                return(
                                    <View key={index+'_index'} style={[{marginRight:34}]}>
                                        { 
                                            this.topicPaper[topic_index].userAnswer.answer == "" ?
                                            <TouchableOpacity style={[styles.mt_20,styles.fd_r,styles.jc_fs,styles.ai_ct]}  onPress={()=> this._onAnswer(qust.ttype,qust.topicId,0,index,qustion.optionId)}>
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
                                                            <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel+ '  '}<Text style={[styles.item_ontxt,styles.lg16_label ,styles.pl_10]}>正确</Text></Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View>
                                                        {
                                                            _on ?
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon ,styles.item_onerr,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.white_label,styles.default_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword,styles.mr_15]}>
                                                                    <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel+ '  '}<Text style={[styles.error_txt ,styles.lg16_label,styles.pl_10]}>错误</Text></Text>
                                                                </View>
                                                            </View>
                                                            :
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword,styles.mr_15]}>
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
                            this.topicPaper[topic_index].userAnswer.answer !== ""  ?
                            <View style={[styles.answer_wrap]}>
                                <View style={[styles.answer_title]}><Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>解析</Text></View>
                                <Text style={[styles.answer_content,styles.tip_label,styles.default_label,styles.mt_15]}>
                                    {this.topicPaper[topic_index].analysis}
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
                    <Text style={[styles.topic_type_num]}><Text style={[styles.text_bold]}>{topic_index+1}</Text>/{this.topicPaper.length}</Text>
                </View>
                <View style={styles.topic_content}>
                    <View><Text style={[styles.lg_label,styles.c33_label,styles.lh20_label]}>{qust.title}</Text></View>
                    {
                        this.topicPaper[topic_index].optionList.map((qustion,index)=>{

                            let on = false;
                            let ok = false;

                            let answer_str = this.topicPaper[topic_index].answer.split(",");
                            on = answer_list.indexOf(qustion.optionId)  > -1;

                            if(this.topicPaper[topic_index].userAnswer.answer.length > 0){
                                on = this.topicPaper[topic_index].userAnswer.answer.split(",").indexOf(qustion.optionId.toString()) > -1;
                            }

                            ok = answer_str.indexOf(qustion.optionId.toString()) > -1 ;

                            return(
                                <View key={index+'_index'} style={[{marginRight:34}]}>
                                    { 
                                        this.topicPaper[topic_index].userAnswer.answer == "" ?
                                            <TouchableOpacity style={[styles.mt_20,styles.fd_r,styles.jc_fs,styles.ai_ct]}  onPress={()=> this._onAnswer(qust.ttype,qust.topicId,0,index,qustion.optionId)}>
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
                                                                    <Text style={[styles.white_label,styles.default_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword,styles.mr_15]}>
                                                                    <Text style={[styles.lg_label,styles.c33_label]}>{qustion.optionLabel+ '  '}<Text style={[styles.error_txt ,styles.pl_10]}>错误</Text></Text>
                                                                </View>
                                                            </View>
                                                            :
                                                            <View style={[styles.choosen_item,styles.fd_r,styles.jc_fs,styles.ai_ct,styles.mt_20]}>
                                                                <View style={[styles.item_icon,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mr_20]}>
                                                                    <Text style={[styles.default_label,styles.gray_label]}>{String.fromCharCode(index+65)}</Text>
                                                                </View>
                                                                <View style={[styles.viewEword,styles.mr_15]}>
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
                        this.topicPaper[topic_index].userAnswer.answer != ""  ?
                        <View style={[styles.answer_wrap]}>
                            <View style={[styles.answer_title]}><Text style={[styles.lg_label,styles.c33_label,styles.fw_label]}>解析</Text></View>
                            <Text style={[styles.answer_content,styles.tip_label,styles.default_label,styles.mt_15]}>
                                {this.topicPaper[topic_index].analysis}
                            </Text>
                        </View>
                    :null} 

                </View>
                {
                    this.topicPaper[topic_index].userAnswer.answer == ""  ?
                    <View  style={[styles.submitBtn,styles.fd_r,styles.jc_ct,styles.mt_30]}>
                        <TouchableOpacity style={[styles.mutibtn,styles.fd_r,styles.ai_ct,styles.jc_ct]} onPress={this._mutiSibmit}>
                            <Text  style={[styles.c33_label,styles.default_label]}>确认提交</Text>
                        </TouchableOpacity>
                    </View>
                :null}
            </View>
            )
            
        }
        
    }


    render() {
        const {isHide,left,worry,count,total,correctNum,doneNum,answer_list,isAnswer,topic_index} = this.state;

        
        let outside_box = [];

        for(let i = 0 ; i < this.topicPaper.length ; i+=15){
            outside_box.push(this.topicPaper.slice(i,i+15));
        }


        return (
            <View style={[styles.container]}>
                {
                    !isHide ?
                    <View style={[styles.intro]}>
                        <View style={[styles.box_wrap]}>
                            <Text style={[styles.lg20_label,styles.black_label,styles.fw_label]}>目前练习情况</Text>
                            <View style={[styles.item_wrap]}>
                                <Text style={[styles.default_label,styles.gray_label]}>未做题目</Text>
                                <Text style={[styles.default_label,styles.black_label,styles.fw_label]}>{left}</Text>
                            </View>
                            <View style={[styles.item_wrap]}>
                                <Text style={[styles.default_label,styles.gray_label]}>错题</Text>
                                <Text style={[styles.default_label,styles.black_label,styles.fw_label]}>{worry}</Text>
                            </View>
                            <View style={[styles.item_wrap]}>
                                <Text style={[styles.default_label,styles.gray_label]}>累计做题</Text>
                                <Text style={[styles.default_label,styles.black_label,styles.fw_label]}>{count}</Text>
                            </View>
                            <View style={[styles.item_wrap]}>
                                <Text style={[styles.default_label,styles.gray_label]}>已完成</Text>
                                <Text style={[styles.default_label,styles.black_label,styles.fw_label]}>{total}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.btn]}
                            onPress={ this._toTopic }
                        >
                            <Text style={[styles.sred_label,styles.lg_label]}>开始答题</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.fd_c,styles.col_1]}>
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
                                <Text>00:00</Text>
                            </View>
                        </View>
                        <ScrollView>
                            {
                                this.topicPaper.length > 0 ?
                                <View style={[styles.topic_wrap ,styles.pl_20 ,styles.pr_20 ,styles.pb_20]}>
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
                            
                            <View style={[styles.result_wrap]}>
                                <View style={[styles.radius]}></View>
                                <Text space='nbsp' style={[styles.sm_label,styles.c33_label]}>正确 {correctNum}</Text>
                                <View style={[styles.radius ,styles.bg_orange]}></View>
                                <Text space='nbsp' style={[styles.sm_label,styles.c33_label]}>错误  {doneNum - correctNum}</Text>
                            </View>
                        
                        </View>



                        <HudView ref={'hud'} />
                    </View>
                }

                <Modal  visible={isAnswer} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={()=>this.setState({isAnswer:false})}></TouchableOpacity>
                    <View style={styles.wechatType}>
                        <View style={[styles.wechatIcons,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <View style={[styles.pannel,styles.bg_white]}>
                                <View style={[styles.pannel_head,styles.fd_r,styles.ai_ct,styles.jc_sb]}>
                                <Text style={[styles.lg18_label,styles.c33_label]}>答题卡</Text>
                                <Text style={[styles.default_label,styles.c33_label]}>未做  {(this.topicPaper.length -  doneNum) < 0 ? 0 : (this.topicPaper.length -  doneNum)}</Text>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <View style={[styles.disc]}></View>
                                    <Text style={[styles.default_label,styles.c33_label]} space='nbsp'>正确  {correctNum}</Text>
                                </View>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <View style={[styles.disc ,styles.bg_orange]}></View>
                                    <Text style={[styles.default_label,styles.c33_label]} space='nbsp'>错误  {doneNum - correctNum }</Text>
                                </View>
                                <Text style={[styles.gray_label]}>{topic_index + 1}/{this.topicPaper.length}</Text>
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
    head:{
        backgroundColor:'#ffffff',
        zIndex:9999,
        paddingTop:12,
        paddingBottom:12
    },
    intro:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    box_wrap:{
        width:309,
        height:321,
        marginTop:52,
        paddingTop:35,
        paddingRight:27,
        paddingBottom:35,
        paddingLeft:27,
        backgroundColor:'rgba(248,248,248,1)',
        borderRadius:3,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(203,203,203,0.5)',
        shadowOpacity: 1.0,
        elevation: 2,
    },
    item_wrap:{
        marginTop:28,
        paddingRight:130,
        flexDirection:'row',
        justifyContent:'space-between',
        flexWrap:'nowrap'
    },
    btn:{
        width:129,
        height:44,
        borderRadius:5,
        marginTop:100,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(244,98,63,1)'
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
    result_wrap:{
        marginRight:16,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    radius:{
        width:8,
        height:8,
        borderRadius:4,
        backgroundColor:'#99D321',
        marginRight:5,
    },
    bg_orange:{
        backgroundColor:'#F4623F',
        marginLeft:12,
        marginRight:5
    },
    topic_content_wrap:{
        paddingBottom:60,
        marginRight:15
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
        width:theme.window.width,
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
    },
    answer_wrap:{
        marginTop:50,
        marginRight:10,
    },
    item_ontxt:{
        color:'#99D321'
    },
    error_txt:{
        color:'#F4623F',
    },
    correct:{
        backgroundColor: '#99D321',
        color:'#ffffff'
    },
    error:{
        backgroundColor:'#F4623F',
        color:'#ffffff'
    }
})

export const LayoutComponent = DoingTopic;

export function mapStateToProps(state) {
	return {
        o2oTopic:state.train.o2oTopic,
        studyInfo:state.train.studyInfo
	};
}


