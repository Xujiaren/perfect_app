import createReducer from '../../util/reduce';

const {
    EXAM_PAPER,
	EXAM_TEST, 
    EXAM_REVIEW,
    EXAM_ANSWER,
} = require('../key').default;


const initialState = {
	paper: {},
    test: {},
    review: {},
};

const actionHandler = {

    [EXAM_PAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			paper: {
                ...payload,
            },
		};
	},
    [EXAM_TEST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			test: {
                ...state,
            },
		};
	},
    [EXAM_REVIEW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
            review: {
                ...state,
            },
		};
	},
    [EXAM_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
}



export default createReducer(initialState, actionHandler);
