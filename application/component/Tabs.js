
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import theme from '../config/theme';

class Tabs extends Component {

    constructor(props) {
		super(props);

		this._onPress = this._onPress.bind(this);
		this._renderItems = this._renderItems.bind(this);
    }

     _onPress(index){
        this.props.onSelect && this.props.onSelect(index);
    }

    _renderItems(){
        const {items, selected = 0, atype = 0} = this.props;

        return items && items.map((item,index)=>{
            const on = (selected === index);
            return (

                
                <TouchableOpacity key={index} 
                    onPress={() => this._onPress(index)} style={[styles.items, styles.col_1]}
                >
                    {
                        on ?
                        <View style={[styles.pl_10 ,styles.pr_10 ,styles.fd_c ,styles.ai_ct ,styles.jc_ct ]}>
                            <Text style={[styles.c33_label ,styles.default_label ,styles.fw_label]}>{item}</Text>
                            <View style={[styles.border_bt_ed ,styles.mt_5]}></View>
                        </View>
                        :
                        <View style={[styles.pl_10 ,styles.pr_10 ,styles.fd_c ,styles.ai_ct ,styles.jc_ct ]}>
                            <Text style={[styles.default_label, styles.gray_label]}>{item}</Text>
                            <View style={[styles.border_bt_ned ,styles.mt_5]}></View>
                        </View>
                    }
                </TouchableOpacity>
            );
        });
    }

    render () {
        const {type = 1 ,atype = 0, style={}} = this.props;

        if (type == 0) {
            return (
                <ScrollView style={[styles.pt_15, atype == 1 && styles.border_bt]}  horizontal showsVerticalScrollIndicator={false}  showsHorizontalScrollIndicator={false}>
                    <View style={[styles.d_flex  ,styles.fd_r ]}>
                        {this._renderItems()}
                    </View>
                </ScrollView>
            )
        }
        return (
            <View  style={[style, styles.pl_30, styles.pr_30, styles.fd_r ,styles.jc_sb ,styles.pt_10, atype == 1 && styles.border_bt]}>
                {this._renderItems()}
            </View>
        );
    }


}


const styles = StyleSheet.create({
    ...theme.base,
	item: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	onItem: {
		borderBottomWidth: 2,
		borderBottomColor: '#EB4B4B',
	},
	itemLabel: {
		borderBottomWidth: 0,
		fontSize: 14,
		color: '#ADADAD',
		fontWeight: 'bold',
	},
	onItemLabel: {
		color: '#EB4B4B',
		fontWeight: 'bold',
	},
	Itemtype:{
		paddingBottom: 10,
    },
    border_bt_ed:{
        width: 10,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'red',
    },
    border_bt_ned:{
        width: 10,
        height: 4,
        borderRadius: 2,
    }
});


export default Tabs;