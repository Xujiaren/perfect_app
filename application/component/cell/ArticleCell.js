import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import asset from '../../config/asset';
import {dateDiff,learnNum} from '../../util/common'

class ArticleCell extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
        }
    }

    render() {
        const {article, onPress} = this.props;
        const {width} = this.state;

        if (article.ttype == 0) {
            return (
                <TouchableOpacity style={[styles.border_bt, styles.mt_10, styles.mb_10, styles.pb_10]} onPress={() => onPress && onPress(article)} onLayout={(evt) => {
                    this.setState({
                        width: evt.nativeEvent.layout.width
                    })
                }}>
                    <View style={[styles.over_h, styles.circle_5]}>
                        {
                            article.gallery.length > 0 ?
                            <Image  style={[styles.grap_imgs_cover, {width: width}]} source={{uri:article.gallery[0].fpath}}/>
                            :
                            <Image  style={[styles.grap_imgs_cover, {width: width}]} source={{uri: article.articleImg}}/>
                        }
                        <View style={[styles.article_title_0, styles.p_8]}>
                            <Text style={[styles.white_label]} numberOfLines={1}>{article.title}</Text>
                        </View>
                    </View>
                    <View style={[styles.fd_r,styles.ai_ct,styles.mt_10]}>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Image source={asset.evals_icon}  style={styles.item_head_cover} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(article.comment)}</Text>
                        </View>
                        <View style={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mr_10]}>
                            <Image source={asset.view_icon} style={[styles.view_icon]} />
                            <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_5]}>{article.hit}</Text>
                        </View>
                        <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                            <Image source={{uri:asset.vant_on}}  style={styles.item_head_covers} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(article.likeNum)}</Text>
                        </View>
                        <Text style={[styles.sm_label, styles.tip_label ,styles.pl_10]}>{dateDiff(article.pubTime)}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (article.ttype == 1) {
            return (
                <TouchableOpacity style={[styles.border_bt, styles.mt_10, styles.mb_10, styles.pb_10]} onPress={() => onPress && onPress(article)} onLayout={(evt) => {
                    this.setState({
                        width: evt.nativeEvent.layout.width
                    })
                }}>
                    <View style={[styles.pb_5]}>
                        <Text style={[styles.default_label, styles.lh20_label]} numberOfLines={2}>{article.title}</Text>
                        <View style={[styles.fd_r, styles.jc_sb, styles.mt_10]}>
                        {
                            article.gallery && article.gallery.map((gallery,i)=>{
                                return (
                                    <Image style={[styles.grap_img_cover, {width: (width - 20) / 3}]}  key={'article_img_' + gallery.galleryId} source={{uri: gallery.fpath}}/>
                                );
                            })
                        }
                        </View>
                    </View>
                    <View style={[styles.fd_r,styles.ai_ct,styles.mt_10]}>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <Image source={asset.evals_icon}  style={styles.item_head_cover} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(article.comment)}</Text>
                        </View>
                        <View style={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mr_10]}>
                            <Image source={asset.view_icon} style={[styles.view_icon]} />
                            <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_5]}>{article.hit}</Text>
                        </View>
                        <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                            <Image source={{uri:asset.vant_on}}  style={styles.item_head_covers} />
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(article.likeNum)}</Text>
                        </View>
                        <Text style={[styles.sm_label, styles.tip_label ,styles.pl_10]}>{dateDiff(article.pubTime)}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else if (article.ttype == 2) {
            return (
                <TouchableOpacity style={[styles.border_bt, styles.mt_10, styles.mb_10, styles.fd_r, styles.jc_sb, styles.pb_10]} onPress={() => onPress && onPress(article)} onLayout={(evt) => {
                    this.setState({
                        width: evt.nativeEvent.layout.width
                    })
                }}>
                    <View style={[styles.article_type_2, styles.jc_sb, {width: width - 110}]}>
                        <Text style={[styles.default_label, styles.lh20_label]} numberOfLines={2}>{article.title}</Text>
                        <View style={[styles.fd_r,styles.ai_ct,styles.mt_10]}>
                            <View style={[styles.fd_r,styles.ai_ct]}>
                                <Image source={asset.evals_icon}  style={styles.item_head_cover} />
                                <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(article.comment)}</Text>
                            </View>
                            <View style={[styles.view_play ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mr_10]}>
                                <Image source={asset.view_icon} style={[styles.view_icon]} />
                                <Text style={[styles.sm_label ,styles.gray_label ,styles.ml_5]}>{article.hit}</Text>
                            </View>
                            <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                                <Image source={asset.collect_icon}  style={styles.item_head_cover} />
                                <Text style={[styles.sm_label ,styles.c33_label ,styles.ml_5]}>{learnNum(article.likeNum)}</Text>
                            </View>
                            <Text style={[styles.sm_label, styles.tip_label ,styles.pl_10]}>{dateDiff(article.pubTime)}</Text>
                        </View>
                    </View>
                    {
                        article.gallery && article.gallery.length  > 0 ? 
                        <Image  style={[styles.grap_per_img, styles.ml_10]} source={{uri:article.gallery[0].fpath}}/>
                        :
                        <Image style={[styles.grap_per_img, styles.ml_10]} source={{uri:article.articleImg}}/>
                    }
                    
                </TouchableOpacity>
            )
        }

        return null;
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    grap_imgs_cover:{
        height:130,
        backgroundColor:'#fafafa',
        borderRadius:5,
    },
    grap_img_cover:{
        height:58,
        backgroundColor:'#fafafa',
        borderRadius:5,
    },
    grap_per_img:{
        width:100,
        height:63,
        borderRadius:5,
        backgroundColor:'#fafafa',
    },
    article_type_2: {
        height: 63,
    },
    article_title_0: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    item_head_cover:{
        width:14,
        height:14,
    },
    item_head_covers:{
        width:12,
        height:12,
    },
    view_icon:{
        width:14,
        height:14,
    },
    view_play:{
        marginLeft:10
    }
});

export default ArticleCell;
