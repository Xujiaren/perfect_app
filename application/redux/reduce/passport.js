import createReducer from '../../util/reduce';

const {
	VCODE, 
	LOGIN, 
	LOGIN_APPLE, 
	TOKEN, 
	LOGOUT, 
	PWD_RESET,
	CODE_VALID, 
	LOGIN_WECHAT, 
	LOGIN_WECHATR, 
	LOGING_WECHATR,
	MOBILE_BIND, 
	APPLE_MOBILE_BIND
} = require('../key').default;

const initialState = {

};

const actionHandler = {
	[VCODE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[CODE_VALID]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[LOGIN]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[LOGIN_APPLE]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[APPLE_MOBILE_BIND]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[PWD_RESET]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[TOKEN]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[LOGOUT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LOGIN_WECHAT]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LOGIN_WECHATR]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LOGING_WECHATR]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[MOBILE_BIND]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

};


export default createReducer(initialState, actionHandler);