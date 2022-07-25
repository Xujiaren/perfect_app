import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,ActivityIndicator,FlatList,Image,Modal,TextInput} from 'react-native'

import DashLine from '../../component/DashLine'
import HudView from '../../component/HudView';
import Scratch  from '../../component/Scratch';
import {asset, theme} from '../../config';

class QuestSurvey extends Component {


    static navigationOptions = {
        title:'问卷调查',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        const {navigation} = props;
        this.activityId = navigation.getParam('activityId', 0);
        this.courseId = navigation.getParam('courseId', 0);
        this.stype = navigation.getParam('stype', 0);
        this.activityPaper = [];

        this.state = {
            loaded:false,
            content:'',
            answer_list:{},
            answer_lists:{},
            showScratch:false
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onScratch = this._onScratch.bind(this);
        this._onAnswer = this._onAnswer.bind(this);
        this._content = this._content.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {activityPaper,paperList} = nextProps;

        if(activityPaper !== this.props.activityPaper){
            this.activityPaper = activityPaper;
            this.setState({
                loaded: true,
            })
        }
        if(paperList !== this.props.paperList){
            this.activityPaper = paperList;
            this.setState({
                loaded: true,
            })
        }
    }

    componentDidMount(){
        const {navigation} = this.props
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    _onRefresh(){
        const {actions} = this.props;
        if(this.activityId>0){
            actions.activity.activityPaper(this.activityId)
        }else{
            actions.course.courseSurvey(this.courseId,this.stype)
        }
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _onAnswer(type,item,label,i){
        const {answer_list,answer_lists} = this.state;

        if(type === 0 ){

            let answer_arr_num = (label.optionId + '' ).split(",").map(Number);
            answer_list[parseInt(label.topicId)] = (label.optionId + '' ).split(",");
            answer_lists[parseInt(label.topicId)] = answer_arr_num;

        } else if(type === 1){

            if(answer_list[label.topicId] === undefined || answer_list[label.topicId] === "" || answer_list[label.topicId] === null){
                let answer_ids  = [];
                if(answer_ids.indexOf(label.optionId + '') > -1){

                    answer_ids.splice(answer_ids.indexOf(label.optionId+''),1);

                } else {

                    answer_ids.push(label.optionId + '');
                
                }

                let answer_str =  answer_ids.join(",");
                
                answer_list[label.topicId] = answer_str;
                answer_lists[label.topicId] = answer_ids.map(Number);

            } else {

                let  answer_ids  = answer_list[label.topicId].split(",")
                if(answer_ids.indexOf(label.optionId + '') > -1){

                    answer_ids.splice(answer_ids.indexOf(label.optionId+ ''),1)

                } else {
                    answer_ids.push(label.optionId + '')
                }

                let answer_str =  answer_ids.join(",");
                let answer_ar = answer_ids.map(Number);

                answer_list[label.topicId] = answer_str;
                answer_lists[label.topicId] = answer_ar;

            }
            
        }   
        this.setState({
            answer_list:answer_list,
            answer_lists:answer_lists
        })
    }
    _onLoadCallBack=()=>{
        this.setState({
            showScratch:false
        },()=>{
            setTimeout(() => {
                this.props.navigation.goBack()
            }, 1000);
        })
    }
    _renderItem(item){
        const qust = item.item;
        const index = item.index;
        const {answer_list} = this.state;


        if(qust.ttype === 0 ){

            return(
                <View style={[styles.fromItem]}>
                    <View style={[styles.fromHead]}>
                        <Text style={[styles.black_label,styles.default_label]}>{index+ 1}.{qust.title}</Text>
                    </View>
                    <View style={[styles.qustList]}>
                        {
                            qust.optionList&&qust.optionList.map((label,i)=>{

                                let on = answer_list[label.topicId] == label.optionId;

                                return (
                                    <View key={'label' + i}>
                                        <TouchableOpacity style={[styles.item,styles.fd_r]} onPress={()=>this._onAnswer(0,qust,label,i)}>
                                            <Image source={on ? asset.select_full : asset.select} style={[styles.radio_cover]} />
                                            <Text style={[styles.default_label,styles.c33_label,styles.ml_10,styles.col_1]}>{label.optionLabel}</Text>
                                        </TouchableOpacity>   
                                        <DashLine backgroundColor={'#F0F0F0'} len={100} width={theme.window.width}></DashLine>
                                    </View>
                                    
                                )
                            })
                        }
                    </View>
                </View>
            )
        } else if(qust.ttype === 3){
            return(
                <View style={[styles.fromItem]}>
                    <View style={[styles.fromHead,styles.fd_r,styles.jc_sb]}>
                        <Text style={[styles.black_label,styles.default_label]}>{index+ 1}.{qust.title}</Text>
                        <Text className='tip_label sm_label'>（多选）</Text>
                    </View>
                    <View style={[styles.qustList]}>
                        {
                            qust.optionList&&qust.optionList.map((label,i)=>{

                                let on = false;
                                if(answer_list[label.topicId] !== undefined){
                                    on = (answer_list[label.topicId]).indexOf(label.optionId)  > -1 ;
                                }
                                return (
                                    <View key={'label' + i}>
                                        <TouchableOpacity style={[styles.item,styles.fd_r]} onPress={()=>this._onAnswer(1,qust,label,i)}>
                                            <Image source={on ? asset.check_full : asset.check} style={[styles.radio_cover]} />
                                            <Text style={[styles.default_label,styles.c33_label,styles.ml_10,styles.col_1]}>{label.optionLabel}</Text>
                                        </TouchableOpacity> 
                                        <DashLine backgroundColor={'#F0F0F0'} len={100} width={theme.window.width}></DashLine>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            )
                
        } else if(qust.ttype === 4){
            return(
                <View style={[styles.fromItem]}>
                    <View style={[styles.fromHead]}>
                        <Text style={[styles.black_label,styles.default_label]}>{index+ 1}.{qust.title}</Text>
                    </View>
                    <View style={[styles.qustList]}>
                        <TextInput
                            style={styles.writecons}
                            placeholder={'说说你的看法'}
                            placeholderTextColor={'#999999'}
                            underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                            multiline={true}
                            value={answer_list[qust.topicId]}
                            onChangeText={(e)=>this._content(qust,e)}
                        />
                    </View>
                </View>
            )   
        }
        
    }

    _onScratch(){
        const {actions} = this.props;
        const { answer_lists,activityId } = this.state;

        if(Object.keys(answer_lists).length < this.activityPaper.length){

            this.refs.hud.show('请完成问卷在提交', 1);
            
        } else {
            if(this.activityId){
                actions.activity.activityAnswer({
                    activity_id:this.activityId,
                    answer:JSON.stringify(answer_lists),
                    resolved: (data) => {
                        this.refs.hud.show('感谢你的参与!', 2);
                        this.setState({
                            showScratch:true
                        })
                    },
                    rejected: (msg) => {
        
                    }
                })
            }else{
                actions.course.postSurvey({
                    course_id:this.courseId,
                    answer:JSON.stringify(answer_lists),
                    resolved: (data) => {
                        this.refs.hud.show('感谢你的参与!', 2);
                        this.setState({
                            showScratch:true
                        })
                    },
                    rejected: (msg) => {
        
                    }
                })
            }
           
        }
    }

    _content = (item,e) =>{
        
        const {answer_list,answer_lists} = this.state

        answer_list[parseInt(item.topicId)] = e;
        answer_lists[parseInt(item.topicId)] = e.split(",][;");

        this.setState({
            answer_list:answer_list,
            answer_lists:answer_lists
        })
    }

    render() {

        const {loaded} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#FFA38D" />
            </View>
        )


        return (
            <View style={[styles.container, styles.bg_white]}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.activityPaper}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                <TouchableOpacity style={[styles.onSumbit]} 
                    onPress={this._onScratch}
                >
                    <Text style={[styles.white_label ,styles.default_label]}>提交</Text>
                </TouchableOpacity>
                {
                    this.state.showScratch?
                    <Scratch actions={this.props.actions} scratchId={this.activityId>0?this.activityId:this.courseId} success={()=>{
                        this._onLoadCallBack()
                    }}/>
                    :null
                }
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    onSumbit:{
        alignItems:'center',
        justifyContent:'center',
        margin:30,
        height:36,
        borderRadius:5,
        backgroundColor:'#F4623F'
    },
    fromItem:{
        marginBottom:15,
    },
    fromHead:{
        paddingTop:20,
        paddingLeft:20,
        paddingBottom:20,
        paddingLeft:30,
        backgroundColor:'#F6F6F6',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(229,229,229,1)'
    },
    qustList:{
        flexDirection:'column',
        backgroundColor:'#ffffff'
    },
    item:{
        alignItems:'center',
        paddingTop:15,
        paddingRight:10,
        paddingBottom:15,
        paddingLeft:30,
        borderBottomColor:'#F0F0F0',
        borderStyle:'dotted',
        borderBottomWidth:1
    },
    itemRadio:{
        transform:[{scale:0.8}]
    },
    writecons:{
        width:theme.window.width - 50,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:10,
        paddingTop:10,
        backgroundColor:'#F6F6F6',
        height:120,
        marginTop:25,
        marginLeft:30,
    },
    radio_cover:{
        width:12,
        height:12,
    },
    check_cover:{
        width:14,
        height:14,
    }
})

export const LayoutComponent = QuestSurvey;

export function mapStateToProps(state) {
	return {
        activityPaper:state.activity.activityPaper,
        paperList:state.course.paperList,
	};
}
