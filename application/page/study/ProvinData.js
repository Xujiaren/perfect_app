import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image,NativeModules, ImageBackground,StatusBar} from 'react-native';

import { Header } from 'react-navigation-stack';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';

import asset from '../../config/asset';
import theme from '../../config/theme';

const { StatusBarManager } = NativeModules;

class ProvinData extends Component {

    static navigationOptions = {
        header:null,
    };

    constructor(props){
        super(props);

        this.studyRegion = [];

        this.state = {
            status:0,
            statusBarHeight: 20, //状态栏的高度
            navHeight:20,
        };

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
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
        const {studyRegion} = nextProps;

        if (studyRegion !== this.props.studyRegion){
            this.studyRegion = studyRegion
        }
        
    }

    componentDidMount(){
        this._onHeaderRefresh();
    }

    _onSelect = (index) => {

        this.studyRegion = [];
        
        this.setState({
            status:index
        },()=>{
            this._onHeaderRefresh();
        })
    }

    _onHeaderRefresh(){
        const {actions} = this.props;
        const {status} = this.state;

        actions.study.studyRegion(status);
    }


    _renderItem(item){
        const index = item.index ;
        const stu = item.item;

        let bg_tip = asset.list_1;

        if(index === 1){
            bg_tip = asset.list_2;
        } else if(index === 2){
            bg_tip = asset.list_3;
        }

        return(
            <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.item_box]}> 
                <View style={[styles.fd_r,styles.ai_ct]}>
                    {
                        index < 3 ? 
                        <Image source={bg_tip} resizeMode={'contain'} style={[styles.tip_cover]}/>
                        :
                        <View style={[styles.tips,styles.fd_r,styles.ai_ct,styles.jc_ct]}>
                            <Text style={[styles.tip_label,styles.lg_label]}>{index + 1}</Text>
                        </View>
                    }
                    <Text style={[styles.c33_label,styles.lg_label,styles.fw_label,styles.ml_20]}>{stu.regionName}</Text>
                </View>
                <Text style={[styles.c33_label,styles.lg_label]}>{stu.res}{this.state.status==0?'人':this.state.status==1?'次':'小时'}</Text>
            </View>
        )
    }

    render() {
        const {navigation} = this.props;
        const {statusBarHeight,navHeight,status,list} = this.state;

        let  bg_img = asset.pro_rs;
        let  tip_val = '人数';


        if(status === 1){
            bg_img = asset.pro_qd;
            tip_val = '签到';
        } else if(status === 2){
            bg_img = asset.pro_xx;
            tip_val = '学习';
        }

        return (
            <View style={styles.container}>
                <ImageBackground source={bg_img} style={[styles.bg_cover]}>
                    <TouchableOpacity style={{paddingTop:statusBarHeight}} onPress={()=>navigation.goBack()}>
                        <Image source={asset.left_arrow}  style={[styles.left_icon ,styles.ml_5]}/>
                    </TouchableOpacity>
                    <View style={[styles.fd_c,styles.ml_30,styles.mt_20]}> 
                        <Text style={[styles.lg28_label,styles.white_label]}>{`各省${tip_val}`}</Text>
                        <Text style={[styles.lg40_label,styles.white_label,styles.fw_label]}>排行榜</Text>
                    </View>
                </ImageBackground>

                <View style={[styles.wrap_box]}>
                    <View style={[styles.fd_r,styles.ai_ct,styles.jc_sb,styles.pt_15,styles.pb_15]}>
                        {
                            ['人数','签到','学习'].map((item,index)=>{
                                const on = status === index ;
                                return(
                                    <TouchableOpacity style={[styles.fd_c,styles.ai_ct]} key={'item' + index} onPress={()=>this._onSelect(index)}>
                                        <Text style={[styles.default_label,styles.fw_label,styles.gray_label,on&&styles.c33_label]}>{item}</Text>
                                        <View style={[styles.dot,on&&styles.ondot,styles.mt_5]}></View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>

                    <RefreshListView
                        showsVerticalScrollIndicator={false}
                        data={this.studyRegion}
                        exdata={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this._onHeaderRefresh}
                    />
                </View>
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    bg_cover:{
        width: theme.window.width,
        height: 220,
    },
    left_icon:{
        width: 24,
        height: 32,
    },
    wrap_box:{
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        marginTop: -30,
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
    },
    dot:{
        width: 8,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ffffff',
    },
    ondot:{
        width: 8,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#F4623F',
    },
    item_box:{
        paddingTop: 18,
        paddingBottom: 18,
    },
    tip_cover:{
        width: 20,
        height: 20,
    },
    tips:{
        width: 20,
        height: 20,  
    }
});

export const LayoutComponent = ProvinData;

export function mapStateToProps(state) {
	return {
        studyRegion:state.study.studyRegion
	};
}
