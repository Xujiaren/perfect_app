import store from 'react-native-simple-store';
import * as request from '../../util/net';

export function study() {
	return request.get('/user/study', {
	});
}

export function learncourse(status,page) {
	return request.get('/user/course', {
		status:status,
		page:page,
	});
}

export function rankintegral(type) {
	return request.get('/study/rank/new', {
		type:type
	});
}

export function rankmonth(type) {
	return request.get('/study/rank/new', {
		type:type
	});
}

export function ranktotal(type) {
	return request.get('/study/rank/new', {
		type:type
	});
}

export function studyMap() {
	return request.get('/course/map', {
	});
}

export function mapJudge({levelId}) {
	return request.get('/course/map/' + levelId, {
	});
}



export function studyRegion(type) {
	return request.get('/study/rank/region', {
		type:type
	});
}

export function studyRank(type) {
	return request.get('/study/rank/new', {
		type:type
	});
}
export function checkOtwo({level_id}) {
	return request.get('/course/pass/map/squad/'+level_id, {
	});
}
export function courseMapDary() {
	return request.get('/course/map/secondary', {
	});
}
export function testScore({test_id}) {
	return request.get('/exam/review/score/'+test_id, {
	});
}


