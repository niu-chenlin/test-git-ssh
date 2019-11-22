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


    // 获取的是浏览器可见区域高度（网页的可视区域的高度）（不滚动的情况下）
    let scrollTop = document.documentElement.scrollTop; //document.documentElement.clientHeight 获取窗口可视区域
    // 元素顶端到可见区域（网页）顶端的距离
    let htmlElementClientBottom = document.getElementById('ww').getBoundingClientRect().bottom; //元素
    // 网页指定元素进入可视区域
    if (scrollTop < htmlElementClientBottom) {
        // TODO 执行你要做的操作
        console.log("进");
    } else {
        console.log("出");
    }

    // console.log(document.getElementById('ww').getBoundingClientRect().height);  //260
    // console.log(document.documentElement.scrollTop);                      //4
    // console.log(document.getElementById('box').getBoundingClientRect().height); //4734
    //260 > 4 > 260-4734
    //260 > 305 > 260-4734
}, false);
