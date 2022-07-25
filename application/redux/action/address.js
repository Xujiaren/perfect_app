import {createAction} from 'redux-actions';

const {
	ADDRESS, 
	ADDRESS_DONE,
	ADDRESS_FIRST,
	ADDRESS_REMOVE,
	ADDRESS_INFO,
} = require('../key').default;

import * as addressService from '../service/address';


export const address = createAction(ADDRESS, async() => {
	const data = await addressService.address();
	return data;
});


export const doneAddress = createAction(ADDRESS_DONE, addressService.doneAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const firstAddress = createAction(ADDRESS_FIRST, addressService.firstAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const removeAddress = createAction(ADDRESS_REMOVE, addressService.removeAddress, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const addressDesc = createAction(ADDRESS_INFO, async(address_id) => {
	const data = await addressService.addressDesc(address_id);
	return data;
});