//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView'

import iconMap from '../../../config/font'
import theme from '../../../config/theme'

// create a component
class Gallery extends Component {

    static navigationOptions = {
        title:'相册列表',
        headerRight: <View/>,
    };

    items = ['', '', '', '']
    state = {
        refreshState: RefreshState.Idle,
    }

    _onHeaderRefresh = () => {

    }

    _onFooterRefresh = () => {

    }

    _renderItem = (item) => {
        return (
           <View>
               <View style={[styles.row, styles.f_wrap]}>
                   {['', '', '', '', ''].map((photo, index) => {
                        return (
                            <View style={[styles.photo, styles.bg_sred, styles.circle_10, styles.mt_15, styles.mr_10]} key={'photo_' + index}/>
                        )
                   })}
               </View>
               <View style={[styles.mt_15, styles.bg_gray, styles.p_10, styles.circle_10]}>
                   <Text style={[styles.sm_label, styles.gray_label]}>瑞士联邦（德语：Schweizerische Eidgenossenschaft，法语：Confédération suisse，意大利语：Confederazione Svizzera，罗曼什语：Confederaziun svizra），简称“瑞士”，是中欧国家之一，全国划分为26个州。瑞士北邻德国，西邻法国，南邻意大利，东邻奥地利和列支敦士登。全境以高原和山地为主，有“欧洲屋脊”之称。伯尔尼是联邦政府的所在地。</Text>
               </View>
               <View style={[styles.pt_15, styles.pb_15, styles.border_bt, styles.row, styles.ai_ct, styles.jc_sb]}>
                   <View style={[styles.row, styles.ai_ct]}>
                        <View style={[styles.row]}>
                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('dianzan')}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}> 559</Text>
                        </View>
                        <View style={[styles.row, styles.ml_25]}>
                            <Text style={[styles.icon, styles.tip_label]}>{iconMap('fenxiang1')}</Text>
                            <Text style={[styles.tip_label, styles.sm_label]}> 559</Text>
                        </View>
                   </View>
                   <Text style={[styles.sm_label, styles.gray_label]}>1天前</Text>
               </View>
           </View>
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
    photo: {
        width: (theme.window.width - 60) / 3,
        height: (theme.window.width - 60) / 3,
    }
});

export const LayoutComponent = Gallery;

export function mapStateToProps(state) {
	return {
        
	};
}