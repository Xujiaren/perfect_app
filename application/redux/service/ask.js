import * as request from '../../util/net';

export function category() {
	return request.get('/config/category/ask', {
		
	})
}

export function channel(category_id, keyword, page, sort) {
	return request.get('/ask', {
		category_id: category_id,
		keyword: keyword,
		page: page,
        sort: sort,
	});
}

export function ask(ask_id) {
	return request.get('/ask/' + ask_id, {
	});
}

export function invite({ask_id, target_uid,ctype}) {
	return request.post('/ask/answerInvite', {
		ask_id: ask_id,
        target_uid: target_uid,
		ctype:ctype
	});
}

export function publish({ask_id, category_id, title, content, integral, pics, videos, is_delete}) {
	return request.post('/ask/ask/publish', {
        ask_id: ask_id,
        category_id: category_id,

		title: title,
        content: content,
        integral: integral,
        pics: pics,
        videos: videos,
        is_delete: is_delete,
	});
}

export function follower(ask_id) {
	return request.get('/ask/askfollows', {
		ask_id: ask_id,
	});
}

export function comment(ask_id, page, sort, isTop) {
	return request.get('/ask/comments/' + ask_id, {
		page: page,
        sort: sort,
        isTop: isTop,
	});
}

export function confirm({reply_id}) {
	return request.post('/ask/confirm/reply', {
		reply_id: reply_id,
	});
}

export function action({content_id, ctype, etype}) {
	return request.post('/ask/post/' + content_id, {
		ctype: ctype,
        etype: etype,
	});
}

export function reply(ask_id, suid, page, sort,pageSize) {
	return request.get('/ask/reply/' + ask_id, {
        suid: suid,
		page: page,
        sort: sort,
		pageSize:pageSize
	});
}

export function answer({ask_id, fuser_id, content, pics}) {
	return request.post('/ask/reply/' + ask_id, {
        ask_id: ask_id,
        fuser_id: fuser_id,
        content: content,
        pics: pics,
	});
}

export function similar(keyword) {
	return request.get('/ask/similar', {
        keyword: keyword,
	});
}

export function userAnswer(page) {
	return request.get('/ask/user/answer', {
        page: page,
	});
}

export function userAsk(page) {
	return request.get('/ask/user/ask', {
        page: page,
	});
}

export function user(user_id, page) {
	return request.get('/ask/user/' + user_id, {
        page: page,
	});
}

export function inaction({content_id, ctype, etype}) {
	return request.post('/ask/post/cancel/' + content_id, {
		ctype: ctype,
        etype: etype,
	});
}