let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

document.addEventListener(visibilityChange, function () {
    if (document.visibilityState === 'hidden') {
        document.title = '小样儿你愁啥呢，回来';
    }
    if (document.visibilityState === 'visible') {
        document.title = '欢迎小样儿回来';
    }
}, false);

document.addEventListener("scroll", function() {
    let scrool = document.documentElement.scrollTop || document.body.scrollTop;
    if (revealOnScroll(document.getElementById('ww'))) {
        document.getElementById('ww').style.animation = "dh 5s ease-in";
    } else {
        document.getElementById('ww').style.animation = "";
    }
}, false);



function revealOnScroll(el) {
    var win_height_padded = window.innerHeight * 1.1; //窗口尺寸
    var scrolled = document.documentElement.scrollTop; //获取滚动条位置
    var rect = el.getBoundingClientRect();
    var offsetTop = el.getBoundingClientRect().top; //offsetTop：获取元素XY坐标 坐标值相对于父元素的坐标而不是文档坐标 getBoundingClientRect：
    var offsetBottom = el.getBoundingClientRect().bottom; //bottom 绝对X坐标
    if (win_height_padded > offsetTop && offsetBottom > 0) {//窗口尺寸+滚动条位置 > 元素绝对Y坐标  + scrolled
        return true;
    }
    // if (rect.top > 0 && rect.bottom < win_height_padded) {
    //     // rect.top：元素top坐标越往下越小 到负数看不到了；
    //     // rect.bottom：元素bottom坐标越往下越小 到负数看不到了；
    //     return true;
    // }
}

function isElementInViewport(el) {
    //获取元素是否在可视区域
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && //bottom 绝对X坐 <= 标窗口尺寸
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}