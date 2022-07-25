import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView'

import asset from '../../config/asset'
import theme from '../../config/theme'

// create a component
class Moment extends Component {

    static navigationOptions = {
        title:'动态',
        headerRight: <View/>,
    };

    items = ['', '', '', '']
    moments = ['', '', '']

    state = {
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
            <View style={[styles.mb_15]}>
                <Text style={[styles.lg18_label]}>今天</Text>
                <View style={[styles.mt_15, styles.bg_white, styles.circle_5]}>
                    <View style={[styles.p_15, styles.border_bt, styles.row, styles.ai_ct]}>
                        <ImageBackground source={asset.forest.picon} style={[styles.picon, styles.ai_ct, styles.jc_ct]}>
                            <Text style={[styles.forest_grown_label]}>140</Text>
                        </ImageBackground>
                        <View style={[styles.ml_10]}>
                            <Text>共获得139点</Text>
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
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
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
    picon: {
        width: 40,
        height: 40,
    },
});

export const LayoutComponent = Moment;

export function mapStateToProps(state) {
	return {
        
	};
}
