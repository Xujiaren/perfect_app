import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,ProgressViewIOS,ProgressBarAndroid,Platform} from 'react-native';

import HudView from '../../../component/HudView';
import Tabs from '../../../component/Tabs';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

class VideoLearn extends Component {


    static navigationOptions = {
        title:'视频学习',
        headerRight: <View/>,
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.squadId = navigation.getParam('squadId', 0);

        this.o2oVideo = [];

        this.state = {
            squadId:this.squadId,
            type:0,
            refreshState: RefreshState.Idle,
            status:0
        }

        this._onSelect = this._onSelect.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {o2oVideo} = nextProps;

        if(o2oVideo !== this.props.o2oVideo){
            this.o2oVideo = o2oVideo
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }
    
    componentDidMount(){
        const {navigation} = this.props;

        this._onHeaderRefresh();

        this.focuSub = navigation.addListener('didFocus', (route) => {

            this._onHeaderRefresh();
        })
    }

    componentWillUnmount() {
        this.focuSub && this.focuSub.remove();
    }


    _onSelect = (index) => {

        this.o2oVideo = [];

        this.setState({
            status:index,
            type:index
        },()=>{
            this._onHeaderRefresh();
        })
    }

    _onHeaderRefresh(){
        const {actions} = this.props;

        const {squadId,type} = this.state;
        let types = 0
        if(type==0){
            types=1
        }
        actions.train.o2oVideo(squadId,types);
    }


    _renderItem(item){
        const {navigation} = this.props;
        const stu = item.item;
        const index = item.index;

        const on = this.o2oVideo.length - 1 === index;
        return(
            <TouchableOpacity  style={[styles.c_item, styles.fd_r,styles.pb_15 ,styles.pt_15 , on ? null : styles.border_bt]}
                onPress={()=> navigation.navigate('LearnDesc',{stu:stu}) }
            >
                <View style={[styles.c_item_cover]}>
                    <Image source={{uri:stu.courseImg}}  style={[styles.c_item_img_cover]} />
                    {
                        stu.isSeries === 1 ?
                            <View style={[styles.c_item_title ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]}>
                                <Text style={[styles.sm_label ,styles.white_label]}>系列课({stu.study&&stu.study.currentChapter}/{stu.study&&stu.study.totalChapter})</Text>
                            </View>
                    : null}
                </View>
                <View style={[styles.d_flex ,styles.fd_c ,styles.jc_sb ,styles.ml_10 ,styles.col_1]}>
                    <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1} >{stu.courseName}</Text>
                    <View>
                        <View style={[styles.d_flex ,styles.fd_r ,styles.jc_sb ,styles.mb_5]}>
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.fw_label]}>{stu.study&&stu.study.updateTimeFt}</Text>
                            <Text style={[styles.sm_label ,styles.tip_label]}>在学{stu.study ? stu.study.progress : 0}%</Text>
                        </View>
                        {
                            Platform.OS === 'android' ?
                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} progress={(stu.study&&stu.study.progress / 100)} styleAttr="Horizontal"/>
                            :
                            <ProgressViewIOS progress={(stu.study&&stu.study.progress / 100)}  style={{width: '100%'}} trackTintColor={'#FFDFDE'} progressTintColor={'#FF5047'} />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    render() {
        const {status} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.atabs]}>
                    <Tabs items={['必修课程', '选修课程']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>
                <View style={[styles.pl_20,styles.pr_20,styles.pt_10]}>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.o2oVideo}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                    />
                </View>
                
                <HudView ref={'hud'} />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#fafafa',
        backgroundColor:'#ffffff'
    },
    c_item:{
        position:'relative',
    },
    c_item_cover:{
        position:'relative',
        height:80,
    },
    c_item_img_cover:{
        width:148,
        height:80,
        borderRadius:4,
    },
    c_item_title:{
        width:148,
        height:20,
        backgroundColor:'rgba(51,51,51,0.7)',
        position:'absolute',
        top:60,
        borderBottomLeftRadius:4,
        borderBottomRightRadius:4,
    },
})

export const LayoutComponent = VideoLearn;

export function mapStateToProps(state) {
	return {
        o2oVideo:state.train.o2oVideo
	};
}
