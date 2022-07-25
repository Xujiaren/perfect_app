import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';

import { WebView } from 'react-native-webview';

import asset from '../../config/asset';
import theme from '../../config/theme';

import LabelBtn from '../../component/LabelBtn';

class Kefu extends Component {

    static navigationOptions = {
        title:'客服',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = props;

        this.kefu = navigation.getParam('Kefu', {unioinId: 0, nickname: ''});
        this.state = {
            unioinId:this.unioinId,
        };
    }



    _onLoadEnd = () => {
        console.log('结束')
    }


    render() {
        const {unioinId} = this.state;

        console.log(unioinId)
        return (
            <View style={styles.container}>
                <WebView
                    ref={"webView"}
                    useWebKit={true} 
                    source={{uri: 'https://ucccsr.perfect99.com/customer/index.html?origin=WX&unionId='+ this.kefu.unioinId +'&wxNickName='+ this.kefu.nickname}}
                    urlPrefixesForDefaultIntent={['http', 'https']}
                    onLoadEnd={this._onLoadEnd}
                    onNavigationStateChange={this._onNavigationStateChange}
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest} />
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
   
});

export const LayoutComponent = Kefu;

export function mapStateToProps(state) {
	return {
	};
}
