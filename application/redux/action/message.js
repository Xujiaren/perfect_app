import {createAction} from 'redux-actions';

const {	
	MSG, 
	REMIND, 
	MSG_UNREAD, 
	REMIND_COURSE,
	REMIND_ADMIN,
	MSG_READ, 
	MSG_OPERATE,
	MSG_CHAT,
} = require('../key').default;

import * as messageService from '../service/message';

export const msgread = createAction(MSG_UNREAD, async() => {
	const data = await messageService.msgread();
	return data;
});

export const msgChat = createAction(MSG_CHAT, async(chat_id,page) => {
	const data = await messageService.msgChat(chat_id,page);
	return data;
});

export const usermessage = createAction(MSG, async(page) => {
	const data = await messageService.usermessage(page);
	return data;
});

export const userremind = createAction(REMIND, async(page) => {
	const data = await messageService.userremind(page);
	return data;
});

export const usermsgcourse = createAction(REMIND_COURSE, async(page) => {
	const data = await messageService.usermsgcourse(page);
	return data;
});

export const msgadmin = createAction(REMIND_ADMIN, async() => {
	const data = await messageService.msgadmin();
	return data;
});

export const messageread = createAction(MSG_READ, messageService.messageread, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const msgOperate = createAction(MSG_OPERATE, messageService.msgOperate, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});