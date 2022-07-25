import createReducer from '../../util/reduce';

const {
    DOWNLOAD_INDEX,
	DOWNLOAD, 
    DOWNLOAD_LIKE,
    DOWNLOAD_UNLIKE,
} = require('../key').default;


const initialState = {
	index:{},
};

const actionHandler = {

    [DOWNLOAD_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: {
                ...payload,
            },
		};
	},
    [DOWNLOAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [DOWNLOAD_LIKE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [DOWNLOAD_UNLIKE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
}



export default createReducer(initialState, actionHandler);
