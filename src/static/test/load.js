console.log(document.getElementById("cd")); //普通script会阻塞dom解析，因此script写在cd标签之前导致无法获取dom节点输出null
//同时javascript的执行会受到标签前面样式文件的影响。如果在标签前面有样式文件，需要样式文件加载并解析完毕后才执行脚本。这是因为javascript可以查询对象的样式。
//这里的 DOMContentLoaded 事件必须等待其所属script之前的样式表加载解析完成才会触发。
//对于首屏时间而言，js放在HTML文档的开头和结尾处效果是一样的而js放在结尾的目的并不是为了减少首屏时间，而是由于js经常需要操纵DOM，放在后面才更能保证找到DOM节点

//带async的脚本一定会在load事件之前执行，可能会在DOMContentLoaded之前或之后执行
// 为什么DOMContentLoaded事件的触发既可能在async脚本执行前、又可能在async脚本执行后呢？因为，async 标签的脚本加载完毕的时间有两种情况：
//情况1： HTML 还没有被解析完的时候，async脚本已经加载完了，那么 HTML 停止解析，去执行脚本，脚本执行完毕后触发DOMContentLoaded事件。
//情况2： HTML 解析完了之后，async脚本才加载完，然后再执行脚本，那么在HTML解析完毕、async脚本还没加载完的时候就触发DOMContentLoaded事件。
//总之， DomContentLoaded 事件只关注 HTML 是否被解析完，而不关注 async 脚本。

//如果 script 标签中包含 defer，那么这一块脚本将不会影响 HTML 文档的解析，而是等到 HTML 解析完成后才会执行。而 DOMContentLoaded 只有在 defer 脚本执行结束后才会被触发。
//情况1：HTML还没解析完成时，defer脚本已经加载完毕，那么defer脚本将等待HTML解析完成后再执行。defer脚本执行完毕后触发DOMContentLoaded事件。
//情况2：HTML解析完成时，defer脚本还没加载完毕，那么defer脚本继续加载，加载完成后直接执行，执行完毕后触发DOMContentLoaded事件。


// <script src="script.js"></script>
// 没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。
//
// <script async src="script.js"></script>
// 有 async，加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。
//
// <script defer src="myscript.js"></script>
// 有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。


//渲染引擎的作用包含解析html（触发资源请求，生成dom），生成render树，计算页面布局，绘制，以及样式改变下的重排（对布局位置重新计算），重绘（绘制在屏幕上）
//渲染引擎与JS引擎为互斥关系，但根据timeline发现，JS执行时布局、重排和解析html（不包括dom生成）也可能会同时执行，但绘制、重绘与JS一定是互斥的
//这也许是浏览器做的优化策略，在JS引擎执行时，渲染引擎也不会完全不工作，而会做一些计算布局及解析html的事情，总之，浏览器在尽可能快的加载页面
//鉴于渲染引擎与JS引擎为互斥关系，不管defer async 执行阶段总会阻塞dom解析


//扩展
//DOM是Document Object Model（文档对象模型）的缩写。它是为HTML和XML定义的一个编程接口，提供了文档的结构化表示（节点树状结构），
// 同时也规定了使用脚本编程语言（例如JavaScript）应该如何访问以及操作DOM。