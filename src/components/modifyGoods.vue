<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>商品修改</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="修改商品信息"
                type="info"
                center
                show-icon>
            </el-alert>
            <el-form :model="modifyForm" 
                label-width="100px" 
                class="demo-ruleForm" 
                label-position="top">
            <el-tabs tab-position="left">
                <el-tab-pane label="基本信息">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="modifyForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="modifyForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="modifyForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="modifyForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" disabled>
                            <el-input v-model="getCateNameString" ></el-input>
                        </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="产品参数">
                    <!-- <el-form-item v-for="item in manyList" :key="item.attr_id" :label="item.attr_name">
                                <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox 
                                    :label="ele" 
                                    v-for="(ele,index) in item.attr_vals"
                                    :key="index"
                                    border
                                ></el-checkbox>
                                
                            </el-checkbox-group>
                        </el-form-item> -->
                </el-tab-pane>
                <el-tab-pane label="商品属性">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片">商品图片</el-tab-pane>
                <el-tab-pane label="商品内容">商品内容</el-tab-pane>
            </el-tabs>
            </el-form>
        </el-card>   
    </div>
</template>

<script>
export default {
    created(){
        this.getURL();
        this.getGoodsInfor();
    },
    data(){
        return{
            urlId:'',
            modifyForm:{},
            cateName:[]
        }
    },
    computed:{
        getCateNameString(){
            return this.cateName.join(' / ')
        }
    },
    methods:{
        //获取id
        getURL(){
            this.urlId = this.$route.query.id;
        },
        //根据ID获取商品信息
        async getGoodsInfor(){
            const {data:res} = await this.$http.get('goods/'+this.urlId);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.modifyForm = res.data;
            this.getCateName(res.data.cat_one_id,res.data.cat_two_id,res.data.cat_three_id);
            console.log(this.modifyForm)
        },
        // 根据分类ID获取分类名字 
        getCateName(...args){           
            args.forEach(async item=>{
                const {data:res} = await this.$http.get('categories/'+item);
                if(res.meta.status === 200);
                this.cateName.push(res.data.cat_name)
            })
        },
    }
}
</script>
