import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

import _ from 'lodash';
import { RtmpView } from 'react-native-rtmpview';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import * as tool from '../../util/common';

import LiveDate from './LiveDate'
class ActLive extends Component {

    constructor(props) {
        super(props);

        this.state = {
            liveStatus: props.liveStatus || 0,
            roomStatus: props.roomStatus || 0,
            totalCount: props.totalCount || 0,
            publistType:props.publistType||0,
            canBuy : props.canBuy || false ,

            book: props.book || false,
            bookNum: props.bookNum || 0,
            restTime: props.source.restTime || 0,

            fullscreen: false,
        }

        this._onCount = this._onCount.bind(this);
        this._orientationDidChange = this._orientationDidChange.bind(this);
        this._onFull = this._onFull.bind(this);
        this._onFullToggle = this._onFullToggle.bind(this);
    }

    componentWillMount() {
        const initial = Orientation.getInitialOrientation();
        console.info(initial);
    }

    componentDidMount() {
        const {liveStatus} = this.state;

        Orientation.lockToPortrait();

        if (liveStatus == 1) {
            this.player.initialize();
        }

        this._onCount();

        Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillReceiveProps(nextProps) {
        const {liveStatus, roomStatus, totalCount, book, bookNum,canBuy} = nextProps;

        if (liveStatus !== this.props.liveStatus) {

            this.setState({
                liveStatus: liveStatus,
            }, () => {
                if (liveStatus == 1) {
                    this.player.initialize();
                }
            })
        }

        if (roomStatus !== this.props.roomStatus) {
            this.setState({
                roomStatus: roomStatus,
            })
        }

        if (totalCount !== this.props.totalCount) {
            this.setState({
                totalCount: totalCount
            })
        }

        if (book !== this.props.book) {
            this.setState({
                book: book
            })
        }

        if (bookNum !== this.props.bookNum) {
            this.setState({
                bookNum: bookNum
            })
        }

        if(canBuy !== this.props.canBuy){
            this.setState({
                canBuy:canBuy
            })
        }
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
        this.ts && clearTimeout(this.ts);

        Orientation.lockToPortrait();
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    _onFull(status) {
        const {onFullScreen} = this.props;

        this.setState({
            fullscreen: status
        }, () => {
            if (status) {
                Orientation.lockToLandscapeRight();
            } else {
                Orientation.lockToPortrait();
            }

            onFullScreen && onFullScreen(status);
        })
    }

    _orientationDidChange(orientation) {
        if (orientation == 'LANDSCAPE') {
            this._onFull(true)
        } else {
            this._onFull(false)
        }
    }

    _onCount() {
        let restTime = this.state.restTime;

            if (restTime > 0) {
                this.ts = setTimeout(() => {
                    restTime--;
    
                    this.setState({
                        restTime: restTime
                    }, () => {
                        this._onCount();
                    })
                }, 1000);
            } else {
                this.ts && clearTimeout(this.ts);
            }
    }

    _onFullToggle() {
        this._onFull(!this.state.fullscreen)        
    }

    render() {
        const {source, ad, onBook, onBuy,style={}} = this.props;
        const {liveStatus, roomStatus, totalCount, restTime, book, bookNum, fullscreen,canBuy,publistType} = this.state;

        const preMedia = ad.preVideos.length > 0 ? ad.preVideos[_.random(0, ad.preVideos.length - 1)] : null;
        const inMedia = ad.inVideos.length > 0 ? ad.inVideos[_.random(0, ad.inVideos.length - 1)] : null;
        const endMedia = ad.endVideos.length > 0 ? ad.endVideos[_.random(0, ad.endVideos.length - 1)] : null;

        // if(canBuy){
        //     return(
        //         <View style={[styles.container]}>
        //             <ImageBackground source={{uri: source.cover}} style={[styles.container,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
        //                 <TouchableOpacity  style={[styles.pay_btn]} onPress={() => onBuy && onBuy()}>
        //                     <Text style={[styles.sm_label,styles.white_label]}>收费观看</Text>
        //                 </TouchableOpacity>
        //             </ImageBackground>
                    
        //             <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]}>
        //                 <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
        //                     <Text style={[styles.white_label]}>即将开始</Text>
        //                     {restTime < 30 * 60 ?
        //                     <Text style={[styles.white_label, styles.sm_label, styles.ml_10]}>{tool.formatTime(restTime)}</Text>
        //                     : null}
        //                 </View>
        //                 <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
        //                     <Text style={[styles.white_label, styles.sm_label]}>{bookNum}人已预约</Text>
        //                     <TouchableOpacity style={[styles.ml_10, styles.live_btn, book && styles.disabledContainer]} onPress={() => onBook && onBook()} disabled={book}>
        //                         <Text style={[styles.sm_label, styles.white_label]}>{book ? '已预约' : '预约'}</Text>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>
        //         </View>
        //     )
        // }

       
        
        return (
            <RtmpView
                    style={[publistType==0?styles.container:{ width: theme.window.width, height: theme.window.height }]}
                    ref={e => { this.player = e; }}
                    url={source.uri}
                />
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        width: theme.window.width,
        height: theme.window.width * 0.5625 
    },
    fplayer: {
        width: theme.window.height,
        height: theme.window.width,
    },
    fcontainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    tipbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    live_btn:{
        width:54,
        height:23,
        borderRadius:5,
        backgroundColor:'#F4623F',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    pay_btn:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:120,
        height:30,
        marginLeft:-60,
        marginTop:-15,
        backgroundColor:'#F4623F',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    }
});

export default ActLive;
