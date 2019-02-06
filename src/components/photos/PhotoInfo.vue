<template>
    <div class="photoinfo-container">
        <h3>{{photoinfo.title}}</h3>
        <p class="subtitle">
            <span>发表时间：{{photoinfo.add_time | dateFormat}}</span>
            <span>点击：{{photoinfo.click}}次</span>
        </p>

        <hr>

        <!-- 缩略图区域 -->
        <vue-preview :slides="slide1" @close="handleClose"></vue-preview>

        <!-- 图片内容区域 -->
        <div class="content" v-html="photoinfo.content"></div>

        <!-- 放置现成的评论子组件 -->
        <cmt-box :id="id"></cmt-box>
    </div>
</template>

<script>
// 1. 导入评论子组件
import comment from '../subcomponents/comment.vue'

import { Toast } from 'mint-ui'
export default {
    data () {
        return {
            id: this.$route.params.id,//从路由中获取到的图片id
            photoinfo: {} ,//图片详情
            slide1: [
        //   {
        //     src: 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_b.jpg',
        //     msrc: 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg',
        //     alt: 'picture1',
        //     title: 'Image Caption 1',
        //     w: 600,
        //     h: 400
        //   },
        //   {
        //     src: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_b.jpg',
        //     msrc: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg',
        //     alt: 'picture2',
        //     title: 'Image Caption 2',
        //     w: 1200,
        //     h: 900
        //   }
        ] //缩略图的数组
        }
    },
    components: {
        // 注册评论子组件
        "cmt-box": comment
    },
    created () {
        this.getPhotoInfo (),
        this.getThumbs ()
    },
    methods: {
        getPhotoInfo () {//获取图片的详情
            this.$http.get('api/getimageInfo/' + this.id).then (result => {
                if (result.body.status === 0) {
                    this.photoinfo = result.body.message[0]
                } else {
                    Toast('获取分类图片数据失败。。。')
                }
            })
        },
        
        getThumbs () {// 获取缩略图
            this.$http.get('api/getthumimages/' + this.id).then(result => {
            if (result.body.status === 0) {
                // 循环每个图片数据，补全图片的宽和高，因为图片数据显示不出来，自己向里填数据,伪造的数据
                result.body.message.forEach(item => {
                    item.w = 600;
                    item.h = 400;
                    item.src = 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_b.jpg';
                    item.msrc = 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg';
                    item.alt = 'picture2';
                    item.title = 'Image Caption 2';
                });
                // 把完整的数据保存到list中
                this.slide1 = result.body.message
            } else {
                Toast('获取缩略图数据失败。。。')
            }
        })
        },
        
        handleClose () {
        console.log('close event')
      }
    }
}
</script>

<style lang="scss" scoped>
.photoinfo-container {
    padding: 3px;
    h3 {
        color: #26a2ff;
        font-size: 15px;
        text-align: center;
        margin: 15px 0;
    }
    .subtitle {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
    }
    .content {
        font-size: 13px;
        line-height: 30px;
    }

}
</style>
