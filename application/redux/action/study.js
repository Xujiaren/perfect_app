import {createAction} from 'redux-actions';

const {
	RANK_INTEGRAL, 
	RANK_MONTH, 
	RANK_TOTAL, 
	STUDY, 
	STUDY_COURSE, 
	STUDY_MAP, 
	STUDY_MAP_JUDGE, 
	STUDY_REGION, 
	STUDY_RANK,
	CHECKO_TWO,
	COURSE_MAP_DARY,
	TEST_SCORE,
} = require('../key').default;

import * as studyService from '../service/study';

export const rankintegral = createAction(RANK_INTEGRAL, async(type) => {
	const data = await studyService.rankintegral(type);
	return data;
});

export const rankmonth = createAction(RANK_MONTH, async(type) => {
	const data = await studyService.rankmonth(type);
	return data;
});

export const ranktotal = createAction(RANK_TOTAL, async(type) => {
	const data = await studyService.ranktotal(type);
	return data;
});

export const study = createAction(STUDY, async() => {
	const data = await studyService.study();
	return data;
});

export const learncourse = createAction(STUDY_COURSE, async(status,page) => {
	const data = await studyService.learncourse(status,page);
	return data;
});


export const studyMap = createAction(STUDY_MAP, async() => {
	const data = await studyService.studyMap();
	return data;
});

export const mapJudge = createAction(STUDY_MAP_JUDGE, studyService.mapJudge, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const studyRegion = createAction(STUDY_REGION, async(type) => {
	const data = await studyService.studyRegion(type);
	return data;
});


export const studyRank = createAction(STUDY_RANK, async(type) => {
	const data = await studyService.studyRank(type);
	return data;
});

export const checkOtwo = createAction(CHECKO_TWO, studyService.checkOtwo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const courseMapDary = createAction(COURSE_MAP_DARY, async(type) => {
	const data = await studyService.courseMapDary(type);
	return data;
});
export const testScore = createAction(TEST_SCORE, studyService.testScore, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});