import {createAction} from 'redux-actions';

const {
    FOREST_INIT,
    FOREST_INDEX,
    FOREST_CERT,
    FOREST_SHOP,
    FOREST_ORDER,
    FOREST_USER_ORDER,
    FOREST_PICK,
    FOREST_QA,
	FOREST_SEEDS,
    FOREST_SEED,
    FOREST_SHARE,
    FOREST_STEAL,
    FOREST_WATER,
    FOREST_CONNECT,
    FOREST_FRIEND
} = require('../key').default;

import * as forestService from '../service/forest';

export const init = createAction(FOREST_INIT, forestService.init, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const index = createAction(FOREST_INDEX, async(target_id) => {
	const data = await forestService.index(target_id);
	return data;
});

export const cert = createAction(FOREST_CERT, async(target_id, type) => {
	const data = await forestService.cert(target_id, type);
	return data;
});

export const shop = createAction(FOREST_SHOP, async() => {
	const data = await forestService.shop();
	return data;
});

export const order = createAction(FOREST_ORDER, forestService.order, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const userOrder = createAction(FOREST_USER_ORDER, async(page) => {
	const data = await forestService.userOrder(page);
	return data;
});

export const pick = createAction(FOREST_PICK, forestService.pick, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const qa = createAction(FOREST_QA, async() => {
	const data = await forestService.qa();
	return data;
});

export const seeds = createAction(FOREST_SEEDS, async() => {
	const data = await forestService.seeds();
	return data;
});

export const seed = createAction(FOREST_SEED, forestService.seed, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const share = createAction(FOREST_SHARE, forestService.share, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const steal = createAction(FOREST_STEAL, forestService.steal, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const water = createAction(FOREST_WATER, forestService.water, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const connect = createAction(FOREST_CONNECT, forestService.connect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const friend = createAction(FOREST_FRIEND, async(ype, page) => {
	const data = await forestService.friend(ype, page);
	return data;
});