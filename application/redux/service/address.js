import store from 'react-native-simple-store';
import * as request from '../../util/net';

export function address() {
	return request.get('/user/address' , {
	});
}

export function doneAddress({address_name,address_id,realname,mobile,province,city,district,address,is_first}) {
	return request.post('/user/address' , {
                address_name:address_name,
                address_id:address_id,
                realname:realname,
                mobile:mobile,
                province:province,
                city:city,
                district:district,
                address:address,
                is_first:is_first,
	});
}

export function firstAddress({address_id}) {
        return request.post('/user/address/first' , {
                address_id:address_id,
        });
}

export function removeAddress({address_id}) {
	return request.post('/user/address/remove' , {
                address_id:address_id,
	});
}

export function addressDesc(address_id) {
	        return request.get('/user/address/' + address_id, {
	});
}

