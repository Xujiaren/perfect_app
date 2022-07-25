import {createAction} from 'redux-actions';

const {
    DOWNLOAD_INDEX,
	DOWNLOAD, 
    DOWNLOAD_LIKE,
    DOWNLOAD_UNLIKE,
} = require('../key').default;

import * as downloadService from '../service/download';

export const index = createAction(DOWNLOAD_INDEX, async(ftype, page, parentId) => {
	const data = await downloadService.index(ftype, page, parentId);
	return data;
});

export const download = createAction(DOWNLOAD, downloadService.download, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const like = createAction(DOWNLOAD_LIKE, downloadService.like, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removeLike = createAction(DOWNLOAD_UNLIKE, downloadService.removeLike, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const likes = createAction('likes', downloadService.likes, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removeLikes = createAction('removeLikes', downloadService.removeLikes, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});