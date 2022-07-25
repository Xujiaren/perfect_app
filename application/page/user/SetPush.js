import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image,Switch} from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';

class SetPush extends Component {

    static navigationOptions = {
        title:'推送消息设置',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.state = {
            disturb_val:false,
            fans_val:false,
        };
    }

    onChange = (value) => {
        this.setState({
            disturb_val:value,
        });
    }

    _onFans = (value) => {
        this.setState({
            fans_val:value,
        });
    }

    render() {

        const {disturb_val,fans_val} = this.state;
        return (
            <View style={styles.container}>
                <View style={[styles.pl_35,styles.pr_35,styles.pt_15,styles.pb_15,styles.bg_white,styles.mt_20,styles.fd_r,styles.jc_sb,styles.ai_ct]}>
                    <Text style={[styles.c33_label,styles.lg_label,styles.fw_label]}>推送免打扰</Text>
                    <Switch
                        style={{transform:[{scaleX:0.8},{scaleY:0.8}]}}
                        onValueChange={(value) => this.onChange(value)}
                        value={disturb_val}
                    />
                </View>
                <Text style={[styles.tip_label,styles.sm_label,styles.pl_35,styles.pt_5]}>开启后，明天6:00前不再接受油葱学堂通知</Text>
                <View style={[styles.pl_35,styles.pr_35,styles.pt_15,styles.pb_15,styles.bg_white,styles.mt_20,styles.fd_r,styles.jc_sb,styles.ai_ct]}>
                    <Text style={[styles.c33_label,styles.lg_label,styles.fw_label]}>新粉丝</Text>
                    <Switch
                        style={{transform:[{scaleX:0.8},{scaleY:0.8}]}}
                        onValueChange={(value) => this._onFans(value)}
                        value={fans_val}
                    />
                </View>
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = SetPush;

export function mapStateToProps(state) {
	return {
	};
}

