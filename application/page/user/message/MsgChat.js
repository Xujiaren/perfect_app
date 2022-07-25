import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image,TouchableOpacity,FlatList,Modal,TextInput,Platform} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';
import Carousel from 'react-native-looped-carousel';


import _ from 'lodash';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import {Emoji, EmojiView} from '../../../component/emoji';

import asset from '../../../config/asset';
import theme from '../../../config/theme';
import config from '../../../config/param';
import iconMap from '../../../config/font';

import {textToEmoji} from '../../../util/emoji';


const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    // maxWidth: 1280, // photos only
    // maxHeight: 1280, // photos only
    aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.2, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class MsgChat extends Component {

    static navigationOptions = ({navigation}) => {
        
		return {
            title: '管理员消息',
            headerRight: <View/>,
        }
        
    };

    constructor(props){
        super(props);

        const {navigation} = this.props;
        this.chatId = navigation.getParam('chatId',0);

        this.page = 0;
        this.totalPage = 1;


        this.ws = null;

        this.state = {
            chatId:this.chatId,
            userId:0,
            chatList:[],

            content:'',

            gift: false,
            gift_id: 0,
            gift_integral: 0,
            user_integral: 0,

            preview:false,
            preview_imgs: [],

            isEmoji:false, // 显示表情选择， 隐藏表情选择

        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onWs = this._onWs.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderMsg = this._renderMsg.bind(this);
        this._onAction = this._onAction.bind(this);


        this._onPubPic = this._onPubPic.bind(this);
        this._onPub = this._onPub.bind(this);
        this._onMsg = this._onMsg.bind(this);

        this._onEmoji = this._onEmoji.bind(this);

        this._onGiftToggle = this._onGiftToggle.bind(this);

    }

    componentDidMount(){
        this._onRefresh();
    }

    componentWillReceiveProps(nextProps){
        const {user,msgChat} = nextProps;

        const {chatList} = this.state;

        if (user !== this.props.user) {

            if (!_.isEmpty(user)) {

                this._onWs(user);

                this.setState({
                    userId:user.userId
                })


            }
        }

        if(msgChat !== this.props.msgChat){

            let chat = chatList.concat(msgChat.items.reverse());

            this.setState({
                chatList:chat,
            },()=>{
                setTimeout(() => this.refs.msg.scrollToEnd(), 200);
            })

        }

    }

    componentWillUnmount() {
        this.ws && this.ws.close();
    }

    _onRefresh(){
        const {actions} = this.props;

        actions.message.msgChat(this.chatId,this.page);
        actions.user.user();
    }

    _onWs(){
        const {user} = this.props;
        const {userId} = this.state;

        const url = config.chatroom +  'paramStr=' + global.token +  '&paramId=' + user.userId;

        console.log(url)
        this.ws = new WebSocket(url);

        console.log(this.ws)

        this.ws.onmessage = (e) => {

            
            // let chats = chatList.push(JSON.parse(message));
            console.log(chats)

            // this.setState({
            //     chatList:chats
            // },()=>{
            //     setTimeout(() => this.refs.msg.scrollToEnd(), 200);
            // })


            // this._onMsg(JSON.parse(e.data));

        }

        this.ws.onclose = (e) => {
            console.info(e);
        }

    }


    _onMsg(msg){
        const {user} = this.props;
        const {index,chatList} = this.state;
        const message = msg.item;

        // let chats = chatList.push(JSON.parse(message))

        // console.log(JSON.parse(message))



    }

    _onAction(action, args){

        const {navigation, actions, user} = this.props;
        const {content} = this.state;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {

            if(action === 'PubPic'){
                this._onPubPic();
            } else if (action == 'Pub') {

                // this.refs.emoji.hide();
                this._onPub('text', content);
                
            } else if (action == 'Gift') {
                this._onGiftToggle();
            } 

        }

    }

    _onGiftToggle() {
        this.setState({
            gift: !this.state.gift
        })
    }

    _onPubPic(){
        const {actions} = this.props;

        this.refs.emoji.hide();

        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {

                if ( result["android.permission.CAMERA"] === "granted"  &&  result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {

                    this._editImg()
    
                }
    
            })
            
        } else {
            this._editImg()
        }

    }


    _editImg(){
        const {actions} = this.props;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        this._onPub('img', data);
					},
					rejected: (msg) => {
					},
                });
            }
        });
    }

    _onPub(mtype, msg) {

        const { user } = this.props;
        const {chatId} = this.state;

        var nowTime = (new Date()).getTime();

        const type = mtype === 'text' ? 1 : 0;


        let param = {
            to_id:42,
            chat_id:chatId,
            to_name:'w',
            from_id:user.userId,
            from_name:user.username,
            mtype:type,
            is_admin:0,
            type:1,
            content:msg,
            pubTime:(nowTime/1000).toFixed(0),
            avatar:user.avatar
        }

        // console.log(JSON.stringify(param));


        this.ws && this.ws.send(JSON.stringify(param));

        this.setState({
            content: '',
        })
    }

    _onEmoji(){
        const {isEmoji} = this.state;

        if(isEmoji){
            this.refs.emoji.hide();
        } else {
            this.refs.emoji.show();
        }

        this.setState({
            isEmoji:!isEmoji
        })
    }



    _renderMsg(msg, owner) {
        const {index} = this.state;
        let replyList = textToEmoji(msg.content);
        let on = index === 1;

        if (msg.mtype == 0 ) {
            return (
                <TouchableOpacity onPress={() => this.setState({
                    preview: true,
                    preview_imgs: [{
                        url: msg.content,
                    }]
                })} style={{backgroundColor:'rgba(255,255,255,0.7)'}}>
                    <Image source={{uri: msg.content}} style={styles.thumb} resizeMode={'contain'}/>
                </TouchableOpacity>
            )
        } 

        return <View style={[styles.msgwidth,styles.fd_r,styles.ai_ct,{flexWrap:'wrap'}]}>
                    {
                        replyList.map((rpy,idx)=>{
                            return(
                                <View key={'rpy' + idx} style={[styles.chatmsg_txt,styles.fd_r]}>
                                    {
                                        rpy.msgType === 'text' ?
                                        <Text style={[styles.default_label,styles.c33_label ,owner && on && styles.white_label ]}>{rpy.msgCont}</Text>
                                        :
                                        <Image source={{uri:rpy.msgImage}} style={{width:20,height:20}} />
                                    }
                                </View>
                            )
                        })
                    }
                </View>;
    }


    _renderItem(item){

        const {user} = this.props;
        const {index} = this.state;
        const message = item.item;

        const owner = message.toUid == user.userId;


        if(message.is_admin  === 0){
            return(
                <View style={[styles.p_10, styles.row, styles.ai_ct, styles.jc_fe]}>
                    <View style={styles.avatar_small}/>
                    <View style={[styles.mr_10]}>
                        {
                            message.mtype === 0 ?
                            <View style={[styles.row, styles.jc_fe, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.circle_8, styles.over_h]}>
                                    {this._renderMsg(message, owner)}
                                </View>
                            </View>
                            :
                            <View style={[styles.row, styles.jc_fe, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.bg_dblue, styles.circle_8, styles.p_8, styles.pl_12, styles.pr_12]}>
                                    {this._renderMsg(message, owner)}
                                </View>
                                <View style={styles.rtriangle}/>
                            </View>
                        }
                    </View>
                    <Image source={{uri: user.avatar.length > 0 ? user.avatar : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png' }} style={styles.avatar_small}/>
                </View>
            )
        } else {

            return (
                <View style={[styles.p_10, styles.row, styles.ai_ct, styles.jc_fs]}>
                    <Image source={asset.user.u_header} style={styles.avatar_small}/>
                    <View style={[styles.ml_10]}>
                        {message.mtype == 0 ?
                            <View style={[styles.row, styles.jc_fs, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={[styles.circle_8, styles.over_h]}>
                                    {this._renderMsg(message, owner)}
                                </View>
                            </View>
                        : 
                            <View style={[styles.row, styles.jc_fs, styles.ai_ct, styles.mt_5, styles.msg]}>
                                <View style={styles.ltriangle}/>
                                <View style={[styles.bg_white, styles.circle_8, styles.p_8, styles.pl_12, styles.pr_12]}>
                                    {this._renderMsg(message, owner)}
                                </View>
                            </View>
                        }
                    </View>
                </View>
            )
        }


        
    }


    render() {

        const {chatList,loaded, index, preview, preview_imgs, content, book, bookNum, roomStatus, liveStatus, totalCount, gift, gift_id, gift_integral, user_integral,shareType} = this.state;

        return (
            <View style={[styles.container]}>
                <FlatList
                    ref={'msg'}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.p_10}
                    data={chatList}
                    extraData={this.state.id}
                    renderItem={this._renderItem}
                />
                <View style={[styles.bg_white, styles.toolbar, styles.border_top, styles.p_5, styles.pl_10, styles.pr_10, styles.row, styles.ai_ct, styles.jc_sb]}>
                    <TouchableOpacity style={[styles.pl_10,styles.pr_5]} 
                        onPress={this._onEmoji}
                    >
                        <Text style={[styles.icon, styles.tip_label]}>{iconMap('biaoqing')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.pl_10,styles.pr_15]} onPress={() => this._onAction('PubPic')}>
                        <Text style={[styles.icon, styles.tip_label]}>{iconMap('tupian')}</Text>
                    </TouchableOpacity>
                    <View style={[styles.col_6, styles.row, styles.ai_ct, styles.jc_sb]}>
                        <TextInput
                            style={[styles.p_5,styles.pt_3,styles.pb_3,styles.bg_gray, styles.circle_5, styles.col_1,styles.input]}
                            placeholder={'写留言，发表看法'}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false} autoCapitalize={'none'}
                            placeholderTextSize = {12}
                            value={content}  keyboardType={'default'}
                            onChangeText={(text) => {this.setState({content:text});}}
                        />
                        <TouchableOpacity style={[styles.p_5, styles.pl_10, styles.pr_10, styles.ml_10, content.length == 0 && styles.disabledContainer]} disabled={content.length == 0} onPress={() => this._onAction('Pub')}>
                            <Text>发送</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Emoji ref={'emoji'} onSelect={(key) => {
                    let _content = content;
                    this.setState({
                        content : _content + key,
                    })
                }}/>


                <Modal visible={preview} transparent={true} onRequestClose={() => {}}>
                    <ImageViewer imageUrls={preview_imgs} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>
            </View>
        )
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    msg: {
        width: theme.window.width * 0.6,
    },
    ltriangle: {
        marginRight: -2,
		borderTopWidth: 5,
		borderRightWidth: 5,
		borderBottomWidth: 5,
		borderLeftWidth: 0,
		borderTopColor: 'transparent',
		borderRightColor: 'white',
		borderBottomColor: 'transparent',
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
    },
    rtriangle: {
        marginLeft: -2,
		borderTopWidth: 5,
		borderRightWidth: 0,
		borderBottomWidth: 5,
		borderLeftWidth: 5,
		borderTopColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: 'transparent',
		borderLeftColor: '#0A86F9',
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
    },
    thumb: {
        width: 120,
        height: 160,
    },
    input:{
        paddingVertical: 0,
    },
})


export const LayoutComponent = MsgChat;

export function mapStateToProps(state) {
	return {
        msgChat:state.message.msgChat,
        user:state.user.user,
	};
}