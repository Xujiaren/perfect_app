import createReducer from '../../util/reduce';
const {
	TEACHER,
	TEACHER_CHANNEL, 
	LEADER_RECOMM, 
	TEACHER_RECOMM, 
	TEACHER_FOLLOW,
	TEACHER_FOLLOW_REMOVE,
	TEACHER_ARTICLE,
	TEACHER_APPLY,
	TEACHER_STATUS,
	TEACHER_COURSE
} = require('../key').default;

const initialState = {
	channel:{},
	leaderArticle:{},
	leader: [],
	tearcherrecomm:[],
	teacher: {},
	teacherStatus:{},
	teacherCourse:[],
};

const actionHandler = {
	[TEACHER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacher: {
				...payload,
			},
		};
	},
	[TEACHER_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			channel: {
				...payload,
			},
		};
	},

	
	[TEACHER_ARTICLE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			leaderArticle: {
				...payload,
			},
		};
	},


	[LEADER_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			leader: payload,
		};
	},
	[TEACHER_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			tearcherrecomm: payload,
		};
	},
	[TEACHER_FOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TEACHER_FOLLOW_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[TEACHER_APPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[TEACHER_STATUS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacherStatus: {
				...payload,
			},
		};
	},

	[TEACHER_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacherCourse: payload,
		};
	},

};

export default createReducer(initialState, actionHandler);