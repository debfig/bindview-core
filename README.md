## bindview.js [![npm](https://img.shields.io/npm/v/bindview.svg)](https://www.npmjs.com/package/bindview)
### 1. 重新设计虚拟DOM

> 其他部分与原来无异，改变的是文本节点将文本节点变为一个对象，由 `type`,`value`,`key` 来描述，最终将文本创建为一个节点来达到准确更新

```js
{
 elementName: "div",
 attributes: {class:'Root'},
 key:'2dc6d7e1-e925-4c35-8a6f-aeca8169822d',
 children: [
     {
         type:'text',
         value:'hello',
         key:'2dc6d7e1-e925-4c35-8a6f-aeca8169822d'
     },
     {
         elementName:"span",
         attributes:{},
         key:'2dc6d7e1-e925-4c35-8a6f-aeca8169822d',
         children:[]
     }
 ]
}
```
>### 2. bindview.js 例子
>在bindview.js 的配置对象中 `el` 用来获取页面要渲染在那个根标签, `data` 用来存放页面中要使用到的数据, `node()` 函数是页面创建时需要的虚拟dom树， `h` 形参是是一个方法可以创建虚拟`DOM`,它也可以拿到`methods`上的方法, `node()` 函数中的虚拟dom写法有下列三种，第一种是使用对象的形式来书写虚拟dom树,第二种是使用 `h` 对象它本身就是个方法 传入特定参数就会返回一个虚拟dom对象, `h` 方法有下列几种传参方式,第三种是`JSX`的写法，通过JSX来编写结构推荐

>第一种对象写法 这种写法不推荐了结即可
```js
  const Bv = new Bindview({
    el: '#Root',
    data: {
      title: 'hello Bindview.js'
    },
    node(h) {
      return {
        elementName: 'ul',
        attributes: {},
        children: [
          {
            elementName:'li',
            attributes:{},
            children:['苹果']
          }
        ]
      }
    }
  })
```
> 第二种写法 使用`h`函数来创建虚拟DOM这种写法可以在`webpack`环境下使用，也可以在浏览器环境下使用
```js
  const Bv = new Bindview({
    el: '#Root',
    data: {
      title: 'hello Bindview.js',
    },
    node(h) {
      return h('ul', {}, [
      	h('li'),
      	h('li', '苹果'),
      	h('li', {}, ['葡萄']),
      	h('li', h('span', '香蕉')),
      	h('li', [h('span', '鸭梨')]),
      	h('li', '菠萝', []),
    ])
    },
  })
```
> 第三种写法 使用`JSX`来编写结构,在bindview提供的bindview-Template中可以使用,下面的例子都将使用JSX形式
```jsx
  const Bv = new Bindview({
    el: '#Root',
    data: {
      title: 'hello Bindview.js',
    },
    node() {
      return (
        <ul>
          <li>苹果</li>
          <li>{'葡萄'}</li>
          <li class="dome">{this.title}</li>
        </ul>
      )
    },
  })
```
>### 3. methods配置对象和事件绑定和refs属性
>`methods`配置对象用来配置需要使用到的方法,可以在`JSX`上通过`onClick` 属性来绑定一个点击事件属性值为事件的回调函数例如`onClick={add}`，也可以通过`onClick={[add,value1,value2]}` 这种方式来传递参数,  在JSX中添加`ref`属性，构造函数实例上有一个`refs`属性,属性值就是添加了`ref`属性的JSX元素所对应的真实`dom`元素 ，如果多个`ref`属性的值相同那么`refs`上会以数组的方式存储
```jsx
  const Bv = new Bindview({
    el: '#Root',
    node(h) {
      return (
        <div>
          <p ref="p1">{this.title}</p>
          <button onClick={[h.add,'hello','bindview.js']}>'title++'</button>
        </div>
      )
    },
    data: {
      title: 0,
    },
    methods:{
      add(DOM,Event,value1,value2){
         // 方法被事件调用 
         // 形参一为 DOM 对象 
         // 形参二为 事件对象 event 
         // 形参三为 传递过来的参数
         // 形参四为 传递过来的参数
          
         // this 指向了当前实例对象
        console.log(value1,value2);
      }
    }
  })
```
>### 4. 生命周期函数
>生命周期函数需要写在 `life` 配置对象中

|   函数名    |        使用         |
| :---------: | :-----------------: |
| `initData`  | `data` 数据初始化前 |
| `createDom` |  `DOM` 元素挂载后   |
| `domUpdate` |  `DOM` 数量变化后   |
|  `upDate`   |    `data` 更新后    |
| `unLoading` |     组件卸载前      |
```jsx
  const An = new Bindview({
    el: '#Root',
    node(h) {
      return (
        <div>'生命周期'</div>
      )
    },
    life: {
    	initData(data) {
      		console.log('data初始化前', data);
    	},
    	domUpdata() {
      		console.log('DOM数量变化后');
    	},
    	createDom() {
      		console.log('DOM创建后');
      		console.log(this);
    	},
    	upDate() {
      		console.log('数据更新后');
    	}
    }
  })
```
>### 5. `Bindview.prototype.$dataProto()` 方法
>`Bindview.prototype.$dataProto()` 方法用来在初始化对象前在`data`配置对象原型上添加原型属性 参数一是(key)键，参数二是(value)值
```jsx
  // 使用 Bindview.prototype.$addDataMethods() 在data原型上添加方法
  Bindview.prototype.$dataProto('out', function () {
    console.log('$dataProto');
  })

  const Bv = new Bindview({
    el: '#Root',
    node(h) {
      return (
        <div>"在data原型上添加方法"</div>
      )
    },
    data: {
      title: 0,
    }
  })
```
>### 6.  `$add()` 向data中添加新的属性值
>调用`$add()`方法传入一个对象，他可以将对象中的属性和方法添加到 `data` 上
```jsx
  const Bv = new Bindview({
    el: '#Root',
    data: {},
    node(h) {
      return (<div>"$add方法"</div>)
    }
  })

  b.$add({
    title: 'hello'
  })
```
>### 7.  `bindview.js` 组件功能
>组件是`Bindview`中的一个重要概念，是一个可以重复使用的`Bindview实例`，它拥有独一无二的组件名称，它可以扩展虚拟DOM，以组件名称的方式作为自定义的虚拟DOM。因为组件是可复用的Bindview实例，所以它们与`new Bindview()`接收相同的选项，例如`data`， `node(h){}`、`methods`以及生命周期钩子等。
>把一些公共的模块抽取出来，然后写成单独的的工具组件或者页面，在需要的页面中就直接引入即可。那么我们可以将其抽出为一个组件进行复用。

>定义一个组件
```jsx
import "./index.less"
// 组件暴露的是一个方法,在组件中不需要添加 el 配置项
export default function () {
  return {
    node(h) {
      return (
        <div class="Test1">
          <div>"Test1 组件"</div>
        </div>
      )
    }
  }
}
```
> 使用组件
```jsx
import Bindview from "../../bindview"

import Test1 from "./Components/Test1"
// $addModule 方法可以将组件注册为全局组件
Bindview.prototype.$addModule('Test1', Test1)
// $addModule 传入一个对像可以同时添加多个全局组件
Bindview.prototype.$addModule({Test,Test1})

new Bindview({
  el: '#Root',
  node() {
    return (
      <div class="root">
      // 用组件名的标签来使用组件, 使用`prop`来传递组件参数,如果参数只有一个可以直接传递不用使用数组来传递
      <Test1 prop={ 1 }/>
      <Test1 prop={ [1,2] }/>
      </div>
    )
  },
  data: {},
  // 使用组件需要注册，全局组件除外
  module: {
    Test1,
  }
})
```
>### 8. 组件接口
>组件接口是子组件方便父组件调用的方法,可以在子组件中通过 `modulePort` 配置项向外暴露不同的接口,`modulePort` 配置项只能向外暴露方法,接口方法中的`this`指向了他所在的组件的实例对象, <span style="color:'red">注意 如果在父组件中使用了两个相同的子组件,子组件向外暴露的接口会被后使用的组件的接口覆盖掉，也就是说在父组件中使用了两个相同的子组件调用组件上的接口只会调用到最后一个被注册组件上的接口</span> 
```jsx
// 子组件定义接口
export default function (title) {
  return {
    node(h) {
      return (<h1>{title}</h1>)
    },
    // 通过 modulePort 定义接口 向外暴露
    modulePort: {
      shou() {
        console.log(title);
      },
    }
  }
}
```
```jsx
// 父组件调用接口
import Bindview from "../../bindview"
import HelloWorld from "./Components/HelloWorld";
new Bindview({
  el: '#Root',
  node(h) {
    return (
      <div class="root">
        <HelloWorld prop={'组件一'} />
      </div>
    )
  },
  methods: {
    chun(_, _this) {
      // 父组件通过实例上的 post 对象拿到所有子组件的接口
      _this.port.shou()
    }
  },
  life: {
    createDom() {
      console.log(this);
    }
  },
  module: {
    HelloWorld
  }
})

```

> ### 9. proto 方法向原型上添加方法或属性
>
> 使用 `proto` 方法可以向构造函数的原型上添加属性或方法，在创造实例前调用使用，有两种使用方法，第一种每次只能添加一个方法或属性，第二种使用对象形式可以添加多个方法或属性

```js
import Bindview from "../../bindview"

import Test from "./Components/Test"

// 使用一
Bindview.proto('Test', Test)

// 使用二
Bindview.proto({
    Test, // 举例
    Test1 // 举例
})

new Bindview({
  el: '#Root',
  node(h) {
    return (
      <div id='div' ref='div'>hello</div>
    )
  }
})

```

> ### 10. 插槽
>
> 插槽是组件中不确定的部分由用户来定义，这部分就叫插槽，相当于一种占位符,在`Bindview`中每个组件只支持一个插槽

```jsx
// 定义插槽
export default function () {
  const { slot } = this;
  // 通过结构 this 获得 slot, 如果组件插槽中有内容 slot 为函数，如果没有为 null
    
  return {
    name: 'Slot',
    node() {
      return (
        <div>
          <div>插槽</div>
          // slot 需要在一个节点中调用, 下面使用三目表达式添加一个默认内容
          // slot 在调用时可以传递一些参数,在自定义内容时可以使用
          <div className="slot">{slot ? slot(this.num, ' Slot组件') : '默认内容'}</div>
          <button onClick={() => this.num++}>Slot data num++</button>
        </div>
      )
    },
    data: {
      num: 0
    }
  }
}
```

```jsx
//使用插槽
import Slot from "./Components/Slot"

export default function () {
  return {
    name: 'App',
    node() {
      return (
        <div id="App" ref='App'>
         // 在组件组件中使用一个函数返回内容，这里的形参是定义插槽是传递的参数
          <Slot>
            {(i, title) => (
                <ul>
                  <li>{i}{title}</li>
                  <li>{this.title} App组件</li>
                </ul>
             )}
          </Slot>
          // 不使用函数返回也是可以的,但会失去响应式
          <Slot>
             <div>{this.title}</div>
          </Slot>
          // 如果内容中有组件需要在定义插槽的组件中注册这个组件，或已在全局注册了这个组件
          <Slot>
            <Toast prop={['插槽', 5000]} />
          </Slot>
          <button onClick={() => this.title++}>App data title++</button>
        </div>
      )
    },
    data: {
      title: 0,
    },
    life: {
      createDom() {
        console.log(this);
      }
    },
    module: {
      Slot
    }
  }
}
```

> ### 11. linkage 配置项
>
> `lingkage` 配置项值为布尔值，默认值为 `true` ,它是用于控制父组件中的数据发生改变时，是否对子组件进行更新，使用场景在子组件展示一些数据但不需要响应式更新的地方，可以使用 `linkage:false`来关闭来自父组件的更新调用

```jsx
// 子组件中配置
import style from "./index.less"
export default function (value) {
  return {
    name: 'Table',
    linkage: false,
    node(h) {
      return (
        <div className={style["Table"]}>{value()}</div>
      )
    }
  }
}
```

> ### 12. $getTxt & $setTxt
>
> `$getTxt` & `$setTxt` 方法用来获取后修改dom节点下文本节点的值,适用于dom节点下只有一个文本节点的地方，如果dom节点下除了文本节点还有其他节点会导致一些错误

```jsx
import Bindview from "../../bindview"

new Bindview({
  el: '#Root',
  node(h) {
    return (
      <div>
      	<button onClick={h.getTxt}>$getTxt</button>
        <button onClick={h.setTxt}>$setTxt</button>
      </div>
    )
  },
  methods:{
      getTxt(dom){
          console.log(this.$getTxt(dom));
      },
      setTxt(dom){
          console.log(this.$setTxt(dom,'new Value'))
      }
  	}
})
```

> ### 13. send 方法
>
> `send` 方法简化组件间传递参数的方法，该方法需要传入两个参数 1.数据源 2.数据项，该方法会返回一个对象对象中有两个方法分被是`get` `set` 用来获取和修改数据

```jsx
import { Bindview, send } from "../../bindview"

// Dome 组件
function Dome(props) {

  let { num, arr } = props

  return {
    name: 'Dome',
    node(h) {
      return (
        <div>
          <div>Dome</div>
          <div>{num.get()}</div>
          <button onClick={h.set}>set</button>
          <div>{arr.get()}</div>
          <button onClick={h.setArr}>setArr</button>
        </div>
      )
    },
    methods: {
      set() {
        // 1. num.set(100)
        // 2. i 是数据
        num.set(i => {
          return ++i;
        })
      },
      setArr() {
        arr.set(100)
      }
    }
  }
}



new Bindview({
  el: '#Root',
  node(h) {
    return (
      <div>
        <div>App</div>
        <Dome num={send(this, 'num')} arr={send(this.arr, 1)} />
      </div>
    )
  },
  data: {
    num: 0,
    arr: [1, 2, 3, 4]
  },
  module: {
    Dome
  }
})
```

> ### 14. $unload 和 $mount
>
> 这两个方法分别为卸载组件(`$unload`)和挂载组件(`$mount`)

```jsx
import Bindview from "bindview"

function Dome(){
    return {
        name:'Dome',
        node(h){
            return (
            	<div>
                	<div>Div</div>
                    <hr />
                    <button onClick={h.remove}>卸载组件</button>
                </div>
            )
        },
        methods:{
            remove(){
                // 卸载当前组件
                this.$unload();
            }
        }
    }
}



new Bindview({
    // 使用 $mount 挂载组件时，添加该配置项
    isModule:true,
    node(){
        return (
        	<div>
            	<div>App</div>
                <div class="Box" ref='Box'></div>
            </div>
        )
    },
    life:{
        createDom(){
            // 传两个参数可以将组件挂载到指定位置
            // 参数一为组件容器 
            // 参数二为组件函数得到调用
            this.$mount(this.refs.Box,Dome());
        }
    }
}).$mount('#Root')
// 该挂载组件方法只适合在 new Bindview 的时候
// 参数为一个是 $mount 会在页面上获取这个 DOM元素并将该组件挂载上去
```

