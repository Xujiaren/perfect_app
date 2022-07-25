import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native'

import theme from '../../config/theme';
import HudView from '../../component/HudView';
class StudyMap extends Component {

    static navigationOptions = {
        title: '学习地图',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);

        this.studyMap = []
        this.studyMaps = []
        this.state = {
            loading: true
        }
    }

    componentWillReceiveProps(nextProps) {
        const { studyMap, studyMaps } = nextProps
        studyMap.reverse();
        this.studyMap = studyMap
        this.studyMaps = studyMaps
    }

    componentDidMount() {
        this.map()
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 2200);
    }
    map = () => {
        const { actions } = this.props
        actions.study.studyMap()
        actions.study.courseMapDary()
    }
    componentWillMount() {

    }

    componentWillUnmount() {

    }


    _onPass = (topic, type, isLock) => {

        const { navigation, actions } = this.props;
        if (isLock) {
            this.refs.hud.show('该关卡未关联任务', 1);
            return;
        }
        if (topic.lockStatus === 0) {
            this.refs.hud.show('未达到关卡等级', 1);
            return;
        }
        if (topic.finishStatus === 0) {
            actions.study.mapJudge({
                levelId: topic.levelId,
                resolved: (res) => {
                    const levelDesc = res
                    if (levelDesc.lockStatus === 2) {
                        if (topic.contentSort === 0) {
                            if (topic.paperId > 0 && !topic.paperDTO.finish) {
                                navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                            } else {
                                if (topic.courseId > 0) {
                                    if (topic.ctype == 1) {
                                        navigation.navigate('Audio', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                    } else if (topic.ctype == 3) {
                                        navigation.navigate('Graphic', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                    } else {
                                        navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                    }
                                }
                            }
                        } else if (topic.contentSort === 1) {
                            if (topic.courseDTO.finish && topic.paperId > 0) {
                                navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                            } else {
                                if (topic.ctype == 1) {
                                    navigation.navigate('Audio', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                } else if (topic.ctype == 3) {
                                    navigation.navigate('Graphic', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                } else {
                                    navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                }
                            }
                        } else if (topic.contentSort === 2) {
                            if (topic.squadId > 0) {
                                actions.study.checkOtwo({
                                    level_id: topic.squadId,
                                    resolved: (res) => {
                                        this.refs.hud.show('赶快参加线下O2O培训班吧，惊喜等着你，加油', 1);
                                    },
                                    rejected: (err) => {
                                        console.log(err)
                                    }
                                })
                            }
                        }
                    } else if (levelDesc.lockStatus === 0) {
                        this.refs.hud.show('未达到关卡等级', 1);
                    } else if (levelDesc.lockStatus === 1) {
                        this.refs.hud.show('上一关卡任务未完成', 1);
                    }
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            if (topic.contentSort === 0) {
                if (topic.paperId > 0) {
                    navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                } else {
                    if (topic.courseId > 0) {
                        if (topic.ctype == 1) {
                            navigation.navigate('Audio', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                        } else if (topic.ctype == 3) {
                            navigation.navigate('Graphic', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                        } else {
                            navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                        }
                    }
                }
            } else if (topic.contentSort === 1) {
                if (topic.paperId > 0) {
                    navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                } else {
                    if (topic.ctype == 1) {
                        navigation.navigate('Audio', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                    } else if (topic.ctype == 3) {
                        navigation.navigate('Graphic', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                    } else {
                        navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                    }
                }
            } else if (topic.contentSort === 2) {
                if (topic.squadId > 0) {
                    actions.study.checkOtwo({
                        level_id: topic.squadId,
                        resolved: (res) => {
                            this.refs.hud.show('赶快参加线下O2O培训班吧，惊喜等着你，加油', 1);
                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                }
            }
        }
    }
    _onPasss = (topic, type, isLock) => {

        const { navigation, actions } = this.props;
        if (isLock) {
            this.refs.hud.show('该关卡未关联任务', 1);
            return;
        }
        if (topic.lockStatus === 0) {
            this.refs.hud.show('您的权限不足', 1);
            return;
        }
        if (topic.finishStatus === 0) {
            actions.study.mapJudge({
                levelId: topic.levelId,
                resolved: (res) => {
                    const levelDesc = res
                    if (levelDesc.lockStatus === 2) {
                        if (topic.contentSort === 0) {
                            if (topic.paperId > 0 && !topic.paperDTO.finish) {
                                navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                            } else {
                                if (topic.courseId > 0) {
                                    navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                                }
                            }
                        } else if (topic.contentSort === 1) {
                            if (topic.courseDTO.finish && topic.paperId > 0) {
                                navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                            } else {
                                navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                            }
                        } else if (topic.contentSort === 2) {
                            if (topic.squadId > 0) {
                                actions.study.checkOtwo({
                                    level_id: topic.squadId,
                                    resolved: (res) => {
                                        this.refs.hud.show('赶快参加线下O2O培训班吧，惊喜等着你，加油', 1);
                                    },
                                    rejected: (err) => {
                                        console.log(err)
                                    }
                                })
                            }
                        }
                    } else if (levelDesc.lockStatus === 0) {
                        this.refs.hud.show('您的权限不足', 1);
                    } else if (levelDesc.lockStatus === 1) {
                        this.refs.hud.show('上一关卡任务未完成', 1);
                    }
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            if (topic.contentSort === 0) {
                if (topic.paperId > 0 ) {
                    navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                } else {
                    if (topic.courseId > 0) {
                        navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                    }
                }
            } else if (topic.contentSort === 1) {
                if ( topic.paperId > 0) {
                    navigation.navigate('StudyAnswer', { paper_id: topic.paperId, levelId: topic.levelId, refresh: () => { this.map() } })
                } else {
                    navigation.navigate('Vod', { course: topic.courseDTO, courseName: topic.courseDTO.courseName, levelId: topic.levelId, refresh: () => { this.map() } });
                }
            } else if (topic.contentSort === 2) {
                if (topic.squadId > 0) {
                    actions.study.checkOtwo({
                        level_id: topic.squadId,
                        resolved: (res) => {
                            this.refs.hud.show('赶快参加线下O2O培训班吧，惊喜等着你，加油', 1);
                        },
                        rejected: (err) => {
                            console.log(err)
                        }
                    })
                }
            }
        }
    }
    render() {

        let lst1 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646272034311.png'//深红果子
        let lst2 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646272038597.png'//红果子
        let lst3 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646272044418.png'//绿果子
        let lst4 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646272049896.png'//枝头
        let lst5 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646272057540.png'//根
        let lst6 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646272064091.png'//柱子
        let lst7 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646273627687.png'//云
        let lst8 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646277757721.png'//锁开
        let lst9 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646277764973.png'//锁关
        if (this.state.loading) {
            return (
                <View style={[styles.loads]}>
                    <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1646283824621.gif' }} style={[{ width: 100, height: 100 }]} />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.wrapSenior}>
                        <Image source={{ uri: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/e39515fa-f18e-496f-99ed-500bb3908764.jpeg' }} style={[styles.wds]} />
                        <View style={styles.wrapSenior}>
                            {
                                this.studyMap.map((sMap, index) => {

                                    let side_map = [];
                                    if (sMap.level != '5') {
                                        side_map = this.studyMaps.find(item => item.level === sMap.level).maplevels;
                                    }
                                    return (
                                        <View style={styles.wrapSenior} key={'sMap' + index}>
                                            {
                                                index == 0?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}></ImageBackground>
                                                :null
                                            }
                                            {sMap.data.length > 48 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 48) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 45 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 45 && i < 48) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 42 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 42 && i < 45) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 39 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 39 && i < 42) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 36 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 36 && i < 39) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 33 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 33 && i < 36) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 30 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 30 && i < 33) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 27 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 27 && i < 30) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 24 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 24 && i < 27) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 21 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 21 && i < 24) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 18 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 18 && i < 21) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 15 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 15 && i < 18) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 12 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 12 && i < 15) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 9 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 9 && i < 12) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            {sMap.data.length > 6 ?
                                                <ImageBackground source={{ uri: lst6 }} style={[styles.bg_imgs]}>
                                                    {
                                                        sMap.data.map((mmap, i) => {
                                                            let bottom = 0;
                                                            let left = 0;
                                                            if (i % 3 === 0) {
                                                                bottom = 18;
                                                                left = 60;
                                                            } else if (i % 3 === 1) {
                                                                bottom = 44;
                                                                left = 95;
                                                            } else if (i % 3 === 2) {
                                                                bottom = 70;
                                                                left = 130;
                                                            }

                                                            let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                            if (i >= 6 && i < 9) {
                                                                return (
                                                                    <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                        {mmap.finishStatus ?
                                                                            <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                            :
                                                                            <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                        }
                                                                        {
                                                                            mmap.lockStatus != 2 || isLock ?
                                                                                <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                                : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                        }
                                                                        <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </ImageBackground>
                                                : null}
                                            <ImageBackground source={{ uri: this.studyMap.length - 1 == index ? lst5 : lst4 }} style={[this.studyMap.length - 1 == index ? styles.bg_imga : styles.bg_img]}>
                                                {
                                                    sMap.data.map((mmap, i) => {
                                                        let bottom = 0;
                                                        let left = 0;
                                                        if (i === 0) {
                                                            bottom = 90;
                                                            left = 40;
                                                        } else if (i === 1) {
                                                            bottom = 120;
                                                            left = 75;
                                                        } else if (i === 2) {
                                                            bottom = 150;
                                                            left = 110;
                                                        } else if (i === 3) {
                                                            bottom = 158;
                                                            left = 40;
                                                        } else if (i === 4) {
                                                            bottom = 188;
                                                            left = 75;
                                                        } else if (i === 5) {
                                                            bottom = 218;
                                                            left = 110;
                                                        }

                                                        let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                        if (i < 6) {
                                                            return (
                                                                <TouchableOpacity key={'map' + i} onPress={() => this._onPass(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                    {mmap.finishStatus ?
                                                                        <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                        :
                                                                        <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                    }
                                                                    {
                                                                        mmap.lockStatus != 2 || isLock ?
                                                                            <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                            : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                    }
                                                                    <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        }
                                                    })
                                                }
                                                {
                                                    side_map.map((mmap, i) => {
                                                        let bottom = 0;
                                                        let left = 0;
                                                        if (i === 0) {
                                                            bottom = 80;
                                                            left = 160;
                                                        } else if (i === 1) {
                                                            bottom = 100;
                                                            left = 195;
                                                        } else if (i === 2) {
                                                            bottom = 120;
                                                            left = 230;
                                                        } else if (i === 3) {
                                                            bottom = 118;
                                                            left = 265;
                                                        } else if (i === 4) {
                                                            bottom = 116;
                                                            left = 300;
                                                        }
                                                        let isLock = mmap.courseId == 0 && mmap.paperId == 0 && mmap.squadId == 0;
                                                        return (
                                                            <TouchableOpacity key={'map' + i} onPress={() => this._onPasss(mmap, 0, isLock)} style={[styles.wrapbox_item, styles.p_item, { bottom: bottom, left: left }]}>
                                                                {mmap.finishStatus ?
                                                                    <Image source={{ uri: lst1 }} style={[styles.wrapbox_item_cover]} />
                                                                    :
                                                                    <Image source={{ uri: mmap.lockStatus == 2 || mmap.lockStatus == 1 || isLock ? lst2 : lst3 }} style={[styles.wrapbox_item_cover]} />
                                                                }
                                                                {
                                                                    mmap.lockStatus != 2 || isLock ?
                                                                        <Image source={{ uri: lst9 }} style={[styles.suo_cover]} />
                                                                        : <Image source={{ uri: lst8 }} style={[styles.suo_cover]} />
                                                                }
                                                                <Text style={[{ color: '#ffffff', fontSize: 14, position: 'absolute', top: -12, left: 6 }]}>{i + 1}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                                <View style={this.studyMap.length - 1 == index ? [styles.goal_box] : [styles.goal_boxs]}>
                                                    <Image source={{ uri: lst7 }} style={[styles.ultimate_goal]} />
                                                    <View style={[styles.goal_box_txts]}>
                                                        <Text style={[styles.fw_label, { fontSize: 14, color: 'black' }]}>{sMap.levelName}</Text>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        // backgroundColor:'#FBFDFF',
        backgroundColor: '#65C0FF',
    },
    loads: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wds: {
        width: '100%',
        height: 1000,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    bg_img: {
        width: '100%',
        height: 200,
        marginLeft: 21,
        position: 'relative'
    },
    bg_imga: {
        width: '100%',
        height: 200,
        marginLeft: 18,
        position: 'relative'
    },
    bg_imgs: {
        width: '60%',
        height: 66,
        marginLeft: -6,
        position: 'relative'
    },
    back_avatr: {
        position: 'absolute',
        top: 50,
        left: 50
    },
    wrapPrimary: {

    },
    wrapbox_item: {
        position: 'absolute'
    },
    wrapbox_item_cover: {
        width: 40,
        height: 40,
        // position:'absolute',
        // left:'50%',
        // top:30
    },

    goal_box: {
        position: 'absolute',
        bottom: 10,
        left: 30,
    },
    goal_boxs: {
        position: 'absolute',
        bottom: 46,
        left: 30,
    },
    ultimate_goal: {
        width: 130,
        height: 75
    },
    goal_box_txts: {
        position: 'absolute',
        top: 14,
        left: 10,
        width: 115,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },

    suo_cover: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 20,
        height: 20,
    },
    p_item: {
        position: 'absolute',
        zIndex: 99
    },
})

export const LayoutComponent = StudyMap;

export function mapStateToProps(state) {
    return {

        studyMap: state.study.studyMap,
        studyMaps: state.study.studyMaps
    };
}
