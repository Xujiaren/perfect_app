import store from 'react-native-simple-store';
import * as request from '../../util/net';

export function tip() {
	global.tip = 0;
	return store.save('tip', 0);
}

export function gift(gtype) {
	return request.get('/config/gift', {
		gtype: gtype,
	});
}

export function theme({theme}){
	global.theme = theme;
	return store.save('theme', {
		theme: theme,
	});
}

export function config(){
	return request.get('/config',{
	});
}

export function advert(ad_id) {
	return request.get('/config/ad/' + ad_id, {
	});
}

export function adverts({ad_id}) {
	return request.get('/config/ad/' + ad_id, {
	});
}

export function adpopup(ad_id) {
	return request.get('/config/ad/2', {
	});
}

export function aduser() {
	return request.get('/config/ad/3', {
	});
}

export function admail(){
	return request.get('/config/ad/4', {
	});
};

export function upload({file}) {
	return request.post('/site/upload', {
		file:file,
	});
}

export function channel() {
	return request.get('/site', {
	});
}

export function oss() {
	return request.get('/site/oss', {
	});
}

export function pComment(content_id,ctype,sort,page){
	return request.get('/site/comments/' + content_id, {
		ctype:ctype,
		sort:sort,
		page:page
	});
}

export function pCommentTop(content_id,ctype,sort,page){
	return request.get('/site/comments/' + content_id, {
		ctype:ctype,
		sort:sort,
		page:page
	});
}

export function about({type}) {
	return request.get('/article/system/' + type, {
	});
}