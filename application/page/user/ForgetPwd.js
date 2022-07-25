import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableWithoutFeedback,TouchableOpacity,ScrollView,Keyboard,Image,TextInput} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import asset from '../../config/asset';
import theme from '../../config/theme';
import CountDownButton from '../../component/CountDownButton';

class ForgetPwd extends Component {

    static navigationOptions = {
        header:null
    };
    
    constructor(props){
        super(props);

        this.state = {
            step: 0,
            mobile: '',
            code: '',
        };

        this._onCode = this._onCode.bind(this);
        this._onInput = this._onInput.bind(this);
    }

    _onCode() {
        const {actions} = this.props;
        const {mobile} = this.state;

        actions.passport.vcode({
            mobile: mobile,
            resolved: (data) => { 
                this.setState({
                    step: 1
                })
            },
            rejected: (msg) => {

            }
        })
    }

    // 输入密码
    _renderInputItem() {
        let {code} = this.state;
        let inputItem = [];
        
        //理论上TextInput的长度是多少，这个i就小于它
        for (let i = 0; i < 5; i++) {
            inputItem.push(
                //i是从0开始的所以到最后一个框i的值是5
                //前面的框的右边框设置为0，最后一个边框再将右边框加上
                <View key={i} style={styles.textInputView}>
                    {i < code.length
                        ?   <View>
                                <Text style={[styles.lg30_label,styles.c33_label,styles.fw4_label]}>{code.split('')[i]}</Text>
                            </View>
                        : null}
                </View>);
        }

        return inputItem;
    };

    _onInput(text) {
        const {actions, navigation} = this.props;
        const {mobile} = this.state;

        let code = text.replace(/[^\d]+/, '');
        this.setState({
            code:code,
        });


        if( code.length === 5){
            navigation.navigate('SetPwd', {type: 1, mobile: mobile, code: text});
        }
        

        // actions.passport.validcode({
        //     mobile: mobile,
        //     code: text,
        //     resolved: (data) => {
        //         navigation.navigate('SetPwd', {type: 1, mobile: mobile, code: text});
        //     },
        //     rejected: (msg) => {

        //     }
        // })
        

    }

    render() {
        const {navigation} = this.props;
        const {step, mobile, code} = this.state;

        let enable = mobile.length == 11;

        return (
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={styles.container}>
                    <ScrollView style={{flex:1}}    
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}  keyboardShouldPersistTaps={'handled'}>
                        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backicon}>
                            <Image source={asset.left_arrows}  style={[styles.arrow_right]} />
                        </TouchableOpacity>
                        <View style={[styles.fd_r,styles.ai_ct,styles.mt_40,styles.ml_25]}>
                            <Text style={[styles.lg26_label,styles.c33_label,styles.fw_label]}>找回密码</Text>
                        </View>
                        {step == 0 ?
                        <View style={[styles.mt_50,styles.ml_25,styles.mr_25]}>
                            <View style={[styles.row, styles.mt_20, styles.ai_ct, styles.border_bt]}>
                                <Text style={[styles.horange_label]}>+86</Text>
                                <TextInput
                                    style={[styles.col_1,styles.input,styles.pb_10,styles.pt_10, styles.ml_5]}
                                    placeholder={'请输入手机号码'}
                                    clearButtonMode={'while-editing'}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    value={mobile}
                                    keyboardType={'phone-pad'}
                                    onChangeText={(text) => {this.setState({mobile:text});}}
                                />
                            </View>
                            <TouchableOpacity style={[styles.red_label, styles.btns, !enable && styles.disabledContainer]} disabled={!enable} onPress={this._onCode}>
                                <Text style={[styles.lg_label,styles.white_label]}>发送验证码</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <View style={[styles.mt_25,styles.ml_25,styles.fd_r,styles.ai_ct]}>
                                <Text style={[styles.gray_label,styles.default_label, styles.mr_10]}>已发送至绑定手机 {mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                                <CountDownButton onPress={this._onCode} canSend={mobile.length === 11} />
                            </View>
                            <View style={[styles.mt_70,styles.ml_25,styles.mr_25,styles.fd_c,styles.ai_ct,styles.txtbox]}>
                                <TextInput
                                    style={styles.textInputMsg}
                                    ref={ (ref)=>this.textInput = ref }
                                    maxLength={5}
                                    autoFocus={true}
                                    caretHidden={true}
                                    selectionColor={'#ffffff'}
                                    keyboardType="numeric"
                                    defaultValue={code}
                                    onChangeText={(text) => { this._onInput(text);}}
                                />
                                <View style={[styles.fd_r,styles.inputText]}>
                                    {
                                        this._renderInputItem()
                                    }
                                </View>
                            </View>
                        </View>
                        }
                        
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        backgroundColor:'#fff',
        flex:1,
    },
    backicon:{
        ...ifIphoneX({
            marginTop: 50,
        }, {
            marginTop:28,
        }),
        marginLeft:18 ,
    },
    arrow_right:{
        width:10,
        height:18,
    },
    header_icon:{
        width:144,
        height:30,
    },
    btns:{
        width:theme.window.width - 50,
        height:42,
        backgroundColor:'rgba(244,98,63,1)',
        borderRadius:5,
        marginTop:40,
        alignItems:'center',
        justifyContent:'center',
    },
    txtbox:{
        position:'relative',
    },
    textInputMsg:{
        zIndex:99,
        position:'absolute',
        color:'#FFFFFF',
        fontSize:1,
        backgroundColor:'transparent',
        height:54,
        width:250,
        top:0,
        paddingVertical: 0,
    },
    input:{
        paddingVertical: 0,
    },
    textInputView:{
        height:40,
        width:40,
        borderWidth:1,
        borderColor:'#E5E5E5',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:3,
    },
    inputText:{
        width:250,
        justifyContent:'space-between',

    },

});




export const LayoutComponent = ForgetPwd;

export function mapStateToProps(state) {
	return {
	};
}
