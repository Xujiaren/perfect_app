import {createAction} from 'redux-actions';

const {
	SITE_MENU,
	SITE_INDEX,

	SEARCH, 
	SEARCH_COURSE, 
	
	COURSE_COMMENT_PUBLISH, 
	COMMENT_PUBLISH,
	
} = require('../key').default;

import * as homeService from '../service/home';

export const search = createAction(SEARCH, async(keyword) => {
	const data = await homeService.search(keyword);
	return data;
});


export const searchcourse = createAction(SEARCH_COURSE, async(keyword,ctype,sort,page) => {
	const data = await homeService.searchcourse(keyword,ctype,sort,page);
	return data;
});

export const publishcommt = createAction(COURSE_COMMENT_PUBLISH, homeService.publishcommt, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const publishAllComment = createAction(COMMENT_PUBLISH, homeService.publishAllComment, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const sitemenu = createAction(SITE_MENU, async(type,mark,page) => {
	const data = await homeService.sitemenu(type,mark,page);
	return data;
});

export const siteindex = createAction(SITE_INDEX, async() => {
	const data = await homeService.siteindex();
	return data;
});