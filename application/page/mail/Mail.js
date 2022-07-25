import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,ScrollView} from 'react-native';


import Carousel, {Pagination} from 'react-native-snap-carousel';

import theme from '../../config/theme';
import asset from '../../config/asset';
import request from '../../util/net'
import GoodsCell from '../../component/cell/GoodsCell'

class Mail extends Component {

    static navigationOptions = {
        title:'商城',
        headerRight: <View/>,
    };


    constructor(props) {

        super(props);

        this.admail = [];
        this.shopCategory = [];
        this.vipEnjoy = [];
        this.lectEnjoy = [];
        this.newRecomm = [];
        this.limitGoods = [];
        this.shopExchange = [];
        this.sellTop = [];

        this.state = {
            keyword:'',
            currentAd:0,
            tabbarIndex:0,
            tabbar_bottom:[{
                text:'首页',
                link:'',
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

        this._onRefresh = this._onRefresh.bind(this);
        this._renderAdItem = this._renderAdItem.bind(this);
        this._onAd = this._onAd.bind(this);

    }

    componentDidMount(){
        this._onRefresh();
    }

    componentWillReceiveProps(nextProps){

        const {config,user,admail,shopCategory,vipEnjoy,lectEnjoy,newRecomm,limitGoods,shopExchange,sellTop} = nextProps;

        if (config !== this.props.config){

            if (config.search_goods_def.length > 0){

                let searchdefult = config.search_goods_def.split('|');
                let inputxt = searchdefult[Math.floor(Math.random() * searchdefult.length)];

                this.setState({
                    keyword:inputxt,
                });

            }

        }

        if(admail !== this.props.admail){
            this.admail = admail;
        }

        if(shopCategory !== this.props.shopCategory){
            this.shopCategory = shopCategory;
        }

        if(vipEnjoy !== this.props.vipEnjoy){
            this.vipEnjoy = vipEnjoy.items;
        }

        if(lectEnjoy !== this.props.lectEnjoy){
            this.lectEnjoy = lectEnjoy.items;
        }

        if(newRecomm !== this.props.newRecomm){
            this.newRecomm = newRecomm.items;
        }

        if(limitGoods !== this.props.limitGoods){
            this.limitGoods = limitGoods.items;
        }
        
        if(shopExchange !== this.props.shopExchange){
            this.shopExchange = shopExchange.items
        }

        if(sellTop !== this.props.sellTop){
            this.sellTop = sellTop;
        }

    }

    componentWillUnmount(){

    }

    _onRefresh(){
        
        const {actions} = this.props;

        actions.site.config();
        actions.user.user();

        actions.mall.admail();
        actions.mall.shopCategory();
        actions.mall.sellTop();
        actions.mall.vipEnjoy(1,'','');
        actions.mall.lectEnjoy('',1,'');
        actions.mall.shopExchange(0,'','');
        actions.mall.newRecomm();
        actions.mall.limitGoods();

    }


    _renderAdItem({item, index}){
        return (
            <TouchableOpacity onPress={()=> this._onAd(item)} >
                <View style={[styles.ad_item, styles.live_box]}>
                    <Image roundAsCircle={true} source={{uri:item.fileUrl}} style={[styles.ad_img]}/>
                </View>
            </TouchableOpacity>
        );
    }

    _onAd(item){
        const { navigation } = this.props;
        let adlink = item.link;

        if (adlink.substring(0, 4) === 'http') {

            navigation.navigate('AdWebView', { link: adlink })

        } else {

            if (adlink.indexOf('courseDesc') !== -1) {

                let courseId = adlink.split('=')[1]
                const couse = { 'courseId': courseId.split("&")[0] };
                navigation.navigate('Vod', { course: couse, courseName: '' });

            } else if (adlink.indexOf('consultDesc') !== -1) {

                let courseId = adlink.split('=')[1]
                const article = { 'articleId': courseId.split("&")[0] };
                navigation.navigate('Article', { article: article })

            } else if (adlink.indexOf('liveDesc') !== -1) {

                let courseId = adlink.split('=')[1];
                let courseName = '直播';

                if (adlink.split('=').length === 3) {
                    courseName = adlink.split('=')[2]
                }

                const course = { 'courseId': courseId.split("&")[0], courseName: courseName };

                navigation.navigate('Live', { course: course })
            }else if(adlink.indexOf('mailDesc') !== -1){
                let goodsId = adlink.split('=')[1];
                request.get('/shop/goods/'+goodsId)
                .then(res=>{
                    navigation.navigate('MailDetail', {cate: res})
                })
            }
        }
    }


    render() {

        const {navigation} = this.props;
        const {keyword,currentAd,tabbar_bottom,tabbarIndex} = this.state;

        let cates = this.shopCategory.slice(0,4);
        let exchange = this.shopExchange.slice(0,3);
        let limits = this.limitGoods.slice(0,3);

        return (
            <View style={styles.container}>

                <ScrollView style={[styles.col_1]}>

                    <View style={[styles.searchbox,styles.fd_r,styles.pb_12,styles.ai_ct,styles.pl_10,styles.pr_15,styles.bg_white,styles.pt_5]}>
                        <TouchableOpacity style={[styles.search_input,styles.fd_r,styles.ai_ct,styles.col_1,styles.pl_12]}
                            onPress={()=>navigation.navigate('MailSearch',{keyword:keyword})}
                        >
                            <Image source={asset.search} style={[styles.search_icon]} />
                            <Text style={[styles.default_label,styles.tip_label,styles.pl_5]}>{keyword}</Text>
                        </TouchableOpacity>

                    </View>

                    <View>
                        <Carousel
                            useScrollView={true}
                            data={this.admail}
                            autoplay={true}
                            loop={true}
                            autoplayDelay={5000}
                            renderItem={this._renderAdItem}
                            
                            itemWidth={theme.window.width * 0.9}
                            itemHeight={theme.window.width * 0.9 * 0.39}

                            sliderWidth={theme.window.width}
                            sliderHeight={theme.window.width * 0.39}

                            activeSlideAlignment={'center'}
                            inactiveSlideScale={0.7}
                            
                            onSnapToItem = {(index) => this.setState({currentAd: index})}
                        />
                        <Pagination
                            dotsLength={this.admail.length}
                            activeDotIndex={currentAd}
                            containerStyle={styles.ad_page}
                            dotStyle={styles.ad_dot}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>

                    <View style={[styles.fd_r,styles.ai_ct,styles.mt_15,styles.pl_15,styles.pr_15]}>

                        {
                            cates.map((s_cate,index)=>{
                                return(
                                    <TouchableOpacity style={[styles.col_1,styles.fd_c,styles.ai_ct,styles.jc_ct]} key={'s_cate' + index}
                                        onPress={()=>navigation.navigate('MaiList',{ctype:s_cate.ctype,title:s_cate.categoryName,cateId:s_cate.categoryId,type:1})}
                                    >
                                        <Image source={{uri:s_cate.link}} style={[styles.cateBox]} />
                                        <Text style={[styles.sm_label,styles.fw_label,styles.c33_label]}>{s_cate.categoryName}</Text>
                                    </TouchableOpacity>
                                )
                                
                            })
                        }

                        <TouchableOpacity style={[styles.col_1,styles.fd_c,styles.ai_ct,styles.jc_ct]} 
                            onPress={()=>navigation.navigate('MailCate')}
                        >
                            <View style={[styles.cateBox]}>
                                <Image source={asset.mail.cateIcon} style={{width:20,height:20}} />
                            </View>
                            <Text style={[styles.sm_label,styles.fw_label,styles.c33_label]}>全部分类</Text>
                        </TouchableOpacity>

                    </View> 
                    
                    {
                        this.sellTop.length > 0 ?
                        <View style={[styles.pl_15 ,styles.pr_15 ,styles.mt_20 ,styles.recomm]}>
                            <View style={[styles.fd_r ,styles.jc_sb]}>
                                <View style={[styles.fd_r ,styles.ai_ct]}>
                                    <View style={[styles.headBorder]}></View>
                                    <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label ,styles.pl_10]}>人气单品</Text>
                                </View>
                            </View>
                            <View style={[styles.popularItem,styles.mt_20]}>
                                <ScrollView
                                    scrollX
                                    horizontal={true}
                                    showsVerticalScrollIndicator={false}      
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        this.sellTop.map((good,index)=>{
                                            return(
                                                <View style={[styles.mr_8]}>
                                                    <GoodsCell style={{width:90}} good={good} type={4} btype={0} key={'good'+index} etype={0}
                                                        onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    :null}
                    
                    
                    {
                        limits.length > 0 ?
                        <View style={[styles.pl_15 ,styles.pr_15 ,styles.mt_20 ,styles.recomm]}>
                            <View style={[styles.fd_r ,styles.jc_sb]}>
                                <View style={[styles.fd_r ,styles.ai_ct]}>
                                    <View style={[styles.headBorder]}></View>
                                    <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label ,styles.pl_10]}>限时抢购</Text>
                                </View>
                                <TouchableOpacity onPress={()=>navigation.navigate('MaiList',{title:'限时抢购'})}>
                                    <Text style={[styles.sm_label,styles.tip_label]}>更多</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct,styles.mt_20,styles.cons]}>
                                {
                                    limits.map((good,index)=>{
                                        return(
                                            <GoodsCell style={{width:(theme.window.width - 75)/3}} good={good} type={2} btype={1} key={'good'+index} etype={0} itype={1}
                                                onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                                            />
                                        )
                                    })
                                }
                            </View>
                        </View>
                    :null}
                    
                    
                    {
                        exchange.length > 0 ?
                        <View style={[styles.pl_15 ,styles.pr_15 ,styles.mt_20 ,styles.recomm]}>
                            <View style={[styles.fd_r ,styles.jc_sb]}>
                                <View style={[styles.fd_r ,styles.ai_ct]}>
                                    <View style={[styles.headBorder]}></View>
                                    <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label ,styles.pl_10]}>用户专享</Text>
                                </View>
                                <TouchableOpacity onPress={()=>navigation.navigate('GeneralList',{title:'兑换专区',exchange_type:0,ctype:0})}>
                                    <Text style={[styles.sm_label,styles.tip_label]}>更多</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.fd_r,styles.jc_sb,styles.ai_ct,styles.mt_20,styles.cons]}>
                                {
                                    exchange.map((good,index)=>{
                                        return(
                                            <GoodsCell style={{width:(theme.window.width - 75)/3}} good={good} type={3} btype={1} key={'good'+index} etype={0} itype={1}
                                                onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                                            />
                                        )
                                    })
                                }
                            </View>
                        </View>
                    :null}
                    
                    

                    {
                        this.vipEnjoy.length > 0 ?
                        <View style={[styles.pl_15 ,styles.pr_15 ,styles.mt_20 ,styles.recomm]}>
                            <View style={[styles.fd_r ,styles.jc_sb]}>
                                <View style={[styles.fd_r ,styles.ai_ct]}>
                                    <View style={[styles.headBorder]}></View>
                                    <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label ,styles.pl_10]}>会员专享礼</Text>
                                </View>
                                <TouchableOpacity onPress={()=>navigation.navigate('GeneralList',{title:'会员专享礼',exchange_type:1,ctype:9,type:10})}>
                                    <Text style={[styles.sm_label,styles.tip_label]}>更多</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.fd_r,styles.jc_sb,styles.mt_20,{flexWrap:'wrap'}]}>
                                {
                                    this.vipEnjoy.map((good,index)=>{
                                        return(
                                            <GoodsCell style={{width:(theme.window.width - 36)/2}} good={good} type={0} btype={1} key={'good'+index} etype={0} itype={0}
                                                onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                                            />
                                        )
                                    })
                                }
                            </View>
                        </View>
                    :null}
                    
                    {
                        this.lectEnjoy.length > 0 ? 
                        <View style={[styles.pl_15 ,styles.pr_15 ,styles.mt_20 ,styles.recomm]}>
                            <View style={[styles.fd_r ,styles.jc_sb]}>
                                <View style={[styles.fd_r ,styles.ai_ct]}>
                                    <View style={[styles.headBorder]}></View>
                                    <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label ,styles.pl_10]}>讲师专享</Text>
                                </View>
                                <TouchableOpacity onPress={()=>navigation.navigate('GeneralList',{title:'讲师专享',exchange_type:9,ctype:1,type:1})}>
                                    <Text style={[styles.sm_label,styles.tip_label]}>更多</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.fd_r,styles.jc_sb,styles.mt_20,{flexWrap:'wrap'}]}>
                                {
                                    this.lectEnjoy.map((good,index)=>{
                                        return(
                                            <GoodsCell style={{width:(theme.window.width - 36)/2}} good={good} type={1} btype={1} key={'good'+index} etype={0} itype={0}
                                                onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                                            />
                                        )
                                    })
                                }
                            </View>
                        </View>
                    :null}
                    
                    
                    {
                        this.newRecomm.length > 0 ?
                        <View style={[styles.pl_15 ,styles.pr_15 ,styles.mt_20 ,styles.recomm]}>
                            <View style={[styles.fd_r ,styles.jc_sb]}>
                                <View style={[styles.fd_r ,styles.ai_ct]}>
                                    <View style={[styles.headBorder]}></View>
                                    <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label ,styles.pl_10]}>新品推荐</Text>
                                </View>
                            </View>
                            <View style={[styles.fd_r,styles.jc_sb,styles.mt_20,{flexWrap:'wrap'}]}>
                                {
                                    this.newRecomm.map((good,index)=>{
                                        return(
                                            <GoodsCell style={{width:(theme.window.width - 36)/2}} good={good} type={3} btype={1} key={'good'+index} etype={0} itype={0}
                                                onPress={(good) => navigation.navigate('MailDetail', {cate: good})} 
                                            />
                                        )
                                    })
                                }
                            </View>
                        </View>
                    :null}
                    

                </ScrollView>
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
    container:{
        flex:1,
        backgroundColor:'#f8f8f8'
    },
    search_input:{
        height:35,
        backgroundColor:'#F4F4F4',
        borderRadius:5,
    },
    search_icon:{
        width: 16,
        height: 16,
    },
    search_text:{
        height:20,
    },
    search_action:{
        width:40,
        height:18,
        textAlign:'center',
        position:'relative',
    },
    msg_icon:{
        width:20,
        height:18,
    },
    search_tip:{
        position:'absolute',
        top:-10,
        right:10,
        width:16,
        height:16,
        borderRadius:8,
        backgroundColor:'#FF0013',
        justifyContent:'center',
        alignItems:'center',
    },
    ad_img:{
        width: theme.window.width * 0.9,
        height:135,
        borderRadius:8
    },
    ad_page: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 5
    },
    ad_dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    live_box:{
        shadowOffset:{  width: 0,  height:2},
        shadowColor: 'rgba(233,233,233, 1.0)',
        shadowOpacity: 0.5,
        elevation: 1,//安卓，让安卓拥有阴影边框
        borderRadius:8
    },
    cateBox:{
        width:((theme.window.width - 102) / 5).toFixed(0) * 1,
        height:((theme.window.width - 102) / 5).toFixed(0) * 1,
        borderRadius:((theme.window.width - 102) / 10).toFixed(0) * 1,
        marginBottom:10,
        backgroundColor:'#f5f5f5',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
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
    },
    popu_item:{
        position:'relative',
        marginRight:8,
    },
    popu_cover:{
        width:90,
        height:90,
        borderRadius:6,
        backgroundColor:'#ffffff',
    },

    headBorder:{
        backgroundColor:'#F4623F',
        width:4,
        height: 17,
        borderRadius:3,
    },
    cons:{
        width:theme.window.width - 32,
        backgroundColor:'#ffffff',
        borderColor:'#f1f1f1',
        borderStyle:'solid',
        borderWidth:1,
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15
    }
});

export const LayoutComponent = Mail;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        config:state.site.config,

        admail:state.mall.admail,
        shopCategory:state.mall.shopCategory,

        sellTop:state.mall.sellTop,
        shopExchange:state.mall.shopExchange,
        vipEnjoy:state.mall.vipEnjoy,
        lectEnjoy:state.mall.lectEnjoy,
        newRecomm:state.mall.newRecomm,
        limitGoods:state.mall.limitGoods,

	};
}
