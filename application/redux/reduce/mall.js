import createReducer from '../../util/reduce';

const {
    AD_MALL,
    SHOP_CATEGORY,
    SHOP_SEARCH,
	SHOP_SEARCHS,
	GOODS,
	GOODS_SUBMIT,
	ORDER,
	ORDER_DETAIL,
	ORDER_RETURN,
	ORDER_CONFIRM,
	ORDER_CANCEL,
	ORDER_SHIP,

	MALL_VIPENJOY,
	MALL_LECTENJECT,
	MALL_NEWRECOMM,
	MALL_LIMITGOODS,
	MALL_LIMITGOODSS,
	MALL_EXCHANGE,
	MALL_SELLTOP,
	MALL_CART_ADD,
	MALL_CART,
	MALL_CART_SETTLEMENT,
	MALL_CART_UPDATE,
	MALL_CART_CLEAR,
	MALL_CART_REMOVE,
	MALL_ORDER_TOPAY,
	MALL_ORDER_INVOICE,
	MALL_ORDER_SETSHOP,
	MALL_SHOP_AMOUNT,
	EMS_GET,

} = require('../key').default;

const initialState = {
    admail:[],
    shopCategory:[],
    shopSearch:{},
	shopSearchs:{},
	goods:{},
	order:{},
	orderDetail:{},
	sellTop:[],
	shopExchange:{},
	vipEnjoy:{},
	lectEnjoy:{},
	newRecomm:{},
	limitGoods:{},
	limitGoodss:{},
	mailCart:[],
	setShop:{},
	shipAmount:0,
	ems:[],
};

const actionHandler = {
	
	[AD_MALL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			admail: payload,
		};
    },
    
    [SHOP_CATEGORY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			shopCategory: payload,
		};
    },

    [SHOP_SEARCH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			shopSearch: {
				...payload,
			},
		};
    },

	[SHOP_SEARCHS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			shopSearchs: {
				...payload,
			},
		};
    },
    
    [GOODS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			goods: {
				...payload,
			},
		};
	},

	[GOODS_SUBMIT]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[ORDER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			order: {
				...payload,
			},
		};
	},

	
	[ORDER_DETAIL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			orderDetail: {
				...payload,
			},
		};
	},

	[ORDER_RETURN]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[ORDER_CONFIRM]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[ORDER_CANCEL]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[ORDER_SHIP]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_SELLTOP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			sellTop: payload
		};
	},

	[MALL_EXCHANGE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			shopExchange: {
				...payload,
			},
		};
	},

	[MALL_VIPENJOY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			vipEnjoy: {
				...payload,
			},
		};
	},

	[MALL_LECTENJECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			lectEnjoy: {
				...payload,
			},
		};
	},

	[MALL_NEWRECOMM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			newRecomm: {
				...payload,
			},
		};
	},

	[MALL_LIMITGOODS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			limitGoods: {
				...payload,
			},
		};
	},
	[MALL_LIMITGOODSS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			limitGoodss: {
				...payload,
			},
		};
	},
	
	[MALL_CART_ADD]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_CART]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			mailCart: payload,
		};
	},

	[MALL_ORDER_SETSHOP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			setShop:{
				...payload
			} ,
		};
	},

	[MALL_CART_UPDATE]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_CART_CLEAR]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_CART_REMOVE]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_ORDER_TOPAY]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_CART_SETTLEMENT]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[MALL_ORDER_INVOICE]:  (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[MALL_SHOP_AMOUNT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			shipAmount: payload,
		};
	},
	[EMS_GET]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			ems: payload,
		};
	},
};

export default createReducer(initialState, actionHandler);
