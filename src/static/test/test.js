/**
 * 工具静态函数
 */
function isStatic(value) { //检测数据是不是原始数据
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        typeof value === 'symbol' ||
        value === null //==会进行类型转换 ===不会进行类型转换 也就是说===一旦类型不同直接false
    )
}
function isObject(value) { //判断数据是不是引用数据类型
    let type = typeof value;
    return value !== null && (type == 'object' || type == 'function');
}
function isArray(value) { //检测数据是不是数组 原因typeof 无法返回array js中怪异的行为和规范之一就是Array的类型Object
    //1.instanceof 判断左边对象是否为右边类的实例
    return (
        value instanceof Array ||
        Array.isArray(value) ||
        Object.prototype.toString.call(value) == '[object Array]'
    )
}
function isType(value) { //检测数据是什么类型
    let type = Object.prototype.toString.call(value);
    //js原始数据类型-基本：string number boolean nudefined null symbol(ES6)
    //js原始数据类型-复杂：Object 复杂类型包括：Function Array Date RegExp
    switch (type) {
        case "[object String]":
            return "字符串";
        case "[object Number]":
            return "数字";
        case "[object Boolean]":
            return "布尔";
        case "[object Undefined]":
            return "未定义";
        case "[object Null]":
            return "空";
        case "[object Function]":
            return "函数";
        case "[object Array]":
            return "数组";
        case "[object Date]":
            return "日期";
        case "[object RegExp]":
            return "正则";
        case "[object Object]":
            return "对象";
    }
}
function getRawType(value) {//返回值的类型
    return Object.prototype.toString.call(value).slice(8, -1); //-1 表示最后一个字符（不包括）
}
function isNative(value) { //判断value是否为浏览器内置函数  内置函数toString后的主体代码块为 [native code] ，而非内置函数则为相关代码
    return typeof value === 'function' && (/native code/.test(value.toString()) || cutStrByStr);
}
function isEmpty(value) { //判断value是否为null
    if(value == null) return true;
    if(Object.prototype.toString.call(value) === '[object Array]') return value.length;
    if(Object.prototype.toString.call(value) === '[object Object]') {
        for(let key in value) {
            if(value.hasOwnProperty(key)) {
                return false;
            }
        }
    }
}

/**
 * 工具功能函数
 */
function cached(fn) { //记忆函数：缓存函数的运算结果
    let cache = Object.create(null);
    return function cacheFn(str) {
        let hit = cache[str];
        return hit || (cache[str] = fn(str))
    }
}
function camelize(str) {//_命名替换为驼峰命名
    return str.replace(/_(\w)/g, function(z, a, b) {
        console.log(z);//匹配到的字符_s
        console.log(a);//第一个括号的字符s
        console.log(b);//下标
        return a ? a.toUpperCase(): '';
    })
}
function hyphenate(str) {//驼峰命名转_命名
    return str.replace(/\B[A-Z]/g, function(z) {
        console.log(z);
        return z ? '_' + z.toLowerCase() : '';
    });
    //or str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}
function capitalize(str) {//字符串首位大写
    return str.charAt(0).toUpperCase() + str.slice(1)
}
function extend(to, _from) {//将属性混合到目标对象中
    for(let key in _from) {
        to[key] = _from[key];
    }
    return to
}
function simpleClone() {//对象属性复制，浅拷贝 Object.assign方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
    Object.assign = Object.assign || function() {
        if(arguments.length == 0) throw new TypeError('Cannot convert undefined or null to object');
        let target = arguments[0], args = Array.prototype.slice.call(arguments, 1), key;
        args.forEach(function(item) {
            for(key in item) {
                item.hasOwnProperty(key) && (target[key] = item[key]);
            }
        });
        return target;
    }
    //or let clone = JSON.parse( JSON.stringify(String) );
}
function deepClone(value, deep) {//深拷贝 有待研究
    if(isStatic(value)){
        return value
    }
    if(isType(value) === "数组") { //数组
        value =  Array.prototype.slice.call(value);
        return value.map(item => deep ? deepClone(item, deep) : item)
    } else if(isType(value) === "对象") {//对象
        let target = {}, key;
        for(key in value) {
            value.hasOwnProperty(key) && (target[key] = deep ? deepClone(value[key], deep) : value[key])
        }
    }
    let type = getRawType(value);
    switch(type){
        case 'Date':
        case 'RegExp':
        case 'Error': value = new window[type](value); break;
    }
    return value
}
function getBrowser() { //识别各种浏览器及平台 Navigator 对象包含有关浏览器的信息。
    let inBrowser = typeof window !== 'undefined'; //运行环境是浏览器
    //运行环境是微信
    let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
    let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
    //浏览器 UA 判断
    let UA = inBrowser && window.navigator.userAgent.toLowerCase();
    let isIE = UA && /msie|trident/.test(UA);
    let isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    let isEdge = UA && UA.indexOf('edge/') > 0;
    let isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
    let isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
    let isChrome = UA && /chrome\d+/.test(UA) && !isEdge;
}
function getExplorerInfo() {//获取浏览器信息
    let t = navigator.userAgent.toLowerCase();
    return 0 <= t.indexOf("msie") ? { //ie < 11
        type: "IE",
        version: Number(t.match(/msie\/([d]+)/)[1])
    } : !!t.match(/trident\.+?rv:(([d.]+))/) ? { // ie 11
        type: "IE",
        version: 11
    } : 0 <= t.indexOf("edge") ? {
        type: "Edge",
        version: Number(t.match(/edge\/([\d]+)/)[1])
    } : 0 <= t.indexOf("firefox") ? {
        type: "Firefox",
        version: Number(t.match(/firefox\/([\d]+)/)[1])
    } : 0 <= t.indexOf("chrome") ? {
        type: "Chrome",
        version: Number(t.match(/chrome\/([\d]+)/)[1])
    } : 0 <= t.indexOf("opera") ? {
        type: "Opera",
        version: Number(t.match(/opera\.([\d]+)/)[1])
    } : 0 <= t.indexOf("Safari") ? {
        type: "Safari",
        version: Number(t.match(/version\/([\d]+)/)[1])
    } : {
        type: t,
        version: -1
    }
}
function isPCBroswer() { //检测是否为PC端浏览器模式
    let e = navigator.userAgent.toLowerCase()
        , t = "ipad" == e.match(/ipad/i)
        , i = "iphone" == e.match(/iphone/i)
        , r = "midp" == e.match(/midp/i)
        , n = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i)
        , a = "ucweb" == e.match(/ucweb/i)
        , o = "android" == e.match(/android/i)
        , s = "windows ce" == e.match(/windows ce/i)
        , l = "windows mobile" == e.match(/windows mobile/i);
    return !(t || i || r || n || a || o || s || l)
}
function unique() {//数组去重 6种方法 1.indexOf 2.ES6的includes 3.把数组的值作为对象的属性(key)(效率最高) 判断key 4.双重for  5.排序后比较相邻 6.ES6 Set(效率第二)
    function qc(arr) {//1 indexOf 2. if(arr.indexOf(arr[i])==i){
        let ret = [];
        for(let i = 0; i < arr.length; i++) {
            // if(arr.indexOf(arr[i]) === i) { //判断出现的首位置
            //     ret.push(arr[i]);
            // }
            if(ret.indexOf(arr[i]) < 0) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    function qc1(arr) {//2 includes
        let ret = [];
        for(let i = 0; i < arr.length; i++) {
            if(!ret.includes(arr[i])) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    function qc2(arr) {//3 key
        let ret = [];
        let obj = {};
        arr.forEach(item => {
            if(!obj[item]) {
                obj[item] = true;
                ret.push(item);
            }
        });
        return ret;
    }
    function qc3(arr) {//4 双重for 2种方法 1.比较arr有重复就 arr.splice(j, 1) 2.比较arr和ret，通过一个状态标记来确认是否push ret中没有就push（外层arr内层ret）
        let ret = [];
        for(let i = 0, len = arr.length; i < len; i++) {
            for(let j = i+1; j < len; j++) {
                if(arr[i] === arr[j]) {
                    arr.splice(j, 1);
                    // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
                    len--;
                    j--; //j-- 3已经截掉 继续回到3就是回到之前的4
                }
            }
        }
        //2.
        for(let i = 0, len = arr.length; i < len; i++) {
            let sta = true;
            for(let j = 0; j < ret.length; j++) {
                if(ret[j] === arr[i]){
                    sta = false;
                    break;
                }
            }
            if(sta) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    function qc4(arr) { //排序后比较相邻 !== push
        let ret = [arr[0]];
        arr = arr.sort();
        for(let i = 1; i < arr.length; i++) {
            arr[i] !== arr[i-1] && ret.push(arr[i]);
        }
        return ret;
    }
    function qc5(arr) { //ES6 Set ，类似于数组，但 Set 的成员具有唯一性 基于这一特性，就非常适合用来做数组去重了
        return Array.from(new Set([...arr])); //ES6：Array.from()方法从一个类似数组或可迭代对象中创建一个新的数组实例。
    }
}
function Set(arr) {//Set的简单实现
    window.Set = window.Set || function() {
        function SetRe(arr) {
            this.items = arr ? qc1(arr): [];
            this.size = arr.length;
        }
        SetRe.prototype = {
            add: function(v) {
                if(!this.has(v)) {
                    this.items.push(v);
                    this.size++;
                }
            },
            clear: function() {
                this.items = [];
                this.size = 0;
            },
            remove: function(v) {
                return this.items.some((item, index) => {
                    if(v === item) {
                        this.items.splice(index, 1);
                        return true;
                    }
                    return false;
                });
            },
            has: function(v) {
                return this.items.some(item => item === v)
            },
            getValues: function() {
                return this.items
            }
        }
    }
}
function repeat(str, n) {//生成一个重复的字符串，有n个str组成，可修改为填充为数组等 OR str.repeat(次数2)
    let res = '';
    while(n) {
        if(n % 2 === 1) {
            res += str;
        }
        if(n > 1) {
            str += str;
        }
        n >>= 1;
    }
    return res;
}
function dateFormater(formater, t) {//格式化时间
    let date = t ? new Date(t) : new Date(),
        Y = date.getFullYear() + '',
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    return formater.replace(/YYYY|yyyy/g, Y)
        .replace(/YY|yy/g, Y.substr(2,2))
        .replace(/MM/g, (M<10?'0':'') + M)
        .replace(/DD/g, (D<10?'0':'') + D)
        .replace(/HH|hh/g,(H<10?'0':'') + H)
        .replace(/mm/g,(m<10?'0':'') + m)
        .replace(/ss/g,(s<10?'0':'') + s)
}
function dateStrForma(str, from, to) { //将指定字符串由一种时间格式转化为另一种
    str += '';
    let Y = '';
    if((Y = from.indexOf('YYYY')) >= 0){
        Y = str.substr(Y, 4);
        to = to.replace(/YYYY|yyyy/g, Y);
    } else if((Y = from.indexOf('YY')) >= 0) {
        Y = str.substr(Y, 2);
        to = to.replace(/YY|yy/g, Y);
    }
    let k,i;
    ['M','D','H','h','m','s'].forEach(s => {
        i = from.indexOf(s+s);
        k = ~i ? str.substr(i, 2) : '';
        to = to.replace(s+s, k);
    });
    return to;
    //'2019年06月26日'.replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1-$2-$3') 正则实现
}
function getPropByPath(obj, path, strict) { //根据字符串路径获取对象属性 : 'obj[0].count'
    let tempObj = obj;
    path = path.replace(/[(\w+)]/g, '.$1'); //将[0]转化为.0
    path = path.replace(/^\./, ''); //去除开头的.
    let keyArr = path.split('.'); //根据.切割
    let i = 0;
    for(let len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) break;
        let key = keyArr[i];
        if (key in tempObj) {
            tempObj = tempObj[key];
        } else {
            if (strict) {//开启严格模式，没找到对应key值，抛出错误
                throw new Error('please transfer a valid prop path to form item!');
            }
            break;
        }
    }
    return {
        o: tempObj, //原始数据
        k: keyArr[i], //key值
        v: tempObj ? tempObj[keyArr[i]] : null // key值对应的值
    };
}
function GetUrlParam(url) { //获取Url参数，返回一个对象
    url = url ? url : document.location.toString();
    let arrObj = url.split('?');
    let params = Object.create(null);
    if(arrObj.length > 1) {
        arrObj = arrObj[1].split("&");
        arrObj.forEach(item => {
            item = item.split('=');
            params[item[0]] = item[1];
        })
    }
    return params;
}
function downloadFile(filename, data) { //base64数据导出文件，文件下载
    let DownloadLink = document.createElement('a');
    if(DownloadLink) {
        document.body.appendChild(DownloadLink);
        DownloadLink.style = 'display: none';
        DownloadLink.download = filename;
        DownloadLink.href = data;
        if (document.createEvent){
            let DownloadEvt = document.createEvent('MouseEvents');
            DownloadEvt.initEvent('click', true, false);
            DownloadLink.dispatchEvent(DownloadEvt);
        } else if(document.createEventObject) {
            DownloadLink.fireEvent('onclick');
        } else if(typeof DownloadLink.onclick == 'function') {
            DownloadLink.onclick();
        }
        document.body.removeChild(DownloadLink);
    }
}
function isFullscreenForNoScroll(){//按“F11”
    let explorer = window.navigator.userAgent.toLowerCase();
    if(explorer.indexOf('chrome')>0){//webkit
        if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
            alert("全屏");
        } else {
            alert("不全屏");
        }
    }else{//IE 9+  fireFox
        if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
            alert("全屏");
        } else {
            alert("不全屏");
        }
    }
}
function toFullScreen(){ //全屏
    let fullscreenElement = document.fullscreenElement    ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement; //返回正处于全屏状态的Element节点

    let fullscreenEnabled = document.fullscreenEnabled       ||
        document.mozFullScreenEnabled    ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled; //返回一个布尔值，表示当前文档是否可以切换到全屏状态

    //fullscreenchange事件：浏览器进入或离开全屏时触发
    document.addEventListener('fullscreenchange', function(){});
    document.addEventListener('webkitfullscreenchange', function(){});
    document.addEventListener('mozfullscreenchange', function(){});
    document.addEventListener('MSFullscreenChange', function(){});

    // :-webkit-full-screen {  全屏状态下的CSS
    //         /* properties */
    //     }

    let elem = document.body;
    elem.webkitRequestFullScreen
        ? elem.webkitRequestFullScreen()
        : elem.mozRequestFullScreen
        ? elem.mozRequestFullScreen()
        : elem.msRequestFullscreen
            ? elem.msRequestFullscreen()
            : elem.requestFullScreen
                ? elem.requestFullScreen()
                : alert("浏览器不支持全屏");
}
function exitFullscreen(){//退出全屏
    let elem = parent.document;
    elem.webkitCancelFullScreen
        ? elem.webkitCancelFullScreen()
        : elem.mozCancelFullScreen
        ? elem.mozCancelFullScreen()
        : elem.cancelFullScreen
            ? elem.cancelFullScreen()
            : elem.msExitFullscreen
                ? elem.msExitFullscreen()
                : elem.exitFullscreen
                    ? elem.exitFullscreen()
                    : alert("切换失败,可尝试Esc退出");
}
function animationFrame() { //window动画
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            //为了使setTimteout的尽可能的接近每秒60帧的效果
            window.setTimeout(callback, 1000 / 60);
        };
    //因为不同浏览器的刷新频率也不一样（一般认为设置16为最佳,按每秒60帧算，1000/60≈16.67）
    let dis = 0,timer = 0, div;
    function animation(){
        clearInterval(timer);
        timer = setInterval(function(){
            div.style.left = ++dis;
            if(dis>=50) clearInterval(timer)
        },16);
        requestAnimationFrame(function(){
            div.style.left = ++dis;
            if(dis<50) animation();
        })
    }
    animation();
}
function _isNaN(v){ //检查数据是否是非数字值
    //原生的isNaN会把参数转换成数字(valueof)，而null、true、false以及长度小于等于1的数组(元素为非NaN数据)会被转换成数字
    //这不是我想要的。Symbol类型的数据不具有valueof接口，所以isNaN会抛出错误，这里放在后面，可避免错误
    return !(typeof v === 'string' || typeof v === 'number') || isNaN(v)
}
function max(arr){ //求取数组中非NaN数据中的最大值
    arr = arr.filter(item => !_isNaN(item));
    return arr.length ? Math.max.apply(null, arr) : undefined
}
function maxOrMin(arr){ //求取数组中最大值 最小值
    arr.sort(function (a, b) { //return -1 可将数组倒过来
        return a-b; //return < 0 a在b之前 > 0 b在a之前
    });
    Math.max(arr);
    Math.min(arr);
    return arr[arr.length-1];
}
function random(lower, upper){//返回一个lower - upper之间的随机数
    lower = +lower || 0
    upper = +upper || 0
    return Math.random() * (upper - lower) + lower;
}
function fill() { //arr.fill
    Array.prototype.fill = Array.prototype.fill || function fill(value, start, end) {
        let ctx = this;
        let length = ctx.length;

        start = parseInt(start);
        if(isNaN(start)){
            start = 0
        }else if (start < 0) {
            start = -start > length ? 0 : (length + start);
        }

        end = parseInt(end);
        if(isNaN(end) || end > length){
            end = length
        }else if (end < 0) {
            end += length;
        }

        while (start < end) {
            ctx[start++] = value;
        }
        return ctx;
    }
}
function includes() { //ES6 arr.includes
    Array.prototype.includes = Array.prototype.includes || function includes(value, start){
        let ctx = this;
        let length = ctx.length;

        start = parseInt(start);
        if(isNaN(start)){
            start = 0
        }else if (start < 0) {
            start = -start > length ? 0 : (length + start);
        }

        let index = ctx.indexOf(value);

        return index >= start;
    }
}
function find() {//arr.find 返回数组中通过测试（函数fn内判断）的第一个元素的值
    Array.prototype.find = Array.prototype.find || function find(fn, ctx){
        ctx = ctx || this;
        let result;
        ctx.some((value, index, arr, thisValue) => {
            return fn(value, index, arr) ? (result = value, true) : false
        });
        return result
    }
}
function findIndex() {//arr.findIndex 返回数组中通过测试（函数fn内判断）的第一个元素的下标
    Array.prototype.findIndex = Array.prototype.findIndex || function findIndex(fn, ctx){
        ctx = ctx || this;
        let result;
        ctx.some((value, index, arr, thisValue) => {
            return fn(value, index, arr) ? (result = index, true) : false
        });
        return result
    }
}
function timing() { //Web Performance API允许网页访问某些函数来测量网页和Web应用程序的性能，包括 Navigation Timing API和高分辨率时间数据。
    window.onload = function(){ //performance.timing：利用performance.timing进行性能分析
        setTimeout(function(){
            let t = performance.timing;
            console.log('DNS查询耗时 ：' + (t.domainLookupEnd - t.domainLookupStart).toFixed(0))
            console.log('TCP链接耗时 ：' + (t.connectEnd - t.connectStart).toFixed(0))
            console.log('request请求耗时 ：' + (t.responseEnd - t.responseStart).toFixed(0))
            console.log('解析dom树耗时 ：' + (t.domComplete - t.domInteractive).toFixed(0))
            console.log('白屏时间 ：' + (t.responseStart - t.navigationStart).toFixed(0))
            console.log('domready时间 ：' + (t.domContentLoadedEventEnd - t.navigationStart).toFixed(0))
            console.log('onload时间 ：' + (t.loadEventEnd - t.navigationStart).toFixed(0))

            if(t = performance.memory){
                console.log('js内存使用占比 ：' + (t.usedJSHeapSize / t.totalJSHeapSize * 100).toFixed(2) + '%')
            }
        })
    }
}
function keydown() {//禁止某些键盘事件
    document.addEventListener('keydown', function(event){
        return !(
            112 == event.keyCode || //F1
            123 == event.keyCode || //F12
            event.ctrlKey && 82 == event.keyCode || //ctrl + R
            event.ctrlKey && 78 == event.keyCode || //ctrl + N
            event.shiftKey && 121 == event.keyCode || //shift + F10
            event.altKey && 115 == event.keyCode || //alt + F4
            "A" == event.srcElement.tagName && event.shiftKey //shift + 点击a标签
        ) || (event.returnValue = false)
    });
}
function csc() {//禁止右键、选择、复制
    ['contextmenu', 'selectstart', 'copy'].forEach(function(ev){
        document.addEventListener(ev, function(event){
            return event.returnValue = false
        })
    });
}

/**
 * 方法函数
 */
function objectFun(obj, son) { //对象中的一些方法
    Object.getOwnPropertyNames(obj); //返回对象的所有属性
    Object.getPrototypeOf(obj); //查询对象的原型
    Object.getOwnPropertyDescriptor(obj, 'key'); //返回对象自有属性的配置信息

    obj.keys(); //返回对象的可枚举属性
    obj.isPrototypeOf(son); //判断obj是否是son的原型对象（是否存在原型链中）
    obj.hasOwnProperty(son); //判断son是否是obj的自有属性
    obj.propertyIsEnumerable(son); //hasOwnProperty()增强版 用来检测给顶的属性名是否是对象的可枚举的自有属性
}
function cutStrByIndex(value, type, start, end) {//通过位置截取字符串 3种slice，substring，substr(长度)
    switch (type) {
        case "普通":
            return value.slice(start, end) || value.substring(start, end);
        case "按长度":
            return value.substr(start, end);
    }
}
function cutStrByStr(value, str) { //截取value中的子字符 3种1.（indexOf|search）+ substring 2.match 3.charAt循环比较
    let start = value.indexOf(str) || value.search(str);
    let end = start + start.length;
    let ret = "";
    for(let i = 0; i < value.length; i++) {
        for(let j = 0; j < str.length; j++) {
            if(value.charAt(i) === str.charAt(j)) {
                ret += value.charAt(i);
            }
        }
    }
    return value.substring(start, end) || (value.match(str) && (value.match(str)[0]) || new RegExp(str).exec(value)[0]) || ret
}
function getStrIndex(value, type, str) {//获取字符在value中的下标 4种indexOf lastIndexOf search match(str).index
    if(Object.prototype.toString.call(value) == "[object Array]") { //只有数组才有findIndex()
        return value.findIndex((s) => {return s == str});
    }
    if(type == "前") { //1个原生方法 2个正则方法
        return value.indexOf(str) || value.search(str) || (value.match(str).index || new RegExp(str).exec(value).index);
    }
    return value.lastIndexOf(str);
}
function getStrByIndex(value, index) {//获取下标中的字符
    return value.charAt(index);
}
function clearBlank(value, type) { //去除空格 3种replace trim
    if(type == "普通") { //正则 i：忽略大小写 g：替换将针对行中每个匹配的串
        value.replace(/\s*/g, ''); //去除所有空格
        value.replace(/^\s*|\s*&/g) || value.trim();//去除两侧空格
    } else {
        let ret = "";
        for(let i = 0; i < value.length; i++) {
            if(value.charAt(i) === " ") break;
            ret += value.charAt(i);
        }
    }
}
function breakFor() {//跳出多层循环||单层循环
    //使用break：仅能跳出当前循环 无法跳出多层循环     循环外代码执行
    //使用return：直接跳出多层循环                     循环外代码不执行   条件：必须在函数中使用
    //改变循环条件：直接跳出多层循环                   循环外代码执行
    let len = 3;
    for(let i = 0; i < len; i++) {
        console.log("i第" + i + "次");
        for(let j = 0; j < len; j++) {
            console.log("j第" + j + "次");
            if(j >= 1) {
                break ; // || return || len = -1
                console.log("跳出之后");
            }
        }
    }
}

/**
 * 测试函数
 */
function bibao() {
    // 闭包的作用
    // 1.防止污染全局变量
    // 2.结果缓存 因为使用闭包函数会引用外部函数的活动对象 把外部函数的结果缓存到内存中
    // 3.封装 模仿java的面向对象开发
    // 4.外部可以访问函数内部的值，并且可以实现函数属性和方法的私有化
    let name = "sean";
    let age = 25;
    return function() {
        console.log(this);
        let obj = {name, age}
        return obj;
    }
}
function promote() {
    //函数提升优先级比变量提升要高，且不会被变量声明覆盖，但是会被变量赋值覆盖。
    console.log(foo);
    var foo = "变量";
    function foo(){
        console.log("函数声明");
    }
    console.log(foo);
}
function eventLoop() {//js事件循环机制
    //单线程：同一个时间只能做一件事。 为什么JavaScript是单线程：操作DOM。 JS多线程： Web Worker（开启一个子线程 子线程完全受主线程控制，且不得操作DOM）
    //非阻塞：事件循环
    //堆栈：堆里存放着一些对象。而栈中则存放着一些基础类型变量以及对象的指针
    //执行栈：当一系列方法被依次调用的时候，因为js是单线程的，同一时间只能执行一个方法，于是这些方法被排队在一个单独的地方。这个地方被称为执行栈
    //I/O：输入输出
    //消息队列：消息队列是一个先进先出的队列，它里面存放着各种消息。
    //事件循环：事件循环是指主线程重复从消息队列中取消息、执行的过程。
//浏览器是多进程的 每打开一个Tab页，就相当于创建了一个独立的浏览器进程。浏览器有自己的优化机制，有些进程会被合并
//单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。
//js引擎执行异步代码而不用等待，是因有为有 消息队列和事件循环。
//消息队列：消息就是注册异步任务时添加的回调函数
//事件循环：主线程只会做一件事情，就是从消息队列里面取消息、执行消息，再取消息、再执行。当消息队列为空时，就会等待直到消息队列变成非空。而且主线程只有在将当前的消息执行完成后，才会去取下一个消息。这种机制就叫做事件循环机制，取一个消息并执行的过程叫做一次循环。

//事件循环进阶：macrotask与microtask（宏观任务与微观任务）
//一次事件循环：先运行macroTask队列中的一个，然后运行microTask队列中的所有任务。接着开始下一次循环（只是针对macroTask和microTask，一次完整的事件循环会比这个复杂的多）。
//JS中分为两种任务类型：macrotask和microtask，在ECMAScript中，microtask称为jobs，macrotask可称为task
//macrotask（又称之为宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）
    //浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染（task->渲染->task->...）
//microtask（又称为微任务），可以理解是在当前 task 执行结束后立即执行的任务 也就是说，在当前task任务后，下一个task之前，在渲染之前  所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染 也就是说，在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）
// macroTask: 主代码块, setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering（可以看到，事件队列中的每一个事件都是一个macrotask）
// microTask: process.nextTick, Promise, Object.observe, MutationObserver

// 事件循环：
// 主线程运行时会产生执行栈，栈中的代码调用某些api时，它们会在事件队列中添加各种事件（当满足触发条件后，如ajax请求完毕）
// 而栈中的代码执行完毕，就会读取事件队列中的事件，去执行那些回调
// 如此循环
// 注意，总是要等待栈中的代码执行完毕后才会去读取事件队列中的事件

}
function letOrVar() {
    //ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
    let name = "name"; //let：1.变量声明不会提升（当它们包含的词法环境被实例化时会被创建，但只有在变量的词法绑定已经被求值运算后，才能够被访问。） 2.重复声明报错
    var name1 = "name"; //var：1.变量声明会提升   2.重复声明不报错且赋值覆盖
}
function digui() { // 递归获取JSON子节点
    let json = {
        name: "sean",
        age: 25,
        friends: {
            one: {
                name: "sean_fri1",
                age: 25
            },
            two: {
                name: "sean_fri2",
                age: 23,
                two_friends: {
                    name: "two_fri",
                    age: 21
                }
            }
        }
    };
    function getJsonTree(json, name) {
        if(!name) name = "json";
        for(let child in json) {
            let k = name + ">" + child;
            if(Object.prototype.toString.call(json[child]) === '[object Object]') {
                getJsonTree(json[child], k);
            } else {
                console.log(k + "=" + json[child]);
            }
        }
    }
    getJsonTree(json);

    function chengjie(n) {//乘阶
        if(n <= 1) return 1;
        return n*digui(n-1)
    }
    function notdigui(num) {//非递归乘阶
        let ret = num;
        // while (num > 1) {
        //     num--;
        //     ret *= num;
        // }
        for (let i = ret - 1; i >= 1; i--) {
            ret *= i;
        }
        console.log(ret);
    }
    var root = {
        name:'D盘',
        children:[
            {
                name:'学习',
                children:[
                    {
                        name:'电子书',
                        children:[
                            {
                                name:'文学',
                                children:[
                                    {
                                        name:'茶馆'
                                    },
                                    {
                                        name:'红与黑'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name:'电影',
                children:[
                    {
                        name:'美国电影'
                    },
                    {
                        name:'日本电影'
                    }
                ]
            }
        ]
    };
    function notdigui(json) {//非递归遍历
        let stack = [];
        stack.push(json);
        let tmpNode;
        while (stack.length > 0) {
            tmpNode = stack.pop();
            console.log(tmpNode.name);
            if(tmpNode.children && tmpNode.children.length > 0) {
                for(let i = tmpNode.children.length-1; i >= 0; i--) {
                    stack.push(tmpNode.children[i]);
                }
            }
        }
    }
}
function testThis() {
    //this指向：DOM 事件处理函数中的 this & 内联事件中的 this
    //普通函数：指向调用的对象
    //箭头函数：词法作用域：在哪里定义其this就指向定义中的作用域 使用bind call apply忽略第一个参数  //this指向最近的作用域->te 可理解为() => {}无作用域
    //构造函数：指向实例对象（构造函数return对象时 this指向return的对象）
    //DOM事件处理函数：当函数被当做监听事件处理函数时， 其 this 指向触发该事件的元素 （针对于addEventListener事件）
    //内联事件：内联事件中的this指向分两种情况：1.当代码被内联处理函数调用时，它的this指向监听器所在的DOM元素 2.当代码被包括在函数内部执行时，在非严格模式指向全局对象window， 在严格模式指向undefined
    //闭包中的this：（方法调用和函数调用）普通函数指向window 箭头函数指向定义中的作用域  执行相当于函数引用！其实得到的是另一个指向该函数的指针，脱离了obj环境
    //注解：1.词法作用域：词法作用域也就是在词法阶段定义的作用域，也就是说词法作用域在代码书写时就已经确定了。   js中其实只有词法作用域，并没有动态作用域，this的执行机制让作用域表现的像动态作用域，this的绑定是在代码执行的时候确定的。

    let pfun = () => {
        console.log(this);
    };
    let npfun = function() {
        console.log(this);
    };
    let obj = {
        jt: "vlog",
        pFun: function() { //动态作用域
            console.log(this);
        },
        nFun: () => {  //词法作用域
            console.log(this);
        },
        pzFun: function () {
            let b = this.jt;
            let fn = function () {
                console.log(this);
            };
            return fn();
        },
        nzFun: function () {
            let b = this.jt;
            let fn = () => {
                console.log(this);
            };
            return fn();
        }
    };
    obj.pzFun();//windows
    obj.nzFun();//obj

    let obj2 = {
        te: function () {
            let r = () => {
                let e = () => {
                    let t = () => {
                        console.log(this); //this指向最近的作用域->te 可理解为() => {}无作用域
                    };
                    return t();
                };
                return e();
            };
            return r();
        }
    };
    var obj1 = {
        name: "test",
        nobj: {
            name: "nobj",
            fun: function() {
                let ret = function() {
                    console.log(this);
                };
                return ret();
            }
        },
        fun: function() {
            let ret = function() {
                console.log(this);
            };
            return ret();
        }
    };
    obj1.fun();
    obj1.nobj.fun();

    var name = 'The Window';
    var obj3 = {
        name: 'My obj',
        getName: function() {
            console.log(this.name);
            return this.name;
        }
    };
    obj3.getName();
    (obj3.getName)();
    (obj3.getName = obj3.getName)();

    function foo() {
        console.log( this.a );
    }
    var obj6 = {
        a: 2,
        foo: foo
    };
    // 函数引用！其实得到的是另一个指向该函数的指针，脱离了obj环境
    var bar = obj6.foo;
    var a = "oops, global";
    bar();
}
function debounce(func, wait) {//防抖
    let timeId;
    return function() {
        let ctx = this;
        if(timeId) clearTimeout(timeId);
        timeId = setTimeout(() => {
            func.apply(ctx, arguments);
        }, wait);

        let throttleRun = debounce(function() {//调用
            console.log(this);
            console.log(123);
        }, 1000);
    };

}
function throttle(func, wait) {//节流
    let lastTime = null;// 为了避免每次调用lastTime都被清空，利用js的闭包返回一个function;此外声明为全局变量也可以
    let timeId;
    return function() {
        let ctx = this;
        let now = new Date();
        // 如果上次执行的时间和这次触发的时间大于一个执行周期，则执行
        if (now - lastTime - wait > 0) { //一个执行周期
            if(timeId) clearTimeout(timeId);

            // func(); 参数 函数中的this指向window
            func.apply(ctx, arguments);
            lastTime = now;
        } else if(!timeId) { //还不到一个执行周期 先注册最后一次执行
            timeId = setTimeout(() => {
                // func();
                func.apply(ctx, arguments);
            }, wait)
        }
    }
}
function domEvent() {//事件监听
    let dom = document.getElementById("ol");
    if(dom.addEventListener) {
        dom.addEventListener('click', () => { //addEventListener 重复的会依次调用不会覆盖
            console.log("第一次");
        }, false); //false 指定事件是否发生在捕获阶段。默认为false,事件发生在冒泡阶段 决定了监听器执行的顺序 true(捕获) (false)冒泡
        dom.addEventListener('click', () => {
            console.log("第二次");
        });
        dom.removeEventListener('click', () => {
            console.log("第二次");
        });
    } else if(dom.attachEvent) { //IE 8 及更早 IE 版本
        dom.attachEvent("onclick", ()=> {}); //不同于add... 第一个参数加on
    }

    dom.onclick = function() {//onclick 重复的会覆盖 调用最后一次的
        console.log("第一次");
    };
    dom.onclick = function() {
        console.log("第二次");
    }
}
function eventEntrust() {
    //事件捕获：当一个事件触发后,从Window对象触发，不断经过下级节点,直到目标节点，在事件到达目标节点之前的过程就是捕获阶段。所有经过的节点,都会触发对应的事件
    //事件冒泡：当一个事件触发后,从目标节点触发，不断经过上级节点,直到Window对象，在事件到达Window对象之前的过程就是冒泡阶段。所有经过的节点,都会触发对应的事件
    //事件阶段：window -> document -> body -> div    div ->  body -> document -> window
    //事件委托的优点: 1.提高性能:每一个函数都会占用内存空间，只需添加一个事件处理程序代理所有事件,所占用的内存空间更少。
    // 2.动态监听:使用事件委托可以自动绑定动态添加的元素,即新增的节点不需要主动添加也可以一样具有和其他元素一样的事件。
    let div = document.getElementById("div");
    div.addEventListener('click', (e) => {
        console.log(e.target);
        console.log("把事件委托到了div上");

        let div3 = document.createElement('div');
        div3.setAttribute('class', 'div3');
        div3.innerText = 'div3';
        div.appendChild(div3);
    });
}
function css() {//Edge Reflow
    //不要重复设置：大多数CSS属性的值都是从DOM树中向上一级的元素继承的，因此才被命名为级联样式表。以font属性为例-它总是从父级继承的，您不必为页面上的每个元素都单独设置。
    //不要DIY，多使用代码库：CSS社区非常庞大，不断有新的代码库出现。它们有各种用途，从微小的片段到构建响应式应用程序的整体框架。其中大多数也是开源的。
    //不要使用!important：现在看起来可以快速的解决问题，但最终可能会导致大量的重写。
    //用text-transform转换字母 text-transform: capitalize 首字母大写; uppercase：全大写  lowercase：全小写
    //使用AutoPrefixer达到更好的兼容性：自动添加css前缀 在线工具：Autoprefixer 文本编辑器插件：Sublime Text, Atom 代码库：Autoprefixer (PostCSS)
    //压缩CSS文件：在生产环境中使用.min版本，同时为开发保留常规版本。 在线工具：CSS Minifier, CSS Compressor 文本编辑器插件： Sublime Text, Atom 代码库： Minfiy (PHP), CSSO, CSSNano (PostCSS, Grunt, Gulp)
    //Caniuse：使用caniuse来检查您使用的属性是否得到了广泛的支持
    //验证css：在线工具：W3 Validator, CSS Lint 文本编辑器插件：Sublime Text, Atom 代码库：stylelint (Node.js, PostCSS), css-validator (Node.js)
    //BEM命名规范：BEM分别代表块（Block）、元素（Element）、修饰符（Modifier）。 .form__submit--disabled .B__.E-M
    let margin = {
        //1.注意外边距折叠：上下的垂直外边距margin在同时存在时会发生外边距折叠
    };
    let flex = {
        //2.flex弹性布局：使用flex进行布局 display: flex;
    };
    let reset = {
        //3.重置元素的CSS样式： *{m p box-sizing: border-box;}
    };
    let boxSizing = {
        //4.标准盒子||IE盒子：标准盒子的宽高不包括padding border IE盒子的宽高包括padding border
        // box-sizing：选择盒模型解析方式  1.content-box，border和padding不计算入width之内 2.padding-box，padding计算入width内 3.border-box，border和padding计算入width之内，其实就是怪异模式了~
    };
    //可替换元素：可替换元素（replaced element）的展现效果不是由 CSS 来控制的。这些元素是一种外部对象，它们外观的渲染，是独立于 CSS 的。
    //<iframe><video><embed><img>
    let background = {
        //5.最好使用background属性来引入图片，而不是<img>标签。
        //background: url("../../static/images/team/1.jpg");
        //background-position: center; //图片位置居中 上下左右 百分值 px  Firefox 和 Opera 中需要把 background-attachment 属性设置为 "fixed"
        //background-size: cover; //包含图片
        //background-repeat: no-repeat; //平铺方式 不平铺（重复）
        //object-fit: fill | contain | cover | none | scale-down 指定可替换元素的内容对象在元素盒区域中的填充方式。（有些类似于 background-size ）
        //object-position: 上下左右 百分值 px 指定可替换元素的内容对象在元素盒区域中的位置。（类似于 background-position ）
    };
    let table = {
        //border-collapse: collapse; //去除表格多重边框
    }
    let annotation = {
        //对于大的区域划分或者重要的组件可以使用下面的注释样式
        /*---------------
            #Header
        ---------------*/
        //对于细节和不太重要的样式可以使用单行的注释方式：
        /*   Footer Buttons   */
        //另外，请记住，CSS中没有//注释，只有/**/注释

        //当class或者ID包含多个单词时，应使用连字符（-）
        //当涉及到命名时，您还可以考虑BEM，它遵循一组原则，提供基于组件并增加一致性的开发方法。
    }
    let transform = {
        //最好使用transform()函数来创建元素的位移或大小动画，尽量不要直接改变元素的width，height以及left/top/bottom/right属性值。
        // transition: 0.4s ease-out;   ease-out{transform: translateX(450px);}
    }
    let unit = {
        //Em, Rem与px
        //em - 设置元素为1em，其大小与父元素的font-size属性有关。这个单位用于媒体查询中，特别适用于响应式开发，但是由于em单位在每一级中都是相对于父元素进行计算的，所以要得出某个子元素em单位对应的px值，有时候是很麻烦的。
        //rem - 相对于<html>元素的font-size大小计算，rem使得统一改变页面上的所有标题和段落文本大小变得非常容易。
        //px - 像素单位是最精确的，但是不适用于自适应的设计。px单位是可靠的，并且易于理解，我们可以精细的控制元素的大小和移动到1px。
    }
}
function cssCenter() {
    //行内元素水平居中：1.设置父元素（父元素必须是块级元素）text-align: center; 2.设置子元素display: table; margin: auto;
        //注：1.使用text-align居中的条件是子元素必须是行内元素 2.使用margin居中的条件是当前元素必须有width

    //块级元素水平居中：1.宽度确定？1.margin: auto;:不确定：子元素使用display: inline-block;后宽度会被撑开
        //2.父元素为相对定位，子元素为绝对定位，子元素的left:50%，子元素的 margin-left: -元素宽度的一半px||transform: translateX(-50%);
        //3.使用flexbox布局实现:   display: flex; justify-content: center;
            // 注：justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。

    //单行内元素垂直居中：1.设置单行行内元素的"行高等于盒子的高"即可；
        //注：1.line-height = 基线和基线之间的距离 vertical-align:设置文本对基线的对齐方式
    //多行内元素垂直居中：1.给父元素设置 display: table-cell; vertical-align: middle;
        //注：1.table-cell元素会作为一个表格单元格显示，所以可设置vertical-align

    //块级元素垂直居中：1.父元素为相对定位，子元素为绝对定位，子元素的top:50%，子元素的 margin-top: -元素高度的一半px||transform: translateY(-50%);
        //2.使用flexbox布局实现:   display: flex; align-items: center;
            // 注：align-items 用于设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式。

    //水平垂直居中：1.父元素为相对定位，子元素为绝对定位，子元素上下左右:0 margin:auto;
        //2.父元素为相对定位，子元素为绝对定位，子元素top: 50%; left: 50%; transform: translate(-50%, -50%);
        //3.使用flexbox布局实现: display: flex; justify-content: center;align-items: center;
}
function carousel() {
    //核心实现：移动ul的left来确定图片的显示
    //核心步骤：
        //1.根据li创建小按钮并设置小按钮的onmouseover事件（事件1.清除所有小按钮class。2.根据当前元素的index来确定ul的left移动到哪里）
        //2.
    let box = document.getElementById("box");
    let inner = box.children[0];
    let ulObj = inner.children[0];
    let list = ulObj.children;
    let olObj = inner.children[1];
    let arr = document.getElementById("arr");
    let imgWidth = inner.offsetWidth;
    let right = document.getElementById("right");
    let pic = 0;

    //根据i个数创建小按钮
    for(let i = 0; i < list.length; i++) {
        let liObj = document.createElement("li");
        olObj.append(liObj);
        liObj.innerText = (i+1);
        liObj.setAttribute("index", i);

        //为按钮注册onmouseover事件
        liObj.onmouseover = function() {
            //先清除所有按钮的样式
            for(let j = 0; j < olObj.children.length; j++) {
                olObj[j].removeAttribute("class");
            }
            this.className = "current";
            pic = this.getAttribute("index");
            animate(ulObj,-pic*imgWidth);
        }
    }

    //设置ol中第一个li的背景
    olObj.children[0].className = "current";
    //克隆一个ul中第一个li,加入到ul中的最后=====克隆
    ulObj.appendChild(ulObj.children[0].cloneNode(true));

    let timeId = setInterval(onmouseclickHandle, 3000);
    //左右焦点实现点击切换图片功能
    box.onmouseover = function() {
        arr.style.disabled = "block";
        clearInterval(timeId);
    };
    box.onmouseout = function() {
        arr.style.disabled = "none";
        timeId = setInterval(onmouseclickHandle, 3000);
    };
    right.onclick = onmouseclickHandle;

    function onmouseclickHandle() {
        //如果pic的值是3,恰巧是ul中li的个数-1的值,此时页面显示第4个图片,而用户会认为这是第一个图,
        //所以,如果用户再次点击按钮,用户应该看到第二个图片
        if(pic === list.length-1) {
            //如何从第4个图,跳转到第一个图
            pic = 0;//先设置pic=0
            ulObj.style.left = 0 + "px"; //把ul的位置还原成开始的默认位置
        }
        pic++;//立刻设置pic加1,那么此时用户就会看到第二个图片了
        animate(ulObj, -pic * imgWidth);//pic从0的值加1之后,pic的值是1,然后ul移动出去一个图片
        //如果pic==3说明,此时显示第4个图(内容是第一张图片),第一个小按钮有颜色,
        if (pic === list.length - 1) {
            //第3个按钮颜色干掉
            olObj.children[olObj.children.length - 1].className = "";
            //第一个按钮颜色设置上
            olObj.children[0].className = "current";
        } else {
            //干掉所有的小按钮的背景颜色
            for (let i = 0; i < olObj.children.length; i++) {
                olObj.children[i].removeAttribute("class");
            }
            olObj.children[pic].className = "current";
        }
    }
    right.onclick=function () {
        if (pic==0){
            pic=list.length-1;
            ulObj.style.left=-pic*imgWidth+"px";
        }
        pic--;
        animate(ulObj,-pic*imgWidth);
        for (let i = 0; i < olObj.children.length; i++) {
            olObj.children[i].removeAttribute("class");
        }
        //当前的pic索引对应的按钮设置颜色
        olObj.children[pic].className = "current";
    };

    //设置任意的一个元素,移动到指定的目标位置
    function animate(element, target) {
        clearInterval(element.timeId);
        //定时器的id值存储到对象的一个属性中
        element.timeId = setInterval(function () {
            //获取元素的当前的位置,数字类型
            let current = element.offsetLeft;
            //每次移动的距离
            let step = 10;
            step = current < target ? step : -step;
            //当前移动到位置
            current += step;
            if (Math.abs(current - target) > Math.abs(step)) {
                element.style.left = current + "px";
            } else {
                //清理定时器
                clearInterval(element.timeId);
                //直接到达目标
                element.style.left = target + "px";
            }
        }, 10);
    }
}
function carouse2() {
    let box = document.getElementById("box");
    let inner = box.children[0];
    let ulObj = inner.children[0];
    let list = ulObj.children;
    let olObj = inner.children[1];
    let arr = document.getElementById("arr");
    let imgWidth = inner.offsetWidth;
    let right = document.getElementById("right");
    let left = document.getElementById("left");
    let pic = 0;

    for(let i = 0; i < list.length; i++) {
        let liObj = document.createElement("li");
        liObj.setAttribute("index", i);
        liObj.innerText = i+1;
        olObj.appendChild(liObj);

        liObj.onmouseover = function() {
            for(let j = 0; j < olObj.children.length; j++) {
                olObj.children[j].removeAttribute("class");
            }
            this.className = "current";
            pic = this.getAttribute("index");
            animate(ulObj, -pic*imgWidth);
        }
    }
    olObj.children[0].className = "current";
    ulObj.appendChild(ulObj.children[0].cloneNode(true)); //为什么要克隆第一个到最后？

    // let timeId = setInterval(onmouseclickHandle, 2000);
    box.onmouseover = function() {
        arr.style.display = "block";
        // clearInterval(timeId);
    };
    box.onmouseout = function() {
        arr.style.display = "none";
        // timeId = setInterval(onmouseclickHandle, 2000);
    };
    right.onclick = onmouseclickHandle;
    left.onclick = function() {
        if(pic === 0) {
            pic = list.length-1;
            ulObj.style.left = -pic * imgWidth + "px";
        }
        pic--;
        animate(ulObj, -pic * imgWidth);
        for (let i = 0; i < olObj.children.length; i++) {
            olObj.children[i].removeAttribute("class");
        }
        olObj.children[pic].className = "current";
    };
    function onmouseclickHandle() {
        if(pic === list.length-1) {
            pic = 0;
            ulObj.style.left = 0 + "px";
        }
        pic++; //如果没有克隆 最后一张执行到此处时直接跳到了第二张 （最后一张的下一张会animate到第二张）
        animate(ulObj, -pic * imgWidth);
        if (pic === list.length - 1) {
            //第3个按钮颜色干掉
            olObj.children[olObj.children.length - 1].className = "";
            //第一个按钮颜色设置上
            olObj.children[0].className = "current";
        } else {
            //干掉所有的小按钮的背景颜色
            for (let i = 0; i < olObj.children.length; i++) {
                olObj.children[i].removeAttribute("class");
            }//
            olObj.children[pic].className = "current";
        }
    }
    function animate(element, target) {
        clearInterval(element.timeId);
        //定时器的id值存储到对象的一个属性中
        element.timeId = setInterval(function() {
            let current = element.offsetLeft; //获取元素当前位置
            let step = 10; //每次移动位置
            step = current < target ? step : -step;
            //当前移动到位置
            current += step;
            if (Math.abs(current - target) > Math.abs(step)) {
                element.style.left = current + "px";
            } else {
                //清理定时器
                clearInterval(element.timeId);
                //直接到达目标
                element.style.left = target + "px";
            }
        }, 10);
    }
}
function paixu() {
    let arr = [7,1,3]; //,6,4,2,8,0,4,6,8,10
    //1.
    // for(let i = 0; i < 100; i++) {
    //     arr.push(Math.ceil(Math.random()*100));
    // }

    //外层循环length-1次 内层循环length-1-i次（内层把当前值和j+1个值逐个比较 如果符合条件就移动，排到最后的值是确定顺序的值，所以arr.length-i（-1的原因是j会和j+1比较，而最后的值没有+1））
    // for(let i = 0; i < arr.length-1; i++) {//冒泡排序 i=最后的时候已经不可能有后面的数和它比了 所以-1（内层-1已经控制）
    //     let flag = true; //冒泡优化
    //     for(let j = 0; j < arr.length-1-i; j++) { //arr.length-1-i 排到最后的已经是最小的 不做比较   每轮比较少比较一次。（每一轮都会比较出一个最大值，然后后一轮没有必要再比较了，所以每比较一轮，就少比较一次。。。）
    //         if(arr[j] < arr[j+1]) { //j+1小于自己的话 会停在这里
    //             let tmp = arr[j];
    //             arr[j] = arr[j+1];
    //             arr[j+1] = tmp;
    //             flag = false;
    //         }
    //     }
    //     if(flag) { //如果本轮比较没有任何元素相互交换位置，那么说明已经比较完成，可以跳出循环。 没毛用
    //         break;
    //     }
    // }

    //外层循环length-1 内层循环从i+1的位置找到后面最小的数并标记 然后互换i和最小标记的位置
    // let minIndex, temp;
    // for(let i = 0; i < arr.length-1; i++) {//选择排序 在时间复杂度上表现最稳定的排序算法之一，用到它的时候，数据规模越小越好
    //     minIndex = i;
    //     for(let j = i + 1; j < arr.length; j++) {
    //         if(arr[j] < arr[minIndex]) { //寻找最小的数并标记 使后面的数都和标记数比较
    //             minIndex = j;            //将最小数的索引保存
    //         }
    //     }
    //     if(minIndex !== i) {
    //         temp = arr[i];
    //         arr[i] = arr[minIndex];
    //         arr[minIndex] = temp;
    //     }
    // }

    // let preIndex, current;
    // for(let i = 1; i < arr.length; i++) { //插入排序 取出一个没有经过排序的往前面找
    //     preIndex = i - 1; //前一个下标
    //     current = arr[i]; //现在的值 1.把现在的值拿出来（从第二个开始）和前一个比较 2.如果前一个大于现在的 3.把现在的值搞成和前一个一样（实现大的后移）
    //     while(preIndex >= 0 && arr[preIndex] > current) {//arr[preIndex]：前一个 current：现在的 你的比我的大我就跟你换
    //         arr[preIndex+1] = arr[preIndex];//arr[preIndex+1]：现在的 = arr[preIndex]：前一个 你的比我的大我就要你的
    //         preIndex--;
    //     }
    //     arr[preIndex+1] = current;//arr[preIndex+1]：（preIndex--;）前一个 = current：现在的 我的就给你了
    // }

    // let len = arr.length,
    //     temp,
    //     gap = 1;
    // while(gap < len/3) {          //动态定义间隔序列
    //     gap =gap*3+1;
    // }
    // for (gap; gap > 0; gap = Math.floor(gap/3)) { //希尔排序
    //     for (let i = gap; i < len; i++) {
    //         temp = arr[i];
    //         for (var j = i-gap; j >= 0 && arr[j] > temp; j-=gap) {
    //             arr[j+gap] = arr[j];
    //         }
    //         arr[j+gap] = temp;
    //     }
    // }

    return arr;
}
(function() {

})();






//堆栈是一种按序排列的数据结构，只能在一端(称为栈顶(top))对数据项进行插入和删除
// 1.请你谈谈Cookie
// Cookie虽然在持久保存客户端数据提供了方便 分担了服务起存储的负担 但是还有许多局限性   持久保存客户端数据
// 每个domain最多只能有20条cookie 每个cookie长度不能超过4KB 否则会被截掉
// 不同浏览器的版本对存储的限制也不同 IE6以下的版本最多只能存储20个cookie
// IE7以上版本还有firefox(fai 哦 发 吃)最多可存储50个cookie chrome和Safari(色法瑞)没有做硬性限制
// 不同浏览器对cookie的清理条件也不同IE和Opear(奥 puo rua)会清理最近很少使用的cookie firefox会随机清理cookie
// 可控制点：
// 	1.通过良好的编程，可控制保存在cookie中的session对象的大小
// 2.通过加密和安全传输技术(SSL)，减少cookie被破解的可能性
// 3.只在cookie中存放不敏感数据
// 4.控制cookie的生命期 使之不会永远有效
// 2.浏览器
// 存储 sessionStorage和localStorage(色偷瑞角)
// sessionStorage用于本都存储一个会话中的数据 这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁 因此sessionStorage不是一种持久化的本地存储 仅仅是会话级别的存储
// locakStorage用于持久化的本地存储 除非主动删除数据 否则数据永不会过期
// 3.webstorage和cookie的区别
// Web Storage的概念和cookie相似 区别是它是为了更大容量存储设计的 cookie的大小是受限制的 并且每次请求一个新页面的时候cookie都会被发送过去 这样无形中浪费了宽带 另外cookie还需要指定作用于 不可跨域使用
// 除此之外 webStorage用用setItem get. remove. clear等方法 不像cookie需要前端开发者自己封装setCookie getCookie
// 作用不同cookie的作用是与服务起进行交互，作为HTTP规范的一部分而存在 而WebStorage仅仅是为了在本地"存储"数据而生 IE7及以下版本不支持WebStorage 但是提供了UserData
// 4.js为什么要使用严格模
// 1.使用严格模式可以消除js语法的一些不合理 和严谨之处 消除一些怪异行为
// 2.提高编译器效率 提高运行速度
// 3.为下一版本做准备
// 5.js严格模式与非严格模式的区别
// 1.严格模式下未定义的变量名不可使用
// 2.严格模式下中不可以使用delete删除变量名、对象、函数
// 3.严格模式中变量、数组、函数不可同名
// 4.严格模式中在eval定义的变量不可在外部使用
// 5.严格模式中的变量名不可为eval arguments
// 6.严格模式中不可使用with（外服）扩展作用域链
// 7.严格模式中不可为只读属性赋值
// 8.严格模式中的this指向undefined
// 9.严格模式中不可使用八进制和转义符
// 10.严格模式中不可以删除不可删除的属性
// 11.严格模式中的call（烤） apply（啊破来）中的第一个对象为null defined时 其指向null undefined
// 6.js执行上下文
// 分类：全局执行环境 函数执行环境 eval（E外奥）函数
// 1.js执行上下文在函数被调用时创建 包括活动对象 作用链 this指向（this指向在函数调用时确认）
// 		2.创建上下文时调用函数的对象被传递进函数的this中 匿名函数的this指向window 匿名函数具有全局性（this指向调用它的环境对象）
// 7.创建执行上下文的2个阶段
// 1.创建阶段 创建变量对象  设置this值 设置[Scope]属性的只 激活/代码执行阶段
// 2.初始化阶段 初始化变量对象的值 函数的引用 然后解释/执行代码
// 8.创建变量对象的过程
// 1.根据函数的参数创建并初始化anguments object
// 2.声明提升（变量和函数0）
// 9.什么是闭包  它的作用是什么
// 一个函数把另一个函数作为返回值 在js中这就创建了一个闭包
// 闭包的作用
// 1.防止污染全局变量
// 2.结果缓存 因为使用闭包函数会引用外部函数的活动对象 把外部函数的结果缓存到内存中
// 3.封装 模仿java的面向对象开发
// 4.外部可以访问函数内部的值，并且可以实现函数属性和方法的私有化
// 10.bind call apply作用及区别
// 作用：改变对象的this指向
// 区别：bind改变this指向并返回一个函数 call和apply的区别为参数不同 call参数一个个传 apply参数对数组
// 11.HTTP协议
// HTTP协议（超文本传输协议），用于从万维网服务器传输超文本到本地浏览器的传送协议 HTTP是基于TCP/IP通信协议来传递数据的(HTM 文件 图片文件 查询结果等)
// 工作原理：HTTP协议工作与客户端-服务端架构上 浏览器作为HTTP客户端通过URL向HTTP服务器既WEB服务起端发送请求（WEB服务器有：Apache服务器 IIS服务器等） HTTP默认端口为80
// HTTP三点注意事项
// 1.HTTP是无连接的 无连接的含义是限制每次连接只处理一个请求 服务端处理客户的请求 并受到客户的应答后 既断开连接（这种方式可节省传输时间）
// 			2.HTTP是媒体独立的  这意味着 只要客户端和服务端知道怎么处理数据 HTTP可发送任何类型的数据 客户端以及服务端指定使用适合的MIME-type内容类型
// 3.HTTP是无状态的 HTTP协议是无状态协议 无状态是指协议对于事务处理没有记忆能力 缺少状态意味着如果后续处理需要前面的信息 则它必须重传 这样可导致每次传送的数据量增大 另一方面 在服务器不需要先前信息时它的应答就较快
// 客户端发送HTTP请求的消息格式包括：请求行、请求头、空行、请求数据四部分
// 请求行：请求方法 空格 URL 空格 协议版本 回车符 换行符
// 请求头部： 头部字段名：值 回车符 换行符。。。
// 			空行： 回车符 换行符
// 请求数据
// HTTP响应也分四部分：状态行、消息报头、空行和响应正文
// 状态行：2000 502等
// 消息报头：包含时间 类型 长度等
// 消息正文：HTML页面
// HTTP请求类型有8种：常用的get post
// HTTP状态码：200：请求成功 301：资源被转移到其他URL 404：请求资源不存在 500：内部服务器错误 502：无效的响应
// HTTP状态码的第一位数字定义了状态码的类型 共5种类型 1**服务器收到请求 2**成功 3**重定向 4**客户端错误 5**服务端错误
// 12.TCP/IP协议：一个网络通信模型 以及一整个网络传输协议家族 为互联网的基础通信架构 它通常被称位TCP/IP协议族 简称TCP/IP
// TCP：传输控制协议 TCP是一个端到端的可靠的面向连接的协议 提供可靠的 像管道一样的连接
// TCP三次握手：发生在数据准备阶段 服务器和客户端通之间需要进行三次交互 			第一次：客户端发送syn包到服务器 并进入SYN_SEND状态，等待服务器确认
// 第二次：服务器收到syn包 必须确认客户的syn，同时自己也向客户端发送一个syn包 此时服务器进入SYN_RECY状态
// 第三次：客户端收到服务器的syn包 向服务器发送确认包 次包发送完毕 客户端和服务端进入established状态
// IP协议：将多个包交换网络连接起来 它在源地址和目的地址之间传送一种称之为数据包的东西 它还提供对数据大小的重新组功能 以适应不同网络对包大小的要求 IP提供可开的传输服务
// IP的责任就是把数据从源传送到目的地。它不负责保证传送可靠性，流控制，包顺序和其它对于主机到主机协议来说很普通的服务。
// 		IP地址：互联网上的每一个网络和每一台主机分配的一个逻辑地址
// 13.输入网址按下回车后发生了什么？
// 		1.DNS域名解析
// 2.发起TCP三次握手
// 3.建立TCP连接后发起HTTP请求
// 4.服务器端响应HTTP请求 浏览器得到HTML代码
// 5.浏览器解析HTML代码 并请求HTML代码中的资源
// 6.浏览器对页面进行渲染呈现给用户
// 14.JS中new操作符做了什么
// var t = new Test();
// 1.创建一个空对象  var o = {};
// 2.设置这个空对象的_proto__为构造函数的prototype  o.__proto__ = Test.prototype;
// 3.传入参数调用构造函数并绑定新的this  o.apply(o, arguments);
// 4.return 这个空对象
// 15.JSON(JavaScript Object Notation(No忒森))
// JSON是一种轻量级的文本数据交换格式。JSON指的是JavaScript的对象表示法。数据格式简单，易读易写（具有自我描述性），占用宽带小
// 16.JS延迟加载的方式
// 1.defer（延迟加载js脚本）async（异步加载js脚本）
// 		注：1.若同时使用浏览器会优先使用async  2.defer|async加载的外部脚本无法使用doeument.write，因为在onload之前执行之前会插入内容，onload完成之后，浏览器输出流自动关闭并无法打开；（但可以手动打开：如使用onclick，但是会重置页面内容）
// 	2.动态创建DOM方式（创建script,插入到DOM中），加载完毕后callBack）
// 17.解决跨域问题（为什么要跨域：js的安全策略，不同域之间不可相互访问）
// 	1.jsonp(jsonp的原理时动态插入script标签)
// 2.document.domain + iframe
// 18.ajax和jsonp
// 本质不同ajax的核心是通过XmlHttpRequest 而jsonp的核心是script的动态添加
//
// CSS与HTML相关：
// 1.link和@import区别
// 1.根系不同：link是HTML标签 @import是css提供的一种方式
// 2.加载时机不同：页面加载时link同时加载 @import只有在页面在完才加载
// 3.兼容性问题：link为HTML元素 不存在兼任性问题 二@import 只有IE5之后的版本才支持
// 2.position（破zei森）中absolute（啊不死路特）和fixed（非可死特）的共同点与不同点
// 共同点：
// 		1.可改变行内元素的呈现方式 设置display为inline（in来in）-block
// 2.使元素脱离正常文档流 不占据空间
// 3.默认会覆盖非定位元素
// 不同点：
// 		1.参照点不同：absolute参照position为非static的父元素元素 fixed参照浏览器
// 3.css选择器
// ID class tab p+h1（相邻） p>h1（子）p h1（后代）*（通配）a[href='#']（属性）a:hover（伪类）
// 4.css优先级
// !important（in跑疼特）> 内联 > ID > class
// 5.css新增伪类
// p:first-of-type（页面中所有第一个p元素） p:last-of-type p:only-of-type（页面元素中唯一的p元素(可包含其它元素)）p:only-child（页面中唯一的p元素(不可包含其它元素)）p:nth-child(2)(页面元素中所有的第二个个p元素) :disabled:enabled(表单元素状态) :checked(选中状态)
// 6.display的作用以及position值的区别
// display的作用：改变元素的呈现方式：
// 		block：修改元素为块级元素 inline：缺省值 修改元素为行内元素 link-block：修改元素为行内块级元素（既保留了块级元素可以设置width(为的) height(嗨特) padding margin的特性 又保留了行内元素不换行的特性）list-item：像块级元素并添加列表样式标记 inherit(in嗨瑞特)：继承父元素的display
// position的作用：定位元素 修改元素的空间位置
// absolute：生成绝对定位元素 非static的最近父元素 fixed：生成固定定位元素 参照浏览器 relative（ruailaTV）：生成相对定位元素 参照元素在普通流中的位位置 static：缺省值 没有定位 元素出项在正常流中 忽略top bottom（把偷木）left right z-index声明
// 7.css3新特性
// 1.border-radius（瑞地us）（圆角） text-shadow（阴影） 2.text-shadow（文字阴影）gradient（渐变）trans(踹死)form（旋转） 3.transform:rotate(肉tai特)(90deg)：旋转 transform:scale(Sgei奥)(20px, 10px)：缩放 transform:skew(S给哦)(10deg,20deg)(左右，上下)：倾斜
// 8.HTML元素类型
// 1.块级元素 5特点：
// 		1.以块的形式展现 独占一行 按照顺序上下排列 2.可设置width height padding margin 3.width默认占据父元素的100% 4.可容纳块级元素与行内元素 5.display值为block
// 2.行内元素 5特点：
// 		1.与块不同 不会独占一行 从左右上下排序 2.不可设置width height height由字体大小确定 width由内容长度确定 3.padding margin只可设置左右的值 上下不可设置 4.一般只容纳行内元素 5.display值为inline
// 3.空元素<br/>
// 9.css可继承元素与不可继承元素
// 1.所有元素都可继承属性 visibility(V死逼类提) 和 cursor(k儿s儿)
// 2.内联元素可继承属性 字体系列(font) 除text-indent(文本缩进)和text-align(啊来in)（文本对齐方式）
// 	3.display width height padding margin background float left top botton right overflow z-index max-wh min-wh position clear 垂直对齐 文本阴影 white-space(空白处理)都不可继承
// 4.font: family weight size style等 text-indent text-align line-height color direction visibility cursor等都可继承
// 10.css伪类和伪元素
// 1.伪类：获取不存在DOM树中的信息（它仅是利用DOM树进行元素过滤） 获取不能被常规CSS选择器获取的信息
// 2.伪类分为：状态伪类和结构性伪类
// 1.状态伪类：基于元素当前状态进行选择 在元素交互过程中状态是不断变化的 因此会根据不同的状态呈现不同的样式
// 2.结构性伪类：是css3新增选择器 利用DOM树进行元素过滤，通过文档结构的互相关系来匹配元素，能够减少使用id和class选择器 使文档更加简洁
// 3.伪元素：伪元素是对元素中的特定内容进行操作，而不是描述状态。它的操作比伪类更深一层，因此动态性比伪类低很多。实际上伪元素就是选取元素前面或后面这种普通选择器无法完成的工作。控制的内容和元素是相同的，但它本身是基于元素的抽象，并不正真存在文档结构中。伪元素的本质是在不增加DOM结构的基础上添加一个元素
// 11.为什么要初始化样式以及方法
// 一般采用:*{padding:0; margin:0}的方式来初始化样式
// 为什么要初始化样式：因为浏览器的兼容性问题 一些浏览器标签的默认值不同 所有以要初始化以下
// 12.什么是BFC规范以及对BFC规范的理解
// 1.BFC(块级格式化上下文) W3C 2.1规范中的一概念，它决定了元素如何对其内容进行布局，以及与其他元素的关系的相互作用。
// 	2.理解：一个创建了新的BFC的盒子是独立布局的，盒子里的子元素的样式不会影响到外面的元素，在同一个BFC中的两个毗邻的块级盒在垂直方向的margin会发生重叠
// 3.计算BFC高度时，浮动元素也会参与计算
// 12.1：如何触发BFC
// float除了none的值 overflow除了visible以外的值 display所有值 position值为absolute fixes
// 13.视觉格式化模型
// 视觉格式化模型是CSS中的一种概念，是用来处理文档并将它显示到视觉媒体上的一种机制。
// 	视觉格式化模型定义了盒（box），盒子主要包括块盒，行内盒，匿名盒（CSS引擎自动生成的盒子，没有名字，不能被CSS选择器选取，元素中的样式可被继承的为：inherit（in黑erT）不可被继承的为：initial（in内手））以及一些实验性盒子。盒子的类型由display决定。
// 	块盒参与BFC(块级格式化上下文) 行内盒参与IFC(行内格式化上下文)
// 行内盒子分为：
// 		参与行内格式化上下文的行内盒。所有display:inline的非替换元素生成的盒都是行内盒。
// 		不参与行内格式化上下文的原子行内盒。这些盒子由可替换元素或display:inline-block||:inline-table生成，这些盒不可拆分成多个盒。
// 		注：可替换元素与不可替换元素
// 可替换元素：浏览器可根据元素的不同属性显示不同的内容 如：input img select textarea
// 非替换元素：HTML直接把内容告诉浏览器的元素并显示在页面中
// 14.CSS定位的三种方式
// 浏览器会根据元素的盒类型和上下文对元素进行定位，盒是元素定位的基本单位。
// 	三种定位方式分别是：
// 		常规流：
// 			常规流中的盒子一个个排序。块级格式化上下文中盒子竖着排列。行级格式化上下文中盒子横着排列。
// 			position:static|relative并且float:none时触发常规流。对于static盒子中的位置是常规流中的位置，对于relative，盒子偏移量由top bottom left rigth相对与元素在常规流中的位置计算。但仍然保留其空间 其他元素不可占据
// 浮动：
// 			盒子为浮动盒，它位于行的开头或末尾，这导致常规元素围绕在它周围，除非clear
// 绝对定位：
// 			从常规流中移除，不影响常规流的布局；它的定位相对于它的包含块；对于relative元素相对于其父元素position为relative|fixed|absolute，如果没有则相对与body。对于fixed，元素相对与浏览器进行定位。
// 15.margin设置为auto取值如下
// 1.常规流中的块元素：left和right相等；2.浮动元素的L|R值为0；3.绝对定位元素：元素left right width都是auto则L|R为0，如果left right width都不是auto，则L|R相等。如果某一个为auto则自动计算另一个。除这3种情况外都为0；
// 	CSS2.1规范中提到的以下元素margin设置为auto时，所有的实际值为0
// 1.所有的内联元素 2.浮动元素以及inline-block
// margin发生重叠的必要条件：
// 		1.必须是常规文档流中的（不是浮动盒和绝对定位元素）块级盒子，并且处于同一个BFC中。
// 		2.没有行盒-既line-box，没有padding盒border将他们隔开。
// 		3.都属于垂直方向上相邻的外边距。
// 	margin不发生重叠的必要条件
// 1.水平方向永远不会 发生margin重叠
// 2.垂直方向上，建立了新的BFC的元素与他的子元素的margin不会重叠（注意区别：BFC内部的子元素与子元素之间的margin会发生重叠）
// 		3.浮动元素和绝对定位不会与任何元素发生margin重叠，包括子元素、兄弟元素
// 4.行内块元素：它不属于块级盒子 块级盒子display的属性必须是以下三种：block list-item table
// 16.行内元素和块级元素都有什么
// 行内元素：a b span srrong i label select
// 块级元素：div ul ol li dl dt dd h1... p img input
// 空元素：br hr img link
// 17.CSS Sprites：把页面所有图片拼接为一张图片，减少HTTP请求，通过background-position来控制每个图片的坐标。
// 18.DOCTYPE：文档类型
// 告诉解析器以什么样的文档标准（HTML版本）解析浏览器
// 标准分为：（浏览器DOCTYPE不存在或不正确会导致文档开启混杂模式）
// 		标准（严格）模式：严格模式的排版和JS运作是以该浏览器的最高标准来运行
// 混杂（怪异）模式：混杂模式采用宽松的先后兼容的方式来运行
// 19.HTML语义化的理解
// 1.去掉或者丢失样式的时候能够使页面呈现出清晰的结构
// 2.有利于SEO（搜索引擎优化）：和搜索引擎建立良好的沟通，有利于爬虫抓取更多的有效信息
// 3.方便其他设备解析
// 4.便于团队的开发，语义化使得网页更具可读性，使进一步开发网页的不要步骤，遵循W3C标准的团队遵循这个标准，可较少差异化
// 20.XHTML：可扩展超文本标记语言，它的目标使取代HTML
// XHTML使更严谨更纯净的HTML版本
// 21.HTML和XHTML的区别
// 1.XHTML必须被正确的嵌套
// 2.XHTML元素必须关闭
// 3.标签命必须小写
// 4.XHTML必须拥有根元素
// 22.CSS浮动
// 1.浮动元素脱离文档流，不占据空间。浮动元素碰到包含它的边框或者浮动元素的边框停留
// 清除css浮动
// 1.清除浮动：利用空标签或者css伪:alter 弊端使添加了无意义的标签
// 2.设置浮动后面的标签：overflow:hidden创建一个BFC
// 解决高度坍塌问题：
// 		1.清除浮动：利用空标签或者css伪:alter 弊端使添加了
// 2.给父元素添加overflow:hidden创建一个BFC（因为在BFC中浮动元素会参与高度的计算）
// 23.css缩放zoom和transform:scale(0.1,0.2)区别
// 1.zoom为IE专属属性，在IE中可用来清除浮动，清楚margin重叠等作用，火狐浏览器不支持zoom属性
// 2.zoom不可缩小
// 3.zoom缩放点为左上角 而scale的缩放点为中间（可通过设置transform-origin设置left right等）
// 24.浮动元素引起的问题和解决办法
// 1.父元素无法被撑开
// 2.与浮动元素同级的非浮动元素会紧随其后
// 3.若非第一个元素浮动，则该元素之前的元素也要浮动，否则会影响页面显示的结构
// 解决办法：
// 		利用clear:both解决2，3（利用after(啊futer)给在元素后添加一个空元素 .clearfix:after{content:'';display:block;clear:both;visibility:hidden;}）
// 25.H5新特性：
// 	1.H5不再是SGML的子集文档类型声明中不再需要声明DTD（SGML是国际上定义的电子文档内容和描述的标准）（DTD：文档类型标准 作用是定义XML文档合法构建模块）
// 	2.主要是管理图像、位置、存储、多任务等功能的增加
// 1.拖拽API 2.画布 3.音频 视频 4.地理 5.本地离线存储localStorage长期存储数据 以及sessionStorage 6.新增的表单控件 日历 日期 email url search number sandbox（安全沙箱H5的新属性 用来提高iframe安全系数） 7.websocket（长连接） webworker（多任务） Geolocation（定位）
// 	3.移除的一些元素font tt u center 对可用性产生负影响的frame frameset noframes
// 26.iframe的优缺点
// 优点：
// 		1.解决加载缓慢的第三方内容 2.Security sandbox（ifarme安全沙箱 设置ifarme加载的第三方内容可以做什么） 3.并行加载脚本
// 缺点：
// 		1.会阻塞页面的onload时间 2.即使内容为空也需要加载时间 3.没有语义
// 27.如何实现浏览器内多个标签页之间的通信
// 调用localStorage cookies等本地存储方式
// 28.webSocket
// 类似Http协议 是为了弥补http协议的缺陷：http协议通信只能由客户端发起 做不带服务器主动向浏览器推送信息 webSocket最大的特点是服务器可以主动向客户端推送信息
// 其他特点：
// 		1.建立在TCP协议之上，与HTTP有着良好的兼容性 默认端口也是80和443，并且握手阶段采用HTTP协议  2.数据格式比较轻量 性能开销小 通信效率高  3.可以发送文本和二进制数据 没有同源限制 4.协议标识符是 ws(http是：http://baidu.com ws是：ws://baidu.com)
//     在低版本不支持webSocket的浏览器 采用如下解决方案
// 1.使用长轮询或长连接的方式实现伪websocket  2.使用flash（佛啦死）或其他方式实现一个websocket客户端
// 29.线程和进程的区别
// 1.一个程序至少有一个进程 一个进程至少有一个线程
// 2.进程拥有独立的内存单元 而多个线程共享内存，从而极大的提高了程序的运行效率
// 3.线程不能独立运行 必须依存在应用程序中
// 4.多线程的意义在于一个应用程序中 有多个执行部分可以同时执行 但操作系统并没有将多线程看作多个独立应用
// 30.如何对网站资源进行优化
// 1.合并压缩文件 2.使用CDN（内容分发网络）托管 3.使用多个域名来提供缓存
// 31.减少页面加载时间的方法
// 1.优化图片（CSS Sprites（CSS精灵）,减少http请求） 2.优化CSS（压缩合并css 如margin-top margin-left） 3.网址后加斜杠（如www.baidu.com/目录，会判断这个目录是什么文件类型） 4.标明宽高（没标明的话浏览器器会边下载边计算） 减少浏览器计算时间
// 32.测试代码性能的工具
// 1.profiler 2.JSPerf 3.Dromaeo 4.Chrome开发者工具

// react问题
// 1.redux（瑞度克斯），redux是js状态容器，提供可预测化的状态管理

// component（看破能它）
// state（色dai特）
// props（怕儿破斯）
// render（run 得儿）
// Receive（瑞sey）
// should（色儿得儿）
// Unmount（按毛特）
// dirty（得儿题）
// current （可run特）
// reducer（瑞丢色er）
// dispatch（地斯白吃）
// 面试题：
// 1.keys的作用
// 帮助react识别那些项发生了改变 react算法中根据keys来识别那些元素需要重新渲染 相当与一个状态标识 key的应用场景：1.在一个列表中更新列表项时 2.动态创建react元素时
// 2.调用setState之后发生了什么
// 调用setState函数之后，将传入的对象与当前状态合并，然后触发调和过程，在调和过程中，react会以相对高效的方式根据新的状态构件react元素并重新渲染UI
// react得到元素树之后，会自动计算出新树和老树的差异，然后根据差异对界面进行最小化的渲染，在react差异算法中，react能精确的知道那些元素发生了改变以及应该如何区改变，这样就保证了更新按需更新，而不是更新整个界面
// 3.react生命周期
// 1.初始化阶段
// 1.getDdfauleProps：获取实例的默认属性
// 2.getInitialState：获取每个实例的初始状态
// 3.componentWillMount：组件即将被装载、渲染到页面上
// 4.render：组件生成虚拟DOM
// 5.componentDidMount：组件装载完毕 在生命周期中只会被调用一次
// 2.运行中阶段
// 1.componentWillReceiveProps(nextProps)：组件将要收到属性
// 2.shouldComponentUpdate(nextProps, nextState)：组件接受到新属性或者新状态 返回 false，接收数据后不更新，阻止 render 调用
// 3.componentWillUpdate：组件即将更新不能修改属性和状态
// 4.render：组件重新描绘
// 5.componentDidUpdate：组件已经更新
// 3.卸载阶段
// 1.componentWillUnmount：组件即将销毁
// 4.shouldComponentUpdate 是做什么的，（react 性能优化是哪个周期函数？）
// 	shouldComponentUpdate用来判断是否要调用render重新描绘dom
// 5.为什么虚拟 dom 会提高性能
// 虚拟dom相当与在js和真实dom之间加了一个缓存，利用dom fiff算法避免没有必要的dom操作
// 用js对象结构表示dom树的结构，然后利用这个树构建一个真正的DOM树 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较 把所记录的差异应用到步骤 1 所构建的真正的 DOM 树上
// 6.dom diff算法
// 1.不同类型的元素生成不同的树，也就是说把树形结构按照层级分解，只比较同级元素
// 2.使用keys来标记那些元素是贯穿不同渲染是稳定的
// 3.相同类型的元素只比较元素，更新style时只更新css属性
// 4.组件相同时，实例保持相同，react通过更新底层的属性来匹配新元素
// 5.合并操作，调用setState时，将传入的对象和当前状态合并，标记为dirty，直到每个事件循环结束，React检查所有标记dirty的组件重新绘制
// 7.React 中 refs 的作用是什么？
// 	refs是React提供给我们安全访问DOM元素或者某个组件实例的句柄，使用React.createRef()创建 使用current访问组件内部 也可以使用回调函数引用其组件实例
// 8.ref转发
// 一种自动将ref通过组件传递给子组件的技术
// 9.回调渲染模式
// 类似高阶组件 在render中 return this.props.children(this.state.user) 根据user去渲染不同组件 <zujian>{(user) = > user == nulll ? <l>:<b>}</zujian>
// 10.展示组件(Presentational component)和容器组件(Container component)之间有何不同
// 展示组件关心组件看起来是什么 展示专门通过props接受数据和回调 并且不会有自身的状态 就是有状态关系的也是UI状态而不是数据状态 类似高阶组件 负责展示不同组件
// 容器组件则更关心组件是如何运作的，容器组件会为其他展示或容器组件提供数据和行为（redux）它们会调用 Flux actions，并将其作为回调提供给展示组件。容器组件经常是有状态的，因为它们是(其它组件的)数据源。
// 11.类组件(Class component)和函数式组件(Functional component)之间有何不同
// 1.类组件允许你使用更多额外的功能，如自身状态和生命钩子，也能使用组件直接访问store并维持状态
// 2.当组件仅是接受props，并将组件自身渲染到页面时，组件就是一个无状态组件，可以使用一个纯函数来创建一个这样的组件，这种组件也被称为哑组件或者展示组件
// 12.(组件的)状态(state)和属性(props)之间有何不同
// 1.props是只读的，并禁止修改自身props，state是自身的状态，在运行过程中不断变化的
// 2.props是一种从上而下的数据流，state是存在自身组件中的不断变化的数据
// 3.state是一种数据结构，props不仅仅使数据，回调函数也可以通过props传递
// 13.何为受控组件(controlled component)
// 组件的状态变化受react通过state控制，如input标签输入值时自动更新，而react通过state更新
// 14.何为高阶组件(higher order component)
// 以一个组件作为参数返回一个新组件。作用逻辑代码重用，共享react组件之间的行为
// 15.为什么建议传递给 setState 的参数是一个 callback 而不是一个对象
// 因为props和state的更新可能是异步的，不能依赖他们的值去计算下一个state
// 16.除了在构造函数中绑定 this，还有其它方式吗
// 可以使用属性初始化值设定来正确绑定回调，问题是每次组件渲染时都会创建一个新的回调。
// 17.(在构造函数中)调用 super(props) 的目的是什么
// 在super()被调用之前，子类是不能使用this的，在ES6中，子类必须在constructor中调用super(),传递props给super()的原因则是便于在子类中能在constructor访问this.props
// 18.应该在 React 组件的何处发起 Ajax 请求
// componentDidMount () 这个方法在组件加载第一次后执行，在组件的生命周期中仅会执行一次
// 19.描述 事件在 React 中的处理方式。
// 	为了解决跨浏览器的兼容性问题，react中的事件处理程序将传递给SyntheticEvent的实例 它是React的浏览器本机事件的跨浏览器包装器
// 20.createElement 和 cloneElement 有什么区别？
// 	react使用createElement(标签名|组件,属性,子组件)来创建元素 cloneElement(react元素,新属性) return 新元素 旧元素被替换
// 21.React 中有三种构建组件的方式
// 类组件，函数组件，React.createClass()
// 22.react 组件的划分业务组件技术组件？
// 	根据组件的职责通常把组件分为 UI 组件和容器组件
// UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑
// 两者通过 React-Redux 提供 connect 方法联系起来
// 23.React 项目用过什么脚手架
// creat-react-app
// 24.简述 flux 思想
// Flux 的最大特点，就是数据的"单向流动"。
// 	1.用户访问 View
// 2.View 发出用户的 Action
// 3.Dispatcher 收到 Action，要求 Store 进行相应的更新
// 4.Store 更新后，发出一个"change"事件
// 5.View 收到"change"事件后，更新页面
// 25.了解 redux 么，说一下 redux 把
// redux 是一个应用数据流框架，主要是解决了组件间状态共享的问题（状态容器，提供可预测化的状态管理），原理是集中式管理，主要有三个核心方法：
// 	action：用于描述修改状态的对象，
// 	store：唯一的数据源通过createStore创建，
// 	reducer：执行修改状态的方法 reducer较多时采用combineReducers拆分
// 工作流程是view调用store的dispatch接受action传入store，reducers进行state操作，view通过store的getState获取最新的数据
// 27.redux缺点：
// 	1.一个组件所需的数据，必须由父组件传过来
// 2.当一个租价相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新render，影响效率，或需要写复杂的shouldComponentUpdate进行判断
// 28.何为 JSX
// JSX是js语法的一种还能语法扩展，并拥有js的全部功能，JSX生产React元素。JSX阻止了注入攻击 所有内容在被渲染前都被转换为字符串
//
// less||Sass
// 1.sass和less的区别
// 定义变量的符号不同，less是用@，sass使用$
// 变量的作用域不同，less在全局定义，就作用在全局，在代码块中定义，就作用于整个代码块。而sass只作用域全局
// 编译环境不同，less在开发者环境编译，sass在服务器环境下编译。
//
// webpack
// 1.介绍一下webpack
// webpack是一个前端模块化打包工具，主要由入口，出口，loader，plugins四个部分
//
// es6
// 1.ES6中箭头函数与普通函数的区别
// 1.箭头函数没有函数提升
// 2.箭头函数没有this，arguments
// 3.箭头函数不能作为构造函数，不能被new，没有property
// 4.call和apply只有参数，没有作用域
// 2.使用箭头函数(arrow functions)的优点是什么
// 1.作用域安全：普通函数每一个新建的函数都有定义自身的this值（在构造函数中是新对象，在严格模式中是undefinde，如果函数被称为对象方法，则为基础对象等），但箭头函数不会，它使用封闭执行上下文的this值
// 2.简单，清晰
// 3.let和const
// let声明的变量不会提升 暂时性死区，声明的变量作用于限与块中 声明相同变量会编译报错
// const声明一个常量 不可修改
// 4.解构赋值
// let [a,b,c] = [1,2,3];
// 5.字符串的扩展
// 1.模板字符串：··
// 	2.ES6 为字符串添加了遍历器接口
// 6.async异步操作
// 返回一个Promise对象 遇到await就先返回 等异步操作完成再执行后面的语句
// 7.Promise
// 语法：const promist = new Promise((resolve, reject) => )
// 是异步编程的一种解决方案
// 有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）
// 	resolve()：操作成功  reject()：操作失败
// Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。