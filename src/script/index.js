
// var box = document.getElementById('box');
// var inner = box.children[0];
// var ul = inner.children[0];
// var ulList = ul.children;
// var ol = inner.children[1];
// var arr = document.getElementById('arr');
// var imgWidth = inner.offsetWidth;
// var right = document.getElementById('right');
// var pic = 0;
// //根据li个数，创建小按钮
// for(var i = 0; i < ulList.length; i++) {
//     var olLi = document.createElement('li');
//     ol.appendChild(olLi);
//     olLi.innerText = i+1;
//     olLi.setAttribute('index', i);
//     //为按钮注册mouseover事件
//     olLi.addEventListener('onmouseover', function() {
//         //先清除所有按钮的样式
//         for(var j = 0; j < ol.children.length; j++) {
//             ol.children[j].removeAttribute('class');
//         }
//         this.className = 'current';
//         pic = this.getAttribute('index');
//         animate(ul, -pic*imgWidth);
//     })
// }
// //设置ol中第一个li有背景颜色
// ol.children[0].className = "current";
// //克隆一个ul中第一个li,加入到ul中的最后=====克隆
// ul.appendChild(ul.children[0].cloneNode(true));
// var timeId = setInterval(onmouseclickHandle, 3000);
// //左右焦点实现点击切换图片功能
// box.onmouseover = function() {
//     arr.style.display = 'block';
//     clearInterval(timeId);
// };
// box.onmouseout = function() {
//     arr.style.display = 'none';
//     timeId = setInterval(onmouseclickHandle, 3000);
// };
// right.onclick = onmouseclickHandle;
// function onmouseclickHandle() {
//     //如果pic的值是5,恰巧是ul中li的个数-1的值,此时页面显示第六个图片,而用户会认为这是第一个图,
//     //所以,如果用户再次点击按钮,用户应该看到第二个图片
//     if(pic == ulList.length-1) {
//         //如何从第6个图,跳转到第一个图
//         pic = 0;//先设置pic=0
//         ul.style.left = 0 + "px";//把ul的位置还原成开始的默认位置
//     }
//     pic++;//立刻设置pic加1,那么此时用户就会看到第二个图片了
//     animate(ul, -pic * imgWidth);//pic从0的值加1之后,pic的值是1,然后ul移动出去一个图片
//     //如果pic==5说明,此时显示第6个图(内容是第一张图片),第一个小按钮有颜色,
//     if (pic == ulList.length - 1) {
//         //第五个按钮颜色干掉
//         ol.children[ol.children.length - 1].className = "";
//         //第一个按钮颜色设置上
//         ol.children[0].className = "current";
//     } else {
//         //干掉所有的小按钮的背景颜色
//         for (var i = 0; i < ol.children.length; i++) {
//             ol.children[i].removeAttribute("class");
//         }
//         ol.children[pic].className = "current";
//     }
// }
// left.onclick=function () {
//     if (pic==0){
//         pic=ulList.length-1;
//         ul.style.left=-pic*imgWidth+"px";
//     }
//     pic--;
//     animate(ul,-pic*imgWidth);
//     for (var i = 0; i < ol.children.length; i++) {
//         ol.children[i].removeAttribute("class");
//     }
//     //当前的pic索引对应的按钮设置颜色
//     ol.children[pic].className = "current";
// };
// //设置任意的一个元素,移动到指定的目标位置
// function animate(element, target) {
//     clearInterval(element.timeId);
//     //定时器的id值存储到对象的一个属性中
//     element.timeId = setInterval(function () {
//         //获取元素的当前的位置,数字类型
//         var current = element.offsetLeft;
//         //每次移动的距离
//         var step = 10;
//         step = current < target ? step : -step;
//         //当前移动到位置
//         current += step;
//         if (Math.abs(current - target) > Math.abs(step)) {
//             element.style.left = current + "px";
//         } else {
//             //清理定时器
//             clearInterval(element.timeId);
//             //直接到达目标
//             element.style.left = target + "px";
//         }
//     }, 10);
// }

// var $bannerUl=$('#banner ul'),$bannerLi=$('#banner ul li');
// //动态获取ul的宽度
// $bannerUl.css('width',$bannerLi.width()*$bannerLi.length);
// setInterval(function(){
//     $bannerUl.animate({
//         'marginLeft':-$bannerLi.width()
//     },500,function(){
//         $(this).animate({'marginLeft':0},0)
//             .find('li').eq(0).appendTo($(this));
//         //把每次移动后的第一个li放到ul的最后面
//         /*
//         * 由于把第一个li放到ul的最后面，就会把第二个li挤到第一个li的位置，但是我们又需要显示第二个li，
//         * 所以需要移动回原点，但是这个移动过程不能被看到，所以执行时间是0
//         */
//     });
// },3000);

var mySwiper = new Swiper('.swiper-container', {
    autoplay: true,             // 可选选项，自动滑动
    speed: 1000,                // 切换速度,滑动开始到结束的时间ms
    loop : true,               // 回路
    navigation: {   //前进后退按钮
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {           //分页器
        el: '.swiper-pagination',
        dynamicBullets: true,  //当你的slide很多时，开启后，分页器小点的数量会部分隐藏。
        clickable :true,       //点击时切换
    },
});