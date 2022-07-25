import {createAction} from 'redux-actions';

const {
	MEET_COND,
	MEET_TRAVEL,
	MEET_RITE,
	MEET_EXCHANGE,
	MEET_LIVE,
	MEET_LIVEBACK,
    MEET_TASK,
    MEET_PAPER,
    MEET_MOMENT_CHANNEL,
    MEET_MOMENT_PIC,
	MEET_MOMENT_VIDEO,
    MEET_MOMENT,
    MEET_WALL,
    MEET_WALL_INFO,
    MEET_WALL_PUBLISH,
    MEET_WALL_REMOVE,
    MEET_WALL_BG,
    MEET_WALL_UPLOADBG,
	MEET_WALL_LIKE,
	MEET_WALL_UNLIKE,
} = require('../key').default;

import * as meetService from '../service/meet';

export const cond = createAction(MEET_COND, async() => {
	const data = await meetService.cond();
	return data;
});

export const travel = createAction(MEET_TRAVEL, async() => {
	const data = await meetService.travel();
	return data;
});

export const rite = createAction(MEET_RITE, async() => {
	const data = await meetService.rite();
	return data;
});

export const exchange = createAction(MEET_EXCHANGE, async() => {
	const data = await meetService.exchange();
	return data;
});

export const live = createAction(MEET_LIVE, async(page) => {
	const data = await meetService.live(0, page, 51);
	return data;
});

export const liveback = createAction(MEET_LIVEBACK, async(page) => {
	const data = await meetService.live(1, page, 51);
	return data;
});

export const task = createAction(MEET_TASK, async(status) => {
	const data = await meetService.task(status);
	return data;
});

export const paper = createAction(MEET_PAPER, async(page) => {
	const data = await meetService.paper(page);
	return data;
});

export const channel = createAction(MEET_MOMENT_CHANNEL, async(page) => {
	const data = await meetService.moments(page);
	return data;
});

export const pic = createAction(MEET_MOMENT_PIC, async(article_id) => {
	const data = await meetService.more(article_id, 0);
	return data;
});

export const video = createAction(MEET_MOMENT_VIDEO, async(article_id) => {
	const data = await meetService.more(article_id, 1);
	return data;
});

export const moment = createAction(MEET_MOMENT, async(article_id) => {
	const data = await meetService.moment(article_id);
	return data;
});

export const wall = createAction(MEET_WALL, async(target_id, page) => {
	const data = await meetService.wall(target_id, page);
	return data;
});

export const info = createAction(MEET_WALL_INFO, async(mood_id) => {
	const data = await meetService.info(mood_id);
	return data;
});

export const publishWall = createAction(MEET_WALL_PUBLISH, meetService.publishWall, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removeWall = createAction(MEET_WALL_REMOVE, meetService.removeWall, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const bg = createAction(MEET_WALL_BG, async() => {
	const data = await meetService.bg();
	return data;
});

export const uploadBg = createAction(MEET_WALL_UPLOADBG, meetService.uploadBg, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const like = createAction(MEET_WALL_LIKE, meetService.like, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removeLike = createAction(MEET_WALL_UNLIKE, meetService.removeLike, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});