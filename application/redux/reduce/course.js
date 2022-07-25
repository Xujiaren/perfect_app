import createReducer from '../../util/reduce';

const {
	COURSE_CHANNEL, 
	LIVE, 
	LIVE_REPLAY,
	COURSE_CATEGORY, 
	COURSE_RECOMM, 
	COURSE,
	COURSES, 
	COURSE_INFO, 
	COURSE_COMMENT,
	COURSE_GOODS,
	COURSE_REWARD,
	COURSE_COLLECT,
    COURSE_COLLECT_REMOVE,
	COURSE_COLLECTS_REMOVE,
	COLLECT_REMOVE,
	COURSE_BOOK,
	COURSE_VERIFY,
	COURSE_LEARN,
	COURSE_PAY,
	COURSE_COMMENT_RECOMM,
	COURSE_INFO_SCORE,
	COURSE_CAN_PLAY,
	STATUS_LEVEL,
	COURSE_SURVEY,
	FORLOTTERY,
	LIVEACTIVITYS,
} = require('../key').default;

const initialState = {
	channel:[],
	live:{},
	category: [],
	courserecom:[],
	goods: [],
	course: {},
	courses:{},
	info: {},
	comment: {},
	liveback:{},
	commentTop:{},
	infoScore:{},
	infoCanPlay:{},
	paperList:[],
};

const actionHandler = {
	[COURSE_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			channel: payload,
		};
	},
	[LIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			live: {
				...payload,
			},
		};
	},
	[LIVE_REPLAY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			liveback: {
				...payload,
			},
		};
	},
	[COURSE_CATEGORY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			category: payload,
		};
	},
	[COURSE_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			courserecom: payload,
		};
	},
	[COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			course: {
				...payload
			},
		};
	},
	[COURSES]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			courses: {
				...payload
			},
		};
	},
	[COURSE_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			info: {
				...payload,
			},
		};
	},

	[COURSE_INFO_SCORE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			infoScore: {
				...payload,
			},
		};
	},

	[COURSE_INFO_SCORE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			infoScore: {
				...payload,
			},
		};
	},

	
	[COURSE_CAN_PLAY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			infoCanPlay: {
				...payload,
			},
		};
	},


	[COURSE_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			comment: {
				...payload,
			},
		};
	},

	[COURSE_COMMENT_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			commentTop: {
				...payload,
			},
		};
	},

	[COURSE_GOODS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			goods: payload,
		};
	},
	[COURSE_REWARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_COLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_COLLECT_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_COLLECTS_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[COLLECT_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[COURSE_BOOK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_VERIFY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COURSE_LEARN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[COURSE_PAY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[STATUS_LEVEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[COURSE_SURVEY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			paperList:payload
		};
	},

	[FORLOTTERY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LIVEACTIVITYS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);