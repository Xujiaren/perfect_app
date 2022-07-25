//成就
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';

import Carousel from 'react-native-snap-carousel'

import Tabs from '../../component/Tabs'
import RefreshListView, {RefreshState} from '../../component/RefreshListView'

import theme from '../../config/theme'

// create a component
class Achieve extends Component {

    static navigationOptions = {
        title:'成就',
        headerRight: <View/>,
    }
    
    items = ['', '', '', '', '', '']
    state = {
        status: 0,
        show: false,
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
            <View style={[styles.item, styles.ai_ct, styles.jc_sb, styles.mb_15]}>
                <View style={[styles.thumb, styles.bg_sred]}/>
                <Text style={[styles.mt_15]}>山茶树</Text>
            </View>
        )
    }

    _renderCard = (item) => {
        return (
            <View style={[styles.bg_white, styles.circle_5, styles.m_10]}>
                <View style={[styles.bg_fgreen, styles.ai_ct, styles.jc_ct, styles.p_15]}>
                    <View style={[styles.thumb, styles.bg_sred]}/>
                </View>
                <View style={[styles.p_15]}>
                    <View style={[styles.ai_ct, styles.jc_ct]}>
                        <View style={[styles.avatar_small, styles.bg_sred]}/>
                        <Text style={[styles.mt_10]}>Mio</Text>
                    </View>
                    <Text style={[styles.mt_15]}>恭喜您，您于xxx年xxx月xxx日种植成功，感谢您对完美林的付出与参与！</Text>
                </View>
            </View>
        )
    }

    render() {
        const {status, show} = this.state

        return (
            <View style={[styles.container, styles.bg_white]}>
                <View style={[styles.bg_white]}>
                    <Tabs items={['果实','植物证书', '兑换证书']} selected={status} atype={1} onSelect={(index) => {
                        this.setState({
                            status: index
                        }, () => {
                            this._onHeaderRefresh()
                        })
                    }}/>
                </View>
                <RefreshListView
                    contentContainerStyle={[styles.p_15]}
                    data={this.items}
                    extraData={this.state}
                    numColumns={3}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    ListHeaderComponent={this._renderHeader}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />

                <Modal  visible={show} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({show:false})}/>
                    <View style={[styles.showContainer, styles.ai_ct]}>
                        <Carousel
                            useScrollView={true}
                            data={this.items}
                            renderItem={this._renderCard}
                            itemWidth={theme.window.width * 0.7}
                            sliderWidth={theme.window.width}
                            activeSlideAlignment={'center'}
                            inactiveSlideScale={1}
                            removeClippedSubviews={false}
                        />

                        <TouchableOpacity style={[styles.share, styles.bg_fgreen, styles.p_15, styles.circle_20, styles.ai_ct, styles.mt_25]}>
                            <Text style={[styles.white_label]}>去分享</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    item: {
        width: '33%',
    },
    thumb: {
        width: 90,
        height: 90,
    },
    showContainer: {
        position: 'absolute',
        top: theme.window.width * 0.48,
        left: 0,
        right: 0,
    },
    share: {
        width: theme.window.width * 0.5,
    }
});

export const LayoutComponent = Achieve;

export function mapStateToProps(state) {
	return {
        
	};
}