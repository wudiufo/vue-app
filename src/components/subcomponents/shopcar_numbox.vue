<template>
    <div>
        <!-- 问题是：我们不知道什么时候能够拿到max值，但是，总归有一颗】刻，会得到一个真正的max值 -->
        <!-- 我们可以使用watch属性监听，来监听父组件传递过来的max值，不管max会被触发几次，但是。最后一次，肯定是一个合法的max数值 -->
        <div class="mui-numbox" data-numbox-min='1' style="height:25px;">
            <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
            <input @change="countChanged" ref="numbox" readonly id="test" class="mui-input-numbox" type="number" :value="initcount" />
            <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
        </div>
    </div>
    <!-- 分析：子组件什么时候把数据传递给父组件 -->
</template>

<script>
import mui from '../../lib/mui/js/mui.min.js'
export default {
    mounted() {
        // 初始化数字选择框
        mui('.mui-numbox').numbox();
    },
    props: ["initcount", "goodsid"],
    
    methods: {
       countChanged () {
        //每当文本框的数据被修改的时候，立即把最新的数据通过事件调用，传递给父组件
        // console.log(this.$refs.numbox.value);
        // 数量改变了
        // 每当数量值改变，则立即把最新的数据同步到购物车store中，覆盖之前的数量值
        this.$store.commit('updateGoodsInfo',{
            id: this.goodsid,
            count: this.$refs.numbox.value
        })
       } 
    }
}
</script>

<style lang="scss" scoped>
div {
    display: inline-block;
    margin-left: 5px;
}
</style>
