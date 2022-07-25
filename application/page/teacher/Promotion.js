import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';


class Promotion extends Component {

    static navigationOptions = {
        title:'讲师晋级',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.teacherDTO = {};
        this.teacherUpInfo = [];

        this.state = {

        };
    }

    componentWillReceiveProps(nextProps){

        const {user,teacherUpInfo} = nextProps;

        if(user != this.props.user){
            this.teacherDTO = user.teacherDTO;
        }

        if(teacherUpInfo != this.props.teacherUpInfo){
            this.teacherUpInfo = teacherUpInfo;

        }

    }


    componentDidMount(){
        const {actions}  = this.props
        actions.user.user();
        actions.user.teacherUpInfo();
    }


    render() {

        const promImg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/46844174-4dab-4b6e-a026-3d27e8f5b7df.png'

        let levelName = '讲师'
        if(this.teacherDTO.level === 1){
            levelName = '初级讲师'
        } else if(this.teacherDTO.level === 2){
            levelName = '中级讲师'
        } else if(this.teacherDTO.level === 3){
            levelName = '高级讲师'
        } 



        return (
            <View style={styles.container}>
                <Image source={{uri:promImg}} style={[styles.wrapImg]} />
                <View style={[styles.wrapBox]}>
                    <View style={[styles.wrapHead]}>
                        <Text style={[styles.lg_label,styles.white_label,styles.pl_25]}>当前级别：<Text style={[styles.fw_label,styles.white_label]}>{levelName}</Text></Text>
                        {/* <View style={[styles.mt_10]}>
                            <Text style={[styles.lg_label,styles.white_label,styles.pl_25]}>聘期:{this.teacherDTO.beginTime!=0?new Date(this.teacherDTO.beginTime*1000).format("yyyy-MM-dd"):''} 至 {this.eacherDTO.endTime!=0?new Date(this.teacherDTO.endTime*1000).format("yyyy-MM-dd"):'不限期'}</Text>
                        </View> */}
                    </View>
                    <View style={[styles.list]}>
                        <View style={[styles.listHead,styles.fd_r,styles.ai_ct]}>
                            <View style={[styles.col_1]}></View>
                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct]}>
                                <Text style={[styles.gray_label ,styles.sm_label]}>授课数</Text>
                            </View>
                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct]}>
                                <Text style={[styles.gray_label ,styles.sm_label]}>授课学分</Text>
                            </View>
                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct]}>
                                <Text style={[styles.gray_label ,styles.sm_label]}>学员满意度</Text>
                            </View>
                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct]}>
                                <Text style={[styles.gray_label ,styles.sm_label]}>新课数</Text>
                            </View>
                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct]}></View>
                        </View>
                        <View style={[styles.listWrap]}>
                            {
                                this.teacherUpInfo.map((teach,index)=>{
                                    if(this.teacherDTO.level+1>=index)
                                    return(
                                        <View style={[styles.listWrap_list ,styles.fd_r ,styles.ai_ct]} key={'teach' + index}>
                                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct,styles.pt_5,styles.pb_5]}>
                                                <Text style={[styles.gray_label ,styles.sm_label ,styles.fw_label]}>{teach.levelName}</Text>
                                            </View>
                                            {/* <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct,styles.pt_5,styles.pb_5]}>
                                                <Text style={[styles.tip_label ,styles.sm_label]}>≥{teach.courseNum}</Text>
                                                <Image source={this.teacherDTO.courseNum >= teach.courseNum ? asset.lect_da : ''} style={[styles.lect_da]} />
                                            </View> */}
                                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct,styles.pt_5,styles.pb_5]}>
                                                <Text style={[styles.tip_label ,styles.sm_label]}>≥{teach.score/10}</Text>
                                                <Image source={this.teacherDTO.score >= teach.score ? asset.lect_da : ''} style={[styles.lect_da]} />
                                            </View>
                                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct,styles.pt_5,styles.pb_5]}>
                                                <Text style={[styles.tip_label ,styles.sm_label]}>≥{5*(teach.satisf/100)}</Text>
                                                <Image source={this.teacherDTO.satisf >= teach.satisf ? asset.lect_da : ''} style={[styles.lect_da]} />
                                            </View>
                                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct,styles.pt_5,styles.pb_5]}>
                                                <Text style={[styles.tip_label ,styles.sm_label]}>≥{teach.newCourse}</Text>
                                                <Image source={this.teacherDTO.newCourse >= teach.newCourse ? asset.lect_da : ''} style={[styles.lect_da]} />
                                            </View>
                                            <View style={[styles.col_1 ,styles.fd_r,styles.jc_ct,styles.pt_5,styles.pb_5]}>
                                                {
                                                    this.teacherDTO.courseNum >= teach.courseNum && this.teacherDTO.score >= teach.score && this.teacherDTO.satisf >= teach.satisf && this.teacherDTO.newCourse >= teach.newCourse ?
                                                    <View style={[styles.listWrap_btn]}>
                                                        <Text style={[styles.smm_label ,styles.white_label]}>达成</Text>
                                                    </View>
                                                :null}
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={[styles.mt_20 ,styles.pl_20]}>
                        <Text style={[styles.c33_label ,styles.sm_label]}>考核周期：1年。升级情况以考核通知结果为准</Text>
                    </View>
                </View>

            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        position:'relative'
    },
    wrapBox:{
        position:'absolute',
        top:0,
    },
    wrapHead:{
        width:theme.window.width,
        height:114,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    wrapImg:{
        width:theme.window.width,
        height:114,
    },
    listHead:{
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#f2f2f2'
    },
    listWrap:{
        paddingTop:10,
        paddingBottom:10,
    },
    listWrap_btn:{
        width:28,
        height:14,
        backgroundColor:'rgba(126, 211, 33, 1)',
        borderRadius:3,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    lect_da:{
        width:10,
        height:10,
        marginLeft:5
    },
});

export const LayoutComponent = Promotion;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        teacherUpInfo:state.user.teacherUpInfo,
	};
}
