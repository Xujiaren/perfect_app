import React, { Component } from 'react'
import { View, Text ,StyleSheet,Image,TouchableOpacity,TextInput,Modal,ScrollView} from 'react-native';

import LabelBtn from '../../../component/LabelBtn';
import theme from '../../../config/theme';
import asset from '../../../config/asset'

class FdBack extends Component {

    static navigationOptions = {
        title:'帮助反馈',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.cateQuestion = []


        this.state = {
            showId:0,
            cateFeed_id:0,
            isArrow:false,
            category_id:0,
            configHelp:[],
            unionId:'',
            nickname: '',
            userId:0,
        }

        this._onCate = this._onCate.bind(this);
        this._backDesc = this._backDesc.bind(this);
        this._onPage = this._onPage.bind(this) ;
        this._onKefu = this._onKefu.bind(this);
    }

    componentWillReceiveProps(nextProps){

        const {cateQuestion,configHelp,user} = nextProps

        if(cateQuestion !== this.props.cateQuestion){
            this.cateQuestion = cateQuestion

            let cateFeed_id = cateQuestion[0].categoryId

            this.setState({
                category_id:cateFeed_id
            })
        }

        if(configHelp !== this.props.configHelp){
            this.setState({
                configHelp:configHelp.items
            })
        }

        if(user !== this.props.user){
            this.setState({
                nickname: user.nickname,
                unionId: user.unionId,
                userId: user.userId
            })
        }
    }

    componentWillMount(){
        
    }

    componentDidMount(){
        const {actions} = this.props

        actions.user.cateQuestion();
        actions.user.user();

    }

    _onPage(){
        const {navigation} = this.props
        navigation.navigate('FeedBack')
    }


    _onCate(cate,index){

        const {showId} = this.state



        this.setState({
            showId:0,
            configHelp:[]
        })

        if(cate.categoryId !== showId){
            this._getHelpList(cate.categoryId)
            this.setState({
                showId:cate.categoryId
            })
        }
    }

    _getHelpList(cateId){
        const {actions} = this.props

        actions.user.configHelp(cateId,'',0)
    }

    _backDesc(item,categoryName,configHelp,idx){

        const {navigation} = this.props
        configHelp.splice(idx,1)

        navigation.navigate('FdBackDesc',{configHelp:configHelp,fbData:item,title:categoryName})

    }

    _onKefu(){
        const {navigation} = this.props;
        const {userId, unionId, nickname} = this.state;

        if(unionId !== ''){
            navigation.navigate('Kefu',{unioinId: unionId, nickname: nickname})
        } else {
            navigation.navigate('Kefu',{unionId: userId, nickname: nickname})
        }
    }


    render() {

        const {showId,configHelp} = this.state

        return (
            <View style={styles.container}>
                <ScrollView style={styles.equitycons}
                    showsVerticalScrollIndicator={false}      
                    showsHorizontalScrollIndicator={false}
                >
                    <LabelBtn label={'帮助反馈'}  nav_val={'FeedBack'}  clickPress={this._onPage} />
                    <LabelBtn label={'联系客服'}  nav_val={'kefu'}  clickPress={this._onKefu} />

                    <View style={styles.wrap}>
                    <View style={[styles.pt_20 ,styles.pb_20]}>
                        <Text style={[styles.lg20_label ,styles.c33_label ,styles.fw_label]}>常见问题</Text>
                    </View>
                    { 
                        this.cateQuestion.map((cate,index)=>{
                            return <View key={'cate' + index }>
                                        <TouchableOpacity style={[styles.fd_r ,styles.ai_ct ,styles.pt_10 ]}
                                            onPress={this._onCate.bind(this,cate,index)}
                                        >
                                            <Image source={{uri:cate.link}} resizeMode={'contain'}  style={styles.fd_icon} />
                                            <View style={showId === cate.categoryId && configHelp.length > 0 ? [styles.bg_cate ,styles.border_nbtm ] : [styles.bg_cate ,styles.border_obtm] }>
                                                <View style={styles.fd_c}>
                                                    <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label]}>{cate.categoryName}</Text>
                                                    <Text style={[styles.tip_label ,styles.sm_label,styles.mt_2]} numberOfLines={2}>{cate.summary}</Text>
                                                </View>
                                                {
                                                    showId === cate.categoryId ? 
                                                    <Image source={asset.arrow_top}   style={styles.arrow_icon_b} />
                                                    :
                                                    <Image source={asset.arrow_bottom}  style={[styles.arrow_icon_b]} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                            
                                        {
                                            showId === cate.categoryId  && configHelp.length > 0 ? 
                                            <View style={styles.wrap_bottom}>
                                                {
                                                    configHelp.map((ccitem,idx)=>{
                                                        return(
                                                            <TouchableOpacity style={[styles.fd_r ,styles.jc_sb ,styles.pt_10 ,styles.pb_10 ,styles.bd_bt]}
                                                                key={'ccitem' + idx}
                                                                onPress={this._backDesc.bind(this,ccitem,cate.categoryName,configHelp,idx)}
                                                            >
                                                                <Text style={[styles.gray_label ,styles.sm_label]}>{ccitem.title}</Text>
                                                                <Image source={asset.arrow_right}  mode='aspectFit' style={[styles.arrow_icon_r]} />
                                                            </TouchableOpacity>
                                                        )
                                                    
                                                    })
                                                }
                                            </View>
                                        :null}
                                </View>
                        })
                    }
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    wrap:{
        paddingLeft:20
    },
    fd_icon:{
        width:30,
        height:30,
        marginRight:20,
    },
    arrow_icon_r:{
        width:6,
        height:11,
    },
    arrow_icon_b:{
        width:11,
        height:6,
    },
    wrap_bottom:{
        backgroundColor:'#F3F3F3',
        paddingLeft:25,
        paddingRight:30,
        marginRight:30,
        paddingTop:5,
        marginTop:10,
    },
    bd_bt:{
        borderBottomWidth:2,
        borderBottomColor:'#E8E8E8',
        borderStyle:'solid'
    },
    bg_cate:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        flex:1,
        paddingRight:30,
        paddingTop:10,
        paddingBottom:10
    },
    border_obtm:{
        borderBottomWidth:2,
        borderBottomColor:'#F7F7F7',
        borderStyle:'solid'
    },
    border_nbtm:{
        borderBottomWidth:2,
        borderBottomColor:'#FFFFFF',
        borderStyle:'solid'
    },
})

export const LayoutComponent = FdBack;

export function mapStateToProps(state) {
	return {
        cateQuestion:state.user.cateQuestion,
        configHelp:state.user.configHelp,
        user:state.user.user,
	};
}
