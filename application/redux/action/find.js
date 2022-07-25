import {createAction} from 'redux-actions';

const {
    ACTIVITY_CHANNEL,
    PROJECT_CHANNEL
} = require('../key').default;

import * as findService from '../service/find';


export const activity = createAction(ACTIVITY_CHANNEL, async(keyword,page,pageSize) => {
	const data = await findService.activity(keyword,page,pageSize);
	return data;
});

export const project = createAction(PROJECT_CHANNEL, async(page) => {
	const data = await findService.project(page);
	return data;
});