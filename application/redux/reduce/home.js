import createReducer from '../../util/reduce';

const {
 
	SEARCH, 	
	SEARCH_COURSE,  
	COURSE_COMMENT_PUBLISH,
	COMMENT_PUBLISH,
	SITE_MENU,
	SITE_INDEX
	
} = require('../key').default;

const initialState = {
	sitechannel:[],
	indexcourse:{},
	search:{},
	searchcourse:{},
	sitemenu:{},
	siteindex:[],
};

const actionHandler = {
	[SEARCH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			search: {
				...payload,
			},
		};
	},

	[SEARCH_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			searchcourse: {
				...payload,
			},
		};
	},

	[COURSE_COMMENT_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[COMMENT_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[SITE_MENU]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			sitemenu: {
				...payload,
			},
		};
	},

	[SITE_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			siteindex: payload,
		};
	},
};

export default createReducer(initialState, actionHandler);
