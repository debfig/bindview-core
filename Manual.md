## 快速上手

### 1. 创建第一个应用

由于该库还不支持 `src` 引入，接下来的例子我将在 `webpack` 下演示，<a href="https://github.com/bronze-ding/bindview-Template">webpack 模板</a> 我已经配置好，可直接下载使用

创建一个应用可用通过 `new` 来创建实例或通过提供的  `createApp` 方法来创建下面我将分别演示

1. 通过 `new` 来创建 App , `el` 配置项用来选择 `DOM` 被渲染到那个节点下， `node` 方法返回一个虚拟 `DOM` ，`h` 函数可以创建一个虚拟 `DOM`，`node` 返回的虚拟 `DOM` 将被转换为真实 `DOM` 并添加到 id 为 Root 的 节点下，<span style="color:red">！！！</span> 通过 `new` 创建的实例常常用来配置一些全局的方法，数据和组件

```js
// 导入 Bindview.js
import Bindview from "bindview"

// new 一个实例
new Bindview({
    el:"#Root",
    node(h){
        return h("div","hello") 
    }
})
```

2. 通过 `createApp` 方法来创建 App , 在 `createApp` 方法中传入一个组件，在通过 `$mount` 方法将虚拟 `DOM` 添加到 id 为 Root 的 节点下，如何创建一个组件将在后面讲到

```js
import { createApp } from "bindview"
import App from "./App"

createApp(App).$mount("#Root")
```

### 2. 虚拟 `DOM` 的创建

1. 通过 `h` 函数来创建虚拟 `DOM` , 虚拟 `DOM` 本质上就是一个 `真实 DOM` 抽象为一个 js 对象，对象上记录了 `DOM` 的类型，属性和子节点的信息，在 `node` 方法中可以通过 `h` 函数来创建虚拟 `DOM` , `h` 通过下面 6 种方式都可以创建出虚拟 `DOM` , 通过 `h` 的的函数来创建 虚拟 `DOM` 的方式，不是很推荐，因为过程太繁琐我推荐使用 `JSX` 的方式来创建 

```js
// 导入 Bindview.js
import Bindview from "bindview"

new Bindview({
    el: '#Root',
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

2. 通过 `JSX` 来创建，在我配置好的 <a href="https://github.com/bronze-ding/bindview-Template">webpack 模板</a> 下可以使用 `JSX` 来创建虚拟 `DOM` ,是非常推荐的做法，后面的例子都将使用 `JSX` 的形式

```js
// 导入 Bindview.js
import Bindview from "bindview"

new Bindview({
    el: '#Root',
    node() {
      return (
      	<div>Hello World</div>
      )
    },
  })
```

### 3. 组件的定义和使用

组件是 `Bindview` 中的一个重要概念，是一个可以重复使用的 `Bindview实例`，它拥有独一无二的组件名称，它可以扩展虚拟 `DOM`，以组件名称的方式作为自定义的虚拟 `DOM`。因为组件是可复用的 Bindview 实例，所以它们与`new Bindview()`接收相同的选项，例如`data`， `node(h){}`、`methods`以及生命周期钩子等。
把一些公共的模块抽取出来，然后写成单独的的工具组件或者页面，在需要的页面中就直接引入即可。那么我们可以将其抽出为一个组件进行复用。

定义一个组件，`Bindview` 的组件是一个函数返回一个配置对像，对象中只有 `node` 配置项是必须的其他的配置项都不是必须的, 函数的 `props` 形参 用来接收一些传递给组件的参数，组件中还有一些功能将在后面的内容中讲到

```jsx
// 定义一个 App 组件
export default function App(props) {
  return {
    name: 'App',
    node() {
      return (
        <div id="App">
          <div>Hello World</div>
        </div>
      )
    }
  }
}
```

使用组件, 将组件注册到 `module` 配置项中，<span style="color:red">！！！</span> 组件名一定要大写，虽然可以小写但这是为了避免一些错误，然后使用 `JSX` 方式来书写就可以使用了

```js
// 导入 Bindview.js
import Bindview from "bindview"
import App from "./App"

// new 一个实例
new Bindview({
    el:"#Root",
    node:() => (<App />),
    module:{ App }
})
```

### 4. `data` 配置项和数据响应式

`Bindview` 使用了一种类似于 <a href="https://baike.baidu.com/item/MVVM/96310?fr=ge_ala">MVVM</a> 的设计模式，数据和视图进行绑定，页面的显示结果将受 `data` 配置项中的数据影响，而 `data` 配置项中的数据使用了 `Vue2` 数据监听的方法，修改 `data` 中的数据，视图将自动更新 

在下面这个例子中，`data` 中配置一个 `num` 是数据，在 `node` 方法中 `this` 可以获取到整个组件是实例，我们通过 `this` 解构出 `data` 并重命名为 `$` ,在 `JSX` 中使用数据，在 `button` 上绑定了一个点击事件来对数据进行自增，当点击 页面上的 button 按钮时页面上的数据将自动更新

```jsx
export default function () {
  return {
    name: 'App',
    node() {
      const { data: $ } = this

      return (
        <div id="App">
          <div>{$.num}</div>
          <button onClick={() => $.num++}>Button</button>
        </div>
      )
    },
    data: {
      num: 0
    }
  }
}
```

### 5. `methods` 配置项

`methods` 配置项用来定义一些组件内部需要使用的方法, 下面的例子中在 `methods` 中定义了一个 `Add` 方法来对 `data` 中的 `num`  进行自增，在 `onClcik` 事件绑定中使用当点击 `button` 时将调用该方法，`Add` 方法的 `this`  指向组件实例,  <span style="color:red">！！！</span> 事件绑定中的方法或函数会接收到两个参数 第一个是事件绑定的 `DOM` 元素，第二个是事件对象 `event` ,  <span style="color:yellow">*** </span>如果组件需要使用一些方法和函数这并不是唯一的方式，但这种可能要直观一些

```jsx
export default function () {
  return {
    name: 'App',
    node() {
      const { data: $,methods: f } = this

      return (
        <div id="App">
          <div>{$.num}</div>
          <button onClick={f.Add}>Button</button>
        </div>
      )
    },
    data: {
      num: 0
    },
    methods:{
        Add(){
            this.data.num++
        }
    }
  }
}
```

### 6. `ref` 获取 `DOM`

`ref` 被用来给元素注册引用信息。引用信息将会注册在父组件的 `refs` 对象上。在 `DOM` 元素上使用，引用指向的就是 `DOM` 元素, 

```jsx
export default function () {
  return {
    name: 'App',
    node() {
      return (
        <div id="App">
          <div ref="div">hello</div>
          <div ref="box">world</div>
        </div>
      )
    },
    life:{
        createDom(){
            console.log(this.refs) // { div:HTMLDivElement,box:HTMLDivElement }
        }
    }
  }
}
```

如果使用了相同的 `ref` 信息那么，`refs` 对象中该信息将是一个数组保存了使用相同信息的 `DOM`

```jsx
export default function () {
  return {
    name: 'App',
    node() {
      return (
        <div id="App">
          <div ref="box">hello</div>
          <div ref="box">world</div>
        </div>
      )
    },
    life:{
        createDom(){
            console.log(this.refs) // { box:[ HTMLDivElement , HTMLDivElement ] }
        }
    }
  }
}
```

### 7. `linkage` 联动更新

在 `Bindview` 中当父组件中触发更新时 ( 一般是 `data` 中的数据发生改变 ) 父组件会触发所有后代组件的更新，因为父组件不知道那些后代组件使用了它自身的一些数据，所以他会触发所有后代组件的更新方法，如果后代组件是视图模型中发生了变化，那么组件将更新视图，但在开发过程中一些组件只做展示效果那么可以通过 `linkage` 配置项来关闭父组件对自身的联动更新，<span style="color:yellow">*** </span>注意 `linkage` 只会关闭父组件对子组件的联动更新，而不会关闭子组件自身的数据响应式

下面的例子中给 `Son` 子组件配置了 `linkage` 配置项当改变父组件中的 `num` 的值时，子组件将不会更新来获取最新的数据来更新视图

```jsx
function Son(props) {
  const { num } = props
  return {
    name: 'Son',
    linkage: false,
    node() {
      return (
        <div>{num()}</div>
      )
    }
  }
}

export default function () {
  return {
    name: 'Dome',
    node() {
      const { data: $ } = this
      return (
        <div>
          <button onClick={() => $.num++}>num++</button>
          <Son num={() => $.num} />
        </div>
      )
    },
    data: {
      num: 0
    },
    module: { Son }
  }
}
```

### 8. `modulePort` 组件接口

`modulePort` 配置项用来定义一些方法在父组件中使用，一般用来获取子组件实例, `modulePort` 中只能定义方法，方法中的 `this` 将指向组件实例，当父组件创建子组件时子组件 `modulePort` 配置项中的方法将被添加到父组件中的 `port` 属性中

```jsx
// Son 组件
function Son(props) {
  const { num } = props
  return {
    name: 'Son',
    node() {
      return (
        <div>{num()}</div>
      )
    },
    modulePort: {
      SON_PROT() { return this }
    }
  }
}


// Dome 组件
export default function () {
  return {
    name: 'Dome',
    node() {
      const { data: $ } = this
      return (
        <div>
          <button onClick={() => $.num++}>num++</button>
          <Son num={() => $.num} />
        </div>
      )
    },
    data: {
      num: 0
    },
    life: {
      createDom(){
          console.log(this.port) // { SON_PROT: f() }
      }  
    },
    module: { Son },
  }
}
```

### 10. 插槽

插槽是组件中不确定的部分由用户来定义，这部分就叫插槽，相当于一种占位符,在组件中通过组件函数的 `this` 来获取插槽，通过 `this` 得到 `slot` 方法该方法将返回插槽的虚拟 `DOM` ，在 `node` 中直接使用即可

在 `Bindview` 中组件插槽有两种一种是 `普通插槽` 还有一种是 `函数插槽` ,下面将分别说明每种插槽的作用

#### 1. 普通插槽

普通插槽就是在组件中直接书写文档结构这种组件的特点就是在插槽中会失去响应式，也就是说在插槽中使用了响应式数据将无法获得更新，一般用来展示一次性数据

 ```jsx
 function Son(props) {
   const { num } = props
   const { slot } = this
   return {
     name: 'Son',
     node() {
       return (
         <div>
           {slot()} {num()}
         </div>
       )
     }
   }
 }
 
 export default function () {
   return {
     name: 'Dome',
     node() {
       const { data: $ } = this
       return (
         <div>
           <button onClick={() => $.num++}>num++</button>
           <Son num={() => $.num}>
             <span>Num: </span>
           </Son>
         </div>
       )
     },
     data: {
       num: 0
     },
     module: { Son },
   }
 }
 ```

#### 2. 函数插槽

函数插槽就是在组件中使用一个函数将文档结构返回出去，这种方式将不会失去数据的响应式，同时它还可以拿到组件中的一些数据

在 `Son` 组件中向 `slot` 传递一个字符串，在 `Dome` 组件中定义插槽的函数中可以通过 `title` 拿到并使用

```jsx
function Son() {
  const { slot } = this
  return {
    name: 'Son',
    node() {
      return (
        <div>
          {slot("Num: ")}
        </div>
      )
    }
  }
}

export default function () {
  return {
    name: 'Dome',
    node() {
      const { data: $ } = this
      return (
        <div>
          <button onClick={() => $.num++}>num++</button>
          <Son>{(title) => (
            <span>{title} {$.num}</span>
          )}</Son>
        </div>
      )
    },
    data: {
      num: 0
    },
    module: { Son },
  }
}
```

### 11. proto 向原型添加属性或方法

使用 `proto` 方法可以向构造函数的原型上添加属性或方法，在创造实例前调用使用，有两种使用方法，第一种每次只能添加一个方法或属性，第二种使用对象形式可以添加多个方法或属性，

```jsx
import Bindview from "../../bindview"


// 使用一
Bindview.proto('Test', function(){
    console.log("Test")
})

// 使用二
Bindview.proto({
    Test1:"hello",
    Test2(){
        console.log("Test")
    }
})

new Bindview({
  el: '#Root',
  node(h) {
    return (
      <div>hello</div>
    )
  }
})
```

### 12. 动态组件

动态组件是在同一个位置根据不同的状态显示不同的组件，在动态组件中必须要有一个 `id` 参数并传入一个不会改变的唯一 `id` 

下面是一个简单的动态组件例子

```jsx
import { crateId } from "bindview"
import Dome1 from "./Dome1"
import Dome2 from "./Dome2"

export default function (props) {
  let { state } = props
  const [ a , b ] = crateId(2)

  return {
    name: 'Test',
    node() {
      return state() ? <Dome1 id={a} /> : <Dome2 id={b} />
    },
    module: { Dome1, Dome2 }
  }
}
```



## 生命周期钩子

每个 `Bindview` 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做 **生命周期钩子** 的函数，这给了用户在不同阶段添加自己的代码的机会

在 `Bindview` 中 **生命周期钩子** 需要配置到 `life` 配置项中

| 生命周期钩子 |        调用周期         |
| :----------: | :---------------------: |
| `beforeInit` |      实例初始化时       |
|  `initData`  |  `data` 配置项初始化前  |
| `createDom`  |    `DOM` 元素创建后     |
| `domUpdate`  |    `DOM` 数量变化后     |
|   `upDate`   | `data` 配置项数据更新后 |
| `unLoading`  |       组件卸载前        |

### 1. `beforeInit` 

`beforeInit` 会在组件实例初始化时调用, 在该阶段可以通过一个形参获取到组件的配置对象通过修改配置对象可以修改最后被创建出来的实例，也可以在此阶段通过 `this` 向组件实例上添加一些自定义的方法或数据

```jsx
function Life() {
  return {
    name: "LifeModule",
    node() {
      return (
        <div>hello</div>
      )
    },
    life: {
		beforeInit(ConfigObj){
            console.log(ConfigObj)
        }
    }
  }
}
```

### 2. `initData`  

`initData` 钩子会在 `data` 配置项初始化前调用，该声明周期将获得两个参数一个是 `data` 初始化之前的数据 ，另一个是 `data` 中的数据被处理为响应式数据的接收对象 ，修改第一个得到的参数可以添加或修改最后得到的响应数据 ，<span style="color:red">！！！</span>注意该生命周期只会在有 `data` 配置项的情况下才会被调用，如果配置中没有 `data` 配置项生命周期将不会调用

```jsx
function Life() {
  return {
    name: "LifeModule",
    node() {
      return (
        <div>hello</div>
      )
    },
    data:{},
    life: {
		initData(before,data){
            console.log(before,data)
        }
    }
  }
}
```

### 3. `createDom` 

`createDom` 钩子会在 `node` 配置项中的 **虚拟DOM** 被创建为 **真实DOM** 后调用，在此阶段就可以通过 `refs` 得到 `DOM` 元素了

```jsx
function Life() {
  return {
    name: "LifeModule",
    node() {
      return (
        <div ref="box">hello</div>
      )
    },
    life: {
		createDom(){
            console.log(this.refs['box'])
        }
    }
  }
}
```

### 4. `domUpdate` 

`domUpdate` 钩子会在 页面 `DOM` 数量发生改变时调用

```jsx
function Life() {
  return {
    name: "LifeModule",
    node() {
      return (
        <div ref="box">hello</div>
      )
    },
    life: {
		domUpdate(){
            console.log("dom数量发生改变")
        }
    }
  }
}
```

### 5. `upDate` 

`upDate` 钩子会在 `data` 配置项中的数据被修改时调用

```jsx
function Life() {
  return {
    name: "LifeModule",
    node() {
      return (
        <div>hello</div>
      )
    },
    life: {
		upDate(){
            console.log("date发生改变")
        }
    }
  }
}
```

### 6. `unLoading` 

 `unLoading` 钩子会在组件被卸载之前调用，在此阶段可以注销事件监听，和清空定时器

```jsx
function Life() {
  return {
    name: "LifeModule",
    node() {
      return (
        <div>hello</div>
      )
    },
    life: {
		unLoading(){
            // 清空定时器或注销事件监听
        }
    }
  }
}
```



## 原型方法

在  `Bindview` 组件实例中有一些以 `$` 开头的原型方法，这些方法提供了一些方便开发的功能，这些方法中有些一般情况下只是用一次应为这些方法一般是是用来给组件添加一些配置的 如 添加全局组件，下面将说明每个原型方法的作用和使用方法

### 1. `$add`

`$add` 方法可以在响应数据中添加新的响应式数据，调用 `$add` 方法传入一个对象，它可以将对象中的属性和方法添加到 `data` 上

```jsx
function Dome() {
  return {
    name: "Dome",
    node() {
      return (
        <div>Bindview</div>
      )
    },
    data:{},
    life: {
		createDom(){
            this.$add({
                num: 0,
                title: "Bindview"
            })
        }
    }
  }
}
```

### 2. `$addModule`

`$addModule` 方法可以将组件注册为全局组件, 注册为全局组件的组件不需要在 `module` 配置项中注册，一般情况下 `$addModule` 只使用一次，在通过 `new` 和 `createApp` 创建 **App** 时有不同的使用方式下面将介绍

 #### 1. `new` 创建 App 时注册全局组件

 ```jsx
 import Bindview from "../../bindview"
 
 // 导入需要注册为全局组件的组件
 import Test1 from "./Components/Test1"
 import Test2 from "./Components/Test2"
 
 // $addModule 方法可以将组件注册为全局组件
 Bindview.prototype.$addModule('Test1', Test1)
 // $addModule 传入一个对像可以同时添加多个全局组件
 Bindview.prototype.$addModule({
     Test1,
     Test2
 })
 
 new Bindview({
   el: '#Root',
   node() {
     return (
       <div class="root">
       	<Test1 />
       	<Test2 />
       </div>
     )
   }
 })
 ```

 ####  2. `createApp` 创建 App 时注册全局组件

 通过 `createApp` 创建 **App** 注册全局组件,需要在 **根组件** 的 `beforeInit` 生命周期中调用 `$addModule` 方法 

 ```jsx
 import Test1 from "./Component/Test1"
 import Test2 from "./Component/Test2"
 
 export default function () {
   return {
     name: 'App',
     node() {
       return (
         <div id="App">
         	<Test1 />
             <Test2 />
         </div>
       )
     },
     life: {
       beforeInit() {
           
         // $addModule 方法可以将组件注册为全局组件
         this.$addModule("Test1",Test1)  
         // $addModule 传入一个对像可以同时添加多个全局组件  
         this.$addModule({
           Test1,
           Test2
         })
           
       }
     }
   }
 }
 ```

### 3. `$dataProto`

`$dataPort` 方法用来在初始化对象前在 `data` 配置对象原型上添加原型属性 参数一是 (key)键，参数二是 (value)值 , 一般情况下 `$dataPort` 只使用一次，在通过 `new` 和 `createApp` 创建 **App** 时有不同的使用方式下面将介绍

 #### 1. `new` 创建 App 时

 ```jsx
 import Bindview from "../../bindview"
 
 // 使用 Bindview.prototype.$addDataMethods() 在data原型上添加方法
 Bindview.prototype.$dataProto('Out', function () {
   console.log('$dataProto');
 })
 
 new Bindview({
   el: '#Root',
   node() {
     return (
       <div class="root">hello</div>
     )
   }
 })
 ```

 #### 2. `createApp` 创建 App 时

 通过 `createApp` 创建 **App** 时,需要在 **根组件** 的 `beforeInit` 生命周期中调用 `$dataProto` 方法

 ```jsx
 export default function () {
   return {
     name: 'App',
     node() {
       return (
         <div id="App"></div>
       )
     },
     life: {
       beforeInit() {
           
           this.$dataProto("Out",function(){
               console.log("$dataProto")
           })
           
       }
     }
   }
 }
 ```

### 4. `$mount`

`$mount` 安装组件， 将组件实例安装到页面上，方法需要传入一个 DOM 选择字符串 ( '#Root' , '.Root' 等) 或是一个 DOM 元素，`$mount` 方法有两种安装组件的方式，一种是安装自身 如使用 `createApp` 创建的组件实例需要使用 `$mount` 方法安装，第二种是在组件中通过该方法安装其他的组件

#### 1. 安装组件实例

安装通过 `createApp` 创建的组件实例

```jsx
import { createApp } from "../../bindview";
import App from "./App"

createApp(App).$mount("#Root")
```

#### 2. 安装其他组件到组件中

通过在 `createDom` 生命周期钩子中调用 `$mount` 方法将其他组件安装到组件中，为什么要在 `createDom` 生命周期钩子中使用因为 `$mount` 方法需要一个 DOM 选择字符串 ( '#Root' , '.Root' 等) 或是一个 DOM 元素，如果使用字符串形式 DOM 有可能被创建了但还没挂载到页面上导致无法获取所以只能通过 `ref` 获取 DOM 元素再传入 `$mount` 来使用，当到 `createDom` 生命周期后 DOM 已被创建完成可以通过 `refs` 获取到

```jsx
import Test1 from "./Component/Test1"

export default function () {
  return {
    name: 'App',
    node() {
      return (
        <div id="App" ref="App"></div>
      )
    },
    life: {
      createDom() {
          // 传两个参数可以将组件挂载到指定位置
          // 参数一为组件容器 
          // 参数二为组件函数得到调用
          this.$mount(this.refs['App'],Test1());
      }
    }
  }
}
```

### 5. `$unload`

`$unload` 卸载组件，在组件中使用或通过组件实例调用可卸载组件，卸载时会调用 `unLoading` 生命周期钩子

#### 1.通过组件实例卸载

```jsx
import { createApp } from "../../bindview";
import App from "./App"

const vm = createApp(App).$mount("#Root")

// 卸载组件
vm.$unload()
```

#### 2. 组件中调用卸载

```jsx
function Dome() {
  return {
    name: 'Dome',
    node() {
      const { methods: f } = this

      return (
        <div>
          <button onClick={f.UNLOAD}>卸载组件</button>
        </div>
      )
    },
    methods: {
      UNLOAD() {
        this.$unload()
      }
    }
  }
}
```

### 6. `$mupdate`

`$mupdate` 方法可以手动更新视图，在修改一些没有数据响应的数据但需要更新视图时可以在修改后调用这个方法，或传入一个函数，视图更新会在回调函数执行完后，<span style="color:red">！！！</span>注意 `$mupdate` 的视图更新是异步的

```jsx
export default function () {
  return {
    name: 'App',
    node(h) {
      return (
        <div ref="Box" className="App">
          App
          <div>{h.datas()}</div>
          <button onClick={h.addData}>addDatas</button>
        </div>
      )
    },
    methods: {
      addData() {
        this.$mupdate(() => {
          this.datas++
        })
      },
      datas() {
        return this.datas
      }
    },
    life: {
      beforeInit() {
        this.datas = 0
      }
    }
  }
}
```

### 7. `$getTxt 和 $setTxt`

`$getTxt` & `$setTxt` 方法用来获取和修改 DOM 节点下文本节点的值,适用于 DOM 节点下只有一个文本节点的地方，如果 DOM 节点下除了文本节点还有其他节点会导致一些错误，一般不常用

```jsx
export default function () {
  return {
    name: "Dome",
    node() {
      const { methods: f } = this  
        
      return (
        <div>
          <button onClick={f.getTxt}>$getTxt</button>
          <button onClick={f.setTxt}>$setTxt</button>
        </div>
      )
    },
    methods: {
      getTxt(dom) {
        // $getTxt 需要传入DOM节点
        console.log(this.$getTxt(dom));
      },
      setTxt(dom) {
        // $setTxt 需要传入DOM节点和文本
        console.log(this.$setTxt(dom, 'new Value'))
      }
    }
  }
}
```



## 工具函数

在 `Bindview` 中不止有 `Bindview` 构造函数还提供了一些便于开发的工具函数

### 1. `send` 

`send` 方法简化组件间传递参数的方法，该方法需要传入两个参数 1.数据源 2.数据项，该方法会返回一个对象对象中有两个方法分被是`get` `set` 用来获取和修改数据

```jsx
import { Bindview, send } from "bindview"

// Dome 组件
function Dome(props) {

  let { num, arr } = props

  return {
    name: 'Dome',
    node() {
      const { methods:f } = this  
      return (
        <div>
          <div>Dome</div>
          <div>{num.get()}</div>
          <button onClick={f.set}>set</button>
          <div>{arr.get()}</div>
          <button onClick={f.setArr}>setArr</button>
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


export default function () {
  return {
    el: '#Root',
    node() {
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
    module: { Dome }
  }
}
```

### 2. `createId`

`createId` 函数用来创建多个唯一的 `ID`， 函数传入一个数值返回一个长度为该 数值-1 的数组数组中包含了唯一 `ID` ,一般配合动态组件使用

```jsx
import { crateId } from "bindview"
import Dome1 from "./Dome1"
import Dome2 from "./Dome2"

export default function (props) {
  let { state } = props
  const [ a , b ] = crateId(2)

  return {
    name: 'Test',
    node() {
      return state() ? <Dome1 id={a} /> : <Dome2 id={b} />
    },
    module: { Dome1, Dome2 }
  }
}
```

### 3. `createApp`

`createApp` 用来创建组件实例，创建的组件实例需要通过 `$mount` 进行挂载， `createApp` 可以传入两个参数第一个参数是组件函数是必须的，第二个是 `props` 对象不是必须的，这个对象在组件函数的 `props` 可以得到

```jsx
import { createApp } from "../../bindview";
import App from "./App"

createApp(App, { title: '这是props' }).$mount("#Root")
```

