/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
    const paramUrl = url.split('?')[1]
    const keyValueArr = paramUrl && paramUrl.split('&')
    let paramObj = {}
    keyValueArr && keyValueArr.forEach(item => {
        const keyValue = item.split('=')
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
}

export const getEnclosureType = fileName =>{
    const arry = fileName.split('.')
    const fileSuffix = arry[arry.length-1]
    const typeList = ['doc|docx|docm|dotx|dotm|xls|xlsx|xlsm|xltx|xltm|xlsb|xlam|ppt|pptx|pptm|ppsx|ppsm|potx|potm|ppam','pdf','mp4']
    const index = typeList.findIndex(item=>item.includes(fileSuffix))
    let enclosureType = null
    switch (index) {
        case 0:
            enclosureType = {id:'5',name:'office类'}
            break
        case 1:
            enclosureType = {id:'4',name:'PDF类'}
            break
        case 2:
            enclosureType = {id:'1',name:'视频类'}
            break
    }
    return enclosureType
}

// 设置时间显示
export function setTime(diffValue = 0) {
    if (diffValue <= 0) {
        return '刚刚'
    }

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const monthC = diffValue / month;
    const weekC = diffValue / (7 * day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    let result = ''
    if (monthC >= 1) {
        result = parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        result = parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = parseInt(minC) + "分钟前";
    } else {
        result = '刚刚'
    }

    return result
}

// 生成uuid
export function guid() {
    var s = [];
    var hexDigits = "abcdefABCDEF";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    var uuid = s.join("");
    return uuid;
}

// 数字转中文
export function toChinesNum(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
            newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
    };
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

// 用正则表达式实现html编码（转义)
export function htmlEncodeByRegExp(str) {
    let temp = ""
    if (str.length == 0) return ""
    temp = str.replace(/&/g, "&amp;")
    temp = temp.replace(/</g, "&lt;")
    temp = temp.replace(/>/g, "&gt;")
    temp = temp.replace(/\s/g, "&nbsp;")
    temp = temp.replace(/\'/g, "&#39;")
    temp = temp.replace(/\"/g, "&quot;")
    return temp
}

// 用正则表达式实现html解码（反转义）
export function htmlDecodeByRegExp(str) {
    var temp = "";
    if (str.length == 0) return "";
    temp = str.replace(/&amp;/g, "&");
    temp = temp.replace(/&lt;/g, "<");
    temp = temp.replace(/&gt;/g, ">");
    temp = temp.replace(/&nbsp;/g, " ");
    temp = temp.replace(/&#39;/g, "\'");
    temp = temp.replace(/&quot;/g, "\"");
    return temp;
}

// 去除字符串中html标签
export function delHtmlTag(str){
    return str.replace(/<[^>]+>/g,"");
}

// 格式化数据取整 例如：1,11,11,111.11
export function setStringNumber(number = '', hasDecimal = true) {
    if (number === '' || Number.isNaN(Number(number))) {
        return number
    }
    const numberStr = number.toString()
    const numberArr = numberStr.split('.')
    let decimal = '00'

    if (numberArr.length > 1) {
        decimal = numberArr[1].padEnd(2, '00')

        if (decimal.length > 2) {
            decimal = decimal.substring(0,2);
        }
    }

    const integer = numberArr[0]
    const integerArr = integer.split('')

    let newNumber = ''

    integerArr.forEach((item, index) => {
        newNumber += item

        if (integerArr.length - index === 4 || integerArr.length - index === 6 || integerArr.length - index === 8) {
            newNumber += ','
        }
    })

    if (!hasDecimal) {
        return newNumber
    }

    return newNumber + '.' + decimal
}

// 元转分
export function yuanToCent(_this, number) {
    let cent = ''

    if (_this.$u.test.amount(number)) { // 判断是否为金额
        const numberNum = Number(number)
        const centStr = numberNum.toString()
        const centArr = centStr.split('.')

        if (centArr.length > 1) {
            cent = Number(centArr[0]) * 100 + Number(centArr[1].padEnd(2, '0'))
        } else {
            cent = numberNum * 100
        }
    } else if (number === 0 || number === '0') {
        cent = 0
    }

    return cent
}

// 分转元
export function centToYuan(_this, number) {
    let yuan = ''

    if (_this.$u.test.amount(number)) { // 判断是否为金额
        const numberNum = Number(number)
        const centStr = numberNum.toString()
        const centArr = centStr.split('.')

        if (centArr.length > 1) {
            const newNumber = Number(centArr[0] + centArr[1])
            const centArr2L = centArr[1].length
            const multiple = 100 * Number.Math.pow(10, centArr2L)

            yuan = newNumber / multiple
        } else {
            yuan = numberNum / 100
        }
    } else if (number === 0 || number === '0') {
        yuan = 0
    }

    return yuan
}

// 获取几天前或几天后的时间方法
export function getDateArr(days){

    var today=new Date();　　//今天

    var daysData=[];　　　　//定义一个空数组存放数据

    for(var i=0;i<days;i++){

        var day=i*24*60*60*1000;　　//每天的时间戳差值

        var todayTimeStamp=today.getTime();　　//今天的时间戳

        var finalDay=new Date(todayTimeStamp-day);　　//最后一天的时间戳 ，几天前是减 ，几天后就改成加

        var Y=finalDay.getFullYear();　　　//年

        var M=finalDay.getMonth()+1;　　//月

        var D=finalDay.getDate();　　　　//日

        //将月和日格式标准化组合成需要的格式

        if(M.toString().length == 1){

            M="0"+M;

        }

        if(D.toString().length == 1){

            D="0"+D;

        }

        var timeData=Y+"-"+M+"-"+D;

        daysData.push(timeData);　　//添加进数组

    }
    return daysData

}
