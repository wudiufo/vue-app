// 入口文件
import Vue from 'vue'


// 1.1 导入路由的包
import VueRouter from 'vue-router'


// 1.2 安装路由
Vue.use(VueRouter)


// 2.1 导入vue-resource
import VueResource from 'vue-resource'

// 2.2 安装vue-resource
Vue.use(VueResource)

// 设置请求的根路径
Vue.http.options.root = 'http://47.89.21.179:8080'

// 全局设置post时候表单数据格式组织形式 application/x-www-form-urlencoded
Vue.http.options.emulateJSON = true;

// // 按需导入 Mint-UI 中的组件
// import { Header, Swipe, SwipeItem, Button, Lazyload } from 'mint-ui'
// Vue.component(Header.name, Header)
// Vue.component(Swipe.name, Swipe)
// Vue.component(SwipeItem.name, SwipeItem)
// Vue.component(Button.name, Button)
// Vue.use(Lazyload)

// 全部导入Mint-UI组件，才能实现lazy-load
import MintUI from 'mint-ui'
Vue.use(MintUI)
import 'mint-ui/lib/style.css'


// 导入 MUI 的样式
import './lib/mui/css/mui.min.css'
import './lib/mui/css/icons-extra.css'


// 安装图片预览插件
import VuePreview from 'vue-preview'

// defalut install
Vue.use(VuePreview)

// 不用这个，要不缩略图显示不出来
// with parameters install
// Vue.use(preview, {
//     mainClass: 'pswp--minimal--dark',
//     barsSize: { top: 0, bottom: 0 },
//     captionEl: false,
//     fullscreenEl: false,
//     shareEl: false,
//     bgOpacity: 0.85,
//     tapToClose: true,
//     tapToToggleControls: false
// })


// 1.3 导入自己的 router.js路由模块
import router from './router.js'



// 配置vuex的步骤
// 1.运行npm install Vuex -S
// 2.导入包
import Vuex from 'vuex'
// 3. 注册vuex到vue中
Vue.use(Vuex)
    // 4. new Vuex.Store()实例，得到一个数据仓储对象


// 每次刚进入网站，肯定会调用main.js，在刚调用的时候，先从本地存储中，把购物车的数据读出来，放到store中
var car = JSON.parse(localStorage.getItem('car') || '[]')

var store = new Vuex.Store({
    state: { //this.$store.state.***
        // 可以把state想象成组件中的data，专门用来存储数据的
        // 如果在组件中，想要访问，store数据，只能通过this.$store.state.***来访问

        car: car, //将购物车中商品的数据，用一个数组存储起来，在car数组中，存储一些商品对象，可以暂时将这个商品对象，设计成这个样子
        // {id：商品的id，count：要购买的数量，price：商品的单价， selected：false}
    },
    mutations: { //this.$store.commit('方法的名称'，按需传入唯一的参数)
        // 注意：如果要操作store中的state值，只能通过调用mutations提供的方法，才能操作对应的数据，不推荐直接操作state中的数据，因为万一导致了数据的紊乱，不能快速定位到错误的原因，因为都可能有操作数据的方法
        // 注意：如果子组件想要调用mutations中的方法，只能使用this.$store.commit('方法名'，'按需传入唯一的参数')
        // 这种调用mutations方法的格式，和this.$emit('父组件中方法名')很相似
        // 注意：mutations的函数参数列表中，最多支持两个参数，其中 ，参数一：是state状态，参数二：是通过commit提交过来的参数
        addToCar(state, goodsinfo) {
            //点击加入购物车，把商品信息，保存到store中的car上
            // 分析:
            // 1.如果购物车中，之前就已经有这个对应的商品了，那么，只需要更新数量即可
            // 2.如果没有，则直接把商品数据push到car中即可

            // 假设在购物车中，没有找到对应的商品
            var flag = false

            state.car.some(item => {
                if (item.id == goodsinfo.id) {
                    item.count += parseInt(goodsinfo.count)
                    flag = true
                    return true
                }
            })

            // 如果最终循环完毕，得到的flag还是false，则把商品数据直接push到购物车中
            if (!flag) {
                state.car.push(goodsinfo)
            }

            // 当更新car之后，把car数组存储到本地的localstorage中
            localStorage.setItem('car', JSON.stringify(state.car))

        },
        updateGoodsInfo(state, goodsinfo) {
            // 修改购物车商品的数量值
            // 分析：
            state.car.some(item => {
                    if (item.id == goodsinfo.id) {
                        item.count = parseInt(goodsinfo.count)
                        return true
                    }
                })
                // 当修改完商品的数量，把最新的购物车数据，保存到本地存储中
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        removeFormCar(state, id) {
            // 根据id，从store中的购物车中删除对应的那条商品数据
            state.car.some((item, i) => {
                    if (item.id == id) {
                        state.car.splice(i, 1)
                        return true
                    }
                })
                // 将删除完毕后的，最新的购物车数据，同步到本地存储中
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        updateGoodsSelected(state, info) {
            state.car.some(item => {
                    if (item.id == info.id) {
                        item.selected = info.selected
                    }
                })
                // 把最新的所有购物车的商品状态保存到store中去
            localStorage.setItem('car', JSON.stringify(state.car))
        }
    },
    getters: { //this.$store.getters.***
        // 注意：这里的getters，只负责对外提供数据，不负责修改数据，如果想要修改state中的数据，请去找mutations
        // 经过回顾对比，发现getters中的方法，和组件中的过滤器比较类似，因为过滤器和getters都没有修改原数据，都是把原本数据做了一层包裹，提供给调用者
        // 其次，getters也和computed比较像，只要state中的数据发生了变化，那么，如果getters正好也引用了这个数据，那么就会立刻触发getters的重新求值

        // 相当于计算属性，也相当于filters
        getAllCount(state) {
            var c = 0
            state.car.forEach(item => {
                c += item.count
            })
            return c
        },
        getGoodsCount(state) {
            var o = {}
            state.car.forEach(item => {
                o[item.id] = item.count
            })
            return o

        },
        getGoodsSelected(state) {
            var o = {}
            state.car.forEach(item => {
                o[item.id] = item.selected
            })
            return o
        },
        getGoodsCountAndAmount(state) {
            var o = {
                count: 0, //勾选的数量
                amount: 0 //勾选的总价
            }
            state.car.forEach(item => {
                if (item.selected) {
                    o.count += item.count
                    o.amount += item.price * item.count
                }
            })
            return o
        }
    }
})

// 总结：
// 1.state中的数据，不能直接修改，如果想要修改，必须通过mutations
// 2.如果组件想要直接从 state上获取数数据：需要this.$store.state.***
// 3.如果组件想要修改数据，必须使用mutations提供的方法，需要通过this.$store.commit('方法名',唯一的一个参数)来修改
// 4.如果store中state上的数据，在对外提供的时候，需要做一层包裹，那么推荐使用getters，则用，this.$store.getters.***调取数据

// 5.把store组件挂载到根实例上


// 导入格式化时间的插件
import moment from 'moment'

// 定义全局过滤器
Vue.filter('dateFormat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dataStr).format(pattern)
})


// 导入App根组件
import app from './App.vue'
var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router, //1.4 挂载路由对象到vm实例上
    store //5.将vuex创建的store挂载到VM的实例上,只要挂载到了vm上，任何组件都能使用store来存储数据
})