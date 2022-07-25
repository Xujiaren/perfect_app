import createReducer from '../../util/reduce';

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


const initialState = {
	activity:{},
	activityPaper:[],
	joinInfo:{},
	activityVotes:0,
	activityflop: {},
	lotteryreword: {},
};

const actionHandler = {

    [ACTIVITY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			activity: {
				...payload
			},
		};
	},

	[ACTIVITY_PAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			activityPaper: payload
		};
	},

	[ACTIVITY_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ACTIVITY_JOIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ACTIVITY_JOIN_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			joinInfo: {
				...payload
			},
		};
	},

	[ACTIVITY_VOTE_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ACTIVITY_VOTE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			activityVotes:payload
		};
	},

	[ACTIVITYFLOP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			activityflop: {
				...payload,
			},
		};
	},

	[LOTTERYREWORD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			lotteryreword: {
				...payload,
			},
		};
	},

	[LOTTERYRECEIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ACTIVITYLOTTERY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LOTTERYINFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
}

export default createReducer(initialState, actionHandler);
