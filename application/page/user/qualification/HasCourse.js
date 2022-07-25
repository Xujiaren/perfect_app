import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import HudView from '../../../component/HudView';
import theme from '../../../config/theme';

class HasCourse extends Component {


    static navigationOptions = {
        title:'已报班级',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.squadId = navigation.getParam('squadId', 0);
        this.page = navigation.getParam('page', 0);

        this.state = {
            squadId:this.squadId,
            page:this.page ,
            courses:{},
        }

        this._downFile = this._downFile.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {o2o} = nextProps;

        if(o2o !== this.props.o2o){

            let o2oList = o2o.items;

            o2oList.map((item,index)=>{

                if(item.squadId === this.squadId){
                    this.setState({
                        courses:o2oList[index]
                    })
                }
            })
        }

    }

    componentDidMount(){
        const {actions} = this.props;

        actions.train.o2o(3,this.page);
    }


    _downFile(){
        const {courses} = this.state;

        CameraRoll.saveToCameraRoll(courses.link).then(result=>{

            this.refs.hud.show('保存成功', 2);
        }).catch(error=>{
            this.refs.hud.show('保存失败', 2);
        });
    }


    render() {
        const {courses} = this.state;


        return (
            <View style={[styles.container]}>
                <ScrollView>
                    <View style={[styles.courses]}>
                        <View  style={[styles.course  ,styles.fd_r ,styles.ai_ct ,styles.mt_20]}>
                            <View style={[ ,styles.fd_c ,styles.col_1]}>
                                <Text style={[styles.lg_label ,styles.c33_label ,styles.mb_15 ,styles.fw_label]}>{courses.squadName}</Text>
                                <View style={[ styles.fd_r ,styles.mb_15]}>
                                    <Text  style={[styles.default_label ,styles.c33_label]}>班级人数：{courses.enrollNum}</Text>
                                    <Text  style={[styles.default_label ,styles.c33_label ,styles.pl_10]}>已报名：{courses.registeryNum}</Text>
                                </View>
                                <Text style={[styles.default_label ,styles.gray_label ,styles.mb_5]}>上课时间：{courses.endTimeFt}</Text>
                                <Text style={[styles.default_label ,styles.gray_label]}>上课地点：{courses.location}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity style={[styles.submit]} 
                    onPress={this._downFile}
                >
                    <Text style={[styles.white_label ,styles.default_label]}>下载培训通知</Text>
                </TouchableOpacity>

                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex: 1,
        backgroundColor:'#ffffff',
    },
    courses:{
        paddingBottom:60,
    },
    course:{    
        marginLeft:15,
        marginRight:15,
        borderRadius:5,
        backgroundColor:'#ffffff',
        padding:20,
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2
    },
    iconCover:{
        width:15,
        height:15,
    },
    icon:{
        width:15,
        height:15,
    },
    btm:{
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor:'#ffffff'

    },
    submit:{
        marginLeft:15,
        marginRight:15,
        borderRadius:5,
        height:36,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F4623F'
    }
})

export const LayoutComponent = HasCourse;

export function mapStateToProps(state) {
	return {
        o2o:state.train.o2o,
	};
}


