import createReducer from '../../util/reduce';

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

const initialState = {
	cond: [],
	travel: [],
	rite: [],
	exchange: [],
	live: {},
	liveback: {},
    task: [],
    paper: {},
    channel: {},
    pic: {},
	video: {},
    moment: {},
    wall: {},
    info: {},
    bg: {},
};

const actionHandler = {

	[MEET_COND]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			cond: payload,
		};
    },
	[MEET_TRAVEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			travel: payload,
		};
    },
	[MEET_RITE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rite: payload,
		};
    },
	[MEET_EXCHANGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			exchange: payload,
		};
    },
	[MEET_LIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			live: {
				...payload,
			},
		};
	},
	[MEET_LIVEBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			liveback: {
				...payload,
			},
		};
	},
	[MEET_PAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			paper: {
				...payload,
			},
		};
	},
    [MEET_TASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			task: payload,
		};
    },
    [MEET_PAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			paper: {
				...payload,
			},
		};
	},
    [MEET_MOMENT_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			channel: {
				...payload,
			},
		};
	},
    [MEET_MOMENT_PIC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			pic: {
				...payload,
			},
		};
	},
	[MEET_MOMENT_VIDEO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			video: {
				...payload,
			},
		};
	},
    [MEET_MOMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			moment: {
				...payload,
			},
		};
	},
    [MEET_WALL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			wall: {
				...payload,
			},
		};
	},
    [MEET_WALL_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			info: {
				...payload,
			},
		};
	},
    [MEET_WALL_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [MEET_WALL_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
    [MEET_WALL_BG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			bg: {
				...payload,
			},
		};
	},
    [MEET_WALL_UPLOADBG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[MEET_WALL_LIKE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
	[MEET_WALL_UNLIKE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
    },
};

export default createReducer(initialState, actionHandler);
