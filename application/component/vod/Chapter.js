//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import theme from '../../config/theme';
import iconMap from '../../config/font';
import * as tools from '../../util/common';

class Chapter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cindex: props.cindex || 0,
            ccindex: props.ccindex || 0,
        }
    }

    componentWillReceiveProps(nextProps) {
        const {cindex, ccindex} = nextProps;
        if (cindex !== this.props.cindex) {
            this.setState({
                cindex: cindex,
            })
        }

        if (ccindex !== this.props.ccindex) {
            this.setState({
                ccindex: ccindex
            })
        }
    }

    render() {
        const {items, onSelect, style = {}} = this.props;

        let total = 0;
        items.map((chapter, index) => {
            total += chapter.child.length;  
        })

        return (
            <View style={[style]}>
                <View style={[styles.row, styles.ai_ct, styles.jc_sb, styles.border_top, styles.pt_15, styles.ml_15, styles.mr_15, styles.mb_15]}>
                    <Text style={[styles.lg_label]}>课程大纲</Text>
                    <Text style={[styles.sm_label]}>共{total}讲</Text>
                </View>
                {items.map((chapter, cindex) => {
                    return (
                        <View key={'chapter_' + cindex}>
                            {total > 1 ?
                            <View style={[styles.bg_f7f, styles.p_10, styles.pl_15, styles.pr_15]}>
                                <Text style={[styles.lg15_label, styles.fw_label]}>
                                    {'第' + (cindex + 1) +'章 ' + chapter.chapterName}
                                </Text>
                            </View>
                            : null}
                            <View style={[styles.bg_white, styles.p_8, styles.pl_15, styles.pr_15]}>
                                {chapter.child.map((cchapter, ccindex) => {
                                    const on = cindex == this.state.cindex && ccindex == this.state.ccindex;

                                    return (
                                        <TouchableOpacity key={'chapter_' + cindex + '_' + ccindex} style={[styles.p_8, styles.fd_r, styles.ai_ct, styles.jc_sb,styles.col_1]} onPress={() => {
                                            onSelect && onSelect(cindex, ccindex);
                                        }}>
                                            <View style={[styles.row, styles.ai_ct, styles.jc_fs,styles.col_1]}>
                                                <View style={[styles.onitem]}>
                                                    {on ?
                                                    <Text style={[styles.icon, styles.sred_label]}>{iconMap('youyinpin')}</Text>
                                                    : null}
                                                </View>
                                                <Text style={[styles.default_label, on && styles.sred_label, styles.item,styles.col_1,styles.pr_10]}>
                                                    {(cindex + 1) + '-' + (ccindex + 1) + ' ' +cchapter.chapterName}
                                                </Text>
                                            </View>
                                            <Text style={[styles.sm_label, styles.tip_label]}>
                                                {tools.forTime(cchapter.duration)}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    )
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    onitem: {
        width: 24,
    },
    item: {
        width: theme.window.width - 120
    }
});

//make this component available to the app
export default Chapter;
