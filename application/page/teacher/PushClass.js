import React, { Component } from 'react'
import { Text, View ,StyleSheet,TouchableOpacity,Image,Modal} from 'react-native';

import * as WeChat from 'react-native-wechat-lib';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import HudView from '../../component/HudView';
import asset from '../../config/asset';
import theme from '../../config/theme';
import iconMap from '../../config/font';

class PushClass extends Component {

    static navigationOptions = {
        title:'推课赚钱',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);

        this.course = []
        this.page = 0;
		this.totalPage = 1;

        this.state = {
            status:0,
            nowdate:0,
            isPush:false,
            pushCover:'',
            pushtxt:'',

            
            refreshState: RefreshState.Idle,
        }

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);

        this._onShare = this._onShare.bind(this);
        this._toggleShare = this._toggleShare.bind(this);

        this._onPress = this._onPress.bind(this);
        this._onDown = this._onDown.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {userAgent} = nextProps ;

        if(userAgent !== this.props.userAgent){
            this.course = this.course.concat(userAgent.items);
			this.page = userAgent.page ;
			this.totalPage = userAgent.pages;
        }


        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }


    componentDidMount(){
        const {actions} = this.props;
        this._onHeaderRefresh();

        actions.user.user();
    }

    _onHeaderRefresh(){
        const {actions} = this.props;

        this.course = [];
        this.page = 0 ;

        actions.user.userAgent(0,this.page);

        this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh(){
        const {actions} = this.props;


		if (this.page < this.totalPage) {

			this.setState({refreshState: RefreshState.FooterRefreshing});

            this.page = this.page + 1;
            
            actions.user.userAgent(0,this.page);

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}


    }


    _renderItem(item){
        const course = item.item;
        let push_prices = 0;
        let push_pricess = 0;
        push_prices = (course.sellCash).toFixed(2);
        push_pricess = course.sellIntegral
        return(
            <TouchableOpacity style ={[styles.fd_r, styles.pb_15]} onPress={() => this._onPress(course)}>
                <View>
                    <Image source={{uri:course.courseImg}} mode='aspectFit' style ={[styles.item_cover]}/>
                    <View style ={[styles.item_tips_hit]}>
                        <Text style={[styles.icon, styles.sm8_label ,styles.white_label]}>{iconMap('youyinpin')}</Text>
                        <Text style ={[styles.sm8_label ,styles.white_label, styles.ml_5]}>{course.chapter}讲</Text>
                    </View>
                </View>
                <View style ={[styles.fd_c, styles.pl_10 ,styles.jc_sb ,styles.col_1]}>
                    <View style ={[styles.fd_c]}>
                        <Text style ={[styles.default_label ,styles.c33_label ,styles.fw_label]} numberOfLines={1}>{course.courseName}</Text>
                        <Text style ={[styles.sml_label ,styles.tip_label,styles.mt_5]} numberOfLines={1}>{course.summary}</Text>
                    </View>

                    <View style ={[styles.fd_r ,styles.ai_ct ,styles.mt_5 ,styles.jc_sb]}>
                        <View style ={[styles.fd_r ,styles.ai_ct]}>
                            <Text style ={[styles.sm_label, styles.c33_label, styles.ml_5]}>{course.integral==0?'¥'+course.courseCash:course.integral+'学分'}</Text>
                        </View>
                        <TouchableOpacity  style={[styles.fd_r ,styles.ai_ct]} onPress={()=> this._onShare(course)}>
                            <Image source={asset.share_r_icon} style={[styles.view_icon]} />
                            {
                                course.integral?
                                <Text style={[styles.sred_label,styles.sm_label,styles.pl_3]}>赚{push_pricess}学分</Text>
                                :null
                            }
                            {
                                course.courseCash?
                                <Text style={[styles.sred_label,styles.sm_label,styles.pl_3]}>赚￥{push_prices}</Text>
                                :null
                            }
                            
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onShare(course){

        this.setState({
            pushCover:course.courseImg,
            pushtxt:course.courseName,
            isPush:true,
        })
    }

    _toggleShare = (type) => {

        WeChat.isWXAppInstalled().then(isInstalled => {

            if (isInstalled) {
                this.refs.viewShot.capture().then(uri => {

                    if(Platform.OS === 'android'){
                        WeChat.shareImage({
                            imageUrl: uri,
                            scene: type
                        }).then(data => {
                            this.setState({
                                isPush: false,
                            }, () => {
                                this.refs.hud.show('分享成功', 1);
                            })
                        }).catch(error => {
                            
                        })
                    } else {

                        WeChat.shareImage({
                            imageUrl: 'file:/' + uri,
                            scene: type
                        }).then(data => {
                            this.setState({
                                isPush: false,
                            }, () => {
                                this.refs.hud.show('分享成功', 1);
                            })
                        }).catch(error => {
                            
                        })
                    }
                    
                    
                });
            }
        })
    }

        _onDown(){
            this.refs.viewShot.capture().then(uri => {
                
                CameraRoll.saveToCameraRoll(uri).then(result=>{

                    this.setState({
                        isPush:false,
                    },()=>{
                        this.refs.hud.show('保存成功', 2);
                    });
                }).catch(error=>{
                    this.refs.hud.show('保存失败', 2);
                });
            })
        }


    _onPress(course){
        const {navigation} = this.props;
        if(course.ctype === 0 ){
            navigation.navigate('Vod', {course: course})
        } else if(course.ctype === 1) {
            // navigation.navigate('Audio', {course: course})
        }
    }





    render() {
        const {user} = this.props;
        const {isPush,pushCover,pushtxt} = this.state;

        return (
            <View style={[styles.container]}>
                <View style={[styles.pushhead,styles.fd_r,styles.ai_ct]}>
                    <Text style={[styles.gray_label,,styles.default_label ,styles.pl_20]}>邀请人数不设上限，邀请更多获益更多</Text>
                </View>
                <View style={styles.wrap}>
                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.course}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                        onFooterRefresh={this._onFooterRefresh}
                    />
                </View>

                <Modal  visible={isPush} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} ></TouchableOpacity>
                    <View style={[styles.layerBox]} >
                        <View style={styles.wechatType}>
                            <View style={[styles.fd_r,styles.jc_fe,styles.mr_10,styles.mb_10]}>
                                <TouchableOpacity style={[styles.dete_box]} onPress={()=>this.setState({isPush:false})}>
                                    <Image source={asset.dete_icon} style={[styles.dete_icon]} />
                                </TouchableOpacity>   
                            </View>            
                            <ViewShot ref='viewShot' options={{ format: 'png', quality: 0.1 , result: Platform.OS === 'ios' ? 'tmpfile' : 'tmpfile'}}>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <Image source={{uri:''}} style={[styles.imgCover]} />
                                </View>
                                <View style={[styles.head,styles.fd_r,styles.ai_ct,styles.mt_10,{marginLeft:18}]}>
                                    <Image source={{uri:user.avatar}}  style={[styles.headCover]}/>
                                    <Text style={[styles.lg_label,styles.black_label,styles.ml_10]}>{user.nickname}</Text>
                                </View>
                                <View style={[styles.fd_r,styles.pushBox,styles.mt_12,{marginLeft:18}]}>
                                    <Image source={{uri:pushCover}} style={[styles.pushCover]} />
                                    <View style={[styles.fd_c,styles.jc_sb,styles.mt_8,styles.mb_8,{width:126}]}>
                                        <Text style={[styles.c33_label,styles.default_label,styles.fw_label]} numberOfLines={3}>{pushtxt}</Text>
                                        <Text style={[styles.sred_label,styles.default_label,styles.right_label]}>赚￥2.8</Text>
                                    </View>
                                </View>
                            </ViewShot>
                            <View style={[styles.fd_c,styles.mt_30]}>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <Text style={[styles.black_label,styles.lg_label]}>分享到</Text>
                                </View>
                                <View style={[styles.wechatIcons,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mt_20]}>
                                    <TouchableOpacity style={[styles.item ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1 ]}
                                        onPress={() => this._toggleShare(0)}
                                    >
                                        <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]}>
                                            <Image source={asset.wechat} style={[styles.item_box]} />
                                        </View>
                                        <Text style={[styles.default_label ,styles.m_5]}>微信好友</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.item  ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1]}
                                        onPress={() => this._toggleShare(1)}
                                    >
                                        <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]} >
                                            <Image source={asset.friends} style={[styles.item_box]} />
                                        </View>
                                        <Text style={[styles.default_label ,styles.m_5]}>朋友圈</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={[styles.item  ,styles.fd_c ,styles.jc_ct ,styles.ai_ct,styles.col_1]}
                                        onPress={this._onDown}
                                    >
                                        <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]} >
                                            <Image style={[styles.save_icon]} mode='aspectFit' source={asset.local}/>
                                        </View>
                                        <Text style={[styles.default_label ,styles.m_5]}>保存本地</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> 
                    </View>
                </Modal>
                <HudView ref={'hud'} />
            </View>
        )
    }
}


const styles =  StyleSheet.create({

    ...theme.base,
    container:{
        flex: 1,
        backgroundColor:'#ffffff',
    },
    pushhead:{
        width:theme.window.width,
        height:44,
        backgroundColor:'#FFF9F0'
    },
    wrap:{
        paddingLeft:20,
        paddingRight:24,
        marginTop:15
    },
    item_cover:{
        width:136,
        height:72,
        borderRadius:5,
        backgroundColor:'#fafafa',
    },
    item_tips_hit:{
        position:'absolute',
        bottom: 5,
        right: 5,
        height:14,
        width: 40,
        backgroundColor:'rgba(0,0,0,0.65)',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgba(255,255,255,0.65)',
        borderRadius: 8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    cate_new_cover: {
        position:'absolute',
        top: -5,
        right: -5,
    },
    cate_new_icon: {
        width: 18,
        height: 12
    },
    view_icon:{
        width:13,
        height:13
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    layerBox:{
        position:'absolute',
        top:0,
        left:0,
        width:theme.window.width,
        height:theme.window.height,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    wechatType:{
        width:320,
        borderRadius:5,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        justifyContent:'center',
        paddingBottom:25,
        paddingTop:10,
    },
    imgCover:{
        width:284,
        height:284,
        backgroundColor:'#fafafa'
    },
    headCover:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#fafafa'
    },
    pushBox:{
        width:282,
        height:90,
        borderRadius:5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#E1E1E1',

    },
    pushCover:{
        marginTop:8,
        marginLeft:8,
        marginRight:8,
        width:134,
        height:75,
        backgroundColor:'#fafafa'
    },
    item_box:{
        width:40,
        height:40
    },
    save_icon:{
        width:40,
        height:40
    },
    dete_box:{
        width:24,
        height:24,
        borderWidth:1,
        borderRadius:13,
        borderColor:'#666666',
        borderStyle:'solid',
        flexDirection:'row-reverse',
        alignItems:'center',
        justifyContent:'center',
    },
    dete_icon:{
        width:14,
        height:14
    }
});

export const LayoutComponent = PushClass;

export function mapStateToProps(state) {
	return {
        userAgent:state.user.userAgent,
        user:state.user.user,
	};
}
