import React, { Component } from 'react'
import { Text, View,TouchableOpacity,StyleSheet ,Dimensions,Image,Platform,StatusBar,ScrollView,ImageBackground} from 'react-native'

import {LineChart} from 'react-native-chart-kit';

import _ from 'lodash';
import asset from '../../config/asset';
import theme from '../../config/theme';

class StudyData extends Component {

    static navigationOptions = {
        title:'学习数据',
        headerTintColor: '#ffffff',
        headerStyle:Platform.OS === 'android' ? {
            paddingTop:  StatusBar.currentHeight ,
            height: StatusBar.currentHeight  + 44,
            backgroundColor: '#F46341',
            borderBottomWidth: 0,
            elevation:0,
        } : {
            backgroundColor: '#F46341',
            borderBottomWidth: 0,
            elevation:0,
        },
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        this.state ={
            today:0,
            total:0,
            learn:0,
            rank:0,
            totalCourse:0,
            categories: [],
            cateData: [],  
        }
    }

    componentWillReceiveProps(nextProps){
        const {study} = nextProps;

        if (!_.isEmpty(study)){
            this.learnList = study.learnList;
            let categories = [];
            let cateData = [];
            study.learnList.map((learn,index)=>{
                categories.push(learn.day.substring(5));
                cateData.push(learn.duration / 3600);
            });

            this.setState({
                categories: categories,
                cateData: cateData,
                today:study.today,
                total:study.total,
                learn:study.learn,
                rank:study.rank,
                totalCourse:study.totalCourse
            });
        }
        
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.study.study();
    }



    render() {

        const {navigation} = this.props;
        const { today, total, learn, rank, cateData, categories,totalCourse} = this.state;

        console.log(categories,categories.length)
        console.log(cateData)
        
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}      
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.studywrap}>

                <ImageBackground source={asset.bg.learn_icon} style={styles.learn_icon}>
                    <View style={[styles.studyRank]}>
                        <View style={[styles.hourRnk ,styles.bg_white ,styles.d_flex ,styles.fd_c]}>
                            <View style={[styles.d_flex ,styles.fd_r ,styles.hour_items ]}>
                                <View style={[styles.d_flex ,styles.fd_c ,styles.jc_ct  ,styles.hourRnk_item]}>
                                    <Text style={[styles.sm_label ,styles.gray_label]}>今日学习</Text>
                                    <Text style={[styles.c33_label ,styles.lg24_label ,styles.mt_5 ,styles.fw_label]}>{(today/3600).toFixed(1)}<Text style={[styles.smm_label ,styles.pl_5]}>小时</Text></Text>
                                </View>
                                <View style={[styles.d_flex ,styles.fd_c ,styles.ai_ct ,styles.jc_ct  ,styles.hourRnk_item]}>
                                    <Text style={[styles.sm_label ,styles.gray_label ]}>累计学习</Text>
                                    <Text style={[styles.c33_label ,styles.lg24_label ,styles.mt_5 ,styles.fw_label]}>{(total/3600).toFixed(1)}<Text style={[styles.smm_label ,styles.pl_5]}>小时</Text></Text>
                                </View>
                                <View style={[styles.d_flex ,styles.fd_c ,styles.ai_ct ,styles.jc_ct  ,styles.hourRnk_item]}>
                                    <Text style={[styles.sm_label ,styles.gray_label ]}>连续学习</Text>
                                    <Text style={[styles.c33_label ,styles.lg24_label ,styles.mt_5 ,styles.fw_label]}>{learn}<Text style={[styles.smm_label ]}> 天</Text></Text>
                                </View>
                            </View>
                            <Text style={[styles.default_label ,styles.gray_label ,styles.mt_15 ,styles.ml_5]}>行动力超过了{rank}%的用户</Text>
                        </View>
                    </View>
                </ImageBackground>


                {
                    categories.length > 0 ?
                    <View style={[styles.studycons]}>
                        <LineChart
                            data={{
                                labels: categories,
                                datasets: [{
                                    data: cateData,
                                }],
                            }}
                            width={Dimensions.get('window').width - 20} // from react-native
                            height={220}
                            yAxisLabel={''}
                            axisY ={{min:true}}
                            chartConfig={{
                                backgroundColor: '#e26a00',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(244,98,63, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(51,51,51, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '2',
                                    strokeWidth: '1',
                                    stroke: '#FF5047',
                                },
                            }}
                            bezier
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                        <View style={[styles.m_15 ,styles.p_15 ,styles.log_cons]}>
                            <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label]}>累计</Text>
                            <View style={[styles.log ,styles.border_tp ,styles.mt_15 ,styles.pt_15]} >
                                <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                    <Image source={asset.study.study_hour} style={[styles.log_icon]} />
                                    <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_10]}>累计时长</Text>
                                </View>
                                <Text style={[styles.sm_label ,styles.gray_label]}>{(total/60).toFixed(1)}分</Text>
                            </View>
                            <View style={[styles.log ,styles.mt_15]}>
                                <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                    <Image source={asset.study.study_total} style={[styles.log_icon]} />
                                    <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_10]}>累计天数</Text>
                                </View>
                                <Text style={[styles.sm_label ,styles.gray_label]}>{learn}天</Text>
                            </View>
                            <View style={[styles.log ,styles.mt_15]}>
                                <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                    <Image source={asset.study.study_course} style={[styles.log_icon]} />
                                    <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_10]}>累计课程</Text>
                                </View>
                                <Text style={[styles.sm_label ,styles.gray_label]}>{totalCourse}课</Text>
                            </View>
                        </View>
                    </View>
                :null}
            </View>   
            </ScrollView>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    learn_icon:{
        width:'100%',
        height:130,
    },
    studywrap:{
        position:'relative',
        paddingBottom:20
    },
    studycons:{
        marginTop: 40,
    },
    studyRank:{
        margin:15,
        marginTop: 45,
        shadowOffset:{  width: 0,  height:10},
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor:'#ffffff',
        borderRadius:5,
        paddingTop:15,
        paddingLeft:30,
        paddingBottom:20,
        paddingLeft:30,
    },
    hour_items:{
        width:'100%'
    },
    hourRnk_item:{
        flex:1,
        borderRightWidth:1,
        borderRightColor:'#f5f5f5',
        borderStyle:'solid',
        paddingLeft:8,
        paddingRight:8,
    },

    log_cons:{
        margin:15,
        backgroundColor:'#ffffff',
        borderRadius:5,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:15,
        paddingBottom:15,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    log:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    log_icon:{
        width:12,
        height:12,
    }  
})


export const LayoutComponent = StudyData;


export function mapStateToProps(state) {
	return {
        study:state.study.study,
	};
}
