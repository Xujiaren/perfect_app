import * as request from '../../util/net';

export function o2o(stype,page) {
	return request.get('/o2o', {
        stype:stype,
        page:page
	});
}

export function o2oSkill(page) {
	return request.get('/o2o/user/in', {
        page:page
	});
}

export function o2oDetail(squad_id) {
	return request.get('/o2o/' + squad_id, {
	});
}

export function o2oSquad(stype,page) {
	return request.get('/user/squad', {
        stype:stype,
        page:page
	});
}

export function o2oVideo(squadId,type) {
	return request.get('/o2o/study/video/new', {
		squadId:squadId,
        type:type
	});
}

export function o2oTopic(categroy_id,test_id) {
	return request.get('/o2o/study/topic/' + categroy_id, {
        test_id:test_id
	});
}

export function o2oExamPaper(squadId) {
	return request.get('/o2o/study/exam/paper/new' , {
        squadId:squadId
	});
}


export function squadApply({squad_id,name,sn,realname,age,sex,identity_sn,is_primary,mobile,address,email,taste,meal,remark}) {
	return request.post('/user/squad/' + squad_id, {
		sn:sn,
		name:name,
		realname:realname,
		age:age,
		sex:sex,
		identity_sn:identity_sn,
		is_primary:is_primary,
		mobile:mobile,
		address:address,
		email:email,
		taste:taste,
		meal:meal,
		remark:remark
	});
}

export function squadCert({squad_id,name,sn,level,mobile,address,sex,edu,age,height,sell_sn,identity_imgs,edu_cert,ephoto}) {
	return request.post('/user/squad/cert/' + squad_id, {
		name:name,
		sn:sn,
		level:level,
		mobile:mobile,
		address:address,
		sex:sex,
		edu:edu,
		age:age,
		height:height,
		sell_sn:sell_sn,
		identity_imgs:identity_imgs,
		edu_cert:edu_cert,
		ephoto:ephoto
	});
}


export function configCateNewCert(squadId,ctype) {
	return request.get('/config/category/certification/new' , {
		squadId:squadId,
		ctype:ctype,
	});
}


export function studyStatus(squadId) {
	return request.get('/o2o/study/status/new' , {
		squadId:squadId,
	});
}


export function studyInfo(category_id) {
	return request.get('/o2o/study/info/' + category_id, {
	});
}



export function topicAnswer({test_id,answer,topic_id}){
	return request.post('/user/study/answer/' + test_id, {
		answer:answer,
		topic_id:topic_id
	})
}

export function testInfo(testId) {
	return request.get('/exam/test/info' , {
		testId:testId,
	});
}


export function userExam({test_id,levelId,duration,answer}){
	return request.post('/user/exam/' + test_id, {
		levelId:levelId,
		duration:duration,
		answer:answer
	})
}


export function privileges() {
	return request.get('/o2o/study/privileges' , {
	});
}


export function squadApplys({squad_id,stype,from_id}){
	return request.post('/user/squad/apply/' + squad_id, {
		stype:stype,
		from_id:from_id
	})
}