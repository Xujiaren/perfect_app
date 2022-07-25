//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

import iconMap from '../../../config/font'
import theme from '../../../config/theme'

// create a component
class Video extends Component {

    static navigationOptions = {
        title:'视频详情页',
        headerRight: <View/>,
    };

    videos = ['', '', '']

    render() {
        return (
            <View style={[styles.container, styles.bg_white]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.p_15]}
                >
                    <View style={[styles.cover, styles.bg_sred]}/>
                    <View style={[styles.mt_15, styles.pb_15, styles.border_bt]}>
                        <Text style={[styles.lg_label]}>2020年瑞士研讨会</Text>
                        <Text style={[styles.sm_label, styles.gray_label, styles.lh20_label]}>瑞士联邦（德语：Schweizerische Eidgenossenschaft，法语：Confédération suisse，意大利语：Confederazione Svizzera，罗曼什语：Confederaziun svizra），简称“瑞士”，是中欧国家之一，全国划分为26个州。瑞士北邻德国，西邻法国，南邻意大利，东邻奥地利和列支敦士登。全境以高原和山地为主，有“欧洲屋脊”之称。伯尔尼是联邦政府的所在地。</Text>
                        <View style={[styles.mt_15, styles.row, styles.ai_ct, styles.jc_sb]}>
                            <View style={[styles.row]}>
                                <Text style={[styles.icon, styles.tip_label]}>{iconMap('zhuanti-bofang')}</Text>
                                <Text style={[styles.tip_label, styles.sm_label]}> 2332</Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={[styles.icon, styles.tip_label]}>{iconMap('dianzan')}</Text>
                                <Text style={[styles.tip_label, styles.sm_label]}> 559</Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={[styles.icon, styles.tip_label]}>{iconMap('fenxiang1')}</Text>
                                <Text style={[styles.tip_label, styles.sm_label]}> 559</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.mt_20]}>
                        <Text style={[styles.lg_label, styles.mb_15]}>推荐</Text>
                        {this.videos.map((video, index) => {
                            return (
                                <TouchableOpacity style={[styles.row, styles.mb_15]}>
                                    <View style={[styles.thumb, styles.bg_sred]}/>
                                    <View style={[styles.info, styles.ml_10, styles.jc_sb]}>
                                        <Text>在瑞士的第一天行程</Text>
                                        <View style={[styles.row, styles.ai_ct]}>
                                            <View style={[styles.col_1, styles.row]}>
                                                <Text style={[styles.icon, styles.tip_label]}>{iconMap('zhuanti-bofang')}</Text>
                                                <Text style={[styles.tip_label, styles.sm_label]}> 2332播放</Text>
                                            </View>
                                            <View style={[styles.col_1, styles.row]}>
                                                <Text style={[styles.icon, styles.tip_label]}>{iconMap('dianzan')}</Text>
                                                <Text style={[styles.tip_label, styles.sm_label]}> 559</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
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
    thumb: {
        width: 150,
        height: 80,
    },
    info: {
        width: theme.window.width - 190,
        height: 80,
    }
});

export const LayoutComponent = Video;

export function mapStateToProps(state) {
	return {
        
	};
}