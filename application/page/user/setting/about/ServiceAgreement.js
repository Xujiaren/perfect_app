//import liraries
import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet ,DeviceEventEmitter} from 'react-native';

import theme from '../../../../config/theme';
import HtmlView from '../../../../component/HtmlView';

// create a component
class ServiceAgreement extends Component {

    static navigationOptions = {
        title:'用户服务使用协议',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        const {navigation} = this.props 
        this.type = navigation.getParam('type', 0);

        this.state = {
            type:this.type,
            content : '',
        }
    }


    componentDidMount() {
        const {actions, navigation} = this.props
        actions.site.about({
            type: 'policy',
            resolved: (data) => {
                this.setState({
                    content: data,
                })
            },
            rejected: (msg) => {
            },
        })
    }

    componentWillUnmount(){
        const { navigation } = this.props
        const {type} = this.state

        if(type === 1){
            DeviceEventEmitter.emit('infos', {
                infoStatus: 0
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.p_20}
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                >
                    <HtmlView html={this.state.content}/>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    text_just:{
        textAlign:'justify'
    }
});

export const LayoutComponent = ServiceAgreement;

export function mapStateToProps(state) {
	return {
	};
}