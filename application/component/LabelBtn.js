import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity} from 'react-native';

import theme from '../config/theme';
import asset from '../config/asset';
import iconMap from '../config/font';


class LabelBtn extends Component {

    constructor () {
        super(...arguments);
        this.state = {

        };
        this._onPress = this._onPress.bind(this);

    }

    _onPress(nav_val){
        this.props.clickPress && this.props.clickPress(nav_val);
    }

    render() {
        const {label,num = 0 ,type = '',nav_val = '', cate = 0 , color = '#333',iconType = 0,pdf = 20} = this.props;

        return (
            <TouchableOpacity style={[styles.btn,styles.border_bt,{paddingLeft:pdf}]} onPress={() => this._onPress(nav_val)}>
                <Text style={[styles.default_label , styles.c33_label , styles.fw_label]}>{label}</Text>
                <View style={[styles.ai_ct , styles.fd_r]}>
                    {
                        num > 0 ?
                        <Text style={[styles.orange_label , styles.default_label]}>{num}</Text>
                    : null}
                    {
                        type.length > 0 ?
                            <Text style={[styles.default_label],{color:color}}>{type}</Text>
                    : null}

                    {
                        iconType == 0 ?
                        <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap('right')}</Text>
                    :null}
                    
                </View>
            </TouchableOpacity>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    btn:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'#ffffff',
        borderBottomColor:'#E4E7ED',
        borderStyle:'solid',
        borderBottomWidth:1
    },
});

export default  LabelBtn;
