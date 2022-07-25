import createReducer from '../../util/reduce';

const {
    FOREST_INIT,
    FOREST_INDEX,
    FOREST_CERT,
    FOREST_SHOP,
    FOREST_ORDER,
    FOREST_USER_ORDER,
    FOREST_PICK,
    FOREST_QA,
	FOREST_SEEDS,
    FOREST_SEED,
    FOREST_SHARE,
    FOREST_STEAL,
    FOREST_WATER,
    FOREST_CONNECT,
    FOREST_FRIEND
} = require('../key').default;

const initialState = {
    index:{},
    cert:[],
	seed:[],
    shop:[],
    order: {},
    qa: [],
    friend: {},
};

const actionHandler = {

    [FOREST_INIT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_INDEX]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			index: {
				...payload,
			},
		};
	},
    [FOREST_CERT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			cert: payload,
		};
	},
    [FOREST_SHOP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			shop: payload,
		};
	},
    [FOREST_ORDER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_USER_ORDER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			order: {
				...payload,
			},
		};
	},
    [FOREST_PICK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_QA]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			qa: payload,
		};
	},
	[FOREST_SEEDS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			seed: payload,
		};
	},
    [FOREST_SEED]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_SHARE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_STEAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_WATER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_CONNECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
    [FOREST_FRIEND]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			friend: {
				...payload,
			},
		};
	},
};

export default createReducer(initialState, actionHandler);
