# vue项目

## 先运行npm install，安装依赖包

## 用传统方式，命令行把修改过的代码上传到码云

1. git add .
2. git commit -m "提交信息"
3. git push

## 第二种更方便，用vscode自带的源代码管理提交

## 制作首页App组件

1. 制作Header 区域，使用的是 Mint-UI 中的Header组件
2. 制作底部的 Tabbar 区域，使用的是 MUI 的 Tabbar.html
 + 在制作购物车小图标的时候，操作相对会多一些：
 + 先把扩展图标的css样式拷贝到项目中
 + 在拷贝扩展字体库ttf文件，到项目中
 + 为购物车小图标添加样式`mui-icon mui-icon-extra mui-icon-extra-cart`
3. 在中间区域放置 router-view 来展示路由匹配到的组件

## 改造 tabbar 为 router-link

## 设置路由高亮

## 点击tabbar 中的路有链接，展示对应的路由组件

## 制作首页轮播图布局

## 加载首页轮播图数据

1. 获取数据，使用vue-resource
2. 使用vue-resource的this.$http.get 获取数据
3. 获取到的数据，要保存到data上
4. 使用v-for循环渲染每个item项，注意一定要加key

## 改造九宫格区域的样式

## 改造新闻资讯路由链接

## 新闻资讯 页面 制作

1. 绘制界面，使用 MUI中的media-list.html
2. 使用vue-resource获取数据
3. 渲染真实数据到页面上

## 实现新闻资讯列表 点击跳转到新闻详情

1. 把列表中的每一项改造为 router-link，同时，在跳转的时候应该提供唯一的id标识符
2. 创建新闻详情的组件页面 NewsInfo.vue
3. 在路由模块中，将新闻详情的路由地址和组件页面对应起来

## 实现新闻详情的页面布局和数据渲染

## 单独封装一个 comment.vue 评论子组件

1. 先创建一个单独的comment.vue 的组件模板
2. 在需要使用comment组件的页面中，先手动导入comment组件
 + `import comment from './comment.vue'`
3. 在父组件中使用`components`属性，将刚才导入的comment组件，注册为自己的子组件
4. 将注册的子组件名称，以标签形式在页面中应用即可

## 获取所有的评论数据，显示到页面中
1. getComments

## 实现点击加载更多评论的功能
1. 为加载更多按钮，绑定点击事件，在事件中，请求下一页数据
2. 点击加载更多，让pageIndex++，然后重新调用this.getComments()方法，重新获取最新一页的数据
3. 注意：为了防止新数据覆盖老数据的情况，我们在点击加载更多的时候，每当获取到新数据，应该让老数据调用数组的concat方法，拼接上新数组

## 发表评论
1. 把文本框做双向数据绑定
2. 为发表按钮绑定一个事件
3. 校验评论内容是否为空，如果为空，则Toast提示用户，评论内容不能为空
4. 通过vue-resource发送一个请求，把评论内容提交给服务器
5. 当发表评论成功后，重新刷新列表，用来查看最新评论
   + 如果调用getComments方法重新刷新评论列表的话，可能只能得到，最后一页的评论，前几页的评论获取不到
   + 换一种思路：当评论成功后，在客户端，手动拼接出一个最新的评论对象，然后调用数组的unshift方法，把最新的评论，追加到data中comments的开头，这样，就能完美实现刷新评论列表的需求。

## 改造图片分享，按钮为路有链接并显示对应的组件页面
1. 把图像分享的a标签改为router-link标签，把href改为to="要跳转的路径"（to="/home/photolist"）
2. 创建PhotoList.vue组件
3. 通过router.js，创建路由和组件的对应关系
   + 在router.js中，先导入组件
   + 然后再通过路由映射表注册组件

## 绘制图片列表 组件页面结构并美化样式
1. 制作顶部的滑动条
2. 制作底部的图片列表

### 制作顶部滑动条的坑们：
1. 需要借助 MUI 中的 tab-top-webview-main.html
2. 需要把 slider 区域的 mui-fullscreen的类去掉
3. 滑动条无法正常触发滑动，通过查看官方文档"http://dev.dcloud.net.cn/mui/ui/#scroll"，发现这是js组件，需要被初始化一下：
   + 首先导入mui.js
   + 然后调用官方提供的方式去初始化
  ```

  mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  ```
4. 我们在初始化滑动条的时候，导入的mui.js，但是，控制台报错：`Uncaught TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them`
   + 经过我们的合理推测，觉得可能是mui.js中用到了'caller', 'callee', and 'arguments'东西，但是，webpack打包好的bundle.js中，默认是启用严格模式的，所以这两者冲突了。
   + 解决方案：1.把mui.js中的非严格模式的代码改掉，但是不现实
              2.把webpack打包时候的严格模式禁用掉
   + 最终，我们选择了移除严格模式的方案：使用的是babel-plugin-transform-remove-strict-mode这个插件

## 移除严格模式
[babel-plugin-transform-remove-strict-mode](https://github.com/genify/babel-plugin-transform-remove-strict-mode)
1. 滑动的时候报警告：`Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080`
```
解决方法，可以加上* { touch-action: pan-y; } 这句样式去掉。
```
原因：（是chrome为了提高页面的滑动流畅度而新折腾出来的一个东西） http://www.cnblogs.com/pearl07/p/6589114.html
https://developer.mozilla.org/zh-CN/docs/Web/CSS/touch-action
  
5. 刚进入图片分享页面的时候，滑动条无法正常工作，经过我们认真的分析，发现。如果要初始化滑动条，必须要等DOM元素加载完毕，所以，我们把初始化滑动条的代码，搬到了mounted生命周期函数中。
6. 当滑动条调试OK后，发现，tabbar无法正常工作了，这时候我们需要把每个tabbar按钮样式中的`mui-tab-item`重新改一下名字，注意：再改名字之前，把样式都复制下来写在style中。
7. 获取所有分类，并渲染分类列表

### 制作图片列表区域
1. 绘制图片列表需要使用懒加载技术，我们可以使用Mint-UI提供的现成的组件`lazy-load`
2. 根据`lazy-load`的使用文档，尝试使用
3. 渲染图片列表数据

### 实现了图片列表的懒加载改造和样式美化

## 实现了点击图片跳转到图片详情页面
1. 在改造li成router-link的时候，需要使用tag属性指定要渲染成哪种元素

## 实现详情页面的布局和美化，同时获取数据渲染页面
1. 使用插件vue-preview这个缩略图插件。 [vue-preview](https://github.com/LS1231/vue-preview)
一个Vue集成PhotoSwipe图片预览插件
2. 获取到所有的图片列表，然后用v-for指令渲染数据
3. 注意：img标签上的class不能去掉
4. 注意: 每个图片中必须有w和h属性
5. 注意：新版和老板有区别，以新版为主

## 绘制 商品购买 页面基本结构并美化

## 尝试在手机上去进行项目的预览和测试
1. 要保证自己的手机可以正常运行
2. 要保证手机和开发项目的电脑处于同一个wifi环境中，也就是说手机可以访问到电脑的IP
3. 打开自己的项目中 package.json 文件，在 dev 脚本中，添加一个--host 指令，把当前电脑的WiFi IP地址，设置为--host 的指令值
   +如何查看自己电脑所处的WiFi的IP呢，在cmd终端中运行`ipconfig`，查看无线网的IP地址
   