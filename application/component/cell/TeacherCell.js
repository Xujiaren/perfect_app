import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import theme from '../../config/theme';

class TeacherCell extends Component {

    render() {
        const { teacher, ttype = 0, onPress } = this.props;

        return (
            <TouchableOpacity style={[styles.teach_item, styles.mr_20, styles.d_flex, styles.fd_c, styles.ai_ct]} onPress={() => onPress && onPress(teacher)}>
                <Image style={[styles.leader_cover]} source={{ uri: teacher.teacherImg }} />
                <Text style={[styles.c33_label, styles.default_label, styles.fw_label, styles.mt_20]}>{teacher.teacherName}</Text>
                <View style={[styles.row, styles.ai_ct, styles.jc_ct,styles.mt_5, {display:'flex', height: 18, borderRadius: 9, borderColor: '#cccccc', borderStyle: 'solid',borderWidth:1}]}>
                    <Text style={[styles.tip_label, styles.sm_label,{marginLeft:3,marginRight:3}]}>{ttype == 0 ? (teacher.honor).substring(0, 6) : teacher.follow + '人关注'}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
    leader_cover: {
        width: 90,
        height: 110,
        borderRadius: 5,
        backgroundColor: '#fafafa',
    },
});

export default TeacherCell;
