import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';


import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/common';
import iconMap from '../../config/font';
import Score from '../Score';

const speeds = [1, 1.5, 2];
const definitions = ['原画','流畅','标清','高清']
class VodPlayer extends Component {

    constructor(props) {
        super(props);

        const { source = {
            key: '',
            cover: '',
            url: '',
            duration: 0,
            paused: false,
            levelId: 0,

        } } = props;

        this.state = {
            key: source.key,
            cover: source.cover,
            playUrl: source.url,
            duration: source.duration,
            paused: source.paused,
            levelId: source.levelId,
            current: 0,

            speed: 0,
            speed_choose: false,

            control: true,
            fullscreen: false,
            dindex:0,
            d_choose:false,
        }

        this._onPauseToggle = this._onPauseToggle.bind(this);
        this._onFullToggle = this._onFullToggle.bind(this);
        this._onSpeed = this._onSpeed.bind(this);
        this._orientationDidChange = this._orientationDidChange.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props

        Orientation.lockToPortrait();
        Orientation.addOrientationListener(this._orientationDidChange);

        this.blurSub = navigation.addListener('didBlur', (route) => {
            this.setState({
                paused: true
            })
        })

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.setState({
                paused: false
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            paused: true,
        })
        Orientation.lockToPortrait();
        Orientation.removeOrientationListener(this._orientationDidChange);

        this.blurSub && this.blurSub.remove();
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const { source } = nextProps;

        if (source !== this.props.source) {
            AsyncStorage.getItem(source.key).then(data => {
                let current = 0;
                if (data) {
                    current = parseInt(data);
                }
            this.setState({
                key: source.key,
                current: current == this.state.duration ? 0 : current,
                cover: source.cover,
                playUrl: source.url,
                duration: source.duration,
                // paused:!source.canPlay
            })

            })

        }
    }

    _onPauseToggle() {
        this.setState({
            paused: !this.state.paused
        })
    }

    _orientationDidChange(orientation) {
        if (orientation == 'LANDSCAPE') {
            this.player && this.player.presentFullscreenPlayer();
        } else {
            this.player && this.player.dismissFullscreenPlayer();
        }
    }

    _onFullToggle() {
        let fullscreen = this.state.fullscreen;

        if (fullscreen) {
            this.player && this.player.dismissFullscreenPlayer();
        } else {
            this.player && this.player.presentFullscreenPlayer();
        }
    }

    _onSpeed(index) {
        this.setState({
            speed: index,
            speed_choose: false,
        });
    }
    _onDef(index) {
        this.setState({
            dindex: index,
            d_choose: false,
        },()=>{
            if(this.state.dindex==0){
                this.props.onDefin('OD')
            }else if(this.state.dindex==1){
                this.props.onDefin('SD')
            }else if(this.state.dindex==2){
                this.props.onDefin('LD')
            }else if(this.state.dindex==3){
                this.props.onDefin('FD')
            }
        });
    }
    _onSeek = (val) => {
        this.player.seek(val)
    }
    render() {
        const { onEnd, onProgress } = this.props;
        const { cover, key, playUrl, duration, current, control, paused, fullscreen, speed, speed_choose,dindex,d_choose } = this.state;

        if (playUrl === '') return null;


        return (
            <TouchableWithoutFeedback onPress={() => this.setState({
                control: !this.state.control
            })}>
                <View style={[styles.container, styles.bg_black]}>
                    <Video
                        paused={this.state.paused}
                        ref={e => { this.player = e; }}
                        poster={cover}
                        rate={speeds[speed]}
                        posterResizeMode={'cover'}
                        source={{ uri: playUrl }}
                        resizeMode={'cover'}
                        style={styles.container}
                        playInBackground={false}
                        fullscreenAutorotate={true}
                        fullscreenOrientation={'landscape'}

                        onFullscreenPlayerWillPresent={() => {
                            this.setState({
                                fullscreen: true
                            })

                        }}

                        onFullscreenPlayerWillDismiss={() => {
                            this.setState({
                                fullscreen: false
                            })

                        }}

                        onLoad={(data) => {
                            this.setState({
                                duration: parseInt(data.duration)
                            })
                        }}

                        onReadyForDisplay={(data) => {
                            this.setState({
                                paused: false
                            })

                            if (current > 0) {
                                this.player.seek(current);
                            }
                        }}

                        onProgress={(data) => {
                            const current = parseInt(data.currentTime);
                            AsyncStorage.setItem(key, current + '').then(status => {

                            })
                            this.setState({
                                current: current,
                            })

                            onProgress && onProgress(current)
                        }}

                        onEnd={(data) => {
                            onEnd && onEnd();
                        }}
                    />
                    {control && speed_choose ?
                        <View style={[styles.speed]}>
                            {speeds.map((speed, index) => {
                                return (
                                    <TouchableOpacity key={'speed_' + index} style={[styles.p_10, styles.ai_ct]} onPress={() => this._onSpeed(index)}>
                                        <Text style={[styles.white_label, styles.sm_label]}>{speed}x</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        : null}
                    {
                        control && d_choose?
                        <View style={[styles.defs]}>
                            {definitions.map((def, index) => {
                                return (
                                    <TouchableOpacity key={'d_' + index} style={[styles.p_10, styles.ai_ct]} onPress={() => this._onDef(index)}>
                                        <Text style={[styles.white_label, styles.sm_label]}>{def}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        :null
                    }

                    {control ?
                        <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]} onLayout={() => {
                            this.fts && clearTimeout(this.fts);
                            this.fts = setTimeout(() => {
                                this.setState({
                                    control: false,
                                })
                            }, 5000)
                        }}>
                            <TouchableOpacity onPress={this._onPauseToggle}>
                                <Text style={[styles.icon, styles.white_label]}>{iconMap(!paused ? 'zanting' : 'bofang')}</Text>
                            </TouchableOpacity>
                            <Slider
                                style={[styles.slider, styles.ml_10]}
                                minimumValue={0}
                                maximumValue={duration}
                                minimumTrackTintColor="#F4623F"
                                maximumTrackTintColor="#FFFFFF"
                                value={current}
                                thumbImage={asset.track}
                                onSlidingComplete={(value) => {
                                    this.player.seek(value);
                                }}
                            />
                            <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                                <Text style={[styles.sm9_label, styles.white_label, styles.ml_5]}>{tool.formatSTime(current) + '/' + tool.formatSTime(duration)}</Text>
                                <TouchableOpacity style={[styles.ml_10]} onPress={() => {
                                            this.setState({
                                                d_choose: !d_choose,
                                            })
                                        }}>
                                            <Text style={[styles.white_label, styles.sm_label]}>{definitions[dindex]}</Text>
                                        </TouchableOpacity>
                                {
                                    this.state.levelId ?
                                        null :
                                        <TouchableOpacity style={[styles.ml_10]} onPress={() => {
                                            this.setState({
                                                speed_choose: !speed_choose,
                                            })
                                        }}>
                                            <Text style={[styles.white_label, styles.sm_label]}>{speeds[speed]}x</Text>
                                        </TouchableOpacity>
                                }

                                <TouchableOpacity onPress={this._onFullToggle} style={[styles.ml_10]}>
                                    <Text style={[styles.icon, styles.white_label]}>{iconMap(fullscreen ? 'suoxiao' : 'quanping')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    container: {
        width: theme.window.width,
        height: theme.window.width * 0.5625
    },
    tipbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    speed: {
        position: 'absolute',
        right: 15,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    defs:{
        position: 'absolute',
        right: 45,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    slider: {
        width: theme.window.width - 190,
        height: 30,
    }
});

//make this component available to the app
export default VodPlayer;
