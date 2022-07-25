//import liraries
import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer'
import HtmlView from '../../component/HtmlView';

import {theme, iconMap} from '../../config';

// create a component
class Ebook extends Component {

    static navigationOptions = ({navigation}) => {

        const title = navigation.getParam('courseName', '电子书详情')
		return {
            title: title,
            headerRight: (
                <TouchableOpacity style={[styles.pr_15]}>
                    <Text style={[styles.icon]}>{iconMap('fenxiang1')}</Text>
                </TouchableOpacity>
            ),
		}
    };

    course = this.props.navigation.getParam('course', {courseId: 0})

    state = {
        preview: false,
        preview_img: [],
        loaded: false,
    }

    componentDidMount() {
        this.onRefresh()
    }

    componentWillReceiveProps(nextProps) {
        const {info} = nextProps

        if (info !== this.props.info) {
            this.course = info

            this.setState({
                loaded: true,
            })
        }
    }

    onRefresh = () => {
        const {actions} = this.props
        actions.course.info(this.course.courseId)
    }

    onPreview = () => {
        let images = [];
        this.course.coursewareList.map((gallery, i) => {
            images.push({
				url: gallery.fpath,
			});
        });

        this.setState({
            preview: true,
            preview_img: images,
        });
    }

    render() {
        const {loaded, preview, preview_img} = this.state

        if (!loaded) {
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        }
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Image source={{uri: this.course.courseImg}} style={[styles.cover, styles.bg_wred]}/>
                    <View style={[styles.p_25]}>
                        <Text style={[styles.lg_label, styles.mb_10]}>{this.course.courseName}</Text>
                        <HtmlView html={this.course.content}/>
                    </View>
                </ScrollView>
                <View style={[styles.p_15]}>
                    <TouchableOpacity style={[styles.circle_5, styles.bg_sred, styles.p_10, styles.ai_ct]} onPress={this.onPreview}>
                        <Text style={[styles.white_label]}>开始阅读</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={preview} transparent={true} onRequestClose={() => { 
                    this.setState({
                        preview: false,
                    })
                }}>
                    <ImageViewer imageUrls={preview_img} index={0} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    cover: {
        width: theme.window.width,
        height: theme.window.width,
    }
});

export const LayoutComponent = Ebook;

export function mapStateToProps(state) {
	return {
        info: state.course.info,
	};
}