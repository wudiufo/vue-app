<template>
    <div class="cmt-container">
        <h3>发表评论</h3>
        <hr>
        <textarea v-model="msg" placeholder="请输入要评论的内容（最多吐槽120字）" maxlength="120">

        </textarea>

        <mt-button @click="postCpmment" type="primary" size="large">发表评论</mt-button>

        <div class="cmt-list">
            <div class="cmt-item" v-for="(item,i) in commentlist" :key="i">
                <div class="cmt-title">
                    第{{++i}}楼&nbsp;&nbsp;用户 ：{{item.user_name}}:&nbsp;&nbsp;发表时间 ：{{item.add_time | dateFormat}}
                </div>
                <div class="cmt-body">
                    {{item.content === 'undefined'? '此用户很懒，什么也没说':item.content}}
                </div>
            </div>
                  
        </div>

        <mt-button type="danger" size="large" plain @click="getMore">加载更多</mt-button>
    </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
    data () {
        return {
            pageIndex: 1,//默认展示第一页数据
            commentlist:[], //所有的评论数据
            msg: ''//评论输入的内容
        }
    },
    
    created () {
        this.getComments()
    },
    methods: {
        getComments () {//获取评论
            this.$http.get("api/getcomments/" + this.id + "?pageindex=" + this.pageIndex).then(result => {
                if (result.body.status === 0) {
                    // this.commentlist = result.body.message
                    // 每当获取最新评论的时候，不要把老数据清空覆盖，而是应该以老数据拼接上新数据
                    this.commentlist = this.commentlist.concat(result.body.message)
                } else {
                    Toast ('获取评论数据失败。。。')
                }
            })
        },
        getMore () {//加载更多
            this.pageIndex ++;
            this.getComments();
        },
        postCpmment () {
            // 校验评论内容是否为空
            if (this.msg.trim().length === 0) {
                return Toast('评论内容不能为空');
            }

            // 发表评论
            // 参数一：请求的URL地址
            // 参数二：提交给服务器的数据对象{content：this.msg}
            // 参数三：定义提交的时候，表单中的数据格式{emulateJSON：true}
            this.$http.post('api/postcomment/' + this.$route.params.id,{
                content: this.msg.trim()
            }).then(result => {
                if (result.body.status === 0) {
                    // 1.拼接处一个评论对象
                    var cmt = {
                        user_name: "匿名用户",
                        add_time: Date.now(),
                        content: this.msg.trim()
                    };
                    this.commentlist.unshift(cmt)
                    this.msg = '';
                    Toast('评论提交成功')
                }
            })

        }
    },
    props: ["id"]
}
</script>

<style lang="scss" scoped>
.cmt-container {
    h3 {
        font-size: 18px;
    }
    textarea {
        font-size: 14px;
        margin: 0px;
        height: 85px;
    }

    .cmt-list {
        margin: 5px 0;
        .cmt-item {
            font-size: 13px;
            .cmt-title {
                line-height: 30px;
                background-color: #ccc;
            }
            .cmt-body {
                line-height: 30px;
                text-indent: 2em;
            }
        }
    }
}
</style>
