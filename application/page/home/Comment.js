import React, { Component } from 'react';
import {View, StyleSheet, Modal} from 'react-native';

import _ from 'lodash';
import RefreshListView, {RefreshState} from '../../component/RefreshListView';
import ImageViewer from 'react-native-image-zoom-viewer';

import Tabs from '../../component/Tabs';
import CommentCell from '../../component/cell/CommentCell';

import theme from '../../config/theme';

class Comment extends Component {
    static navigationOptions = {
        title:'全部留言',
        headerRight: <View/>,
    };

    constructor(props) {
        super(props);

        const {navigation} = props;
        this.ctype = navigation.getParam('ctype', 3);
        this.content_id = navigation.getParam('content_id', 0);
        this.courseName = navigation.getParam('courseName','')

        this.citems = [];
        this.page = 1;
        this.pages = 1;

        this.state = {
            preview: false,
            preview_index: 0,
            preview_imgs:[],

            index: 0,
            sort: 0,
            refreshState: RefreshState.Idle,
        };

        this._onSelect = this._onSelect.bind(this);
        this._onHeaderRefresh = this._onHeaderRefresh.bind(this);
        this._onFooterRefresh = this._onFooterRefresh.bind(this);
        this._onPraise = this._onPraise.bind(this);
        this._onPreview = this._onPreview.bind(this);

        this._renderItem = this._renderItem.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {course_comment, article_comment,pComment} = nextProps;

        if (course_comment !== this.props.course_comment) {
            this.pages = course_comment.pages;
            this.citems = this.citems.concat(course_comment.items);
        }

        if (article_comment !== this.props.article_comment) {
            this.pages = article_comment.pages;
            this.citems = this.citems.concat(article_comment.items);
        }

        if (pComment !== this.props.pComment) {
            this.pages = pComment.pages;
            this.citems = this.citems.concat(pComment.items);
        }

        setTimeout(() => this.setState({refreshState: RefreshState.Idle}), 300);
    }

    componentDidMount(){
        const {navigation,actions} = this.props;

        this.focuSub = navigation.addListener('didFocus', (route) => {
            actions.user.user();
            this._onHeaderRefresh();
        })

        this._onHeaderRefresh();
    }

    componentWillUnmount(){
        this.focuSub && this.focuSub.remove();
    }

    _onSelect(index){
        this.setState({
            sort:index,
        },() => {
            this._onHeaderRefresh();
        });
    }

    _onHeaderRefresh() {
        const {actions} = this.props;
        const {sort} = this.state;
        
        this.citems = [];
		this.page = 1;
        this.pages = 1;
        
        if (this.ctype == 3) {
            actions.course.comment(this.content_id, sort, this.page);
        } else if (this.ctype == 11) {
            actions.article.comment(this.content_id, sort, this.page);
        } else {
            actions.site.pComment(this.content_id, this.ctype, sort,this.page);
        }

		this.setState({refreshState: RefreshState.HeaderRefreshing});
    }

    _onFooterRefresh() {
		const {actions} = this.props;
        const {sort} = this.state;

		if (this.page < (this.pages - 1)) {
            this.page++;
			this.setState({refreshState: RefreshState.FooterRefreshing});

			if (this.ctype == 3) {
                actions.course.comment(this.content_id, sort, this.page);
            } else if (this.ctype == 11) {
                actions.article.comment(this.content_id, sort, this.page);
            } else {
                actions.site.pComment(this.content_id, this.ctype, sort,this.page);
            }
		}
		else
		{
			this.setState({refreshState: RefreshState.NoMoreData});
		}
    }
    
    _onPraise(index){
        const {navigation, actions, user} = this.props;

        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            let comment = this.citems[index];

            if (comment.like) {
                comment.like = false;
                comment.praise--;

                actions.user.removelike({
                    commentId: comment.commentId,
                    resolved: (data) => {

                    },
                    rejected: (msg) => {

                    }
                })

            } else {
                comment.like = true;
                comment.praise++;

                actions.user.pulishlike({
                    commentId: comment.commentId,
                    resolved: (data) => {

                    },
                    rejected: (msg) => {

                    }
                })
            }

            this.citems[index] = comment;

            this.setState({
                index: index
            })
        }
    }

    _onPreview(galleryList, index){

        let images = [];
        galleryList.map((gallery, i) => {
            images.push({
				url: gallery.fpath,
			});
        });

        this.setState({
            preview: true,
            preview_index: index,
            preview_imgs: images,
        });
    }

    _onAction(action, args) {

        const {navigation, user} = this.props;
        if (_.isEmpty(user)) {
            navigation.navigate('PassPort');
        } else {
            if(action == 'Report'){
                let comment = this.citems[args.index];
                navigation.navigate('Report',{commentTxt:comment.content,commentName:comment.username,courseName:this.courseName})
            } else if(action == 'onUserInfo'){
                let comment = this.citems[args.index];
                navigation.navigate('UserPersonal',{commentTxt:comment.content,commentName:comment.username,courseName:this.courseName,avatar:comment.avatar,pubTimeFt:comment.pubTimeFt,userId:comment.userId})
            } else if(action == 'onComment'){
                let comment = this.citems[args.index];
                navigation.navigate('PersonalComment',{commentTxt:comment.content,commentName:comment.username,courseName:this.courseName,avatar:comment.avatar,pubTimeFt:comment.pubTimeFt,userId:comment.userId})
            }
        } 
        

    }

    _renderItem(item){
        const comment = item.item;
        const index  = item.index;

        let lastIdx = this.citems.length - 1 !== index 

        return (
            <CommentCell index={index} lastIdx={lastIdx}  comment={comment} 
                onUserInfo={(index) => this._onAction('onUserInfo',{index,index})} 
                onComment={(index) => this._onAction('onComment',{index,index})}
                onReport={(index) => this._onAction('Report', {index:index})} 
                onPraise={(index) => this._onPraise(index)} onPreview={(galleryList, index) => {
                    let images = [];
                    galleryList.map((gallery, i) => {
                        images.push({
                            url: gallery.fpath,
                        });
                    });
        
                    this.setState({
                        preview: true,
                        preview_index: index,
                        preview_imgs: images,
                    });
                
                }}
            />
        );
    }

    render() {
        const {sort, preview, preview_imgs, preview_index} = this.state;

        return (
            <View style={[styles.container, styles.bg_white]}>
                <View style={[styles.atabs, styles.border_bt]}>
                    <Tabs items={['最新', '最热']}  selected={sort} onSelect={this._onSelect} />
                </View>
                <RefreshListView
                    showsVerticalScrollIndicator={false}
                    data={this.citems}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                />
                
                <Modal visible={preview} transparent={true} onRequestClose={() => {}}>
                    <ImageViewer imageUrls={preview_imgs} index={preview_index} onClick={() => {
						this.setState({
							preview: false,
						});
					}}/>
                </Modal>
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    ...theme.base,
});

export const LayoutComponent = Comment;

export function mapStateToProps(state) {
	return {
        user: state.user.user,
        course_comment: state.course.comment,
        article_comment: state.article.comment,
        pComment:state.site.pComment,
	};
}

