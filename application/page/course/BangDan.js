import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Keyboard } from 'react-native';
import _ from 'lodash';

import HudView from '../../component/HudView';
import Picker from 'react-native-picker';
import { liveday } from '../../util/common'
import { config, asset, theme, iconMap } from '../../config';
import request from '../../util/net';
import { Image } from 'react-native-animatable';

class BangDan extends Component {
    static navigationOptions = ({ navigation }) => {

        return {
            header: null
        }
    };
    constructor(props) {
        super(props);
        const { navigation } = props;
        this.course = navigation.getParam('course', {});
        this.state = {
            list: [],
            background: '',
        }
    }
    live = []

    componentDidMount() {
        const { actions } = this.props
        actions.user.bangdan({
            course_id: this.course.courseId,
            resolved: (res) => {
                this.setState({
                    list: res
                })
            },
            rejected: (err) => {

            }
        })
    }

    componentWillReceiveProps(nextProps) {

    }

    infoName = (val) => {
        if (val.length > 5) {
            return val.slice(0, 5) + '...'
        } else {
            return val
        }
    }



    render() {
        const { navigation } = this.props
        const { list } = this.state
        let one = []
        let two = []
        let three = []
        let ones = []
        let twos = []
        let threes = []
        if (list.length > 0) {
            one = Object.values(list[0])
            ones = Object.keys(list[0])
        }
        if (list.length > 1) {
            two = Object.values(list[1])
            twos = Object.keys(list[1])
        }
        if (list.length > 2) {
            three = Object.values(list[2])
            threes = Object.keys(list[2])
        }
        return (
            <View style={[styles.container, { position: 'relative' }]}>
                {
                    this.course.beginUrl ?
                        <Image source={{ uri: this.course.beginUrl }} style={{ width: theme.window.width, height: theme.window.height }} />
                        : null
                }
                <View style={[styles.bgs]}></View>
                <View style={[styles.bod]}>
                    <View style={[styles.row, styles.jc_sb, styles.ai_ct, { width: theme.window.width, marginTop: 38, paddingLeft: 20, paddingRight: 20 }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={asset.back_w} style={[{ width: 24, height: 24 }]} />
                        </TouchableOpacity>
                        <View>
                            <Text style={[{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }]}>贡献榜</Text>
                        </View>
                        <View></View>
                    </View>
                    <View style={[styles.tips, styles.row, styles.jc_sb]}>
                        <View>
                            <View style={[styles.row, styles.jc_ct]}>
                                <View style={[styles.prt, { marginTop: 4 }]}>
                                    <Image source={asset.two} style={[styles.cover]} />
                                    {
                                        list.length > 1 ?
                                            <Image source={{ uri: two[0].avatar }} style={[styles.pics]} />
                                            : null
                                    }
                                </View>
                            </View>
                            <View style={[styles.mt_10]}>
                                <View style={[styles.row, styles.jc_ct]}>
                                    {
                                        two.length > 0 ?
                                            <Text style={[styles.threess]}>{this.infoName(two[0].nickname)}</Text>
                                            :
                                            <Text style={[styles.threess]}>{''}</Text>
                                    }
                                </View>
                                <View style={[styles.row, styles.jc_ct, styles.mt_5]}>
                                    <Text style={[styles.threes]}>{two.length > 0 ? twos[0] + '学分' : null}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={[styles.row, styles.jc_ct]}>
                                <View style={[styles.prt]}>
                                    <Image source={asset.one} style={[styles.covers]} />
                                    {
                                        list.length > 0 ?
                                            <Image source={{ uri: one[0].avatar }} style={[styles.picss]} />
                                            : null
                                    }
                                </View>
                            </View>
                            <View style={[styles.mt_10]}>
                                <View style={[styles.row, styles.jc_ct]}>
                                    {
                                        one.length > 0 ?
                                            <Text style={[styles.threess]}>{this.infoName(one[0].nickname)}</Text>
                                            :
                                            <Text style={[styles.threess]}>{''}</Text>
                                    }
                                </View>
                                <View style={[styles.row, styles.jc_ct, styles.mt_5]}>
                                    <Text style={[styles.threes]}>{one.length > 0 ? ones[0] + '学分' : null}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={[styles.row, styles.jc_ct]}>
                                <View style={[styles.prt, { marginTop: 4 }]}>
                                    <Image source={asset.three} style={[styles.cover]} />
                                    {
                                        list.length > 2 ?
                                            <Image source={{ uri: three[0].avatar }} style={[styles.pics]} />
                                            : null
                                    }
                                </View>
                            </View>
                            <View style={[styles.mt_10]}>
                                <View style={[styles.row, styles.jc_ct]}>
                                    {
                                        three.length > 0 ?
                                            <Text style={[styles.threess]}>{this.infoName(three[0].nickname)}</Text>
                                            :
                                            <Text style={[styles.threess]}>{''}</Text>
                                    }
                                </View>
                                <View style={[styles.row, styles.jc_ct, styles.mt_5]}>
                                    <Text style={[styles.threes]}>{three.length > 0 ? threes[0] + '学分' : null}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.down]}>
                        {
                            list.length > 2 && list.map((item, index) => {
                                let mss = Object.values(item)
                                let value = Object.keys(item)
                                if (index > 2 && index < 12) {
                                    return (
                                        <View style={[styles.row, styles.jc_sb, styles.ai_ct, styles.mt_25, { paddingLeft: 30, paddingRight: 30 }]}>
                                            <View style={[styles.row, styles.ai_ct]}>
                                                <View>
                                                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{index + 1}</Text>
                                                </View>
                                                <Image source={{ uri: mss[0].avatar }} style={[styles.apicss, styles.ml_10]} />
                                            </View>
                                            <View>
                                                <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{mss[0].nickname}</Text>
                                            </View>
                                            <View>
                                                <Text style={[{ fontSize: 16, fontWeight: 'bold' }]}>{value[0]}学分</Text>
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }

                    </View>
                </View>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    bgs: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: theme.window.width,
        height: theme.window.height,
        backgroundColor: '#000000',
        opacity: 0.6
    },
    bod: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: theme.window.width,
        height: theme.window.height,
        zIndex: 9,
    },
    tips: {
        marginTop: 60,
        paddingLeft: 45,
        paddingRight: 45,
    },
    cover: {
        width: 55,
        height: 55
    },
    covers: {
        width: 61,
        height: 61
    },
    prt: {
        position: 'relative'
    },
    down: {
        backgroundColor: '#ffffff',
        width: theme.window.width-32,
        height: theme.window.height * 0.68,
        borderRadius: 20,
        position: 'absolute',
        left: 16,
        bottom: -20,
    },
    apicss: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    pics: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        position: 'absolute',
        left: 9,
        top: 9,
    },
    picss: {
        width: 51,
        height: 51,
        borderRadius: 25.5,
        position: 'absolute',
        left: 9.5,
        top: 9.5,
    },
    threes: {
        fontWeight: '300',
        fontSize: 12,
        color: '#ffffff'
    },
    threess: {
        fontWeight: '500',
        fontSize: 13,
        color: '#ffffff'
    }
});

export const LayoutComponent = BangDan;

export function mapStateToProps(state) {
    return {

    };
}


