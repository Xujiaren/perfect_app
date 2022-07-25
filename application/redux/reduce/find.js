import createReducer from '../../util/reduce';

const {
    ACTIVITY_CHANNEL,
    PROJECT_CHANNEL
} = require('../key').default;

const initialState = {
    activity:{},
    project:{},
};

const actionHandler = {

    [ACTIVITY_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			activity: {
				...payload,
			},
		};
    },
    [PROJECT_CHANNEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			project: {
				...payload,
			},
		};
	},
};

export default createReducer(initialState, actionHandler);
