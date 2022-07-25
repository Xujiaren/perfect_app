import {createAction} from 'redux-actions';

const {
	TOKEN, 
	LOGIN, 
	LOGIN_APPLE, 
	VCODE, 
	CODE_VALID, 
	PWD_RESET, 
	LOGOUT, 
	LOGIN_WECHAT, 
	LOGIN_WECHATR, 
	LOGING_WECHATR,
	MOBILE_BIND, 
	APPLE_MOBILE_BIND
} = require('../key').default;

import * as passportService from '../service/passport';

export const token = createAction(TOKEN, passportService.token, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const vcode = createAction(VCODE, passportService.vcode, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const validcode = createAction(CODE_VALID, passportService.validcode, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const resetpwd = createAction(PWD_RESET, passportService.resetpwd, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const login = createAction(LOGIN, passportService.login, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const appleLogin = createAction(LOGIN_APPLE, passportService.appleLogin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});



export const logout = createAction(LOGOUT, passportService.logout, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const wechatLogin = createAction(LOGIN_WECHAT, passportService.wechatLogin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const wechatRLogin = createAction(LOGIN_WECHATR, passportService.wechatRLogin, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const wechatRLoging = createAction(LOGING_WECHATR, passportService.wechatRLoging, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const bindMobile = createAction(MOBILE_BIND, passportService.bindMobile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const bindAppleMobile = createAction(APPLE_MOBILE_BIND, passportService.bindAppleMobile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
