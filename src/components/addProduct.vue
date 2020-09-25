<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon>
            </el-alert>
            <!-- 进度条 -->
            <el-steps :space="200" :active="activeName - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="产品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 侧边标签 -->
            <el-form :model="addForm" :rules="addrules" ref="addFormRefs" 
                label-width="100px" 
                class="demo-ruleForm" 
                label-position="top">
                <el-tabs v-model="activeName" tab-position="left" 
                    :before-leave="moveToMany"
                    @tab-click="tabChange">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="产品参数" name="1" >
                        <el-form-item v-for="item in manyList" :key="item.attr_id" :label="item.attr_name">
                                <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox 
                                    :label="ele" 
                                    v-for="(ele,index) in item.attr_vals"
                                    :key="index"
                                    border
                                ></el-checkbox>
                                
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyList" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>    
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="savePath"
                            list-type="picture"
                            :headers="headerObj"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <el-button type="primary" @click="addProduct" class="addProduct">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <!-- 图片预览对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="picDialogVisible"
            width="50%">
            <img :src="previewImg" alt="" class="previewImg">
        </el-dialog>
        </el-card>
        
    </div>
</template>

<script>
var _ = require('lodash');

export default {
    created(){
        this.getCateList()
    },
    data(){
        return{
            activeName:'0',
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:'',
                pics:[],
                goods_introduce:'',
                attrs:[]

            },
            addrules:{
                goods_name:[{required:true , message:'不能为空',trigger:'blur'}],
                goods_price:[{required:true , message:'不能为空' ,trigger:'blur'}],
                goods_weight:[{required:true , message:'不能为空' ,trigger:'blur'}],
                goods_number:[{required:true , message:'不能为空' ,trigger:'blur'}],
                goods_cat:[{required:true , message:'不能为空' ,trigger:'blur'}]
                
            },
            cateList:[],
            cateProps:{
                expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            manyList:[],
            onlyList:[],
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            picDialogVisible:false,
            previewImg:''
            
        }
    },
    computed:{
        getCateLastId(){
            return this.addForm.goods_cat[2];
        }
    },
    methods:{
       /* 获取分类列表 */
        async getCateList(){
            const {data:res} = await this.$http.get('categories');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
        },
        /* 级联选择器 */
        handleChange(){
            if(this.addForm.goods_cat.length!==3)
            this.addForm.goods_cat = [];
            return
        },
        /* 标签切换 */
        moveToMany(activeName,oldName){
            if(oldName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请选择产品类型');
                return false;
            }
        },
        tabChange(){
            switch (this.activeName){
                case '1':
                {
                    this.getManyList()
                }
                break;
                case '2':
                {
                    this.getOnlyList()
                }
                break;
                 case '4':
                {
                    this.getManyList();
                    this.getOnlyList()
                }
                break;

            }
        },
        /* 获取动态参数 */
        async getManyList(){
            const {data:res} = await this.$http.get(`categories/${this.getCateLastId}/attributes`,{
                params:{sel:'many'}
            });
            if(res.meta.status !==200) return this.$message.error('获取参数失败');
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals == '' ? [] :element.attr_vals.split(',')
            });
            this.manyList = res.data;
        },  
        /* 获取静态属性 */   
        async getOnlyList(){
            const {data:res} = await this.$http.get(`categories/${this.getCateLastId}/attributes`,{
                params:{sel:'only'}
            });
            if(res.meta.status !==200) return this.$message.error('获取参数失败');
            this.onlyList = res.data;
        }, 
        /* 图片上传 */
        handlePreview(e){
            this.previewImg = e.response.data.url;
            this.picDialogVisible = true;

        },
        handleRemove(e){
            const path = e.response.data.tmp_path;
            const i = this.addForm.pics.findIndex(item=>{
                item.pic === path;
            });
            this.addForm.pics.splice(i,1);
        },
        savePath(response){
            const path = {pic:response.data.tmp_path};
            this.addForm.pics.push(path);
        },
        /* 添加商品 */
        addProduct(){
           this.$refs.addFormRefs.validate(async valid=>{
               if(!valid) return this.$message.error('请填写必要选项');
               
               const form = _.cloneDeep(this.addForm);
                form.goods_cat = form.goods_cat.join(',');

                this.manyList.forEach(item=>{
                   form.attrs.push({
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    });
                });
                this.onlyList.forEach(item=>{
                    form.attrs.push({
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    });
                });

                const {data:res} = await this.$http.post('goods',form);
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
                this.$message.success('添加商品成功');
                this.$router.push('/goods')

           });
           
        },
        
    }
}
</script>

<style lang="less" scope>
    .el-steps{
        margin: 30px 0 50px 0 !important;
    }
    .el-step__title{
        font-size:13px!important ;
    }
    .el-tabs__item{
        margin-bottom: 10px!important;
    }
    
    .el-tab-pane{
        margin-left: 20px!important;
        padding-right: 60px!important;
    }
    .el-checkbox.is-bordered+.el-checkbox.is-bordered{
        margin-left: 0!important;
        margin-top: 10px!important;
    }
    .previewImg {
        width: 100%!important;
        height: 100%!important;
    }
    .ql-editor{
        min-height: 350px!important;
    }
    .addProduct{
        margin-top: 20px!important;
    }
</style>
