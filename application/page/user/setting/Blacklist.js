import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,Alert} from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';

import HudView from '../../../component/HudView';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

class Blacklist extends Component {

    static navigationOptions = {
        title:'黑名单',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.itemtype = null;

        this.items = [];
		this.page = 1;
		this.totalPage = 1;

        this.state = {
            refreshState: RefreshState.Idle,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onRelieve = this._onRelieve.bind(this);

    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps){

        const {back} = nextProps;

        if(back !== this.props.back){

            this.items = this.items.concat(back.items);
            this.page = back.page;
            this.totalPage = back.pages;
            this.itemtype = [];
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    _keyExtractor(item, index) {
	    return index + '';
    }

    _onHeaderRefresh(){

        const {actions} = this.props;
        this.itemtype = null;
        this.items = [];
		this.page = 0;
        this.totalPage = 1;
        
        actions.user.black(this.page);

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh(){
        const {actions} = this.props;


		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.user.black(this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }

    _onRelieve(black){
        Alert.alert('黑名单','确定解除黑名单？',[
            { text: '取消', onPress: () => {
                
            }
        },{
            text: '确定', onPress: () => {
                this._offRelieve(black)
            }
        }])
    }

    _offRelieve(black){
        const {actions} = this.props;
        actions.user.userBack({
            toId:black.userId,
            operation:'del',
            resolved: (data) => {
                this.refs.hud.show('已解除', 1);
                this._onHeaderRefresh();
            },
            rejected: (res) => {
                
            },
        })
    }


    _keyExtractor(item, index) {
	    return index + '';
    }

    _renderItem(item){
        const black = item.item;
        const index = item.index;

        let on = this.items.length - 1 === index ;

        return(
            <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct,styles.pl_20,styles.pr_15,styles.pt_10,styles.pb_10,!on&&styles.border_bt]}>
                <View style={[styles.fd_r,styles.ai_ct]}>
                    <View style={[styles.blackCover]}>
                        <Image source={{uri:black.avatar}} style={styles.blackImg} />
                    </View>
                    <Text style={[styles.black_label,styles.lg_label]}>{black.nickname}</Text>
                </View>
                <TouchableOpacity style={[styles.relieveBtn]} onPress={()=>this._onRelieve(black)}>
                    <Text style={[styles.default_label,styles.sred_label]}>解除</Text>
                </TouchableOpacity>
            </View> 
        )
    }

    

    render() {

        return (
            <View style={styles.container}>
                 {
                    this.itemtype !== null ?
                    <View style={[styles.pt_10,styles.pb_50]}>
                        {
                            this.items.length > 0 ?
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
                         :
                            <View style={[styles.noCollectBox]}>
                                 <Image source={asset.perfect_icon.pf_colllect} style={styles.nocolllect} resizeMode={'contain'} />
                                 <Text style={[styles.sred_label,styles.sm_label,styles.mt_15]}></Text>
                             </View>
                        }
                    </View>
                :null }

                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff'
    },
    blackCover:{
        width:40,
        height:40,
        marginRight:15
    },
    blackImg:{
        width:40,
        height:40,
        backgroundColor:'#f1f1f1',
        borderRadius:20,
    },
    noCollectBox:{
        width:'100%',
        height:180,
        marginTop:50,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    nocolllect:{
        width:156,
        height:148
    },
    relieveBtn:{
        width:60,
        height:26,
        borderRadius:13,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#F4623F'
    }
})

export const LayoutComponent = Blacklist;

export function mapStateToProps(state) {
	return {
        back:state.user.back,
	};
}
