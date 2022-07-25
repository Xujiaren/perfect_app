import React, { Component } from 'react';
import { Text, View , StyleSheet,Image,Modal} from 'react-native';

import theme from '../config/theme';
import asset from '../config/asset';

export default class Tips extends Component {
    render() {
        const {goldvalue} = this.props;
        return (
            <Modal  transparent={true} visible={true} onRequestClose={() => {}}>
                <View style={styles.ctypelayer}></View>
                <View style={styles.dialog}>
                    <View style={[styles.wrappost]}>
                        <Text style={[styles.white_label,styles.lg_label]}>获得</Text>
                        <Image source={asset.goldtip} style={[styles.goldtip]} />
                        <Text style={[styles.white_label,styles.lg_label]}>学分+{goldvalue}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    ctypelayer:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.1)',
    },
    dialog:{
        position:'absolute',
        top:'50%',
        left:'50%',
        marginLeft:-90,
        marginTop:-78,
        backgroundColor:'rgba(0,0,0,0.4)',
        width:180,
        height:156,
        borderRadius:5,
    },
    wrappost:{
        width:'100%',
        height:'100%',
        position:'absolute',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        zIndex:999,
    },
    goldtip:{
        width:50,
        height:50,
        marginTop:10,
        marginBottom:10,
    },
});
