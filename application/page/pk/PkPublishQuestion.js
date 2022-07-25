//import liraries
import React, { Component } from 'react';
import { View, ImageBackground, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import Picker from 'react-native-picker';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import asset from '../../config/asset';
import HudView from '../../component/HudView';

// create a component
class PkPublishQuestion extends Component {

    static navigationOptions = ({navigation}) => {
		return {
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#41619B',
                borderBottomWidth: 0,
                elevation:0,
            },
            title: '我要出题',
		}
    };

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            aindex: 0,

            categoryId: 0,
            categoryName: '全部分类',
        }

        this._onCategory = this._onCategory.bind(this);
        this._onAnswer = this._onAnswer.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.pker.category();
    }

    componentWillUnmount(){
        Picker.hide();
    }

    _onCategory() {
        const {category} = this.props;

        let data = ['全部分类'];
        category.map((c, index) => {
            data.push(c.categoryName);
        })

        Picker.init({
            pickerData: data,
            selectedValue: [this.state.categoryName],
            onPickerConfirm: data => {
                let categoryId = 0;
                const categoryName = data[0];

                category.map((c, index) => {
                    if (c.categoryName == categoryName) {
                        categoryId = c.categoryId;
                    }
                })
                this.setState({
                    categoryId: categoryId,
                    categoryName: categoryName,
                })
            }
        });

        Picker.show();
    }

    _onAnswer(aindex) {
        this.setState({
            aindex: aindex,
        })
    }

    _onSubmit(type) {
        const {navigation, actions} = this.props;
        const {categoryId, title, option1, option2, option3, option4, aindex} = this.state;

        const that = this;

        actions.pker.pushtopic({
            category_id: categoryId,
            title: title,
            answer: JSON.stringify([option1, option2, option3, option4]),
            aindex: aindex,
            resolved: (data) => {
                that.refs.hud.show('提交成功', 1, () => {
                    if (type == 0) {
                        navigation.goBack();
                    } else {
                        this.setState({
                            title: '',
                            option1: '',
                            option2: '',
                            option3: '',
                            option4: '',
                            aindex: 0,

                            categoryId: 0,
                            categoryName: '全部分类',
                        })
                    }
                });
            },
            rejected: (msg) => {
                that.refs.hud.show('提交失败', 1);
            }
        })
    }

    render() {
        const {categoryName, categoryId, title, option1, option2, option3, option4, aindex} = this.state;

        const enable = categoryId > 0 && title.length > 0 && option1.length > 0 && option2.length > 0 && option3.length > 0 && option4.length > 0;

        return (
            <ImageBackground style={[styles.container, styles.p_20]} source={asset.pk.question_bg}>
                <ScrollView>
                    <TouchableOpacity style={[styles.circle_5, styles.p_15, styles.bg_white, styles.row, styles.ai_ct, styles.jc_sb]} onPress={() => this._onCategory()}>
                        <Text style={[styles.gray_label]}>{categoryName}</Text>
                        <Text style={[styles.icon, styles.tip_label]}>{iconMap('right')}</Text>
                    </TouchableOpacity>

                    <TextInput 
                        style={[styles.input, styles.mt_10, styles.bg_white, styles.p_15, styles.circle_5]} 
                        placeholder={'填写题干'}
                        multiline={true}
                        clearButtonMode={'while-editing'}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        value={title}
                        onChangeText={(text) => {this.setState({title:text});}}
                    />

                    <View style={[styles.p_20, styles.bg_white, styles.circle_5, styles.mt_10]}>
                        <View style={[styles.p_10, styles.pl_15, styles.pr_15, styles.question, styles.row, styles.circle_20, styles.mb_10, styles.ai_ct]}>
                            <TextInput
                                style={[styles.col_8]}
                                placeholder={'请输入正确答案'}
                                
                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                value={option1}
                                onChangeText={(text) => {this.setState({option1:text});}}
                            />
                            <TouchableOpacity style={[styles.col_1]} onPress={() => this._onAnswer(0)}>
                                <Text style={[styles.icon, styles.sred_label, aindex == 0 && styles.green_label]}>{iconMap(aindex == 0 ? 'gou' : 'guanbi')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.p_10, styles.pl_15, styles.pr_15, styles.question, styles.row, styles.circle_20, styles.mb_10, styles.ai_ct]}>
                            <TextInput
                                style={[styles.col_8]}
                                placeholder={'请输入错误答案'}

                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                value={option2}
                                onChangeText={(text) => {this.setState({option2:text});}}
                            />
                            <TouchableOpacity style={[styles.col_1]} onPress={() => this._onAnswer(1)}>
                                <Text style={[styles.icon, styles.sred_label, aindex == 1 && styles.green_label]}>{iconMap(aindex == 1 ? 'gou' : 'guanbi')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.p_10, styles.pl_15, styles.pr_15, styles.question, styles.row, styles.circle_20, styles.mb_10, styles.ai_ct]}>
                            <TextInput
                                style={[styles.col_8]}
                                placeholder={'请输入错误答案'}

                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                value={option3}
                                onChangeText={(text) => {this.setState({option3:text});}}
                            />
                            <TouchableOpacity style={[styles.col_1]} onPress={() => this._onAnswer(2)}>
                                <Text style={[styles.icon, styles.sred_label, aindex == 2 && styles.green_label]}>{iconMap(aindex == 2 ? 'gou' : 'guanbi')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.p_10, styles.pl_15, styles.pr_15, styles.question, styles.row, styles.circle_20, styles.mb_10, styles.ai_ct]}>
                            <TextInput
                                style={[styles.col_8]}
                                placeholder={'请输入错误答案'}

                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                value={option4}
                                onChangeText={(text) => {this.setState({option4:text});}}
                            />
                            <TouchableOpacity style={[styles.col_1]} onPress={() => this._onAnswer(3)}>
                                <Text style={[styles.icon, styles.sred_label, aindex == 3 && styles.green_label]}>{iconMap(aindex == 3 ? 'gou' : 'guanbi')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.row, styles.jc_sb, styles.mt_25]}>
                        <TouchableOpacity onPress={() => this._onSubmit(0)} disabled={!enable}>
                            <Image source={asset.pk.question_submit} style={[styles.question_submit, !enable && styles.disabledContainer]}/>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => this._onSubmit(1)} disabled={!enable}>
                            <Image source={asset.pk.question_next} style={[styles.question_submit, !enable && styles.disabledContainer]}/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <HudView ref={'hud'} />
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
    input: {
        paddingVertical: 0,
        textAlignVertical:'top',
        height: 100
    },
    question: {
        borderColor: '#F8F8F8',
        borderStyle:'solid',
        borderWidth: 1,
    },
    question_submit: {
        width: 152,
        height: 42,
    }
});

export const LayoutComponent = PkPublishQuestion;

export function mapStateToProps(state) {
	return {
        category: state.pker.category,
	};
}