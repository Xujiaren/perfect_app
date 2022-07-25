import createReducer from '../../util/reduce';

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

const initialState = {
	category: [],
	channel: {},
    similar: [],
    follower: [],
    comment: {},
    reply: {},
    userAnswer: {},
    userAsk: {},
    user: {},
    ask: {},
};

const actionHandler = {

	[ASK_CATEGORY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            category: payload,
		};
	},
    [ASK_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            channel: {
				...payload,
			},
		};
	},
    [ASK_SIMILAR]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            similar: payload,
		};
	},
    [ASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            ask: {
                ...payload,
            }
		};
	},
    [ASK_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ASK_INVITE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [ASK_REPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            reply: {
                ...payload,
            }
		};
	},
    [ASK_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [ASK_ACTION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [ASK_CONFIRM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [ASK_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            comment: {
                ...payload,
            }
		};
	},
    [ASK_FOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            follower: payload,
		};
	},
    [ASK_USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            user: {
                ...payload,
            }
		};
	},
    [ASK_USER_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            userAsk: {
                ...payload,
            }
		};
	},
    [ASK_USER_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
            userAnswer: {
                ...payload,
            }
		};
	},
}

export default createReducer(initialState, actionHandler);