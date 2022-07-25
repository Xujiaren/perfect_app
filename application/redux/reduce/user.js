import createReducer from '../../util/reduce';

const {
	USER,
	USER_PROFILE, 
	USER_REGION,
	USER_PWD,
	USER_LEVEL, 
	PROFILE, 
	USER_INTEGRAL, 
	USER_COUPON,

	USER_BLACK,
	BLACK,

	USERCOURSE,
	USERSTUDY,
	
	LIKE_REMOVE, 
	LIKE_PUBLISH, 
	REWARD_PUBLISH,
	
	USERAUTH, 
	FEEDBACK, 
	CATEFEEDBACK,
	CATEQUESTION, 
	USERCOLLECT, 
	USERACOLLECT,
	
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

const initialState = {
	auser:{},
	user: {},
	userinfo:{},

	userintegral:{},
	feedback:{},
	usercollect:{},
	userAcollect:{},
	userlevel:[],
	catefeedback:[],

	usertask:{},
	userinvite:{},
	inviteImgs:[],
	
	usercard:{},
	userMedal:[],
	userReward:{},
	userFollow:{},
	userFollows:{},
	configHelp:[],
	cateQuestion:[],
	teacherUpInfo:[],
	back:{},
	userCourse:{},
	userstudy:{},
	userCert:{},
	userContent:{},
	userAgent:{},
	userCoupon:{},
	companylist:[],
};

const actionHandler = {
	[USER_PWD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[USER_PROFILE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			auser: {
				...payload,
			}
		};
	},
	
	[PROFILE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[USER_REGION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[USER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			user: error ? {} : payload,
		};
	},

	[USER_LEVEL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userlevel: error ? [] : payload,
		};
	},

	[USER_BLACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LIKE_REMOVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[LIKE_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[REWARD_PUBLISH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[USER_INTEGRAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userintegral: {
				...payload,
			},
		};
	},

	[USERAUTH]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[FEEDBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			feedback: {
				...payload,
			},
		};
	},

	[USERCOLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			usercollect: {
				...payload,
			},
		};
	},

	[USERACOLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userAcollect: {
				...payload,
			},
		};
	},

	[CATEFEEDBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			catefeedback: payload,
		};
	},

	
	[CATEQUESTION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			cateQuestion: payload,
		};
	},

	[CONFIGHELP]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			configHelp: payload,
		};
	},

	[USERTASK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			usertask: payload,
		};
	},

	[INVITESTAT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			invitestat: {
				...payload,
			},
		};
	},

	[USERINVITE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userinvite: {
				...payload,
			},
		};
	},

	[PUSHFEEDBACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[INVITECODE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	
	[INVITEIMGS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			inviteImgs: payload,
		};
	},

	[USERCARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			usercard: {
				...payload,
			},
		};
	},

	[USERMEDAL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userMedal: payload,
		};
	},
	
	[SIGNIN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[SIGNINS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	
	[USERREWARD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userReward: {
				...payload,
			},
		};
	},
	
	[USERFOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userFollow: {
				...payload,
			},
		};
	},
	[USERFOLLOWS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userFollows: {
				...payload,
			},
		};
	},

	[REMOVEFOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[AUSERFOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[AREMOVEFOLLOW]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[EXAMPAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			examPaper: {
				...payload,
			},
		};
	},
	
	[USER_LOG]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[TEACHERUPINFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			teacherUpInfo: payload,
		};
	},

	[USER_ACOLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[USER_AREMOVECOLLECT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	
	[BLACK]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			back: {
				...payload,
			},
		};
	},

	[USERCOURSE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userCourse: {
				...payload,
			},
		};
	},

	[USERSTUDY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userstudy: {
				...payload,
			},
		};
	},

	[USERCERT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userCert: {
				...payload,
			},
		};
	},

	[USERCONTENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userContent: {
				...payload,
			},
		};
	},

	[USERAGENT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userAgent: {
				...payload,
			},
		};
	},

	[USER_COUPON]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			userCoupon: {
				...payload,
			},
		};
	},

	[USERBILLS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[GETREGION]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[BANGDAN]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[VANTLIVE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
	[COMPANYLIST]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			companylist:payload
		};
	},
	[EDITMOBILE]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
};

export default createReducer(initialState, actionHandler);
