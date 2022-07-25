import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';


import theme from '../../config/theme';

class LiveMsg extends Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
            push_list:[]
        }

        this.push = this.push.bind(this);
    }

    // push(msg) {
    //     let {push_list}=this.state
    //     let lst = {
    //         msg:msg
    //     }
    //     this.setState({
    //         push_list:push_list.concat(lst)
    //     }, () => {
    //         this.refs.live_msg.bounceInLeft(800).then(state => {
    //             this.refs.live_msg.fadeOutUp(150).then(state => {
    //                 if(this.state.push_list.length>0){
    //                     let vas = this.state.push_list.filter((item,index)=>index!==0)
    //                     this.setState({
    //                         push_list:vas
    //                     })
    //                 }
    //             })
    //         })
    //     })
    // }

    push(msg) {
        this.setState({
            msg: msg
        }, () => {
            this.refs.live_msg.bounceInLeft(800).then(state => {
                this.refs.live_msg.fadeOutUp(150).then(state => {
                    this.setState({
                        msg: '',
                    });
                })
            })
        })
    }
    render() {
        const{push_list}=this.state
        return (
            // <Animatable.View useNativeDriver style={styles.container} animation={'bounceInLeft'} ref={'live_msg'}>
            //     {push_list.length>0&&push_list[0].msg?
            //     <View style={[styles.p_5, styles.circle_10, styles.bg_orange]}>
            //         <Text style={[styles.white_label, styles.sm_label]}>{push_list[0].msg}</Text>
            //     </View>
            //     : null}
            // </Animatable.View>
            <Animatable.View useNativeDriver style={styles.container} animation={'bounceInLeft'} ref={'live_msg'}>
            {this.state.msg != '' ?
            <View style={[styles.p_5, styles.circle_10, styles.bg_orange]}>
                <Text style={[styles.white_label, styles.sm_label]}>{this.state.msg}</Text>
            </View>
            : null}
        </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        position: 'absolute',
        left: 20,
        bottom: 300,
        zIndex:499
    },
});

export default LiveMsg;