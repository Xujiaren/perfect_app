import {createAction} from 'redux-actions';

const {
	ASK_CATEGORY,
	ASK_CHANNEL,
    ASK_SIMILAR,
    ASK,
    ASK_PUBLISH,
    ASK_INVITE,
    ASK_REPLY,
    ASK_ANSWER,
    ASK_ACTION,
    ASK_CONFIRM,
    ASK_COMMENT,

    ASK_FOLLOW,
    ASK_USER,
    ASK_USER_PUBLISH,
    ASK_USER_ANSWER,
} = require('../key').default;

import * as askService from '../service/ask';

export const category = createAction(ASK_CATEGORY, async() => {
	const data = await askService.category();
	return data;
});

export const channel = createAction(ASK_CHANNEL, async(category_id, keyword, page, sort) => {
	const data = await askService.channel(category_id, keyword, page, sort);
	return data;
});

export const ask = createAction(ASK, async(ask_id) => {
	const data = await askService.ask(ask_id);
	return data;
});

export const invite = createAction(ASK_INVITE, askService.invite, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const publish = createAction(ASK_PUBLISH, askService.publish, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const follower = createAction(ASK_FOLLOW, async(ask_id) => {
	const data = await askService.follower(ask_id);
	return data;
});

export const comment = createAction(ASK_COMMENT, async(ask_id, page, sort, isTop) => {
	const data = await askService.comment(ask_id, page, sort, isTop);
	return data;
});

export const confirm = createAction(ASK_CONFIRM, askService.confirm, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const action = createAction(ASK_ACTION, askService.action, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const reply = createAction(ASK_REPLY, async(ask_id, suid, page, sort,pageSize) => {
	const data = await askService.reply(ask_id, suid, page, sort,pageSize);
	return data;
});

export const answer = createAction(ASK_ANSWER, askService.answer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const similar = createAction(ASK_SIMILAR, async(keyword) => {
	const data = await askService.similar(keyword);
	return data;
});

export const userAnswer = createAction(ASK_USER_ANSWER, async(page) => {
	const data = await askService.userAnswer(page);
	return data;
});

export const userAsk = createAction(ASK_USER_PUBLISH, async(page) => {
	const data = await askService.userAsk(page);
	return data;
});

export const user = createAction(ASK_USER, async(page) => {
	const data = await askService.user(page);
	return data;
});

export const inaction = createAction('inaction', askService.inaction, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});