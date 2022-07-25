import React, { Component } from 'react'
import { Text, View ,ImageBackground,StyleSheet} from 'react-native'

import Tabs from '../../component/Tabs';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import asset from '../../config/asset';
import theme from '../../config/theme';

class LectReturn extends Component {

    
    static navigationOptions = ({navigation}) => {
        
		return {
            title: '查看现金收益',
            headerRight: <View/>,
        }
        
    };


    constructor(props){
        super(props);

        this.items = [];
        this.state = {
            status:0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

    }

    componentWillReceiveProps(nextProps) {
		const {userintegral} = nextProps;

		if (userintegral !== this.props.userintegral) {
			this.items = this.items.concat(userintegral.items);
			this.page = userintegral.page + 1;
			this.totalPage = userintegral.pages;
		}


		setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }
    
    componentWillMount(){
    }

    componentDidMount() {
		this._onHeaderRefresh();
	}

    _onHeaderRefresh() {
		const {actions} = this.props;
        const {itype} = this.state;
		this.items = [];
		this.page = 1;
		this.totalPage = 1;


		actions.user.userintegral(itype,1);

		this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh() {
		const {actions} = this.props;
        const {itype} = this.state;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.user.userintegral(itype,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }
    
    _renderItem(item){
        const gold = item.item;

        return (
            <View style={[ styles.pt_15,styles.pb_15 ,styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_sb]}>
                <View style={[styles.d_flex ,styles.fd_c ,styles.ml_5,styles.col_1,styles.mr_10]}>
                    <Text style={[styles.default_label]}>{gold.contentName} </Text>
                    <Text style={[styles.sm_label ,styles.tip_label ,styles.mt_5]}>{gold.pubTimeFt}</Text>
                </View>
                <Text style={[styles.default_label ,styles.orange_label]}>佣金：￥{gold.integral}</Text>
            </View>
        );
    }


    render() {

        const {status} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.ml_20,styles.mr_20,styles.mt_15]}>
                    <ImageBackground source={asset.bg.bg_cash} style={[styles.goldBox,styles.fd_r,styles.ai_ct]}>
                        <View style={[styles.pl_25]}>
                            <Text style={[styles.lg30_label,styles.fw_label,styles.white_label]}><Text style={[styles.sm_label,styles.white_label]}>累计收益:<Text style={[styles.white_label,styles.default_label,styles.fw_label]}>￥</Text></Text>872</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={[styles.atabs,styles.mt_20,styles.mb_12]}>
                    <Tabs items={['收益明细']} selected={status} type={0} atype={1}   />
                </View>

                <View style={[styles.pl_25,styles.pr_25]}>
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
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    atabs:{
        borderBottomWidth:1,
        borderBottomColor:'#F6F6F6',
        borderStyle:'solid'
    },
    container:{
        flex: 1,
    },
    goldBox:{
        width:'100%',
        height:100,

    }
})

export const LayoutComponent = LectReturn;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userintegral:state.user.userintegral,
	};
}
