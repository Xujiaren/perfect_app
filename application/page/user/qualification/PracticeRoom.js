import React, { Component } from 'react'
import { Text, View ,Image,StyleSheet, TouchableOpacity} from 'react-native'

import theme from '../../../config/theme';

class PracticeRoom extends Component {


    static navigationOptions = {
        title:'练习室',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.squadId = navigation.getParam('squadId', 0);

        this.state = {
            Imgs:["https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/34607234-a60b-4906-a48e-dfb136db378d.png",
                  "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/08d4f40b-9cab-4a64-a956-47e738318eba.png",
                  "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/d8f29a0e-bcbd-48dc-aab7-923fba9116e2.png",
                  "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/6bbbdada-9dec-4aa3-941b-c675c8009956.png"
            ],
            squadId:this.squadId,
        }   
    }


    render() {
        const {navigation} = this.props;
        const {squadId,Imgs} = this.state;

        return (
            <View style={[styles.wrap]}>
                <View style={[styles.study_item_wrap,styles.fd_c,styles.jc_fs,styles.ai_ct,styles.mt_30]}>
                    <TouchableOpacity style={[styles.studyItem]} onPress={()=>navigation.navigate('VideoLearn',{squadId:squadId})}>
                        <Image style={[styles.study_item]} mode='aspectFit' source={{uri:Imgs[0]}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.studyItem]} onPress={()=>navigation.navigate('TopicSort',{squadId:squadId})}>
                        <Image style={[styles.study_item]} mode='aspectFit' source={{uri:Imgs[1]}} />
                    </TouchableOpacity >
                    <TouchableOpacity style={[styles.studyItem]} onPress={()=>navigation.navigate('CateExam',{squadId:squadId})}>
                        <Image style={[styles.study_item]} mode='aspectFit' source={{uri:Imgs[2]}}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.studyItem]} onPress={()=>navigation.navigate('OfflineSign',{squadId:squadId})}>
                        <Image style={[styles.study_item]} mode='aspectFit' source={{uri:Imgs[3]}}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    studyItem:{
        position:'relative',
        height:107,
        marginBottom:10,
    },
    study_layer:{
        position:'absolute',
        top:0,
        width:'100%',
        height:107,
        borderRadius:5,
        backgroundColor:'rgba(0,0,0,0.1)'
    },
    study_item:{
        marginBottom:10,
        width:theme.window.width - 30,
        height:107,
    }
})

export const LayoutComponent = PracticeRoom;

export function mapStateToProps(state) {
	return {

	};
}


