<template>
    <div>
        <mt-swipe :auto="4000">
          <!-- 在组件中，使用v-for循环的话，一定要使用key -->
          <!-- 将来谁使用此轮播图组件，谁为我们传递lunbotulist -->
          <!-- 此时，lunbotulist应该是父组件向子组件传值来设置 -->
        <mt-swipe-item v-for="(item, i) in lunbotulist" :key="i">
            <img :src="item.img" alt="" :class="{'full': isfull}">
        </mt-swipe-item>
      </mt-swipe>
    </div>

    <!-- 分析：为什么商品评论中的轮播图那么丑 -->
    <!-- 1.首页中的图片，他的宽和高，都是使用了100%的宽度 -->
    <!-- 2.在商品详情页面中，轮播图的图片，如果也使用宽高为100%的话，页面不好看 -->
    <!-- 3.商品详情页面中的轮播图，期望高度是100%，但是宽度为自适应 -->
    <!-- 4.经过分析，得到问题的原因：首页中的轮播图和详情页的轮播图，分歧点是宽度到底是100%，还是自适应 -->
    <!-- 5.既然这两个轮播图，其他方面都是没有冲突的，只是宽度有分歧，那么，我们可以定义一个属性，让使用轮播图的调用者，手动指定是否为100%的宽度 -->
    

</template>

<script>
export default {
    props: ['lunbotulist','isfull'],
}
</script>

<style lang="scss" scoped>
.mint-swipe {
    height: 200px;
    
    .mint-swipe-item {
        text-align: center;
        // &:nth-child(1) {
        //     background-color: red;
        // }
        // &:nth-child(2) {
        //     background-color: blue;
        // }
        // &:nth-child(3) {
        //     background-color: rgb(17, 202, 125);
        // }
        img {
            // width: 100%;
            height: 100%;
        }
    }
}

.full {
    width: 100%;
}
</style>
