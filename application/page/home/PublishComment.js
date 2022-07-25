import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,TextInput,Image,Modal,PermissionsAndroid} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-picker';

import asset from '../../config/asset';
import theme from '../../config/theme';
import HudView from '../../component/HudView';

import * as  DataBase from '../../util/DataBase';
import { ScrollView } from 'react-native';


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
    quality: 0.4, // 0 to 1, photos only
    angle: 0, // android only, photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

class PublishComment extends Component {
    static navigationOptions = {
        title:'写评论',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);
        const {navigation} = props;

        this.ctype = navigation.getParam('ctype', 3);
        this.content_id = navigation.getParam('content_id', 0);
        this.isStar = navigation.getParam('isStar', 0);
        this.type = navigation.getParam('type', 0);
        this.whitetip = navigation.getParam('whitetip',0);
        
        this.state = {
            preview:false,
            preview_index:0,

            score:5,
            content:'',
            images:[],
            picArray:[],
            imgs:[],
            
            tip: true,   
            whitetip :this.whitetip,
        };

        this._onStar = this._onStar.bind(this);
        this._onChangeImg = this._onChangeImg.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._preview = this._preview.bind(this);
        this._onTipToggle = this._onTipToggle.bind(this);
        this._onTip = this._onTip.bind(this);

        this._editImg = this._editImg.bind(this);
    }

    componentWillMount(){
    }

    _onStar(score){
		this.setState({
			score: score,
        });
    }


    _onChangeImg(){
        const {actions} = this.props;

        if (Platform.OS === 'android') {

            //返回得是对象类型
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then(result => {
                //console.info(result);
                console.log(result["android.permission.CAMERA"] ,  result["android.permission.WRITE_EXTERNAL_STORAGE"])

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
        const {picArray} = this.state;

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                actions.site.upload({
                    file:'data:image/jpeg;base64,' + response.data,
                    resolved: (data) => {
                        picArray.push(data);
                        this.setState({
                            picArray:picArray,
                        });
					},
					rejected: (msg) => {
					},
                });
            }
        });
    }



    _onDetele(index){
        const {picArray} = this.state;
        picArray.splice(index,1);

        this.setState({
            picArray:picArray,
        });
    }

    _preview(index){

        let images = [];
        const p_image =  this.state.picArray;

        p_image.map((img, i) => {
            let goodimg = '';
            goodimg = img;
            images.push({
				url: goodimg,
			});
        });

        this.setState({
            preview:true,
            preview_index:index,
            images:images,
        });
    }

    _onSubmit(){
        const {actions,navigation} = this.props;
        const {score,content,picArray} = this.state;
        let picStr = picArray.join(',');

        if(this.type === 0){
            actions.home.publishcommt({
                course_id: this.content_id,
                score: score,
                content: content,
                gallery: picStr,
                teacher_score:5,
                resolved: (data) => {
                    this.refs.hud.show('提交成功，请耐心等待审核', 1);
    
                    this.setState({
                        content:'',
                        picArray:[],
                    });
    
                    setTimeout(()=>navigation.goBack(), 1000);
                },
                rejected: (msg) => {
                    if (msg === 'WORD_ERROR'){
                        this.refs.hud.show('尊敬的用户，系统检测您触发违禁词，请注意言辞、文明上网', 1);
                    } else if (msg === 'ACCOUNT_DENY') {
                        this.refs.hud.show('尊敬的用户， 系统检测您触发违禁词的次数已超限，即将关闭您的评论权限，15天后恢复，祝您学习愉快！', 1);
                    }
                },
            });
        }  else if(this.type === 1){

            actions.home.publishAllComment({
                content_id: this.content_id,
                score: score,
                content: content,
                gallery: picStr,
                ctype:this.ctype,
                teacher_score:5,
                resolved: (data) => {
                    this.refs.hud.show('提交成功，请耐心等待审核', 1);
    
                    this.setState({
                        content:'',
                        picArray:[],
                    });
    
                    setTimeout(()=>navigation.goBack(), 1000);
                },
                rejected: (msg) => {
                    if (msg === 'WORD_ERROR'){
                        this.refs.hud.show('尊敬的用户，系统检测您触发违禁词，请注意言辞、文明上网', 1);
                    } else if (msg === 'ACCOUNT_DENY') {
                        this.refs.hud.show('尊敬的用户， 系统检测您触发违禁词的次数已超限，即将关闭您的评论权限，15天后恢复，祝您学习愉快！', 1);
                    }
                },
            });

        }     

        
    }

    //不再提示
    _onTipToggle() {
        DataBase.setItem('whitetip', 1);
        this.setState({
            tip:false
        })
    }

    //关闭
    _onTip() {

        this.setState({
            tip:false
        })
    }

    render() {
        const {content, picArray, images, preview, preview_index, tip,whitetip} = this.state;
        const enable = content.length > 5;



        return (
            <View style={styles.container}>
                {/* <View style={[styles.fd_r ,styles.jc_sb ,styles.pt_15 ,styles.pl_20 ,styles.pb_15 ,styles.bg_white ,styles.border_bt]}>
                    <View style={[styles.fd_r ,styles.ai_ct]}>
                        <Text style={[styles.lg_label ,styles.mr_15]}>课程评分</Text>
                        <Star onChoose={this._onStar}  fontSize={28} />
                    </View>
                </View> */}
                <View style={[styles.bg_white ,styles.pt_10,styles.pl_20,styles.border_bt]}>
                    {/* <Text style={[styles.lg_label ,styles.c33_label ]} >课程评价</Text> */}
                    <TextInput
                        style={styles.textinput}
                        placeholder={'评论字数需5个字符以上，留言将由工作人员筛选审核后公开显示。'}
                        placeholderTextColor={'#999999'}
                        underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                        multiline={true}
                        value={content}
                        onChangeText={(text) => {this.setState({content:text});}}
                    />
                </View>
                <View style={[styles.from_item ,styles.fd_r  ,styles.pb_15,styles.pt_15 ,styles.bg_white   ,styles.pl_30 ,styles.pr_20]}>
                    <View style={[styles.from_img]}>
                        {
                            picArray.map((fditem,index)=>{
                                return (
                                    <View style={[styles.commt_img ,styles.fd_r ,styles.ai_ct ,styles.jc_ct ,styles.mr_15 ]} key={index} >
                                        <TouchableOpacity  onPress={()=>this._preview(index)}>
                                            <Image source={{uri:fditem}} style={[styles.commt_img_cover]} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this._onDetele(index)} style={styles.commt_tip_cover}>
                                            <Image source={asset.i_dete} style={[styles.commt_tip]} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        }
                        {
                            picArray.length > 3 ?
                            null
                            :
                            <TouchableOpacity style={[styles.commt_imgs ,styles.fd_r ,styles.ai_ct ,styles.jc_ct]}
                                onPress={this._onChangeImg}
                            >
                                <Image source={asset.add} style={[styles.commt_img_covers]} />
                            </TouchableOpacity >
                        }
                    </View>
                </View>
                <TouchableOpacity onPress={this._onSubmit} style={[styles.submit,styles.fd_r ,styles.ai_ct ,styles.jc_ct ,styles.p_10 ,styles.circle_5, !enable && styles.disabledContainer]} disabled={!enable}>
                    <Text style={[styles.lg_label ,styles.white_label]}>提交</Text>
                </TouchableOpacity>
                <HudView ref={'hud'} />
                <Modal visible={preview} transparent={true} onRequestClose={() => {}}>
                    <ImageViewer imageUrls={images} index={preview_index} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>

                <Modal transparent={true} visible={tip&& whitetip === 0} onRequestClose={() => {}}>
                    <View style={[styles.bg_container]}></View>

                    <View style={[styles.tip]}>
                        {/* <Image style={styles.modal_img}  source={{uri:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png"}}/> */}
                        <View style={[styles.fd_c,styles.ai_ct,styles.jc_ct]}>
                            <Text style={[styles.lg18_label,styles.black_label,styles.pt_25,styles.fw_label]}>留言规则</Text>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}      
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={[styles.fd_c,styles.mb_15, styles.pl_20, styles.pr_20]}>
                                <Text style={[styles.default_label, styles.pt_15,styles.red_label,styles.lh18_label]} >用户留言不得发布以下内容：</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>1、捏造、散播和宣传危害国家统一、公共安全、社会秩序等言论；</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>2、恶意辱骂、中伤、诽谤他人及企业；</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>3、涉及色情、污秽、低俗的的信息及言论；</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>4、广告信息；</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>5、《直销管理条例》、《禁止传销条例》、《反不正当竞争法》等法律法规禁止的内容；</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>6、政治性话题及言论；</Text>
                                <Text style={[styles.default_label, styles.pt_5 ,styles.c33_label,styles.lh18_label]}>7、对任何企业、组织现行规章制度的评论和讨论，及传播任何未经官方核实的信息； 如违反以上规定，平台有权实施账户冻结、注销等处理，情节严重的，将保留进一步法律追责的权利。</Text>
                            </View>    
                        </ScrollView>
                        <View style={[styles.layer_btns ,styles.fd_r ,styles.jc_sb ,styles.ai_ct ,styles.mt_30]}>
                            <TouchableOpacity style={[styles.layer_btn ,styles.fd_r,styles.right_border,styles.jc_ct ,styles.ai_ct]}  onPress={this._onTipToggle}>
                                <Text style={[styles.lg_label ,styles.tip_label]}>不再提示</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.layer_btn ,styles.fd_r,styles.jc_ct ,styles.ai_ct]} onPress={this._onTip}>
                                <Text style={[styles.lg_label ,styles.c33_label]}>关闭</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    submit:{
        margin:20,
        borderRadius:5,
        backgroundColor:'#F4623F',
    },
    textinput:{
        width:theme.window.width - 40,
		height:140,
		backgroundColor: '#f7f7f7',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
		paddingVertical: 0,
        textAlignVertical:'top',
        marginTop:15,
        borderRadius:5,
        paddingVertical: 0,
    },
    from_img:{
        flexDirection:'row',
    },
    commt_img:{
        width:50,
        height:50,
        position:'relative',
    },
    commt_img_cover:{
        width:50,
        height:50,
    },
    commt_tip_cover:{
        position:'absolute',
        top:-5,
        right:-5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#ffffff',
        borderRadius:6,
    },
    commt_tip:{
        width:12,
        height:12,
        borderRadius:6,
    },
    commt_imgs:{
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderStyle:'solid',
    },
    commt_img_covers:{
        width:25,
        height:25,
    },
    bg_container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    tip:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:310,
        height:478,
        marginLeft: -155,
        marginTop: -239,
        backgroundColor:'#ffffff',
        borderRadius:5,
        flexDirection:'column',
        justifyContent:'space-between'
    },
    layer_btns:{
        borderTopWidth: 1,
        borderStyle:'solid',
        borderTopColor: '#E5E5E5',
    },
    layer_btn:{
        flex: 1,
        height: 50,
    },
    right_border:{
        borderRightWidth: 1,
        borderStyle:'solid',
        borderRightColor: '#E5E5E5',
    },
    // modal_img:{
    //     position:'absolute',
    //     left:'50%',
    //     top:-230,
    //     width:375,
    //     height:260,
    //     marginLeft:-187.5,
    // },
});

export const LayoutComponent = PublishComment;

export function mapStateToProps(state) {
	return {
        coursedesc:state.home.coursedesc,
	};
}
