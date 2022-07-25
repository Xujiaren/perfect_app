import * as request from '../../util/net';

export function channel(sort, page) {
	return request.get('/teacher', {
		sort:sort,
		page:page,
	});
}

export function leaderArticle(teacher_id, page) {
	return request.get('/article/teacher/' + teacher_id, {
		page:page,
	});
}

export function leader() {
	return request.get('/teacher/leader', {
	});
}

export function recomm() {
	return request.get('/teacher/recomm', {
	});
}

export function teacher(teacher_id) {
	return request.get('/teacher/' + teacher_id,{
	});
}

export function removefollow({teacherId}) {
	return request.post('/user/follow/teacher/remove/' + teacherId, {
	});
}

export function follow({teacherId}) {
	return request.post('/user/follow/teacher/' + teacherId, {
	});
}


export function teacherApply({apply_id,sn,name,age,sex,province,edu,mobile,serviceCenter,category_ids,strong,train_exp,self_exp,train_cert,photo}) {
	return request.post('/user/teacher/apply' ,{
		apply_id:apply_id,
		sn:sn,
		name:name,
		age:age,
		sex:sex,
		province:province,
		edu:edu,
		mobile:mobile,
		serviceCenter:serviceCenter,
		category_ids:category_ids,
		strong:strong,
		train_exp:train_exp,
		self_exp:self_exp,
		train_cert:train_cert,
		photo:photo,
	});
}

 
export function teacherStatus() {
	return request.get('/user/teacher/applyInfo', {
	});
}

export function teacherCourse(teacher_id) {
	return request.get('/teacher/' +  teacher_id  + '/course' , {
		
	});
}

