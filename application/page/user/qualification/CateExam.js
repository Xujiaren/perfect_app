import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'

import Carousel from 'react-native-looped-carousel';
import HudView from '../../../component/HudView';

import theme from '../../../config/theme';

class CateExam extends Component {


    static navigationOptions = {
        title:'试卷',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.squadId = navigation.getParam('squadId', 0);

        this.state = {
            paperList:[],
            status:0,
            paperIsExam:false,
            errNumber:0,
            begin:'',
            end:'',
            passNumber:0,
            paper:{},
            perp:0,
            exerciseStatus:false,
            passStatus:0,
            squadId:this.squadId,
            isRefreshing:false,
        }

        this._paper = this._paper.bind(this);
        this._onExam = this._onExam.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {navigation} = this.props;
        const {squadId} = this.state;
        const {studyStatus,o2oExamPaper} = nextProps;

        if(studyStatus !== this.props.studyStatus){

            this.setState({
                exerciseStatus:studyStatus.exerciseStatus,
                passStatus:studyStatus.passStatus,
            })

            if(!studyStatus.exerciseStatus){
                this.refs.hud.show('请先完成考题练习才能进行考试', 2);
            } else {
                if(studyStatus.passStatus === 0){
                    this.refs.hud.show('对不起，考核不通过', 2);
                } else if(studyStatus.passStatus === 1){

                    Alert.alert('在线考试','您只有最后一次机会， \n 请回到考题练习认真学习，\n 是否继续考试',[
                        { text: '否', onPress: () => {
                            navigation.navigate('TopicSort',{squadId:squadId})
                        }
                    },{
                        text: '是', onPress: () => {

                            this.setState({
                                passStatus:3
                            })
            
                        }
                    }])

                } else if(studyStatus.passStatus === 2){
                    this.refs.hud.show('考试通过', 2);
                } 
            }

        }

        if(o2oExamPaper !== this.props.o2oExamPaper){

            let paperlist = o2oExamPaper.data
            let errNumber = 0;

            for(let i = 0 ; i < paperlist.length ; i++){
                if(paperlist[i].isExam){
                    if(paperlist[i].userScore <  paperlist[i].score * (paperlist[i].percentage/100)){
                        errNumber++
                    }
                }
            }


            this.setState({
                paperList:paperlist,
                errNumber:errNumber,
                begin:o2oExamPaper.begin,
                end:o2oExamPaper.end,
                passNumber:o2oExamPaper.passNumber,
                perp:o2oExamPaper.perp
            },()=>{
                if(paperlist.length > 0){
                    this.setState({
                        paper:paperlist[0],
                        paperIsExam:paperlist[0].isExam,
                    })
                }
            })

        }
    }

    componentDidMount(){
        
        this._onRefresh();
    }

    _onRefresh=()=>{
        const {actions} = this.props;
        const {squadId} = this.state;

        actions.train.studyStatus(squadId);
        actions.train.o2oExamPaper(squadId);

        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        },2000)
    }

    _paper(index){

        const {paperList} = this.state;

        this.setState({
            status:index,
            paper:paperList[index],
            paperIsExam:paperList[index].isExam,
        })

    }

    _onExam(){
        const {navigation} = this.props;
        const {paper,errNumber,perp,exerciseStatus,passStatus,squadId}  = this.state;

        if(exerciseStatus){

            if(passStatus === 0){

                this.refs.hud.show('对不起，考核不通过', 2);

            } else if(passStatus === 1){

                Alert.alert('在线考试','您只有最后一次机会， \n 请回到考题练习认真学习，\n 是否继续考试',[
                    { text: '否', onPress: () => {
                        navigation.navigate('TopicSort',{squadId:squadId})
                    }
                },{
                    text: '是', onPress: () => {

                        this.setState({
                            passStatus:3
                        })
        
                    }
                }])

            } else if(passStatus === 2){

                this.refs.hud.show('考试通过', 2);

            } else if(passStatus === 3){
                if(paper.num > 0){

                    if(errNumber > 3 ){

                        Alert.alert('考试提示','考试机会已不多，\n 请重新练习再来考试',[
                            { text: '否', onPress: () => {
                                navigation.navigate('DoingExam',{paper_id:paper.paperId,e_duration:paper.duration,e_percentage:perp,paperName:paper.paperName,squadId:squadId ,refresh:this._onRefresh})
                            }
                        },{
                            text: '是', onPress: () => {        
                            }
                        }])

                    } else {
                        navigation.navigate('DoingExam',{paper_id:paper.paperId,e_duration:paper.duration,e_percentage:perp,paperName:paper.paperName,squadId:squadId,refresh:this._onRefresh})
                    }

                } else {
                    this.refs.hud.show('暂无试题', 2); 
                }
            } 

        }  else {
            this.refs.hud.show('请先完成考题练习才能进行考试', 2);
        }

    }



    render() {
        const {navigation} = this.props;
        const { paperList ,status,paper,paperIsExam,begin,end,perp,passNumber} = this.state;

        let outside_box = [];
        for(let i = 0 ; i < paperList.length ; i+=5){
            outside_box.push(paperList.slice(i,i+5));
        }


        return (
            <View style={styles.container}>

                {
                    outside_box.length > 0 ?
                    <View style={styles.swiper_wrap}>
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
                                                    const on = status === index * 5 + idx;

                                                    return(
                                                        <View key={'_ele' + idx} style={[styles.w_20]}>

                                                            {
                                                                _ele.isExam ?  
                                                                <TouchableOpacity style={[styles.fd_c,styles.ai_ct]} onPress={this._paper.bind(this,index*5 + idx)}>
                                                                    <View style={[styles.swiper_item_wrap,styles.bg_green,(_ele.userScore < perp )&&styles.bg_orange]}>
                                                                        <Text style={[styles.default_label,styles.white_label]}>{index*5 + idx+1}</Text>
                                                                    </View>
                                                                    <Text style={[styles.sm_label,styles.mt_5,_ele.userScore <  perp ? {color:'#F4623F'} : {color:'#99D321'}]}>{  _ele.userScore <  perp   ? '不及格' : '及格' }</Text>
                                                                </TouchableOpacity>
                                                                :
                                                                <TouchableOpacity style={[styles.fd_c,styles.ai_ct]} onPress={this._paper.bind(this,index*5 + idx)}>
                                                                    <View style={[styles.swiper_item_wrap,styles.bg_white,on&&styles.onItem_wrap]}>
                                                                        <Text style={[styles.default_label,styles.gray_label]}>{index*5 + idx+1}</Text>
                                                                    </View>
                                                                    <Text style={[styles.sm_label,styles.mt_5,styles.tip_label]}>待做 </Text>
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
                :null}

                <View style={[styles.pl_25 ,styles.pr_25,styles.mt_30]}>
                    <Text style={[styles.default_label ,styles.tip_label ]}>请在{begin}-{end}完成{passNumber}次合格考核，及格分数为{perp}以上。</Text>
                </View>
                
                <View style={[styles.fd_c,styles.jc_ct,styles.ai_ct]}>
                    <View style={[styles.box_wrap]}>
                        <Text style={[styles.fw_label,styles.lg20_label,styles.black_label]}>考试类型：{paper.paperName}</Text>
                        <View style={[styles.item_wrap]}>
                            <Text style={[styles.label,styles.default_label,styles.gray_label]}>考试时间</Text>
                            <Text style={[styles.value]}>{(paper.duration / 60).toFixed(1)}分钟</Text>
                        </View>
                        <View style={[styles.item_wrap]}>
                            <Text style={[styles.label,styles.default_label,styles.gray_label]}>考试标准</Text>
                            <Text style={[styles.value]}>{paper.num}题</Text>
                        </View>
                        <View style={[styles.item_wrap]}>
                            <Text style={[styles.label,styles.default_label,styles.gray_label]}>合格标准</Text>
                            <Text style={[styles.value]}>{paper.score * (perp/100)}分（满分100分）</Text>
                        </View>
                    </View>
                    {
                        paperIsExam ?
                        <TouchableOpacity style={[styles.btn]} 
                            onPress={()=>navigation.navigate('PaperAnalysis',{paper_id:paper.paperId,paperName:paper.paperName})}
                        >
                            <Text style={[styles.sred_label,styles.lg_label]}>试卷解析</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.btn]} 
                            onPress={this._onExam}
                        >
                            <Text style={[styles.sred_label,styles.lg_label]}>开始考试</Text>
                        </TouchableOpacity>
                    }
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
        backgroundColor:'#fafafa'
    },
    gift:{
        width:theme.window.width,
        height:75,
    },
    gift_dot:{
        width:0,
        height:0,
    },
    gift_dot_on:{
        width:0,
        height:0,
    },
    swiper_single_box:{
        width:'100%',
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
        width:'20%',
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
    onItem_wrap:{
        backgroundColor:'#ffffff',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#99D321'
    },
    bg_green:{
        backgroundColor:'#99D321'
    },
    bg_orange:{
        backgroundColor:'#F4623F'
    },
    bg_white:{
        backgroundColor:'#EBEBEB'
    },
    onItem:{
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F'
    },
    box_wrap:{
        width:309,
        height:240,
        marginTop:30,
        paddingTop:30,
        paddingBottom:30,
        paddingLeft:25,
        paddingRight:25,
        backgroundColor:'rgba(248,248,248,1)',
        borderRadius:3,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    item_wrap:{
        marginTop:28,
        flexDirection:'row',
        justifyContent:'flex-start',
        flexWrap:'nowrap',
    },
    label:{
        width:75,
        marginRight:48,
    },
    btn:{
        width:130,
        height:44,
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(244,98,63,1)',
        marginTop:48,
    }
})

export const LayoutComponent = CateExam;

export function mapStateToProps(state) {
	return {
        studyStatus:state.train.studyStatus,
        o2oExamPaper:state.train.o2oExamPaper,
	};
}


