//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import theme from '../../../../config/theme';

import LabelBtn from '../../../../component/LabelBtn';

// create a component
class About extends Component {

    static navigationOptions = {
        title:'关于我们',
        headerRight: <View/>,
    };

    _onPage = (nav_val) => {
        const {navigation} = this.props;
        navigation.navigate(nav_val);
    }

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <LabelBtn label={'油葱学堂介绍'} nav_val={'AboutUS'}  clickPress ={() => navigation.navigate('AboutUS', {type: 'aboutus', title: '油葱学堂介绍'})} />
                <LabelBtn label={'用户服务使用协议'}  nav_val={'RserviceAgreement'} clickPress ={() => navigation.navigate('ServiceAgreement', {type: 'policy', title: '用户服务使用协议'})} />
                <LabelBtn label={'隐私条款'}  nav_val={'RprivacyPolicy'} clickPress ={() => navigation.navigate('RprivacyPolicy', {type: 'privacy', title: '隐私条款'})} />
                <LabelBtn label={'版权声明'}  nav_val={'Copyright'} clickPress ={() => navigation.navigate('AboutUS', {type: 'copyright', title: '版权声明'})} />
                <LabelBtn label={'联系我们'}  nav_val={''} clickPress ={() => navigation.navigate('AboutUS', {type: 'contact', title: '联系我们'})} />
                <LabelBtn label={'证照信息'} nav_val={''} clickPress ={() => navigation.navigate('AboutUS', {type: 'img', title: '证照信息'})} />
                <LabelBtn label={'付费服务&充值协议'} nav_val={''} clickPress ={() => navigation.navigate('AboutUS', {type: 'deal', title: '付费服务&充值协议'})} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base
});

//make this component available to the app
export default About;
