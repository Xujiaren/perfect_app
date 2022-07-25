import React, { Component } from 'react'
import { Text, View, StyleSheet,  ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';

import {theme} from '../../config';

class VodLink extends Component {

    static navigationOptions = ({navigation}) => {

        const title = navigation.getParam('title', '');
        return {
            title:title,
            headerRight: <View/>,
        };
    };

    constructor(props){
        super(props);

        const {navigation} = props;
        this.linkId = navigation.getParam('linkId', 0);

        this.state = {
            loading:false,
        }

        this._onLoadEnd = this._onLoadEnd.bind(this);

    }

    componentDidMount(){

    }

    componentWillReceiveProps (nextProps){
       
    }


    _onLoadEnd(){
        console.log('加载完成')
		this.setState({
			loading: true
		})
    }


    render() {
        const {loading} = this.state;
        let linkUrl=''
        if(this.linkId.slice(0, 4) == 'http'){
            linkUrl = this.linkId ;
        }else{
            linkUrl = 'https://www.wjx.cn/jq/' +  this.linkId  + '.aspx' ;
        }
        


        return (
            <View style={styles.container}>
                <WebView
                    ref={"webView"}
                    useWebKit={true} 
                    source={{uri: linkUrl}}
                    urlPrefixesForDefaultIntent={['http', 'https']}
                    onLoadEnd={this._onLoadEnd}
                    onNavigationStateChange={this._onNavigationStateChange}
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest} />
                {
                    !loading ?
                    <View style={[styles.dot]}>
                        <ActivityIndicator size="small" color="#FFA38D" />
                        <Text style={{color:'#FFA38D',fontSize: 12,marginTop: 8,}}>加载中</Text>
                    </View>
                :null}
                

            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex: 1,
        backgroundColor: '#fff',
    },
    dot:{
        position: 'absolute',
        top: 180,
        width: theme.window.width,
        alignItems: 'center',
        justifyContent: 'center',

    }
});

export const LayoutComponent = VodLink;

export function mapStateToProps(state) {
	return {
        channel:state.course.channel,
	};
}
   