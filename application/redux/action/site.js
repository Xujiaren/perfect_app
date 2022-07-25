import {createAction} from 'redux-actions';

const {TIP, GIFT, THEME, CONFIG, AD,ADS,AD_POPUP,AD_USER, AD_MALL, UPLOAD, CHANNEL,OSS,PCOMMENT,PCOMMENTTOP, SITE_ABOUT} = require('../key').default;

import * as siteService from '../service/site';

export const channel = createAction(CHANNEL, async() => {
	const data = await siteService.channel();
	return data;
});

export const tip = createAction(TIP, siteService.tip, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const gift = createAction(GIFT, async(gtype) => {
	const data = await siteService.gift(gtype);
	return data;
});

export const theme = createAction(THEME, siteService.theme, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const config = createAction(CONFIG, async() => {
	const data = await siteService.config();
	return data;
});

export const advert = createAction(AD, async(ad_id) => {
	const data = await siteService.advert(ad_id);
	return data;
});

export const adverts = createAction(ADS, siteService.adverts, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const adpopup = createAction(AD_POPUP, async() => {
	const data = await siteService.adpopup();
	return data;
});


export const aduser = createAction(AD_USER, async() => {
	const data = await siteService.aduser();
	return data;
});

export const upload = createAction(UPLOAD, siteService.upload, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const oss = createAction(OSS, siteService.oss, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const pComment = createAction(PCOMMENT, async(content_id,ctype,sort,page) => {
	const data = await siteService.pComment(content_id,ctype,sort,page);
	return data;
});

export const pCommentTop = createAction(PCOMMENTTOP, async(content_id,ctype,sort,page) => {
	const data = await siteService.pCommentTop(content_id,ctype,sort,page);
	return data;
});

export const admail = createAction(AD_MALL, async() => {
	const data = await siteService.admail();
	return data;
});

export const about = createAction(SITE_ABOUT, siteService.about, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
