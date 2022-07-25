import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { Header } from 'react-navigation-stack';
import Carousel from 'react-native-looped-carousel';
import Swiper from 'react-native-swiper';

import theme from '../../config/theme';
import asset from '../../config/asset';
import iconMap from '../../config/font'

import LabelBtn from '../../component/LabelBtn';
import HudView from '../../component/HudView';

class Niandu extends Component {

    static navigationOptions = {
        title: '年度账单',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        const { navigation } = props;

        this.state = {
            content: '',
            page: 0,
            pages: 0,
            status: 0,
            bills: [],
            music: '',
            key: [],
            keys: [],
            regDays: '',
            regDate: '',
            coverUrl: '',
            can_move: false,
            current: 0,
            open: 0,
            keyword: '',
            img: '',
            words: '',
            indexs: '',
            cover_img: '',
            id: 0,
        };
    }
    componentDidMount() {
        const { actions } = this.props
        let date = new Date()
        let year = date.getFullYear()
        actions.user.userBills({
            year: year,
            resolved: (res) => {
                if (res.bill_info) {
                    let list = res
                    let bill = JSON.parse(list.bill_info.data)
                    let key = JSON.parse(list.bill_data.data)
                    let bills = Object.values(bill)
                    let keys = Object.values(key)
                    let keyss = Object.keys(key)
                    let wds = '${keyword}'
                    this.setState({
                        id: list.bill_info.billId,
                        bills: bills,
                        key: keys,
                        keys: keyss,
                        coverUrl: list.bill_info.coverUrl,
                        indexs: key[wds]
                    })
                }
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }



    render() {
        const { bills, key, keys, music, can_move, current, open, keyword, img, words, indexs } = this.state
        return (
            <View style={[styles.bod]}>
                {
                    bills.length > 0 ?
                        <Swiper
                            horizontal={false}
                            loop={false}
                            index={current}
                            showsPagination={false}
                            onMomentumScrollEnd={(e, state, context) => {
                                console.log(e, state, context)
                            }}
                        >
                            {
                                bills.map((item, index) => {
                                    let word = item.text.split(';')
                                    return (
                                        <View style={[styles.bod]}>
                                            <Image source={{ uri: item.img }} style={[{ width: 375, height: 812 }]} />
                                            <View style={[styles.word]}>
                                                {
                                                    word.map((itm, idx) => {
                                                        var its = itm
                                                        var itt = []
                                                        let vas = ''
                                                        for (var i = 0; i < key.length; i++) {

                                                            if (itm.indexOf(keys[i]) > -1) {
                                                                itt = its.split(keys[i])
                                                                vas = key[i] ? key[i] : '无'
                                                            }

                                                        }
                                                        return (
                                                            <View style={[{ textAlign: item.alignType }, styles.row, item.isRough == 0 ? { fontWeight: 'bolder' } : null]}>
                                                                {
                                                                    itt.length == 0 ?
                                                                        <Text style={[{ letterSpacing: parseInt(item.textSpace), color: item.frontColor, fontSize: parseInt(item.frontSize), lineHeight: parseInt(item.rowSpace) / 10, }]}>{its}</Text>
                                                                        :
                                                                        <Text style={[{ letterSpacing: parseInt(item.textSpace), color: item.frontColor, fontSize: parseInt(item.frontSize), lineHeight: parseInt(item.rowSpace) / 10, }]}>{itt[0]}</Text>
                                                                }
                                                                {
                                                                    itt.length == 0 ?
                                                                        null
                                                                        :
                                                                        <Text style={[{ fontSize: parseInt(item.frontSize2), color: item.frontColor2, lineHeight: parseInt(item.rowSpace) / 10 }]}>{vas}</Text>
                                                                }
                                                                {
                                                                    itt.length == 0 ?
                                                                        null
                                                                        :
                                                                        <Text style={[{ letterSpacing: parseInt(item.textSpace), color: item.frontColor, fontSize: parseInt(item.frontSize), lineHeight: parseInt(item.rowSpace) / 10, }]}>{itt[1]}</Text>
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            {
                                                index == 0 ?
                                                    <View style={[styles.ots,styles.row,styles.jc_ct]}>
                                                        <TouchableOpacity style={[styles.opns]} onPress={()=>this.setState({current:1})}>
                                                            <Text style={[{ color: '#000000', fontSize: 21 }]} onClick={this.onOpens}>开启年度账单</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    );
                                })
                            }
                        </Swiper>
                        : null
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    bod: {
        width: '100%',
        height: '100%'
    },
    word: {
        position: 'absolute',
        top: '20%',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    ots:{
        position:'absolute',
        width:'100%',
        bottom:38,
        left:0,
        zIndex:99
    },
    opns: {
        width: 327,
        height: 57,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000000',
        backgroundColor: '#FAE80D',
        borderRadius: 29,
    }

});

export const LayoutComponent = Niandu;

export function mapStateToProps(state) {
    return {
    };
}
