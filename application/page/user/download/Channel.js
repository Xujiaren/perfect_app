//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

import Tabs from '../../../component/Tabs'
import RefreshListView, {RefreshState} from '../../../component/RefreshListView'

import theme from '../../../config/theme'
import iconMap from '../../../config/font'

class Channel extends Component {
    
    static navigationOptions = {
        title:'下载专区',
        headerRight: <View/>,
    }

    page = 0
    pages = 1
    items = []

    state = {
        status: 0,
        index: 0,
        refreshState: RefreshState.Idle,
    }

    componentDidMount() {
        this._onHeaderRefresh()
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        const {index} = nextProps

        if (index !== this.props.index) {
            this.items = this.items.concat(index.items)
            this.pages = index.pages
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300)
    }

    _onHeaderRefresh = () => {
        const {status} = this.state
        const {actions} = this.props

        this.page = 0
        this.pages = 1
        this.items = []
        actions.download.index(status == 0 ? 2 : 1, this.page, 0)

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh = () => {
        const {status} = this.state
        const {actions} = this.props

        if (this.page < (this.pages - 1)) {
            this.page++;
            actions.download.index(status == 0 ? 2 : 1, this.page, 0)
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _onAction = (action, args) => {
        const {actions} = this.props
        const item = this.items[args.index]

        if (action == 'like') {
            if (item.like) {
                item.like = false
                item.praise--

                actions.download.removeLike({
                    down_id: item.downId,
                    resolved: (data) => {

                    },
                    rejected: (msg) => {
        
                    }
                })
            } else {
                item.like = true
                item.praise++

                actions.download.like({
                    down_id: item.downId,
                    resolved: (data) => {

                    },
                    rejected: (msg) => {
        
                    }
                })
            }

            this.items[args.index] = item

            this.setState({
                index: args.index,
            })

        } else {

        }
    }

    _renderItem = (item) => {
        const {navigation} = this.props
        const {status} = this.state
        const data  = item.item
        const left = item.index % 2 == 0
        return (
            <TouchableOpacity style={[styles.item, left && styles.mr_15, styles.mb_15]} onPress={() => navigation.navigate('DownloadGallery', data)}>
                <Image source={{uri: data.imgUrl}} style={[styles.cover, styles.bg_wred, styles.circle_10]}/>
                <Text style={[styles.mt_15]}>{data.name}</Text>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mt_15]}>
                    {status == 0 ?
                    <View style={[styles.row, styles.ai_ct]}>
                        <Text style={[styles.icon, styles.tip_label]}>{iconMap('tupiantu')}</Text>
                        <Text style={[styles.tip_label, styles.sm_label]}> {data.galleryList.length}</Text>
                    </View>
                    : null}
                    <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => this._onAction('like', {index: item.index})}>
                        <Text style={[styles.icon, styles.tip_label, data.like && styles.sred_label]}>{iconMap(data.like ? 'dianzan1' : 'dianzan')}</Text>
                        <Text style={[styles.tip_label, styles.sm_label]}> {data.praise}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {status} = this.state

        return (
            <View style={[styles.container, styles.bg_white]}>
                <Tabs items={['图集','视频']} selected={status} atype={1} onSelect={(index) => {
                    this.setState({
                        status: index
                    }, () => {
                        this._onHeaderRefresh()
                    })
                }}/>
                <RefreshListView
                    contentContainerStyle={[styles.p_15]}
                    data={this.items}
                    extraData={this.state}
                    numColumns={2}
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
    item: {
        width: '48%'
    },
    cover: {
        width: '100%',
        height: 120,
    }
});

export const LayoutComponent = Channel;

export function mapStateToProps(state) {
	return {
        index: state.download.index,
	};
}