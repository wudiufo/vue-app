<template>
    <div>
        <!-- 顶部滑动条区域 -->
        <div id="slider" class="mui-slider">
				<div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
					<div class="mui-scroll">
						<a @tap="getPhotoListByCateId(item.id)" v-for="item in categories" :key="item.id" :class="['mui-control-item', item.id == 0 ? 'mui-active':''] " >
							{{item.title}}
						</a>
					</div>
				</div>

		</div>

		<!-- 图片列表区域 -->
		<ul class="photo-list">
			<router-link :to="'/home/photoinfo/' + item.id" v-for="item in list" :key="item.id" tag="li">
				<img v-lazy="item.img_url">
				<div class="info">
					<h1 class="info-title">
						{{item.title}}
					</h1>
					<div class="info-body">
						{{item.zhaiyao}}
					</div>
				</div>
			</router-link>
		</ul>
    
	</div>
</template>

<script>
import { Toast } from 'mint-ui'
// 1.导入mui的js文件
import mui from '../../lib/mui/js/mui.min.js'

export default {
    data () {
        return {
			categories: [], //图片分类列表
			list: []//图片列表的数组
        };
	},
	created () {
		this.getImgCategory (),
		//默认进入页面，就主动请求所有图片列表的数据
		this.getPhotoListByCateId (0)
	},
	mounted () {//当组件中的DOM结构被渲染好并放到页面中后，会执行这个钩子函数
		// 如果要操作元素了，最好在mounted里面，因为这里时候的DOM元素是最新的
		// 2. 初始化滑动控件
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick减速系数，系数越大，滑动速度越慢，滚动距离约小，默认值为0/0006
		})
	},
    methods: {
		// 获取图片分类数据
		getImgCategory () {
			this.$http.get ('api/getimgcategory').then (result => {
				if (result.body.status === 0) {
					// 手动把‘全部’拼接到获取到的message数组中
					result.body.message.unshift({title:"全部", id:0})
					// 把获取到的数据放到data中categories中
					this.categories = result.body.message
				} else {
					Toast('获取分类图片数据失败。。。')
				}
			})
		},

		// 获取图片列表数据，根据图片分类的id获取图片列表数据
		getPhotoListByCateId (cateId) {
			this.$http.get('api/getimages/' + cateId).then (result => {
				if (result.body.status === 0) {	
					// 由于接口图片获取不到，自己拼接假数据
					result.body.message.forEach(element => {
						element.img_url = "https://ps.ssl.qhimg.com/sdmt/116_135_100/t0162c64e71d94e3e34.jpg"
					});
					this.list = result.body.message
				} else {
					Toast('获取分类图片数据失败。。。')
				}
			})
		}
    }
}
</script>

<style lang="scss" scoped>
// 解决滑动时报警高的问题
* { touch-action: pan-y; }

.photo-list {
	list-style: none;
	margin: 0;
	padding: 10px;
	padding-bottom: 0;
	li {
		background-color: #ccc;
		text-align: center;
		margin-bottom: 10px;
		box-shadow: 0 0 9px #999;
		position: relative;
		img {
			width: 100%;
			vertical-align: middle;
		}
		img[lazy=loading] {
			width: 40px;
			height: 300px;
			margin: auto;
		}

		.info {
			color: white;
			text-align: left;
			position: absolute;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.4);
			max-height: 84px;
			.info-title {
				font-size: 14px;
			}
			.info-body {
				font-size: 13px;
			}
		}
	}
}


</style>
