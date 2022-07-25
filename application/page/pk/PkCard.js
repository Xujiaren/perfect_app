//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-navigation-stack';

import theme from '../../config/theme';
import asset from '../../config/asset';

// create a component
class PkCard extends Component {

    static navigationOptions = {
        header:null,
    };

    render() {
        const {navigation} = this.props;

        return (
            <ImageBackground style={[styles.p_20, styles.container]} source={asset.pk_bg} imageStyle={{ resizeMode: 'repeat' }}>
                <View style={[styles.row, styles.ai_ct, styles.mb_25]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={asset.pk.back} style={[styles.back]}/>
                    </TouchableOpacity>

                    <View style={[styles.avatar_s, styles.ml_10]}></View>

                    <TouchableOpacity style={[styles.ml_10]}>
                        <ImageBackground source={asset.pk.point_input} style={[styles.point_input, styles.ai_ct, styles.jc_ct]}>
                            <Text style={[styles.white_label]}>120</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={[styles.user, styles.row, styles.p_15, styles.jc_sb, styles.ai_ct, styles.mt_25]}>
                        <View style={[styles.row, styles.ai_ct]}>
                            <View style={[styles.avatar]}/>
                            <View style={[styles.ml_10]}>
                                <Text style={[styles.white_label]}>木松子旭</Text>
                                <Text style={[styles.sgray_label, styles.sm_label, styles.mt_5]}>青铜 | 积分 3456</Text>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <Image source={asset.pk.card_share} style={[styles.card_share]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.user, styles.mt_10, styles.p_15]}>

                    </View>
                    <View style={[styles.user, styles.mt_10, styles.p_15, styles.row, styles.f_wrap]}>
                        <View style={[styles.item, styles.m_5]}>
                            <Text style={[styles.tip_label]}>比赛 <Text style={[styles.white_label]}>54%</Text></Text>
                        </View>
                        <View style={[styles.item, styles.m_5]}>
                            <Text style={[styles.tip_label]}>比赛 <Text style={[styles.white_label]}>54%</Text></Text>
                        </View>
                        <View style={[styles.item, styles.m_5]}>
                            <Text style={[styles.tip_label]}>比赛 <Text style={[styles.white_label]}>54%</Text></Text>
                        </View>
                        <View style={[styles.item, styles.m_5]}>
                            <Text style={[styles.tip_label]}>比赛 <Text style={[styles.white_label]}>54%</Text></Text>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        paddingTop: Header.HEIGHT,
    },
    back: {
        width: 32,
        height: 32,
    },
    point_input: {
        width: theme.window.width * 0.27,
        height: theme.window.width * 0.27 * 0.32,
    },
    avatar_s: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    user: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    card_share: {
        width: 64,
        height: 45,
    },
    item: {
        width: (theme.window.width - 90) / 2,
        backgroundColor: '#42669F',
        padding: 5,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1
    }
});

export const LayoutComponent = PkCard;

export function mapStateToProps(state) {
	return {
        
	};
}