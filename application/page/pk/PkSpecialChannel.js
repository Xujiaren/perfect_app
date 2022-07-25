//import liraries
import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { Header } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';

import HudView from '../../component/HudView';
import theme from '../../config/theme';
import asset from '../../config/asset';

// create a component
class PkSpecialChannel extends Component {

    static navigationOptions = {
        header:null,
    };

    constructor(props) {
        super(props);

        this.items = [];


        this.state = {
            buy: false,
            life: 1,
        }

        this._onLifeUp = this._onLifeUp.bind(this);
        this._onLifeDown = this._onLifeDown.bind(this);
        this._onBuyLife = this._onBuyLife.bind(this);

        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.user.user();
        actions.pker.config();
        actions.pker.account();
        actions.pker.match();
    }

    componentWillReceiveProps(nextProps) {
        const {match} = nextProps;
        if (match !== this.props.match) {
            this.items = match;
        }
    }

    _onLifeDown() {
        let life = this.state.life;

        if (life > 1) {
            life--;
        }

        this.setState({
            life: life,
        })
    }

    _onLifeUp() {
        const {config} = this.props;
        let life = this.state.life;

        if (life < parseInt(config.match_max_life)) {
            life++;
        }

        this.setState({
            life: life,
        })
    }

    _onBuyLife() {
        const {actions} = this.props;
        const {life} = this.state;
        actions.pker.matchlife({
            num: life,
            resolved: (data) => {
                this.refs.hud.show('购买成功', 1);
                actions.user.user();
                actions.pker.account();
            },
            rejected: (msg) => {
                this.refs.hud.show('购买失败', 1);
            }
        })
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const match = item.item;
        return (
            <TouchableOpacity style={[styles.mt_15]} onPress={() => navigation.navigate('PkSpecial', {match: match})}>
                <ImageBackground source={asset.pk.special_bg} style={[styles.special_container]}>
                    <View style={[styles.special]}>
                        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']} style={[styles.rule]} start={{x: 0, y: 0}} end={{x:1, y:0}}>
                            <Text style={[styles.white_label]}>活动规则</Text>
                        </LinearGradient>
                        <View style={[styles.special_title, styles.row, styles.jc_sb, styles.ai_ct]}>
                            <Text style={[styles.white_label]}>我的排名：{match.rank.rank > 0 ? match.rank.rank : '未上榜'}</Text>
                            <Text style={[styles.white_label]}>{match.beginTimeFt}-{match.endTimeFt}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    _renderEmpty() {
        return (
            <View style={[styles.ai_ct, styles.mt_40]}>
                <Image source={asset.pk.special_empty} style={[styles.empty]}/>
            </View>
        )
    }

    render() {
        const {navigation, user, account, config} = this.props;
        const {buy, life} = this.state;

        const enable = life * parseInt(config.life_integral) <= user.integral;

        return (
            <ImageBackground style={[styles.p_20, styles.container]} source={asset.pk_bg} imageStyle={{ resizeMode: 'repeat' }}>
                <View style={[styles.row, styles.ai_ct, styles.mb_10]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={asset.pk.back} style={[styles.back]}/>
                    </TouchableOpacity>

                    <Image style={[styles.avatar_s, styles.ml_10]} source={{uri: user.avatar}}/>

                    <TouchableOpacity style={[styles.ml_10]} onPress={() => this.setState({buy: true})}>
                        <ImageBackground source={asset.pk.life_input} style={[styles.point_input, styles.ai_ct, styles.jc_ct]}>
                            <Text style={[styles.white_label]}>{account.life}/{config.match_max_life}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._renderEmpty}
                />
                <Modal visible={buy} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=> this.setState({buy: false})}/>
                    <View style={[styles.life]}>
                        <ImageBackground source={asset.pk.life_box} style={[styles.life_box, styles.ai_ct, styles.p_20]}>
                            <Image source={asset.pk.tip.buylife} style={[styles.buylife]}/>
                            <View style={[styles.row, styles.ai_ct, styles.mt_25]}>
                                <Text style={[styles.white_label]}>当前学分：</Text>
                                <View style={[styles.ai_ct, styles.p_10]}>
                                    <View style={[styles.score, styles.p_5, styles.pl_20, styles.pr_10, styles.circle_5]}><Text style={[styles.white_label, styles.sm_label]}>{user.integral}</Text></View>
                                    <Image source={asset.pk.point} style={[styles.point]}/>
                                </View>
                            </View>
                            <View style={[styles.row, styles.ai_ct, styles.mt_15]}>
                                <Text style={[styles.white_label]}>生命值：</Text>
                                <View style={[styles.life_ctrl, styles.ai_ct, styles.jc_ct]}>
                                    <Text style={[styles.white_label]}>{life}</Text>
                                    <TouchableOpacity style={[styles.life_ctrl_l]} onPress={this._onLifeDown}>
                                        <Image source={asset.pk.life_down} style={[styles.life_cbtn]}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.life_ctrl_r]} onPress={this._onLifeUp}>
                                        <Image source={asset.pk.life_up} style={[styles.life_cbtn]}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={[styles.mt_30]}>合计：{life * parseInt(config.life_integral)}学分</Text>
                            <TouchableOpacity style={[styles.mt_20, !enable && styles.disabledContainer]} disabled={!enable} onPress={this._onBuyLife}>
                                <Image source={asset.pk.life_btn} style={[styles.life_btn]}/>
                            </TouchableOpacity>
                        </ImageBackground>
                        <TouchableOpacity style={[styles.close]} onPress={()=> this.setState({buy: false})}>
                            <Image source={asset.pk.review_close} style={[styles.life_close]}/>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <HudView ref={'hud'} />
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
        backgroundColor: '#3F5F95',
    },
    back: {
        width: 32,
        height: 32,
    },
    point_input: {
        width: 95,
        height: 40,
    },
    avatar_s: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    special_container: {
        padding: 5,
        height: 170,
    },
    empty: {
        width: 60,
        height: 80,
    },
    special: {
        height: 155,
        borderRadius: 20,
        overflow: 'hidden',
    },
    rule: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    special_title: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    score: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    point: {
        width: 26,
        height: 26,
        position: 'absolute',
        top: 9,
        left: 0,
    },
    life: {
        position: 'absolute',
        left: 40,
        right: 40,
        top: 100,
        height: 340,
    },
    life_box: {
        marginTop: 10,
        marginRight: 40,
        width: 293,
        height: 320,
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    life_close: {
        width: 32,
        height: 32,
    },
    life_btn: {
        width: 150,
        height: 59,
    },
    buylife: {
        width: 120,
        height: 24,
    },
    life_ctrl: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: 100,
        height: 33,
        borderRadius: 10,
    },
    life_cbtn: {
        width: 33,
        height: 33,
    },
    life_ctrl_l: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
    life_ctrl_r: {
        position: 'absolute',
        right: 0,
        top: 0,
    }
});


export const LayoutComponent = PkSpecialChannel;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        config: state.pker.config,
        account: state.pker.account,
        match: state.pker.match,
	};
}
