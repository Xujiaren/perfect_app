import * as request from '../../util/net';

export function publishcommt({course_id,score,content,gallery,teacher_score}) {
	return request.post('/user/comment/course/' + course_id, {
		score:score,
		content:content,
		gallery:gallery,
		teacher_score:teacher_score,
	});
}


export function publishAllComment({content_id,score,content,gallery,teacher_score,ctype}) {
	return request.post('/user/comment/' + content_id, {
		score:score,
		content:content,
		gallery:gallery,
		teacher_score:teacher_score,
		ctype:ctype
	});
}


export function search(keyword) {
	return request.get('/site/search' ,{
		keyword:keyword,
	});
}

export function searchcourse(keyword,ctype,sort,page) {
	return request.get('/site/search/course' ,{
		keyword:keyword,
		ctype:ctype,
		sort:sort,
		page:page,
	});
}

export function sitemenu(type,mark,page) {
	return request.get('/site/index/menu',{
		type:type,
		mark:mark,
		page:page,
	});
}

export function siteindex() {
	return request.get('/site/index',{
	});
}
