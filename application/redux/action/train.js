import {createAction} from 'redux-actions';

const {
    O2O,
    O2O_SKILL,
    O2O_DETAIL,
    O2O_SQUAD,
    O2O_VIDEO,
    O2O_TOPIC,
	O2O_EXAMPAPER,
	SQUARD_APPLY,
	SQUARD_CERT,
	CONFIG_CATENEWCERT,
	STUDY_STATUS,
	STUDY_INFO,
	TOPIC_ANSWER,
	TEST_INFO,
	USER_EXAM,
	PRIVILEGES,
	SQUAD_APPLYS,
} = require('../key').default;

import * as trainService from '../service/train';


export const o2o = createAction(O2O, async(stype,page) => {
	const data = await trainService.o2o(stype,page);
	return data;
});

export const o2oSkill = createAction(O2O_SKILL, async(page) => {
	const data = await trainService.o2oSkill(page);
	return data;
});

export const o2oDetail = createAction(O2O_DETAIL, async(squad_id) => {
	const data = await trainService.o2oDetail(squad_id);
	return data;
});

export const o2oSquad = createAction(O2O_SQUAD, async(stype,page) => {
	const data = await trainService.o2oSquad(stype,page);
	return data;
});

export const o2oVideo = createAction(O2O_VIDEO, async(squadId,type) => {
	const data = await trainService.o2oVideo(squadId,type);
	return data;
});

export const o2oTopic = createAction(O2O_TOPIC, async(categroy_id,test_id) => {
	const data = await trainService.o2oTopic(categroy_id,test_id);
	return data;
});

export const o2oExamPaper = createAction(O2O_EXAMPAPER, async(squadId) => {
	const data = await trainService.o2oExamPaper(squadId);
	return data;
});


export const squadApply = createAction(SQUARD_APPLY, trainService.squadApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const squadCert = createAction(SQUARD_CERT, trainService.squadCert, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const configCateNewCert = createAction(CONFIG_CATENEWCERT, async(squadId,ctype) => {
	const data = await trainService.configCateNewCert(squadId,ctype);
	return data;
});

export const studyStatus = createAction(STUDY_STATUS, async(squadId) => {
	const data = await trainService.studyStatus(squadId);
	return data;
});


export const studyInfo = createAction(STUDY_INFO, async(category_id) => {
	const data = await trainService.studyInfo(category_id);
	return data;
});


export const topicAnswer = createAction(TOPIC_ANSWER, trainService.topicAnswer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const testInfo = createAction(TEST_INFO, async(testId) => {
	const data = await trainService.testInfo(testId);
	return data;
});

export const userExam = createAction(USER_EXAM, trainService.userExam, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const privileges = createAction(PRIVILEGES, async() => {
	const data = await trainService.privileges();
	return data;
});

export const squadApplys = createAction(SQUAD_APPLYS, trainService.squadApplys, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
