//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Tabs from '../../component/Tabs'
import RefreshListView, {RefreshState} from '../../component/RefreshListView'

import theme from '../../config/theme'

// create a component
class Friend extends Component {

    static navigationOptions = {
        title:'好友',
        headerRight: <View/>,
    }

    applys = ['', '']
    items = ['', '', '', '']

    state = {
        status: 0,
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
            <View style={[styles.bg_white, styles.p_15, styles.pl_30, styles.pr_30, styles.border_bt, styles.row, styles.ai_ct, styles.jc_sb]}>
                <View style={[styles.row, styles.ai_ct]}>
                    <View style={[styles.avatar_small, styles.bg_sred]}/>
                    <Text style={[styles.ml_10]}>小小</Text>
                </View>
                <TouchableOpacity style={[styles.p_5, styles.pl_10, styles.pr_10, styles.bg_sred, styles.circle_10]}>
                    <Text style={[styles.white_label, styles.sm_label]}>通过好友</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _renderHeader = () => {
        return (
            <View style={[styles.mb_10]}>
                <View style={[styles.p_10]}>
                    <Text style={[styles.sm_label, styles.gray_label]}>申请信息</Text>
                </View>
                {this.applys.map((apply, index) => {
                    return this._renderItem({})
                })}
            </View>
        )
    }

    render() {
        const {status} = this.state

        return (
            <View style={styles.container}>
                <View style={[styles.bg_white]}>
                    <Tabs items={['我的好友','活跃用户']} selected={status} atype={1} onSelect={(index) => {
                        this.setState({
                            status: index
                        }, () => {
                            this._onHeaderRefresh()
                        })
                    }}/>
                </View>
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
});

export const LayoutComponent = Friend;

export function mapStateToProps(state) {
	return {
        
	};
}