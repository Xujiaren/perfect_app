//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';

import _ from 'lodash';

import HudView from '../../../component/HudView';
import iconMap from '../../../config/font';
import theme from '../../../config/theme'

const ttypes = {'t0': '单选题', 't1': '判断题', 't3': '多选题'};
const chars = ['A', 'B', 'C' , 'D', 'E', 'F', 'G', 'H'];

class Paper extends Component {

    static navigationOptions = {
        title:'试卷名称',
        headerRight: <View/>,
    };

    paper = this.props.navigation.getParam('paper', {paperId: 0});
    levelId = this.props.navigation.getParam('level_id', 1);

    items = [];
    ts = 0;
    testId = 0;

    state = {
        loaded: false,
        done: false,
        topic_index: 0,
        answer: {},
        sheet: false,
    }

    componentDidMount() {
        const {navigation} = this.props

        this.focuSub = navigation.addListener('didFocus', (route) => {
            this.onRefresh()
        })
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove()
    }

    componentWillReceiveProps(nextProps) {
        const {paper} = nextProps

        if (paper !== this.props.paper) {
            this.items = paper.topicList;
            this.testId = paper.testId;
            this.ts = (new Date().getTime() / 1000);
            this.paper = paper;

            this.setState({
                topic_index: 0,
                done: paper.status == 1,
                loaded: true,
            })
        }
    }

    onRefresh = () => {
        const {actions} = this.props
        actions.exam.paper(this.paper.paperId, 0, 0)
    }

    onOption = (ttype, topicId, optionId) => {
        let answer = this.state.answer;
        
        if (answer[topicId] && ttype == 3) {
            let optionIds = answer[topicId];

            if (_.indexOf(optionIds, optionId) >= 0) {
                _.pull(optionIds, optionId);
            } else {
                optionIds.push(optionId);
            }
            
            if (optionIds.length > 0) {
                answer[topicId] = optionIds;
            } else {
                delete answer[topicId];
            }
            
        } else {
            answer[topicId] = [optionId];
        }

        this.setState({
            answer: answer,
        })
    }

    onAnswer = () => {
        const {navigation, actions} = this.props;
        const {answer} = this.state;

        const duration = parseInt((new Date().getTime() / 1000) - this.ts);

        actions.exam.answer({
            level_id: this.levelId,
            test_id: this.testId,
            duration: duration,
            answer: JSON.stringify(answer),
            resolved: (data) => {
                navigation.navigate('MeetPaperStat', {paper: this.paper, level_id: this.levelId})
            },
            rejected: (msg) => {
                this.refs.hud.show('交卷失败，请联系工作人员。', 1);
            }
        })
    }

    render() {
        const {loaded, done, topic_index, answer, sheet} = this.state

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )

        const topic = this.items[topic_index] ? this.items[topic_index] : {};
        if (!topic.topicId) return null;

        let coptionIds = [];
        topic.answer.split(',').map((op, index) => {
            coptionIds.push(parseInt(op));
        })

        let uoptionIds = [];
        topic.userAnswer.answer.split(',').map((op, index) => {
            uoptionIds.push(parseInt(op));
        })

        const optionIds = answer[topic.topicId] || [];

        const pre_enable = topic_index > 0;
        const enable = this.items.length == Object.keys(answer).length;
        const next_enable = topic_index < (this.items.length - 1);

        return (
            <View style={styles.container}>
                {done ? 
                <ScrollView contentContainerStyle={styles.p_20}>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.lg20_label]}>{ttypes['t' + topic.ttype]}</Text>
                        <Text style={[styles.gray_label]}>{topic_index + 1}/{this.items.length}</Text>
                    </View>
                    <Text style={[styles.mt_15, styles.lg_label, styles.lh20_label]}>{topic.title}</Text>
                    <View style={[styles.mt_15]}>
                        {topic.optionList.map((option, index) => {
                            const on = _.indexOf(uoptionIds, option.optionId) >= 0;
                            const correct = _.indexOf(coptionIds, option.optionId) >= 0;

                            return (
                                <View key={['option_' + topic.topicId + '_' + index]} style={[styles.mt_10, styles.mb_10, styles.row, styles.ai_ct]}>
                                    <View style={[styles.dot, on && styles.dot_user_on, correct && styles.dot_correct_on, styles.ai_ct, styles.jc_ct]}>
                                        <Text style={[styles.gray_label, on && styles.white_label, correct && styles.white_label]}>{chars[index]}</Text>
                                    </View>
                                    <Text style={[styles.ml_15, styles.title]}>{option.optionLabel}</Text>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                :
                <ScrollView contentContainerStyle={styles.p_20}>
                    <View style={[styles.row, styles.ai_ct, styles.jc_sb]}>
                        <Text style={[styles.lg20_label]}>{ttypes['t' + topic.ttype]}</Text>
                        <Text style={[styles.gray_label]}>{topic_index + 1}/{this.items.length}</Text>
                    </View>
                    <Text style={[styles.mt_15, styles.lg_label, styles.lh20_label]}>{topic.title}</Text>
                    <View style={[styles.mt_15]}>
                        {topic.optionList.map((option, index) => {
                            const on = _.indexOf(optionIds, option.optionId) >= 0;

                            return (
                                <TouchableOpacity key={['option_' + topic.topicId + '_' + index]} style={[styles.mt_10, styles.mb_10, styles.row, styles.ai_ct]} onPress={() => this.onOption(topic.ttype, topic.topicId, option.optionId)}>
                                    <View style={[styles.dot, on && styles.dot_on, styles.ai_ct, styles.jc_ct]}>
                                        <Text style={[styles.gray_label, on && styles.blue_label]}>{chars[index]}</Text>
                                    </View>
                                    <Text style={[styles.ml_15, styles.title]}>{option.optionLabel}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
                }
                <View style={[styles.toolbar, styles.bg_white, styles.row]}>
                    <TouchableOpacity style={[styles.col_1, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                        sheet: true,
                    })}>
                        <Text style={[styles.lg_label]}><Text style={[styles.icon, styles.lg_label]}>{iconMap('datika')}</Text> 答题情况</Text>
                    </TouchableOpacity>
                    <View style={[styles.col_1, styles.row, styles.ai_ct, styles.jc_ct]}>
                        <TouchableOpacity style={[styles.p_10]} disabled={!pre_enable} onPress={() => this.setState({
                            topic_index: topic_index - 1,
                        })}>
                            <Text style={[styles.tip_label, pre_enable && styles.default_label]}>上一题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.p_10]} disabled={!next_enable} onPress={() => this.setState({
                            topic_index: topic_index + 1,
                        })}>
                            <Text style={[styles.tip_label, next_enable && styles.default_label]}>下一题</Text>
                        </TouchableOpacity>
                    </View>
                    {done ?
                    <View style={[styles.col_1, styles.ai_ct, styles.jc_ct]}>
                        <Text><Text style={[styles.green_label]}>正确{this.paper.correctNum}</Text> <Text style={[styles.orange_label]}>错误{this.paper.topicNum - this.paper.correctNum}</Text></Text>
                    </View>
                    :
                    <TouchableOpacity style={[styles.col_1, styles.ai_ct, styles.jc_ct]} disabled={!enable} onPress={this.onAnswer}>
                        <Text style={[styles.lg_label, styles.tip_label, enable && styles.blue_label]}>交卷</Text>
                    </TouchableOpacity>
                    }
                </View>

                <Modal visible={sheet} transparent={true} onRequestClose={() => {
                    this.setState({sheet:false})
                }}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=>this.setState({sheet:false})}/>
                    <View style={[styles.sheet, styles.bg_white, styles.p_20]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_10, styles.b_line]}>
                            {done ?
                            <Text><Text style={[styles.green_label]}>正确{this.paper.correctNum}</Text> <Text style={[styles.orange_label]}>错误{this.paper.topicNum - this.paper.correctNum}</Text></Text>
                            :
                            <Text>已选{Object.keys(answer).length}</Text>}
                            <Text style={[styles.gray_label]}>{topic_index + 1}/{this.items.length}</Text>
                        </View>
                        <View style={[styles.row, styles.f_wrap, styles.p_10]}>
                            {this.items.map((topic, index) => {
                                let on = false;
                                if (answer[topic.topicId]) {
                                    on = true;
                                }
                                
                                const correct = topic.userAnswer.isCorrect == 1;

                                if (done) {
                                    return (
                                        <TouchableOpacity key={'item_' + index} style={[styles.sheet_item, styles.p_10, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                            topic_index: index
                                        })}>
                                            <View style={[styles.dot, styles.dot_user_on, correct && styles.dot_correct_on, styles.ai_ct, styles.jc_ct]}>
                                                <Text style={[styles.white_label]}>{index + 1}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }

                                return (
                                    <TouchableOpacity key={'item_' + index} style={[styles.sheet_item, styles.p_10, styles.ai_ct, styles.jc_ct]} onPress={() => this.setState({
                                        topic_index: index
                                    })}>
                                        <View style={[styles.dot, on && styles.dot_on, styles.ai_ct, styles.jc_ct]}>
                                            <Text style={[styles.default_label, on && styles.blue_label]}>{index + 1}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </Modal>

                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,

    dot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#EBEBEB',
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    dot_on: {
        backgroundColor: 'white',
        borderColor: '#00A6F6'
    },
    dot_user_on: {
        backgroundColor: '#F4623F',
        borderColor: '#F4623F'
    },
    dot_correct_on: {
        backgroundColor: '#99D321',
        borderColor: '#99D321'
    },
    title: {
        width: theme.window.width - 85,
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    sheet_item: {
        width: (theme.window.width - 60) / 5,
    }
});

export const LayoutComponent = Paper;

export function mapStateToProps(state) {
	return {
        paper: state.exam.paper,
	};
}