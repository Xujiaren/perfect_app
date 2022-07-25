//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import theme from '../../../config/theme'

// create a component
class Channel extends Component {

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
        const {channel} = nextProps

        if (channel !== this.props.channel) {
            this.pages = channel.pages
            this.items = this.items.concat(channel.items)
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300)
    }

    _onHeaderRefresh = () => {
        const {actions} = this.props
        this.page = 0
        this.pages = 1
        this.items = []

        actions.meet.channel(0)
        this.setState({refreshState: RefreshState.HeaderRefreshing})
    }

    _onFooterRefresh = () => {
        const {actions} = this.props;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page++;

            actions.meet.channel(this.page)
        }  else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem = (item) => {
        const {navigation} = this.props
        const moment = item.item
        return (
            <TouchableOpacity style={[styles.bg_white, styles.circle_10, styles.shadow, styles.mb_15]} onPress={() => navigation.navigate('MeetMoment', {moment: moment})}>
                <Image source={{uri: moment.articleImg}} style={[styles.thumb, styles.bg_wred]}/>
                <View style={[styles.p_12, styles.ai_ct, styles.jc_ct]}>
                    <Text>{moment.title}</Text>
                </View>
            </TouchableOpacity>
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
    thumb: {
        width: theme.window.width - 30,
        height: (theme.window.width - 30) * 0.39 
    }
});

export const LayoutComponent = Channel;

export function mapStateToProps(state) {
	return {
        channel: state.meet.channel,
	};
}