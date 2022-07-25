import createReducer from '../../util/reduce';

const {PKER_ACCOUNT, PKER_CATEGORY, PKER_CONFIG, PKER_LEVEL, PKER_RANK,  PKER_MATCH, PKER_MATCH_AWARD, PKER_MATCH_RANK, PKER_MATCH_LIFE,PKER_TOPIC, PKER_TOPIC_PUBLISH, PKER_USER_TOPIC} = require('../key').default;

const initialState = {
    account: {},
    category: [],
    config: {},
    level: [],
    rank: [],
    match: [],
    award: [],
    matchrank: [],
    topic: [],
    usertopic: {},
};

const actionHandler = {
    [PKER_ACCOUNT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            account: {
				...payload
			},
		};
    },
    [PKER_CATEGORY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            category: payload,
		};
    },
    [PKER_CONFIG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            config: {
				...payload
			},
		};
    },
    [PKER_LEVEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            level: payload,
		};
    },
    [PKER_RANK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            rank: payload,
		};
    },
    [PKER_MATCH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            match: payload,
		};
    },
    [PKER_MATCH_AWARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            award: payload,
		};
    },
    [PKER_MATCH_RANK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            matchrank: payload,
		};
    },
    [PKER_MATCH_LIFE]: (state, action) => {
      const { payload, error, meta = {} } = action;
      return {
        ...state,
      };
    },
    [PKER_TOPIC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            topic: payload,
		};
    },
    [PKER_USER_TOPIC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            ...state,
            usertopic: {
                ...payload,
            },
		};
	},
	[PKER_TOPIC_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};


export default createReducer(initialState, actionHandler);