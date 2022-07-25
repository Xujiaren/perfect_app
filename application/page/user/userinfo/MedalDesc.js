import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image,Dimensions,ProgressViewIOS,ProgressBarAndroid,Platform, TouchableOpacity,Modal} from 'react-native'

import asset from '../../../config/asset';
import theme from '../../../config/theme';

import HudView from '../../../component/HudView';
import ViewShot from 'react-native-view-shot';
import Carousel from 'react-native-snap-carousel';
import { Grayscale } from 'react-native-color-matrix-image-filters';

const slideWidth = Dimensions.get('window').width;

import * as WeChat from 'react-native-wechat-lib';

class MedalDesc extends Component {

    static navigationOptions = {
        title:'勋章详情',
        headerRight: <View/>,
    };


    constructor(props){
        super(props)

        this.state = {
            med:{},
            activeIndex:0,
            currentIdx:0,
            current:0,
            percent:25,
            content:'',
            title:'',
            lv:'',
            nowNum:0,
            allNum:0,
            childList:[],
            description:'',
            tips:false,
            shareType:0,
            codeImg:'',
        }

        this._onSwiper = this._onSwiper.bind(this)
        this._toggleModal = this._toggleModal.bind(this)
    }

    componentWillReceiveProps(nextProps){
        const {user} = nextProps

        if(user !== this.props.user){
            this.setState({
                current:user.userId  * Math.random()
            })
        }
    }


    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state

        let meddesc = params.med
        let medIdx = params.currentIdx

        this.setState({
            med:meddesc,
            lv:meddesc.lv,
            nowNum:meddesc.nowNum,
            allNum:meddesc.allNum,
            childList:meddesc.child,
            content:meddesc.content,
            title:meddesc.title,
            description:meddesc.child[0].description,
            // currentIdx:medIdx
        })
    }


    componentDidMount(){
        const {actions} = this.props

        actions.user.user()
        this._getCodeImg();
    }


    _getCodeImg(){
        const {actions} = this.props;
        actions.user.invitecode({
            resolved: (data) => {
                this.setState({
                    codeImg:data,
                });
            },
            rejected: (msg) => {
            },
        });
    }



    _toggleModal(type){
        this.setState({
            shareType:type,
        },()=>{
            this.setState({
                tips:true,
            });
        });
    }


    _renderItem({item}){

        return (
            <View style={[styles.levels]} >
                <View style={[ styles.sharebox]}>
                    {
                        item.have ?
                        <Image source={{uri:item.img}}  style={styles.shareImg}  />
                        :
                        <Grayscale>
                            <Image source={{uri:item.img}}  style={[styles.shareImg]} />
                        </Grayscale>
                    }
                    
                </View>
            </View>
        );
    }


    _onSwiper(index){

        const {childList} = this.state

        this.setState({ 
            activeIndex: index ,
            content:childList[index].content,
            description:childList[index].description,
            lv:childList[index].lv
        })
    }

    _onShare(shareType){


        WeChat.isWXAppInstalled().then(isInstalled => {

            if (isInstalled) {
                this.refs.viewShot.capture().then(uri => {

                    if(Platform.OS === 'android'){

                        WeChat.shareImage({
                            imageUrl: uri,
                            scene: shareType
                        }).then(data => {
                            this.setState({
                                tips: false,
                            }, () => {
                                this.refs.hud.show('分享成功', 1);
                            })
                        }).catch(error => {
                            
                        })
                        
                    } else {

                        WeChat.shareImage({
                            imageUrl: 'file:/' + uri,
                            scene: shareType
                        }).then(data => {
                            this.setState({
                                tips: false,
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



    render() {
        const {med,activeIndex,currentIdx,current,percent,content,title,lv,nowNum,allNum,childList,description,tips,shareType,codeImg} = this.state

        let parent = 0 

        if(nowNum === 0 ){
            
            parent = 0 

        } else  if(nowNum <= allNum ) {
            
            parent = (nowNum / allNum).toFixed(2)

        }
        
        let parentNum = parseInt(parent) 

        const btn_icon = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24889223-5a1b-4d7b-a05f-4b26dd8bc3b9.png"


        return (
            <View style={[styles.mt_20]}>
                {
                    med.child.length > 0 ?
                    <View style={styles.swiper}>
                        <Carousel
                            useScrollView={true}
                            ref={(ref) => { //方法对引用Carousel元素的ref引用进行操作
                                this._carousel = ref;
                            }}
                            currentIndex={currentIdx}
                            data={med.child}
                            layout={'default'}
                            renderItem={this._renderItem}
                            sliderWidth={slideWidth}
                            itemWidth={slideWidth * 0.5}
                            layoutCardOffset={18} 
                            removeClippedSubviews={false}
                            onSnapToItem = {(index) => this._onSwiper(index)}
                        />
                    </View>
                :null}
                


                <View style={[styles.pro_cons,styles.mt_10]}>
                    <View style={[styles.progress_wrap,{height:4}]}>
                        {
                            Platform.OS === 'android' ?
                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} style={{width: '100%',height:4}} progress={parseFloat(parentNum)} styleAttr="Horizontal"/>
                            :
                            <ProgressViewIOS progress={parseFloat(parentNum)}  style={{width: '100%',height:4}} trackTintColor={'#ECECEC'} progressTintColor={'#F4623F'} />
                        }

                        {
                            childList.length > 1 ?
                            <View>
                                <View style={[styles.progress_dot]}>
                                    {
                                        childList.map((med,index)=>{
                                            return(
                                                <View style={[med.have ?  styles.dot_active : styles.dot]}  key={'med' + index}/>
                                            )
                                        })
                                    }
                                </View>
                                <View style={[styles.progress_txt]}>
                                    {
                                        childList.map((med,index)=>{
                                            return(
                                                <Text style={[ med.have ?  styles.txt_active : styles.txt ]}  key={'med_txx' + index}>{index + 1}级</Text>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            :
                            <View style={styles.bg_black}>
                                <View style={[styles.prog_dot]}>
                                    {
                                        childList.map((med,index)=>{
                                            return(
                                                <View style={[med.have ?  styles.dot_active : styles.dot]}  key={'med' + index}/>
                                            )
                                        })
                                    }
                                </View>
                                <View style={[styles.prog_txt]}>
                                    {
                                        childList.map((med,txt_index)=>{
                                            return(
                                                <Text style={[ med.have ?  styles.txt_active : styles.txt ]}  key={'med_txx' + txt_index}>{txt_index + 1}级</Text>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        }
                    </View>
                </View>
                
                <View style={styles.cont_txt}>
                    {
                        childList.length > 1 ?
                        <View style={[styles.title]}>
                            <Text style={[styles.lg20_label,styles.fw_label,styles.c33_label]}>{title+'LV.'+lv}</Text>
                        </View>
                        :
                        <View style={[styles.title]}>
                            <Text style={[styles.lg20_label,styles.fw_label,styles.c33_label]}>{title}</Text>
                        </View>
                    }
                        
                    <Text style={[styles.tip_label,styles.sm_label,styles.mt_5]}>{'当前进度'+nowNum+'/'+allNum}</Text>
                    <View style={[styles.med_cons,styles.mt_30]}>
                        <Text style={[styles.c33_label,styles.c33_label]}>{content}</Text>
                    </View>
                    <View style={[styles.med_cons,styles.mb_50]}>
                        <Text style={[styles.c33_label,styles.c33_label,styles.mt_5]}>{description}</Text>
                    </View>
                    <View style={[styles.items ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                        <TouchableOpacity style={[styles.item ,styles.fd_c ,styles.jc_ct ,styles.ai_ct ]}
                            onPress={() => this._toggleModal(0)}
                        >
                            <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={asset.wechat} style={[styles.item_box]} />
                            </View>
                            <Text style={[styles.default_label ,styles.m_5]}>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item  ,styles.fd_c ,styles.jc_ct ,styles.ai_ct ,styles.ml_20 ,styles.mr_20]}
                            onPress={() => this._toggleModal(1)}
                        >
                            <View style={[styles.item_box  ,styles.jc_ct ,styles.ai_ct]} >
                                <Image source={asset.friends} style={[styles.item_box]} />
                            </View>
                            <Text style={[styles.default_label ,styles.m_5]}>朋友圈</Text>
                        </TouchableOpacity>
                    </View>
                </View>



                <Modal transparent={true} visible={tips} onRequestClose={() => {}}>
                    <View style={[styles.bg_container]}></View>
                    <View style={styles.tip}>
                        <ViewShot ref='viewShot' options={{ format: 'jpg', quality: 0.9 , result: Platform.OS === 'ios' ? 'tmpfile' : 'tmpfile'}}>
                            <View style={styles.canvas_tip}>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct,styles.mt_20]}>
                                    {
                                        med.child[activeIndex].have ?
                                        <Image source={{uri:med.child[activeIndex].img}}  style={styles.modalImg}  />
                                        :
                                        <Grayscale>
                                            <Image source={{uri:med.child[activeIndex].img}}  style={[styles.modalImg]} />
                                        </Grayscale>
                                    }
                                </View>
                                <View style={[styles.pro_cons,styles.mt_10]}>
                                    <View style={[styles.progress_wrap,{height:4}]}>
                                        {
                                            Platform.OS === 'android' ?
                                            <ProgressBarAndroid indeterminate={false} color={'#FF5047'} style={{width: '100%',height:4}} progress={parseFloat(parentNum)} styleAttr="Horizontal"/>
                                            :
                                            <ProgressViewIOS progress={parseFloat(parentNum)}  style={{width: '100%',height:4}} trackTintColor={'#ECECEC'} progressTintColor={'#F4623F'} />
                                        }

                                        {
                                            childList.length > 1 ?
                                            <View>
                                                <View style={[styles.progress_dot]}>
                                                    {
                                                        childList.map((med,index)=>{
                                                            return(
                                                                <View style={[med.have ?  styles.dot_active : styles.dot]}  key={'med' + index}/>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <View style={[styles.progress_txt]}>
                                                    {
                                                        childList.map((med,index)=>{
                                                            return(
                                                                <Text style={[ med.have ?  styles.txt_active : styles.txt ]}  key={'med_txx' + index}>{index + 1}级</Text>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            :
                                            <View style={styles.bg_black}>
                                                <View style={[styles.prog_dot]}>
                                                    {
                                                        childList.map((med,index)=>{
                                                            return(
                                                                <View style={[med.have ?  styles.dot_active : styles.dot]}  key={'med' + index}/>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <View style={[styles.prog_txt]}>
                                                    {
                                                        childList.map((med,txt_index)=>{
                                                            return(
                                                                <Text style={[ med.have ?  styles.txt_active : styles.txt ]}  key={'med_txx' + txt_index}>{txt_index + 1}级</Text>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                                <View style={[styles.cont_txt]}>
                                    {
                                        childList.length > 1 ?
                                        <View style={[styles.Modal_title]}>
                                            <Text style={[styles.lg20_label,styles.fw_label,styles.c33_label]}>{title+'LV.'+lv}</Text>
                                        </View>
                                        :
                                        <View style={[styles.Modal_title]}>
                                            <Text style={[styles.lg20_label,styles.fw_label,styles.c33_label]}>{title}</Text>
                                        </View>
                                    }
                                        
                                    <Text style={[styles.tip_label,styles.sm_label,styles.mt_5]}>{'当前进度'+nowNum+'/'+allNum}</Text>
                                    <View style={[styles.med_cons,styles.mt_15]}>
                                        <Text style={[styles.c33_label,styles.c33_label]}>{content}</Text>
                                    </View>
                                    <View style={[styles.med_cons,styles.mb_20,styles.pl_15,styles.pr_15]}>
                                        <Text style={[styles.c33_label,styles.c33_label,styles.mt_5]} numberOfLines={2}>{description}</Text>
                                    </View>

                                    
                                </View>
                                <View style={[styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                                    <Image source = {{uri:codeImg}} style={[styles.shareImgcode]} />
                                </View>
                            </View>
                        </ViewShot>
                        <View style={[styles.canvas_btns,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <TouchableOpacity style={[styles.layer_btn,styles.mt_10]} onPress={()=>this.setState({tips:false})}>
                                <Text style={[styles.default_label ,styles.white_label]}>取消</Text>
                            </TouchableOpacity>
                            {
                                shareType === 0 ?
                                <TouchableOpacity style={[styles.layer_btn,styles.mt_10,styles.ml_20]}
                                    onPress={()=> this._onShare(shareType)}
                                >
                                    <Text style={[styles.default_label ,styles.white_label]}>分享</Text>
                                </TouchableOpacity>
                            : null}
                            {
                                shareType === 1 ?
                                <TouchableOpacity style={[styles.layer_btn,styles.mt_10,styles.ml_20]}
                                    onPress={()=> this._onShare(shareType)}
                                >
                                    <Text style={[styles.default_label ,styles.white_label]}>分享</Text>
                                </TouchableOpacity>
                            : null}
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
    levels:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    swiper:{
        marginTop:30,
        height:128,
    },
    shareImg:{
        width:120,
        height:'100%'
    },
    pro_cons:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    progress_wrap:{
        width:188,
        marginTop:30,
        position:'relative',
    },
    progress_dot:{
        position:'absolute',
        top:-5,
        left:0,
        right:0,
        bottom:0,
        margin:'auto',
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    dot:{
        width:10,
        height:10,
        borderRadius:5,
        borderWidth:2,
        borderStyle:'solid',
        transform:[{scale:1}],
        borderColor:'#D8D8D8',
        backgroundColor:'#ffffff',
    },
    dot_active:{
        width:10,
        height:10,
        borderRadius:5,
        borderWidth:2,
        borderStyle:'solid',
        transform:[{scale:1}],
        borderColor:'#FFC688',
        backgroundColor:'#FC5B31'
    },
    progress_txt:{
        position: 'absolute',
        top:14,
        left:'50%',
        marginLeft:-100,
        width:200,
        height:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    prog_dot:{
        position:"absolute",
        top:-7,
        left:'50%',
        right:0,
        marginLeft:-5,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    prog_txt:{
        position:"absolute",
        top:14,
        left:'50%',
        marginLeft:-10,
        width:200,
        height:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    txt:{
        // transform:[{scale:1}],
        color:'#999999',
        fontSize:14,
    },
    txt_active:{
        // transform:[{scale:1}],
        color:'#F46230',
        fontSize:14,
    },
    title:{
        marginTop:80,
    },
    Modal_title:{
        marginTop:48
    },
    btn_item:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:130,
        height:44,
        marginTop:10,
        borderColor:'#F4623F',
        borderWidth:1,
        borderStyle:'solid',
        borderRadius:5,
        fontSize:14,
        color:'#F4623F',
        backgroundColor:'#FFFFFF',
    },
    save_icon:{
        width:16,
        height:16,
        marginRight:4
    },
    share_icon:{
        width:13,
        height:13,
        borderRadius:4
    },
    cont_txt:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    med_cons:{
        width:260,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    btn_icon:{
        width:13,
        height:13,
        marginRight:4
    },
    tip:{
        position: 'absolute',
        top:'45%',
        left:'50%',
        width:270,
        height:490,
        marginLeft: -135,
        marginTop: -240,
        borderRadius:5,
    },
    canvas_cover:{
        width:270,
        height:450,
    },
    canvas_tip:{
        width:270,
        height:450,
        position:'relative',
        backgroundColor:'#ffffff'
    },
    layer_btn:{
        width:100,
        height:30,
        borderRadius:30,
        borderWidth:1,
        borderColor:'#ffffff',
        borderStyle:'solid',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    item_box:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#f5f5f5',
    },
    modalImg:{
        width:130,
        height:130
    },
    bw:{
        borderWidth:1
    },
    shareImgcode:{
        width:56,
        height:56,
        borderRadius:28,
    }
});


export const LayoutComponent = MedalDesc;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
        userMedal:state.user.userMedal
	};
}

