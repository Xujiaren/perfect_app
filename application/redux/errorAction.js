import {DeviceEventEmitter} from 'react-native';

export default function errorAction({dispatch}) {
	return next => action => {
		const { meta = {}, error, payload } = action;
		
		next(action);
	}
}