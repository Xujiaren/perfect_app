import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import Video from 'react-native-video';

import theme from '../../config/theme';

class AudPlayer extends Component {

    constructor(props) {
        super(props);

        const {source = {
            key: '',
            url: '',
            duration: 0,
            paused:false,
            speed:0,
            t_left:0,
        }} = props;

        this.state = {
            key: source.key,
            playUrl: source.url,
            duration: source.duration,
            paused: source.paused,
            current: 0,
            speed:source.speed,
            t_left:source.t_left,
            control: true,
            
        }

        this._onPauseToggle = this._onPauseToggle.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props


        this.blurSub = navigation.addListener('didBlur', (route) => {
            this.setState({
                paused:true
            })
        })

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.setState({
                paused:false
            })
        })
    }

    componentWillUnmount() {
        this.setState({
            paused: true,
        })

        this.blurSub && this.blurSub.remove();
        this.focuSub && this.focuSub.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {source} = nextProps;

        if (source !== this.props.source) {

            this.setState({
                key: source.key,
                current: 0,
                playUrl: source.url,
                duration: source.duration,
                speed:source.speed,
                t_left:source.t_left,
                paused:source.paused
            })
            
        }
    }

    _onPauseToggle() {
        this.setState({
            paused: !this.state.paused
        })
    }



    render() {
        const {onEnd, onProgress} = this.props;
        const {key, playUrl, current, paused,speed} = this.state;

        if (playUrl === '') return null;
  
        return (
            <Video 
                paused = {this.state.paused}
                ref={e => { this.player = e; }}
                poster={''}
                posterResizeMode={'cover'}
                source={{uri: playUrl}} 
                rate={speed}
                pictureInPicture={true}
                playInBackground={true}
                playWhenInactive={true}
                muted={true}
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
                    const P_current = parseFloat(data.currentTime);
                    onProgress && onProgress(P_current); 
                }}


                onEnd={(data) => {
                    onEnd && onEnd();
                }}
            />
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
});

//make this component available to the app
export default AudPlayer;
