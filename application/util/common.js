export const formatTime = (second) => {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
      i = parseInt(s / 60);
      s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
      return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":");
}

export const live_forTimes = (duration) => {
    
    const time = duration;
    const  h = Math.floor(time / 3600);
    const  m = Math.floor((time / 60 % 60));
    const  s = Math.floor((time % 60));

    if(time !== 0){
        if (time < 60){
            return  '00:' + zero(s);
        } else if (time === 60 ){
        return  zero(1) + ':' + zero(0);
        } else if ( time > 60 && time < 3600){
            return  zero(m) + ':' + zero(s);
        } else if (time > 3600){
            return  zero(h) + ':' + zero(m) + ':' + zero(s);
        } 
    } else {
        return null;
    }
    
};


export const formatSTime = (second) => {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
      i = parseInt(s / 60);
      s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
      return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(i), zero(s)].join(":");
}

// 格式化时间戳为日期
export const formatTimeStampToTime = (timestamp) => {
    const date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // const hour = date.getHours() + ':';
    // const minutes = date.getMinutes() + ':';
    // const second = date.getSeconds();
    return `${year}-${month}-${day}`;
};


export const learnNum  = (number)  => {
    const learnNumber = parseInt(number);
    if (learnNumber < 10000){
        return learnNumber;
    } else if (learnNumber > 9999 && learnNumber < 100000000){
        return Math.floor(learnNumber / 10000) + '万';
    } else if (learnNumber > 99999999){
        return (learnNumber / 100000000).toFixed(1) + '亿';
    }
};


export const subNumTxt  = (courseName,number)  => {
    const coursetext = courseName;
    const num = number;

    if (num){
        if (coursetext.length > num){
          return coursetext.substring(0,num) + '...';
        } else {
            return coursetext.substring(0,num);
        }
    } else {
        return coursetext;
    }
};

export const subNumTxts  = (courseName,number)  => {
    const coursetext = courseName;
    const num = number;

    if (num){
        if (coursetext.length > num){
          return coursetext.substring(0,num) + '...';
        } else {
            return coursetext.substring(0,num);
        }
    } else {
        return coursetext;
    }
};


// 格式化时间
export const forTime = (duration) => {
    const time = duration;
    const  h = Math.floor(time / 3600);
    const  m = Math.floor((time / 60 % 60));
    const  s = Math.floor((time % 60));

    if (time < 60){
        return   s + '秒';
    } else if ( time > 60  && time < 3600){
        return  m + '分' + s + '秒';
    } else if (time > 3600){
        return  h + '小时' + m + '分' + s + '秒';
    }
};


function zero(obj){
    if (obj < 10){
        return '0' + obj;
    } else {
        return obj;
    }
}

export const forTimes = (duration) => {
    const time = duration;
    const  h = Math.floor(time / 3600);
    const  m = Math.floor((time / 60 % 60));
    const  s = Math.floor((time % 60));

    if (time < 60){
        return  '00:' + zero(s);
    } else if (time === 60 ){
    return  zero(1) + ':' + zero(0);
    } else if ( time > 60 && time < 3600){
        return  zero(m) + ':' + zero(s);
    } else if (time > 3600){
        return  zero(h) + ':' + zero(m) + ':' + zero(s);
    }
};


export const msgTime = (time) => {
    var  times = parseInt(time) * 1000

    var nowTime = new Date();
    var endTime = new Date(times);

    const year = endTime.getFullYear()
    const month = endTime.getMonth() + 1
    const day = endTime.getDate()
    const hour = endTime.getHours()
    const minute = endTime.getMinutes()

    const nowday = nowTime.getDate();

      
    var t = nowTime.getTime() - endTime.getTime() 
    var d = Math.floor(t/1000/60/60/24)


    var type_day = nowday  - day 


    if(t > 1){
      if (type_day === 0){
          return  zero(hour) + ':' + zero(minute) 
      } else if (type_day === 1){
            return '昨天 ' + zero(hour) + ':' + zero(minute)
        } else {
            return year+'-' + zero(month) +'-' + zero(day) +' ' + zero(hour) + ':' + zero(minute) 
        } 
    } else {
        return zero(hour) + ':' + zero(minute) 
    }
}

// 格式化 只显示 日月

export const formatdaymonths = (timestamp) => {
    const date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const year = date.getFullYear();
    const month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  
    return `${month}-${day}`
  }

  export const  dateDiff = (timestamp) => {
    // 补全为13位
    var arrTimestamp = (timestamp + '').split('');
    for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = '0';
        }
    }
    timestamp = arrTimestamp.join('') * 1;
  
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;
  
    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }
  
    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
  
    // 数值补0方法
    var zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };
  
    // 使用
    if (monthC > 12) {
        // 超过1年，直接显示年月日
        return (function () {
            var date = new Date(timestamp);
            return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
        })();
    } else if (monthC >= 1) {
        return parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';
  };


  export const liveday = (beg_time) => {
    var nowTime = new Date();
    var endTime = new Date(beg_time * 1000);


    const year = endTime.getFullYear()
    const month = endTime.getMonth() + 1
    const day = endTime.getDate()
    const hour = endTime.getHours()
    const minute = endTime.getMinutes()

    const nowday = nowTime.getDate();

      
    var t = endTime.getTime() - nowTime.getTime();
    var d=Math.floor(t/1000/60/60/24);

    var type_day = day - nowday 


    if(t > 1){
      if (type_day === 0){
          return '今天 ' + zero(hour) + ':' + zero(minute) + ' 开播'
        } else if (type_day === 1){
            return '明天 ' + zero(hour) + ':' + zero(minute) + ' 开播'
        } else if (type_day > 1){
            return year+'-' + zero(month) +'-' + zero(day) +' ' + zero(hour) + ':' + zero(minute) + ' 开播'
        }
    } else {
        return '即将开始'
    }
    
}

export function getExactTimes(time) {
    var date = new Date(time* 1000);
    var year = date.getFullYear() + '-';
    var month = (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1) + '-';
    var dates = zero(date.getDate()) + ' ';
    var hour = zero(date.getHours()) + ':';
    var min = zero(date.getMinutes()) 
    return year + month + dates + hour + min  ;
}

export function getExactTime(time) {
    var date = new Date(time* 1000);
    var year = date.getFullYear() + '-';
    var month = (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1) + '-';
    var dates = zero(date.getDate()) + ' ';
    var hour = zero(date.getHours()) + ':';
    var min = zero(date.getMinutes()) + ':';
    var second = zero(date.getSeconds());
    return year + month + dates + hour + min + second ;
  }

// 格式化时间
export const forTimer = (duration) => {
    const time = duration;
    const  h = Math.floor(time / 3600);
    const  m = Math.floor((time / 60 % 60));
    const  s = Math.floor((time % 60));
    
  
    if(time < 60){
        return  '00 : ' + zero(s) 
    } else if(60 < time  && time < 3600){
        return  zero(m) + " : " + zero(s) ;
    } else if (time > 3600){
        return  zero(h) + ":" + zero(m) + ":" + zero(s) ;
    }
  }
  export function countDown(ts){

	let _ts = parseInt(ts);

	let minute = Math.floor(_ts / 60);
	if (minute < 10) minute = '0' + minute;

	_ts = _ts % 60;
	if (_ts < 10) _ts = '0' + _ts;
	return minute + ':' + _ts;
}