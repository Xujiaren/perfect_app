import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity,TextInput, ActionSheetIOS,Dimensions, Platform} from 'react-native';

import asset from '../../config/asset';
import theme from '../../config/theme';

import Carousel from 'react-native-snap-carousel';



const slideWidth = Dimensions.get('window').width;



class EquityState extends Component {
    static navigationOptions = {
        title:'权益详情',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.userInfo = {};
        this.state = {
            activeSlide:0,
            userInfo:{},
            equityList:[],
            currentIdx:0,
            equityId:0
        };

        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {user} = nextProps;
        if (user !== this.props){
            this.userInfo = user;
        }
    }

    componentWillMount(){
        const {navigation} = this.props
        const {params} = navigation.state
        const {equityList,equityId} = params

        let levelIndex = 0
        for(let i = 0 ; i < equityList.length ; i++){

            if(equityList[i].equityId === equityId){
                levelIndex = i
            }

        }

        this.setState({
            equityList:equityList,
            equityId:equityId,
            activeSlide:levelIndex
        })
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.user.user();
    }


    _renderItem({item, index}){
        const {currentIdx} = this.state;
        const on = currentIdx  === index;

        return (
            <View style={[styles.levels]}>
                <View style={ styles.sharebox}>
                    <Image source={asset.bg.equity_head}  style={[styles.share_head]}/>
                    <View style={[styles.headbox, styles.d_flex, styles.fd_c ,styles.ai_ct ,styles.jc_ct]}>
                        <View style={[styles.head_icon, styles.d_flex ,styles.ai_ct ,styles.jc_ct]}>
                            <Image source={{uri:item.equityImg}}  style={[styles.c_gift]} />
                        </View>
                        <Text style={[styles.lg_label, styles.black_label ,styles.fw_label,styles.mt_5]}>{item.equityName}</Text>
                    </View>
                    <View style={[styles.d_flex, styles.fd_c ,styles.mt_20 ,styles.pr_20 ,styles.pl_12]}>
                        <Text style={[styles.black_label ,styles.lg_label ,styles.border_let ,styles.ml_5  ,styles.pl_15 ,styles.mb_10 ,styles.fw_label]}>服务用户</Text>
                        <Text style={[styles.sm_label ,styles.tip_label ,styles.ml_25]}> {item.leveStr}</Text>
                        <Text style={[styles.lg_label ,styles.black_label ,styles.border_let ,styles.ml_5 ,styles.mt_30 ,styles.mb_20 ,styles.pl_15 ,styles.fw_label]}> 权益说明</Text>
                        <View style={[styles.share_txt ,styles.pl_25]}>
                            <Text style={[styles.gray_label ,styles.sm_label]}>{item.content}</Text>
                        </View>
                    </View>
                    <View style={[styles.share_cover]}>
                        <Image source={{uri:item.bottomImg}}  style={[styles.share_pic]} />
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const {currentIdx,equityList,activeSlide} = this.state;

        if(this._carousel !== undefined){
            this._carousel.snapToItem(activeSlide)
        }


        return (
            <View style={[styles.container,styles.mt_20]}>

                <Carousel
                    useScrollView={true}
                    ref={(ref) => { //方法对引用Carousel元素的ref引用进行操作
                        this._carousel = ref;
                    }}
                    currentIndex={currentIdx}
                    data={equityList}
                    layout={'default'}
                    renderItem={this._renderItem}
                    sliderWidth={slideWidth}
                    itemWidth={280}
                    layoutCardOffset={18}
                    removeClippedSubviews={false}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                />
            </View>
        );
    }
}



const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#FAFAFA'
    },
    levels:{
        width:280,
        height:600,
        borderRadius:3
    },
    sharebox:{
        backgroundColor:'#ffffff',
        borderRadius:5,
        width:280,
        height:600,
        borderWidth:1,
        borderColor:'rgba(233,233,233,1)',
        borderStyle:'solid',
        shadowOffset:{  width: 0,  height:5},
        shadowColor: 'rgba(233,233,233,1)',
        shadowOpacity: 1.0,
        elevation: 1,//安卓，让安卓拥有阴影边框
    },
    share_head:{
        height:80,
        width:'100%',
        borderTopLeftRadius:3,
        borderTopRightRadius:3,
    },
    head_icon:{
        width:46,
        height:46,
        borderRadius:23,
        backgroundColor:'#EBC992',
        marginTop:-28,
    },
    c_gift:{
        width:46,
        height:46,
        borderRadius:23,
    },
    black_label:{
        lineHeight:18,
    },
    share_cover:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    share_pic:{
        width:200,
        height:200,
    },
    border_let:{
        borderLeftColor:'#EBC992',
        borderLeftWidth:3,
        borderStyle:'solid',
    },
    share_txt:{
        lineHeight:16,
    },
});

export const LayoutComponent = EquityState;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userlevel:state.user.userlevel,
	};
}
