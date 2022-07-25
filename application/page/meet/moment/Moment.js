//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer'
import VideoPlayer from 'react-native-video-controls'
import theme from '../../../config/theme'
import iconMap from '../../../config/font'

// create a component
class Moment extends Component {

    static navigationOptions = {
        title:'精彩瞬间',
        headerRight: <View/>,
    };

    state = {
        loaded: false,
        
        preview: false,
        preview_index: 0,
        preview_imgs: [],

        vpreview: false,
        video: '',
    }

    moment = this.props.navigation.getParam('moment', {articleId: 0})

    videos = []
    photos = []

    componentDidMount() {
        this.onRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {moment} = nextProps

        if (moment !== this.props.moment) {
            this.moment = moment

            moment.downloadList.map((down, index) => {
                if (down.ftype == 0) {
                    this.photos = this.photos.concat(down.galleryList)
                } else {
                    this.videos = this.videos.concat(down.galleryList)
                }
            })

            this.setState({
                loaded: true
            })
        }
    }

    onRefresh = () => {
        const {actions} = this.props
        actions.meet.moment(this.moment.articleId)
    }

    _onPreview = (index) => {
        let images = [];
        this.photos.map((gallery, i) => {
            images.push({
				url: gallery.fpath,
			});
        });

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: images,
        });
    }

    render() {
        const {loaded, preview, preview_index, preview_imgs, vpreview, video} = this.state

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )

        return (
            <View style={[styles.container, styles.bg_white]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_15]}
                >
                    <Image source={{uri: this.moment.articleImg}} style={[styles.cover, styles.bg_wred]}/>
                    <View style={[styles.mt_15]}>
                        <Text style={[styles.lg_label]}>{this.moment.title}</Text>
                        <Text style={[styles.sm_label, styles.gray_label, styles.lh20_label]}>{this.moment.content}</Text>
                    </View>
                    <View style={[styles.mt_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.lg_label]}>视频</Text>
                        </View>
                        <View style={[styles.row, styles.f_wrap, styles.jc_sb]}>
                            {this.videos.map((video, index) => {
                                return (
                                    <TouchableOpacity style={[styles.video, styles.mt_15]} key={'video_' + index} onPress={() => this.setState({
                                        vpreview: true,
                                        video: video.fpath,
                                    })}>
                                        <View>
                                            <Image source={{uri: video.fpath + '?x-oss-process=video/snapshot,t_10000,m_fast'}} style={[styles.video_cover, styles.bg_wred, styles.circle_10]}/>
                                            <Text style={[styles.icon, styles.white_label, styles.video_icon, styles.lg40_label]}>{iconMap('bofangtubiao')}</Text>
                                        </View>
                                        <Text style={[styles.sm_label, styles.gray_label, styles.mt_8]}>{video.title}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                    <View style={[styles.mt_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.lg_label]}>相册</Text>
                        </View>
                        <View style={[styles.row, styles.f_wrap]}>
                            {this.photos.map((photo, index) => {
                                return (
                                    <TouchableOpacity style={[styles.mt_15, styles.mr_10]} onPress={() => this._onPreview(index)}>
                                        <Image source={{uri: photo.fpath}} style={[styles.photo, styles.bg_wred, styles.circle_10]} key={'photo_' + index}/>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
                <Modal visible={preview} transparent={true} onRequestClose={() => { 
                    this.setState({
                        preview: false,
                    })
                }}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>

                <Modal visible={vpreview} transparent={true} onRequestClose={() => { 
                    this.setState({
                        vpreview: false,
                    })
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={() => {
                        this.setState({
                            vpreview: false,
                        })
                    }}/>

                    <View style={[styles.video_container, styles.ai_ct, styles.jc_ct]}>
                        <VideoPlayer source={{uri: video}} paused={false} style={[styles.video_preview]} onBack={() => {
                            this.setState({
                                vpreview: false,
                            })
                        }}/>
                    </View>

                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    cover: {
        width: theme.window.width - 30,
        height: (theme.window.width - 30) * 0.39 
    },
    video_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    video_preview: {
        width: theme.window.width,
        height: theme.window.width * 0.5625,
    },
    video: {
        width: '48%'
    },
    video_cover: {
        height: 90,
    },
    video_icon: {
        position: 'absolute',
        top: 25,
        left: ((theme.window.width - 30) * 0.48 - 40) / 2,
    },
    photo: {
        width: (theme.window.width - 60) / 3,
        height: (theme.window.width - 60) / 3,
    }
});

export const LayoutComponent = Moment;

export function mapStateToProps(state) {
	return {
        moment: state.meet.moment,
	};
}