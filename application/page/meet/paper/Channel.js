//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import {ProgressView} from "@react-native-community/progress-view";

import RefreshListView, {RefreshState} from '../../../component/RefreshListView'
import theme from '../../../config/theme'

// create a component
class Channel extends Component {

    static navigationOptions = {
        title:'我的试卷',
        headerRight: <View/>,
    };

    page = 0
    pages = 1
    items = []

    state = {
        refreshState: RefreshState.Idle,
    }

    componentDidMount() {
        this._onHeaderRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {paper} = nextProps

        if (paper !== this.props.paper) {
            this.pages = paper.pages
            this.items = this.items.concat(paper.items)
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }


    _onHeaderRefresh = () => {
        const {actions} = this.props

        this.page = 0
        this.pages = 1
        this.items = []

        actions.meet.paper(0)
        this.setState({refreshState: RefreshState.HeaderRefreshing})
    }

    _onFooterRefresh = () => {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page++;

            actions.meet.paper(this.page)
        }  else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem = (item) => {
        const {navigation} = this.props
        const paper = item.item

        return (
            <TouchableOpacity style={[styles.row, styles.mb_15]} onPress={() => navigation.navigate('MeetPaper', {paper: paper})}>
                <Image source={{uri: paper.paperImg}} style={[styles.thumb, styles.bg_wred]}/>
                <View style={[styles.info, styles.ml_10, styles.jc_sb]}>
                    <View>
                        <Text>{paper.paperName}</Text>
                        <Text style={[styles.sm_label, styles.tip_label, styles.mt_5]}></Text>
                    </View>
                    <View>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mb_8]}>
                            <Text style={[styles.sm_label, styles.gray_label]}>{paper.num}人已考</Text>
                            <Text style={[styles.sm_label, styles.tip_label]}>{paper.percentage}%</Text>
                        </View>
                        <ProgressView progressTintColor="#F4623F" trackTintColor="rgba(244, 98, 63, 0.3)"  progress={paper.percentage / 100}/>
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

export const LayoutComponent = Channel;

export function mapStateToProps(state) {
	return {
        paper: state.meet.paper,
	};
}