import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,ScrollView,Image} from 'react-native';


import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import Tabs from '../../component/Tabs'
import theme from '../../config/theme';
import asset from '../../config/asset';

class MailCate extends Component {

    static navigationOptions = {
        title:'分类',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.shopCategory = [];
        this.citems = [];

        this.state = {
            cateId:0, // 大分类id
            categoryId:0, // 二级分类id 
            status:0,
            cateCourse:[], // 总分类列表
            cateItem:[], // 二级分类
            course:[], // 课程列表
            page:0,
            pages:0,
            total:0,
            loadding:false,
            refreshState: RefreshState.Idle,
            tabbarIndex:1,
            tabbar_bottom:[{
                text:'首页',
                link:'Mail',
                icon:asset.mail.mail_icon,
                iconfull:asset.mail.mail_icon_full
            },{
                text:'分类',
                link:'MailCate',
                icon:asset.mail.cate_icon,
                iconfull:asset.mail.cate_icon_full
            }
            ,{
                text:'购物车',
                link:'Cart',
                icon:asset.mail.cart_icon,
                iconfull:asset.mail.cart_icon_full
            }
            ,{
                text:'订单',
                link:'Order',
                icon:asset.mail.order_icon,
                iconfull:asset.mail.order_icon_full
            }],
        }

        this.getCourseList = this.getCourseList.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onSelect =  this._onSelect.bind(this);

    }

    componentDidMount(){
        this._onRefresh();
    }

    componentWillReceiveProps(nextProps){
        const {cateId} = this.state;
        const {shopCategory,shopSearch} = nextProps;


        if(shopCategory !== this.props.shopCategory){

            this.shopCategory = shopCategory;
            
            let cate_id = 0;

            if(shopCategory.length > 0 && cateId == 0 ){
                cate_id = shopCategory[0].categoryId
                this.setState({
                    cateId:cate_id,
                    cateItem:shopCategory[0].child
                },()=>{
                    this._onHeaderRefresh();
                })
            }
        }

        if(shopSearch !== this.props.shopSearch){

            this.page = shopSearch.page;
            this.totalPage = shopSearch.pages;
            this.citems = this.citems.concat(shopSearch.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);

    }

    componentWillUnmount(){

    }

    _onRefresh(){
        
        const {actions} = this.props;

        actions.mall.shopCategory();
    }

    getCourseList(){
        
    }

    _onSelect =  (index) => {

    
        this.setState({
            cindex: index,
            ccindex: 0,
            cateItem:this.shopCategory[index].child,
            cateId:this.shopCategory[index].categoryId,
            categoryId:0,
            page:0,
            course:[],
            loadding:false
        } ,()=>{
            this._onHeaderRefresh(); 
        })
    }

    _onCategory = (ccategory) => {

        this.setState({
            categoryId:ccategory.categoryId,
            page:0,
            course:[],
            loadding:false
        },()=>{
            this._onHeaderRefresh()
        })
    }



    _onHeaderRefresh(){
        const {cateId,categoryId} = this.state;
        const {actions} = this.props;

        this.page = 0 ;
        this.citems = [];

        

        actions.mall.shopSearchs(cateId,categoryId,'','','',0,0,this.page);
    }

    _onFooterRefresh(){

        const {actions} = this.props;
        const {cateId,categoryId} = this.state;

		if (this.page < this.totalPage) {

			this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page = this.page + 1 ;

			actions.mall.shopSearchs(cateId,categoryId,'','','',0,0,this.page);
			
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}

    }

    _renderItem(item){
        const {navigation} = this.props;
        const cate = item.item;

        return(
            <TouchableOpacity style={[styles.item]} 
                onPress={()=>navigation.navigate('MailDetail',{cate:cate})}
            >
                <Image source={{uri:cate.goodsImg}} style={[styles.itemCover]} />
                <Text style={[styles.default_label,styles.c33_label,styles.mt_5,styles.pl_10,styles.pr_10]} numberOfLines={1}>{cate.goodsName}</Text>
                <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct,styles.mt_20,styles.pl_10,styles.pr_10]}>
                    {
                        cate.gtype == 1 ?
                        <Text style={[styles.sred_label,styles.default_label]}>免费</Text>:null
                    }
                    {
                        cate.gtype == 2 ?
                        <Text style={[styles.sred_label,styles.default_label]}>¥{cate.goodsAmountDTO.goodsAmount ?cate.goodsAmountDTO.goodsAmount:cate.goodsAmount}</Text>:null
                    }
                     {
                        cate.gtype == 3 ?
                        <Text style={[styles.sred_label,styles.default_label]}>{cate.goodsIntegral}学分</Text>:null
                    }
                     {
                        cate.gtype == 4 ?
                        <Text style={[styles.sred_label,styles.default_label]}>¥{cate.goodsAmount}+{cate.goodsIntegral}学分</Text>:null
                    }
                    <Text style={[styles.tip_label,styles.sm_label]}>热销{cate.saleNum}件</Text>
                </View>
            </TouchableOpacity>
        )
    }

    
 
    render() {
        const {navigation} = this.props;
        const {cindex,cateItem,ccindex,categoryId,tabbarIndex,tabbar_bottom} = this.state;


        let cateList_b = [];

        this.shopCategory.map((cate,index)=>{
            cateList_b.push(cate.categoryName)
        })


        return (
            <View style={styles.container}>
                <View style={styles.head}>
                    <View style={[styles.filter]}>
                        <Tabs items={cateList_b} selected={cindex} type={0} atype={1}   onSelect = {this._onSelect}/>
                    </View>
                    <View style={[styles.filter, styles.border_bt]}>
                        <ScrollView 
                            contentContainerStyle={[styles.p_10,styles.fd_r,styles.ai_ct]}
                            horizontal 
                            showsVerticalScrollIndicator={false}      
                            showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity  style={styles.catePerBox}  onPress={() => {
                                this.setState({
                                    categoryId: 0
                                }, () => {
                                    this._onHeaderRefresh();
                                })
                            }}>
                                <Text style={[styles.pl_5, styles.pr_5,styles.sm_label, styles.gray_label, categoryId === 0 && styles.sred_label]}>{'全部'}</Text>
                            </TouchableOpacity>
                            {cateItem.map((ccategory, index) => {

                                const on = ccategory.categoryId == categoryId;
                                
                                return (
                                    <TouchableOpacity  style={styles.catePerBox} key={'ccategory_' + index} onPress={()=> this._onCategory(ccategory)}>
                                        <Text style={[styles.pl_5, styles.pr_5,styles.sm_label, styles.gray_label, on && styles.sred_label]}>{ccategory.categoryName}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>

                <RefreshListView
                    // contentContainerStyle={[]}
                    data={this.citems}
                    extraData={this.state}
                    count={2}
                    keyExtractor={(item, index) =>  {return index + ''}}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />

                <View style={[styles.tabbar]}>
                    {
                        tabbar_bottom.map((item,idx)=>{

                            const on = tabbarIndex === idx;

                            return( 
                                <TouchableOpacity key={'item'+idx} style={[styles.tabItem]}
                                    onPress={()=>navigation.navigate(item.link)} 
                                >
                                    <Image source={on ? item.iconfull : item.icon} style={[styles.tabItem_cover]} />
                                    <Text style={[ styles.sm_label , styles.gray_label,on&&styles.red_label]}>{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    filter: {
        height: 42,
    },
    head:{
        backgroundColor:'#ffffff',
    },
    item:{
        width:(theme.window.width - 48) / 2,
        backgroundColor:'#ffffff',
        borderRadius:5,
        height:230,
        marginLeft:16,
        marginTop:10
    },
    itemCover:{
        width:(theme.window.width - 48) / 2-16,
        height:(theme.window.width - 48) / 2-16,
        backgroundColor:'#fafafa',
        marginLeft:8,
        marginTop:8
    },
    tabbar:{
        width:theme.window.width,
        height:50,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        borderTopColor:'#fafafa',
        borderTopWidth:1,
        borderStyle:'solid'
    },
    tabItem:{
        flexDirection:'column',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    tabItem_cover:{
        width:24,
        height:24,
    },
    bg_red:{
        backgroundColor:'#F46643'
    }
});

export const LayoutComponent = MailCate;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        shopCategory:state.mall.shopCategory,
        shopSearch:state.mall.shopSearchs,
	};
}
