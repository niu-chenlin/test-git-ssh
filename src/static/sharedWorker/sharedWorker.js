
// onconnect = function(e) {
//     var port = e.ports[0];
//
//     port.onmessage = function(e) {
//         var workerResult = 'Result: ' + e.data;
//         port.postMessage(workerResult);
//     }
// };

var a = 1;
onconnect = function (e) {
    var port = e.ports[0];
    port.onmessage = function () {
        port.postMessage(a++);
    }
};


// 线程中能做的事：
// 1.能使用setTimeout(), clearTimeout(), setInterval(),clearInterval()等函数。
// 2.能使用navigator对象。
// 3.能使用XMLHttpRequest来发送请求。
// 4.可以在线程中使用Web Storage。
//
// 5.线程中可以用self获取本线程的作用域。
//
//
//
// 线程中不能做的事：
// 1.线程中是不能使用除navigator外的DOM/BOM对象，例如window,document（想要操作的话只能发送消息给worker创建者，通过回调函数操作）。
// 2.线程中不能使用主线程中的变量和函数。
// 3.线程中不能使用有"挂起"效果的操作命令，例如alert等。
// 4.线程中不能跨域加载JS。