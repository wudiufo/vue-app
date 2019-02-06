<template>
    <div class="goods-list">
        <!-- 每个商品 -->
        <!-- 第一种方法，用路有链接跳转页面 -->
        <!-- <router-link :to="'/home/goodsinfo/'+ item.id" tag="div" class="goods-item" v-for="item in goodslist" :key="item.id">
            <img :src="item.img_url" alt="">
            <h1 class="title">{{item.title}}</h1>
            <div class="info">
                <p class="price">
                    <span class="now">￥{{item.sell_price}}</span>
                    <span class="old">￥{{item.market_price}}</span>
                </p>
                <p class="sell">
                    <span>热卖中</span>
                    <span>剩{{item.stock_quantity}}件</span>
                </p>
            </div>
        </router-link> -->


        <!-- 第二种方法 -->
        <!-- 在网页中，有两种跳转方式： -->
        <!-- 方式一：使用a标签的形式跳转，叫做标签跳转 -->
        <!-- 方式二：使用window.location.href的形式跳转，叫做编程式导航 -->
        <div class="goods-item" v-for="item in goodslist" :key="item.id" @click="goDetail(item.id)">
            <img :src="item.img_url" alt="">
            <h1 class="title">{{item.title}}</h1>
            <div class="info">
                <p class="price">
                    <span class="now">￥{{item.sell_price}}</span>
                    <span class="old">￥{{item.market_price}}</span>
                </p>
                <p class="sell">
                    <span>热卖中</span>
                    <span>剩{{item.stock_quantity}}件</span>
                </p>
            </div>
        </div>
        <mt-button type="danger" size="large" @click="getMore">加载更多</mt-button>
    </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
    data () {//data是往自己的组件内部，挂载一些私有数据的
        return {
            pageindex: 1 ,//分页的页数，默认是第一页
            goodslist: [] ,//存放商品列表的数组

        }
    },
    created () {//初始化data数据和methods方法
        this.getGoodsList ()
    },
    methods: {
        getGoodsList () {
            this.$http.get('api/getgoods?' + this.pageindex).then(result => {
                if (result.body.status === 0) {
                    // 由于接口图片数据获取不到，自己制作假数据
                    result.body.message.forEach(element => {
                        element.img_url = "https://img.alicdn.com/imgextra/i1/123858168/TB25ggXm_TI8KJjSsphXXcFppXa_!!0-saturn_solar.jpg_220x220.jpg_.webp"
                    });
                    this.goodslist = this.goodslist.concat(result.body.message)
                } else {
                    Toast ('获取商品列表数据失败。。。')
                }
            })
        },
        getMore () {
            this.pageindex++;
            this.getGoodsList ();
        },
        goDetail(id) {
            // 使用js的形式进行路由导航
            // 注意：一定要区分this.$route和this.$router这两个对象
            // 其中：this.$route是路由【参数对象】，所有路由中的参数，params，query都属于它
            // 其中：this.$router是一个【路由导航对象】，用它可以方便的使用JS代码，实现路由的前进，后退，跳转到新的URL地址
            
            // 1.最简单的
            // this.$router.push("/home/goodsinfo/" + id);
            // 2.传递对象
            // this.$router.push({path: "/home/goodsinfo/" + id})
            // 3.传递命名的路由
            this.$router.push({name: "goodsinfo", params: {id}})
        }
    }
}
</script>

<style lang="scss" scoped>
.goods-list {
    display: flex;
    flex-wrap: wrap;
    padding: 7px;
    justify-content: space-between;

    .goods-item {
        width: 49%;
        border: 1px solid #ccc;
        box-shadow: 0 0 8px #ccc;
        margin: 4px 0;
        padding: 2px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 293px;
        img {
            width: 100%;
        }
        .title {
            font-size: 14px;
        }

        .info {
            background-color: #eee;
            p {
                margin: 0;
                padding: 5px;
            }
            .price {
                .now {
                    color: red;
                    font-weight: bold;
                    font-size: 16px;
                }
                .old {
                    text-decoration: line-through;
                    font-size: 12px;
                    margin-left: 10px;
                }
            }

            .sell {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
            }
        }
    }
}
</style>
