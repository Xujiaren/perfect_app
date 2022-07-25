import React, { Component } from 'react'
import { View, Text ,StyleSheet,Image,TouchableOpacity,TextInput,Modal} from 'react-native';

import LabelBtn from '../../../component/LabelBtn';
import theme from '../../../config/theme';
import asset from '../../../config/asset'

class FdBackDesc extends Component {

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state

		return {
            title: params.title !== undefined ? params.title : '问题详解',
            headerRight: <View/>,
		}
    };

    constructor(props){
        super(props);

        this.state = {
            configHelp:[],
            fbData:{}
        }

        this._backDesc = this._backDesc.bind(this)
    }

    componentWillReceiveProps(nextProps){

    }

    componentWillMount(){
        const {navigation} = this.props
        const {params} = navigation.state
        const {configHelp,fbData} = params

        this.setState({
            configHelp:configHelp,
            fbData:fbData
        })

    }

    componentDidMount(){

    }

    componentWillUnmount(){
    }


    _backDesc(cts , title){
        const {navigation} = this.props

        this.setState({
            configHelp:[],
            fbData:cts
        })
        navigation.navigate('FdBackDesc',{configHelp:[],fbData:cts,title:title})
    }


    render() {

        const {fbData,configHelp} = this.state

        return (
            <View  style={[styles.wrap]}>
                <View style={[styles.wrapHead]}>
                    <View style={[styles.d_flex ,styles.fd_c ,styles.mb_20]}>
                        <Text style={[styles.lg18_label ,styles.black_label ,styles.fw_label]}>{fbData.title}</Text>
                        <Text style={[styles.gray_label ,styles.default_label ,styles.mt_10]}>{fbData.content}</Text>
                    </View>
                </View>
                

                {
                    configHelp.length > 0 ?
                    <View style={[styles.pt_20 ,styles.pb_20 ,styles.pl_25]}>
                        <Text style={[styles.lg20_label ,styles.c33_label ,styles.fw_label]}>其他相关问题</Text>
                    </View>
                :null}

                {
                    configHelp.length > 0 ?
                    <View style={[styles.wrap_bottom]}>
                        {
                            configHelp.map((cts,index)=>{
                                return(
                                    <TouchableOpacity style={[styles.d_flex ,styles.fd_r ,styles.jc_sb ,styles.pt_10 ,styles.pb_10 ,styles.bd_bt]} 
                                        key={'ccitem' + index}
                                        onPress={this._backDesc.bind(this,cts,cts.title)}
                                    >
                                        <Text style={[styles.gray_label ,styles.sm_label]}>{cts.title}</Text>
                                        <Image source={asset.arrow_right}   style={[styles.arrow_icon_r]} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                :null}
                
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    wrapHead:{
        paddingLeft:25,
        paddingTop:20,
        paddingRight:30,
        paddingBottom:10,
    },
    wrap_bottom:{
        paddingLeft:25,
        paddingRight:30,
    },
    bd_bt:{
        borderBottomWidth:1,
        borderBottomColor:'#EBEBEB',
        borderStyle:'solid'
    },
    arrow_icon_r:{
        width:6,
        height:11
    }
})

export const LayoutComponent = FdBackDesc;

export function mapStateToProps(state) {
	return {

	};
}
