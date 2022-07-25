//import liraries
import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, FlatList, Modal, StyleSheet } from 'react-native';
import { Header } from 'react-navigation-stack';

import theme from '../../config/theme';
import asset from '../../config/asset';
import { act } from 'react-test-renderer';

// create a component
class PkSpecial extends Component {

    static navigationOptions = {
        header:null,
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.match = navigation.getParam('match', {});

        this.items = [];
        this.awards = [];

        this.state = {
            buy: false,
            life: 1,
            award: false,
        }

        this._onLifeUp = this._onLifeUp.bind(this);
        this._onLifeDown = this._onLifeDown.bind(this);
        this._onBuyLife = this._onBuyLife.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.user.user();
        actions.pker.config();
        actions.pker.account();
        actions.pker.matchrank(this.match.matchId);
        actions.pker.matchaward(this.match.matchId);
    }
    
    componentWillReceiveProps(nextProps) {
        const {matchrank, award} = nextProps;
        if (matchrank !== this.props.matchrank) {
            this.items = matchrank;
        }

        if (award !== this.props.award) {
            this.awards = award;
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
        const rank = item.item;
        return (
            <View style={[styles.item, styles.row]}>
                <View style={[styles.item_icon, styles.jc_ct, styles.ai_ct, styles.p_10]}>
                    {item.index > 2 ?
                    <Text style={[styles.lg15_label]}>{item.index + 1}</Text>
                    :<Image source={asset.pk.rank[item.index + 1]} style={[styles.rank_icon]}/>}
                    
                </View>
                <View style={[styles.item_user, styles.row, styles.ai_ct, styles.p_10]}>
                    <Image style={[styles.avatar]} source={{uri: rank.avatar}}/>
                    <Text style={[styles.white_label, styles.ml_5]}>{rank.nickname}</Text>
                </View>
                <View style={[styles.item_score, styles.jc_ct, styles.ai_ct, styles.p_10]}>
                    <View style={[styles.score, styles.p_5, styles.pl_15, styles.pr_10, styles.circle_5]}><Text style={[styles.white_label, styles.sm_label]}>{rank.score}</Text></View>
                    <Image source={asset.pk.trophy} style={[styles.trophy]}/>
                </View>

            </View>
        )
    }

    _renderAwardItem(item) {
        const award = item.item;
        return (
            <View style={[styles.award_item, styles.row, styles.mb_5]}>
                <View style={[styles.col_2, styles.p_10]}>
                    <Text style={[styles.white_label]}>{award.beginRank} - {award.endRank}</Text>
                </View>
                <View style={[styles.col_5, styles.p_10]}>
                    <Text style={[styles.white_label]}>{award.awardName} x {award.awardNum}</Text>
                </View>
            </View>
        )
    }

    render() {
        const {navigation, user, account, config} = this.props;
        const {buy, life, award} = this.state;

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
                <ScrollView>
                    <ImageBackground source={asset.pk.special_bg} style={[styles.special_container]}>
                        <View style={[styles.special]}>
                            <View style={[styles.special_title, styles.row, styles.jc_sb, styles.ai_ct]}>
                                <Text style={[styles.white_label]}>我的排名：{this.match.rank.rank > 0 ? this.match.rank.rank : '未上榜'}</Text>
                                <Text style={[styles.white_label]}>{this.match.beginTimeFt}-{this.match.endTimeFt}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={[styles.mt_15, styles.ai_ct]}>
                        <Image source={asset.pk.tip.rank} style={[styles.tip]}/>
                    </View>
                    <View style={[styles.rank, styles.mt_15]}>
                        <FlatList
                            contentContainerStyle={styles.p_15}
                            showsVerticalScrollIndicator={false}
                            data={this.items}
                            extraData={this.state}
                            keyExtractor={(item, index) =>  {return index + ''}}
                            renderItem={this._renderItem}
                        />
                        <View style={[styles.rank_menu, styles.p_15, styles.row, styles.ai_ct]}>
                            <View style={[styles.col_4, styles.row]}>
                                <Image source={{uri: user.avatar}} style={[styles.avatar]}/>
                                <View style={[styles.ml_5]}>
                                    <Text style={[styles.white_label]}>{user.nickname}</Text>
                                    <Text style={[styles.white_label, styles.sm_label, styles.mt_5]}>我的排名：{this.match.rank.rank > 0 ? this.match.rank.rank : '未上榜'}</Text>
                                </View>
                            </View>
                            <View style={[styles.col_2, styles.ai_ct, styles.p_10]}>
                                <View style={[styles.score, styles.p_5, styles.pl_15, styles.pr_10, styles.circle_5]}><Text style={[styles.white_label, styles.sm_label]}>{user.integral}</Text></View>
                                <Image source={asset.pk.point} style={[styles.point]}/>
                            </View>
                            <View style={[styles.col_2, styles.row, styles.p_10]}>
                                <TouchableOpacity>
                                    <Image source={asset.pk.special_rank} style={[styles.special_rank]}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ml_5]} onPress={() => this.setState({
                                    award: true,
                                })}>
                                    <Image source={asset.pk.special_reward} style={[styles.special_reward]}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.mt_15, styles.row, styles.ai_end, styles.jc_ct]}>
                        <TouchableOpacity>
                            <Image source={asset.pk.special_begin} style={[styles.special_begin]}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={asset.pk.special_share} style={[styles.special_share, styles.ml_10]}/>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
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
                <Modal visible={award} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=> this.setState({award: false})}/>
                    <View style={[styles.life]}>
                        <ImageBackground source={asset.pk.life_box} style={[styles.life_box, styles.p_20]}>
                            <View style={[styles.ai_ct]}>
                                <Image source={asset.pk.tip.rule} style={[styles.buylife]}/>
                            </View>
                            <View style={[styles.rule, styles.p_10]}>
                                <Text style={[styles.white_label]}>{this.match.rule}</Text>
                            </View>
                            <View style={[styles.award, styles.p_5]}>
                                <FlatList
                                    contentContainerStyle={styles.p_15}
                                    showsVerticalScrollIndicator={false}
                                    data={this.awards}
                                    extraData={this.state}
                                    keyExtractor={(item, index) =>  {return index + ''}}
                                    renderItem={this._renderAwardItem}
                                />
                            </View>
                        </ImageBackground>
                        <TouchableOpacity style={[styles.close]} onPress={()=> this.setState({award: false})}>
                            <Image source={asset.pk.review_close} style={[styles.life_close]}/>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
    special: {
        height: 155,
        borderRadius: 20,
        overflow: 'hidden',
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
    tip: {
        width: 140,
        height: 45,
    },
    rank: {
        height: theme.window.width - 40,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        overflow: 'hidden'
    },
    rank_icon: {
        width: 30,
        height: 32,
    },
    item: {
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        overflow: "hidden",
        backgroundColor: '#4BABE0'
    },
    item_icon: {
        flex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    item_user: {
        flex: 8,
    },
    item_score: {
        flex: 3,
    },
    score: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    trophy: {
        width: 26,
        height: 26,
        position: 'absolute',
        top: 16,
        left: 0,
    },
    point: {
        width: 26,
        height: 26,
        position: 'absolute',
        top: 9,
        left: 0,
    },
    avatar: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 2,
    },
    rank_menu: {
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    special_rank: {
        width: 40,
        height: 50,
    },
    special_reward: {
        width: 40,
        height: 50,
    },
    special_begin: {
        width: 160,
        height: 80,
    },
    special_share: {
        width: 45,
        height: 45,
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
        overflow: 'hidden'
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
    },
    rule: {
        height: 50,
        overflow: 'hidden',
    },
    award: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        overflow: 'hidden',
        height: 200,
    },
    award_item: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#5BABE3'
    }
});


export const LayoutComponent = PkSpecial;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        config: state.pker.config,
        account: state.pker.account,
        matchrank: state.pker.matchrank,
        award: state.pker.award,
	};
}