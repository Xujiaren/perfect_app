
import * as request from '../../util/net';

export function charge() {
	return request.get('/order/charge',{
	});
}

export function payCharge({recharge_id,pay_type,transactionId,payload}) {
	return request.get('/order/charge',{
        recharge_id,
        pay_type,
        transactionId,
        payload,
	});
}
