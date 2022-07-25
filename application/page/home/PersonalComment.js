import React, { Component } from 'react'
import { View,Text,StyleSheet,TouchableOpacity,Image,NativeModules,Platform,StatusBar,Modal,ActivityIndicator} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-navigation-stack';

import HudView from '../../component/HudView';

const { StatusBarManager } = NativeModules;

import asset from '../../config/asset';
import theme from '../../config/theme';

const slideWidth = theme.window.width;

class PersonalComment extends Component {

    static navigationOptions = {
        header:null,
    };

    constructor(props){
        super(props);
        const {navigation} = this.props;
        this.userId = navigation.getParam('userId', 0);
        this.avatar = navigation.getParam('avatar', '');
        this.username = navigation.getParam('commentName', '');
        this.commentTxt = navigation.getParam('commentTxt', '');
        this.courseName = navigation.getParam('courseName', '');
        this.pubTimeFt = navigation.getParam('pubTimeFt', '');




        this.state = {
            statusBarHeight:0,
            navHeight:0,
            persionType:false,
            userId:0,
            a_isBlack:0,
            a_isFollow:0,
            loaded:false,
        };

        this._onAction = this._onAction.bind(this);

    }

    UNSAFE_componentWillMount(){

        if (Platform.OS === 'ios'){
            StatusBarManager.getHeight(statusBarHeight => {
                this.setState({
                    statusBarHeight:statusBarHeight.height,
                });
            });
        } else {
            const statusBarHeight = StatusBar.currentHeight;
            this.setState({
                statusBarHeight:statusBarHeight,
            });
        }

        let navigationHeight = Header.HEIGHT;//即获取导航条高度
        this.setState({
            navHeight:navigationHeight,
        });
    }

    componentWillReceiveProps(nextProps){
        const {user,auser} = nextProps;

        if(user !== this.props.user){

            this.setState({
                userId:user.userId
            })
        }

        if(auser !== this.props.auser){
            this.setState({
                a_isBlack:auser.isBlack,
                a_isFollow:auser.isFollow,
                loaded:true
            })
        }
    }

    componentDidMount(){
        const {actions} = this.props;
        actions.user.user();
        actions.user.auser(this.userId);
    }


    _onAction(action,args){

        const {actions,navigation} = this.props;
        const {a_isFollow,a_isBlack} = this.state;

        if(action == 'Follow'){
            if(a_isFollow){
                actions.user.aremoveFollow({
                    content_id: this.userId,
                    ctype:0,
                    resolved: (data) => {
                        this.refs.hud.show('取消关注', 1);

                        this.setState({
                            a_isFollow: false
                        })
                    },
                    rejected: (res) => {
                        
                    },
                });
            } else {
                actions.user.auserfollow({
                    content_id: this.userId,
                    ctype:0,
                    resolved: (data) => {
                        this.refs.hud.show('关注成功', 1);

                        this.setState({
                            a_isFollow: true
                        })
                    },
                    rejected: (res) => {
                        
                    },
                });
            }
        } else if(action == 'Report'){
            this.setState({
                persionType:false
            },()=>{
                navigation.navigate('Report',{commentTxt:this.commentTxt,commentName:this.username,courseName:this.courseName})
            })
        } else if(action == 'Back'){
            this.setState({
                persionType:false
            },()=>{
                if(a_isBlack){
                    this.refs.hud.show('已拉黑', 1);
                } else {
                    actions.user.userBack({
                        toId:this.userId,
                        operation:'add',
                        resolved: (data) => {
                            this.refs.hud.show('已拉黑', 1);
                            this.setState({
                                a_isBlack: true
                            })
                        },
                        rejected: (res) => {
                            
                        },
                    })
                }
            })
            
        }
        
    }

    render() {
        const {navigation} = this.props;
        const {statusBarHeight,navHeight,persionType,userId,a_isBlack,a_isFollow,loaded} = this.state;

        if (!loaded) return (
            <View style={[styles.container, styles.ai_ct, styles.jc_ct]}>
                <ActivityIndicator size="small" color="#F4623F" />
            </View>
        )

        return (
            <View style={styles.container}>

                <LinearGradient colors={['#FFA951','#F66633']} start={{x: 0, y: 0}}  end={{x: 1, y: 0}} style={[styles.headbox,{paddingTop:statusBarHeight,paddingBottom:35}]}>
                    <View style={[{height:navHeight,width:slideWidth},[styles.fd_r,styles.jc_sb, styles.ai_ct,styles.pb_10,styles.pt_10,styles.pl_10,styles.pr_15]]}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <Image source={asset.left_arrow} style={styles.left_arrow} />
                        </TouchableOpacity>
                        {
                            this.userId !== userId ?
                            <TouchableOpacity onPress={()=>this.setState({persionType:true})}>
                                <Image source={asset.more_icon} style={styles.more_icon} />
                            </TouchableOpacity>
                        :null}
                        
                    </View>
                </LinearGradient>
                <View style={[styles.pl_20,styles.pr_15,styles.pb_15,styles.headerCons]}>
                    <View style={[styles.fd_r,styles.ai_end,styles.jc_sb]}>
                        <View style={[styles.avatarBox]}>
                            <Image source = {{uri:this.avatar}} style={[styles.avatar]}/>
                        </View>
                        {
                            this.userId !== userId ?
                            <View>
                                {
                                    a_isBlack ? 
                                    <TouchableOpacity style={[styles.fouceBtn,a_isBlack&&styles.offBtn]}>
                                        <Text style={[styles.white_label,styles.sm_label]}>已拉黑</Text>
                                    </TouchableOpacity>
                                :
                                    <TouchableOpacity style={[styles.fouceBtn]} onPress={()=> this._onAction('Follow')}>
                                        <Text style={[styles.white_label,styles.sm_label]}>{a_isFollow ? '已关注' : '+ 关注'}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            
                        :null}
                    </View>
                    <View style={[styles.fd_c,styles.mt_8]}>
                        <Text style={[styles.lg18_label,styles.c33_label,styles.fw_label]}>{this.username}</Text>
                        <Text style={[styles.tip_label,styles.sm_label,styles.mt_8]}>{this.pubTimeFt}</Text>
                    </View>
                </View>

                <View style={[styles.p_20]}>
                    <TouchableOpacity style={[styles.fd_r, styles.ai_ct, styles.jc_fe,styles.mr_10]} 
                        onPress={()=> this._onAction('Report')}
                    >
                        <Image source={asset.report} style={styles.report_icon} />
                        <Text style={[styles.sm_label ,styles.tip_label ,styles.ml_5, styles.tip_label]}>举报</Text>
                    </TouchableOpacity>
                    <View style={[styles.mt_20]}>
                        <Text style={[styles.default_label,styles.c33_label,styles.lh18_label]}>{this.commentTxt}</Text>
                    </View>
                </View>


                <Modal  visible={persionType} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.bg_container]} onPress={()=>{this.setState({persionType:false})}}></TouchableOpacity>
                    <View style={styles.persionType}>
                        <View style={[styles.typeItems,styles.fd_c,styles.ai_ct,styles.jc_ct]}>
                            <TouchableOpacity style={[styles.typeItemt,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.bg_white]} 
                                onPress={()=> this._onAction('Report')}
                            >
                                <Text style={[styles.sred_label,styles.lg20_label]}>举报</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.typeItemb,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.bg_white]}
                                onPress={()=> this._onAction('Back')}
                            >
                                <Text style={[styles.gray_label,styles.lg20_label]}>加入黑名单</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.typeItemc,styles.fd_r,styles.ai_ct,styles.jc_ct,styles.bg_white,styles.mt_10]} onPress={()=>{this.setState({persionType:false})}}>
                            <Text style={[styles.lg20_label,{color:'#2C8BD7'}]}>取消</Text>
                        </TouchableOpacity>
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
        flex:1,
        backgroundColor:'#ffffff'
    },
    headbox:{

    },
    headerCons:{
        marginTop:-37,
        borderBottomColor:'#FAFAFA',
        borderStyle:'solid',
        borderBottomWidth:4,
    },
    avatarBox:{
        width:78,
        height:78,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    studyCons:{
        borderBottomColor:'#FAFAFA',
        borderStyle:'solid',
        borderBottomWidth:4,
    },
    avatar:{
        width:70,
        height:70,
        borderRadius:39,
        backgroundColor:'#f1f1f1',
        borderWidth:4,
        borderStyle:'solid',
        borderColor:'#ffffff',
    },
    left_arrow:{
        width:12,
        height:24,
    },
    more_icon:{
        width:6,
        height:22
    },
    fouceBtn:{
        width:60,
        height:22,
        backgroundColor:'#FF6040',
        borderRadius:11,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    offBtn:{
        backgroundColor:'#999999'
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    persionType:{
        position: 'absolute',
        bottom:80,
        left:'5%',
        width:'90%',
        height:120,
        borderRadius:5,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        zIndex:99,
    },
    typeItems:{
        width:'100%',
        borderRadius:18
    },
    typeItemt:{
        width:'100%',
        paddingTop:15,
        paddingBottom:15,
        borderTopLeftRadius:18,
        borderTopRightRadius:18,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderBottomColor:'#f1f1f1'
    },
    typeItemb:{
        width:'100%',
        paddingTop:15,
        paddingBottom:15,
        borderBottomLeftRadius:18,
        borderBottomRightRadius:18
    },
    typeItemc:{
        borderRadius:18,
        width:'100%',
        paddingTop:15,
        paddingBottom:15,
    },
    report_icon:{
        width:12,
        height:12
    },
})


export const LayoutComponent = PersonalComment;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        auser:state.user.auser,
	};
}
