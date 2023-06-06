/**
 * 数据代理
 * @param {*} data 需要代理的Data数据
 */
export default function (object, value, fun, state = false) {
  // 生命周期调用
  if (this.life && this.life.initData) { this.life.initData.call(this, object) };

  let _this = this;
  //内部函数方便自调用
  let DataMonitor = function (d_object, d_value, d_fun) {
    //设置get和set 函数
    function monitor(object, i, addobject) {
      Object.defineProperty(object, i, {
        enumerable: true,
        // writable: true,
        get() {
          return addobject
        },
        set(val) {
          if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || val instanceof Object) {
            if (JSON.stringify(addobject) !== JSON.stringify(val)) {
              addobject = val;
              d_fun.call(_this);
              // 调用函更新数组件
              _this._upDateComponent();

              //* 生命周期调用
              if (_this.life.upDate) { _this.life.upDate.call(_this) };
            }
          }
        }
      });
    };
    //数组API劫持 函数
    function ArrayBroker(arr, funs) {
      let newPrototype = Object.create(Array.prototype);
      let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];
      methods.forEach(method => {
        newPrototype[method] = function (...args) {
          // 关键部分 我们使用延时定时器将函数调用由同步变为异步操作
          // 这步是为了让对数组的的操作先执行，在执行函数的调用
          setTimeout(function () {
            funs.call(_this);
            // 调用函更新数组件
            _this._upDateComponent();
          }, 0);

          let tempdata = args;
          let tempObj = null;
          // 判断push操作
          if (method == 'push' || method == 'unshift') {
            if (tempdata[0] instanceof Array) {
              tempObj = new Array;
              DataMonitor(tempObj, ...tempdata[0], funs);
              tempdata = [tempObj];
            } else if (tempdata[0] instanceof Object) {
              tempObj = new Object;
              DataMonitor(tempObj, tempdata[0], funs);
              tempdata = [tempObj];
            }
          }
          return Array.prototype[method].call(this, ...tempdata);
        };
      });
      arr.__proto__ = newPrototype;
      //判断数组中是否有对象和数组如果有进行get set和数组监听
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
          ArrayBroker(arr[i], funs);
        } else if (arr[i] instanceof HTMLElement ? false : (arr[i] instanceof Object) && (typeof arr[i] == 'object')) {
          let temp = arr[i];
          arr[i] = new Object();
          arr[i].__proto__ = temp.__proto__;
          DataMonitor(arr[i], temp, funs);
        }
      }
    };

    //判断数据类型并做对应操作 分为 数组 Dom对象 对象 其他
    for (let i in d_value) {
      //for in 会遍历对象原型上自定义的方法
      //使用 hasOwnProperty 来判断是否是对象上自生的
      if (d_value.hasOwnProperty(i)) {
        if (d_value[i] instanceof Array) {
          //数组解构赋值防止对原数组的更改
          monitor(d_object, i, [...d_value[i]]);
          ArrayBroker(d_object[i], d_fun);
        } else if (d_value[i] instanceof HTMLElement) {
          monitor(d_object, i, d_value[i]);
        } else if (d_value[i] instanceof Function) {
          monitor(d_object, i, d_value[i].bind(_this));
        } else if ((d_value[i] instanceof Object) && (typeof d_value[i] == 'object')) {
          monitor(d_object, i, new Object());
          d_object[i].__proto__ = d_value[i].__proto__;
          DataMonitor(d_object[i], d_value[i], d_fun);
        } else {
          monitor(d_object, i, d_value[i]);
        }
      }
    }
  };
  //调用一次
  DataMonitor(object, value, fun);
  if (state) { fun() };

  return object;
};