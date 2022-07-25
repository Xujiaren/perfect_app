import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image,ImageBackground} from 'react-native'

import asset from '../../../config/asset';
import theme from '../../../config/theme';
import config from '../../../config/param';

import QRCode from 'react-native-qrcode-svg';


class UserCard extends Component {

    static navigationOptions = {
        title:'学生证',
        headerRight: <View/>,
    };


    constructor(props){
        super(props)

        this.squadList = [];

        this.state = {
            userId:0,
            avatar:'',
            username:'',
            totalLearn:'',
            learn:''
        }
    }

    componentWillReceiveProps(nextProps){
        const {usercard} = nextProps 

        if (usercard !== this.props.usercard) {
            this.squadList = usercard
        }
    }


    componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state;
        this.setState({
            userId:params.userId,
            avatar:params.avatar,
            username:params.username,
            totalLearn:params.totalLearn,
            learn:params.learn
        });
    }


    componentDidMount(){
        const {actions} = this.props
        actions.user.usercard(0,0);
    }

    render() {
        const idcard_icon = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/3856b50f-8505-469d-99a9-bd49abb4f43d.png"
        const {userId,avatar,username,learn,totalLearn} = this.state

        let squardId = 0
        if(this.squadList.length > 0 ){
            squardId = this.squadList[0].squadId
        }
        
        let qrtext =  config.bUrl+'/#/userCheck/' + squardId + '/' +  userId


        return (
            <View style={[styles.mt_20,styles.fd_c,styles.jc_ct,styles.wrap,styles.ai_ct]}>
                <ImageBackground source={{uri:idcard_icon}}
                    style={styles.idcard_img}
                >
                    <View style={[styles.mt_10,styles.fd_r,styles.jc_fe,styles.mr_20]}>
                        <Text style={[styles.num]}>学号：{userId}</Text>
                    </View>
                    <View style={[styles.card_info_wrap,styles.fd_c]}>
                        <View style={[styles.avatar_wrap ,styles.fd_r,styles.ai_ct]}>
                            <Image style={[styles.avatar]} source={{uri:avatar}}/>
                            <View style={[styles.username]}>
                                <Text numberOfLines={1}>{username}</Text>
                            </View>
                        </View>
                        <View style={[styles.learn]}>
                            <Text style={[styles.sm_label,styles.gray_label]}>学习天数：<Text style={[styles.fw_label]}>{totalLearn}</Text></Text>
                        </View>
                        <View style={[styles.learn]}>
                            <Text style={[styles.sm_label,styles.gray_label]}>连续学习天数：<Text style={[styles.fw_label]}>{learn}</Text></Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.barcodeBox}>
                    <QRCode
                        value={qrtext}
                    />
                </View>
                <Text style={[styles.scan_txt,styles.fw_label,styles.c33_label]}>扫码签到</Text>
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    wrap:{
        width:'100%',
    },
    idcard_img:{
        width:315,
        height:150,
        position:'relative',
    },
    card_info_wrap:{
        position:'absolute',
        left:'40%',
        top:'35%'
    },
    avatar:{
        width:30,
        height:30,
        borderRadius:15,
        backgroundColor:'#c7c7c7',
        marginRight:12,
        flexShrink:0
    },
    username:{
        color:'#333',
        fontSize:16,
        fontWeight:'bold',
        maxWidth:150,
    },
    learn:{
        marginTop:5,
        marginLeft:42
    },
    barcodeBox:{
        display:'flex',
        justifyContent:'center',
        paddingBottom:10,
        marginTop:44,
    }
});


export const LayoutComponent = UserCard;

export function mapStateToProps(state) {
	return {
        usercard:state.user.usercard
	};
}

