import {createAction} from 'redux-actions';

const {
	ARTICLE, 
	ARTICLE_CHANNEL, 
	ARTICLE_RECOMM,
	ARTICLE_RELATION,
	ARTICLE_COMMENT,
	ARTICLE_LIKE,
	ARTICLE_LIKE_REMOVE,
	ARTICLE_COMMENT_RECOMM,
	ARTICLE_SQUAD,
	ARTICLE_VOTE
} = require('../key').default;

import * as articleService from '../service/article';

export const channel = createAction(ARTICLE_CHANNEL, async(category_id, keyword, page) => {
	const data = await articleService.channel(category_id, keyword, page);
	return data;
});

export const recomm = createAction(ARTICLE_RECOMM, async() => {
	const data = await articleService.recomm();
	return data;
});

export const relation = createAction(ARTICLE_RELATION, async(article_id) => {
	const data = await articleService.relation(article_id);
	return data;
});

export const article = createAction(ARTICLE, async(article_id) => {
	const data = await articleService.article(article_id);
	return data;
});

export const comment = createAction(ARTICLE_COMMENT, async(article_id, sort, page) => {
	const data = await articleService.comment(article_id, sort, page);
	return data;
});

export const acommentTop = createAction(ARTICLE_COMMENT_RECOMM, async(article_id) => {
	const data = await articleService.acommentTop(article_id);
	return data;
});

export const like = createAction(ARTICLE_LIKE, articleService.like, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removelike = createAction(ARTICLE_LIKE_REMOVE, articleService.removelike, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const articleSquad = createAction(ARTICLE_SQUAD, async(page) => {
	const data = await articleService.articleSquad(page);
	return data;
});


export const articleVote = createAction(ARTICLE_VOTE, articleService.articleVote, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});