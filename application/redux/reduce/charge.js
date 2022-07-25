import createReducer from '../../util/reduce';

const {
	CHARGE, 
    CHARGE_PAY,
} = require('../key').default;


const initialState = {
	charge:[],
};

const actionHandler = {

    [CHARGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			charge: payload,
		};
	},
    [CHARGE_PAY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
}



export default createReducer(initialState, actionHandler);
