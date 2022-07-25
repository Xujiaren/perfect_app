import {
    Platform,
	Dimensions,
} from 'react-native';

const uiWidthPx = 639;
const {width, height} = Dimensions.get('window');
const pxDp = 1 * width / uiWidthPx;
const isIphoneX = Platform.OS === 'ios' && height === 812;

export default {
    isIphoneX: isIphoneX,
	window: {
		width: width,
		height: height,
    },
    global:'#0067E2',
	base: {

        //背景颜色
        bg_blacks:{
            backgroundColor:'#000000',
        },
		bg_white: {
			backgroundColor: 'white',
        },
        bg_fa:{
            backgroundColor: '#fafafa',
        },
        bg_red:{
            backgroundColor: '#FF5047',
        },
        bg_f7f:{
            backgroundColor: '#F7F7F8',
        },
        bg_black:{
            backgroundColor:'#333333',
        },
        bg_orange:{
            backgroundColor: '#FFCE47',
        },
        bg_blue:{
            backgroundColor: '#58B1FF',
        },
        bg_green: {
            backgroundColor: '#99D321',
        },
        bg_dblue: {
            backgroundColor: '#0A86F9'
        },
        bg_brown:{
            backgroundColor: '#846358',
        },
        bg_gray:{
            backgroundColor: '#E9E9E9',
        },
        bg_sred:{
            backgroundColor:'#F4623F',
        },
        bg_wred:{
            backgroundColor:'#FFF0E5',
        },
        bg_rblack:{
            backgroundColor:'#535353',
        },
        bg_rangle:{
            backgroundColor:'#D3AB6B',
        },
        bg_clear:{
            backgroundColor:'transparent',
        },

        bg_pblue: {
            backgroundColor: '#5E99C1',
        },
        bg_pred: {
            backgroundColor: '#EF6565'
        },

        bg_fgreen: {
            backgroundColor: '#4BA87C'
        },
        bg_forest_yellow: {
            backgroundColor: '#FFF3B9'
        },
        bg_forest_blue: {
            backgroundColor: '#DDEAFF'
        },

        white_label:{
            color: '#ffffff',
        },
        black_label:{
            color:'#000000',
        },
        cd0_label: {
            color: '#D0D0D0',
        },
        c33_label:{
            color:'#333333',
        },
        gray_label:{
            color: '#666666',
        },
        tip_label:{
            color: '#999999',
        },
        sgray_label:{
            color:'#fafafa',
        },
        red_label:{
            color:'#FF5047',
        },
        sred_label:{
            color: '#F4623F',
        },
        lred_label:{
            color: '#FF6B00',
        },
        yellow_label: {
            color: '#FFF56E',
        },
        orange_label:{
            color:'#FFA71F',
        },
        lorange_label:{
            color:'#F0D97C',
        },
        torange_label:{
            color:'#FEA800',
        },
        sorange_label:{
            color:'#FFA349',
        },
        morange_label:{
            color:'#FFFA70',
        },
        dorangle_label:{
            color:'#DBB177',
        },
        forangle_label:{
            color:'#FDEBCD',
        },
        horange_label: {
            color: '#F66A02'
        },
        green_label:{
            color:'#82C963',
        },
        blue_label:{
            color:'#65AFE8',
        },
        brown_label:{
            color:'#846358',
        },
        f5_label:{
            color: '#F5F5F5',
        },
        sbrown_label:{
            color:'#8B3B06',
        },
        wred_label:{
            color:'#FFF0E5',
        },
        c93_label:{
            color:'#909399'
        },
        c30_label:{
            color:'#303133'
        },
        cf5_label:{
            color:'#F5A623'
        },
        forest_green_label: {
            color: '#4BA87C'
        },
        forest_grown_label: {
            color: '#8B572A'
        },
        forest_blue_label: {
            color: '#0575FF'
        },

        // 字体大小
        lg80_label:{
            fontSize: 80,
        },
        lg40_label:{
            fontSize: 40,
        },
        lg36_label:{
            fontSize: 36,
        },
        lg30_label:{
            fontSize: 30,
        },
        lg28_label: {
            fontSize: 28,
        },
        lg26_label:{
            fontSize: 26,
        },
        lg24_label:{
            fontSize: 24,
        },
        lg22_label: {
            fontSize: 22,
        },
        lg20_label: {
			fontSize: 20,
        },
        lg18_label:{
            fontSize: 18,
        },
        lg_label: {
            fontSize: 16,
        },
        lg15_label: {
            fontSize: 15,
        },
        default_label:{
            fontSize: 14,
        },
        sml_label:{
            fontSize: 13,
        },
        sm_label: {
            fontSize: 12,
        },
        smm_label:{
            fontSize: 10,
        },
        sm9_label:{
            fontSize: 9,
        },
        sm8_label:{
            fontSize:8,
        },

        // margin 距离

        mt_1:{
            marginTop: 1,
        },
        mb_1: {
            marginBottom: 1,
        },
        mt_2:{
            marginTop: 2,
        },
        m_5: {
            margin: 5,
        },
        mt_5: {
            marginTop: 5,
        },
        mr_5:{
            marginRight: 5,
        },
        mb_5:{
            marginBottom: 5,
        },
        ml_5: {
            marginLeft: 5,
        },
        m_8: {
            margin: 8,
        },
        mt_8: {
            marginTop: 8,
        },
        mr_8:{
            marginRight: 8,
        },
        mb_8:{
            marginBottom: 8,
        },
        ml_8: {
            marginLeft: 8,
        },
        m_10: {
            margin: 10,
        },
        mt_10: {
            marginTop: 10,
        },
        mr_10:{
            marginRight: 10,
        },
        mb_10: {
            marginBottom: 10,
        },
        ml_10: {
            marginLeft: 10,
        },
        m_12: {
            margin: 12,
        },
        mt_12: {
            marginTop: 12,
        },
        mr_12:{
            marginRight: 12,
        },
        mb_12: {
            marginBottom: 12,
        },
        ml_12: {
            marginLeft: 12,
        },
        m_15: {
            margin: 15,
        },
        mt_15: {
            marginTop: 15,
        },
        mr_15:{
            marginRight: 15,
        },
        mb_15: {
            marginBottom: 15,
        },
        ml_15: {
            marginLeft: 15,
        },
        m_20: {
            margin: 20,
        },
        mt_20: {
            marginTop: 20,
        },
        mr_20:{
            marginRight: 20,
        },
        mb_20: {
            marginBottom: 20,
        },
        ml_20: {
            marginLeft: 20,
        },
        m_25: {
            margin: 25,
        },
        mt_25: {
            marginTop: 25,
        },
        mr_25:{
            marginRight: 25,
        },
        mb_25: {
            marginBottom: 25,
        },
        ml_25: {
            marginLeft: 25,
        },
        m_30: {
            margin: 30,
        },
        mt_30: {
            marginTop: 30,
        },
        mr_30:{
            marginRight: 30,
        },
        mb_30: {
            marginBottom: 30,
        },
        ml_30: {
            marginLeft: 30,
        },
        m_40: {
            margin: 40,
        },
        mt_40: {
            marginTop: 40,
        },
        mr_40:{
            marginRight: 40,
        },
        mb_40: {
            marginBottom: 40,
        },
        ml_40: {
            marginLeft: 40,
        },
        m_50: {
            margin: 50,
        },
        mt_50: {
            marginTop: 50,
        },
        mr_50:{
            marginRight: 50,
        },
        mb_50: {
            marginBottom: 50,
        },
        ml_50: {
            marginLeft: 50,
        },
        m_60: {
            margin: 60,
        },
        mt_60: {
            marginTop: 60,
        },
        mr_60:{
            marginRight: 60,
        },
        mb_60: {
            marginBottom: 60,
        },
        ml_60: {
            marginLeft: 60,
        },
        m_70: {
            margin: 70,
        },
        mt_70: {
            marginTop: 70,
        },
        mr_70:{
            marginRight: 70,
        },
        mb_70: {
            marginBottom: 70,
        },
        ml_70: {
            marginLeft: 70,
        },
        m_100: {
            margin: 100,
        },
        mt_100: {
            marginTop: 100,
        },
        mr_100:{
            marginRight: 100,
        },
        mb_100: {
            marginBottom: 100,
        },
        ml_100: {
            marginLeft: 100,
        },

       // padding 距离
        p_3: {
            padding: 3,
        },
        pt_3:{
            paddingTop: 3,
        },
        pr_3: {
            paddingRight: 3,
        },
        pb_3:{
            paddingBottom:3,
        },
        pl_3: {
            paddingLeft: 3,
        },
        p_5: {
            padding: 5,
        },
        pt_5:{
            paddingTop: 5,
        },
        pr_5: {
            paddingRight: 5,
        },
        pb_5:{
            paddingBottom:5,
        },
        pl_5: {
            paddingLeft: 5,
        },
        p_8: {
            padding: 8,
        },
        pt_8:{
            paddingTop: 8,
        },
        pr_8: {
            paddingRight: 8,
        },
        pb_8:{
            paddingBottom:8,
        },
        pl_8: {
            paddingLeft: 8,
        },
        p_10: {
            padding: 10,
        },
        pt_10:{
            paddingTop: 10,
        },
        pr_10: {
            paddingRight: 10,
        },
        pb_10:{
            paddingBottom:10,
        },
        pl_10: {
            paddingLeft: 10,
        },
        p_12: {
            padding: 12,
        },
        pt_12:{
            paddingTop: 12,
        },
        pr_12: {
            paddingRight: 12,
        },
        pb_12:{
            paddingBottom:12,
        },
        pl_12: {
            paddingLeft: 12,
        },
        p_15: {
            padding: 15,
        },
        pt_15:{
            paddingTop: 15,
        },
        pr_15: {
            paddingRight: 15,
        },
        pb_15:{
            paddingBottom:15,
        },
        pl_15: {
            paddingLeft: 15,
        },
        p_20: {
            padding: 20,
        },
        pt_20:{
            paddingTop: 20,
        },
        pr_20: {
            paddingRight: 20,
        },
        pb_20:{
            paddingBottom:20,
        },
        pl_20: {
            paddingLeft: 20,
        },
        p_25: {
            padding: 25,
        },
        pt_25:{
            paddingTop: 25,
        },
        pr_25: {
            paddingRight: 25,
        },
        pb_25:{
            paddingBottom:25,
        },
        pl_25: {
            paddingLeft: 25,
        },
        p_30: {
            padding: 30,
        },
        pt_30:{
            paddingTop: 30,
        },
        pr_30: {
            paddingRight: 30,
        },
        pb_30:{
            paddingBottom:30,
        },
        pl_30: {
            paddingLeft: 30,
        },
        p_35: {
            padding: 35,
        },
        pt_35:{
            paddingTop: 35,
        },
        pr_35: {
            paddingRight: 35,
        },
        pb_35:{
            paddingBottom:35,
        },
        pl_35: {
            paddingLeft: 35,
        },
        p_40: {
            padding: 40,
        },
        pt_40:{
            paddingTop: 40,
        },
        pr_40: {
            paddingRight: 40,
        },
        pb_40:{
            paddingBottom:40,
        },
        pl_40: {
            paddingLeft: 40,
        },
        p_50: {
            padding: 50,
        },
        pt_50:{
            paddingTop: 50,
        },
        pr_50: {
            paddingRight: 50,
        },
        pb_50:{
            paddingBottom:50,
        },
        pl_50: {
            paddingLeft: 50,
        },
        pb_200:{
            paddingBottom: 200,
        },
        // 圆角
        circle_2: {
			borderRadius: 2,
        },
        circle_5:{
            borderRadius: 5,
        },
        circle_6:{
            borderRadius: 6,
        },
        circle_8: {
			borderRadius: 8,
        },
        circle_10: {
			borderRadius: 10,
        },
        circle_12: {
            borderRadius: 12,
        },
        circle_16: {
			borderRadius: 16,
        },
        circle_18: {
			borderRadius: 18,
        },
        circle_20: {
			borderRadius: 20,
        },
        circle_26: {
            borderRadius: 26,
        },



        // 宽度
        wh_60:{
            width:60,
        },
        wh_80:{
            width:80,
        },
        wh_90:{
            width:90,
        },
        wh_100:{
            width:100,
        },
        wh_160:{
            width:160,
        },
        wh_120:{
            width:120,
        },
        wh_246:{
            width:246,
        },
        wh_270:{
            width:270,
        },
        wh_200:{
            width:200,
        },
        wh_300:{
            width:300,
        },

        //高度
        h_32:{
            height:32,
        },
        h_40:{
            height:40,
        },
        h_60:{
            height:60,
        },
        h_80:{
            height:80,
        },
        h_85:{
            height:85,
        },
        h_100:{
            height:100,
        },
        h_120:{
            height:120,
        },
        h_150:{
            height:150,
        },



        //flex 样式
        row: {
            flexDirection: 'row',
        },
        fd_r:{
            flexDirection: 'row',
        },
        f_wrap:{
            flexWrap:'wrap',
        },
        fd_c:{
            flexDirection: 'column',
        },
        ai_sb:{
            alignContent: 'space-between',
        },
        ai_ct: {
            alignItems: 'center',
        },
        ai_fs:{
            alignItems: 'flex-start',
        },
        ai_end: {
            alignItems: 'flex-end',
        },
        jc_ct: {
            justifyContent: 'center',
        },
        jc_fs:{
            justifyContent: 'flex-start',
        },
        jc_fe:{
            justifyContent: 'flex-end',
        },
        jc_sb: {
            justifyContent: 'space-between',
        },
        jc_ad: {
            justifyContent: 'space-around',
        },

        // text
        center_label: {
            textAlign: 'center',
        },
        right_label: {
            textAlign: 'right',
        },

        //border
        border_left: {
            borderLeftWidth: 1,
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        border_rt:{
            borderRightColor: '#F5F5F5',
            borderStyle:'solid',
            borderRightWidth: 1,
        },
        border_bt:{
            borderBottomColor: '#F8F8F8',
            borderStyle:'solid',
            borderBottomWidth: 1,
        },
        border_top:{
            borderTopColor: '#EAEAEA',
            borderStyle:'solid',
            borderTopWidth: 1,
        },
        border_primary: {
            borderWidth: 1,
            borderColor: '#8838FB',
        },
        border_orange: {
            borderWidth: 1,
            borderColor: '#F4623F'
        },
        border_white: {
            borderWidth: 1,
            borderColor: 'white'
        },
        border_tip: {
            borderWidth: 1,
            borderColor: '#E4E4E4'
        },


        // flex
        container: {
			flex: 1,
			backgroundColor: '#FAFAFA',
        },
        col_1: {
            flex: 1,
        },
        col_2: {
            flex: 2,
        },
        col_3:{
            flex: 3,
        },
        col_4: {
            flex: 4
        },
        col_5: {
            flex: 5
        },
        col_6: {
            flex: 6
        },
        col_8: {
            flex: 8
        },
        modal: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },

        disabledContainer: {
            opacity: 0.5,
        },

        // 行高
        lh25_label:{
            lineHeight: 25,
        },
        lh20_label: {
            lineHeight: 20,
        },
        lh18_label: {
            lineHeight: 18,
        },
        lh16_label:{
            lineHeight: 16,
        },
        lh14_label:{
            lineHeight: 14,
        },



        // 字体粗细
        fw_label:{
            fontWeight:'bold',
        },
        fw6_label:{
            fontWeight:'600',
        },
        fw4_label:{
            fontWeight:'400',
        },
        fw2_label:{
            fontWeight:'200',
        },

        //中间横线

        ul_label: {
			textDecorationLine: 'line-through',
        },
        ue_label: {
			textDecorationLine: 'underline',
        },

        avatar_small:{
            width:36,
            height:36,
            borderRadius:18,
        },


        //字体图片
        icon: {
			fontFamily: 'iconfont',
			fontSize: 18,
        },

        icon_small: {
            width: 12,
            height: 12,
        },

        over_h:{
            overflow: 'hidden',
        },

        toolbar: {
            height: 50,
        },

        shadow: {
            shadowOffset:{  width: 0,  height:5},
            shadowColor: 'rgba(240,240,240,1)',
            shadowOpacity: 0.5,
            elevation: 1,
        },

        dshadow: {
            shadowOffset:{  width: 0,  height:5},
            shadowColor: 'rgba(240,240,240,1)',
            shadowOpacity: 1,
            elevation: 2,
        }
	},
};
