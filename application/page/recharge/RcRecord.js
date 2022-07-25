import React, { Component } from 'react'
import { Text, View ,StyleSheet} from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import theme from '../../config/theme';

class RcRecord extends Component {
    static navigationOptions = ({navigation}) => {
        
		return {
            title: '充值记录',
            headerRight: <View/>,
		}
    };


    constructor(props){
        super(props);

        this.items = [];
        this.page = 0;
        this.totalPage = 1;
        
        this.state = {
            refreshState: RefreshState.Idle,

            list:[{
                title:'微信充值 300 学分',
                date:'2018-12-25 15:31:05',
            },{
                title:'微信充值 300 学分',
                date:'2018-12-25 15:31:05',
            },{
                title:'微信充值 300 学分',
                date:'2018-12-25 15:31:05',
            }]
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        const { navigation } = nextProps;


    }

    componentWillUnmount(){

    }


    _onHeaderRefresh(){

    }

    _onFooterRefresh(){

    }

    _renderItem(item){
        const rocord = item.item
        return(
            <View style={[styles.bg_white,styles.pl_20,styles.pr_30,styles.pt_15,styles.pb_15,styles.mb_1]}>
                <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb]}>
                    <Text style={[styles.default_label,styles.black_label]}>微信充值 300 学分</Text>
                    <Text style={[styles.default_label,styles.sred_label]}>+ 300 学分</Text>
                </View>
                <Text style={[styles.sm_label,styles.tip_label,styles.mt_5]}>2018-12-25 15:31:05</Text>
            </View>
        )
    }


    render() {

        const {list} = this.state;

        return (
            <View style={styles.container}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={list}
                    exdata={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#FAFAFA',
    },
})


export const LayoutComponent = RcRecord;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}

