import * as request from '../../util/net';

export function msgread() {
	return request.get('/user/message/unread',{
	});
}

export function usermessage(page) {
	return request.get('/user/message',{
		page:page,
	});
}

export function userremind(page) {
	return request.get('/user/remind',{
		page:page,
	});
}

export function usermsgcourse(page) {
	return request.get('/user/remind/course',{
		page:page,
	});
}

export function msgadmin() {
	return request.get('/user/remind/admin',{
	});
}

export function messageread({type,message_id}) {
	return request.post('/user/message/read',{
		type:type,
		message_id:message_id,
	});
}

export function msgChat(chat_id,page){
	return request.get('/user/remind/' + chat_id,{
		page:page
	});
}

export function msgOperate({type,message_ids,operate}) {
	return request.post('/user/message/operate',{
		type:type,
		message_ids:message_ids,
		operate:operate
	});
}