import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity,TextInput} from 'react-native';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

export default class ActRule extends Component {
    static navigationOptions = {
        title:'翻牌规则',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.activity = {};
        this.state = {

        };
    }

    componentWillReceiveProps (nextProps) {
        const {activityflop} = nextProps;
        if (activityflop !== this.props.activityflop){
            this.activity = activityflop.activity;
        }
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.activity.activityflop();
    }


    render() {

        return (
            <View style={styles.container}>
                <View style={[styles.pl_25,styles.pr_25,styles.pt_25]}>
                    <Text style={[styles.black_label, styles.default_label]}>{this.activity.rule}</Text>
                </View>
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
});


export const LayoutComponent = ActRule;

export function mapStateToProps(state) {
	return {
        activityflop:state.activity.activityflop,
	};
}


