//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView'
import {theme} from '../../config';

// create a component
class User extends Component {

    static navigationOptions = {
        title:'个人信息',
        headerRight: <View/>,
    };

    items = ['', '', '']
    state = {
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
            <View style={[styles.bg_white, styles.row, styles.ai_ct, styles.jc_sb, styles.p_10, styles.pl_20, styles.pr_20, styles.border_bt]}>
                <View style={[styles.row, styles.ai_ct]}>
                    <View style={[styles.avatar_small, styles.bg_sred]}/>
                    <View style={[styles.ml_15]}>
                        <Text>勤耕 帮你收取</Text>
                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>09-02 12:33</Text>
                    </View>
                </View>
                <Text>2点</Text>
            </View>
        )
    }

    _renderHeader = () => {
        return (
            <View style={[styles.p_15, styles.row,  styles.ai_ct, styles.bg_white, styles.mb_10]}>
                <View style={[styles.avatar, styles.bg_sred]}/>
                <View style={[styles.ml_10]}>
                    <Text style={[styles.lg18_label]}>Mio</Text>
                    <Text style={[styles.gray_label, styles.mt_5]}>阳光数 234</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    ListHeaderComponent={this._renderHeader}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    }
});

export const LayoutComponent = User;

export function mapStateToProps(state) {
	return {
        
	};
}
