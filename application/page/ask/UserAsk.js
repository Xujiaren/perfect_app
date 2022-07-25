import React, { Component } from 'react';
import {View ,StyleSheet} from 'react-native';

import _ from 'lodash';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import AskCell from '../../component/cell/AskCell'
import HudView from '../../component/HudView';
import Tabs from '../../component/Tabs';

import {theme} from '../../config';

class UserAsk extends Component {

    static navigationOptions = {
        title:'我的内容',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;

        this.items = [];
        
        this.state = {
            status: 0,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);
       
    }

    componentDidMount() {
        this._onHeaderRefresh() 
    }

    componentWillReceiveProps(nextProps) {
        const {userAnswer, userAsk} = nextProps

        if (userAnswer !== this.props.userAnswer) {
            this.items = this.items.concat(userAnswer.items);
            this.pages = userAnswer.pages;
        }

        if (userAsk !== this.props.userAsk) {
            this.items = this.items.concat(userAsk.items);
            this.pages = userAsk.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {status} = this.state;

        this.page = 0;
        this.pages = 1;

        this.items = [];

        if (status == 0) {
            actions.ask.userAnswer(this.page)
        } else {
            actions.ask.userAsk(this.page)
        }

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
		const {actions} = this.props;
    }


    _renderItem(item) {
        const {status} = this.state;
        const {navigation} = this.props;

        const ask = item.item
        
        return(
            <AskCell ask={ask} type={1} style={[styles.p_15, styles.border_bt]} onPress={() => navigation.navigate('Question', {ask: ask})}/>
        )
        
    }

    render() {
        const {status} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.atabs]}>
                    <Tabs items={['回答', '提问']}  atype={0} selected={status} onSelect={(index) => {
                        this.setState({
                            status: index,
                        }, () => {
                            this._onHeaderRefresh()
                        })
                    }} />
                </View>
                <RefreshListView
                    style={[styles.bg_white]}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#fafafa',
        backgroundColor:'#ffffff'
    },
    item:{
        borderBottomWidth: 1,
        borderStyle:'solid',
        borderBottomColor: '#F0F0F0',
    },
});

export const LayoutComponent = UserAsk;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userAnswer: state.ask.userAnswer,
        userAsk: state.ask.userAsk,
	};
}
