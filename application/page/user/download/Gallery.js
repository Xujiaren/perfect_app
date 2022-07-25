//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, DeviceEventEmitter } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import * as WeChat from 'react-native-wechat-lib';
import * as Download from '../../../util/download'
import ViewShot from 'react-native-view-shot';
import theme from '../../../config/theme';
import asset from '../../../config/asset';
import iconMap from '../../../config/font'
import CameraRoll from '@react-native-community/cameraroll';
const iw = (theme.window.width - 45) / 2

// create a component
class Gallery extends Component {

    static navigationOptions = ({ navigation }) => {
        const ftype = navigation.getParam('ftype', 2)
        return {
            title: ftype == 1 ? '视频' : '图集',
            headerRight: <View />,
        }
    }

    downId = this.props.navigation.getParam('downId', 0)
    name = this.props.navigation.getParam('name', '')
    content = this.props.navigation.getParam('content', '')
    imgUrl = this.props.navigation.getParam('imgUrl', '')
    items = this.props.navigation.getParam('galleryList', [])
    codeType = this.props.navigation.getParam('codeType', 0)
    codeUrl = this.props.navigation.getParam('codeUrl', '')
    state = {
        isVideo: this.props.navigation.getParam('ftype', 2) == 1,
        canShare: this.props.navigation.getParam('canShare', 1),
        index: 0,
        like: this.props.navigation.getParam('like', false),
        praise: this.props.navigation.getParam('praise', 0),
        hit: this.props.navigation.getParam('hit', 0),
        hs: Array(this.items.length).fill(0),
        preview: false,
        preview_index: 0,
        preview_img: [],
        preview_s: false,
        downstatus: 0,
        share: false,
        codeImg:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1656035822581.png',
    }

    componentDidMount() {

        this.items.map((item, index) => {
            Image.getSize(item.fpath + (this.state.isVideo ? '?x-oss-process=video/snapshot,t_10000,m_fast' : ''), (w, h) => {
                let hs = this.state.hs
                hs[index] = h / w

                this.setState({
                    hs: hs
                })
            })
        })

        this._getCodeImg();
        setTimeout(() => this.setState({ refresh: true }), 300)
    }
    _getCodeImg=()=>{
        const { actions } = this.props;
        actions.user.invitecode({
            resolved: (data) => {
                this.setState({
                    codeImg: data,
                });
            },
            rejected: (msg) => {
            },
        });
    }
    _onPreview = (index) => {
        let images = [];
        this.items.map((gallery, i) => {
            images.push({
                url: gallery.fpath + (this.state.isVideo ? '?x-oss-process=video/snapshot,t_10000,m_fast' : ''),
                props: {
                    index: i,
                }
            })
        })

        this.setState({
            preview: true,
            preview_index: index,
            index: index,
            preview_img: images,
        })
        setTimeout(() => {
            this.setState({
                preview_s: true
            })
        }, 800);
    }

    _onAction = (action, args) => {
        const { actions } = this.props

        let like = this.state.like
        let praise = this.state.praise
        let hit = this.state.hit

        if (action == 'like') {
            if (this.items[args.index].like) {
                like = false
                this.items[args.index].likeNum--
                this.items[args.index].like = false
                actions.download.removeLikes({
                    gallery_id: this.items[args.index].galleryId,
                    ctype: 56,
                    resolved: (data) => {

                    },
                    rejected: (msg) => {

                    }
                })
            } else {
                like = true
                this.items[args.index].likeNum++
                this.items[args.index].like = true
                actions.download.likes({
                    gallery_id: this.items[args.index].galleryId,
                    ctype: 56,
                    resolved: (data) => {

                    },
                    rejected: (msg) => {

                    }
                })
            }

            this.setState({
                like: like,
                praise: praise,
            })

        } else if (action == 'download') {
            this.items[args.index].downNum++
            this.setState({
                downstatus: 1
            })
            actions.download.download({
                down_id: this.downId,
                galleryId: this.items[args.index].galleryId,
                resolved: (data) => {
                    const item = this.items[args.index]
                    if (!this.state.Video && this.codeType != 0) {
                        this.refs.viewShot.capture().then(uri => {
                            CameraRoll.saveToCameraRoll(uri).then(result => {
                                this.setState({
                                    tips: false,
                                    downstatus: 0
                                }, () => {
                                    alert('下载完成')
                                });
                            }).catch(error => {
                                alert('下载失败')
                            });
                        });
                    } else {
                        Download.DownloadMedia(item.fpath, this.state.isVideo).then(res => {

                        }).catch(err => {

                        })
                        if (this.state.isVideo) {
                            setTimeout(() => {
                                this.setState({
                                    downstatus: 0
                                }, () => {
                                    alert('下载完成')
                                })
                            }, 5000);
                        } else {
                            setTimeout(() => {
                                this.setState({
                                    downstatus: 0
                                }, () => {
                                    alert('下载完成')
                                })
                            }, 2000);
                        }
                    }

                },
                rejected: (msg) => {

                }
            })


        } else if (action == 'downloadAll') {
            this.items[args.index].downNum++
            this.setState({
                downstatus: 1
            })
            actions.download.download({
                down_id: this.downId,
                galleryId: this.items[args.index].galleryId,
                resolved: (data) => {
                    this.items.map((item, index) => {
                        Download.DownloadMedia(item.fpath, this.state.isVideo).then(res => {

                        }).catch(err => {

                        })
                    })
                    if (this.state.isVideo) {
                        setTimeout(() => {
                            this.setState({
                                downstatus: 0
                            }, () => {
                                alert('下载完成')
                            })
                        }, 5000 * this.items.length);
                    } else {
                        setTimeout(() => {
                            this.setState({
                                downstatus: 0
                            }, () => {
                                alert('下载完成')
                            })
                        }, 2000 * this.items.length);
                    }

                },
                rejected: (msg) => {

                }
            })


        }
    }

    _renderItem = (item) => {
        const { hs } = this.state
        const left = item.i % 2 == 0
        const media = item.item
        return (
            <TouchableOpacity style={[styles.item, styles.mb_10, left && styles.mr_15]} onPress={() => this._onPreview(item.i)}>
                <Image source={{ uri: media.fpath + (this.state.isVideo ? '?x-oss-process=video/snapshot,t_10000,m_fast' : '') }} style={[{ width: iw, height: hs[item.i] * iw }, styles.bg_wred, styles.circle_10]} resizeMode='contain' />
                <View style={[styles.p_10, styles.bg_white]}>
                    <Text style={[styles.gray_label, styles.lh20_label]}>{media.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _onPreviewChange = (index) => {
        this.setState({
            index: index,
        })
    }
    shares = (val) => {
        WeChat.isWXAppInstalled().then((installed) => {
            if (installed) {
                WeChat.shareMiniProgram({
                    title: val.title,
                    description: val.title,
                    thumbImageUrl: val.img ? val.img : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg',
                    userName: "gh_7bd862c3897e",
                    webpageUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.perfectapp',
                    path: val.path,
                    withShareTicket: 'true',
                    scene: 0,
                }).then((onFulfilled, onRejected) => {

                }).catch(err => {
                    console.log(err)
                })

            }
        });

    }
    _renderImage = (props) => {
        const { isVideo, index, codeType, codeUrl,codeImg } = this.state
        if (index !== props.index) return null

        return (
            <View>
                {isVideo ?
                    <Video
                        style={{ width: theme.window.width, height: theme.window.width * 0.5625 }}
                        source={{ uri: props.source.uri.replace('?x-oss-process=video/snapshot,t_10000,m_fast', '') }}
                        paused={false}
                    />
                    :
                    <View style={[{ height: theme.window.height * 0.626, marginTop: theme.window.height * 0.05 }]}>
                        {
                            this.codeType == 2 || this.codeType == 1 ?
                                <View style={[{ position: 'relative' }]}>
                                    <Image {...props} style={[{ height: theme.window.height * 0.626 }]} resizeMode='contain' />
                                    {
                                        !isVideo && this.codeType == 2 ?
                                            <Image source={{ uri: codeImg }} style={[{ height: theme.window.height * 0.1, width: theme.window.height * 0.1, position: 'absolute', right: 55, bottom: 14, zIndex: 9999 }]} resizeMode='contain' />
                                            : null
                                    }
                                    {
                                        !isVideo && this.codeType == 1 ?
                                            <Image source={{ uri: codeUrl }} style={[{ height: theme.window.height * 0.1, width: theme.window.height * 0.1, position: 'absolute', right: 55, bottom: 14, zIndex: 9999 }]} resizeMode='contain' />
                                            : null
                                    }
                                </View>
                                :
                                <Image {...props} style={[{ height: theme.window.height * 0.626 }]} resizeMode='contain' />
                        }

                    </View>
                }
                <View style={[styles.p_15]}>
                    <Text style={[styles.white_label]}>{this.content}</Text>
                </View>
            </View>
        )
    }

    _renderPreviewFooter = (currentIndex) => {
        const { like, praise, hit, canShare, isVideo, share } = this.state
        let index = currentIndex
        if (currentIndex === -1) {
            index = 0
        }
        let ftp = 2
        if (isVideo) {
            ftp = 1
        }
        return (
            <View style={[styles.p_20, styles.row, { width: theme.window.width - 30 }, styles.ai_ct, styles.jc_sb]}>
                <View style={[styles.row, styles.ai_ct]}>
                    <TouchableOpacity style={[styles.ai_ct]} onPress={() => this._onAction('like', { index: index })}>
                        <Text style={[styles.icon, styles.white_label]}>{iconMap(this.items[index].like ? 'dianzan1' : 'dianzan')}</Text>
                        <Text style={[styles.white_label, styles.sm_label, styles.mt_5]}>{this.items[index].likeNum < 0 ? 0 : this.items[index].likeNum}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ai_ct, styles.ml_25]} onPress={() => this._onAction('download', { index: index })}>
                        <Text style={[styles.icon, styles.white_label]}>{iconMap('xiazaitu')}</Text>
                        <Text style={[styles.white_label, styles.sm_label, styles.mt_5]}>{this.items[index].downNum}</Text>
                    </TouchableOpacity>
                    {canShare == 1 ?
                        <TouchableOpacity style={[styles.ai_ct, styles.ml_25]} onPress={() => {
                            // this.setState({
                            //     preview: false,
                            //     preview_s: true
                            // }, () => {
                            //     DeviceEventEmitter.emit('share', { title: this.name, img: this.imgUrl, path: '/comPages/pages/index/atlasWatch?downId=' + this.downId + '&ftype=' + ftp + '&index=' + index })
                            // })
                            let lst = { title: this.name, img: this.imgUrl, path: '/comPages/pages/index/atlasWatch?downId=' + this.downId + '&ftype=' + ftp + '&index=' + index }
                            this.shares(lst)
                        }}>
                            <Text style={[styles.icon, styles.white_label]}>{iconMap('fenxiang1')}</Text>
                        </TouchableOpacity>
                        : null}
                </View>
                {
                    (this.codeType == 1||this.codeType == 2)&&!isVideo ?
                        <TouchableOpacity style={[styles.p_10, styles.pl_20, styles.pr_20, styles.circle_20, styles.bg_sred]} onPress={() => this._onAction('download', { index: index })}>
                            <Text style={[styles.white_label]}> {'  '+'保存图片'+'  '} </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.p_10, styles.pl_20, styles.pr_20, styles.circle_20, styles.bg_sred]} onPress={() => this._onAction('downloadAll', { index: index })}>
                            <Text style={[styles.white_label]}>一键保存所有</Text>
                        </TouchableOpacity>
                }

            </View>
        )
    }

    render() {
        const { refresh, preview, preview_index, preview_img, downstatus, index, isVideo, preview_s,codeImg } = this.state
        if (!refresh) return null

        return (
            <View style={[styles.container]}>
                <MasonryList
                    contentContainerStyle={styles.p_15}
                    data={this.items}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderItem}
                />
                {
                    preview_s ?
                        <ViewShot style={[{ padding: 0 }]} ref='viewShot' options={{ format: 'png', quality: 0.1, result: Platform.OS === 'ios' ? 'tmpfile' : 'tmpfile' }}>
                            <View style={[{ position: 'relative' ,padding:0}]}>
                                <Image source={{ uri: preview_img[index].url }} style={[{ height: theme.window.height * 0.626 }]} resizeMode='contain' />
                                {
                                    !isVideo && this.codeType == 2 ?
                                        <Image source={{ uri: codeImg }} style={[{ height: theme.window.height * 0.1, width: theme.window.height * 0.1, position: 'absolute', right: 55, bottom: 14, zIndex: 9999 }]} resizeMode='contain' />
                                        : null
                                }
                                {
                                    !isVideo && this.codeType == 1 ?
                                        <Image source={{ uri: this.codeUrl }} style={[{ height: theme.window.height * 0.1, width: theme.window.height * 0.1, position: 'absolute', right: 55, bottom: 14, zIndex: 9999 }]} resizeMode='contain' />
                                        : null
                                }
                            </View>
                        </ViewShot>
                        : null
                }

                <Modal visible={preview} transparent={true} onRequestClose={() => {
                    this.setState({
                        preview: false,
                        preview_s: false
                    })
                }}>
                    {
                        downstatus == 1 ?
                            <View style={[styles.hud_load]}>
                                <Text style={styles.hubLabel}>下载中...</Text>
                            </View>
                            : null
                    }

                    <ImageViewer imageUrls={preview_img} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                            preview_s: false
                        });
                    }} renderImage={this._renderImage} renderFooter={this._renderPreviewFooter} onChange={this._onPreviewChange} />
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    item: {
        width: '95%',
    },
    hud_load: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 4,
        width: 80,
        height: 40,
        position: 'absolute',
        top: theme.window.height * 0.48,
        left: theme.window.width * 0.42,
        zIndex: 99999
    },
    hubLabel: {
        textAlign: 'center',
        fontSize: 12,
        color: 'white',
    },
});

export const LayoutComponent = Gallery;

export function mapStateToProps(state) {
    return {

    };
}