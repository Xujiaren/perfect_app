import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, NativeModules, Alert, Platform } from 'react-native';

import _ from 'lodash';

import theme from '../../../config/theme';
import LabelBtn from '../../../component/LabelBtn';
import HudView from '../../../component/HudView';
const native = NativeModules.HttpCache;
class Setting extends Component {
    static navigationOptions = {
        title: '设置',
        headerRight: <View />,
    };

    constructor(props) {
        super(props);
        this.state = {
            loginStatus: false,
            cacheSize: '',
            unit: '',
        };

        this._onClearCache = this._onClearCache.bind(this);
        this._onRefreshCache = this._onRefreshCache.bind(this);
        this._onPage = this._onPage.bind(this);
        this._onLogout = this._onLogout.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._onRefresh();
        this.focuSub = navigation.addListener('didFocus', (route) => {
            this._onRefresh();
        })

    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;

        this.setState({
            loginStatus: !_.isEmpty(user),
        });
    }

    _onRefresh() {
        const { actions } = this.props;
        actions.user.user();
    }

    _onClearCache() {
        if (Platform.OS === 'ios') {
            const that = this;
            this.refs.hud.show('...');
            NativeModules.ClearCache.clearAppCache(() => {
                that.refs.hud.hide();
                that._onRefreshCache();
            })
        } else {
            this.setState({
                cacheSize: '0',
                unit: 'B'
            })
        }
    }

    _onRefreshCache() {
        NativeModules.ClearCache.getAppCacheSize((value, unit) => {
            this.setState({
                cacheSize: value,
                unit: unit
            })
        })
    }

    _onPage(nav_val) {
        const { navigation } = this.props;
        const { loginStatus } = this.state;

        if (loginStatus) {
            if (nav_val == 'About' || nav_val == 'SetPush') {
                navigation.navigate(nav_val);
            } else if (nav_val == 'Address' || nav_val == 'Account') {

                navigation.navigate(loginStatus ? nav_val : 'PassPort');

            } else if (nav_val == 'Cache') {
                this._onClearCache();

            } else if (nav_val == 'Update') {
                Alert.alert('提示', '已是最新版本');
            } else if (nav_val == 'SetMobile') {
                navigation.navigate(nav_val);
            } else if (nav_val == 'Blacklist') {
                navigation.navigate('Blacklist')
            }
        } else {
            navigation.navigate('PassPort');
        }

        if (nav_val == 'RserviceAgreement') {
            navigation.navigate(nav_val, { type: 0 });
        } else if (nav_val == 'RprivacyPolicy') {
            navigation.navigate(nav_val, { type: 0 });
        }




    }

    _onLogout() {
        const { navigation, actions } = this.props;
        actions.passport.logout({
            resolved: (data) => {
                actions.user.user();
                actions.user.userlevel();

                navigation.navigate('User');
            },
            rejected: (msg) => {

            }
        })
    }

    render() {
        const { loginStatus, cacheSize, unit } = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.pt_10, styles.pb_10]}>
                    <LabelBtn label={'账号/绑定设置'} nav_val={'Account'} clickPress={this._onPage} />
                </View>
                <View style={[styles.pt_10, styles.pb_10]}>
                    <LabelBtn label={'密码设置'} nav_val={'SetMobile'} clickPress={this._onPage} />
                </View>

                <LabelBtn label={'黑名单'} nav_val={'Blacklist'} clickPress={this._onPage} />
                {/* <LabelBtn label={'推送消息设置'} nav_val={'SetPush'}  clickPress ={this._onPage} /> */}
                <LabelBtn label={'地址管理'} nav_val={'Address'} clickPress={this._onPage} />
                <LabelBtn label={'清除缓存'} type={cacheSize + ' ' + unit} nav_val={'Cache'} clickPress={this._onPage} />
                <LabelBtn label={'检查更新'} nav_val={'Update'} clickPress={this._onPage} />
                <LabelBtn label={'关于我们'} nav_val={'About'} clickPress={this._onPage} />


                {loginStatus ?
                    <TouchableOpacity style={[styles.pt_15, styles.pb_15, styles.mt_15, styles.bg_white, styles.ai_ct, styles.jc_ct]} onPress={this._onLogout}>
                        <Text style={[styles.red_label, styles.lg_label, styles.fw_label]}>退出登录</Text>
                    </TouchableOpacity>
                    : null}
                <HudView ref={'hud'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = Setting;

export function mapStateToProps(state) {
    return {
        user: state.user.user,
    };
}
