import React, { Component } from 'react';
import { Text, View ,StyleSheet,TouchableOpacity,Image} from 'react-native';

import RefreshListView, {RefreshState} from '../../../component/RefreshListView';
import HudView from '../../../component/HudView';
import Tabs from '../../../component/Tabs';


import VodCell from '../../../component/cell/VodCell';
import ActivityCell from '../../../component/cell/ActivityCell';
import ProjectCell from '../../../component/cell/ProjectCell';
import AskCell from '../../../component/cell/AskCell';

import asset from '../../../config/asset';
import theme from '../../../config/theme';


class UserCollect extends Component {


    static navigationOptions = ({navigation}) => {
        const colltype = navigation.getParam('colltype', false);
        
		return {
            title: '我的收藏',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.setParams({colltype:!colltype})} style={[styles.pr_15]}>
                    <Text style={[styles.sm_label ,styles.gray_label]}>{colltype ? '取消' : '管理收藏'}</Text>
                </TouchableOpacity>
            ),
		}
    };

    constructor(props){
        super(props);

        this.itemtype = null;
        this.items = [];
		this.page = 0;
		this.totalPage = 1;
        this.state = {
            choosedata:[],
            colltype:false,
            allType:false, // 全选
            ids:[], //选择删除id集合
            refreshState: RefreshState.Idle,
            status:0,
            sort:0,
        };

        this._onDelete = this._onDelete.bind(this);
        this._change = this._change.bind(this);
        this._onSelect = this._onSelect.bind(this);

        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._onAllSelect = this._onAllSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
		const {usercollect, userAcollect, navigation} = nextProps;

		if (usercollect !== this.props.usercollect) {
            this.itemtype = [];
			this.items = this.items.concat(usercollect.items);
			this.page = usercollect.page ;
            this.totalPage = usercollect.pages;
        }

        if (userAcollect !== this.props.userAcollect) {
            this.itemtype = [];
			this.items = this.items.concat(userAcollect.items);
			this.page = userAcollect.page ;
            this.totalPage = userAcollect.pages;
        }
    
        if(navigation !== this.props.navigation){

            const {params} = navigation.state;

            this.setState({
                colltype:params.colltype
            })

        }

		setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
	}

    componentDidMount(){
        const {actions} = this.props;
        this._onHeaderRefresh();
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {sort} = this.state;

		this.items = [];
		this.page = 0;
        this.totalPage = 1;
        
        if (sort < 2) {
            actions.user.usercollect(sort,this.page);
        } else {

            let ctype = 15
            if (sort == 3) {
                ctype = 2
            } else if (sort == 4) {
                ctype = 13
            } else if (sort == 5) {
                ctype = 10
            }
            
            actions.user.userAcollect(ctype, this.page);
        }
        
		this.setState({refreshState: RefreshState.HeaderRefreshing});

    }

    _onFooterRefresh() {
        const {actions} = this.props;
        const {sort} = this.state;

		if (this.page < this.totalPage) {
			this.setState({refreshState: RefreshState.FooterRefreshing});

			this.page = this.page + 1;

            if (sort < 2) {
                actions.user.usercollect(sort,this.page);
            } else {
    
                let ctype = 15
                if (sort == 3) {
                    ctype = 2
                } else if (sort == 4) {
                    ctype = 13
                } else if (sort == 5) {
                    ctype = 10
                }
                
                actions.user.userAcollect(ctype, this.page);
            }

		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
	}

    _keyExtractor(item, index) {
	    return index + '';
    }

    _renderItem(item){
        const {navigation} = this.props
        const collect = item.item;
        const index = item.index;
        const {ids, colltype, status} = this.state;


        const hasdata = ids.indexOf(index) > -1 ? true : false;


        if(status == 0 || status == 1){
            return (
                <View style={[styles.pl_12,styles.pr_12,styles.fd_r,styles.item]} >
                    {
                        colltype ?
                        <TouchableOpacity style={[styles.radio_box ,styles.jc_ct ,styles.ai_ct ]} onPress={() => this._change(collect,index)}>
                            <Image source={hasdata ?  asset.radio_full : asset.radio} style={[styles.radio]} />
                        </TouchableOpacity>
                    : null}

                    <VodCell course={collect} key={'recomm_' + collect.courseId}  
                        onPress={(collect) => navigation.navigate('Vod', {course: collect})}
                    />
    
                </View>
            );
        }

        if (status == 2) {
            return <View style={[styles.pl_12,styles.pr_12,styles.fd_r,styles.item]} >
                {
                    colltype ?
                    <TouchableOpacity style={[styles.radio_box ,styles.jc_ct ,styles.ai_ct ]} onPress={() => this._change(collect,index)}>
                        <Image source={hasdata ?  asset.radio_full : asset.radio} style={[styles.radio]} />
                    </TouchableOpacity>
                : null}
                <ProjectCell project={collect} onPress={() => navigation.navigate('Project', {project: collect})}/>
                </View>
        }
        
        if (status == 3) {
            return <View style={[styles.pl_12,styles.pr_12,styles.fd_r,styles.item]} >
                {
                    colltype ?
                    <TouchableOpacity style={[styles.radio_box ,styles.jc_ct ,styles.ai_ct ]} onPress={() => this._change(collect,index)}>
                        <Image source={hasdata ?  asset.radio_full : asset.radio} style={[styles.radio]} />
                    </TouchableOpacity>
                : null}
                <ActivityCell activity={collect} onPress={() => navigation.navigate('Activity', {activity: collect})}/>
                </View>
        }

        if (status == 5) {
            return <View style={[styles.pl_12,styles.pr_12,styles.fd_r,styles.item]} >
                {
                    colltype ?
                    <TouchableOpacity style={[styles.radio_box ,styles.jc_ct ,styles.ai_ct ]} onPress={() => this._change(collect,index)}>
                        <Image source={hasdata ?  asset.radio_full : asset.radio} style={[styles.radio]} />
                    </TouchableOpacity>
                : null}
                <AskCell ask={collect} onPress={() => navigation.navigate('Question', {ask: collect})}/>
                </View>
        }

        return <View/>
        
    }


    _change(item, index){
        const {ids} = this.state;

        if (ids.indexOf(index) !== -1){

            let indexs = ids.indexOf(index);
            ids.splice(indexs,1); //删除

        } else {
            ids.unshift(index); // 数组最前面
        }

        this.setState({
            ids:ids,
        },()=>{
            this._judge();
        });
    }

    //单选判断是否选完
    _judge(){
        const {ids} = this.state;

        this.setState({
            allType: ids.length == this.items.length,
        });
    }


    _onDelete(){
        const {actions,navigation} = this.props;
        let {ids, status} = this.state;

        let dids = [];
        let ctype = 3

        if (status < 2) {
            ids.map((idx, index) => {
                const course = this.items[idx];
                dids.push(course.courseId)
            })

            ctype = 3
        } else if (status == 2) {
            ids.map((idx, index) => {
                const article = this.items[idx];
                dids.push(article.articleId)
            })

            ctype = 15
        } else if (status == 3) {
            ids.map((idx, index) => {
                const activity = this.items[idx];
                dids.push(activity.activityId)
            })

            ctype = 2
        } else if (status == 4) {
            ids.map((idx, index) => {
                const article = this.items[idx];
                dids.push(article.articleId)
            })
            
            ctype = 13
        } else if (status == 5) {
            ids.map((idx, index) => {
                const ask = this.items[idx];
                dids.push(ask.askId)
            })

            ctype = 10
        }
        
        actions.course.userColltRemove({
            ids: dids.join(','),
            ctype: ctype,
            resolved: (data) => {
                this.setState({
                allType:false,
                    colltype:false,
                    ids:[],
                });
                navigation.setParams({'colltype': false});
            this.items = [];
                this._onHeaderRefresh();
                this.refs.hud.show('删除成功', 1);
            },
            rejected: (res) => {
                this.refs.hud.show('删除失败', 1);
            },
        });
        
    }

   //全选
   _onAllSelect() {
        const {ids} = this.state;

        let allchoose = [];

        if (ids.length == this.items.length) {
            this.setState({
                ids:[],
                allType:false,
            });
        } else {
            for (var i = 0; i < this.items.length; i++ ){
                allchoose.push(i);
            }

            this.setState({
                ids:allchoose,
                allType:true,
            });
        }
    }

    _onSelect(index){
        const {navigation} = this.props;
        this.itemtype = null;
        this.items = [];
        this.page=0;
        navigation.setParams({'colltype': false});
        this.setState({
            status:index,
            sort:index,
            colltype:false,
        },()=>{
            this._onHeaderRefresh();
        })
    }

    render() {

        const {status,ids,allType,colltype} = this.state;


        return (
            <View style={styles.container}>
                <View style={[styles.atabs]}>
                    <Tabs items={['视频', '音频','专题','活动', 'O2O', '问答']}  atype={0} selected={status} onSelect={this._onSelect} />
                </View>

                {
                    this.itemtype !== null ?
                    <View style={[styles.pt_10,styles.pb_50]}>
                        {
                            this.items.length > 0 ?
                            <RefreshListView
                                showsVerticalScrollIndicator={false}
                                data={this.items}
                                exdata={this.state}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                refreshState={this.state.refreshState}
                                onHeaderRefresh={this._onHeaderRefresh}
                                onFooterRefresh={this._onFooterRefresh}
                            />
                        :
                            <View style={[styles.noCollectBox]}>
                                <Image source={asset.perfect_icon.pf_colllect} style={styles.nocolllect} resizeMode={'contain'} />
                                <Text style={[styles.sred_label,styles.sm_label,styles.mt_15]}>还没有收藏记录</Text>
                            </View>
                        }
                    </View>
                :null }
                
                {
                    colltype ?
                    <View style={[styles.consbtn]}>
                        <View style={[styles.fd_r ,styles.jc_sb ,styles.ai_ct ,styles.pl_12 ,styles.pr_5 ,styles.pt_5]}>
                            <TouchableOpacity style={[styles.fd_r ,styles.ai_ct ]} onPress={this._onAllSelect}>
                                <Image source={allType ?  asset.radio_full : asset.radio} style={[styles.radio]} />
                                <Text style={[styles.lg_label ,styles.c33_label ,styles.pl_10]}> 全选</Text>
                            </TouchableOpacity>
                            {
                                ids.length > 0 ?
                                <TouchableOpacity style={[styles.consdete]}   onPress={this._onDelete}>
                                    <Text style={[styles.lg_label ,styles.white_label]}>删除</Text>
                                </TouchableOpacity>
                                :
                                <View style={[styles.consdeted]} >
                                    <Text style={[styles.lg_label ,styles.white_label]}>删除</Text>
                                </View>
                            }
                        </View>

                    </View>
                : null}
                <HudView ref={'hud'} />
            </View>
        );
    }
}


const styles =  StyleSheet.create({
    ...theme.base,
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    atabs:{
        borderBottomWidth: 1,
		borderStyle:'solid',
        borderBottomColor:'#fafafa',
        backgroundColor:'#ffffff'
    },
    item:{
        alignItems:'center',
        width:'100%',
    },
    radio_box:{
        width: 40,
    },
    radio:{
        width:17,
        height:17,
    },
    goods_cover:{
        width:133,
        height:72,
        backgroundColor:'#f5f5f5',
        borderRadius:5,
    },
    header_cover:{
        width:10,
        height:10,
        borderRadius:5,
    },
    item_head_cover:{
        width:14,
        height:14,
    },
    view_icon:{
        width:14,
        height:14,
    },
    consbtn:{
        height:50,
        backgroundColor:'#ffffff',
        position:'absolute',
        bottom:0,
        width:'100%',
    },
    consdete:{
        width:180,
        height:40,
        backgroundColor:'rgba(244,98,63,1)',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    consdeted:{
        width:180,
        height:40,
        backgroundColor:'#E1E1E1',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    collect_head_cover:{
        width:14,
        height:14,
    },
    nocolllect:{
        width:156,
        height:148
    },
    noCollectBox:{
        width:'100%',
        height:180,
        marginTop:50,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    }
});

export const LayoutComponent = UserCollect;

export function mapStateToProps(state) {
	return {
        usercollect:state.user.usercollect,
        userAcollect:state.user.userAcollect,
	};
}
