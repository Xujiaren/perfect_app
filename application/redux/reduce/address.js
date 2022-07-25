import createReducer from '../../util/reduce';

const {
	ADDRESS, 
	ADDRESS_DONE,
	ADDRESS_FIRST,
	ADDRESS_REMOVE,
	ADDRESS_INFO,
} = require('../key').default;


const initialState = {
	address:[],
	addressDesc:{},
};



const actionHandler = {

    [ADDRESS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			address:payload,
		};
	},

	[ADDRESS_DONE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ADDRESS_FIRST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ADDRESS_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ADDRESS_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			addressDesc:{
				...payload,
			},
		};
	},

}

export default createReducer(initialState, actionHandler);
