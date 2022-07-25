import createReducer from '../../util/reduce';

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

const initialState = {
    o2o:{},
    o2oSkill:{},
    o2oDetail:{},
    o2oSquad:{},
    o2oVideo:[],
    o2oTopic:{},
	o2oExamPaper:{},
	configCateNewCert:[],
	studyStatus:{},
	studyInfo:{},
	testInfo:{},
	privileges:{},
} 

const actionHandler = {

    [O2O]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2o: {
				...payload,
			},
		};
    },
    
    [O2O_SKILL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2oSkill: {
				...payload,
			},
		};
    },

    [O2O_DETAIL]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2oDetail: {
				...payload,
			},
		};
    },

    [O2O_SQUAD]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2oSquad: {
				...payload,
			},
		};
    },

    [O2O_VIDEO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2oVideo:payload,
		};
    },

    [O2O_TOPIC]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2oTopic: {
				...payload,
			},
		};
    },

    [O2O_EXAMPAPER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			o2oExamPaper: {
				...payload,
			},
		};
	},

	[SQUARD_APPLY]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[SQUARD_CERT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[CONFIG_CATENEWCERT]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			configCateNewCert:payload,
		};
    },

	[STUDY_STATUS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			studyStatus: {
				...payload,
			},
		};
	},

	[STUDY_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			studyInfo: {
				...payload,
			},
		};
	},

	[TOPIC_ANSWER]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[TEST_INFO]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			testInfo: {
				...payload,
			},
		};
	},
	
	[USER_EXAM]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},

	[PRIVILEGES]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
			privileges: {
				...payload,
			},
		};
	},

	[SQUAD_APPLYS]: (state, action) => {
		const { payload, error, meta = {} } = action;
		return {
			...state,
		};
	},
}

export default createReducer(initialState, actionHandler);