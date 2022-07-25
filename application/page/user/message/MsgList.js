import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity} from 'react-native';
import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';


class MsgList extends Component {

    static navigationOptions = ({navigation}) => {
        
		return {
            title: '油葱新鲜事',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.setParams({actionsType:true})} style={[styles.pr_15]}>
                    <Text style={[styles.sm_label ,styles.gray_label]}>全部已读</Text>
                </TouchableOpacity>
            ),
		}
    };
    
    constructor(props) {
        super(props);

        this.itemtype = null;
        this.items = [];
		this.page = 0;
        this.totalPage = 1;

        this.state = {
            msgItems:[],
            message:0,
            remind:0,
            actionsType:false,
            refreshState: RefreshState.Idle,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._allread = this._allread.bind(this)

    }

    componentWillReceiveProps(nextProps){
        const {msgItems} = this.state;

        const {usermessage,navigation} = nextProps;
        if (usermessage !== this.props.usermessage){
            this.items = msgItems.concat(usermessage.items);

            this.setState({
                msgItems : this.items
            })

			this.page = usermessage.page;
            this.totalPage = usermessage.pages;
            
            this.itemtype = []
        }

        if(navigation !== this.props.navigation){
            const {params} = navigation.state;

            if(params.actionsType){

                this._allread();
            }
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentWillUnmount(){
        const {actions} = this.props;
        actions.message.msgread();
    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    _onHeaderRefresh(){
        const {actions} = this.props;
        this.itemtype = null;
		this.items = [];
		this.page = 0;

        this.setState({
            msgItems:[]
        })


        actions.message.usermessage(this.page);

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh(){
        const {actions} = this.props;

		if (this.page < this.totalPage) {
            this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.message.usermessage(this.page);

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
        const msg = item.item;
        const index = item.index;
        return (
            <TouchableOpacity style={[styles.item ,styles.bg_white ,styles.d_flex ,styles.fd_c  ,styles.p_12 ,styles.mb_10]}
                onPress={()=>this._onMsgList(msg,index)}
            >
                <View style={styles.head}>
                    <View style={styles.msgImgbox}>
                        <Image source={asset.newsIcon} style={styles.headCover} />
                        {
                            msg.status == 0 ?
                            <View style={styles.headDot}></View>
                        :null}
                    </View>
                    <View style={[styles.col_1,styles.pr_5]}>
                        <Text style={msg.status === 0 ? [styles.lg_label,styles.black_label,styles.fw_label] : [styles.default_label,styles.tip_label] } numberOfLines={1}>{msg.title}</Text>
                    </View>
                </View>
                <View style={[styles.d_flex ,styles.fd_c ,styles.pb_10]}>
                    {
                        msg.messageImg !== '' && msg.messageImg !== null ?
                        <Image source={{uri:msg.messageImg}}   style={styles.messageImg} />
                        :
                        <Text   style= {msg.status === 0 ? [styles.gray_label,styles.default_label,styles.lh20_label,styles.mt_5] : [styles.tip_label,styles.default_label,styles.lh20_label,styles.mt_5]} numberOfLines={3}>{msg.summary}&gt;&gt;</Text>
                    }
                    <Text style={[styles.sm_label ,styles.tip_label,styles.pt_10]}>{msg.pubTimeFt}</Text>
                </View>
                <View style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_fe ,styles.pt_10,styles.msg_btm]}>
                    <Text style={[styles.gray_label ,styles.default_label]}>点击查看更多</Text>
                    <Image source={asset.arrow_right}  style={[styles.icon_right]} />
                </View>
            </TouchableOpacity>
        );
    }

    _onMsgList(msg,index){
        const {actions,navigation} = this.props;
        const { msgItems} = this.state
        actions.message.msgOperate({
            type:0,
            message_ids:msg.messageId,
            operate:0,
            resolved: (data) => {
                msgItems[index].status = 1;
                
                this.setState({
                    msgItems:msgItems
                })
            },
            rejected: (res) => {
                console.log(res);
            },
        });

        navigation.navigate('MsgDesc',{msg:msg,typeImg:1});
        
    }

    _allread(){
        const {actions} = this.props;
        actions.message.msgOperate({
            type:0,
            message_ids:0,
            operate:0,
            resolved: (data) => {
                this._onHeaderRefresh();
            },
            rejected: (res) => {
                console.log(res);
            },
        });
    }

    render() {

        if (this.itemtype == null) return null

        const {msgItems} = this.state

        return (
            <View style={[styles.container]}>
                {
                    msgItems.length  >  0 ? 
                    <View style={[styles.ml_15 ,styles.mr_15 ,styles.mt_15]}>
                        <RefreshListView
                            showsVerticalScrollIndicator={false}
                            data={msgItems}
                            exdata={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this._onHeaderRefresh}
                            onFooterRefresh={this._onFooterRefresh}
                        />
                    </View>
                :
                    <View style={[styles.col_1,styles.fd_r,styles.jc_ct,styles.mt_30]}>
                        <Image source={asset.perfect_icon.pf_message} style={styles.nomessage} />
                    </View>
                }
                

            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    item:{
        borderRadius:5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#f5f5f5',
    },
    head:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10,
    },
    msgImgbox:{
        position:'relative',
        height:23,
        marginRight:8,
    },
    headCover:{
        width:23,
        height:23,
    },
    headDot:{
        position:'absolute',
        top:0,
        right:0,
        height:7,
        width:7,
        borderRadius:4,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#ffffff',
        backgroundColor:'#FF4136'
    },
    icon_right:{
        width:6,
        height:11,
        marginLeft:5,
    },
    msg_btm:{
        borderTopWidth:1,
        borderTopColor:'#F0F0F0',
        borderStyle:'solid',
        display:'flex',
        justifyContent:'flex-end',
        paddingBottom:10
    },
    messageImg:{
        width: theme.window.width - 54,
        height: (theme.window.width - 54) * 0.29, 
        resizeMode: 'stretch',
        borderRadius:2
    },
    nomessage:{
        width:156,
        height:138
    }
});

export const LayoutComponent = MsgList;

export function mapStateToProps(state) {
	return {
        usermessage:state.message.usermessage,
	};
}
