<template>
    <div>
        <!-- 轮播图区域 -->
        <!-- 第三部：引用轮播图子组件 -->
      <swiper :lunbotulist="lunbotulist" :isfull="true"></swiper>

      <!-- 九宫格到6宫格的改造工程 -->
      <ul class="mui-table-view mui-grid-view mui-grid-9">
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/newslist">
                <img src="../../images/menu1.png" alt="">
                <div class="mui-media-body">新闻资讯</div></router-link></li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/photolist">
                <img src="../../images/menu2.png" alt="">
                <div class="mui-media-body">图片分享</div></router-link></li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/goodslist">
                <img src="../../images/menu3.png" alt="">
                <div class="mui-media-body">商品购买</div></router-link></li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="#">
                <img src="../../images/menu4.png" alt="">
                <div class="mui-media-body">留言反馈</div></router-link></li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="#">
               <img src="../../images/menu5.png" alt="">
                <div class="mui-media-body">视频专区</div></router-link></li>
        <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="#">
                <img src="../../images/menu6.png" alt="">
                <div class="mui-media-body">联系我们</div></router-link></li>
       </ul> 

    
    </div>
</template>

<script>
import { Toast } from 'mint-ui'
// 第一步：导入轮播图子组件
import swiper from '../subcomponents/swiper.vue'
export default {
    data() {
        return {
            lunbotulist: [] // 保存轮播图的数组
        };
    },
    components: {
        // 第二部：注册轮播图子组件
        swiper
    },
    created() {
        this.getLunbotu();
    },
    methods: {
        getLunbotu() {//获取轮播图数据的方法
            this.$http.get("api/getlunbo").then(result => {
                // console.log(result.body);
                if (result.body.status === 0) {
                    // 获取成功s
                    this.lunbotulist = result.body.message;
                    // Toast('加载轮播图成功。。。')
                } else {
                    // 获取失败
                    Toast('加载轮播图失败。。。')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>


.mui-grid-view.mui-grid-9 {
    background-color: #fff;
    border: none;
    .mui-table-view-cell {
        border: none;
        img {
            width: 60px;
            height: 60px;
        }
        .mui-media-body {
            font-size: 13px;
        }
    }
}
</style>
