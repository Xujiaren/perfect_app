import {createAction} from 'redux-actions';

const {
	USER, 
	USER_PROFILE, 
	USER_PWD, 
	USER_LEVEL, 
	USER_REGION,
	PROFILE, 
	USER_INTEGRAL, 
	USER_COUPON,

	LIKE_REMOVE, 
	LIKE_PUBLISH,
	REWARD_PUBLISH,
	
	USERAUTH, 
	FEEDBACK, 
	USERCOLLECT,  
	USERACOLLECT,
	CATEFEEDBACK, 
	CATEQUESTION,

	USERTASK, 
	INVITESTAT, 
	USERINVITE, 
	PUSHFEEDBACK,
	INVITECODE,
	INVITEIMGS,
	USERCARD,
	USERMEDAL,
	SIGNIN,
	SIGNINS,
	USERREWARD,
	USERFOLLOW,
	USERFOLLOWS,
	REMOVEFOLLOW,
	AUSERFOLLOW,
	AREMOVEFOLLOW,
	CONFIGHELP,

	EXAMPAPER,

	USER_LOG,
	TEACHERUPINFO,
	USER_ACOLLECT,
	USER_AREMOVECOLLECT,
	USER_BLACK,
	BLACK,
	USERCOURSE,
	USERSTUDY,
	USERCERT,
	USERCONTENT,
	USERAGENT,
	USERBILLS,
	GETREGION,
	BANGDAN,
	VANTLIVE,
	COMPANYLIST,
	EDITMOBILE,
	
} = require('../key').default;

import * as userService from '../service/user';

export const pwd = createAction(USER_PWD, userService.pwd, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const user = createAction(USER, async() => {
	const data = await userService.user();
	return data;
});

export const auser = createAction(USER_PROFILE, async(toId) => {
	const data = await userService.auser(toId);
	return data;
});

export const userlevel = createAction(USER_LEVEL, async(page) => {
	const data = await userService.userlevel(page);
	return data;
});

export const userintegral = createAction(USER_INTEGRAL, async(itype,page) => {
	const data = await userService.userintegral(itype,page);
	return data;
});

export const userCoupon = createAction(USER_COUPON, async(status,page) => {
	const data = await userService.userCoupon(status,page);
	return data;
});

export const bindRegion = createAction(USER_REGION, userService.bindRegion, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const reuserinfo = createAction(PROFILE, userService.reuserinfo, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const userBack = createAction(USER_BLACK, userService.userBlack, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const userauth = createAction(USERAUTH, userService.userauth, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const feedback = createAction(FEEDBACK, async(page) => {
	const data = await userService.feedback(page);
	return data;
});

export const publishreward = createAction(REWARD_PUBLISH, userService.publishreward, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const usercollect = createAction(USERCOLLECT, async(cctype,page) => {
	const data = await userService.usercollect(cctype,page);
	return data;
});

export const userAcollect = createAction(USERACOLLECT, async(ctype,page) => {
	const data = await userService.userAcollect(ctype,page);
	return data;
});

export const removelike = createAction(LIKE_REMOVE, userService.removelike, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const pulishlike = createAction(LIKE_PUBLISH, userService.pulishlike, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const catefeedback = createAction(CATEFEEDBACK, async() => {
	const data = await userService.catefeedback();
	return data;
});


export const cateQuestion = createAction(CATEQUESTION, async() => {
	const data = await userService.cateQuestion();
	return data;
});

export const configHelp = createAction(CONFIGHELP, async(category_id,keyword,page) => {
	const data = await userService.configHelp(category_id,keyword,page);
	return data;
});

export const usertask = createAction(USERTASK, async() => {
	const data = await userService.usertask();
	return data;
});

export const invitestat = createAction(INVITESTAT, async() => {
	const data = await userService.invitestat();
	return data;
});

export const userinvite = createAction(USERINVITE, async(page) => {
	const data = await userService.userinvite(page);
	return data;
});

export const pushfeedback = createAction(PUSHFEEDBACK, userService.pushfeedback, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const invitecode = createAction(INVITECODE, userService.invitecode, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const inviteImgs = createAction(INVITEIMGS, async() => {
	const data = await userService.inviteImgs();
	return data;
});

export const usercard = createAction(USERCARD, async(page,stype) => {
	const data = await userService.usercard(page,stype);
	return data;
});


export const userMedal = createAction(USERMEDAL, async() => {
	const data = await userService.userMedal();
	return data;
});


export const signIn = createAction(SIGNIN, userService.signIn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const signIns = createAction(SIGNINS, userService.signIns, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const userReward = createAction(USERREWARD, async(itype,page) => {
	const data = await userService.userReward(itype,page);
	return data;
});

export const userFollow = createAction(USERFOLLOW, async(ctype,page) => {
	const data = await userService.userFollow(ctype,page);
	return data;
});
export const userFollows = createAction(USERFOLLOWS, async(ask_id,ctype,page) => {
	const data = await userService.userFollows(ask_id,ctype,page);
	return data;
});

export const removeFollow = createAction(REMOVEFOLLOW, userService.removeFollow, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});


export const auserfollow = createAction(AUSERFOLLOW, userService.auserfollow, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const aremoveFollow = createAction(AREMOVEFOLLOW, userService.aremoveFollow, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const examPaper = createAction(EXAMPAPER, async(paper_id,levelId) => {
	const data = await userService.examPaper(paper_id,levelId);
	return data;
});

export const userLog = createAction(USER_LOG, userService.userLog, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const teacherUpInfo = createAction(TEACHERUPINFO, async() => {
	const data = await userService.teacherUpInfo();
	return data;
});

 
export const acollect = createAction(USER_ACOLLECT, userService.acollect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const aremovecollect = createAction(USER_AREMOVECOLLECT, userService.aremovecollect, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});

export const black = createAction(BLACK, async(page) => {
	const data = await userService.black(page);
	return data;
});


export const usercourse = createAction(USERCOURSE, async(toId,status,page) => {
	const data = await userService.usercourse(toId,status,page);
	return data;
});


export const userstudy = createAction(USERSTUDY, async(toId) => {
	const data = await userService.userstudy(toId);
	return data;
});

export const userCert = createAction(USERCERT, async(page) => {
	const data = await userService.userCert(page);
	return data;
});

export const userContent = createAction(USERCONTENT, async(ctype,page) => {
	const data = await userService.userContent(ctype,page);
	return data;
});
export const userAgent = createAction(USERAGENT, async(ctype,page) => {
	const data = await userService.userAgent(ctype,page);
	return data;
});

export const userBills = createAction(USERBILLS, userService.userBills, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const lotteryReceive = createAction('lotteryReceive', userService.lotteryReceive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const userHistory = createAction('userHistory', userService.userHistory, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const getRegion = createAction(GETREGION, userService.getRegion, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const bangdan = createAction(BANGDAN, userService.bangdan, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const leaveRoom = createAction('leaveRoom', userService.leaveRoom, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const vantLive = createAction(VANTLIVE, userService.vantLive, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});
export const companyList = createAction(COMPANYLIST, async() => {
	const data = await userService.companyList();
	return data;
});
export const editMobile = createAction(EDITMOBILE, userService.editMobile, ({resolved, rejected}) => {
	return {
		resolved,
		rejected,
	};
});