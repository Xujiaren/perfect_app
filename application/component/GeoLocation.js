import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
    wrapper: {

    },

});

class GeoLocation extends Component {
    constructor(props){
        super(props);
        this.state = {
            initialPosition:'',
            lastPosition:'',
            longitude:'',
        };
    }
    componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true}//这个是精准度
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position.coords.longitude,position.coords.latitude);
            this.setState({lastPosition});
        });
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);//组件被移除的到时候一定要清理
    }
    render() {
        return (
            <View>
                <Text  style={{marginTop:100}}>初始地理位置:</Text>
                <Text>{this.state.initialPosition}</Text>
                <Text style={{marginTop:100}}>持续监听地理位置:{this.state.lastPosition}</Text>
            </View>
        );
    }
}



export default GeoLocation;