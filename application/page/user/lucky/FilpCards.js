import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity,TextInput} from 'react-native';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import asset from '../../../config/asset';
import theme from '../../../config/theme';

class FilpCards extends Component {

    static navigationOptions = {
        title:'中奖记录',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.items = [];
        this.state = {

        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount(){

        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
		const {lotteryreword} = nextProps;

		if (lotteryreword !== this.props.lotteryreword) {

			this.items = this.items.concat(lotteryreword.items);
			this.page = lotteryreword.page;
            this.totalPage = lotteryreword.pages;
            
		}


		setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
	}

    _onHeaderRefresh() {
		const {actions} = this.props;
		this.items = [];
		this.page = 0;
		this.totalPage = 1;


		actions.activity.lotteryreword(this.page);

		this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh() {
		const {actions} = this.props;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.activity.lotteryreword(this.page);
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
	}

    _keyExtractor(item, index) {
	    return index + '';
    }
    
    _renderItem(item){

        const reward = item.item;

        return (
            <View style={[styles.d_flex ,styles.fd_c ,styles.mb_1 ,styles.bg_white ,styles.pl_20 ,styles.pt_15 ,styles.pb_15]}>
                <Text style={[styles.default_label ,styles.c33_label]}>获得 {reward.itemName}</Text>
                <Text style={[styles.sm_label ,styles.tip_label ,styles.mt_5]}>{reward.pubTimeFt}</Text>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.items}
                    exdata={this.state}
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
});

export const LayoutComponent = FilpCards;

export function mapStateToProps(state) {
	return {
        lotteryreword:state.activity.lotteryreword,
	};
}
