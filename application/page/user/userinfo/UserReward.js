import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image} from 'react-native'

import asset from '../../../config/asset';
import theme from '../../../config/theme';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

class UserReward extends Component {

    static navigationOptions = {
        title:'我的打赏',
        headerRight: <View/>,
    };


    constructor(props){
        super(props)

        this.rewardList = [];
		this.page = 1;
		this.totalPage = 1;

        this.state = {
            page:0,
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {userReward} = nextProps


        if (userReward !== this.props.userReward) {
			this.rewardList = this.rewardList.concat(userReward.items);
			this.page = userReward.page ;
            this.totalPage = userReward.pages;
		}
        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }


    componentWillMount(){
        
    }


    componentDidMount(){
        this._onHeaderRefresh();
    }


    _onHeaderRefresh(){
        const {actions} = this.props;

		this.rewardList = [];
		this.page = 0;
		this.totalPage = 0;


		actions.user.userReward(1,this.page);

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
		const {actions} = this.props;


		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.user.userReward(1,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }
    

    _renderItem(item){
        const reward = item.item;
        const idx = item.index;
        let on = (this.rewardList.length - 1) === idx 

        return (
            <View style={[styles.d_flex ,styles.fd_r  ,styles.rwItem,!on&&styles.border_bt]} >               
                <Image source={{uri:reward.teacherImg.length > 0 ? reward.teacherImg :reward.noImg}}   style = {[styles.rw_cover]}/>
                <View style={[styles.d_flex ,styles.fd_c ,styles.col_1]}>
                    <View style={[styles.d_flex ,styles.fd_r ,styles.jc_sb]}>
                        <View style={[styles.col_1]}>
                            <Text style={[styles.gray_label ,styles.default_label,styles.lh18_label]}>{reward.teacherName !== '' ?  reward.teacherName : '课程《' +reward.courseName + '》'}</Text>
                        </View>
                        <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct]}>
                            <Image source={{uri:reward.giftImg}}  style={[styles.re_icon]} />
                            <Text style={[styles.sred_label ,styles.sm_label]}>x1 {reward.integral + '  '} 学分</Text>
                        </View>
                    </View>
                    <Text style={[styles.sm_label ,styles.tip_label,styles.mt_5]}>{reward.pubTimeFt}</Text>
                </View>
            </View>
        );
    }



    
    
    render() {



        return (
            <View style={[styles.wrap]}>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.rewardList}
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
    rwItem:{
        paddingTop:20,
        paddingRight:15,
        paddingLeft:20,
        paddingBottom:25
    },
    rw_cover:{
        width:36,
        height:36,
        borderRadius:18,
        marginRight:12,
    },
    re_icon:{
        width:14,
        height:14,
        marginRight:6
    }
});


export const LayoutComponent = UserReward;

export function mapStateToProps(state) {
	return {
        userReward:state.user.userReward
	};
}

