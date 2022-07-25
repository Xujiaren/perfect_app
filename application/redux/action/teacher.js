import {createAction} from 'redux-actions';

const {
	TEACHER,
	TEACHER_CHANNEL, 
	LEADER_RECOMM, 
	TEACHER_RECOMM, 
	TEACHER_FOLLOW,
	TEACHER_FOLLOW_REMOVE,
	TEACHER_ARTICLE,
	TEACHER_APPLY,
	TEACHER_STATUS,
	TEACHER_COURSE,
} = require('../key').default;

import * as teacherService from '../service/teacher';

export const channel = createAction(TEACHER_CHANNEL, async(sort, page) => {
	const data = await teacherService.channel(sort,page);
	return data;
});

export const leaderArticle = createAction(TEACHER_ARTICLE, async(teacher_id, page) => {
	const data = await teacherService.leaderArticle(teacher_id,page);
	return data;
});

export const leaderrecomm = createAction(LEADER_RECOMM, async() => {
	const data = await teacherService.leader();
	return data;
});

export const recomm = createAction(TEACHER_RECOMM, async() => {
	const data = await teacherService.recomm();
	return data;
});

export const teacher = createAction(TEACHER, async(teacher_id) => {
	const data = await teacherService.teacher(teacher_id);
	return data;
});

export const follow = createAction(TEACHER_FOLLOW, teacherService.follow, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removefollow = createAction(TEACHER_FOLLOW_REMOVE, teacherService.removefollow, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const teacherApply = createAction(TEACHER_APPLY, teacherService.teacherApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const teacherStatus = createAction(TEACHER_STATUS, async() => {
	const data = await teacherService.teacherStatus();
	return data;
});


export const teacherCourse = createAction(TEACHER_COURSE, async(teacher_id) => {
	const data = await teacherService.teacherCourse(teacher_id);
	return data;
});