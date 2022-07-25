//import liraries
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import Tabs from '../../../component/Tabs';
import iconMap from '../../../config/font';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import theme from '../../../config/theme';
import asset from '../../../config/asset';

// create a component
class UserQuestion extends Component {

    static navigationOptions = {
        title:'出题记录',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            tabStatus: 0,
            refreshState: RefreshState.Idle,
        }

        this._onSelect = this._onSelect.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
    }

    componentDidMount() {
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        const {usertopic} = nextProps;
        
        if (usertopic !== this.props.usertopic) {
			this.items = this.items.concat(usertopic.items);
			this.page = usertopic.page + 1;
            this.totalPage = usertopic.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _onSelect(status) {
        this.setState({
            tabStatus: status,
        }, () => {
            this._onHeaderRefresh();
        })
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        this.items = [];
		this.page = 0;
		this.totalPage = 1;


		actions.pker.usertopic(this.state.tabStatus, this.page);
		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
        const {actions} = this.props;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.pker.usertopic(this.state.tabStatus,this.page);
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }
    
    _renderItem(item) {
        const question = item.item;

        return (
            <View style={[styles.pb_10, styles.pt_10, styles.border_bt]}>
                <Text>{item.index + 1}.{question.title}</Text>
                <View style={[styles.p_5]}>
                    {question.optionList.map((op, oindex) => {
                        const on = oindex == question.answer;
                        return (
                            <Text style={[styles.mt_10]} key={'op_' + item.index + '_' + oindex}><Text style={[styles.icon, styles.sred_label, on && styles.green_label]}>{iconMap(on ? 'gou' : 'guanbi')}</Text> {op}</Text>
                        )
                    })}
                </View>
            </View>
        )
    }

    _renderEmpty() {
        return (
            <View style={[styles.ai_ct, styles.mt_40]}>
                <Image source={asset.empty.question} style={[styles.empty]}/>
            </View>
        )
    }

    render() {
        const {tabStatus} = this.state;
        return (
            <View style={[styles.container, styles.bg_white]}>
                 <Tabs items={['审核中', '已采纳', '未通过']} atype={0} type={1} selected={tabStatus} onSelect={this._onSelect} />
                 <RefreshListView
                    contentContainerStyle={[styles.p_20]}
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    extraData={this.state}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    ListEmptyComponent={this._renderEmpty}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    empty: {
        width: 120,
        height: 120,
    }
});

export const LayoutComponent = UserQuestion;

export function mapStateToProps(state) {
	return {
        usertopic: state.pker.usertopic
	};
}