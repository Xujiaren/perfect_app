import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity} from 'react-native';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import _ from 'lodash';
import theme from '../../config/theme';
import HudView from '../../component/HudView';

class TeacherChannel extends Component {
    static navigationOptions = {
        title:'讲师列表',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        this.items = [];
        this.page = 0;
        this.pages = 1;
        
        this.state = {
            index: 0,
            refreshState: RefreshState.Idle,
        };

        this._onFollow = this._onFollow.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);        
    }

    componentWillReceiveProps(nextProps){
        const {channel} = nextProps;

        if (channel !== this.props.channel){
            this.items = this.items.concat(channel.items);
            this.pages = channel.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount() {
        this._onHeaderRefresh();

    }

    _onHeaderRefresh() {
		const {actions} = this.props;
		this.items = [];
		this.page = 0;
		this.pages = 1;

        actions.teacher.channel(0, this.page);
        actions.user.user();
		this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh() {
        const {actions} = this.props;
        
		if (this.page < this.pages) {
			this.page++;
            actions.teacher.channel(0, this.page);
            this.setState({refreshState: RefreshState.FooterRefreshing})
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData})
		}
    }

    _onFollow(index) {
        const {user, actions,navigation} = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            let teacher = this.items[index];

            if (teacher.isFollow) {
                teacher.isFollow = false;
                actions.teacher.removefollow({
                    teacherId: teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('取消关注', 1);
                    },
                    rejected: (res) => {
                        
                    },
                });

            } else {
                teacher.isFollow = true;
                actions.teacher.follow({
                    teacherId: teacher.teacherId,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);
                    },
                    rejected: (res) => {
                        
                    },
                });
            }

            this.items[index] = teacher;

            this.setState({
                index: index
            })
        }
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _renderItem(item){
        const {navigation} = this.props;
        const teacher = item.item;
        const index = item.index;

        return (
            <TouchableOpacity style={[styles.mb_25]} onPress={() => navigation.navigate('Teacher',{teacher: teacher})}>
                <View style={[styles.fd_r]}>
                    <View style={[styles.item_cover]}>
                        <Image source={{uri:teacher.teacherImg}} style={[styles.item_cover]} />
                    </View>
                    <View style={[styles.fd_c, styles.jc_sb ,styles.ml_10, styles.col_1]}>
                        <View>
                            <View style={[styles.fd_r, styles.jc_sb ,styles.ai_ct]}>
                                <Text style={[styles.lg_label ,styles.black_label ,styles.fw_label]}>{teacher.teacherName}</Text>
                                <TouchableOpacity style={[styles.focuson ,styles.d_flex ,styles.jc_ct ,styles.ai_ct]} onPress={() => this._onFollow(index)}>
                                    <Text style={[styles.red_label ,styles.sm_label]}>{ teacher.isFollow ? '已关注' : '+ 关注'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.default_label, styles.gray_label,styles.mt_5, styles.lh18_label]}>{teacher.honor.split('&').join('\n')}</Text>

                        </View>
                        <Text style={[styles.sm_label ,styles.tip_label]} >共 {teacher.course} 课</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={[styles.container]}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        paddingRight:20,
        paddingLeft:25,
        paddingTop:15,
    },
    item_cover:{
        width:64,
        height:80,
        backgroundColor:'#f5f5f5',
        borderRadius: 5,
    },
    focuson:{
        width:53,
        height:22,
        backgroundColor:'#ffffff',
        borderRadius:5,
        borderWidth:1,
        borderColor:'rgba(244,98,63,1)',
        borderStyle:'solid',
    },
});


export const LayoutComponent = TeacherChannel;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        channel:state.teacher.channel,
	};
}
