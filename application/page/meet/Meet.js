import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'

import _ from 'lodash';
import Carousel, {Pagination} from 'react-native-snap-carousel'
import VodCell from '../../component/cell/VodCell'
import VVodCell from '../../component/cell/VVodCell'
import HudView from '../../component/HudView'

import {liveday} from '../../util/common'
import theme from '../../config/theme'
import iconMap from '../../config/font'

// create a component
class Meet extends Component {

    static navigationOptions = {
        title:'海外研讨会',
        headerRight: <View/>,
    };

    ads = []
    conds = []
    travels = []
    rites = []

    lives = []
    livebacks = []
    excourses = []
    
    
    state = {
        currentAd: 0,
    }

    componentDidMount() {
        const {navigation} = this.props
        this.onRefresh()

        //navigation.navigate('MeetPaperChannel')
    }

    componentWillReceiveProps(nextProps) {
        const {advert, cond, travel, rite, exchange, live, liveback} = nextProps
        if (advert !== this.props.advert) {
            this.ads = advert;
        }

        if (cond !== this.props.cond) {
            this.conds = cond;
        }

        if (travel !== this.props.travel) {
            this.travels = travel;
        }

        if (rite !== this.props.rite) {
            this.rites = rite;
        }

        if (exchange !== this.props.exchange) {
            this.excourses = exchange;
        }

        if (live !== this.props.live) {
            this.lives = live.items;
        }

        if (liveback !== this.props.liveback) {
            this.livebacks = liveback.items;
        }
    }

    onRefresh = () => {
        const {actions} = this.props;
        actions.user.user()
        actions.site.advert(7)
        actions.meet.cond()
        actions.meet.travel()
        actions.meet.rite()
        actions.meet.exchange()

        actions.meet.live(0)
        actions.meet.liveback(0)
    }

    _onCourse = (course) => {
        const {navigation} = this.props;

        if (course.ctype == 48) {
            navigation.navigate('Vod', {course: course, ctype: 48, courseName: course.courseName});
        } else if(course.ctype === 49){
            navigation.navigate('Vod', {course:course,  ctype: 49, courseName:course.courseName});
        } else if(course.ctype === 50){
            navigation.navigate('Ebook', {course: course, courseName: course.courseName});
        } else {
            navigation.navigate('Vod', {course: course, courseName: course.courseName});
        }
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
                    actions.meet.live(0)
                },
                rejected: (msg) => {

                }
            })
        }
    }

    _renderAdItem = ({item, index}) => {
        return (
            <TouchableOpacity>
                <Image source={{uri: item.fileUrl}} style={[styles.ad_img, styles.bg_wred, styles.circle_10]}/>
            </TouchableOpacity>
        )
    }

    render() {
        const {navigation} = this.props
        const {currentAd} = this.state

        return (
            <View style={[styles.container]}>
                <ScrollView contentContainerStyle={[styles.p_15]}>
                    <View>
                        <Carousel
                            useScrollView={true}
                            data={this.ads}
                            autoplay={true}
                            loop={true}
                            autoplayDelay={5000}
                            renderItem={this._renderAdItem}
                            
                            itemWidth={theme.window.width - 30}
                            itemHeight={(theme.window.width - 30) * 0.39}

                            sliderWidth={theme.window.width - 30}
                            sliderHeight={(theme.window.width - 30) * 0.39}

                            activeSlideAlignment={'center'}
                            inactiveSlideScale={0.7}
                            onSnapToItem = {(index) => this.setState({currentAd: index})}
                        />

                        <Pagination
                            dotsLength={this.ads.length}
                            activeDotIndex={currentAd}
                            containerStyle={styles.ad_page}
                            dotStyle={styles.ad_dot}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>

                    <View style={[styles.mt_15, styles.p_15, styles.bg_white, styles.circle_10, styles.shadow]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mb_15]}>
                            <Text style={[styles.lg18_label]}>考核条件须知</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('MeetChannel', {type: 'cond'})}>
                                <Text style={[styles.tip_label]}>更多</Text>
                                <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {this.conds.map((course, cindex) => {
                                return (
                                    <VodCell course={course} key={'cond_' + cindex} onPress={() => this._onCourse(course)}/>
                                )
                            })}
                        </View>
                    </View>

                    <View style={[styles.mt_15, styles.p_15, styles.bg_white, styles.circle_10, styles.shadow]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mb_15]}>
                            <Text style={[styles.lg18_label]}>出游小知识</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('MeetChannel', {type: 'travel'})}>
                                <Text style={[styles.tip_label]}>更多</Text>
                                <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row, styles.f_wrap, styles.jc_sb]}>
                            {this.travels.map((course, cindex) => {
                                return (
                                    <VVodCell style={[styles.vitem]} course={course} key={'travel_' + cindex} onPress={() => this._onCourse(course)}/>
                                )
                            })}
                        </View>
                    </View>

                    <View style={[styles.mt_15, styles.p_15, styles.bg_white, styles.circle_10, styles.shadow]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mb_15]}>
                            <Text style={[styles.lg18_label]}>旅游礼仪</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('MeetChannel', {type: 'rite'})}>
                                <Text style={[styles.tip_label]}>更多</Text>
                                <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row, styles.f_wrap, styles.jc_sb]}>
                            {this.rites.map((course, cindex) => {
                                return (
                                    <VVodCell style={[styles.vitem]} course={course} key={'rite_' + cindex} onPress={() => this._onCourse(course)}/>
                                )
                            })}
                        </View>
                    </View>

                    {this.lives.length > 0 || this.livebacks.length > 0 ?
                    <View style={[styles.mt_15]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.p_15]}>
                            <Text style={[styles.lg18_label]}>精彩直播</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('MeetLiveChannel')}>
                                <Text style={[styles.tip_label]}>更多</Text>
                                <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.lives.map((live, index) => {
                            return (
                                <TouchableOpacity style={[styles.p_15, styles.bg_white, styles.circle_10, styles.shadow, styles.mb_10]} key={'live_' + index} onPress={() => navigation.navigate('Live', {course: live})}>
                                    <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.pb_10, styles.border_bt]}>
                                        <Text style={[styles.sm_label]}>{liveday(live.beginTime)}</Text>
                                        <Text style={[styles.sm_label, styles.tip_label]}>{live.hit}人正在上课</Text>
                                    </View>
                                    <View style={[styles.row, styles.mt_10, styles.pb_10]}>
                                        <View style={[styles.col_3]}>
                                            <Text style={[styles.lg_label]}>{live.courseName}</Text>
                                            <Text style={[styles.sm_label, styles.mt_10, styles.gray_label]}>{live.summary}</Text>
                                        </View>
                                        <View style={[styles.col_1, styles.ai_end, styles.jc_ct]}>
                                            <TouchableOpacity style={[styles.bg_sred, styles.circle_10, styles.p_5, styles.pl_10, styles.pr_10]} disabled={live.book} onPress={() => this._onBook(live)}>
                                                <Text style={[styles.white_label, styles.sm_label]}>预约</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        {this.livebacks.map((course, index) => {
                            return (
                                <VodCell course={course} onPress={() => this._onCourse(course)} key={'liveback_' + index}/>
                            )
                        })}
                    </View>
                    : null}

                    <View style={[styles.mt_15, styles.p_15, styles.bg_white, styles.circle_10, styles.shadow]}>
                        <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.mb_15]}>
                            <Text style={[styles.lg18_label]}>游学积分兑换</Text>
                            <TouchableOpacity style={[styles.row, styles.ai_ct]} onPress={() => navigation.navigate('MeetChannel', {type: 'exchange'})}>
                                <Text style={[styles.tip_label]}>更多</Text>
                                <Text style={[styles.icon, styles.tip_label, styles.sm_label]}>{iconMap('right')}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.excourses.map((course, index) => {
                            return (
                                <VodCell course={course} exchange={true} onPress={() => this._onCourse(course)}/>
                            )
                        })}
                    </View>
                </ScrollView>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,

    ad_img:{
        width: theme.window.width - 30,
        height:(theme.window.width  - 30) * 0.39,
    },
    ad_page: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 5
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },

    vitem:{
        width:'48%',
    },
});

export const LayoutComponent = Meet;

export function mapStateToProps(state) {
	return {
        advert: state.site.advert,
        cond: state.meet.cond,
        travel: state.meet.travel,
        rite: state.meet.rite,
        exchange: state.meet.exchange,
        live: state.meet.live,
        liveback: state.meet.liveback,
	};
}
