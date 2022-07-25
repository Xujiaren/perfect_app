//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Image, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';

import asset from '../../config/asset'
import theme from '../../config/theme'
import iconMap from '../../config/font'

// create a component
class Forest extends Component {

    static navigationOptions = {
        title:'完美林',
        headerRight: <View/>,
    };

    userId = this.props.navigation.getParam('parent_id', 0)
    moments = []
    friends = []

    componentDidMount() {
        const {navigation} = this.props
        this.onRefresh()
        this.onFriend()

        navigation.navigate('ForestShop')
    }

    componentWillReceiveProps(nextProps) {
        const {friend} = nextProps
        if (friend !== this.props.friend && friend.items) {
            this.friends = friend.items
        }
    }
    
    onRefresh = () => {
        const {actions} = this.props

        actions.forest.init({
            parentId: this.userId,
            resolved: (data) => { 
            },
            rejected: (msg) => {
            }
        })

        actions.forest.index(this.userId)
    }

    onFriend = () => {
        const {actions} = this.props
        actions.forest.friend('active', 0)
    }

    render() {
        const {navigation} = this.props
        return (
            <View style={styles.container}>
                 <ScrollView
                    showsVerticalScrollIndicator={false}
                 >
                    <ImageBackground source={asset.forest.bg} style={[styles.bg, styles.ai_fs]}>
                        <View style={[styles.user, styles.p_5, styles.row, styles.ai_ct, styles.jc_sb]}>
                            <View style={[styles.row, styles.ai_ct]}>
                                <View style={[styles.avatar, styles.bg_sred]}/>
                                <View style={[styles.ml_10]}>
                                    <Text>昵称34233523</Text>
                                    <Text style={[styles.sm_label, styles.forest_green_label, styles.mt_5]}>9999点阳光</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[styles.bg_fgreen, styles.p_5, styles.pl_10, styles.pr_10, styles.circle_10, styles.ml_10]}>
                                <Text style={[styles.white_label]}>种树</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.exchange, styles.p_5, styles.pl_10, styles.pr_10]}>
                            <Text>兑换券 <Text style={[styles.forest_green_label]}>9999</Text></Text>
                        </View>
                        <View style={[styles.nav, styles.row, styles.ai_ct]}>
                            <TouchableOpacity style={[styles.ml_15]} onPress={() => navigation.navigate('ForestShop')}>
                                <Image source={asset.forest.nav.exchange} style={[styles.nav_icon]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ml_15]} onPress={() => navigation.navigate('ForestKnowledge')}>
                                <Image source={asset.forest.nav.knowledge} style={[styles.nav_icon]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ml_15]} onPress={() => navigation.navigate('ForestShop')}>
                                <Image source={asset.forest.nav.shop} style={[styles.nav_icon]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ml_15]} onPress={() => navigation.navigate('ForestAchieve')}>
                                <Image source={asset.forest.nav.achieve} style={[styles.nav_icon]}/>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    <View style={[styles.p_15, styles.bg_fa, styles.body]}>
                        <View>
                            <Text style={[styles.lg18_label]}>最新动态</Text>
                            <View style={[styles.bg_white, styles.mt_15, styles.circle_5]}>
                                <View style={[styles.p_15, styles.border_bt, styles.row, styles.ai_ct]}>
                                    <ImageBackground source={asset.forest.picon} style={[styles.picon, styles.ai_ct, styles.jc_ct]}>
                                        <Text style={[styles.forest_grown_label]}>140</Text>
                                    </ImageBackground>
                                    <View style={[styles.ml_10]}>
                                        <Text>今日共获得139点</Text>
                                        <View style={[styles.row, styles.ai_ct, styles.mt_5]}>
                                            <View style={[styles.bg_forest_yellow, styles.p_3, styles.pl_5, styles.pr_5, styles.circle_10]}>
                                                <Text style={[styles.sm9_label, styles.forest_grown_label]}>收取他人9点</Text>
                                            </View>
                                            <Image source={asset.forest.vs} style={[styles.vsicon, styles.ml_5, styles.mr_5]}/>
                                            <View style={[styles.bg_forest_blue, styles.p_3, styles.pl_5, styles.pr_5, styles.circle_10]}>
                                                <Text style={[styles.sm9_label, styles.forest_blue_label]}>被人收取20点</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {this.moments.map((moment, index) => {
                                    return (
                                        <View key={'moment_' + index} style={[styles.p_15, styles.border_bt, styles.row, styles.ai_ct, styles.jc_sb]}>
                                            <View style={[styles.row, styles.ai_ct]}>
                                                <View style={[styles.avatar, styles.bg_sred]}/>
                                                <Text style={[styles.ml_10]}>Mio 收取2点</Text>
                                            </View>
                                            <Text style={[styles.sm_label, styles.tip_label]}>2小时前</Text>
                                        </View>
                                    )
                                })}
                                <TouchableOpacity style={[styles.ai_ct, styles.p_15]}>
                                    <Text>查看更多动态</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.mt_15]}>
                            <Text style={[styles.lg18_label]}>好友</Text>
                            <View style={[styles.bg_white, styles.mt_15, styles.circle_5]}>
                                {this.moments.map((moment, index) => {
                                    return (
                                        <View key={'moment_' + index} style={[styles.p_15, styles.border_bt, styles.row, styles.ai_ct, styles.jc_sb]}>
                                            <View style={[styles.row, styles.ai_ct]}>
                                                <View style={[styles.index, styles.ai_ct]}>
                                                    <Text>{index + 1}</Text>
                                                </View>
                                                <View style={[styles.avatar, styles.bg_sred]}/>
                                                <View style={[styles.ml_10]}>
                                                    <Text>Mio 收取2点</Text>
                                                    <Text style={[styles.tip_label, styles.sm_label, styles.mt_5]}>获得2个证书</Text>
                                                </View>
                                            </View>
                                            <Text>2422点</Text>
                                        </View>
                                    )
                                })}
                                <TouchableOpacity style={[styles.ai_ct, styles.p_15]}>
                                    <Text>查看更多动态</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.mt_15]}>
                            <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                                <Text style={[styles.lg18_label]}>加好友种树</Text>
                                <TouchableOpacity style={[styles.row]}>
                                    <Text style={[styles.icon, styles.tip_label]}>{iconMap('shuaxin')}</Text>
                                    <Text style={[styles.tip_label]}> 换一换</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_15]}>
                                {this.friends.map((friend, index) => {
                                    return (
                                        <View style={[styles.bg_white, styles.p_15, styles.circle_5, styles.uitem, styles.ai_ct]} key={'friend_' + index}>
                                            <View style={[styles.avatar_u, styles.bg_sred]}/>
                                            <Text style={[styles.mt_10]}>WGL</Text>
                                            <Text style={[styles.tip_label, styles.sm_label, styles.mt_10]}>阳光数 234</Text>
                                            <TouchableOpacity style={[styles.mt_10, styles.p_3, styles.pl_10, styles.pr_10, styles.bg_fgreen, styles.circle_10]}>
                                                <Text style={[styles.white_label]}>邀请</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                                
                            </View>
                            <TouchableOpacity style={[styles.mt_15]}>
                                <Image source={asset.forest.invite} style={[styles.invite]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                 </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    bg: {
        width: theme.window.width,
        height: theme.window.width * 1.28,
    },
    body: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    user: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginTop: 20,
        paddingRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    exchange: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginTop: 20,
    },
    nav: {
        position: 'absolute',
        right: 30,
        bottom: 35,
    },
    nav_icon: {
        width: 35,
        height: 40,
    },
    picon: {
        width: 40,
        height: 40,
    },
    vsicon: {
        width: 10,
        height: 7,
    },
    index: {
        width: 30,
    },
    avatar_u: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    uitem: {
        width: '30%',
    },
    invite: {
        width: theme.window.width - 30,
        height: (theme.window.width - 30) * 0.295,
    }
});

export const LayoutComponent = Forest;

export function mapStateToProps(state) {
	return {
        friend: state.forest.friend,
	};
}