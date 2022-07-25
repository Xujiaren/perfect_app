import React, { Component } from 'react'
import { Text, View ,StyleSheet,Image,ProgressViewIOS,ProgressBarAndroid,Platform,ScrollView,TouchableOpacity,ImageBackground} from 'react-native'

import asset from '../../../config/asset';
import theme from '../../../config/theme';

import { Grayscale } from 'react-native-color-matrix-image-filters';


class UserMedal extends Component {

    static navigationOptions = {
        title:'我的勋章',
        headerRight: <View/>,
    };


    constructor(props){
        super(props)

        this.userMedal = [] ;

        this.state = {

        }
    }

    componentWillReceiveProps(nextProps){

        const {userMedal} = nextProps

        if( userMedal !== this.props.userMedal){

            this.userMedal = userMedal

        }
    }


    componentWillMount(){
        
    }


    componentDidMount(){
        const {actions} = this.props;

        actions.user.userMedal();
    }

    render() {
        const {navigation} = this.props;

        let nullData = 0

        if(this.userMedal.length % 3 === 2){
            nullData = 1
        }

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}      
                showsHorizontalScrollIndicator={false}
            >
                <View style={[styles.item_wrap,styles.fd_r,styles.jc_sb,styles.ai_fs,styles.pt_20]}>
                    {
                        this.userMedal.map((med,index)=>{

                            let parent = (med.nowNum / med.allNum).toFixed(2)

                            return(
                                <TouchableOpacity style={[styles.item,styles.fd_c,styles.ai_ct]} key={'med' + index}
                                    onPress={()=> navigation.navigate('MedalDesc',{med:med,currentIdx:index})}
                                >
                                    {
                                        med.have ? 
                                        <Image source={{uri:med.img}}  style={[styles.medal_icon]} />
                                        :
                                        <Grayscale>
                                            <Image source={{uri:med.img}}  style={[styles.medal_icon]} />
                                        </Grayscale>
                                    }
                                    
                                    <Text style={styles.medal_name}>{med.title}Lv.{med.lv}</Text>
                                    {
                                        Platform.OS === 'android' ?
                                        <ProgressBarAndroid indeterminate={false} color={'#FF5047'} style={{width: '80%',marginTop:6}} progress={parseFloat(parent)} styleAttr="Horizontal"/>
                                        :
                                        <ProgressViewIOS progress={parseFloat(parent)}  style={{width: '80%',marginTop:6}} trackTintColor={'#ECECEC'} progressTintColor={'#F4623F'} />
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        nullData === 1 ?
                        <View style={[styles.item,styles.fd_c,styles.ai_ct]}></View>
                    :null}
                </View>
            </ScrollView>
        )
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    item_wrap:{
        width:'100%',
        flexWrap:'wrap',
        borderTopColor:'#f6f6f6',
        borderTopWidth:1,
        borderStyle:'solid',
        padding:20
    },
    item:{
        width:'30%',
        color:'#333333',
        fontSize:14,
        marginBottom:35,
    },
    medal_icon:{
        marginBottom:11,
        width:66,
        height:66,
        // backgroundColor:'rgba(1,1,1,0.6)'
    },
    progress:{
        width:'75%',
        marginTop:6,
        
    },
    grayImg:{
        backgroundColor:'#f1f1f1' ,
        opacity:0.3 
    }
});


export const LayoutComponent = UserMedal;

export function mapStateToProps(state) {
	return {
        userMedal:state.user.userMedal
	};
}

