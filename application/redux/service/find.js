import * as request from '../../util/net';

export function activity(keyword,page,pageSize){
	return request.get('/activity' ,{
        keyword:keyword,
        page:page,
		pageSize:pageSize
	});
}

export function project(page){
	return request.get('/article/special' ,{
		keyword: '',
        page:page,
	});
}