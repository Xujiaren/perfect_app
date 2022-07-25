import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';

import VideoPlayer from 'react-native-video-controls';
import HTML from 'react-native-render-html';
import Video from 'react-native-video';

import theme from '../config/theme';
import asset from '../config/asset';
import { forTimer } from '../util/common';

const IGNORED_TAGS = ['head', 'scripts', 'track', 'embed', 'object', 'param', 'source', 'canvas', 'noscript',
    'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form',
    'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'details', 'diaglog',
    'menu', 'menuitem', 'summary'];

const IGNORED_STYLES = ['line-height'];

class HtmlVideoPlayer extends Component {

    constructor(props) {
        super(props)

        this.vkey = props.vkey;
        this.state = {
            paused: true,
            duration: 0,
        }
    }

    componentDidMount() {
        this.sub = DeviceEventEmitter.addListener('video', (data) => {
            if (this.vkey !== data) {
                this.setState({
                    paused: true,
                })
            }
        })
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
    }

    render() {
        const { audioOnly, name, src, poster, key, vkey } = this.props;
        const { paused, duration } = this.state;

        const cover = poster != "" ? poster : src + "?x-oss-process=video/snapshot,t_10000,m_fast";

        // if (audioOnly) {
        //     return (
        //         <View style={[audioStyles.container, audioStyles.row, audioStyles.border_tip]}>
        //             <View style={[audioStyles.player, audioStyles.bg_gray]} >
        //                 <Video
        //                     audioOnly={true}
        //                     controls={false}
        //                     source={{ uri: src }}
        //                     poster={poster}
        //                     style={[audioStyles.player]}
        //                     paused={paused}
        //                     ref={ref => (this.player = ref)}
        //                     pictureInPicture={true}
        //                     playInBackground={true}
        //                     playWhenInactive={true}
        //                     onPlay={(data) => {
        //                         this.setState({
        //                             paused: false,
        //                         })
        //                         DeviceEventEmitter.emit('video', vkey);

        //                     }}

        //                     onProgress={(data) => {
        //                         this.setState({
        //                             duration: parseInt(data.currentTime)
        //                         })
        //                     }}

        //                     onEnd={(data) => {
        //                         this.setState({
        //                             duration: 0,
        //                             paused: true,
        //                         })
        //                     }}
        //                 />
        //                 <TouchableOpacity style={[audioStyles.ctrl, audioStyles.ai_ct, audioStyles.jc_ct]} onPress={() => {
        //                     this.setState({
        //                         paused: !paused
        //                     })
        //                 }}>
        //                     <Image source={paused ? asset.icon_control_play : asset.icon_control_pause} style={[audioStyles.ctrl_icon]} />
        //                 </TouchableOpacity>
        //             </View>
        //             <View style={[audioStyles.row, audioStyles.jc_sb, audioStyles.p_10, audioStyles.col_1]}>
        //                 <Text>{name}</Text>
        //                 <Text style={[audioStyles.sm_label, audioStyles.tip_label]}>{forTimer(duration)}</Text>
        //             </View>
        //         </View>
        //     )
        // }

        return (
            <VideoPlayer
                controls={false} 
                source={{ uri: src }}
                poster={cover}
                style={{ width: theme.window.width - 30, height: (theme.window.width - 30) * 0.563, marginBottom: 10, marginTop: 10, }}
                paused={paused}
                disableSeekbar={true}
                disableBack={true}
                disableFullscreen={true}
                disableVolume={true}
                ref={ref => (this.player = ref)}
                onPlay={(data) => {
                    this.setState({
                        paused: false,
                    })
                    DeviceEventEmitter.emit('video', vkey);

                }}
                onPause={(data)=>{
                    this.setState({
                        paused: true,
                    })
                }}
                onProgress={(data) => {
                    this.setState({
                        duration: parseInt(data.currentTime)
                    })
                }}

                onEnd={(data) => {
                    this.setState({
                        duration: 0,
                        paused: true,
                    })
                }}
            />
            // <Video
            //     style={{ width: theme.window.width - 30, height: (theme.window.width - 30) * 0.563, marginBottom: 10, marginTop: 10, }}
            //     source={{ uri: src }}

            //     poster={poster}
            //     ref={ref => (this.player = ref)}
            //     onPlay={(data) => {
            //         this.setState({
            //             paused: false,
            //         })
            //         DeviceEventEmitter.emit('video', vkey);

            //     }}

            //     onProgress={(data) => {
            //         this.setState({
            //             duration: parseInt(data.currentTime)
            //         })
            //     }}

            //     onEnd={(data) => {
            //         this.setState({
            //             duration: 0,
            //             paused: true,
            //         })
            //     }}
            // />
        )
    }
}
class HtmlImg extends Component {

    constructor(props) {
        super(props)
        this.uri = props.uri

        this.state = {
            set:0
        }
    }

    componentDidMount() {
        Image.getSize(this.uri,(width,height)=>{
            this.setState({
                set:height/width
            })
        })
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
    }
   
    render() {
        const { set } = this.state;
        return <Image source={{ uri:this.uri }}  style={[{ width:theme.window.width-30, height:(theme.window.width-30)*set }]} resizeMode='contain' resizeMethod='resize'/>
    }
}
class HtmlImgs extends Component {

    constructor(props) {
        super(props)
        this.uri = props.uri

        this.state = {
            set:0
        }
    }

    componentDidMount() {
        Image.getSize(this.uri,(width,height)=>{
            this.setState({
                set:height/width
            })
        })
    }

    componentWillUnmount() {
        this.sub && this.sub.remove();
    }
   
    render() {
        const { set } = this.state;
        return <Image source={{ uri:this.uri }}  style={[{ width:theme.window.width, height:(theme.window.width)*set }]} resizeMode='contain' resizeMethod='resize'/>
    }
}
const renderers = {
    video: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return <HtmlVideoPlayer audioOnly={false} name={htmlAttribs.name} src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key} />
    },
    audio: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return <HtmlVideoPlayer audioOnly={true} name={htmlAttribs.name} src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key} />
    },
    img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
         return <HtmlImg uri={htmlAttribs.src}/>
       
    },
}
const rendererss = {
    video: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return <HtmlVideoPlayer audioOnly={false} name={htmlAttribs.name} src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key} />
    },
    audio: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return <HtmlVideoPlayer audioOnly={true} name={htmlAttribs.name} src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key} />
    },
}
const renderersss = {
    video: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return <HtmlVideoPlayer audioOnly={false} name={htmlAttribs.name} src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key} />
    },
    audio: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return <HtmlVideoPlayer audioOnly={true} name={htmlAttribs.name} src={htmlAttribs.src} poster={htmlAttribs.poster} key={passProps.key} vkey={passProps.key} />
    },
    img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
         return <HtmlImgs uri={htmlAttribs.src}/>
       
    },
}
class HtmlView extends Component {
    render() {
        return <HTML {...this.props}
            imagesMaxWidth={this.props.type == 1 ? theme.window.width - 30 : theme.window.width}
            ignoredStyles={IGNORED_STYLES}
            renderers={this.props.type == 1 ?renderers:this.props.type == 2 ?renderersss:rendererss}
            ignoredTags={IGNORED_TAGS}
            tagsStyles={{ p: { paddingLeft: 15,paddingRight:15,paddingTop:0,paddingBottom:0, margin: 0 }, span: { lineHeight: 32 }, img: { padding: 0, marginBottom: 0, marginTop: 0 }, div: { padding: 0, margin: 0 } }}
            onLinkPress={this.props.onLinkPress}
        />
    }
}

const audioStyles = StyleSheet.create({
    ...theme.base,
    container: {
        backgroundColor: 'white',
        width: theme.window.width - 30,
        height: 50,
    },
    player: {
        width: 50,
        height: 50,
    },
    ctrl: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    ctrl_icon: {
        width: 24,
        height: 24,
    }
})

//make this component available to the app
export default HtmlView;
