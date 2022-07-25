import * as request from '../../util/net';
import store from 'react-native-simple-store';

export function vcode({mobile,type}) {
	return request.post('/passport/code',{
		mobile: mobile,
		type:type
	});
}

export function validcode({mobile, code}) {
	return request.post('/passport/code/valid',{
		mobile: mobile,
		code: code
	});
}

export function resetpwd({mobile, code, password}) {
	return request.post('/passport/reset',{
		mobile: mobile,
		code: code,
		password: password
	});
}

export function login({mobile, type, code, fuser}) {
	return request.post('/passport/login',{
		mobile: mobile,
		type: type,
		code: code,
		fuser: fuser,
	});
}

export function appleLogin({apple_id, authorization_code, identity_token}) {
	return request.post('/passport/oauth/apple',{
		apple_id: apple_id,
		authorization_code: authorization_code,
		identity_token: identity_token,
	});
}

export function token({token}) {
	global.token = token;
	return store.save('token', token);
}

export function logout() {
	global.token = '';
	return store.delete('token');

}


export function wechatLogin({code, fuser}) {
	return request.post('/passport/oauth/wxapp',{
		code: code,
		fuser: fuser,
	});
}

export function wechatRLogin({code, fuser}) {
	return request.post('/passport/oauth/wxapp/2',{
		code: code,
		fuser: fuser,
	});
}
export function wechatRLoging({code, fuser,mobile}) {
	return request.post('/passport/oauth/wxapp/2',{
		code: code,
		fuser: fuser,
		mobile:mobile
	});
}

export function bindMobile({union_id, mobile,code}) {
	return request.post('/passport/bind/mobile',{
		union_id: union_id,
		mobile: mobile,
		code:code
	});
}

export function bindAppleMobile({apple_id, mobile,code}) {
	return request.post('/passport/app/bind/mobile',{
		apple_id: apple_id,
		mobile: mobile,
		code:code
	});
}
