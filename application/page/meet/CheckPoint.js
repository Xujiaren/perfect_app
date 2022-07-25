//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, StyleSheet } from 'react-native';

import theme from '../../config/theme'
import asset from '../../config/asset'

const status = ['未开始', '进行中', '已完成', '已过期']

// create a component
class CheckPoint extends Component {

    items = []
    state = {
        index: 0,
    }

    componentDidMount() {
        this.onRefresh()
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        const {task} = nextProps
        if (task !== this.props.task) {
            this.items = task
        }
    }

    onRefresh = () => {
        const {actions} = this.props
        const {index} = this.state
        actions.meet.task(index)
    }

    render() {
        const {index} = this.state

        return (
            <View style={[styles.container]}>
                <ScrollView>
                    <View style={[styles.head, styles.p_10]}>
                        <View style={[styles.ai_end]}>
                            <Text style={[styles.white_label]}>规则</Text>
                        </View>
                        <View style={[styles.ai_ct, styles.mt_15]}>
                            <Image source={asset.meet.checkpoint.head} style={[styles.head_icon]}/>
                        </View>
                    </View>
                    <View style={[styles.task, styles.p_15]}>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={[styles.col_1, styles.ai_ct]} onPress={() => this.setState({
                                index: 0,
                            }, () => {
                                this.onRefresh()
                            })}>
                                <Text style={[styles.white_label]}>未开始</Text>
                                <View style={[styles.dot, styles.mt_8, index == 0 && styles.bg_white]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.ai_ct]} onPress={() => this.setState({
                                index: 1,
                            }, () => {
                                this.onRefresh()
                            })}>
                                <Text style={[styles.white_label]}>进行中</Text>
                                <View style={[styles.dot, styles.mt_8, index == 1 && styles.bg_white]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.ai_ct]} onPress={() => this.setState({
                                index: 2,
                            }, () => {
                                this.onRefresh()
                            })}>
                                <Text style={[styles.white_label]}>已完成</Text>
                                <View style={[styles.dot, styles.mt_8, index == 2 && styles.bg_white]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.col_1, styles.ai_ct]} onPress={() => this.setState({
                                index: 3,
                            }, () => {
                                this.onRefresh()
                            })}>
                                <Text style={[styles.white_label]}>已过期</Text>
                                <View style={[styles.dot, styles.mt_8, index == 3 && styles.bg_white]}/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.p_15, styles.bg_white, styles.circle_5, styles.shadow, styles.mt_15]}>
                            <View style={[styles.pb_10, styles.border_bt]}>
                                <Text style={[styles.tip_label]}><Text style={[styles.lg_label, styles.c33_label]}>任务时间</Text></Text>
                            </View>
                            {this.items.map((item, sindex) => {
                                let current = 0
                                if (item.etype == 1) {
                                    current = item.finishCourseNum
                                } else if (item.etype == 2) {
                                    current = item.passPaperNum
                                } else if (item.etype == 3) {
                                    current = item.finishChannelNum
                                } else if (item.etype == 4) {
                                    current = item.watchLiveNum
                                } else if (item.etype == 5) {
                                    current = item.activeNum
                                } else if (item.etype == 6) {
                                    current = item.finishComboCourseNum
                                } else if (item.etype == 7) {
                                    current = item.moodNum
                                } else if (item.etype == 8) {
                                    current = item.exCourseNum
                                }

                                return (
                                    <View style={[styles.pt_15, styles.row, styles.ai_ct]} key={'task_' + sindex}>
                                        <Image source={{uri: item.taskImg}} style={[styles.task_icon]}/>
                                        <View style={[styles.task_info, styles.row, styles.ai_ct, styles.jc_sb, styles.ml_15, styles.border_bt, styles.pb_15]}>
                                            <View>
                                                <Text>{item.taskName} <Text style={[styles.tip_label]}>{current}/{item.taskLimit}</Text></Text>
                                                <Text style={[styles.tip_label, styles.sm_label, styles.mt_10]}>{item.taskSummary}</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.border_tip, styles.circle_20, styles.p_5, styles.pl_10, styles.pr_10]}>
                                                <Text style={[styles.tip_label]}>{status[index]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    head: {
        width: theme.window.width,
        height: theme.window.width * 0.62,
        backgroundColor: '#495AFA'
    },
    head_icon: {
        width: 290,
        height: 84,
    },
    task: {
        marginTop: -theme.window.width * 0.25,
    },
    dot: {
        width: 10,
        height: 4,
        borderRadius: 4,
    },
    task_icon: {
        width: 20,
        height: 20,
    },
    task_info: {
        width: theme.window.width - 100,
    }
});

export const LayoutComponent = CheckPoint;

export function mapStateToProps(state) {
	return {
        task: state.meet.task,
	};
}