import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity} from 'react-native';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import GoodsCell from '../../component/cell/GoodsCell';
import VGoodsCell from '../../component/cell/VGoodsCell';

import iconMap from '../../config/font';
import theme from '../../config/theme';

class GeneralList extends Component {


    static navigationOptions = ({navigation}) => {
        const title = navigation.getParam('title', {title: '商品列表'});

		return {
            title: title,
            headerRight: <View/>,
		}
    };


    constructor(props){
        super(props);

        const {navigation} = this.props;
        
        this.exchange_type = navigation.getParam('exchange_type', 0);
        this.ctype = navigation.getParam('ctype', 0);
        this.type =  navigation.getParam('type', 3);
        this.items = [];
        this.page = 0;
        this.totalPage = 1;

        this.tabs = ['最新','最热'];

        this.state = {
            refreshState: RefreshState.Idle,
            exchange_type:this.exchange_type,
            ctype:this.ctype,
            mode: false,
            sort: 0,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._onSort = this._onSort.bind(this);
        this._onMode = this._onMode.bind(this);

    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps){
        const {shopExchange} = nextProps;

        if(shopExchange !== this.props.shopExchange){

            this.page = shopExchange.page;
            this.totalPage = shopExchange.pages;
            this.items = this.items.concat(shopExchange.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);

    }

    componentWillUnmount(){

    }

    _onHeaderRefresh(){

        const {actions} = this.props;
        const {exchange_type,ctype,sort} = this.state;

        this.items = [];
        this.page = 0 ;

        let ex_type = '';
        let c_type = '';

        if(exchange_type !== 9 ){
            ex_type = exchange_type;
        }

        if(ctype !== 9 ){
            c_type = ctype;
        }

        actions.mall.shopExchange(ex_type,c_type,this.page,sort);

    }

    _onFooterRefresh(){

        const {actions} = this.props;
        const {exchange_type,ctype,sort} = this.state;

        let ex_type = '';
        let c_type = '';

        if(exchange_type !== 9 ){
            ex_type = exchange_type;
        }

        if(ctype !== 9 ){
            c_type = ctype;
        }



        if (this.page < this.totalPage) {

			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

			actions.mall.shopExchange(ex_type,c_type,this.page,sort);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
        }
        

    }

    _renderItem(item){

        const {navigation} = this.props;
        const {mode} = this.state;
        const good = item.item;
        const index = item.index;
        const on  = index%2 === 1;

        return(
            <View>
                {
                   mode ?
                   <View>
                       <VGoodsCell  good={good}  onPress={(good) => navigation.navigate('MailDetail', {cate: good})}  />
                   </View>
                   :
                   <View style={[on&&styles.ml_12]}>
                        <GoodsCell style={{width:(theme.window.width - 48) / 2 }} good={good} type={this.type=10?0:this.type} btype={1}  etype={1} itype={0}
                            onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                        />
                    </View>
                }
            </View>
            
        )
    }

    _onSort(index){
        this.setState({
            sort: index,
        },()=> {
            this._onHeaderRefresh();
        });
    }

    _onMode(){
        this.setState({
            mode: !this.state.mode,
        });
    }


    render() {

        const { sort ,mode} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.coursehead,styles.bg_white]}>
                    <View style={[styles.fd_r ,styles.pt_10 ,styles.course_box ,styles.jc_sb]}>
                        <View style={[styles.fd_r ,styles.ai_ct ,styles.jc_sb ,styles.head_box ,styles.col_1]}>
                            {
                                this.tabs.map((tab, index)=>{

                                    const on = index === sort;

                                    return (
                                        <TouchableOpacity key={'tab' + index} style={[styles.head_box_item ,styles.d_flex ,styles.fd_c ,styles.ai_ct]}
                                            onPress={()=> this._onSort(index)}
                                        >
                                            <Text style={[styles.default_label , on ? styles.c33_label : styles.gray_label , on ? styles.fw_label : null]} >{tab}</Text>
                                            <View style={[styles.border_btn,on ? styles.bg_sred : styles.bg_white]}></View>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                        <TouchableOpacity style={[styles.course_sty  ,styles.fd_r ,styles.ai_ct ,styles.jc_fe ,styles.mb_5,styles.pr_15]} onPress={this._onMode}>
                            <Text style={[styles.icon, styles.tip_label, styles.default_label]}>{iconMap(mode ? 'shuangpaibanshi' : 'danpai')}</Text>
                            <Text style={[styles.default_label, styles.ml_5, styles.tip_label]}>{mode ? '双排模式' : '单排模式'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{paddingLeft:16,paddingRight:16}}>
                    <RefreshListView
                        contentContainerStyle={[styles.mt_10]}
                        showsVerticalScrollIndicator={false}
                        data={this.items}
                        exdata={this.state}
                        count={mode ? 1 : 2}
                        keyExtractor={mode ? (item, i) => i : (item, index) => index}
					    key={mode ? 'h' : 'v'}
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
    container:{
        flex:1,
        backgroundColor:'#FAFAFA'
    },
    s_img:{
        width:16,
        height:16,
    },
    searchleft:{
        height:30,
        backgroundColor:'#f5f5f5',
        paddingLeft:12,
        borderRadius:5,
    },
    input:{
        paddingVertical: 0,
    },
    searchbtn:{
        width:40,
        height:30,
        lineHeight:30,
        textAlign:'center',
    },
    head_box:{
        paddingLeft:40,
        paddingRight:40,
    },
    border_btn:{
        width:11,
        height:4,
        borderRadius:2,
        marginTop:5,
    },
    course_sty:{
        width:100,
    },
});

export const LayoutComponent = GeneralList;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        shopExchange:state.mall.shopExchange,
	};
}
