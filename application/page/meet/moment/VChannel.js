//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView'

import iconMap from '../../../config/font'
import theme from '../../../config/theme'

class VChannel extends Component {

    static navigationOptions = {
        title:'视频列表',
        headerRight: <View/>,
    };

    items = ['', '', '', '', '']
    state = {
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
            <TouchableOpacity style={[styles.row, styles.mb_15]}>
                <View style={[styles.thumb, styles.bg_sred]}/>
                <View style={[styles.info, styles.ml_10, styles.jc_sb]}>
                    <Text>在瑞士的第一天行程</Text>
                    <View style={[styles.row, styles.ai_ct]}>
                        <View style={[styles.col_1, styles.row]}>
                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('zhuanti-bofang')}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}> 2332播放</Text>
                        </View>
                        <View style={[styles.col_1, styles.row]}>
                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('dianzan')}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}> 559</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={[styles.container, styles.bg_white]}>
                <RefreshListView
                    contentContainerStyle={[styles.p_15]}
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
    thumb: {
        width: 150,
        height: 80,
    },
    info: {
        width: theme.window.width - 190,
        height: 80,
    }
});

export const LayoutComponent = VChannel;

export function mapStateToProps(state) {
	return {
        
	};
}