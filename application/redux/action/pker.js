import {createAction} from 'redux-actions';

const {PKER_ACCOUNT, PKER_CATEGORY, PKER_CONFIG, PKER_LEVEL, PKER_RANK,  PKER_MATCH, PKER_MATCH_AWARD, PKER_MATCH_RANK, PKER_MATCH_LIFE, PKER_TOPIC, PKER_TOPIC_PUBLISH, PKER_USER_TOPIC} = require('../key').default;

import * as pkerService from '../service/pker';

export const account = createAction(PKER_ACCOUNT, async() => {
	const data = await pkerService.account();
	return data;
});

export const category = createAction(PKER_CATEGORY, async() => {
	const data = await pkerService.category();
	return data;
});

export const config = createAction(PKER_CONFIG, async() => {
	const data = await pkerService.config();
	return data;
});

export const level = createAction(PKER_LEVEL, async() => {
	const data = await pkerService.level();
	return data;
});

export const rank = createAction(PKER_RANK, async(v) => {
	const data = await pkerService.rank(v);
	return data;
});

export const match = createAction(PKER_MATCH, async() => {
	const data = await pkerService.match();
	return data;
});

export const matchaward = createAction(PKER_MATCH_AWARD, async(match_id) => {
	const data = await pkerService.matchaward(match_id);
	return data;
});

export const matchrank = createAction(PKER_MATCH_RANK, async(match_id) => {
	const data = await pkerService.matchrank(match_id);
	return data;
});

export const matchlife = createAction(PKER_MATCH_LIFE, pkerService.matchlife, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const topic = createAction(PKER_TOPIC, async(pker_id) => {
	const data = await pkerService.topic(pker_id);
	return data;
});

export const pushtopic = createAction(PKER_TOPIC_PUBLISH, pkerService.pushtopic, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const usertopic = createAction(PKER_USER_TOPIC, async(status, page) => {
	const data = await pkerService.usertopic(status, page);
	return data;
});