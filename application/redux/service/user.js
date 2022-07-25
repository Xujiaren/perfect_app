import * as request from '../../util/net';

export function pwd({pwd}) {
	return request.post('/user/pwd', {
		pwd:pwd,
	});
}

export function user() {
	return request.get('/user', {
	});
}

export function auser(toId) {
	return request.get('/user', {
		toId:toId
	});
}

export function userlevel(){
	return request.get('/user/level',{
	});
}

export function bindRegion({regionName}) {
	return request.post('/user/bind/userRegion', {
		regionName: regionName,
	});
}

export function reuserinfo({field,val}) {
	return request.post('/user', {
		field:field,
		val:val,
	});
}

export function userintegral(itype,page){
	return request.get('/user/integral',{
		itype:itype,
        page:page,
	});
}

export function userauth({sn,pwd}) {
	return request.post('/user/auth', {
		sn:sn,
		pwd:pwd,
	});
}

export function feedback(page){
	return request.get('/user/feedback',{
        page:page,
	});
}

export function pushfeedback({category_id,content,gallery,mobile,videos}) {
	return request.post('/user/feedback', {
		category_id:category_id,
		content:content,
		gallery:gallery,
		videos: videos,
		mobile:mobile,
	});
}

export function catefeedback(){
	return request.get('/config/category/feedback',{
	});
}

export function cateQuestion(){
	return request.get('/config/category/qa',{
	});
}

export function configHelp(category_id,keyword,page){
	return request.get('/config/help/',{
		category_id:category_id,
		keyword:keyword,
		page:page
	});
}

export function usercollect(cctype,page){
	return request.get('/user/collect/course',{
		cctype:cctype,
        page:page,
	});
}

export function userAcollect(ctype,page){
	return request.get('/user/collect',{
		ctype:ctype,
        page:page,
	});
}

export function removelike({commentId}) {
	return request.post('/user/like/comment/remove/' + commentId, {
	});
}

export function pulishlike({commentId}) {
	return request.post('/user/like/comment/' + commentId, {
	});
}

export function activityflop(){
	return request.get('/activity/flop/1',{
	});
}


export function lotteryreword(page){
	return request.get('/activity/lottery/reward',{
		page:page,
	});
}

export function lotteryReceive({reward_id,realname,address,mobile}) {
	return request.post('/activity/lottery/receive/' + reward_id, {
		realname:realname,
		address:address,
		mobile:mobile
	});
}


// 开始抽奖
export function activityLottery({ts,index}) {
	return request.post('/activity/lottery/' + 1, {
		ts:ts,
		index:index,
	});
}


export function usertask(){
	return request.get('/user/task',{
	});
}

export function invitestat(){
	return request.get('/user/invite/stat',{
	});
}

export function userinvite(page){
	return request.get('/user/invite',{
		page:page,
	});
}

export function invitecode(){
	return request.post('/user/invite',{
	});
}

export function inviteImgs(){
	return request.get('/site/inviteImgs',{
	});
}

export function usercard(page,stype){
	return request.get('/user/squad',{
		page:page,
		stype:stype
	});
}

export function userMedal(){
	return request.get('/user/medal',{
	});
}

export function signIn() {
	return request.post('/user/signin', {
	});
}

export function signIns() {
	return request.get('/user/signin', {
	});
}

export function userReward(itype,page){
	return request.get('/user/reward',{
		itype:itype,
		page:page
	});
}

export function userFollow(ctype,page){
	return request.get('/user/follow',{
		ctype:ctype,
		page:page
	});
}
export function userFollows(ask_id,ctype,page){
	return request.get('/user/follow',{
		ask_id:ask_id,
		ctype:ctype,
		page:page
	});
}
export function examPaper(paper_id,levelId){
	return request.get('/exam/' + paper_id,{
		levelId:levelId,
	});
}

export function removeFollow({teacher_id}) {
	return request.post('/user/follow/teacher/remove/' + teacher_id, {
	});
}



export function publishreward({gift_id,course_id}) {
	return request.post('/user/reward/' + gift_id, {
		course_id:course_id
	});
}


export function userLog({log_type,type,device_id,intro,content_id,param,from}) {
	return request.post('/user/log' ,{
		log_type:log_type,
		type:type,
		device_id:device_id,
		intro:intro,
		content_id:content_id,
		param:param,
		from:from
	});
}

export function teacherUpInfo(){
	return request.get('/teacher/upgrade/info',{
	})
};



export function acollect({content_id,ctype}) {
	return request.post('/user/collect/' + content_id, {
		ctype:ctype
	});
}

export function aremovecollect({content_id,ctype}) {
	return request.post('/user/collect/remove/' + content_id, {
		ctype:ctype
	});
}



export function auserfollow({content_id,ctype}) {
	return request.post('/user/follow/' + content_id, {
		ctype:ctype
	});
}

export function aremoveFollow({content_id,ctype}) {
	return request.post('/user/follow/remove/' + content_id, {
		ctype:ctype
	});
}


export function userBlack({toId,operation}) {
	return request.post('/user/black', {
		toId:toId,
		operation:operation
	});
}

export function black(page){
	return request.get('/user/black',{
		page:page
	})
};

export function usercourse(toId,status,page) {
	return request.get('/user/course', {
		toId:toId,
		status:status,
		page:page,
	});
}

export function userstudy(toId) {
	return request.get('/user/study', {
		toId:toId
	});
}

export function userCert(page){
	return request.get('/user/cert',{
		page:page
	})
};

export function userContent(ctype,page){
	return request.get('/user/content',{
		ctype:ctype,
		page:page
	})
};
export function userAgent(ctype,page){
	return request.get('/course/agent',{
		ctype:ctype,
		page:page
	})
};

export function userCoupon(status,page){
	return request.get('/user/coupon',{
		status:status,
		page:page
	})
};

export function userBills({year}){
	return request.get('/user/bill',{
		year:year
	})
};

export function userHistory({ctype,etype,cctype,content_id}) {
	return request.post('/user/save/share/user/history', {
		ctype: ctype,
		etype: etype,
		cctype: cctype,
		content_id: content_id
	});
};

export function getRegion({}){
	return request.get('/order/region',{
	})
};

export function bangdan({course_id}){
	return request.get('/course/reward/'+course_id,{
	})
};
export function leaveRoom({cctype,content_id,type}){
	return request.post('/user/save/user/leave',{
		cctype,content_id,type
	})
};
export function vantLive({course_id,times}){
	return request.post('/user/like/course/'+course_id,{
		times
	})
};
export function companyList(){
	return request.get('/user/company/list',{
	})
};
export function editMobile({code,mobile,type}){
	return request.post('/user/mobile/valid',{
		code:code,
		mobile:mobile,
		type:type
	})
};