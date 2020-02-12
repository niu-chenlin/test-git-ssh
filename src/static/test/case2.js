(function(){
    let num1 = 12.777;
    console.log(num1.toString());
    let te = new Boolean(false);
    console.log(new Boolean(false) && true); //te被作为一个对象转换为了true （在 Boolean 表达式中，所有【对象】都会被自动转换为 true）
    function simpleClone() {
        Object.assign = Object.assign || function() {
            let target = arguments[0], args = Array.prototype.slice.call(arguments, 1);
            args.forEach(function(item) {
                for(let key in item) {
                    item.hasOwnProperty(key) && (target[key] = item[key])
                }
            });
            return target;
        }
    }
    function deepClone(obj, target = {}) {//深拷贝 有待研究 (修改拷贝副本不会影响主本)
        for(let key in obj) {
            if(typeof obj[key] === 'object') {
                target[key] = deepClone(obj[key], target[key]);
            } else {
                target[key] = obj[key];
            }
        }
        return target;
    }
    let obj = {
        a: "hello",
        b:{
            a: "world",
            b: 21
        },
        c:["Bob", "Tom", "Jenny"],
        d:function() {
            alert("hello world");
        }
    };
    let arr = [1,2,{a: 3}];
    let c_arr = deepClone(obj);
    c_arr.b.a = "哈哈";

    let arr1 = [0,1,2,1,2,0,1,2];
    function qc(arr) {
        let map = new Map();
        let ret = [];
        for(let i = 0; i < arr.length; i++) {
            if(map.has(arr[i])) {
                map.set(arr[i], true);
            } else {
                map.set(arr[i], false);
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    console.log(qc(arr1));
})();

function newO() { //手动实现new操作
    function newObj() {
        let obj = {}; //1.创建空对象
        let Constructor = Array.prototype.shift.call(arguments);//2.获取构造函数
        obj.__proto__ = Constructor.prototype; //3.连接到原型
        let ret = Constructor.apply(obj, arguments); //4.将构造函数中的this指向新对象，这样新对象就可以访问构造函数中的属性和方法
        console.log(ret); //return {}
        return typeof ret === "object" ? ret : obj; //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
    }
    function People(name,age){
        this.name = name;
        this.age = age;
        return {}
    }
    let p1 = newObj(People,'Rose',18);//调用自定义create实现new
    console.log(p1.name); //Rose
    console.log(p1.age); //18

    let p2 = new People("Sean", 25);
    console.log(p2.name);
    console.log(p2.age);
}