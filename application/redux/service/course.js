import * as request from '../../util/net';

export function channel(channel_id, sort) {
	return request.get('/site/channel/' + channel_id, {
		sort: sort
	});
}

export function category() {
	return request.get('/config/category/course',{
	});
}

export function live(ctype,status, page,region_id) {
	return request.get('/course/live', {
		ctype:ctype,
		status:status,
		page:page,
		region_id:region_id
	});
}

export function liveback(ctype,status,sort,page,region_id){
	return request.get('/course/live', {
		ctype:ctype,
		status:status,
		sort:sort,
		page:page,
		region_id:region_id
	});
}

export function recomm(limit) {
	return request.get('/course/recommend', {
		limit:limit,
	});
}

export function course(category_id, ccategory_id, ctype, sort, page,plant) {
	return request.get('/course', {
		category_id: category_id,
		ccategory_id: ccategory_id,
		ctype: ctype,
		sort: sort,
		page: page,
		plant:plant,
	})
}
export function courses(category_id, ccategory_id, ctype,sort,paytype, page,plant) {
	return request.get('/course', {
		category_id: category_id,
		ccategory_id: ccategory_id,
		ctype: ctype,
		sort: sort,
		paytype:paytype,
		page: page,
		plant:plant,
	})
}
export function info(course_id) {
	return request.get('/course/' + course_id, {
	});
}

export function infoScore(course_id) {
	return request.get('/course/' + course_id, {
	});
}

export function infoCanPlay(course_id) {
	return request.get('/course/' + course_id, {
	});
}

export function comment(course_id, sort, page) {
	return request.get('/course/comment/' + course_id, {
		sort: sort,
		page: page,
	});
}


export function commentTop(course_id) {
	return request.get('/course/comment/' + course_id, {
		sort: 2,
		page: 0,
	});
}


export function goods(course_id) {
	return request.get('/course/live/goods', {
		course_id: course_id,
	});
}

export function reward({gift_id, course_id}) {
	return request.post('/user/reward/' + gift_id,{
		course_id: course_id,
	});
}

export function collect({course_id}) {
	return request.post('/user/collect/course/' + course_id, {
	});
}

export function removecollect({course_id}) {
	return request.post('/user/collect/course/remove/' + course_id, {
	});
}

export function removecollects({course_ids}) {
	return request.post('/user/collect/course/remove/', {
		course_ids:course_ids,
	});
}

export function userColltRemove({ids,ctype}) {
	return request.post('/user/collect/remove/', {
		ids:ids,
		ctype:ctype
	});
}


export function book({course_id}) {
	return request.post('/user/book/' + course_id, {
		form_id: 'app'
	});
}

export function verify({media_id,definition}) {
	return request.post('/course/verify', {
		media_id: media_id,
		definition:definition,
	});
}

export function learn({course_id, chapter_id, cchapter_id, duration,levelId,course_name}) {
	return request.post('/user/learn/' + course_id, {
		chapter_id: chapter_id,
		cchapter_id: cchapter_id,
		duration: duration,
		levelId:levelId,
		course_name:course_name,
	});
}



export function payCourse({from_uid, pay_type, course_id, chapter_id,uc_id}) {
	return request.post('/order/course/submit', {
		from_uid: from_uid,
		pay_type: pay_type,
		course_id: course_id,
		chapter_id:chapter_id,
		uc_id:uc_id
	});
}

export function LevelStatus({levelId}) {
	return request.get('/course/map/level/status', {
		levelId:levelId
	});
}
export function learnGrap({course_id,levelId}) {
	return request.post('/user/learn/article/' + course_id, {
		levelId:levelId
	});
}
export function courseSurvey(course_id,stype) {
	return request.get('/course/' + course_id + '/paper', {
		stype:stype
	});
}
export function postSurvey({course_id,answer}) {
	return request.post('/course/' + course_id + '/answer', {
		answer:answer
	});
}
export function shareCourse({course_id}) {
	return request.post('/user/share/course/'+course_id, {
		
	});
}
export function forLottery({activity_id,index}) {
	return request.post('/activity/live/lottery/'+activity_id, {
		index:index
	});
}
export function liveActivitys({course_id,type}) {
	return request.get('/course/live/activity/'+course_id, {
		type:type
	});
}