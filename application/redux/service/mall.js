import store from 'react-native-simple-store';
import * as request from '../../util/net';


export function admail(){
	return request.get('/config/ad/4', {
	});
};


export function shopCategory(){
	return request.get('/config/category/goods', {
	});
};

export function shopSearch(keyword,page){
	return request.get('/shop/search', {
        category_id:0,
        ccategory_id:0,
        time_limit:0,
        is_recomm:0,
        keyword:keyword,
        gtype:0,
        sortOrder:0,
        page:page,
	});
};export function shopSearchs(category_id,ccategory_id,time_limit,is_recomm,keyword,gtype,sortOrder,page){
	return request.get('/shop/search', {
        category_id:category_id,
        ccategory_id:ccategory_id,
        time_limit:time_limit,
        is_recomm:is_recomm,
        keyword:keyword,
        gtype:gtype,
        sortOrder:sortOrder,
        page:page,
	});
};

export function goods(goods_id){
	return request.get('/shop/goods/' + goods_id, {
	});
};



export function goodSubmit({buy_type,cart_ids, pay_type,goods_id,goods_number,attr_ids,coupon_id,address_id,remark}) {
	return request.post('/order/goods/submit',{
		buy_type: buy_type,
		cart_ids:cart_ids,
		pay_type: pay_type,
		goods_id:goods_id,
		goods_number:goods_number,
		attr_ids:attr_ids,
		coupon_id:coupon_id,
		address_id:address_id,
		remark:remark,
	});
}


export function order(status,page){
	return request.get('/user/order' , {
                status:status,
                page:page,
	});
};


export function orderDetail(order_id){
	return request.get('/order/' + order_id  , {
	});
};


export function orderReturn({order_id, goods_id,etype,reason,action,picString}) {
	return request.post('/order/return/' + order_id +'/' + goods_id,{
		etype: etype,
                reason: reason,
                action:action,
                picString:picString,
	});
}

export function orderConfirm({order_id}) {
	return request.post('/order/confirm',{
		order_id: order_id,
	});
}

export function orderCancel({order_id}) {
	return request.post('/order/cancel',{
		order_id: order_id,
		coupon_id: 0
	});
}

export function orderShip({return_id,ship_name,ship_sn}) {
	return request.post('/order/return/ship/' +  return_id ,{
                ship_name:ship_name,
                ship_sn:ship_sn
	});
}

export function sellTop(){
	return request.get('/shop/sellTop', {
	});
};


export function shopExchange(exchange_type,ctype,page,sortOrder){
	return request.get('/shop/exchange', {
		exchange_type:exchange_type,
		ctype:ctype,
		page:page,
		sortOrder:sortOrder,
	});
};

export function vipEnjoy(exchange_type,ctype,page){
	return request.get('/shop/exchange', {
		exchange_type:exchange_type,
		ctype:ctype,
		page:page,
	});
};

export function lectEnjoy(exchange_type,ctype,page){
	return request.get('/shop/exchange', {
		exchange_type:exchange_type,
		ctype:ctype,
		page:page,
	});
};


export function newRecomm(category_id,ccategory_id,time_limit,is_recomm,keyword,gtype,sortOrder,page){
	return request.get('/shop/search', {
		category_id:0,
		ccategory_id:0,
		time_limit:0,
		is_recomm:0,
		keyword:'',
		gtype:0,
		sortOrder:0,
		page:0
	});
};

export function limitGoods(page,sortOrder){
	return request.get('/shop/search', {
		category_id:0,
		ccategory_id:0,
		time_limit:1,
		is_recomm:0,
		keyword:'',
		gtype:0,
		sortOrder:sortOrder,
		page:page
	});
};
export function limitGoodss(category_id,page,sortOrder){
	return request.get('/shop/search', {
		category_id:category_id,
		ccategory_id:0,
		time_limit:0,
		is_recomm:0,
		keyword:'',
		gtype:0,
		sortOrder:sortOrder,
		page:page
	});
};

export function addCart({goods_id,attr_ids,goods_number,device_id}) {
	return request.post('/user/cart/add/',{
		goods_id:goods_id,
		attr_ids:attr_ids,
		goods_number:goods_number,
		device_id:device_id
	});
}

export function cart(){
	return request.get('/user/cart', {
	});
};

export function updateCart({cart_id,goods_number,ctype}) {
	return request.post('/user/cart',{
		cart_id:cart_id,
		goods_number:goods_number,
		ctype:ctype,
	});
}


export function clearCart({}) {
	return request.post('/user/cart/clear',{
	});
}

export function removeCart({cartIds}) {
	return request.post('/user/cart/remove',{
		cartIds:cartIds
	});
}

export function settlementCart({good_ids}) {
	return request.post('/user/cart/settlement',{
		good_ids:good_ids
	});
}


export function orderPay({order_sn,pay_type}) {
	return request.post('/order/topay',{
		order_sn:order_sn,
		pay_type:pay_type
	});
}


export function orderInvoice({order_id,invoice_name,invoice_sn,mobile,email}) {
	return request.post('/order/invoice',{
		order_id:order_id,
		invoice_name:invoice_name,
		invoice_sn:invoice_sn,
		mobile:mobile,
		email:email,
	});
}

export function setShop(){
	return request.get('/shop/setting', {
	});
};


export function shipAmount(province,city,goods_weight){
	return request.get('/shop/shipAmount', {
		province:province,
		city:city,
		goods_weight:goods_weight,
	});
};

export function getEms(order_id){
	return request.get('/order/shipping/info/'+order_id, {
	});
};