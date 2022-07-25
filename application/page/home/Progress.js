import React, { Component } from 'react'
import { Text, View ,TouchableOpacity,StyleSheet,PanResponder} from 'react-native'

import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';

import * as tool from '../../util/common';

var width = theme.window.width;

class Progress extends Component {


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
            actual_x:0, //  实际长度/位置
            indirect:0, // 间接值
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

        // console.log(gestureState.dx)

        const {actual_x,} = this.state;

        let prowidth = (theme.window.width * 0.9).toFixed(2) - 72; // 总长度

        // console.log(prowidth,'prowidth')

        let movedx = gestureState.dx; // 滑动长度
        let progress;// 滑动长度／总长度
        let total_l = 0 ; // 实际长度 

        progress = (Math.abs(movedx)/prowidth).toFixed(2) * 1; 
        let t_l = (Math.abs(72)/width).toFixed(2) * 1;   // 按钮宽度

        // console.log(actual_x + progress,'actual_x + progress')

        console.log(movedx)

        if(movedx > 0 ){
            if((actual_x + progress) * 1.25 < 1){

                total_l = actual_x + progress;

            } else {

                total_l = 0.81;
            }

            this.setState({
                t_left:total_l,
                indirect:total_l
            })

        } else {
            
            if(actual_x  - progress > 0.01){
                total_l = actual_x  - progress;
            } else {
                total_l = 0;
            }

            console.log(actual_x,progress,actual_x  - progress)

            this.setState({
                t_left:total_l,
                indirect:total_l
            })
        
        }


        

    }


    _onPanResponderRelease(){
        console.log('Release')
        const {onSlider} = this.props;
        const {indirect} = this.state;
        // onSlider && onSlider((progress * duration).toFixed(0));

        this.setState({
            actual_x:indirect
        })
    }



    render() {

        const {t_left,current,duration} = this.state;

        return (
            <View style={[styles.container]}>
                <View style={[styles.sliderBox]}>

                    <View style={[styles.slider_lines,styles.fd_r,styles.ai_ct]}>
                        <View style={[styles.slider_dot]}></View>
                        <View style={[styles.slider_line]}></View>
                        <View style={[styles.slider_dot]}></View>
                    </View>

                    <View style={[styles.slider_cons,{left:theme.window.width * 0.9 * t_left}]}
                    {...this.watcher.panHandlers} ref={'test'}
                    >
                        <Text style={[styles.sm9_label, styles.white_label, styles.ml_5]}>{tool.formatSTime(current) + '/' +  tool.formatSTime(duration)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container:{
        // position:'relative',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },

    sliderBox:{
        position:'relative',
    },
    slider_line:{
        width:theme.window.width * 0.9,
        height:2,
        backgroundColor:'#FFE0D9'
    },
    slider_dot:{
        width:4,
        height:4,
        borderRadius:2,
        backgroundColor:'#F4623F'
    },
    slider_cons:{
        position:'absolute',
        top:5,
        left:0,
        backgroundColor:'#F4623F',
        borderRadius:12,
        width:72,
        height:20,
        marginTop:-11,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
})

export default  Progress ;
