(function(){
    // let num1 = 12.777;
    // console.log(num1.toString());
    // let te = new Boolean(false);
    // console.log(new Boolean(false) && true); //te被作为一个对象转换为了true （在 Boolean 表达式中，所有【对象】都会被自动转换为 true）
    function simpleClone() {
        // Object.assign = Object.assign || function() {
        //     let target = arguments[0], args = Array.prototype.slice.call(arguments, 1);
        //     args.forEach(function(item) {
        //         for(let key in item) {
        //             item.hasOwnProperty(key) && (target[key] = item[key])
        //         }
        //     });
        //     return target;
        // }
        let target = arguments[0], args = Array.prototype.splice.call(arguments, 1), key;
        args.forEach((item) => {
            for(key in item) {
                item.hasOwnProperty(item[key]) && (target[key] = item[key])
            }
        });
        return target;
    }
    function deepClone(obj, target = {}) {
        if(Object.prototype.toString.call(obj) === "[object Array]") { //数组
            obj = Array.prototype.slice.call(obj);
            return obj.map(item => {
                // if(Object.prototype.toString.call(item) === "[object Object]") {
                //     return  deepClone1(item);
                // } else {
                //     return item;
                // }
                return Object.prototype.toString.call(item) === "[object Object]" ?
                    deepClone(item) : item;
            })
        } else if(Object.prototype.toString.call(obj) === "[object Object]") {//对象
            for(let key in obj) {
                if(obj.hasOwnProperty(key)) {
                    // if(Object.prototype.toString.call(obj[key]) === "[object Object]") {
                    //     target[key] = deepClone1(obj[key]);
                    // } else {
                    //     target[key] = obj[key];
                    // }
                    obj.hasOwnProperty(key) && (Object.prototype.toString.call(obj[key]) === "[object Object]" ?
                        target[key] = deepClone(obj[key]) : target[key] = obj[key]);

                }
            }
        }
        return target;

        // let obj = {
        //     a: "hello",
        //     b:{
        //         a: "world",
        //         b: 21
        //     },
        //     c:["Bob", "Tom", "Jenny"],
        //     d:function() {
        //         alert("hello world");
        //     }
        // };
        // let arr = [1,2,{a: 3}];
        // // let s_arr = simpleClone({dd: 12}, obj);
        // console.log(s_arr);
        // let c_arr1 = deepClone(arr);
        // c_arr1[2].a = "GGG";
        // console.log(c_arr1);
        // console.log(arr);

    }
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
        // let arr1 = [0,1,2,1,2,0,1,2];
        // console.log(qc(arr1));
    }
    function Person(name, age, sex) {
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.sayName = function() {
            return this.name;
        }
    }
    let per = new Person("sean", 26, "man");
    console.log(per.name); //Math.floor(Math.random()*10)
    function cutStrByStr(value, str) { //截取value中的子字符 3种1.（indexOf|search）+ substring 2.match 3.charAt循环比较
        let start = value.indexOf(str) || value.search(str);
        let end = start + str.length;
        let ret = "";
        for(let i = 0; i < str.length; i++) {
            for(let j = 0; j < value.length; j++) {
                if(str.charAt(i) === value[j]) {
                    ret += value.charAt(j);
                }
            }
        }
        console.log(ret);
        console.log(value.substring(start, end));
        console.log(value.substr(start, str.length));
        console.log(value.match(str)[0]);
        console.log(new RegExp(str).exec(value)[0]);
        return value.substring(start, end) || (value.match(str) && (value.match(str)[0]) || new RegExp(str).exec(value)[0]) || ret
    }
    function getStrIndex(value, type, str, i) {
        if(Object.prototype.toString.call(value) == "[object Array]") { //只有数组才有findIndex()
            return value.findIndex((s) => {
                return s == str;
            });
        }
        if(type == "前") { //1个原生方法 2个正则方法
            return value.indexOf(str) || value.search(str) ||
                (value.match(str).index || new RegExp(str).exec(value).index);
        }
        if(type == "charAt") { //1个原生方法 2个正则方法
            return value.charAt(i);
        }
        return value.lastIndexOf(str);
        // console.log(getStrIndex(['te', 'st', 'ee'], '前', 'ee'));
        // console.log(getStrIndex('testee', '前', 'ee'));
        // console.log(getStrIndex('testee', 'charAt', 'ee', 3));
    }
    function clearBlank(v) {
        return v.replace(/^\s*|\s*$/g, '');
        // console.log(" niu chen lin ");
        // console.log(clearBlank(" niu chen lin "));
    }
    function promote() {
        console.log(foo);
        // let foo = "变量";
        function foo(){
            console.log("函数声明");
        }
        console.log(foo);

        // console.log(fnTe);
        // let fnTe = 100;
        // function fnTe() {
        //     return 10;
        // }
        // console.log(fnTe);

        // fnTe = 100;
        // let fnTe;
        // console.log(fnTe);
    }
    function bb() {
        var i = 10;
        function fn() {
            console.log(++i);
        }
        return fn;
        // var func = bb();
        // func();

        var Person=(function(){
            /*共享函数*/
            let checkNo=function(no){
                if(!no.constructor=="string"||no.length!=4){
                    throw new Error("必须为4位数");
                };
            };
            let times=0;//共享数据
            return function(no,name,age){
                console.log(times++);
                this.setNo=function(no){
                    checkNo(no);
                    this._no=no;
                };
                this.getNo=function(){
                    return this._no;
                };
                this.setName=function(name){
                    this._name=name;
                };
                this.getName=function(){
                    return this._name;
                };
                this.setAge=function(age){
                    this._age=age;
                };
                this.getAge=function(age){
                    return this._age;
                };
                this.setNo(no);
                this.setAge(age);
                this.setName(name);

            }
        })();
        let per0=new Person("0001",15,"simu");//输出之后times会逐渐增加，变为1、2、3
        let per1=new Person("0002",15,"simu1");
        let per2=new Person("0003",15,"simu2");
        console.log( per0.getName());
        console.log( per1.toString());
        console.log( per2.toString());
    }

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

/**
 * 实现subType类对工厂类中的superType类型的抽象类的继承
 * @param subType 要继承的类
 * @param superType 工厂类中的抽象类type
 */
const VehicleFactory = function(subType, superType) {
    if (typeof VehicleFactory[superType] === 'function') {
        function F() {
            this.type = '车辆'
        }
        F.prototype = new VehicleFactory[superType]();
        subType.constructor = subType;
        subType.prototype = new F();             // 因为子类subType不仅需要继承superType对应的类的原型方法，还要继承其对象属性
    } else throw new Error('不存在该抽象类')
};
VehicleFactory.Car = function() {
    this.type = 'car'
};
VehicleFactory.Car.prototype = {
    getPrice: function() {
        return new Error('抽象方法不可使用')
    },
    getSpeed: function() {
        return new Error('抽象方法不可使用')
    }
};

const BMW = function(price, speed) {
    this.price = price;
    this.speed = speed;
};
VehicleFactory(BMW, 'Car');      // 继承Car抽象类
BMW.prototype.getPrice = function() {        // 覆写getPrice方法
    console.log(`BWM price is ${this.price}`)
};
BMW.prototype.getSpeed = function() {
    console.log(`BWM speed is ${this.speed}`)
};

const baomai5 = new BMW(30, 99);
baomai5.getPrice();                             // BWM price is 30
baomai5 instanceof VehicleFactory.Car;       // true

window.onload = function() {

};
document.onreadystatechange = function() {
    if(document.readyState === 'loading') {
        console.log(document.readyState)
    }
};
document.addEventListener('DOMContentLoaded', function() {
    if(document.readyState === "loading") {
        document.write("<span>this is write</span>");
    }
});

// document.write("<span>this is write</span>");
let ret = [];
for(let i = 0; i < 100001; i++) {
    ret.push(i);
}

console.log(a);
var a = "a";

