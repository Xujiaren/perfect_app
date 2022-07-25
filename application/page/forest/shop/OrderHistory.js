//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView'
import Tabs from '../../../component/Tabs'

import theme from '../../../config/theme'

// create a component
class OrderHistory extends Component {

    static navigationOptions = {
        title:'兑换商品',
        headerRight: <View/>,
    };

    items = ['', '', '', '']
    state = {
        status: 1,
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
            <View style={[styles.p_15, styles.bg_white, styles.row, styles.ai_ct, styles.jc_sb, styles.border_bt]}>
                <View>
                    <Text>沙棘树种子</Text>
                    <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}>2020-03-02 12:22</Text>
                </View>
                <TouchableOpacity style={[styles.bg_gray, styles.p_5, styles.pl_10, styles.pr_10, styles.circle_10]}>
                    <Text style={[styles.sm_label, styles.gray_label]}>查看物流</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {status} = this.state

        return (
            <View style={styles.container}>
                <View style={[styles.bg_white]}>
                    <Tabs items={['兑换商品', '兑换记录']} selected={status} atype={1} onSelect={(index) => {
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

export const LayoutComponent = OrderHistory;

export function mapStateToProps(state) {
	return {
        
	};
}
