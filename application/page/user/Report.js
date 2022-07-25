import React, { Component } from 'react';
import { Text, View ,Image,TextInput,TouchableOpacity,StyleSheet,Keyboard} from 'react-native';


import iconMap from '../../config/font';

import asset from '../../config/asset';

import theme from '../../config/theme';
import HudView from '../../component/HudView';



class Report extends Component {

    static navigationOptions = {
        title:'请选择举报理由',
        headerRight: <View/>,
    }

    constructor(props){
        super(props);

        this.state = {
            report_text:'', // 其他 填写类型
            report_list:['盗版，侵权','欺诈、不实信息、谣言','暴力、色情、人身攻击','广告内容、诱导关注分享参加好友','其他'], // 
            report_idx:10, // 选中类型
            catefeedback:[], // 反馈 类型Id
            commentImgs:'', // 评论图片 
            commentTxt:'',  // 评论内容
            commentName:'', // 评论着姓名
            userMobile:'', //  手机号
            courseName:''
        }

        this._onReportIdx = this._onReportIdx.bind(this);
        this._onTipOff = this._onTipOff.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        const { user} = nextProps;

        if (user !== this.props.user) {

            this.setState({
                userMobile:user.mobile,
            })
        }
    }

    componentDidMount(){

        const {actions} = this.props;
        actions.user.user();
    }

    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state

        this.setState({
            commentName:params.commentName,
            commentTxt:params.commentTxt,
            courseName:params.courseName
        })

    }

    _onReportIdx(index){
        this.setState({
            report_idx:index
        })
    }

    _onTipOff(){
        const {actions,navigation } = this.props;
        const {report_list,report_idx,report_text,catefeedback,commentName,commentTxt,userMobile,courseName} = this.state;

        let feedBack = '';

        if(report_idx === 4){
            feedBack = '课程名称：' + courseName + '，姓名：' + commentName + '，评论内容：' + commentTxt + '，举报内容：' + report_text
        } else {
            feedBack = '课程名称：' + courseName + '，姓名：' +  commentName + '，评论内容：' + commentTxt + '，举报内容：' +report_list[report_idx]
        }


        actions.user.pushfeedback({
            category_id:3,
            content:feedBack,
            gallery:'',
            videos: '',
            mobile:userMobile.length > 0 ? userMobile : '13861260000',
            resolved: (data) => {
                this.refs.hud.show('举报成功', 1);
                setTimeout(()=>navigation.goBack(), 1000);
            },
            rejected: (res) => {
                this.refs.hud.show('举报失败', 2);
            },
        });



    }

    render() {
        const {report_list,report_idx,report_text} = this.state
        return (
            <View style={[styles.p_30]}>
                <View style={[styles.fd_c,styles.report_cn]}>
                    <View style={[styles.fd_c,styles.mt_20]}>
                        {
                            report_list.map((rept,index)=>{
                                const on = report_idx === index ;
                                return(
                                    <TouchableOpacity style={[styles.fd_r,styles.ai_ct,styles.pt_5,styles.pb_5]} key={'rept' + index}
                                        onPress={()=>this._onReportIdx(index)}
                                    >
                                        <Image source={on ? asset.radio_full : asset.radio} style={styles.radio_btn}/>
                                        <Text style={[styles.c33_label,styles.default_label,styles.ml_10]}>{rept}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        {
                            report_idx === 4 ? 
                            <View style={styles.multinput}>
                                <TextInput
                                    style={styles.textinput}
                                    placeholder={'请描述您遇到的问题，我们会尽快解决'}
                                    placeholderTextColor={'#999999'}
                                    underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                                    multiline={true}
                                    maxLength={50}
                                    value={report_text}
                                    onChangeText={(text) => {this.setState({report_text:text});}}
                                />
                                <View style={[styles.fd_r,styles.jc_fe,styles.p_5]}>
                                    <Text style={[styles.gray_label,styles.sm_label]}>{report_text.length}/50</Text>
                                </View>
                            </View>
                        :null}
                    </View>
                    <TouchableOpacity style={[styles.report_btn,styles.mt_20]} 
                        onPress={this._onTipOff}
                    >
                        <Text style={[styles.c33_label,styles.white_label]}>确定</Text>
                    </TouchableOpacity>
                </View>
                <HudView ref={'hud'}/>
            </View>
            
        )
    }
}




const styles =  StyleSheet.create({

    ...theme.base,
    container:{
        backgroundColor:'#FAFAFA',
        flex:1,
    },
    report_cons:{
        display:'flex',
        flexDirection:'column',
    },
    report_box:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0, 0, 0, 0.6)'
    },
    dete_icon:{
        width:16,
        height:16
    },
    dete_box:{
        width:26,
        height:26,
        marginTop:-25,
        marginRight:-25,
        borderRadius:15,
        borderWidth:2,
        borderStyle:'solid',
        borderColor:'#FFFFFF',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.8)',
    },
    report_con:{
        width:300,
        minHeight:300,
        borderRadius:10
    },
    report_cn:{

        paddingTop:10
    },
    report_btn:{
        width:'100%',
        height:34,
        backgroundColor:'#F4623F',
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    radio_btn:{
        width:20,
        height:20,
    },
    multinput:{
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#f1f1f1',
        marginTop:15
    },
    textinput:{
        width:270,
        height:54,
        padding:5,
        fontSize:12,
    }
});

export const LayoutComponent = Report;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
	};
}