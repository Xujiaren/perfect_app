import * as request from '../../util/net';

export function account(){
	return request.get('/pker/account' ,{
        
	});
}

export function category(){
	return request.get('/pker/category' ,{
        
	});
}

export function config(){
	return request.get('/pker/config' ,{
        
	});
}

export function level(){
	return request.get('/pker/level' ,{
        
	});
}

export function rank(v){
	return request.get('/pker/rank' ,{
        v: v
	});
}

export function match(){
	return request.get('/pker/match' ,{
        
	});
}

export function matchaward(match_id){
	return request.get('/pker/match/award/' + match_id ,{
        
	});
}

export function matchrank(match_id){
	return request.get('/pker/match/rank/' + match_id ,{
        
	});
}

export function matchlife({num}) {
    return request.post('/pker/match/life/exchange', {
		num: num,
	});
}

export function topic(pker_id){
	return request.get('/pker/topic/' + pker_id ,{
        
	});
}

export function usertopic(status, page){
	return request.get('/pker/topic' ,{
        status: status,
        page: page,
	});
}

export function pushtopic({category_id, title, answer, aindex}) {
    return request.post('/pker/topic', {
		category_id: category_id,
		title: title,
		answer: answer,
		aindex: aindex,
	});
}