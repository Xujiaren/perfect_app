//import liraries
import React, { Component } from 'react';
import { View, ImageBackground, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import theme from '../../config/theme';
import asset from '../../config/asset';

// create a component
class PkQuestion extends Component {

    static navigationOptions = ({navigation}) => {
		return {
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#41619B',
                borderBottomWidth: 0,
                elevation:0,
            },
            title: '我要出题',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.setParams({rule:true})} style={[styles.pr_15]}>
                    <Text style={[styles.white_label, styles.sm_label]}>出题规范</Text>
                </TouchableOpacity>
            ),
		}
    };

    constructor(props) {
        super(props);

        this.state = {
            rule: false,
        }
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        const {navigation} = nextProps;

        if (navigation !== this.props.navigation) {
            this.setState({
                rule: navigation.getParam('rule', false),
            })
        }
    }
    
    render() {
        const {navigation} = this.props;
        const {rule} = this.state;

        return (
            <ImageBackground style={[styles.container, styles.p_20, styles.ai_ct]} source={asset.pk.question_bg}>
                <Image source={asset.pk.question_logo} style={[styles.question_logo, styles.mt_50]}/>
                <View style={[styles.row, styles.mt_25]}>
                    <TouchableOpacity onPress={() => navigation.navigate('PkPublishQuestion')}>
                        <Image source={asset.pk.question} style={[styles.qbtn, styles.m_10]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('UserQuestion')}>
                        <Image source={asset.pk.question_record} style={[styles.qbtn, styles.m_10]}/>
                    </TouchableOpacity>
                </View>
                <Modal visible={rule} transparent={true} onRequestClose={() => {}}>
                    <TouchableOpacity style={[styles.modal]} onPress={()=> this.setState({rule: false})}/>
                    <View style={[styles.bg_white, styles.circle_5, styles.rule]}>
                        <View style={[styles.p_15, styles.mb_20, styles.mt_10]}>
                            <Text style={[styles.lg16_label, styles.center_label]}>出题规则</Text>
                            <Text style={[styles.mt_20, styles.lh20_label]}>
                            <Text style={[styles.sred_label]}>用户留言不得发布以下内容：</Text>{'\n'}
                            1、捏造、散播和宣传危害国家统一、公共安全、社会秩序等言论；{'\n'}
                            2、恶意辱骂、中伤、诽谤他人及企业；{'\n'}
                            3、涉及色情、污秽、低俗的的信息及言论；{'\n'}
                            4、广告信息；{'\n'}
                            5、《直销管理条例》、《禁止传销条例》、《反不正当竞争法》等法律法规禁止的内容；{'\n'}
                            6、政治性话题及言论；{'\n'}
                            7、对任何企业、组织现行规章制度的评论和讨论，及传播任何未经官方核实的信息；{'\n'}
                            如违反以上规定，平台有权实施账户冻结、注销等处理，情节严重的，将保留进一步法律追责的权利。{'\n'}
                            </Text>
                        </View>
                        <TouchableOpacity style={[styles.ai_ct, styles.p_15, styles.border_top]} onPress={()=> this.setState({rule: false})}>
                            <Text>关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ...theme.base,
    container: {
        flex: 1,
        backgroundColor: '#41619B',
    },
    question_logo: {
        width:  theme.window.width * 0.6,
        height: theme.window.width * 0.6 * 0.27,
    },
    qbtn: {
        width: 120,
        height: 135,
    },
    rule: {
        position: 'absolute',
        top: theme.window.width * 0.3,
        left: 40,
        right: 40,
    }
});

export const LayoutComponent = PkQuestion;

export function mapStateToProps(state) {
	return {
        
	};
}
