import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import RefreshListView, { RefreshState } from '../../component/RefreshListView';

import theme from '../../config/theme';
import iconMap from '../../config/font';

class LectCourse extends Component {

    static navigationOptions = {
        title: '我的课程',
        headerRight: <View />,
    };

    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.course = []
        this.teacherDTO = navigation.getParam('teacherDTO', { teacherId: 0 });
        this.state = {
            status: 0,
            nowdate: 0
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onPress = this._onPress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { teacherCourse } = nextProps;

        if (teacherCourse !== this.props.teacherCourse) {
            this.course = teacherCourse;
        }


        setTimeout(() => this.setState({ refreshState: RefreshState.Idle }), 300);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    _onPress(course) {
        const { navigation } = this.props;
        if (course.ctype === 0 || course.ctype === 2) {
            navigation.navigate('Vod', { course: course })
        } else if (course.ctype === 1) {
            navigation.navigate('Audio', { course: course })
        } else if (course.ctype === 3) {
            navigation.navigate('Graphic', { course: course, courseName: course.courseName });
        }
    }


    _onHeaderRefresh() {
        const { actions } = this.props;

        this.course = [];

        actions.teacher.teacherCourse(this.teacherDTO.teacherId);

        this.setState({ refreshState: RefreshState.HeaderRefreshing });
    }

    _renderItem(item) {
        const course = item.item;

        return (
            <TouchableOpacity style={[styles.fd_r, styles.pb_15]} onPress={() => this._onPress(course)}>
                <View>
                    <Image source={{ uri: course.courseImg }} mode='aspectFit' style={[styles.item_cover]} />
                    {
                        course.chapter > 1 ?
                            <View style={[styles.item_tips_hit]}>
                                <Text style={[styles.icon, styles.sm8_label, styles.white_label]}>{iconMap('youyinpin')}</Text>
                                <Text style={[styles.sm8_label, styles.white_label, styles.ml_5]}>{course.chapter}讲</Text>
                            </View>
                            : null
                    }
                </View>
                <View style={[styles.fd_c, styles.pl_10, styles.jc_sb, styles.col_1]}>
                    <View style={[styles.fd_c]}>
                        <Text style={[styles.default_label, styles.c33_label, styles.fw_label]} numberOfLines={1}>{course.courseName}</Text>
                    </View>

                    <View style={[styles.fd_r, styles.ai_ct, styles.mt_5, styles.jc_sb]}>
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <Text style={[styles.sm_label, styles.c33_label, styles.ml_5]}>{course.integral > 0 ? course.integral + '学分' : '免费'}</Text>
                        </View>
                        <View style={[styles.fd_r, styles.ai_ct]}>
                            <Text style={[styles.gray_label, styles.sm_label, styles.pl_3]}>综合评分：{course.score}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }



    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.tops, styles.row, styles.jc_ad, styles.ai_ct]}>
                    <View>
                        <View>
                            <Text style={[styles.blues]}>{this.teacherDTO.courseNum}</Text>
                        </View>
                        <View>
                            <Text style={[styles.grays, styles.mt_10]}>授课总数</Text>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={[styles.blues]}>{this.teacherDTO.hour}</Text>
                        </View>
                        <View>
                            <Text style={[styles.grays, styles.mt_10]}>授课课时</Text>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={[styles.blues]}>{this.teacherDTO.newCourse}</Text>
                        </View>
                        <View>
                            <Text style={[styles.grays, styles.mt_10]}>本年新课</Text>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={[styles.blues]}>{this.teacherDTO.percent}</Text>
                        </View>
                        <View>
                            <Text style={[styles.grays, styles.mt_10]}>满意度</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.wrap}>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.course}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    wrap: {
        paddingLeft: 20,
        paddingRight: 24,
        marginTop: 15
    },
    item_cover: {
        width: 136,
        height: 72,
        borderRadius: 5,
        backgroundColor: '#fafafa',
    },
    item_tips_hit: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 14,
        width: 40,
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cate_new_cover: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    cate_new_icon: {
        width: 18,
        height: 12
    },
    view_icon: {
        width: 13,
        height: 13
    },
    tops: {
        height: 90,
        width: '100%',
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    blues: {
        color: '#0098FF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    grays: {
        color: '#666666',
        fontSize: 14,
        textAlign: 'center'
    }
})

export const LayoutComponent = LectCourse;

export function mapStateToProps(state) {
    return {
        teacherCourse: state.teacher.teacherCourse
    };
}
