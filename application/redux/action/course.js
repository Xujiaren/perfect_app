import {createAction} from 'redux-actions';

const {
	COURSE_CHANNEL,
	LIVE, 
	LIVE_REPLAY,
	COURSE, 
	COURSES,
	COURSE_INFO, 
	COURSE_CATEGORY,
	COURSE_RECOMM, 
	COURSE_COMMENT,
	COURSE_COMMENT_RECOMM,
	COURSE_GOODS,
	COURSE_REWARD,
	COURSE_COLLECT,
    COURSE_COLLECT_REMOVE,
	COURSE_COLLECTS_REMOVE,
	COLLECT_REMOVE,
	COURSE_BOOK,
	COURSE_VERIFY,
	COURSE_LEARN,
	COURSE_PAY,
	COURSE_INFO_SCORE,
	COURSE_CAN_PLAY,
	STATUS_LEVEL,
	COURSE_SURVEY,	
	FORLOTTERY,
	LIVEACTIVITYS,
} = require('../key').default;

import * as courseService from '../service/course';

export const channel = createAction(COURSE_CHANNEL, async(channel_id, sort) => {
	const data = await courseService.channel(channel_id, sort);
	return data;
});

export const category = createAction(COURSE_CATEGORY, async() => {
	const data = await courseService.category();
	return data;
});

export const live = createAction(LIVE, async(ctype,status, page,region_id) => {
	const data = await courseService.live(ctype,status, page,region_id);
	return data;
});

export const liveback = createAction(LIVE_REPLAY, async(ctype,status,sort,page,region_id) => {
	const data = await courseService.liveback(ctype,status,sort,page,region_id);
	return data;
});

export const recomm = createAction(COURSE_RECOMM, async(limit) => {
	const data = await courseService.recomm(limit);
	return data;
});

export const  course = createAction(COURSE, async(category_id, ccategory_id, ctype, sort, page,plant) => {
	const data = await courseService.course(category_id, ccategory_id, ctype, sort, page,plant);
	return data;
});
export const  courses = createAction(COURSES, async(category_id, ccategory_id, ctype, sort,paytype, page,plant) => {
	const data = await courseService.courses(category_id, ccategory_id, ctype,sort,paytype, page,plant);
	return data;
});
export const info = createAction(COURSE_INFO, async(course_id) => {
	const data = await courseService.info(course_id);
	return data;
});

export const infoScore = createAction(COURSE_INFO_SCORE, async(course_id) => {
	const data = await courseService.infoScore(course_id);
	return data;
});

export const infoCanPlay = createAction(COURSE_CAN_PLAY, async(course_id) => {
	const data = await courseService.infoCanPlay(course_id);
	return data;
});


export const comment = createAction(COURSE_COMMENT, async(course_id, sort, page) => {
	const data = await courseService.comment(course_id, sort, page);
	return data;
});


export const commentTop = createAction(COURSE_COMMENT_RECOMM, async(course_id) => {
	const data = await courseService.commentTop(course_id);
	return data;
});

export const goods = createAction(COURSE_GOODS, async(course_id) => {
	const data = await courseService.goods(course_id);
	return data;
});

export const reward = createAction(COURSE_REWARD, courseService.reward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const collect = createAction(COURSE_COLLECT, courseService.collect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removecollect = createAction(COURSE_COLLECT_REMOVE, courseService.removecollect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const removecollects = createAction(COURSE_COLLECTS_REMOVE, courseService.removecollects, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const userColltRemove = createAction(COLLECT_REMOVE, courseService.userColltRemove, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const book = createAction(COURSE_BOOK, courseService.book, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const verify = createAction(COURSE_VERIFY, courseService.verify, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const learn = createAction(COURSE_LEARN, courseService.learn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const payCourse = createAction(COURSE_PAY, courseService.payCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const LevelStatus = createAction(STATUS_LEVEL, courseService.LevelStatus, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const learnGrap = createAction('learnGrap', courseService.learnGrap, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const courseSurvey = createAction(COURSE_SURVEY, async(course_id,stype) => {
	const data = await courseService.courseSurvey(course_id,stype);
	return data;
});
export const postSurvey = createAction('postSurvey', courseService.postSurvey, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const shareCourse = createAction('shareCourse', courseService.shareCourse, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const forLottery = createAction(FORLOTTERY, courseService.forLottery, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const liveActivitys = createAction(LIVEACTIVITYS, courseService.liveActivitys, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});