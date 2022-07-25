import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, PanResponder, BackHandler, Modal } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';

import asset from '../../config/asset';
import theme from '../../config/theme';
import * as tool from '../../util/common';
import iconMap from '../../config/font';
const speeds = [1, 1.5, 2];
const definitions = ['原画', '流畅', '标清', '高清']
class VodPlayer extends Component {

    constructor(props) {
        super(props);

        const { source = {
            key: '',
            cover: '',
            url: '',
            duration: 0,
            levelId: 0,
            showProgress: 1
        } } = props;
        this.state = {
            key: source.key,
            cover: source.cover,
            playUrl: source.url,
            duration: source.duration,
            levelId: source.levelId,
            showProgress: 1,
            current: 0,
            speed: 0,
            speed_choose: false,

            control: true,
            paused: false,
            fullscreen: false,
            dindex: 0,
            d_choose: false,
        }

        this._onPauseToggle = this._onPauseToggle.bind(this);
        this._onFullToggle = this._onFullToggle.bind(this);
        this._onSpeed = this._onSpeed.bind(this);
        this._orientationDidChange = this._orientationDidChange.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;
        Orientation.lockToPortrait();
        Orientation.addOrientationListener(this._orientationDidChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPressAndroid)
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
    componentWillMount() {
        const { showProgress } = this.state;

        this.seekPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                if (!showProgress) return;
                this.fts && clearTimeout(this.fts);

                this.setState({
                    control: !this.state.control,
                    seek: this.state.current,
                })

            },

            onPanResponderMove: (evt, gestureState) => {
                if (!showProgress) return;

                let seek = this.state.seek;
                if (gestureState.dx > 0) {
                    seek = parseInt(seek + (gestureState.dx / theme.window.width) * this.state.duration);
                } else {
                    seek = parseInt(seek + (gestureState.dx / theme.window.width) * this.state.duration);

                    if (seek < 0) seek = 0;
                }

                this.setState({
                    current: seek,
                }, () => {
                    this.player && this.player.seek(seek);
                })


            },

            onPanResponderRelease: (evt, gestureState) => {
                if (!showProgress) return;

                this.fts = setTimeout(() => {
                    this.setState({
                        control: false,
                        speed_choose: false,
                    })
                }, 5000);
            },
        });
    }
    componentWillUnmount() {
        this.setState({
            paused: true,
        })
        Orientation.lockToPortrait();
        Orientation.removeOrientationListener(this._orientationDidChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPressAndroid)
        this.blurSub && this.blurSub.remove();
        this.focuSub && this.focuSub.remove();
    }
    handleBackButtonPressAndroid = () => {
        const { fullscreen } = this.state;

        if (fullscreen) {
            StatusBar.setHidden(false);
            Orientation.lockToPortrait();
            this.player && this.player.dismissFullscreenPlayer();
            this.props.forRight(0)
            return true;
        }

        return false;
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
    _onSpeed(index) {
        this.setState({
            speed: index,
            speed_choose: false,
        });
    }
    _onPauseToggle() {
        this.setState({
            paused: !this.state.paused
        })
    }

    _orientationDidChange(orientation) {
        if (orientation == 'LANDSCAPE') {
            Orientation.lockToLandscapeLeft();
            this.player && this.player.presentFullscreenPlayer();
        } else {
            Orientation.lockToPortrait();
            this.player && this.player.dismissFullscreenPlayer();
        }
    }

    _onFullToggle() {
        let fullscreen = this.state.fullscreen;

        if (fullscreen) {
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
            this.player && this.player.dismissFullscreenPlayer();
            this.props.forRight(0)
        } else {
            Orientation.lockToLandscapeLeft()
            StatusBar.setHidden(true);
            this.player && this.player.presentFullscreenPlayer();
            this.props.forRight(1)
        }
    }
    _onDef(index) {
        this.setState({
            dindex: index,
            d_choose: false,
        }, () => {
            if (this.state.dindex == 0) {
                this.props.onDefin('OD')
            } else if (this.state.dindex == 1) {
                this.props.onDefin('SD')
            } else if (this.state.dindex == 2) {
                this.props.onDefin('LD')
            } else if (this.state.dindex == 3) {
                this.props.onDefin('FD')
            }
        });
    }
    _onSeek = (val) => {
        this.player.seek(val)
    }
    _onBreave = () => {
        this.setState({
            control: !this.state.control
        })
    }
    render() {
        const { onEnd, onProgress, onFullscreen } = this.props;
        const { cover, key, playUrl, duration, current, control, paused, fullscreen, speed, speed_choose, dindex, d_choose, showProgress } = this.state;

        return (
            <View style={[styles.container, fullscreen && styles.fbox, styles.bg_black, fullscreen && styles.ftbox]} >
                <Video
                    paused={this.state.paused}
                    ref={e => { this.player = e; }}
                    poster={cover}
                    rate={speeds[speed]}
                    posterResizeMode={'contain'}
                    source={{ uri: playUrl }}
                    resizeMode={'contain'}
                    style={[styles.container, fullscreen && styles.fcontainer]}

                    fullscreenAutorotate={true}
                    fullscreenOrientation={'landscape'}

                    onFullscreenPlayerWillPresent={() => {
                        this.setState({
                            fullscreen: true
                        })

                        onFullscreen && onFullscreen(true);
                    }}

                    onFullscreenPlayerWillDismiss={() => {
                        this.setState({
                            fullscreen: false
                        })

                        onFullscreen && onFullscreen(false);
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
                        const P_current = parseInt(data.currentTime);

                        if (data.currentTime > current) {
                            this.setState({
                                current: P_current,
                            })
                        }
                        AsyncStorage.setItem(key, P_current + '').then(status => {

                        })

                        onProgress && onProgress(P_current)
                    }}

                    onEnd={(data) => {
                        this.setState({
                            current: 0
                        }, () => {
                            onEnd && onEnd();
                        })
                    }}
                />
                <View {...this.seekPanResponder.panHandlers} collapsable={false} style={[styles.hand]}>
                    <TouchableOpacity style={[styles.f1]} onPress={() => this.setState({
                        control: !this.state.control
                    })} />
                </View>

                {control && speed_choose &&!fullscreen?
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
                    control && d_choose&&!fullscreen ?
                        <View style={[styles.defs]}>
                            {definitions.map((def, index) => {
                                return (
                                    <TouchableOpacity key={'d_' + index} style={[styles.p_10, styles.ai_ct]} onPress={() => this._onDef(index)}>
                                        <Text style={[styles.white_label, styles.sm_label]}>{def}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        : null
                }
                {control && !fullscreen ?
                    <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]} onLayout={() => {
                        this.fts && clearTimeout(this.fts);
                        this.fts = setTimeout(() => {
                            this.setState({
                                control: false,
                            })
                        }, 5000)
                    }}>
                        <TouchableOpacity onPress={this._onPauseToggle} hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}>
                            <Text style={[styles.icon, styles.white_label]}>{iconMap(!paused ? 'zanting' : 'bofang')}</Text>
                        </TouchableOpacity>
                        {/* <View style={[styles.row, styles.ai_ct, styles.jc_ct]}> */}
                        <Slider
                            style={styles.slider}
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
                                null
                                :
                                <TouchableOpacity style={[styles.ml_5]} onPress={() => {
                                    this.setState({
                                        speed_choose: !speed_choose,
                                    })
                                }}>
                                    <Text style={[styles.white_label, styles.sm_label]}>{speeds[speed]}x</Text>
                                </TouchableOpacity>
                        }

                        {/* </View> */}
                        <TouchableOpacity onPress={this._onFullToggle} style={[styles.toggleFull, styles.ml_5]}>
                            <Text style={[styles.icon, styles.white_label]}>{iconMap(fullscreen ? 'suoxiao' : 'quanping')}</Text>
                        </TouchableOpacity>
                    </View>
                    : null}
                {
                    fullscreen ?
                        <Modal transparent={true}>
                            <View {...this.seekPanResponder.panHandlers} collapsable={false} style={[styles.hand]}>
                                <TouchableOpacity style={[styles.f1]} onPress={() => this.setState({
                                    control: !this.state.control
                                })} />
                            </View>
                            {control && speed_choose ?
                                <View style={[styles.speeds]}>
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
                                control && d_choose ?
                                    <View style={[styles.defss]}>
                                        {definitions.map((def, index) => {
                                            return (
                                                <TouchableOpacity key={'d_' + index} style={[styles.p_10, styles.ai_ct]} onPress={() => this._onDef(index)}>
                                                    <Text style={[styles.white_label, styles.sm_label]}>{def}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                    : null
                            }
                            {
                                control ?
                                    <View style={[styles.p_10, styles.tipbar, styles.row, styles.ai_ct, styles.jc_sb]} onLayout={() => {
                                        this.fts && clearTimeout(this.fts);
                                        this.fts = setTimeout(() => {
                                            this.setState({
                                                control: false,
                                            })
                                        }, 5000)
                                    }}>
                                        <TouchableOpacity onPress={this._onPauseToggle} hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}>
                                            <Text style={[styles.icon, styles.white_label]}>{iconMap(!paused ? 'zanting' : 'bofang')}</Text>
                                        </TouchableOpacity>
                                        {/* <View style={[styles.row, styles.ai_ct, styles.jc_ct]}> */}
                                        <Slider
                                            style={styles.slider}
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
                                                null
                                                :
                                                <TouchableOpacity style={[styles.ml_5]} onPress={() => {
                                                    this.setState({
                                                        speed_choose: !speed_choose,
                                                    })
                                                }}>
                                                    <Text style={[styles.white_label, styles.sm_label]}>{speeds[speed]}x</Text>
                                                </TouchableOpacity>
                                        }

                                        {/* </View> */}
                                        <TouchableOpacity onPress={this._onFullToggle} style={[styles.toggleFull, styles.ml_5]}>
                                            <Text style={[styles.icon, styles.white_label]}>{iconMap(fullscreen ? 'suoxiao' : 'quanping')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : null
                            }

                        </Modal>
                        : null
                }
            </View>
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
    ftbox: {
        width: theme.window.height,
        height: theme.window.width,
    },
    fbox: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 8888,
    },
    hand: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998
    },
    fcontainer: {
        width: theme.window.height,
        height: theme.window.width,
    },
    tipbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 9999
    },
    slider: {
        width: '58%',
        height: 30,
    },
    toggleFull: {
        width: 30,
        height: 30,
        borderColor: '#111111',
        flexDirection: 'row',
        alignItems: 'center',
    },
    speed: {
        position: 'absolute',
        right: 15,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    defs: {
        position: 'absolute',
        right: 45,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    speeds: {
        position: 'absolute',
        right: 45,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    defss: {
        position: 'absolute',
        right: 95,
        bottom: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    hand: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    f1: {
        flex: 1
    },
});

//make this component available to the app
export default VodPlayer;
