import React, { Component } from 'react';
import { Text, View,Image ,StyleSheet} from 'react-native';

import asset from '../config/asset';
import theme from '../config/theme';

class Score extends Component {

    render() {
        const {val = 5} = this.props;
        let vall_before = '';
        let vall_after = '';
        let halfstar = false;
        let vall_num = 0;


        if (val % 1 !== 0){
            vall_before = val.toString().split('.')[0];
            vall_after =  val.toString().split('.')[1];
            if ( parseInt(vall_after) >= 5){
                halfstar = true;
                vall_after = (parseInt(vall_after) - 1).toString();
                vall_num = 5 - parseInt(vall_before) - 1;
            }
        } else {
            vall_before = val.toString();

        }


        return (
            <View >
                {
                    halfstar ?
                    <View style={[styles.tabswrap]}>
                        {
                            [1, 2, 3, 4, 5].map((vall, index) => {
                                let on = vall <= parseInt(vall_before);
                                return (
                                    <View key={'vall' + index}>
                                        {
                                            on ?
                                            <Image key={'star' + index} source = {asset.star_full}  style={[styles.star_icon]} />
                                        : null}
                                    </View>
                                );
                            })
                        }
                        {
                            halfstar ?
                            <View>
                                <Image source = {asset.halfstar}  style={[styles.star_icon]} />
                            </View>
                        : null}
                        {
                            [1, 2, 3, 4, 5].map((vall, index) => {
                                let on = vall <= vall_num;
                                return (
                                    <View key={'vall' + index}>
                                        {
                                            on  ?
                                            <Image key={'star' + index} source = {asset.star}  style={[styles.star_icon]} />
                                        : null}
                                    </View>

                                );
                            })
                        }
                    </View>
                    :
                    <View style={[styles.tabswrap]}>
                        {
                            [1, 2, 3, 4, 5].map((vall, index) => {
                                let on = vall <= parseInt(vall_before);
                                return (
                                    <View key={'vall' + index}>
                                        <Image key={'star' + index} source = {on ? asset.star_full : asset.star}  style={[styles.star_icon]} />
                                    </View>
                                );
                            })
                        }
                    </View>
                }

            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
    tabswrap:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    star_icon:{
        width:12,
        height:12,
    },
});

export default  Score;
