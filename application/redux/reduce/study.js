import createReducer from '../../util/reduce';

const {
	RANK_INTEGRAL, 
	RANK_MONTH, 
	RANK_TOTAL, 
	STUDY,
	STUDY_COURSE,
	STUDY_MAP, 
	STUDY_MAP_JUDGE, 
	STUDY_REGION, 
	STUDY_RANK,
	CHECKO_TWO,
	COURSE_MAP_DARY,
	TEST_SCORE,
} = require('../key').default;

const initialState = {
    rankintegral: [],
    rankmonth:[],
	ranktotal:[],
	learncourse:{},
	study:{},
	studyMap:[],
	studyRegion:[],
	studyMaps:[],
};


const actionHandler = {

    [RANK_INTEGRAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rankintegral: payload
		};
	},

    [RANK_MONTH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			rankmonth: payload
		};
    },

    [RANK_TOTAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			ranktotal: payload
		};
    },

	[STUDY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			study: error ? {} : payload,
		};
	},

	[STUDY_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			learncourse: error ? {} : payload,
		};
	},

	[STUDY_MAP_JUDGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
	},

	
	[STUDY_MAP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			studyMap: payload
		};
	},

	[STUDY_REGION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			studyRegion: payload
		};
	},

	[STUDY_RANK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			studyRank: payload
		};
	},

	[CHECKO_TWO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
	},

	[COURSE_MAP_DARY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			studyMaps: payload
		};
	},

	[TEST_SCORE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state
		};
	},
};

export default createReducer(initialState, actionHandler);
