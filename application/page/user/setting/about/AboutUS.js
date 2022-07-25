//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import HtmlView from '../../../../component/HtmlView';
import theme from '../../../../config/theme';
import request from '../../../../util/net'
// create a component
class AboutUS extends Component {

    static navigationOptions = ({navigation}) => {
        
        const title = navigation.getParam('title', '');
		return {
            title: title,
            headerRight: <View/>,
		}
	};
    title=this.props.navigation.getParam('title', '')
    state = {
        content : '',
    }

    componentDidMount() {
        const{actions,navigation}=this.props
        if(this.title=='证照信息'){
            request.get('/article/system/img')
            .then(res=>{
                this.setState({
                    content:res.content
                })
            })
        }else{
            actions.site.about({
                type: navigation.getParam('type', 'aboutus'),
                resolved: (data) => {
                    this.setState({
                        content: data,
                    })
                },
                rejected: (msg) => {
                },
            })
        }
    }

    render() {
        return (
            <View style={[styles.container, styles.p_20]}>
                <HtmlView html={this.state.content}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = AboutUS;

export function mapStateToProps(state) {
	return {
	};
}