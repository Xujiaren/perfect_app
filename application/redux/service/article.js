import * as request from '../../util/net';

export function channel(category_id, keyword, page) {
	return request.get('/article', {
		category_id: category_id,
		keyword: keyword,
		page: page,
	});
}

export function recomm() {
	return request.get('/article/recomm', {
	});
}

export function relation(article_id) {
	return request.get('/article/relation/' + article_id, {

	});
}

export function article(article_id) {
	return request.get('/article/' + article_id, {

	});
}

export function comment(article_id, sort, page) {
	return request.get('/article/comment/' + article_id, {
		sort: sort,
		page: page,
	});
}

export function acommentTop(article_id) {
	return request.get('/article/comment/' + article_id, {
		sort: 2,
		page: 0,
	});
}

export function like({article_id}) {
	return request.post('/user/like/article/' + article_id, {
		article_id: article_id,
	});
}

export function removelike({article_id}) {
	return request.post('/user/like/article/remove/' + article_id, {
		article_id: article_id,
	});
}

export function articleSquad(page) {
	return request.get('/article/squad', {
		page: page,
	});
}


export function articleVote({article_id,answer}) {
	return request.get('/article/vote/' + article_id, {
		answer: answer,
	});
}