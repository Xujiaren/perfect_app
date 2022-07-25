import React, { Component } from 'react'
import { Text, View, StyleSheet, PanResponder } from 'react-native'

import Slider from '@react-native-community/slider';

import theme from '../../config/theme';
import asset from '../../config/asset';
import * as tool from '../../util/common';

var width = theme.window.width;

class AudSlider extends Component {

    constructor(props){
        super(props);

        this.watcher = null;


        const {source = {
            current:0,
            duration:0,
            t_left:0,
        }} = props;

        console.log(source)


        this.state = {
            current:source.current,
            duration:source.duration,
            t_left:source.t_left,
        }

        this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
		this._onPanResponderMove = this._onPanResponderMove.bind(this);
		this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        const {source} = nextProps;

        if (source !== this.props.source) {

            this.setState({
                current:source.current,
                duration:source.duration,
                t_left:source.t_left,
            })
            
        }
    }


    componentWillMount(){

        this.watcher  = PanResponder.create({
            onStartShouldSetPanResponder:()=>{
                return true;
            },

            onPanResponderGrant:this._onPanResponderGrant,

			onPanResponderMove:this._onPanResponderMove,
			
			onPanResponderRelease:this._onPanResponderRelease
        });

    }

    _onPanResponderGrant(){
        console.log('Grant')
    }

    _onPanResponderMove(e,gestureState){

        const {onSlider} = this.props;
        const {duration,current} = this.state;


        let _current = current;
        let _duration = duration;
        let prowidth = width; // 总长度
        let movedx = gestureState.dx; // 滑动长度
        let progress;// 滑动长度／总长度

        // progress = (Math.abs(movedx)/prowidth).toFixed(2) * 1; 

        // this.setState({
        //     t_left:progress
        // })

        // onSlider && onSlider((progress * duration).toFixed(0));

        // console.log(movedx)

        if(movedx > 0 ){
            let cur_progress = (Math.abs(current)/duration).toFixed(2) * 1; 
            progress = (Math.abs(movedx)/prowidth).toFixed(2) * 1; 

            let dur_time = (progress * duration).toFixed(0) * 1 + current;


            this.setState({
                t_left:progress + cur_progress
            })

            console.log(dur_time,'dur_time',progress + cur_progress)

            onSlider && onSlider(dur_time);

        }  else {
            console.log(movedx);
        }

    }

    _onPanResponderRelease(){
        console.log('Release')
        const {onSlider} = this.props;
        // onSlider && onSlider((progress * duration).toFixed(0));
    }

    render() {

        const {onSlider} = this.props;
        const {current, duration,t_left} = this.state;


        console.log(t_left)

        return (
            <View style={[styles.fd_c, styles.ai_ct, styles.jc_ct,styles.mt_10,styles.sliderCons]}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    minimumTrackTintColor="#F4623F"
                    maximumTrackTintColor="#FFE0D9"
                    value={current}
                    thumbImage={asset.track}

                    onSlidingComplete={(value) => {

                        onSlider && onSlider(value);

                    }}
                />

                
                <View style={[styles.sliderDot,{left:theme.window.width * 0.9 * t_left + theme.window.width * 0.08}]}
                    {...this.watcher.panHandlers} ref={'test'}
                >
                    <Text style={[styles.sm9_label, styles.white_label, styles.ml_5]}>{tool.formatSTime(current) + '/' + tool.formatSTime(duration)}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    slider: {
        width: '90%',
        height: 30,
    },
    sliderCons:{
        position:'relative',
        height:30,
    },
    sliderDot:{
        position:'absolute',
        top:5,
        left:0,
        backgroundColor:'#F4623F',
        borderRadius:12,
        paddingLeft:5,
        paddingRight:5,
        paddingTop:3,
        paddingBottom:3
    },
});



export default  AudSlider;
