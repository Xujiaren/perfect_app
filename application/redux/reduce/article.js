import createReducer from '../../util/reduce';

const {
	ARTICLE, 
	ARTICLE_CHANNEL, 
	ARTICLE_RECOMM,
	ARTICLE_RELATION,
	ARTICLE_COMMENT,
	ARTICLE_LIKE,
	ARTICLE_LIKE_REMOVE,
	ARTICLE_COMMENT_RECOMM,
	ARTICLE_SQUAD,
	ARTICLE_VOTE,
} = require('../key').default;

const initialState = {
	channel: {},
	recomm: [],
	relation: [],
	article: {},
	comment: {},
	acommentTop:{},
	articleSquad:{},
};

const actionHandler = {
	[ARTICLE_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			channel: {
				...payload
			},
		};
	},
	[ARTICLE_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			recomm: payload,
		};
	},
	[ARTICLE_RELATION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			relation: payload,
		};
	},
	[ARTICLE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			article: {
				...payload
			},
		};
	},
	[ARTICLE_COMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			comment: {
				...payload
			},
		};
	},

	[ARTICLE_COMMENT_RECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			acommentTop: {
				...payload
			},
		};
	},


	[ARTICLE_LIKE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[ARTICLE_LIKE_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ARTICLE_SQUAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			articleSquad: {
				...payload
			},
		};
	},

	[ARTICLE_VOTE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	

};

export default createReducer(initialState, actionHandler);