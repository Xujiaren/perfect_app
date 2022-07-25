//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../config/theme';
import asset from '../../config/asset';

// create a component
class PkEntry extends Component {

    static navigationOptions = {
        header:null,
    };

    constructor(props) {
        super(props);

        this.state = {
            pwidth: 0,
        }
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.pker.config();
        actions.pker.account();
        actions.user.user();
    }

    render() {
        const {navigation, config, account, user} = this.props;
        const {pwidth} = this.state;

        let powidth = 0;
        if (account.level && (account.level.endPoint > account.level.beginPoint)) {
            powidth = parseInt(((account.score - account.level.beginPoint) / (account.level.endPoint - account.level.beginPoint)) * pwidth);
        }

        return (
            <ImageBackground style={[styles.p_20, styles.container]} source={asset.pk_bg} imageStyle={{ resizeMode: 'repeat' }}>
                <View style={[styles.row, styles.ai_ct, styles.mb_25]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={asset.pk.back} style={[styles.back]}/>
                    </TouchableOpacity>

                    <Image style={[styles.avatar_s, styles.ml_10]} source={{uri: user.avatar}}/>

                    <TouchableOpacity style={[styles.ml_10]} onPress={() => navigation.navigate('GrowthEquity',{integral:user.integral,prestige:user.prestige,nowLevel:user.level,avatar:user.avatar})}>
                        <ImageBackground source={asset.pk.point_input} style={[styles.point_input, styles.ai_ct, styles.jc_ct]}>
                            <Text style={[styles.white_label]}>{user.integral}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={[styles.stat, styles.mt_50]}>
                        <View style={[styles.ai_ct]}>
                            <View style={[styles.pk_time, styles.p_20]}>
                                <Text style={[styles.white_label]}>赛季时间：{config.pk_begin}-{config.pk_end}</Text>
                            </View>
                            <View style={[styles.mt_15, styles.ai_ct]}>
                                <Image source={asset.pk.level[account.level ? account.levelId : "1"]} style={[styles.level]}/>
                                <Text style={[styles.white_label, styles.lg24_label, styles.mt_20]}>{account.level ? account.level.levelName : ''}</Text>
                            </View>
                        </View>
                        <View style={[styles.p_15, styles.mt_30, styles.row]}>
                            <View style={[styles.col_1, styles.ai_ct]}>
                                <Text style={[styles.white_label]}>{account.level ? account.level.levelName : ''}</Text>
                            </View>
                            <View style={[styles.col_6]}>
                                <View style={[styles.progress]} onLayout={(e) => {
                                    this.setState({
                                        pwidth: e.nativeEvent.layout.width,
                                    })
                                }}>
                                    <LinearGradient colors={['#FFCE62', '#FF9F6D']} style={[styles.progress_on, {width: powidth}]} start={{x: 0, y: 0}} end={{x:1, y:0}}/>
                                </View>
                                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                                    <Text style={[styles.white_label]}>当前：{account.score}学分</Text>
                                    <Text style={[styles.tip_label]}>还差{account.level ? account.level.endPoint - account.score : 0}升级</Text>
                                </View>
                            </View>
                            <View style={[styles.col_1, , styles.ai_ct]}>
                                <Text style={[styles.white_label]}>{account.nextLevel ? account.nextLevel.levelName : ''}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.head, styles.ai_ct]}>
                        <Image source={asset.pk.head.pk} style={[styles.friend]}/>
                    </View>
                </ScrollView>
                <View style={[styles.tool, styles.row, styles.ai_ct, styles.jc_sb, styles.mb_25, styles.p_20]}>
                    <TouchableOpacity onPress={() => navigation.navigate('PkTeam', {mode: 0})}>
                        <Image source={asset.pk.entry_begin} style={[styles.obtn]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('PkTeam', {mode: 1})}>
                        <Image source={asset.pk.entry_team} style={[styles.obtn]}/>
                    </TouchableOpacity>
                </View>
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
    point: {
        width: 24,
        height: 24,
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
    stat: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
    },
    head: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    friend: {
        width: theme.window.width - 80,
        height: (theme.window.width - 80) * 0.24,
    },
    pk_time: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    level: {
        width: 107,
        height: 132,
    },
    progress: {
        height: 16,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        overflow: 'hidden'
    },
    progress_on: {
        height: 14,
        borderRadius: 20,
    },
    tool: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    obtn: {
        width: 164,
        height: 80
    }
});

export const LayoutComponent = PkEntry;

export function mapStateToProps(state) {
	return {
        config: state.pker.config,
        account: state.pker.account,
        user: state.user.user,
	};
}