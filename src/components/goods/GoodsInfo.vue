<template>
    <div class="goodsinfo-container">

        <!-- 小球滑动 -->
        <!-- 因为是半程动画，所以只能用钩子函数 -->
        <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter">
      <div class="ball" v-show="ballFlag" ref="ball"></div>
    </transition>

        <!-- 商品轮播图区域 -->
        <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <!-- 第三部：引用轮播图子组件。父组件通过属性传值将内容传递给子组件，子组件接收时用props检测父组件传递的内容，由于父传子是单项数据流，所以子不允许修改父传递的内容 -->
                    <swiper :lunbotulist="lunbotu" :isfull="false"></swiper>
                </div>
            </div>
        </div>

        <!-- 商品购买区域 -->
        <div class="mui-card">
            <div class="mui-card-header">{{goodsInfo.title}}</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p class="price">
                        市场价：<del>￥{{goodsInfo.market_price}}</del>
                        &nbsp;&nbsp;
                        销售价：<span class="now_price">￥{{goodsInfo.sell_price}}</span>
                    </p>

                    <p>
                        购买数量:<numbox @getcount="getSelectedCount" :max="goodsInfo.stock_quantity"></numbox>
                      
                    </p>



                <!-- 分析：如何实现加入购物车时候，拿到选择的数量 -->
                <!-- 1.经过分析发现：加入购物车按钮属于GoodsInfo组件，数字属于numberbox组件 -->
                <!-- 2.由于涉及到父子组件的嵌套，所以无法直接在goodsinfo页面中获取到选中商品的数量值 -->
                <!-- 3.怎么解决这个问题：涉及到子组件向父组件传值（事件调用机制） -->
                <!-- 4.事件调用的本质：父向子传递方法，子调用这个方法，同时把数据当做参数传递给这个方法 -->
                    <p>
                        <mt-button type="primary" size="small">立即购买</mt-button>
                        <mt-button type="danger" size="small" @click="addToShopCar">加入购物车</mt-button>
                    </p>
                </div>
            </div>
            
        </div>

        <!-- 商品参数区域 -->
        <div class="mui-card">
            <div class="mui-card-header">商品参数</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p>商品货号：{{goodsInfo.goods_no}}</p>
                    <p>库存情况：{{goodsInfo.stock_quantity}}件</p>
                    <p>上架时间：{{goodsInfo.add_time | dateFormat}}</p>
                </div>
            </div>
            <div class="mui-card-footer">
                <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
     
                <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
            </div>
        </div>

    </div>
</template>

<script>
import { Toast } from 'mint-ui'
// 第一步：导入轮播图子组件
import swiper from '../subcomponents/swiper.vue'

// 导入数字选择框子组件
import numbox from '../subcomponents/goodsinfo_numbox.vue'
export default {
    data () {
        return {
            id: this.$route.params.id, //将路由参数对象中的id挂在到data，方便后期调用
            lunbotu: [], //轮播图数据
            goodsInfo: [], //商品参数数据列表
            ballFlag: false ,//控制小球隐藏和显示的标识符
            selectedCount: 1 //保存用户选中的商品数量，默认认为用户买一个
        }
    },
    components: {
        // 第二部：注册轮播图子组件
        swiper,
        numbox
    },
    created () {
        this.getLunbotu () ,
        this.getGoodsInfo ()
    },
    methods: {
        getLunbotu () {
            this.$http.get ('api/getthumimages/' + this.id).then (result => {
                if (result.body.status === 0) {
                    // 由于接口图片不显示，自己伪造数据
                    // 县循环轮播图数组的每一项，为item添加img属性，因为轮播图组件中，只认识item.img
                    result.body.message.forEach(item => {
                        item.img = "https://img.alicdn.com/imgextra/i3/128400352/TB2HgiqXXzqK1RjSZFoXXbfcXXa_!!0-saturn_solar.jpg_220x220.jpg_.webp";
                    });
                    this.lunbotu = result.body.message
                } else {
                    Toast ('获取轮播图数据失败。。。')
                }
            })
        },
        // 获取商品参数区和价格，标题等数据
        getGoodsInfo () {
            this.$http.get ('api/goods/getinfo/' + this.id).then (result => {
                if (result.body.status === 0) {
                    this.goodsInfo = result.body.message[0]
                } else {
                    Toast ('获取商品参数详细信息失败。。。')
                }
            })
        },
        goDesc (id) {
            // 点击使用编程式导航跳转到图文介绍页面
            this.$router.push({
                name: 'goodsdesc', params: {id}
            })
        },
        goComment (id) {
            // 点击使用编程式导航跳转到评论页面
            this.$router.push({
                name: 'goodscomment', params: {id}
            })
        },
        addToShopCar () {
            // 添加到购物车，控制小球隐藏和显示
            this.ballFlag = !this.ballFlag
            // {id：商品的id，count：需要购买的数量，price：商品的单价，selected：false}
            // 拼接处一个，要保存到store中car数组里的商品信息对象
            var goodsinfo = {
                id: this.id,
                count: this.selectedCount,
                price: this.goodsInfo.sell_price,
                selected: true
            }
            // 调用store中的mutations来将商品加入购物车
            this.$store.commit('addToCar',goodsinfo)
        },
        // 小球动画优化思路：
        // 1. 先分析导致动画不准确的本质原因：我们把小球最终位移到的位置上，已经局限在了某一分辨率下的滚动条未滚动的情况下
        // 2. 只要分辨率和测试的时候不一样，或者滚动条有一定的滚动距离之后，问题就出现了
        // 3. 因此，我们经过分析，得到结论：不能把位置的横纵坐标写死了，而是应该根据不同的情况，动态计算这个坐标值
        // 4. 经过分析，得出解题思路：先得到徽标的横纵坐标，在得到小球的横纵坐标，然后让x，y值分别求差，得到的结果，就是横纵坐标要位移的距离
        // 5. 如何获取徽标和小球的位置？？？ domObject.getBoundingClientRect()
        beforeEnter (el) {
            el.style.transform = "translate(0, 0)"
        },
        enter (el, done) {
            el.offsetLeft;
            // 获取小球在页面中的位置
            const ballPosition = this.$refs.ball.getBoundingClientRect();
            // 获取徽标在页面中的位置
            const badgePosition = document.getElementById("badge").getBoundingClientRect()

            const xDist = badgePosition.left - ballPosition.left;
            const yDist = badgePosition.top - ballPosition.top;

            // es6的模板字符串
            el.style.transform = `translate(${xDist}px, ${yDist}px)`;
            el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68)";
            done();
        },
        afterEnter (el) {
            this.ballFlag = !this.ballFlag;
        },

        getSelectedCount (count) {
            // 当子组件把选中的数量传递给父组件的时候，把选中的值保存到data上
            this.selectedCount = count;
            console.log("父组件拿到的数量值为：" + this.selectedCount)
        }

    }
}
</script>

<style lang="scss" scoped>
.goodsinfo-container {
    background-color: #eee;
    overflow: hidden;

    .now_price {
        color: red;
        font-size: 16px;
        font-weight: bold;
    }

    .mui-card-footer, .mui-card-header {
        display: block;
        button {
            margin: 15px 0;
        }
    }

    // 小球样式
    .ball {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        z-index: 99;
        top: 390px;
        left: 146px;
    }
}
</style>
