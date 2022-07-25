import {createAction} from 'redux-actions';

const {
	ACTIVITY, 
	ACTIVITY_PAPER,
	ACTIVITY_ANSWER,
	ACTIVITY_JOIN,
	ACTIVITY_JOIN_INFO,
	ACTIVITY_VOTE_PUBLISH,
	ACTIVITY_VOTE,

	ACTIVITYFLOP, 
	LOTTERYREWORD, 
	LOTTERYRECEIVE,
	ACTIVITYLOTTERY,
	LOTTERYINFO,
} = require('../key').default;

import * as activityService from '../service/activity';

export const activity = createAction(ACTIVITY, async(activity_id) => {
	const data = await activityService.activity(activity_id);
	return data;
});

export const activityPaper = createAction(ACTIVITY_PAPER, async(activity_id) => {
	const data = await activityService.activityPaper(activity_id);
	return data;
});

export const activityAnswer = createAction(ACTIVITY_ANSWER, activityService.activityAnswer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const activityJoin = createAction(ACTIVITY_JOIN, activityService.activityJoin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const joinInfo = createAction(ACTIVITY_JOIN_INFO, async(activity_id,keyword,page) => {
	const data = await activityService.joinInfo(activity_id,keyword,page);
	return data;
});


export const activityPublishVote = createAction(ACTIVITY_VOTE_PUBLISH, activityService.activityVote, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const activityVote = createAction(ACTIVITY_VOTE, async(activity_id) => {
	const data = await activityService.activityVotes(activity_id);
	return data;
});

export const activityflop = createAction(ACTIVITYFLOP, async() => {
	const data = await activityService.activityflop();
	return data;
});

export const lotteryreword = createAction(LOTTERYREWORD, async(page) => {
	const data = await activityService.lotteryreword(page);
	return data;
});

export const lotteryReceive = createAction(LOTTERYRECEIVE, activityService.lotteryReceive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const activityLottery = createAction(ACTIVITYLOTTERY, activityService.activityLottery, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const lotteryInfo = createAction(LOTTERYINFO, activityService.lotteryInfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});