import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image,FlatList} from 'react-native';

import _ from 'lodash';

import HudView from '../../component/HudView';
import AskComtCell from '../../component/cell/AskComtCell'

import {theme} from '../../config';

class UserQust extends Component {
    static navigationOptions = {
        title:'问题展开页',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);
        this.state = {
            status:1000,
            statusBarHeight: 20, //状态栏的高度
            navHeight:20,
            list:[1,2,3,4,9,5,6,],
        };


        this._renderHeader = this._renderHeader.bind(this);
        this._renderItem = this._renderItem.bind(this);
       
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps){
    }


    _onSelect = (idx) =>{

        this.setState({
            status:idx
        })

    }



    _renderHeader(){
        return(
            <View style={[styles.wrap]}>
                <View style={[styles.pl_20 ,styles.pr_20]}>
                    <View style={[styles.pt_20  ,styles.pt_15]}>
                        <Text style={[styles.lg_label ,styles.c33_label ]}>{'你有什么特别喜欢的诗句吗？'}</Text>
                    </View>
                    <View style={[styles.header  ,styles.fd_r ,styles.ai_ct ,styles.pt_15 ,styles.pb_10]}>
                        <Image  src={''} style={[styles.header_img ]}/>
                        <Text style={[styles.default_label ,styles.c33_label ,styles.fw_label ,styles.pl_10]}>{'韩钰'}</Text>
                    </View>
                    <Text style={[styles.default_label ,styles.c33_label,styles.lh18_label]}>{'父爱如山鬼麒主： 整个剧组里，大法发顺丰大法发顺丰离角色最远的一法最远的一个，违和感非常墙打的费请告知蟹蟹。'}</Text>
                    <Image src={''}  mode="widthFix" style={[styles.q_img ,styles.mt_10,styles.mb_10]}/>
                    <Text style={[styles.default_label ,styles.c33_label,styles.lh18_label]}>父爱如山鬼麒主： 整个剧组里，大法发顺丰大法发顺丰离角色最远的一法最远的一个，违和感非常墙打的费请告知蟹蟹。父爱如山鬼麒主： 整个剧组里，大法发顺丰大法发顺丰离角色最远的一法最远的一个，违和感非常墙打的费请告知蟹蟹。</Text>
                    <View style={[styles.fd_r ,styles.jc_sb ,styles.ai_ct ,styles.mt_10 ,styles.mb_20]}>
                        <Text style={[styles.tip_label,styles.sm_label]}>2个关注</Text>
                        <View style={[styles.fd_r,styles.ai_ct]}>
                            <TouchableOpacity style={[styles.togle_btn]}>
                                <Image source={''} />
                                <Text style={[styles.gray_label,styles.sm_label]}>删除</Text>
                            </TouchableOpacity >
                            <TouchableOpacity style={[styles.togle_btn]}>
                                <Image source={''} />
                                <Text style={[styles.gray_label,styles.sm_label]}>编辑</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.togle_btn]}>
                                <Image source={''} />
                                <Text style={[styles.gray_label,styles.sm_label]}>分享</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.tog_boxs ,styles.fd_r ,styles.ai_ct,styles.mb_10]}>
                    <TouchableOpacity style={[styles.tog_box ,styles.tog_left]}>
                        <Image src={''}  />
                        <Text style={[styles.c33_label ,styles.sm_label ,styles.fw_label]}>邀请回答</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tog_box]} >
                        <Image src={''} />
                        <Text style={[styles.c33_label ,styles.sm_label,styles.fw_label]}>写回答</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    _renderItem(item){
        const {list} = this.state;
        const on = item.index ===  list.length - 1 ;
        const index = item.index;

        return(
            <View style={[ !on&&styles.item_bt,styles.pl_15,styles.pr_15]}>
                <AskComtCell idx={index} />
            </View>
        )
    }

    render() {
        const {navigation} = this.props;
        const {status,statusBarHeight,navHeight,list} = this.state;

        return (
            <View style={styles.container}>

                <FlatList
                    data={list}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader}
                />
                

                <View style={[styles.fd_r, styles.ai_ct, styles.p_8, styles.border_top, styles.toolbar]}>
                    <Text style={[styles.fw_label,styles.sm_label,styles.tip_label]}>34人评论</Text>
                    <TouchableOpacity style={[styles.col_8, styles.p_5, styles.bg_f7f,styles.input]} >
                        <Text style={[styles.tip_label, styles.sm_label]}>写留言，发表看法</Text>
                    </TouchableOpacity>
                </View>

                
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex: 1,
        backgroundColor:'#ffffff',
    },
    search_input:{
        height:30,
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
    msg_icon:{
        width:20,
        height:18,
    },
    left_icon:{
        width:10,
        height:17,
    },
    edit_icon:{
        width:17,
        height:17,
    },
    header_img:{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#dddddd',
    },
    q_img:{
        width: '100%',
        height: 128,
        backgroundColor: '#dddddd',
        borderRadius: 5,
    },
    focus_btn:{
        width: 70,
        height: 22,
        backgroundColor: '#FFEAE5',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    share_btn:{
        width: 52,
        height: 22,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tog_boxs:{
        height: 44,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderStyle:'solid',
        borderBottomColor: '#F0F0F0',
        borderTopColor: '#F0F0F0',
    },
    tog_box:{
        height: 44,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tog_left:{
        borderRightColor: '#F0F0F0',
        borderRightWidth: 1,
        borderStyle:'solid',
    },
    layer_bt:{
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderStyle:'solid',
    },

    qust_img:{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#dddddd',
    },
    f_btn:{
        width: 50,
        height: 22,
        borderColor: '#F4623F',
        borderWidth: 1,
        borderStyle:'solid',
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input:{
        height: 36,
        marginLeft: 8,
        marginRight: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    togle_btn:{
        width: 52,
        height: 22,
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    item_bt:{
        borderBottomWidth: 1,
        borderStyle:'solid',
        borderBottomColor:'#F0F0F0'
    }
});

export const LayoutComponent = UserQust;

export function mapStateToProps(state) {
	return {
        user:state.user.user,
	};
}
