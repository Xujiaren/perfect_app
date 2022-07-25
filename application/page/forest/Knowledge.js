//攻略
//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import asset from '../../config/asset';

import theme from '../../config/theme'

// create a component
class Knowledge extends Component {

    static navigationOptions = {
        title:'攻略',
        headerRight: <View/>,
    };

    render() {
        return (
            <View style={[styles.container, styles.bg_white]}>
                <ScrollView
                    contentContainerStyle={[styles.p_15]}
                >
                    <Text>基本规则</Text>
                    <View style={[styles.bg_fa, styles.circle_5, styles.p_15, styles.mt_15]}>
                        <Text>规则，一般指由群众共同制定、公认或由代表人统一制定并通过的，由群体里的所有成员一起遵守的条例和章程。它存在三种形式：明规则、潜规则、元规则，无论何种规则只要违背善恶的道德必须严惩不贷以维护世间和谐；明规则是有明文规定的规则，存在需要不断完善的局限性；潜规则是无明文规定的规则，约定俗成无局限性，可弥补明规则不足之处；元规则是一种以暴力竞争解决问题的规则，善恶参半，非道德之理的文明之道。</Text>
                    </View>
                    <TouchableOpacity style={[styles.mt_15]}>
                        <Image source={asset.forest.knowledge.k1} style={[styles.thumb]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mt_15]}>
                        <Image source={asset.forest.knowledge.k2} style={[styles.thumb]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mt_15]}>
                        <Image source={asset.forest.knowledge.k3} style={[styles.thumb]}/>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    thumb: {
        width: theme.window.width - 30,
        height: (theme.window.width - 30) * 0.24
    }
});

export const LayoutComponent = Knowledge;

export function mapStateToProps(state) {
	return {
        
	};
}