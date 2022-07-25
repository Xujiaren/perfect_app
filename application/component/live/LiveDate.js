import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';


import theme from '../../config/theme';

class LiveDate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
            restTime:props.restTime || 0,
        }

    }

    componentWillReceiveProps(nextProps){

        const {restTime} = nextProps;

        this.setState({
            restTime:restTime
        })
    }
    componentDidMount(){

    }

    componentWillUnmount() {

    }




    render() {
        const {restTime} = this.state;

        let d    = Math.floor(restTime/60/60/24);
        let hour = Math.floor(restTime/60/60%24) < 10 ? "0" + Math.floor(restTime/60/60%24) : Math.floor(restTime/60/60%24);
        let min  = Math.floor(restTime/60%60) < 10 ? "0" + Math.floor(restTime/60%60) : Math.floor(restTime/60%60);
        let sec  = Math.floor(restTime%60) < 10 ? "0" + Math.floor(restTime%60) : Math.floor(restTime%60);

        return (
            <View>
                { 
                    restTime === 0 ?
                    null
                    :
                    <View style={[styles.wrap , styles.fd_r,styles.ai_ct]}>
                        <Text style={[styles.white_label ,styles.default_label ,styles.ml_5 ,styles.mr_5]}>{d}天</Text>
                        <View style={[styles.wrap_item]}>
                            <Text  style={[styles.white_label ,styles.sm_label]}>{hour}</Text>
                        </View>
                        <Text style={[styles.white_label ,styles.sm_label ,styles.fw_label ,styles.mr_2 ,styles.ml_2]}>:</Text>
                        <View style={[styles.wrap_item]}>
                            <Text style={[styles.white_label ,styles.sm_label]}>{min}</Text>
                        </View>
                        <Text style={[styles.white_label ,styles.sm_label ,styles.fw_label ,styles.ml_2 ,styles.mr_2]}>:</Text>
                        <View style={[styles.wrap_item]}>
                            <Text style={[styles.white_label ,styles.sm_label]}> {sec}</Text>
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    wrap_item:{
        width:21,
        height:21,
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.4)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:2
    }
});

export default LiveDate;