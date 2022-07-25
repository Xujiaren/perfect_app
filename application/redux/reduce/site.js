import createReducer from '../../util/reduce';

const {
	CHANNEL,
	TIP, 
	GIFT,
	THEME, 
	CONFIG,
	AD,
	ADS,
	AD_POPUP,
	AD_USER,
	AD_MALL,
	UPLOAD,
	OSS,
	PCOMMENT,
	PCOMMENTTOP,
	SITE_ABOUT,
} = require('../key').default;

const initialState = {
	gift: [],
	advert:[],
	adpopup:[],
	aduser:[],
	admail:[],
	config:{},
	channel: [],
	pComment:{},
	pCommentTop:{},
};

const actionHandler = {
	[TIP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[GIFT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			gift: payload,
		};
	},
	
	[THEME]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[CONFIG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			config: {
				...payload,
			},
		};
	},
	
	[AD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			advert: payload,
		};
	},

	[AD_POPUP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			adpopup: payload,
		};
	},
	
	
	[AD_USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			aduser: payload,
		};
	},

	[AD_MALL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			admail: payload,
		};
	},
	

	[UPLOAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			channel: payload,
		};
	},

	[OSS]: (state, action) => {
		const { payload, error, meta = {} } = action;

		return {
			...state,
		};
	},

	[PCOMMENT]: (state, action) => {
		const { payload, error, meta = {} } = action;

		return {
			...state,
			pComment: {
				...payload,
			}
		};
	},

	[PCOMMENTTOP]: (state, action) => {
		const { payload, error, meta = {} } = action;

		return {
			...state,
			pCommentTop: {
				...payload,
			}
		};
	},

	[SITE_ABOUT]:(state, action) => {
		const { payload, error, meta = {} } = action;

		return {
			...state,

		};
	},

	[ADS]:(state, action) => {
		const { payload, error, meta = {} } = action;

		return {
			...state,

		};
	},

};


export default createReducer(initialState, actionHandler);
