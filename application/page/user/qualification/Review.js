import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, Modal } from 'react-native'

import _ from 'lodash';
import * as WeChat from 'react-native-wechat-lib';
import ImageViewer from 'react-native-image-zoom-viewer';

import VodPlayer from '../../../component/vod/VodPlayer';
import HudView from '../../../component/HudView';

import * as Download from '../../../util/download';

import {config, asset, theme} from '../../../config';

class Review extends Component {

    static navigationOptions = ({navigation}) => {
        const article = navigation.getParam('sqd', {courseName: '精彩回顾'});
        const fullscreen = navigation.getParam('fullscreen', false);

		return {
            headerShown: !fullscreen,
            title: article.title,
            headerRight: <View/>,
		}
	};


    constructor(props){
        super(props);

        const {navigation} = this.props;

        this.article = navigation.getParam('sqd', {});

        this.state = {
            loaded: false,
            isLike:false,
            likeNum: 0,
            mediaId:'',
            isCollect:false,
            comment:[],
            gallery:[],
            duration:0,
            playUrl:'',

            preview: false,
            preview_index: 0,
            preview_imgs: [],
            shareType:false,
        }

        this._actions = this._actions.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);

        this._onPreview = this._onPreview.bind(this);
        this._toggleShare = this._toggleShare.bind();
    }

    componentWillReceiveProps(nextProps){

        const {article} = nextProps;

        if (article !== this.props.article) {

            this.article = article;

            this.setState({
                loaded: true,
                isLike:article.isLike,
                likeNum: article.likeNum,
                mediaId:article.mediaId,
                isCollect:article.isCollect,
                comment:article.comment,
                gallery:article.gallery,
            },()=>{
                if(article.mediaId != ''){
                    this._onPlay();
                }
            })
        }

    }

    componentDidMount(){
        const {actions} = this.props;

        actions.article.article(this.article.articleId);
    }


    _onPlay(){
        const {actions} = this.props;
        const {mediaId} = this.state;

        actions.course.verify({
            media_id: mediaId,
            resolved: (data) => {
                this.setState({
                    duration: data.duration,
                    playUrl: data.m38u,
                })
            },
            rejected: (res) => {
                
            },
        })
    }

    _toggleShare = (type) => {

        WeChat.shareWebpage({
            title: this.article.title,
            description: this.article.summary,
            thumbImageUrl:this.article.articleImg,
            webpageUrl: config.cUrl + '/event/share/news.html?id=' + this.article.articleId,
            scene:type
        }).then(data => {
            this.setState({
                shareType: false,
            }, () => {
                this.refs.hud.show('分享成功', 1);
            })
        }).catch(error => {
            
        })

    }

    _actions(type){

        const {actions} = this.props;
        let {isCollect,isLike,likeNum} = this.state;

        // 0 收藏  1分享 3点赞
        if(type === 0){

            if(isCollect){

                actions.user.aremovecollect({
                    content_id: this.article.articleId,
                    ctype:13,
                    resolved: (data) => {
   
                        this.setState({
                            isCollect: false,
                        })
                        this.refs.hud.show('取消成功', 1);
                    },
                    rejected: (msg) => {
        
                    },
                })

            } else {

                actions.user.acollect({
                    content_id: this.article.articleId,
                    ctype:13,
                    resolved: (data) => {
                        this.setState({
                            isCollect: true,
                        })
                        this.refs.hud.show('收藏成功', 1);
                    },
                    rejected: (msg) => {
        
                    },
                })
            }

        } else  if(type === 1){

            this.setState({
                shareType:true
            })

        } else if(type === 3){

            if (isLike) {
                actions.article.removelike({
                    article_id: this.article.articleId,
                    resolved: (data) => {
                        likeNum--;

                        this.setState({
                            likeNum: likeNum,
                            isLike: false
                        })
                    },
                    rejected: (msg) => {
        
                    },
                })
            } else {
                actions.article.like({
                    article_id: this.article.articleId,
                    resolved: (data) => {
                        likeNum++;

                        this.setState({
                            likeNum: likeNum,
                            isLike: true
                        })
                    },
                    rejected: (msg) => {
        
                    },
                })
            }

        }
    }


    _onPreview(index){
        const {gallery} = this.state;

        let images = [];
                    
        gallery.map((gey, i) => {
            images.push({
                url: gey.fpath,
            });
        });

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: images,
        });
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _onDefinition = (vals) => {
        const { actions, user } = this.props;
        const { mediaId } = this.state;
        actions.course.verify({
            media_id: mediaId,
            definition: vals,
            resolved: (data) => {
                this.setState({
                    playUrl: data.m38u,
                    definition: vals
                })
            }
        })
    }
    _renderHeader(){
        const {navigation} = this.props;
        const { playUrl,mediaId ,duration,likeNum,isLike,isCollect,gallery} = this.state; 

        return(
            <View style={[styles.mb_25]}>
                {
                    playUrl.length > 0 ?
                    <View>
                        <VodPlayer 
                            ref={e => { this.player = e; }}
                            source={{
                                cover: this.article.articleImg,
                                key: mediaId,
                                url: playUrl,
                                duration: duration,
                            }}
                            navigation={navigation}
                            onFullscreen={(full) => {
                                navigation.setParams({fullscreen:full})
                            }}
                            onDefin={(val) => {
                                this._onDefinition(val)
                            }}
                        />
                    </View>
                    :
                    <Image source={{uri:this.article.articleImg}} style={styles.articleImg} />
                }

                <View  style={[styles.wraphead ,styles.pl_20 ,styles.pr_20]}>
                    <View style={[styles.artdesc_tip]}>
                        <Text style={[styles.lg_label ,styles.c33_label ,styles.fw_label ,styles.title]}>{this.article.title}</Text>
                        <Text style={[styles.default_label ,styles.gray_label]}>{this.article.summary}</Text>
                        <View style={[styles.artdesc_date]}>
                            <Text style={[styles.tip_label ,styles.sm_label]}>发布时间：{this.article.pubTimeFt}</Text>
                            <TouchableOpacity style={[styles.artdesc_parse]} onPress={()=>this._actions(3)}>
                                <Image source={isLike ? asset.onpraise : asset.praise}  style={[styles.parse_cover]}/>
                                <Text style={[styles.sm_label,styles.tip_label,isLike&&styles.red_label]}>{likeNum}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.articons]}>
                        <View style={[styles.articon]}>
                            <Image source={asset.video_icon} style={[styles.icon]} />
                            <Text style={[styles.sm_label ,styles.gray_label]}>{this.article.hit}播放</Text>
                        </View>
                        <TouchableOpacity style={[styles.articon]} onClick={this._onCollect}
                            onPress={()=>this._actions(0)}
                        >
                            <Image source={isCollect ? asset.collected : asset.ct_icon} style={[styles.collect_icon]} />
                            <Text style={[styles.sm_label,styles.gray_label,isCollect&&styles.red_label]} >收藏</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.shareBtn,styles.fd_r,styles.ai_ct]}
                            onPress={()=>this._actions(1)}
                        >
                            <Image source={asset.share_icon} style={[styles.shart_icon]} />
                            <Text style={[styles.sm_label ,styles.gray_label]}>分享</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        )
    }
    _renderItem(item){
        const gallery = item.item;
        const index = item.index;
        const on = index % 2 === 0 ;

        return(
            <TouchableOpacity style={[styles.gallery_box]}
                onPress={()=>this._onPreview(index)}
            >
                <Image source={{uri:gallery.fpath}} style={[styles.gallery_img_r,on&&styles.gallery_img_l]} />
            </TouchableOpacity>
        )
    }


    render() {
        const {navigation} = this.props;
        const {gallery,preview,preview_imgs,preview_index,shareType} = this.state; 

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={gallery}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    numColumns={2}
                    ListHeaderComponent={this._renderHeader}
                />
                <Modal visible={preview} transparent={true} onRequestClose={() => {}}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
                        this.setState({
                            preview: false,
                        });
                    }} menuContext={{cancel: '取消', saveToLocal: '保存到本地'}} onSave={(url) => {
                        Download.DownloadMedia(url, false).then(res => {
                            
                        }).catch(err => {
                            
                        })
            
                        alert('下载成功')
                    }}/>
                </Modal>
                <Modal  visible={shareType} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={()=>this.setState({shareType:false})}></TouchableOpacity>
                    <View style={styles.wechatType}>
                        <View style={[styles.wechatIcons,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <TouchableOpacity style={[styles.item ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1 ]}
                                onPress={() => this._toggleShare(0)}
                            >
                                <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]}>
                                    <Image source={asset.wechat} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label ,styles.m_5]}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item  ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1]}
                                onPress={() => this._toggleShare(1)}
                            >
                                <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]} >
                                    <Image source={asset.friends} style={[styles.item_box]} />
                                </View>
                                <Text style={[styles.default_label ,styles.m_5]}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
    },
    articleImg:{
        width: theme.window.width,
        height: theme.window.width * 0.5625 
    },
    wrapHead:{
        paddingLeft:20,
        paddingRight:20,
        paddingTop:20,
        paddingBottom:10,
        marginBottom:15,
        borderBottomColor:'#F0F0F0',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    artdesc_tip:{
        marginTop:16,
        flexDirection:'column'
    },
    title:{
        marginBottom:10,
    },
    artdesc_date:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:5
    },
    artdesc_parse:{
        flexDirection:'row',
        alignItems:'center'
    },
    parse_cover:{
        width:13,
        height:13,
        marginRight:5,
    },
    articons:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:30,
    },
    articon:{
        flexDirection:'row',
        alignItems:'center'
    },
    icon:{
        width:16,
        height:16,
        marginRight:6
    },
    collect_icon:{
        width:14,
        height:14,
        marginRight:6,
    },
    shart_icon:{
        width:17,
        height:17,
        marginRight:6,
    },
    gallery_box:{
        width:theme.window.width / 2,
        height:92,
        marginBottom:12,
    },
    gallery_img_l:{
        width:(theme.window.width - 36) / 2 ,
        height:92,
        backgroundColor:'#fefefe',
        borderRadius:8,
        marginLeft:12, 
    },
    gallery_img_r:{
        width:(theme.window.width - 36) / 2 ,
        height:92,
        backgroundColor:'#fefefe',
        borderRadius:8,
        marginLeft:6,
    },
    share_icon:{
        width:20,
        height:20
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    
    wechatType:{
        position: 'absolute',
        bottom:0,
        left:0,
        width:'100%',
        height:120,
        borderRadius:5,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        backgroundColor:'#ffffff'
    },
    wechatIcons:{
        width:'100%',
        backgroundColor:'#ffffff',
        height:100
    },
    item_box:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#f5f5f5',
    },
})

export const LayoutComponent = Review;

export function mapStateToProps(state) {
	return {
        article: state.article.article,
	};
}
