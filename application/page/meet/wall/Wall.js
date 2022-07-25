//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Modal, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker'
import ImageViewer from 'react-native-image-zoom-viewer'
import VideoPlayer from 'react-native-video-controls'

import _ from 'lodash'

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import theme from '../../../config/theme';
import iconMap from '../../../config/font'

const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.4, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class Wall extends Component {

    static navigationOptions = {
        title:'心情墙',
        headerRight: <View/>,
    };

    page = 0
    pages = 1
    items = []
    user_id = this.props.navigation.getParam('user_id', 0)

    state = {
        bg: '',
        index: 0,
        refreshState: RefreshState.Idle,

        preview: false,
        preview_index: 0,
        preview_imgs: [],

        vpreview: false,
        video: '',
    }

    componentDidMount() {
        const {actions, navigation} = this.props
        actions.user.user()
        actions.meet.bg()

        this._onHeaderRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {bg, wall} = nextProps
        if (bg !== this.props.bg && bg.fpath) {
            this.setState({
                bg: bg.fpath,
            })
        }

        if (wall !== this.props.wall) {
            this.pages = wall.pages
            this.items = this.items.concat(wall.items)
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300)
    }

    _onHeaderRefresh = () => {
        const {actions} = this.props

        this.page = 0
        this.pages = 1
        this.items = []

        actions.meet.wall(this.user_id, 0)
        this.setState({refreshState: RefreshState.HeaderRefreshing})
    }

    _onFooterRefresh = () => {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page++;

            actions.meet.wall(this.user_id, this.page)
        }  else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _onAction = (action, args) => {
        const {user, navigation, actions} = this.props

        const that = this

        if (!user.userId) {
            navigation.navigate('PassPort')
        } else {
            if (action == 'bg') {
                ImagePicker.showImagePicker(options, (response) => {
                    if (response.uri) {
                        actions.site.upload({
                            file:'data:image/jpeg;base64,' + response.data,
                            resolved: (pic) => {
                                actions.meet.uploadBg({
                                    pics: pic,
                                    resolved: (data) => {
                                        that.setState({
                                            bg: pic,
                                        })
                                    },
                                    rejected: (msg) => {
                                    },
                                })
                            },
                            rejected: (msg) => {
                            },
                        });
                    }
                });
            } else if (action == 'pub') {
                navigation.navigate('MeetWallPublish')
            } else if (action == 'owner') {
                if (this.user_id == 0) {
                    navigation.navigate('MeetWallOwner', {user_id: user.userId})
                }                
            } else if (action == 'praise') {
                let mood = this.items[args.index]

                if (mood.isLike) {
                    mood.isLike = false
                    _.pull(mood.names, user.nickname)

                    actions.meet.removeLike({
                        mood_id: mood.moodId,
                        resolved: (data) => {
                        },
                        rejected: (msg) => {
                        },
                    })
                } else {
                    mood.isLike = true
                    mood.names.push(user.nickname)

                    actions.meet.like({
                        mood_id: mood.moodId,
                        resolved: (data) => {
                        },
                        rejected: (msg) => {
                        },
                    })
                }

                this.items[args.index] = mood
                this.setState({
                    index: args.index,
                })
            }
        }
        
    }

    _onPreview = (galleryList, index) => {
        let images = [];
        galleryList.map((gallery, i) => {
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

    _renderHeader = () => {
        const {bg} = this.state
        const {navigation, user} = this.props

        return(
            <TouchableOpacity style={[styles.ai_end]} onPress={() => this._onAction('bg')}>
                <ImageBackground source={{uri: bg}} style={[styles.bg_wred, styles.cover, styles.p_15, styles.ai_end]}>
                    <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => this._onAction('pub')}>
                        <Text style={[styles.icon, styles.white_label]}>{iconMap('bianji')}</Text>
                        <Text style={[styles.white_label]}> 发布心情</Text>
                    </TouchableOpacity>
                </ImageBackground>
                <TouchableOpacity style={[styles.avatar_container]} onPress={() => this._onAction('owner')}>
                    <Image source={{uri: user.avatar}} style={[styles.avatar, styles.bg_wred, styles.border_white]}/>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    _renderGallery = (galleryList) => {

        if (galleryList.length == 0) return null

        if (galleryList[0].ftype == 1) {
            if (galleryList[0].fpath.indexOf('http') == -1) return null;

            return (
                <TouchableOpacity style={[styles.mt_10]} onPress={() => this.setState({
                    vpreview: true,
                    video: galleryList[0].fpath,
                })}>
                    <Image source={{uri: galleryList[0].fpath + '?x-oss-process=video/snapshot,t_10000,m_fast'}} style={[styles.video_cover]} onError={(e) => {}}/>
                    <Text style={[styles.icon, styles.white_label, styles.video_icon, styles.lg40_label]}>{iconMap('bofangtubiao')}</Text>
                </TouchableOpacity>
            )
        }

        if (galleryList.length == 1) {
            return (
                <TouchableOpacity style={[styles.mt_10]} onPress={() => this._onPreview(galleryList, 0)}>
                    <Image source={{uri: galleryList[0].fpath}} style={[styles.pic1_cover]} onError={(e) => {}}/>
                </TouchableOpacity>
            )
        }

        if (galleryList.length <= 4) {
            return (
                <View style={[styles.row, styles.f_wrap, styles.jc_sb]}>
                    {galleryList.map((gallery, index) => {
                        return (
                            <TouchableOpacity style={[styles.mt_10]} onPress={() => this._onPreview(galleryList, index)}>
                                <Image source={{uri: gallery.fpath}} style={[styles.pic2_cover]} onError={(e) => {}}/>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                
            )
        }

        return (
            <View style={[styles.row, styles.f_wrap, styles.jc_sb]}>
                {galleryList.map((gallery, index) => {
                    return (
                        <TouchableOpacity style={[styles.mt_10]} onPress={() => this._onPreview(galleryList, index)}>
                            <Image source={{uri: gallery.fpath}} style={[styles.pic3_cover]} onError={(e) => {}}/>
                        </TouchableOpacity>
                    )
                })}
            </View>
            
        )

    }

    _renderItem = (item) => {
        const msg = item.item

        return (
            <View style={[styles.m_15, styles.border_bt, styles.pb_10, styles.row, styles.ai_fs]}>
                <TouchableOpacity>
                    <Image source={{uri: msg.avatar}} style={[styles.avatar_small, styles.bg_wred]}/>
                </TouchableOpacity>
                <View style={[styles.info, styles.ml_10]}>
                    <Text>{msg.nickname}</Text>
                    <Text style={[styles.mt_10]}>{msg.content}</Text>
                    {this._renderGallery(msg.galleryList)}
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                        <Text style={[styles.sm_label, styles.tip_label]}>{msg.getTime}</Text>
                        <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => this._onAction('praise', {index: item.index})}>
                            <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap(msg.isLike ? 'dianzan1' : 'dianzan')}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}> 点赞</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.p_3, styles.row, styles.bg_f7f, styles.mt_10]}>
                        <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('dianzan')}</Text>
                        <Text style={[styles.tip_label, styles.sm_label]}> {msg.names.join(';')}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const {preview, preview_index, preview_imgs, vpreview, video} = this.state

        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />

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
        width: theme.window.width,
        height: theme.window.width * 0.62,
    },
    avatar_container: {
        marginRight: 20,
        marginTop: -35,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    info: {
        width: theme.window.width - 80,
    },
    video_cover: {
        width: 160,
        height: 90,
    },
    video_icon: {
        position: 'absolute',
        top: 25,
        left: 60,
    },
    pic1_cover: {
        width: 160,
        height: 90,
    },
    pic2_cover: {
        width: (theme.window.width - 90) / 2,
        height: (theme.window.width - 90) / 2,
    },
    pic3_cover: {
        width: (theme.window.width - 90) / 3,
        height: (theme.window.width - 90) / 3,
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
});

export const LayoutComponent = Wall;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        bg: state.meet.bg,

        wall: state.meet.wall,
	};
}