import React, { Component } from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,ActivityIndicator,RefreshControl} from 'react-native';

import _ from 'lodash';

import theme from '../../config/theme';
import asset from '../../config/asset';

const nowTime = (new Date()).getTime();


class Smap extends Component {
    static navigationOptions = {
        title:'地图',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;

        this.state = {
           
        };

       
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps){
       
    }




    render() {
        const {navigation} = this.props;
        const {loaded,type,finish,squadId} = this.state;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Image source={asset.map2} style={[styles.map_img]} />
                    <Image source={asset.map1} style={[styles.map_img]} />
                </ScrollView>
                
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FBFDFF',
    },
    map_img:{
        width: '100%',
    }
});

export const LayoutComponent = Smap;

export function mapStateToProps(state) {
	return {

	};
}
