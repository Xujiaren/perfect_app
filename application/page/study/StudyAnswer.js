import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

import HudView from '../../component/HudView';
import theme from '../../config/theme';

class StudyAnswer extends Component {

    static navigationOptions = {
        title: '闯关答题',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);
        this.examPaper = {};
        this.topicList = [];
        this.min = 60;
        this.second = 0;
        this.state = {
            loaded: false, // 数据未加载完 不显示页面
            status: 0,
            paper_id: 0, // 试卷id
            levelId: 0,
            topic_index: 0, // 第几题
            answer_list: {},
            answer_lists: {},
            topicStaus: 0,// 考试状态
            ttype: 0, // 0 单选  3 多选
            levelId: 0, // 等级
            course_id: 0,
            second: 0,
            min: 60,
            onup: false,
        }


        this._renderTopic = this._renderTopic.bind(this)
        this._onNext = this._onNext.bind(this)
        this._onPrev = this._onPrev.bind(this)
        this._onSubmit = this._onSubmit.bind(this)

    }

    componentWillReceiveProps(nextProps) {

        const { examPaper } = nextProps;

        if (examPaper !== this.props.examPaper) {

            this.examPaper = examPaper;
            this.topicList = examPaper.topicList;

            this.setState({
                loaded: true,
            })
        }


    }


    componentWillMount() {

        const { navigation } = this.props
        const { params } = navigation.state

        const { paper_id, levelId } = params
        this.setState({
            paper_id: paper_id,
            levelId: levelId
        })

    }

    componentDidMount() {
        const { actions } = this.props
        const { paper_id, levelId, min, second, onup } = this.state

        actions.user.examPaper(paper_id, levelId)
        setInterval(() => {
            if (this.min > 0) {
                if (this.second > 0) {
                    this.second = this.second - 1
                    this.setState({
                        second: this.second,
                    })
                } else {
                    this.second = 59
                    this.min = this.min - 1
                    this.setState({
                        second: 59,
                        min: this.min
                    })
                }
            } else {
                if (this.second > 0) {
                    this.second = this.second - 1
                    this.setState({
                        second: this.second,
                    })
                } else {
                    if (!onup) {
                        this.setState({
                            onup: true
                        })
                    }
                }
            }
        }, 1000);
    }


    //下一题
    _onNext() {
        let { topic_index } = this.state;

        if (topic_index < this.topicList.length - 1) {
            topic_index++;
            this.setState({
                topic_index: topic_index,
            })
        } else if (topic_index === this.topicList.length - 1) {
            this.refs.hud.show('已是最后一题', 1);
        }
    }

    // 上一题
    _onPrev() {
        let { topic_index } = this.state;

        if (topic_index > 0) {
            topic_index--;
            this.setState({
                topic_index: topic_index
            })
        }

    }
    _onAnswer(ttype, topic_id, ctopic_id, index, optionId) {

        const { answer_list, answer_lists } = this.state;

        if (ttype === 0 || ttype === 1) {
            let answer_arr_num = (optionId + '').split(",").map(Number)
            answer_list[parseInt(topic_id)] = (optionId + '').split(",")
            answer_lists[parseInt(topic_id)] = answer_arr_num


        } else if (ttype === 3) {

            if (answer_list[topic_id] === undefined || answer_list[topic_id] === "") {
                let answer_ids = []

                if (answer_ids.indexOf(optionId + '') > -1) {
                    answer_ids.splice(answer_ids.indexOf(optionId + ''), 1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str = answer_ids.join(",")

                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ids.map(Number)

            } else {
                let answer_ids = answer_list[topic_id].split(",")
                if (answer_ids.indexOf(optionId + '') > -1) {
                    answer_ids.splice(answer_ids.indexOf(optionId + ''), 1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str = answer_ids.join(",")

                let answer_ar = answer_ids.map(Number)

                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ar


            }
        }

        this.setState({
            answer_list: answer_list,
            answer_lists: answer_lists
        })
    }
    _onSubmit() {
        const { actions, navigation } = this.props;
        const { duration, testId, paper_id, answer_lists, percentage, squadId, levelId } = this.state;

        actions.train.userExam({
            test_id: this.examPaper.testId,
            levelId: levelId,
            duration: 10,
            answer: JSON.stringify(answer_lists),
            resolved: (data) => {
                let val = data.split('-')
                if (val[0] == 'true') {
                    actions.study.testScore({
                        test_id: this.examPaper.testId,
                        resolved: (res) => {
                            let score = res.score
                            Alert.alert('提示', '试卷已提交，当前分数' + val[1] + '分，及格分数为' + val[2] + '分，历史最高分' + score + '分', [
                                {
                                    text: '确定', onPress: () => {
                                        actions.course.LevelStatus({
                                            levelId: levelId,
                                            resolved: (ress) => {
                                                let levelData = ress
                                                setTimeout(() => {
                                                    navigation.goBack()
                                                    navigation.state.params.refresh()
                                                }, 2000)
                                            },
                                            rejected: (err) => {

                                            }
                                        })

                                    }
                                }])

                        },
                        rejected: (err) => {

                        }
                    })
                } else {
                    actions.study.testScore({
                        test_id: this.examPaper.testId,
                        resolved: (res) => {
                            let score = res.score
                            Alert.alert('提示', '试卷已提交，当前分数' + val[1] + '分，及格分数为' + val[2] + '分，历史最高分' + score + '分，答题不及格，未通过', [
                                {
                                    text: '确定', onPress: () => {
                                        actions.course.LevelStatus({
                                            levelId: levelId,
                                            resolved: (ress) => {
                                                let levelData = ress
                                                setTimeout(() => {
                                                    navigation.goBack()
                                                    navigation.state.params.refresh()
                                                }, 2000)
                                            },
                                            rejected: (err) => {

                                            }
                                        })

                                    }
                                }])
                        }
                    })
                }



            },
            rejected: (res) => {

            },
        })
    }


    _renderTopic() {
        const { topic_index, answer_list } = this.state;

        let qust = this.topicList[topic_index];

        if (qust.ttype === 0 || qust.ttype === 1) {
            return (
                // <View style={styles.topic_content_wrap}>
                //     <View style={styles.topic_content}>
                //         <View style={styles.topic_title}>
                //             <Text style={[styles.lg_label,styles.c33_label,styles.lh20_label]}>今天的你快乐吗</Text>
                //         </View>
                //     </View>

                // </View>
                <View style={[styles.topic_content_wrap]}>
                    <View style={[styles.topic_type]}>
                        <Text style={[styles.topic_type_title]}>{qust.ttype === 0 ? '单选' : '判断'}</Text>
                        <Text style={[styles.topic_type_num]}><Text style={[styles.text_bold]}>{topic_index + 1}</Text>/{this.topicList.length}</Text>
                    </View>
                    <View style={[styles.topic_content]}>
                        <View style={[styles.lh25_label, styles.lg_label, styles.c33_label]}><Text>{qust.title}</Text></View>
                        {
                            this.topicList[topic_index].optionList.map((qustion, index) => {

                                const on = answer_list[this.topicList[topic_index].topicId] == qustion.optionId;

                                return (
                                    <TouchableOpacity style={[styles.mt_20, styles.fd_r, styles.jc_fs, styles.ai_ct]} key={index + '_index'} onPress={() => this._onAnswer(qust.ttype, qust.topicId, 0, index, qustion.optionId)}>
                                        <View style={[styles.item_icon, on && styles.item_onicon, styles.ai_ct, styles.jc_ct, styles.mr_15]}>
                                            <Text style={[styles.default_label, styles.gray_label]}>{String.fromCharCode(index + 65)}</Text>
                                        </View>
                                        <View style={[styles.viewEword, { width: 260 }]}  >
                                            <Text style={[styles.item_txt, on && styles.item_ontxt]}>{qustion.optionLabel}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.topic_content_wrap}>
                    <View style={[styles.topic_type]}>
                        <Text style={[styles.topic_type_title]}>多选</Text>
                        <Text style={[styles.topic_type_num]}><Text style={[styles.text_bold]}>{topic_index + 1}</Text>/{this.topicList.length}</Text>
                    </View>
                    <View style={styles.topic_content}>
                        <View><Text style={[styles.lg_label, styles.c33_label, styles.lh20_label]}>{qust.title}</Text></View>
                        {
                            this.topicList[topic_index].optionList.map((qustion, index) => {

                                let on = false;
                                if (answer_list[this.topicList[topic_index].topicId] !== undefined) {
                                    on = (answer_list[this.topicList[topic_index].topicId]).indexOf(qustion.optionId) > -1;
                                }

                                return (
                                    <TouchableOpacity key={index + '_index'} style={[styles.choosen_item, styles.fd_r, styles.jc_fs, styles.ai_ct, styles.mt_20]} onPress={() => this._onAnswer(qust.ttype, qust.topicId, 0, index, qustion.optionId)}>
                                        <View style={[styles.item_icon, on && styles.item_onicon, styles.ai_ct, styles.jc_ct, styles.mr_15]}>
                                            <Text style={[styles.default_label, styles.gray_label]}>{String.fromCharCode(index + 65)}</Text>
                                        </View>
                                        <View style={[styles.viewEword, { width: 260 }]}>
                                            <Text style={[styles.lh18_label, styles.lg_label, styles.c33_label, on && styles.item_ontxt]}>{qustion.optionLabel}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }

                    </View>
                </View>
            )
        }
        //  if (qust.ttype === 3) {
        //     <View style={styles.topic_content_wrap}>
        //         <View style={styles.topic_content}>
        //             <View style={styles.topic_title}>
        //                 <Text style={[styles.lg_label, styles.c33_label, styles.lh20_label]}>今天的你快乐吗</Text>
        //             </View>
        //         </View>
        //     </View>
        // }

    }


    render() {

        const { paper_id, levelId, topic_index, loaded, status, min, second, onup } = this.state;
        if (onup) {
            this._onSubmit()
        }
        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )


        return (
            <View style={styles.container}>
                {/* <View style={styles.topic_type}>
                    <Text style={[styles.c33_label,styles.lg20_label,styles.fw_label]}>{'单选'}</Text>
                    <Text style={styles.topic_type_num}><Text style={[styles.lg_label,styles.gray_label]}>{topic_index+1}</Text>/{this.topicList.length}</Text>
                </View> */}
                <View style={[styles.row, styles.jc_sb]}>
                    <View></View>
                    <View style={[styles.mt_5, styles.mb_5, styles.pr_20]}>
                        <Text style={[{ fontSize: 13, color: '#333333' }]}>{min.toString().length == 1 ? 0 + min : min}:{second.toString().length == 1 ? '0' + second : second}</Text>
                    </View>
                </View>
                <ScrollView>
                    {
                        this.topicList.length > 0 && (status === 0 || status === 1) ?
                            <View style={[styles.topic_wrap, styles.pl_20, styles.pr_20, styles.pb_20]}>
                                {this._renderTopic()}
                            </View>
                            : null}
                </ScrollView>
                <View style={[styles.topic_menu]}>
                    <TouchableOpacity style={[styles.col_1, styles.text_c, styles.btn_nxt]}
                        onPress={this._onNext}
                    >
                        <Text >下一题</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.col_1, styles.btn_prv, styles.text_c]}
                        onPress={this._onPrev}
                    >
                        <Text style={[styles.text_c]}>上一题</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.submit_btn]}
                        onPress={this._onSubmit}
                    >
                        <Text style={[styles.c33_label, styles.lg_label]}>交卷</Text>
                    </TouchableOpacity>
                </View>

                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#FBFDFF',
    },
    topic_content_wrap: {
        paddingBottom: 60,
    },
    topic_type: {
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 16,
        paddingBottom: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topic_content: {
        paddingLeft: 20,
        paddingRight: 5
    },
    item_icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#EBEBEB'
    },
    item_onicon: {
        backgroundColor: '#99D321'
    },
    topic_menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#ffffff',
        height: 50,
        zIndex: 2,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 1
    },
    submit_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: 50,
    },
    btn_prv: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRightColor: 'rgba(240,240,240,1)',
        borderRightWidth: 1,
        borderStyle: 'solid',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(240,240,240,1)'
    },
    btn_nxt: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    }
})


export const LayoutComponent = StudyAnswer;

export function mapStateToProps(state) {
    return {
        examPaper: state.user.examPaper
    };
}
