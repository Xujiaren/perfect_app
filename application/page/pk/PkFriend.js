//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Modal } from 'react-native';
import { Header } from 'react-navigation-stack';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import asset from '../../config/asset';

const messages = ['都是大神啊！', '你是魔鬼吧，嘿嘿', '这局我来carry！', '记住要好好回忆哦'];

// create a component
class PkFriend extends Component {

    static navigationOptions = {
        header:null,
    };

    constructor(props) {
        super(props);

        this.pk = [];

        this.state = {
            status: 0,
            owner: {
                id: 0,
                name: '',
                avatar: '',
                score: 0,
            },
            friend: {
                id: 1,
                name: '',
                avatar: '',
                score: 0,
            },
            win: false,

            opts: ["", "", "", ""],
            current: 0,
        

            quick: false,

            review: false,
            review_step: 0,
        }

        this._onStep = this._onStep.bind(this);
        this._onAgain = this._onAgain.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.pker.config();
        actions.pker.account();
        actions.user.user();
    }

    _onStep(next = false) {

        let review_step = this.state.review_step;

        if (next) {
            if (review_step < 5) {
                review_step++;
            }
        } else {
            if (review_step > 0) {
                review_step--;
            }
        }

        this.setState({
            review_step: review_step,
        })
    }

    _onQuick(message) {
        this.setState({
            quick: false,
        })
    }

    _onAgain() {
        this.pk = [];
    }

    render() {
        const {navigation, config, account, user} = this.props;
        const {status, owner, friend, opts, quick, review, review_step} = this.state;

        const canBegin = friend.id > 0;

        if (status == 2) {
            return (
                <ImageBackground style={[styles.container]} source={asset.pk_bg} imageStyle={{ resizeMode: 'repeat' }}>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mb_20, styles.ml_20, styles.mr_20]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={asset.pk.back} style={[styles.back]}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={asset.pk.pk_share} style={[styles.pk_share]}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={[styles.pkin, styles.mt_50, styles.ai_ct]}>
                            <View style={[styles.row, styles.pk_score]}>
                                <View style={[styles.col_1, styles.score_left, styles.ai_ct]}>
                                    <Text style={[styles.white_label, styles.lg24_label]}>210</Text>
                                </View>
                                <View style={[styles.col_1, styles.score_right, styles.ai_ct]}>
                                    <Text style={[styles.white_label, styles.lg24_label]}>120</Text>
                                </View>
                            </View>
                            <View style={[styles.mt_30, styles.row]}>
                                <View style={[styles.mr_10]}>
                                    <Text style={[styles.white_label, styles.right_label, styles.mr_30]}>雨城</Text>
                                    <View style={[styles.row, styles.ai_ct]}>
                                        <View style={[styles.score_box, styles.mt_5]}>
                                            <Text style={[styles.white_label, styles.ml_40]}>210</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.ml_5]}>
                                            <Image source={asset.pk.like} style={styles.like}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.avatar_s2]}>

                                    </View>
                                </View>
                                <View style={[styles.ml_10]}>
                                    <Text style={[styles.white_label, styles.ml_30]}>雨城</Text>
                                    <View style={[styles.row, styles.ai_ct]}>
                                        <TouchableOpacity style={[styles.mr_5]}>
                                            <Image source={asset.pk.like} style={styles.like}/>
                                        </TouchableOpacity>
                                        <View style={[styles.score_box, styles.mt_5]}>
                                            <Text style={[styles.white_label, styles.mr_40]}>210</Text>
                                        </View>
                                        
                                    </View>
                                    <View style={[styles.avatar_s3]}>

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.ai_ct, styles.mt_50]}>
                            <Text style={[styles.white_label, styles.lg20_label]}>结算</Text>
                            <View style={[styles.score_stat, styles.p_20, styles.mt_10]}>
                                <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                                    <View style={[styles.row, styles.ai_ct]}>
                                        <Image source={asset.pk.point} style={styles.point}/>
                                        <Text style={[styles.white_label, styles.ml_10]}>学分</Text>
                                    </View>
                                    <Text style={[styles.white_label]}>0</Text>
                                </View>
                                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_10]}>
                                    <View style={[styles.row, styles.ai_ct]}>
                                        <Image source={asset.pk.life} style={styles.point}/>
                                        <Text style={[styles.white_label, styles.ml_10]}>积分</Text>
                                    </View>
                                    <Text style={[styles.white_label]}>-30</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.head, styles.ai_ct]}>
                            <Image source={asset.pk.head.win} style={[styles.friend]}/>
                        </View>
                    </ScrollView>
                    <View style={[styles.mb_25, styles.row, styles.ai_ct, styles.jc_ad]}>
                        <TouchableOpacity onPress={this._onAgain}>
                            <Image source={asset.pk.again} style={styles.obtn}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({review: true})}>
                            <Image source={asset.pk.review} style={styles.obtn}/>
                        </TouchableOpacity>
                    </View>
                    <Modal visible={review} transparent={true} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.modal]} onPress={()=> this.setState({review: false})}/>
                        <View style={[styles.review]}>
                            <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                                <View/>
                                <View>
                                    {review_step > 0 ?
                                    <Text style={[styles.white_label, styles.lg18_label]}>{review_step}/5</Text>
                                    : null}
                                </View>
                                <TouchableOpacity onPress={()=> this.setState({review: false})}>
                                    <Image source={asset.pk.review_close} style={[styles.review_close]}/>
                                </TouchableOpacity>
                            </View>

                            {review_step == 0 ?
                            <View style={[styles.mt_20]}>
                                <View style={[styles.row]}>
                                    <View style={[styles.col_6, styles.btn, styles.bg_pblue]}>
                                        <Text style={[styles.white_label]}>蓝队：720</Text>
                                    </View>
                                    <View style={[styles.col_4, styles.btn, , styles.bg_pred, styles.ml_20]}>
                                        <Text style={[styles.white_label]}>红队：480</Text>
                                    </View>
                                </View>
                                <View>
                                    <View style={[styles.row, styles.mt_20, styles.ai_ct]}>
                                        <View style={[styles.avatar_s]}/>
                                        <View style={[styles.progress, styles.bg_pblue, {width: 100}, styles.ml_10]}/>
                                        <Text style={[styles.white_label, styles.ml_10]}>720</Text>
                                    </View>
                                    <View style={[styles.row, styles.mt_20, styles.ai_ct]}>
                                        <View style={[styles.avatar_s]}/>
                                        <View style={[styles.progress, styles.bg_pred, {width: 48}, styles.ml_10]}/>
                                        <Text style={[styles.white_label, styles.ml_10]}>420</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={[styles.mt_20]}>
                            </View>}
                        </View>
                        <View style={[styles.review_ctrl, styles.row, styles.ai_ct, styles.jc_sb]}>
                            {review_step > 0 ?
                            <TouchableOpacity onPress={() => this._onStep(false)}>
                                <ImageBackground style={[styles.review_btn, styles.ai_ct, styles.jc_ct]} source={asset.pk.review_lbtn}>
                                    <Text style={[styles.white_label, styles.lg24_label]}>上一题</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            : <View/>}
                            {review_step < 5 ?
                            <TouchableOpacity onPress={() => this._onStep(true)}>
                                <ImageBackground style={[styles.review_btn, styles.ai_ct, styles.jc_ct]} source={asset.pk.review_rbtn}>
                            <Text style={[styles.white_label, styles.lg24_label]}>{review_step == 0 ? '题目回顾' : '下一题'}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            : <View/>}
                        </View>
                    </Modal>
                </ImageBackground>
            )
        }

        if (status == 1) {
            return (
                <ImageBackground style={[styles.container]} source={asset.pk_bg} imageStyle={{ resizeMode: 'repeat' }}>
                    <ScrollView>
                        <View style={[styles.mt_40]}>
                            <View style={[styles.pkin]}>
                                <View style={[styles.row, styles.ai_ct]}>
                                    <View style={[styles.left_wrap]}>
                                        <View style={[styles.avatar_s]}></View>
                                    </View>
                                    <View style={[styles.game_wrap, styles.jc_ct, styles.ai_ct]}>
                                        <Text style={[styles.white_label, styles.lg24_label]}>马拉松是种什么运动？</Text>
                                    </View>
                                    <View style={[styles.right_wrap]}>
                                        <View style={[styles.avatar_s]}></View>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.p_20]}>
                                {opts.map((opt, index) => {
                                    return (
                                        <View key={"opt_" + index} style={[styles.mt_15, styles.ai_ct]}>
                                            <TouchableOpacity style={[styles.opt, styles.p_15]}>
                                                <Text style={[styles.lg24_label]}>{index}</Text>
                                            </TouchableOpacity>
                                            <View style={[styles.avatar_s1, {left: theme.window.width * 0.15 - 30}]}/>
                                            <View style={[styles.avatar_s1, {left: theme.window.width * 0.85 - 40}]}/>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <ImageBackground source={asset.pk.pk_board} style={[styles.board, styles.row]}>
                            <Text style={[styles.col_1, styles.center_label, styles.lg20_label, styles.white_label, styles.pt_30]}>0</Text>
                            <Text style={[styles.col_1, styles.center_label, styles.lg20_label, styles.pt_10]}>10s</Text>
                            <Text style={[styles.col_1, styles.center_label, styles.lg20_label, styles.white_label, styles.pt_30]}>0</Text>
                        </ImageBackground>
                    </ScrollView>
                    <TouchableOpacity style={[styles.quick]} onPress={() => this.setState({quick: true})}>
                        <Text style={styles.white_label}>快捷 <Text style={[styles.icon, styles.white_label]}>{iconMap('xiasanjiao')}</Text></Text>
                    </TouchableOpacity>
                    <Modal visible={quick} transparent={true} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1]} onPress={()=> this.setState({quick: false})}/>
                        <View style={[styles.quick_message, styles.p_10, styles.row, styles.f_wrap]}>
                            {messages.map((message, index) => {
                                return (
                                    <TouchableOpacity key={'messages_' + index} onPress={() => this._onQuick(message)} style={[styles.message_item, styles.bg_white, styles.jc_ct, styles.ai_ct, styles.p_10, styles.mb_10, styles.ml_10, styles.mr_10, styles.circle_10]}>
                                        <Text>{message}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </Modal>
                </ImageBackground>
            )
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
                {canBegin? 
                <View style={[styles.ai_ct, styles.mt_40]}>
                    <Image source={asset.pk.tip.ready} style={[styles.head_tip]}/>
                </View>
                :null}
                <ScrollView contentContainerStyle={[styles.pt_50]}>
                    <View style={[styles.pk, styles.p_20]}>
                        <View style={[styles.row, styles.mt_10]}>
                            <View style={[styles.col_1, styles.ai_ct]}>
                                <Image style={[styles.avatar]} source={{uri: user.avatar}}/>
                                <Text style={[styles.white_label, styles.mt_5]}>{user.nickname}</Text>
                                <Text style={[styles.white_label, styles.mt_5]}>{account.level ? account.level.levelName : ''}</Text>
                            </View>
                            <View style={[styles.col_1, styles.ai_ct, styles.jc_ct]}>
                                <Image source={asset.pk.vs} style={[styles.vs]}/>
                            </View>
                            <View style={[styles.col_1, styles.ai_ct]}>
                                <View style={[styles.avatar]}/>
                                <Text style={[styles.white_label, styles.mt_5]}>雨城</Text>
                                <Text style={[styles.white_label, styles.mt_5]}>青铜</Text>
                            </View>
                        </View>

                        {!canBegin ?
                        <TouchableOpacity style={[styles.mt_40, styles.ai_ct]}>
                            <Image source={asset.pk.invite} style={[styles.invite]}/>
                        </TouchableOpacity>
                        : null}
                    </View>
                    <View style={[styles.head, styles.ai_ct]}>
                        {canBegin ?
                        <View style={[styles.tip, styles.row, styles.ai_ct, styles.jc_ct]}>
                            <Image source={asset.pk.point} style={[styles.point]}/>
                            <Text style={[styles.white_label, styles.ml_10]}>-{config.friend_integral}</Text>
                        </View>
                        : <Image source={asset.pk.head.friend} style={[styles.friend]}/>}
                        
                    </View>
                </ScrollView>

                <TouchableOpacity style={[styles.tool, styles.ai_ct, styles.mb_25]} disabled={!canBegin}>
                    <Image source={canBegin ? asset.pk.begin : asset.pk.begin_disable} style={[styles.begin]}/>
                </TouchableOpacity>
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
    pk_share: {
        width: 72,
        height: 39,
    },
    pk: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
    },
    invite: {
        width: 200,
        height: 55,
    },
    vs: {
        width: 80,
        height: 58
    },
    like: {
        width: 30,
        height: 30,
    },
    head: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    head_tip: {
        width: 188,
        height: 47,
    },
    friend: {
        width: theme.window.width - 80,
        height: (theme.window.width - 80) * 0.24,
    },
    begin: {
        width: 300,
        height: 87
    },
    pkin: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        height: theme.window.width * 0.6,
    },
    avatar: {
        width: 80,
        height: 80,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    avatar_s1: {
        position: 'absolute',
        top: 15,
        backgroundColor: 'red',
        width: 32,
        height: 32,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    avatar_s2: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: 'red',
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    avatar_s3: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'red',
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    tip: {
        position: 'absolute',
        top: 20,
        left: (theme.window.width - 140) / 2, 
        backgroundColor: '#304974',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        width: 100,
        alignItems: 'center',
    },
    left_wrap: {
        flex:2 ,
        padding: 15,
        backgroundColor: '#5499BF',
        borderColor: 'black',
        borderWidth: 2,
        borderLeftWidth: 0,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    right_wrap: {
        flex: 2,
        padding: 15,
        backgroundColor: '#F76468',
        borderColor: 'black',
        borderWidth: 2,
        borderRightWidth: 0,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    game_wrap: {
        flex: 10,
        padding: 10,
        height: theme.window.width * 0.6,
    },
    avatar_s: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    opt: {
        width: theme.window.width * 0.7,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center'
    },
    quick: {
        position: 'absolute',
        left: 20,
        bottom: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
    },
    quick_message: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        borderColor: 'black',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    message_item: {
        width: (theme.window.width - 70) / 2,
        borderWidth: 1,
        borderColor: 'black'
    },
    tool: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    pk_score: {
        width: theme.window.width * 0.5,
        backgroundColor: '#5499BF',
        borderColor: 'black',
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden'
    },
    score_left: {
        padding: 15,
    },
    score_right: {
        padding: 15,
        backgroundColor: '#F76468',
    },
    score_box: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: 100,
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
    },
    score_stat: {
        width: 150,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
    },
    obtn: {
        width: 150,
        height: 55,
    },
    review: {
        position:'absolute',
        left: 20,
        top: 80,
        right: 20,
        bottom: 200,
        backgroundColor: '#3493D5',
        padding: 10,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
    },
    review_close: {
        width: 32,
        height: 32,
    },
    review_ctrl: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 100,
    },
    review_btn: {
        width: 160,
        height: 72,
    },
    btn: {
        padding: 20,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
    },
    progress: {
        height: 20,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
    }
});

export const LayoutComponent = PkFriend;

export function mapStateToProps(state) {
	return {
        config: state.pker.config,
        account: state.pker.account,
        user: state.user.user,
	};
}