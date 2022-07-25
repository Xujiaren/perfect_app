import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity} from 'react-native';

import GraphicCell from '../../component/cell/GraphicCell';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import {theme} from '../../config';

class GraphicChannel extends Component {

    static navigationOptions = {
        title:'图文课程',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.items = [];
        this.page = 0;
        this.pages = 1;

        this.state = {
            refreshState: RefreshState.Idle,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {course} = nextProps;

        if (course !== this.props.course) {
            this.items = this.items.concat(course.items);
            this.page = course.page;
            this.pages = course.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        
        this.items = [];
        this.page = 0;
        this.pages = 1;

        actions.course.course(0, 0, 3, 0, this.page,2);
        this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

        if (this.page < (this.pages - 1)) {
            actions.course.course(0, 0, 3, 0, this.page + 1,2);
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _renderItem(item){
        const course = item.item;
        const {navigation} = this.props;

        return <GraphicCell course={course} onPress={(course) => navigation.navigate('Graphic', {course: course})}/>
    }
    
    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    contentContainerStyle={styles.m_20}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex: 1,
        backgroundColor:'#ffffff',
    },
});

export const LayoutComponent = GraphicChannel;

export function mapStateToProps(state) {
	return {
        course: state.course.course
	};
}
