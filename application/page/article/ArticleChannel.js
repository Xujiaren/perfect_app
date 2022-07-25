import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import ArticleCell from '../../component/cell/ArticleCell';

import {theme, iconMap} from '../../config';

class ArticleChannel extends Component {

    // static navigationOptions = {
    //     title:'资讯',
    // };

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state
        const {type} = params

		return {
            title: parseInt(type) === 1 ?  '领导风采': '资讯',
            headerRight: <View/>,
		}
    };

    constructor(props) {
        super(props);

        this.page = 0;
        this.pages = 1;
        this.items = [];

        this.state = {
            keyword: '',
            refreshState: RefreshState.Idle,
            type:0,
            teacherId:0,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }

    componentWillMount(){
        const {navigation} = this.props
        const {params} = navigation.state
        const {type,teacher_id} = params

        this.setState({
            type:type,
            teacherId:teacher_id
        })

    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {

        const {channel,leaderArticle} = nextProps;

        if (channel !== this.props.channel) {
            this.items = this.items.concat(channel.items);
            this.pages = channel.pages;
        }

        if (leaderArticle !== this.props.leaderArticle){
            this.items = leaderArticle.items
            this.pages = leaderArticle.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {keyword,type,teacherId} = this.state;
        this.page = 0;
        this.pages = 1;
        this.items = [];

        if(type === 1){
            actions.teacher.leaderArticle(teacherId,this.page);
        } else {
            actions.article.channel(0, keyword, this.page);
        }
        
        this.setState({refreshState: RefreshState.HeaderRefreshing});
     }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {keyword,type,teacherId} = this.state;

        if (this.page < (this.pages - 1)) {
            this.page++;
            if(type === 1){
                actions.teacher.leaderArticle(teacherId,this.pages);
            } else {
                actions.article.channel(0, keyword, this.page);
            }
            
        } else {
            this.setState({refreshState: RefreshState.NoMoreData});
        }
    }

    _renderItem(item) {
        const {navigation} = this.props;
        const article = item.item;

        return <ArticleCell article={article} onPress={(article) => article.isLink === 1 ? navigation.navigate('AdWebView',{link:article.link}) : navigation.navigate('Article', {article: article})}/>
    }

    _renderHeader() {
        const {keyword,type} = this.state;

        if(type === 0){
            return (
                <View style={[styles.fd_r, styles.ai_ct, styles.jc_ct, styles.p_15]}>
                    <View style={[styles.bg_f7f, styles.fd_r, styles.ai_ct, styles.p_5, styles.circle_5,styles.col_1]}>
                        <Text style={[styles.icon, styles.gray_label]}>{iconMap('sousuo')}</Text>
                        <TextInput
                            style={[styles.ml_10, styles.input]}
                            placeholder={'最新资讯'}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false} 
                            autoCapitalize={'none'}
                            placeholderTextSize = {12}
                            value={keyword}  
                            blurOnSubmit={true}
                            returnKeyType='search'
                            keyboardType={'default'}
                            onSubmitEditing={this._onHeaderRefresh}
                            onChangeText={(text) => {this.setState({keyword:text});}}
                        />
                    </View>
                    <TouchableOpacity style={[styles.p_5, styles.pl_10, styles.pr_10]} onPress={this._onHeaderRefresh}>
                        <Text style={[styles.black_label ,styles.default_label]}>搜索</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return null;
    }

    render() {
        return (
            <View style={[styles.container, styles.bg_white]}>
                <RefreshListView
                    contentContainerStyle={[styles.p_10]}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    ListHeaderComponent={this._renderHeader}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    input: {
        width: (theme.window.width - 40) * 0.8,
        paddingVertical: 0,
    },
});

export const LayoutComponent = ArticleChannel;

export function mapStateToProps(state) {
    return {
        channel: state.article.channel,
        leaderArticle:state.teacher.leaderArticle
    };
}
