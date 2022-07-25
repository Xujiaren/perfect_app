//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import _ from 'lodash';

import Tabs from '../../component/Tabs';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import VodCell from '../../component/cell/VodCell'
import theme from '../../config/theme'
import {liveday} from '../../util/common'

// create a component
class LiveChannel extends Component {

    static navigationOptions = {
        title:'直播频道',
        headerRight: <View/>,
    };

    state = {
        status: 0,
        refreshState: RefreshState.Idle,
    }

    page = 0
    pages = 1
    items = []

    componentDidMount() {
        this._onHeaderRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {live, liveback} = nextProps;

        if (live !== this.props.live) {
            this.pages = live.pages
            this.items = this.items.concat(live.items)
        }

        if (liveback !== this.props.liveback) {
            this.pages = liveback.pages
            this.items = this.items.concat(liveback.items)
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onBook = (course) => {
        const {user, navigation, actions} = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            actions.course.book({
                course_id: course.courseId,
                resolved: (data) => {
                    this.refs.hud.show('预约成功', 1);
                    this._onHeaderRefresh()
                },
                rejected: (msg) => {

                }
            })
        }
    }

    _onHeaderRefresh = () => {
        const {actions} = this.props
        const {status} = this.state

        this.page = 0
        this.pages = 1
        this.items = []
        
        if (status == 0) {
            actions.meet.live(0)
        } else {
            actions.meet.liveback(0)
        }

        this.setState({refreshState: RefreshState.HeaderRefreshing})
    }

    _onFooterRefresh = () => {
        const {actions} = this.props;
        const {status} = this.state;

        if (this.page < this.pages) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page++;

            if (status == 0) {
                actions.meet.live(this.page)
            } else {
                actions.meet.liveback(this.page)
            }
        }  else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem = (item) => {
        const {navigation} = this.props
        const {status} = this.state
        const course = item.item

        if (status == 1) {
            return <VodCell course={course} onPress={() => navigation.navigate('Vod', {course: course, courseName: course.courseName})}/>
        }

        return (
            <TouchableOpacity style={[styles.bg_white, styles.p_10, styles.circle_10, styles.shadow, styles.mb_15]}  onPress={() => navigation.navigate('Live', {course: course})}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.pb_10, styles.border_bt]}>
                    <Text style={[styles.sm_label]}>{liveday(course.beginTime)}</Text>
                    <Text style={[styles.sm_label, styles.tip_label]}>{course.hit}人正在上课</Text>
                </View>
                <View style={[styles.row, styles.mt_10, styles.pb_10]}>
                    <View style={[styles.col_3]}>
                        <Text style={[styles.lg_label]}>{course.courseName}</Text>
                        <Text style={[styles.sm_label, styles.mt_10, styles.gray_label]}>{course.Summary}</Text>
                    </View>
                    <View style={[styles.col_1, styles.ai_end, styles.jc_ct]}>
                        <TouchableOpacity style={[styles.bg_sred, styles.circle_10, styles.p_5, styles.pl_10, styles.pr_10]} disabled={course.book} onPress={() => this._onBook(course)}>
                            <Text style={[styles.sm_label, styles.white_label]}>预约</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {status} = this.state

        return (
            <View style={styles.container}>
                <View style={[styles.bg_white]}>
                    <Tabs items={['直播预告','直播回放']} selected={status} atype={1} onSelect={(index) => {
                        this.setState({
                            status: index
                        }, () => {
                            this._onHeaderRefresh()
                        })
                    }}/>
                </View>
                <RefreshListView
                    contentContainerStyle={[styles.p_15]}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = LiveChannel;

export function mapStateToProps(state) {
	return {
        live: state.meet.live,
        liveback: state.meet.liveback,
	};
}