//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import asset from '../../config/asset';
import { user } from '../../redux/action/user';

// create a component
class PkRank extends Component {

    static navigationOptions = ({navigation}) => {
		return {
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#41619B',
                borderBottomWidth: 0,
                elevation:0,
            },
            title: '排行榜',
            headerRight: <View/>,
		}
    };

    constructor(props) {
        super(props);

        this.users = [];

        this.state = {
            v: 0,
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.user.user();

        this._onRefresh();
    }
    
    componentWillReceiveProps(nextProps) {
        const {rank} = nextProps;

        if (rank !== this.props.rank) {
            this.users = rank;
        }
    }

    _onRefresh() {
        const {actions} = this.props;
        actions.pker.account();
        actions.pker.rank(this.state.v)
    }

    _onSelect(v) {
        this.setState({
            v: v
        }, () => {
            this._onRefresh();
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

    render() {
        const {v} = this.state;
        const {user, account} = this.props;

        return (
            <ImageBackground style={[styles.container, styles.p_20]} source={asset.pk.question_bg}>
                <View style={[styles.col_1, styles.rank, styles.mt_40, styles.pt_25]}>
                    <View>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={[styles.col_1, styles.tab, v == 0 && styles.tab_on, styles.ai_ct]} onPress={() => this._onSelect(0)}>
                                <Text style={[styles.white_label]}>周排名</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.tab, v == 1 && styles.tab_on, styles.ai_ct]} onPress={() => this._onSelect(1)}>
                                <Text style={[styles.white_label]}>月排名</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.tab, v == 2 && styles.tab_on, styles.ai_ct]} onPress={() => this._onSelect(2)}>
                                <Text style={[styles.white_label]}>总排名</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.line]}/>
                    </View>
                    <FlatList
                        contentContainerStyle={styles.p_15}
                        showsVerticalScrollIndicator={false}
                        data={this.users}
                        extraData={this.state}
                        keyExtractor={(item, index) =>  {return index + ''}}
                        renderItem={this._renderItem}
                    />
                    <View style={[styles.rank_menu, styles.p_15, styles.row, styles.ai_ct]}>
                        <View style={styles.col_1}>
                            <Image style={[styles.avatar]} source={{uri: user.avatar}}/>
                        </View>
                        <View style={styles.col_3}>
                            <Text style={[styles.white_label]}>{user.nickname}</Text>
                            <Text style={[styles.white_label, styles.sm_label, styles.mt_5]}>我的排名：未上榜</Text>
                        </View>
                        <View style={[styles.col_1, styles.ai_ct, styles.p_10]}>
                            <View style={[styles.score, styles.p_5, styles.pl_15, styles.pr_10, styles.circle_5]}><Text style={[styles.white_label, styles.sm_label]}>{account.score}</Text></View>
                            <Image source={asset.pk.point} style={[styles.point]}/>
                        </View>
                        
                    </View>
                </View>
                <View style={[styles.head, styles.ai_ct]}>
                    <Image source={asset.pk.head.rank} style={[styles.friend]}/>
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
        backgroundColor: '#41619B',
    },
    rank: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        overflow: 'hidden'
    },
    tab: {
        backgroundColor: '#0B295D',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 3,
        borderColor: '#0B295D',
        borderBottomWidth: 0,
    },
    tab_on: {
        backgroundColor: '#4EABDE',
    },
    line: {
        backgroundColor: '#4EABDE',
        height: 6,
        borderWidth: 3,
        borderColor: '#0B295D',
        borderTopWidth: 0,
    },
    item: {
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        overflow: "hidden",
        backgroundColor: '#4BABE0'
    },
    rank_icon: {
        width: 30,
        height: 32,
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
});

export const LayoutComponent = PkRank;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        account: state.pker.account,
        rank: state.pker.rank,
	};
}