import {createAction} from 'redux-actions';

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

import * as mallService from '../service/mall';

export const admail = createAction(AD_MALL, async() => {
	const data = await mallService.admail();
	return data;
});

export const shopCategory = createAction(SHOP_CATEGORY, async() => {
	const data = await mallService.shopCategory();
	return data;
});

export const shopSearch = createAction(SHOP_SEARCH, async(keyword,page) => {
	const data = await mallService.shopSearch(keyword,page);
	return data;
});
export const shopSearchs = createAction(SHOP_SEARCHS, async(category_id,ccategory_id,time_limit,is_recomm,keyword,gtype,sortOrder,page) => {
	const data = await mallService.shopSearchs(category_id,ccategory_id,time_limit,is_recomm,keyword,gtype,sortOrder,page);
	return data;
});

export const goods = createAction(GOODS, async(goods_id) => {
	const data = await mallService.goods(goods_id);
	return data;
});

export const goodSubmit = createAction(GOODS_SUBMIT, mallService.goodSubmit, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const order = createAction(ORDER, async(status,page) => {
	const data = await mallService.order(status,page);
	return data;
});


export const orderDetail = createAction(ORDER_DETAIL, async(order_id) => {
	const data = await mallService.orderDetail(order_id);
	return data;
});


export const orderReturn = createAction(ORDER_RETURN, mallService.orderReturn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const orderConfirm = createAction(ORDER_CONFIRM, mallService.orderConfirm, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const orderCancel = createAction(ORDER_CANCEL, mallService.orderCancel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const orderShip = createAction(ORDER_SHIP, mallService.orderShip, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const sellTop = createAction(MALL_SELLTOP, async() => {
	const data = await mallService.sellTop();
	return data;
});


export const shopExchange = createAction(MALL_EXCHANGE, async(exchange_type,ctype,page,sortOrder) => {
	const data = await mallService.shopExchange(exchange_type,ctype,page,sortOrder);
	return data;
});

export const vipEnjoy = createAction(MALL_VIPENJOY, async(exchange_type,ctype,page) => {
	const data = await mallService.vipEnjoy(exchange_type,ctype,page);
	return data;
});

export const lectEnjoy = createAction(MALL_LECTENJECT, async(exchange_type,ctype,page) => {
	const data = await mallService.lectEnjoy(exchange_type,ctype,page);
	return data;
});


export const newRecomm = createAction(MALL_NEWRECOMM, async(category_id,ccategory_id,time_limit,is_recomm,keyword,gtype,sortOrder,page) => {
	const data = await mallService.newRecomm(category_id,ccategory_id,time_limit,is_recomm,keyword,gtype,sortOrder,page);
	return data;
});

export const limitGoods = createAction(MALL_LIMITGOODS, async(page,sortOrder) => {
	const data = await mallService.limitGoods(page,sortOrder);
	return data;
});
export const limitGoodss = createAction(MALL_LIMITGOODSS, async(category_id,page,sortOrder) => {
	const data = await mallService.limitGoodss(category_id,page,sortOrder);
	return data;
});

export const addCart = createAction(MALL_CART_ADD, mallService.addCart, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const mailCart = createAction(MALL_CART, async() => {
	const data = await mallService.cart();
	return data;
});


export const updateCart = createAction(MALL_CART_UPDATE, mallService.updateCart, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const clearCart = createAction(MALL_CART_CLEAR, mallService.clearCart, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const removeCart = createAction(MALL_CART_REMOVE, mallService.removeCart, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const settlementCart = createAction(MALL_CART_SETTLEMENT, mallService.settlementCart, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const orderPay = createAction(MALL_ORDER_TOPAY, mallService.orderPay, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const orderInvoice = createAction(MALL_ORDER_INVOICE, mallService.orderInvoice, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const setShop = createAction(MALL_ORDER_SETSHOP, async() => {
	const data = await mallService.setShop();
	return data;
});


export const shipAmount = createAction(MALL_SHOP_AMOUNT, async(province,city,goods_weight) => {
	const data = await mallService.shipAmount(province,city,goods_weight);
	return data;
});

export const getEms = createAction(EMS_GET, async(order_id) => {
	const data = await mallService.getEms(order_id);
	return data;
});