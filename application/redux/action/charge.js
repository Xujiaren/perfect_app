import {createAction} from 'redux-actions';

const {
	CHARGE,
    CHARGE_PAY,
} = require('../key').default;

import * as chargeService from '../service/charge';

export const charge = createAction(CHARGE, async() => {
	const data = await chargeService.charge();
	return data;
});

export const payCharge = createAction(CHARGE_PAY, chargeService.payCharge, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
