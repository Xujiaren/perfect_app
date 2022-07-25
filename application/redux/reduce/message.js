import createReducer from '../../util/reduce';

const {	
	MSG, 
	REMIND, 
	MSG_UNREAD, 
	REMIND_COURSE,
	REMIND_ADMIN,
	MSG_READ, 
	MSG_OPERATE,
	MSG_CHAT,
} = require('../key').default;

const initialState = {
	msgread:{},
	usermessage:{},
	userremind:{},
	msgadmin:[],
	usermsgcourse:{},
	msgChat:{},
};

const actionHandler = {
	[MSG_UNREAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			msgread: {
				...payload,
			},
		};
	},

	
	[MSG_CHAT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			msgChat: {
				...payload,
			},
		};
	},


	[MSG_OPERATE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},


	[MSG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			usermessage: {
				...payload,
			},
		};
	},

	[REMIND]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userremind: {
				...payload,
			},
		};
	},
	
	[REMIND_COURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			usermsgcourse: {
				...payload,
			},
		};
	},

	[REMIND_ADMIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			msgadmin: error ? [] : payload,
		};
	},

	[MSG_READ]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);
