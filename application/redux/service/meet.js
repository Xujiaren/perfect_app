import * as request from '../../util/net';

export function cond() {
	return request.get('/site/channel/46', {
		sort: 0,
	});
}

export function travel() {
	return request.get('/site/channel/47', {
		sort: 0,
	});
}

export function rite() {
	return request.get('/site/channel/48', {
		sort: 0,
	});
}

export function exchange() {
	return request.get('/site/channel/50', {
		sort: 0,
	});
}

export function task(status) {
	return request.get('/meet/meetTask', {
        status: status,
	});
}

export function live(status, page, ctype) {
	return request.get('/course/live', {
        status: status,
		page: page,
		ctype: ctype,
	});
}

export function paper(page) {
	return request.get('/meet/paper', {
        page: page,
	});
}

export function moments(page) {
	return request.get('/meet/moments', {
        page: page,
	});
}

export function more(article_id, ftype) {
	return request.get('/meet/moments/PV/' + article_id, {
        ftype: ftype,
	});
}

export function moment(article_id) {
	return request.get('/meet/moments/' + article_id, {
	});
}

export function wall(target_id, page) {
	return request.get('/meet/mood', {
        target_id: target_id,
        page: page,
	});
}

export function info(mood_id) {
    return request.get('/meet/mood/info', {
        moodId: mood_id,
	});
}

export function publishWall({content, pics, videos}) {
    return request.post('/meet/mood', {
        content: content,
        pics: pics,
        videos: videos,
	});
}

export function removeWall(mood_id) {
    return request.post('/meet/mood/del/' + mood_id, {
	});
}

export function bg() {
    return request.get('/meet/mood/wall', {
	});
}

export function uploadBg({pics}) {
    return request.post('/meet/mood/wall', {
        pics: pics,
	});
}

export function like({mood_id}) {
    return request.post('/user/like/mood/' + mood_id, {
        
	});
}

export function removeLike({mood_id}) {
    return request.post('/user/like/mood/remove/' + mood_id, {
        
	});
}