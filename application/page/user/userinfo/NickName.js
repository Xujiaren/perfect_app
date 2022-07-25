import React, { Component } from 'react';
import { Text, View ,StyleSheet ,TextInput,TouchableOpacity} from 'react-native';

import theme from '../../../config/theme';
import HudView from '../../../component/HudView';

class NickName extends Component {

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            title:params.title,
            headerRight: <View/>,
        };
    };
    constructor(props){
        super(props);
        const {navigation} = props;
        const {params} = navigation.state;
        this.type = params.type;
        this.state = {
            nickname:'',
        };
        this._onNickname = this._onNickname.bind(this);
    }

    UNSAFE_componentWillMount(){
        const {navigation} = this.props;
        const {params} = navigation.state;
        this.setState({
            nickname:params.nickname,
        });
    }

    _onNickname = () => {

        const {actions,navigation} = this.props;
        const {nickname} = this.state;

        let nkname = nickname.replace(/\s+/g,'');

        if (this.type === 1){
            if (nkname.length  >  0 ){
                if (nkname.length > 5){
                    this.refs.hud.show('昵称不大于五个字', 1);
                } else {
                    actions.user.reuserinfo({
                        field:'nickname',
                        val:nkname,
                        resolved: (data) => {
                            actions.user.user();
                            this.refs.hud.show('修改成功', 1);
                            setTimeout(()=>navigation.goBack(),1000);
                        },
                        rejected: (msg) => {
                            actions.user.user();
                        },
                    });
                }
            } else {
                this.refs.hud.show('昵称不能为空', 1);
            }
        } else {
            console.log(nickname);
        }

    }


    render() {
        const {nickname} = this.state;

        return (
            <View style={styles.pages}>
                <View style={[styles.nickwrap]}>
                    <View style={[styles.pt_15,styles.pb_15 ,styles.pl_30 ,styles.bg_white ,styles.mt_10]}>
                        <TextInput
                            style={styles.input}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            placeholder={this.type === 1 ? '不超过五个字' : ''}
                            onChangeText={(text) => {this.setState({nickname:text});}}
                            value={nickname}
                        />
                    </View>
                    <TouchableOpacity style={[styles.m_20  ,styles.btn ,styles.pt_10 ,styles.pb_10,styles.fd_r,styles.jc_ct]} onPress={this._onNickname} >
                        <Text style={[styles.white_label]}>确认</Text>
                    </TouchableOpacity>
                </View>
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    pages:{
        backgroundColor:'#FAFAFA',
        flex:1,
    },
    btn:{
        backgroundColor:'#F4623F',
        borderRadius: 5,
        marginTop:150,
    },
    input:{
        paddingVertical: 0,
    }
});

export const LayoutComponent = NickName;

export function mapStateToProps(state) {
	return {
        user:state.user.user
	};
}
