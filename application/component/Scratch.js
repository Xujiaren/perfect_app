import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    PanResponder,
} from 'react-native';

import theme from '../config/theme';
import asset from '../config/asset';

const getCoordinate = () => {
    let _width = 300
    let height = 150
    const w = 30
    const h = 30
    // let x = 0
    const result = []

    let y = w / 2
    while (height > w / 2) {
        let width = _width
        let x = w / 2

        while (width > w / 2) {
            result.push({
                x,
                y
            })
            x += w / 5
            width -= w / 5
        }

        y += h / 5
        height -= w / 5
    }

    return result
}
class Scratch extends Component {

    constructor(props) {
        super(props);
        this.touchCoordinates = getCoordinate()
        this.state = {
            showIndexs: {},
            scratch: false,
            haveChance: false,
            itemName: '',
            isReceive: false,
            isNotaward: false,
            content: '',
            canvasbg: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/07f54c7a-fbf2-4820-bef5-2f0aa5f1d8e0.png',
            isScroll: false,
            activityId: 0,
            itemIndex: 0,
            itemIntegral: 0,
            itemImg: '',
        };


    }
    componentWillMount = () => {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                // console.log(111, evt.nativeEvent.locationX, evt.nativeEvent.locationY)
                // gestureState.{x,y} 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                const { locationX, locationY } = evt.nativeEvent

                const touchPoints = this.getTouchPoint(locationX, locationY)

                if (touchPoints.length) {
                    touchPoints.forEach(i => {
                        this.state.showIndexs[i] = true
                    })

                    this.setState({
                        showIndexs: this.state.showIndexs
                    }, () => {
                        if (Object.keys(this.state.showIndexs).length > 120) {
                            this.setState({
                                isReceive: true
                            })
                        }
                    })
                }
                // console.log(233, evt.nativeEvent)
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    }
    getTouchPoint(x, y) {
        const result = []

        this.touchCoordinates.forEach((item, i) => {
            const rangeX = x - item.x
            const rangeY = y - item.y

            if (rangeX <= 6 && rangeX > -6 && rangeY <= 6 && rangeY > -6) {
                if (!this.state.showIndexs[i]) result.push(i)
            }
        })

        return result
    }
    _scratchBtn(scratchId) {
        const { actions } = this.props
        actions.activity.lotteryInfo({
            activity_id: 18,
            ctype: 2,
            content_id: scratchId,
            resolved: (res) => {
                let info = res
                this.setState({
                    itemName: info.itemName,
                    itemIndex: info.itemIndex,
                    itemIntegral: info.integral,
                    haveChance: true,
                    itemImg: info.itemImg
                })
            },
            rejected: (err) => {

            }
        })
    }
    onRecef=()=>{
        this.props.success&&this.props.success()
    }
    render() {
        const { scratch, haveChance, itemName, isReceive, isNotaward, itemImg } = this.state;
        const { scratchId } = this.props
        return (
            <View style={[styles.bgs]}>
                <View style={[styles.bg]}></View>
                <View style={styles.bod}>
                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png' }} style={[{ width: 374, height: 300, position: 'absolute', left: -28, top: -260, zIndex: 99 }]} resizeMode={'cover'} />
                    <View style={[{ width: 320, height: 300, backgroundColor: '#ffffff' }]}>
                        {
                            isReceive ?
                                <View style={[{ width: 300, height: 150, marginTop: 60, marginLeft: 10 }, styles.row, styles.jc_ct, styles.ai_ct, styles.bg_white]}>
                                    <Text>{itemName}</Text>
                                </View>
                                :
                                <View style={styles.container} {...this._panResponder.panHandlers} ref={'test'}>
                                    {/* <View style={[{width:300,height:150},styles.row,styles.jc_ct,styles.ai_ct]}>
                                            <Text>{itemName}</Text>
                                        </View> */}
                                    {
                                        Object.keys(this.state.showIndexs).map((i) => {
                                            const o = this.touchCoordinates[i]
                                            if (haveChance)
                                                return <View key={`show_${i}`} pointerEvents={'none'} style={[styles.img, { left: o.x - 20, top: o.y - 20 }]} ></View>
                                        })
                                    }
                                </View>
                        }
                        {
                            isReceive ?
                                <TouchableOpacity style={[styles.ml_10]} onPress={() => this.onRecef()}>
                                    <View style={[styles.btn, styles.row, styles.jc_ct, styles.ai_ct]}>
                                        <Text style={[styles.white_label, styles.default_label]}>点击领取</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <View>
                                    {
                                        haveChance ?
                                            <View style={[styles.btns, styles.row, styles.jc_ct, styles.ai_ct,styles.ml_10]}>
                                                <Text style={[styles.white_label, styles.default_label]}>点击刮卡</Text>
                                            </View>
                                            :
                                            <TouchableOpacity style={[styles.ml_10]} onPress={() => this._scratchBtn(scratchId)}>
                                                <View style={[styles.btn, styles.row, styles.jc_ct, styles.ai_ct]}>
                                                    <Text style={[styles.white_label, styles.default_label]}>点击刮卡</Text>
                                                </View>
                                            </TouchableOpacity>
                                    }
                                </View>

                        }

                    </View>
                </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    ...theme.base,
    bgs: {
        width: 375,
        height: 812,
        position: 'absolute',
        left: 0,
        top: 0
    },
    bg: {
        width: 375,
        height: 812,
        backgroundColor: '#000000',
        opacity: 0.8,
    },
    bod: {
        position: 'absolute',
        top: 240,
        left: 27,
    },
    container: {
        width: 300,
        height: 150,
        backgroundColor: '#ccc',
        marginTop: 60,
        marginLeft: 10
    },
    img: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
    },
    btn: {
        backgroundColor: '#F4623F',
        width: 300,
        marginTop: 30,
        height: 34,
        borderRadius: 5,
    },
    btns: {
        backgroundColor: '#BFBFBF',
        width: 300,
        marginTop: 30,
        height: 34,
        borderRadius: 5,
    }
});

Scratch.defaultProps = {
    value: 5,
    fontSize: 14,
};

export default Scratch;
