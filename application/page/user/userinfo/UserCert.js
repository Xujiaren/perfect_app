import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import {formatTimeStampToTime} from '../../../util/common'
import asset from '../../../config/asset';
import theme from '../../../config/theme';


class UserCert extends Component {

    static navigationOptions = {
        title:'我的证书',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.page = 0;
        this.totalPage = 1;
        this.items = [];
        this.itemtype = null;

        this.state = {
            refreshState: RefreshState.Idle,
            imgs:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/045f86a9-71b6-490f-aa64-c1f0ac1ed43e.png'
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {userCert} = nextProps;

        if(userCert !== this.props.userCert){

            this.itemtype = [];
			this.items = this.items.concat(userCert.items);
			this.page = userCert.page;
            this.totalPage = userCert.pages;
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _onHeaderRefresh() {
        const {actions} = this.props;

        this.itemtype = null;
        this.page = 0 ;
        this.items = [];

        actions.user.userCert(this.page);
    }

    _onFooterRefresh(){
        const {actions} = this.props;

        if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

            actions.user.userCert(this.page);
			
		} else {

            this.setState({refreshState: RefreshState.NoMoreData});
            
		}
    }

    _renderItem(item){
        const {navigation} = this.props;
        const cert = item.item ;
        const {imgs} = this.state;
        return(
            <TouchableOpacity  style={[styles.cert,styles.mt_15]} onPress={()=>navigation.navigate('Certificate',{cert:cert})}>
                <Image style={[styles.img]} resizeMode='contain' source={{uri:imgs}}/>
                <Text style={[styles.mt_5,styles.default_label,styles.c33_label,styles.fw_label]} numberOfLines={1}>{cert.content}</Text>
                <Text style={[styles.mt_5,styles.sm_label,styles.tip_label]}>获得时间 {formatTimeStampToTime(cert.pubTime * 1000)}</Text>
            </TouchableOpacity>
        )
    }
    



    render() {
        return (
            <View style={styles.container}>
                {
                    this.items.length > 0 ?
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.items}
                        exdata={this.state}
                        count={2}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                        onFooterRefresh={this._onFooterRefresh}
                    />
                :null}
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
    certBox:{
        width:theme.window.width,
        flexDirection:'row',
        flexShrink:0,
        flexWrap:'wrap'
    },
    cert:{
        width:(theme.window.width) / 2,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    img:{
        width:(theme.window.width - 64) / 2,
        height:110,
    }
})

export const LayoutComponent = UserCert;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userCert:state.user.userCert,
	};
}