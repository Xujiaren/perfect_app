//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';

import VodCell from '../../component/cell/VodCell'
import Tabs from '../../component/Tabs'
import theme from '../../config/theme'

// create a component
class Channel extends Component {

    static navigationOptions = ({navigation}) => {
        const type = navigation.getParam('type', 'cond')

        let title = '考核条件须知'
        if (type == 'travel') {
            title = '出游小知识'
        } else if (type == 'rite') {
            title = '旅游礼仪'
        } else if (type == 'exchange') {
            title = '游学积分兑换'
        }

		return {
            title: title,
            headerRight: (
                <TouchableOpacity style={[styles.pr_15]} onPress={() => navigation.navigate('MeetPaperChannel')}>
                    <Text style={[styles.sm_label ,styles.sred_label]}>试卷</Text>
                </TouchableOpacity>
            ),
		}
    };

    type = this.props.navigation.getParam('type', 'cond')
    items = []

    state = {
        status: 0,
    }

    componentDidMount() {
        this.onRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {cond, travel, rite, exchange} = nextProps

        if (cond !== this.props.cond) {
            this.items = cond;
        }

        if (travel !== this.props.travel) {
            this.items = travel;
        }

        if (rite !== this.props.rite) {
            this.items = rite;
        }

        if (exchange !== this.props.exchange) {
            this.items = exchange;
        }
    }

    onRefresh = () => {
        const {actions} = this.props

        if (this.type == 'cond') {
            actions.meet.cond()
        } else if (this.type == 'travel') {
            actions.meet.travel()
        } else if (this.type == 'rite') {
            actions.meet.rite()
        } else if (this.type == 'exchange') {
            actions.meet.exchange()
        }
    }

    _onCourse = (course) => {
        const {navigation} = this.props;

        if (course.ctype == 48) {
            navigation.navigate('Vod', {course: course, ctype: 48, courseName: course.courseName});
        } else if(course.ctype === 49){
            navigation.navigate('Vod', {course:course,  ctype: 49, courseName:course.courseName});
        } else if(course.ctype === 50){
            navigation.navigate('Ebook', {course: course, courseName: course.courseName});
        }
    }

    _renderItem = (item) => {
        const course = item.item

        return (
            <VodCell course={course} onPress={() => this._onCourse(course)}/>
        )
    }

    render() {
        const {status} = this.state

        let citems = []

        this.items.map((course, index) => {
            if (status == 0) {
                if (course.isMust == 1) {
                    citems.push(course)
                }
            } else {
                if (course.isMust == 0) {
                    citems.push(course)
                }
            }
        })
        
        return (
            <View style={[styles.container, styles.bg_white]}>
                <Tabs items={['必修','选修']} selected={status} atype={1} onSelect={(index) => {
                    this.setState({
                        status: index
                    })
                }}/>
                <FlatList
                    contentContainerStyle={[styles.p_15]}
                    data={citems}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    thumb: {
        width: 150,
        height: 80,
    },
    info: {
        width: theme.window.width - 190,
        height: 80,
    }
});

export const LayoutComponent = Channel;

export function mapStateToProps(state) {
	return {
        cond: state.meet.cond,
        travel: state.meet.travel,
        rite: state.meet.rite,
        exchange: state.meet.exchange,
	};
}