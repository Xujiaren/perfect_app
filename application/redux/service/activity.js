import * as request from '../../util/net';

export function activity(activity_id) {
	return request.get('/activity/' + activity_id, {
	});
}

export function activityPaper(activity_id) {
	return request.get('/activity/' + activity_id + '/paper', {
	});
}

export function activityAnswer({activity_id,answer}) {
	return request.post('/activity/' + activity_id + '/answer', {
		answer:answer
	});
}


export function activityJoin({activity_id,user_name,mobile,work_name,work_intro,work_url}) {
	return request.post('/activity/join/' + activity_id , {
		user_name:user_name,
		mobile:mobile,
		work_name:work_name,
		work_intro:work_intro,
		work_url:work_url
	});
}

export function joinInfo(activity_id,keyword,page) {
	return request.get('/activity/joininfo/' + activity_id, {
		keyword:keyword,
		page:page
	});
}

export function activityVotes(activity_id) {
	return request.get('/activity/vote/' + activity_id, {
	});
}

export function activityVote({join_id,number}) {
	return request.post('/activity/vote/' + join_id, {
		number:number
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

export function lotteryInfo({activity_id,ctype,content_id}){
	return request.get('/activity/lottery/info/get',{
		activity_id:activity_id,
		ctype:ctype,
		content_id:content_id
	});
}