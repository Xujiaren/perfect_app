import React, { Component } from 'react';
import { Text, View ,StyleSheet,Image,TouchableOpacity,TextInput,Modal} from 'react-native';

import asset from '../../../config/asset';
import theme from '../../../config/theme';

class LuckyDraw extends Component {

    static navigationOptions = {
        title:'翻牌抽奖',
        headerRight: <View/>,
    };

    constructor(props){
        super(props);
        this.state = {
            showtips:5,
            mobile:'',
            ads:'',
            name:'',
        };

        this.showTips = this.showTips.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentDidMount(){

    }

    showTips(type){
        this.setState({
            showtips:type,
        });
    }

    _onSubmit(){
        const {name,mobile,ads} = this.state;
        console.log(name,mobile,ads);
    }

    render() {
        const {navigation} = this.props;
        const {showtips,mobile,ads,name} = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.fd_r]}>
                    <TouchableOpacity style={[styles.col_1,styles.ai_ct]}
                        onPress={()=>navigation.navigate('ActRule')}
                    >
                        <Text style={[styles.c33_label,styles.default_label]}>翻牌规则</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.col_1,styles.ai_ct]}
                        onPress={()=>navigation.navigate('FilpCards')}
                    >
                        <Text style={[styles.c33_label,styles.default_label]}>中奖记录</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.fd_r]}>
                    <TouchableOpacity style={[styles.fd_r,styles.col_1]} onPress={()=> this.showTips(0)}>
                        <Text>学分不足</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fd_r,styles.col_1]} onPress={()=> this.showTips(1)}>
                        <Text>抽到学分</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fd_r,styles.col_1]} onPress={()=> this.showTips(2)}>
                        <Text>商品介绍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fd_r,styles.col_1]} onPress={()=> this.showTips(3)}>
                        <Text>填写地址</Text>
                    </TouchableOpacity>
                </View>

                {
                    showtips === 0 ?
                    <Modal transparent={true} visible={this.state.tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_cons]}>
                            <Image source={asset.lucky_glod} style={styles.layer_head} />
                            <Text style={[styles.lg24_label ,styles.black_label ,styles.pt_20 ,styles.pb_5]}>再接再厉!</Text>
                            <View style={[styles.layer_icover ,styles.d_flex ,styles.fd_r ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={asset.perfect_icon.pf_lucky}  style={[styles.layer_ncover]}/>
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]}>
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                : null}
                {
                    showtips === 1 ?
                    <Modal transparent={true} visible={this.state.tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_cons]}>
                            <Image source={asset.lucky_glod} style={styles.layer_head} />
                            <Text style={[styles.lg24_label ,styles.black_label ,styles.pt_20 ,styles.pb_5]}>恭喜你</Text>
                            <Text style={[styles.lg18_label, styles.c33_label]}>获得 100学分</Text>
                            <View style={[styles.layer_icover ,styles.d_flex ,styles.fd_r ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={asset.goldtip} style={[styles.gold_cover]} />
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]}>
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                : null}

                {
                    showtips === 2 ?
                    <Modal transparent={true} visible={this.state.tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_cons]}>
                            <Image source={asset.lucky_glod} style={styles.layer_head} />
                            <Text style={[styles.lg24_label ,styles.black_label ,styles.pt_20 ,styles.pb_5]}>恭喜你</Text>
                            <Text style={[styles.lg18_label, styles.c33_label]}>获得 手机一部</Text>
                            <View style={[styles.layer_icover ,styles.d_flex ,styles.fd_r ,styles.jc_ct ,styles.ai_ct]}>
                                <Image source={asset.goldtip} style={[styles.goods_cover]} />
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]}>
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                : null}

                {
                    showtips === 3 ?
                    <Modal transparent={true} visible={this.state.tips} onRequestClose={() => {}}>
                        <TouchableOpacity style={[styles.col_1,styles.layertop]} onPress={()=>this.setState({showtips:5})}></TouchableOpacity>
                        <View style={[styles.layer_info]}>
                            <Image source={asset.bg.lucky_ads} style={styles.info_head} />
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'姓名'}
                                    onChangeText={(text) => {this.setState({name:text});}}
                                    value={name}
                                />
                            </View>
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'手机'}
                                    onChangeText={(text) => {this.setState({mobile:text});}}
                                    value={mobile}
                                />
                            </View>
                            <View style={[styles.layer_item, styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.mt_15]}>
                                <TextInput
                                    style={[styles.col_1,styles.pr_20,styles.pl_15,styles.input]}
                                    clearButtonMode={'never'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder={'地址'}
                                    onChangeText={(text) => {this.setState({ads:text});}}
                                    value={ads}
                                />
                            </View>
                            <View style={[styles.mt_10,styles.mb_20]}>
                                <Text style={[styles.sm_label,styles.tip_label]}>请确保信息无误，一旦提交无法修改</Text>
                            </View>
                            <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.ai_ct ,styles.jc_ct  ,styles.layer_btns]} onPress={this._onSubmit}>
                                <Text style={[styles.default_label ,styles.white_label]}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                : null}
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,

    layertop:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.6)',
    },
    layer_cons:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:280,
        height:306,
        marginLeft:-140,
        marginTop:-153,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        zIndex:999,
        borderRadius:4,
        alignItems:'center',
    },
    layer_info:{
        position: 'absolute',
        top:'50%',
        left:'50%',
        width:280,
        height:300,
        marginLeft:-140,
        marginTop:-150,
        backgroundColor:'#ffffff',
        flexDirection:'column',
        zIndex:999,
        borderRadius:5,
        alignItems:'center',
    },
    layer_head:{
        width:'100%',
        height:89,
        marginTop:-24,
    },
    layer_ncover:{
        width:80,
        height:80,
    },
    layer_btns:{
        width:250,
        height:34,
        backgroundColor:'#F4623F',
        borderRadius:5,
    },
    layer_icover:{
        paddingTop:12,
        paddingBottom:30,
    },
    gold_cover:{
        width:60,
        height:60,
        borderRadius:30,
    },
    goods_cover:{
        width:64,
        height:70,
    },
    info_head:{
        width:'100%',
        height:89,
        marginTop:-24,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    },
    layer_item:{
        width:250,
        height:32,
        backgroundColor:'#EEEEEE',
        borderRadius:5,
    },
    input:{
        paddingVertical: 0,
    }
});

export const LayoutComponent = LuckyDraw;

export function mapStateToProps(state) {
	return {

	};
}
