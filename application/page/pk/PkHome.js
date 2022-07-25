//import liraries
import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import asset from '../../config/asset';

// create a component
class PkHome extends Component {

    static navigationOptions = {
        header:null,
    };

    componentDidMount() {
        const {actions} = this.props;
        actions.user.user();
        actions.pker.account();
    }

    render() {
        const {navigation, user, account} = this.props;

        return (
            <ImageBackground style={styles.container} source={asset.pk.home_bg}>
                <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.mt_40, styles.p_20]}>
                    <View style={[styles.row, styles.ai_ct]}>
                        <Image style={[styles.avatar]} source={{uri: user.avatar}}/>
                        <View style={[styles.ml_10]}>
                            <Text style={[styles.white_label]}>{user.nickname}</Text>
                            <Text style={[styles.sgray_label, styles.sm_label, styles.mt_5]}>{account.level ? account.level.levelName : ''}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('GrowthEquity',{integral:user.integral,prestige:user.prestige,nowLevel:user.level,avatar:user.avatar})}>
                        <ImageBackground source={asset.pk.point_input} style={[styles.point, styles.ai_ct, styles.jc_ct]}>
                            <Text style={[styles.white_label]}>{user.integral}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                <View style={[styles.row, styles.jc_sb, styles.mt_40]}>
                    <TouchableOpacity onPress={() => navigation.navigate('PkRank')}>
                        <Image source={asset.pk.home_rank} style={[styles.home_rank]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('PkQuestion')}>
                        <Image source={asset.pk.home_know} style={[styles.home_know]}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.welcome, styles.row, styles.pb_25, styles.ai_fs, styles.jc_ct]}>
                    <TouchableOpacity onPress={() => navigation.navigate('PkEntry')}>
                        <Image source={asset.pk.home_pk} style={[styles.home_pk]}/>
                    </TouchableOpacity>
                    <View style={[styles.ml_15]}>
                        <TouchableOpacity onPress={() => navigation.navigate('PkFriend')}>
                            <Image source={asset.pk.home_friend} style={[styles.home_friend, styles.mb_10]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('PkSpecialChannel')}>
                            <Image source={asset.pk.home_special} style={[styles.home_special]}/>
                        </TouchableOpacity>
                    </View>
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
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    point: {
        width: theme.window.width * 0.27,
        height: theme.window.width * 0.27 * 0.32,
    },
    welcome: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    home_rank: {
        width: 40,
        height: 160,
    },
    home_know: {
        width: 40,
        height: 160,
    },
    home_pk: {
        width: theme.window.width * 0.45,
        height: theme.window.width * 0.45 * 1.48,
    },
    home_friend: {
        width: (theme.window.width - 60) / 2,
        height: (theme.window.width - 60) * 0.76 / 2,
    },
    home_special: {
        width: (theme.window.width - 60) / 2,
        height: (theme.window.width - 60) * 0.76 / 2,
    }
});

export const LayoutComponent = PkHome;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        account: state.pker.account,
	};
}