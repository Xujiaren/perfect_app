//import liraries
import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView, Text, ImageBackground, StyleSheet } from 'react-native';

import theme from '../../../config/theme'
import asset from '../../../config/asset'

class Stat extends Component {

    static navigationOptions = {
        title:'考试回顾',
        headerRight: <View/>,
    };

    paper = this.props.navigation.getParam('paper', {paperId: 0})
    level_id = this.props.navigation.getParam('level_id', 0)

    items = []

    state = {
        loaded: false,
    }

    componentDidMount() {
        this.onRefresh()
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        const {review} = nextProps

        if (review !== this.props.review) {
            this.paper = review.paper
            this.items = review.paper.topicList

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh = () => {
        const {actions} = this.props
        actions.exam.review(this.paper.testId)
    }

    render() {
        const {loaded} = this.state

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )

        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageBackground source={asset.paper.stat} style={[styles.head, styles.jc_fe]}>
                        <View style={[styles.row, styles.stat]}>
                            <View style={[styles.ai_ct, styles.col_1]}>
                                <Text style={[styles.lg20_label, styles.blue_label, styles.mb_10]}>{this.paper.score}</Text>
                                <Text>成绩</Text>
                            </View>
                            <View style={[styles.ai_ct, styles.col_1]}>
                                <Text style={[styles.lg20_label, styles.blue_label, styles.mb_10]}>{this.paper.correctNum}</Text>
                                <Text>答对</Text>
                            </View>
                            <View style={[styles.ai_ct, styles.col_1]}>
                                <Text style={[styles.lg20_label, styles.blue_label, styles.mb_10]}>{this.items.length - this.paper.correctNum}</Text>
                                <Text>答错</Text>
                            </View>
                            <View style={[styles.ai_ct, styles.col_1]}>
                                <Text style={[styles.lg20_label, styles.blue_label, styles.mb_10]}>{this.paper.duration}s</Text>
                                <Text>耗时</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={[styles.p_15, styles.pl_30, styles.pr_30]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                            <Text style={[styles.lg_label]}>考试回顾</Text>
                            <View style={[styles.row, styles.ai_ct]}>
                                <View style={[styles.row, styles.ai_ct]}>
                                    <View style={[styles.icon_small, styles.bg_fgreen, styles.circle_10, styles.mr_5]}/>
                                    <Text>正确</Text>
                                </View>
                                <View style={[styles.row, styles.ai_ct, styles.ml_15]}>
                                    <View style={[styles.icon_small, styles.bg_sred, styles.circle_10, styles.mr_5]}/>
                                    <Text>错误</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.row, styles.f_wrap, styles.mt_15, styles.border_top, styles.pt_15]}>
                            {this.items.map((item, index) => {
                                const error = item.userAnswer.isCorrect == 0

                                return (
                                    <View key={'topic_' + index} style={[styles.item, styles.p_10, styles.ai_ct, styles.jc_ct]}>
                                         <View style={[styles.dot, styles.bg_green, error && styles.bg_sred, styles.ai_ct, styles.jc_ct]}>
                                            <Text style={[styles.white_label]}>{index + 1}</Text>
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
        height: theme.window.width * 0.723,
    },
    stat: {
        margin: 30,
    },
    item: {
        width: (theme.window.width - 60) / 5,
    },
    dot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#EBEBEB',
    }
});

export const LayoutComponent = Stat;

export function mapStateToProps(state) {
	return {
        review: state.exam.review,
	};
}