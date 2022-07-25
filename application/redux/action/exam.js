import {createAction} from 'redux-actions';

const {
    EXAM_PAPER,
	EXAM_TEST, 
    EXAM_REVIEW,
    EXAM_ANSWER,
} = require('../key').default;

import * as examService from '../service/exam';

export const paper = createAction(EXAM_PAPER, async(paper_id, level_id, lessDuration) => {
	const data = await examService.paper(paper_id, level_id, lessDuration);
	return data;
});

export const test = createAction(EXAM_TEST, async(test_id) => {
	const data = await examService.test(test_id);
	return data;
});

export const review = createAction(EXAM_REVIEW, async(test_id) => {
	const data = await examService.review(test_id);
	return data;
});

export const answer = createAction(EXAM_ANSWER, examService.answer, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
