import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';

import { WebView } from 'react-native-webview';

import theme from '../../config/theme';

class AdWebView extends Component {

    constructor(props){
        super(props);
        this.bank_url = '';
        this.state = {
            link:''
        };
    }

    componentWillMount(){
        const {navigation} = this.props
        const {params} = navigation.state
        const {link} = params
        this.bank_url = link
    }

    render() {
        return (
            <View style={[styles.container]}>
                <WebView
                    ref={"webView"}
                    useWebKit={true} 
                    source={{uri: this.bank_url}}
                    urlPrefixesForDefaultIntent={['http', 'https']}
                />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    header_cover:{
        width:50,
        height:50,
        borderRadius:25,
    },
});


export const LayoutComponent = AdWebView;

export function mapStateToProps(state) {
	return {
        usertask:state.user.usertask,
        userlevel:state.user.userlevel,
	};
}