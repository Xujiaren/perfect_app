import React, { Component } from 'react';
import { View, Text ,StyleSheet, TouchableOpacity,Image,ProgressViewIOS,ProgressBarAndroid,Platform} from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import asset from '../../config/asset';
import theme from '../../config/theme';
import Tabs from '../../component/Tabs';

class StudyRecord extends Component {

    static navigationOptions = {
        title:'学习记录',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        this.itemtype = null;
        this.page = 1;
        this.totalPage = 1;
        this.learncourse = [];

        this.state = {
            status:0,
            learnList:[],
            refreshState: RefreshState.Idle,
        };

        this._onSelect = this._onSelect.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {learncourse} = nextProps;

        if (learncourse !== this.props.learncourse) {
			this.learncourse = this.learncourse.concat(learncourse.items);
			this.page = learncourse.page;
            this.totalPage = learncourse.pages;

            this.itemtype = []

        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    _onSelect = (index) =>{

        this.itemtype = null
        this.learncourse = [];

        this.setState({
            status:index,
        },()=>{
            this._onHeaderRefresh();
        });

    }

    _onHeaderRefresh(){
        const {actions} = this.props;
        const {status} = this.state;

        actions.study.learncourse(status,0);

        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh(){
        const {actions} = this.props;
        const {status} = this.state;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

            actions.study.learncourse(status,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _oncourseDesc = (stu) =>{
        const {navigation} = this.props;
        navigation.navigate('Vod',{course:stu});
    }

    _renderItem(item){
        const { status} = this.state;
        const stu = item.item;

        return (
            <TouchableOpacity  style={[styles.c_item, styles.fd_r,styles.pb_10 ,styles.pt_10]}
                onPress={()=> this._oncourseDesc(stu)}
            >
                <View style={[styles.c_item_cover]}>
                    <Image source={{uri:stu.courseImg}}  style={[styles.c_item_img_cover]} />
                    {
                        stu.isSeries === 1 ?
                            <View style={[styles.c_item_title ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]}>
                                <Text style={[styles.sm_label ,styles.white_label]}>系列课({stu.study.currentChapter}/{stu.study.totalChapter})</Text>
                            </View>
                    : null}
                </View>
                <View style={[styles.d_flex ,styles.fd_c ,styles.jc_sb ,styles.ml_10 ,styles.col_1]}>
                    <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1} >{stu.courseName}</Text>
                    <View>
                        <View style={[styles.d_flex ,styles.fd_r ,styles.jc_sb ,styles.mb_5]}>
                            <Text style={[styles.sm_label ,styles.c33_label ,styles.fw_label]}>{stu.study.updateTimeFt}</Text>
                            {
                                status === 0 ?
                                <Text style={[styles.sm_label ,styles.tip_label]}>在学{stu.study.progress}%</Text>
                                :
                                <Text style={[styles.sm_label ,styles.tip_label]}>已学完</Text>
                            }
                        </View>
                        {
                            Platform.OS === 'android' ?
                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} progress={( status === 1 ? 1 : stu.study.progress / 100)} styleAttr="Horizontal"/>
                            :
                            <ProgressViewIOS progress={( status === 1 ? 1 : stu.study.progress / 100)}  style={{width: '100%'}} trackTintColor={'#FFDFDE'} progressTintColor={'#FF5047'} />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    render() {
        const {status} = this.state;


        return (
            <View style={styles.container}>
                <View style={[styles.atabs, styles.pl_20, styles.pr_20,styles.pt_10,styles.mb_10,styles.border_bt]}>
                    <Tabs items={['在学课程', '已学课程']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                {
                    this.itemtype != null ? 

                    <View>
                        {
                            this.learncourse.length > 0 ?
                            <View style={[styles.recordcons]}>
                                <RefreshListView
                                    style={styles.pb_50}
                                    showsVerticalScrollIndicator={false}
                                    data={this.learncourse}
                                    exdata={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItem}
                                    refreshState={this.state.refreshState}
                                    onHeaderRefresh={this._onHeaderRefresh}
                                    onFooterRefresh={this._onFooterRefresh}
                                />
                            </View>
                            :
                            <View style={[styles.col_1,styles.fd_r,styles.jc_ct,styles.mt_40]}>
                                <Image source={asset.perfect_icon.pf_learn} style={styles.nolearn} />
                            </View>

                        }
            
                    </View>

                :null}

                
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    recordcons:{
        paddingLeft:20,
        paddingRight:20,
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
    nolearn:{
        width:156,
        height:138
    }
});


export const LayoutComponent = StudyRecord;


export function mapStateToProps(state) {
	return {
        learncourse:state.study.learncourse,
	};
}
