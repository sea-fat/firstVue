<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-button type="primary" class="addRloe-btn" @click="addCate">添加分类</el-button>
            <tree-table 
                :data="categoriesList"  
                :columns="columns" 
                stripe
                border 
                show-row-hover
                show-index
                index-text="#"
                :selection-type="false"
                :expand-type="false">
                <template slot="isOk" slot-scope="scope" > 
                    <i class="el-icon-success" type="success" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" type="danger" v-else></i>
                </template>
                <template slot="order" slot-scope="scope" > 
                    <el-tag type="success" size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="primary" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else >三级</el-tag>
                </template>
                <template slot="control" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyCate(scope.row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querryInfor.pagenum"
                :page-sizes="[5, 10, 20]"
                :page-size="querryInfor.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination> 
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="35%"
        >
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCaterRef" label-width="100px" class="demo-ruleForm" >
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
                 <el-cascader
                    v-model="parentCateSeleteId"
                    :options="parentCateList"
                    :props="parentCateProps"
                    @change="handleChange"
                    clearable>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetAdd">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog
            title="提示"
            :visible.sync="modifyDialogVisible"
            width="35%"
            >
            <el-form ref="modifyFormRef" :model="modifyForm" label-width="80px">
                <el-form-item label="分类名称" >
                    <el-input v-model="modifyForm.cateName" disabled></el-input>
                </el-form-item>
                <el-form-item label="修改为" >
                    <el-input v-model="modifyForm.modifyCateName"> </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmModify">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
export default {
    created(){
        this.getCategoriesList();
    },
    data(){
        return {
            categoriesList:[],
            /* tree-table列 */
            columns:[
                {
                label: '分类名称',
                prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    prop:'cat_deleted',
                    type:'template',
                    template:'isOk'
                }, 
                {
                    label: '排序',
                    prop: 'cat_level',
                    type:'template',
                    template:'order'
                },
                {
                    label: '操作',
                    type:'template',
                    template:'control'
                }
            ],
            /* 参数 */
            querryInfor:{
                type:'',
                pagenum:1,
                pagesize:5
            },
            total:0,
            addDialogVisible:false,
            /* 添加分类表单数据对象 */
            addCateForm:{
                cat_pid:0,/* 分类的ID（0，1，2），默认增加的是父ID：0 */
                cat_name:'',/* 分类名称 */
                cat_level:0,/* 分类有多少级，默认增加一级 */
            },
            addCateRules:{
                cat_name:[
                    {required:true,message:'不能为空',trigger:'blur'}
                ]
            },
            parentCateList:[],
            parentCateSeleteId:[],
            parentCateProps:{
                expandTrigger:'hover',
                checkStrictly: true,
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            /* 修改 */
            modifyDialogVisible:false,
            modifyForm:{
                cat_id:'',
                cateName:'',
                modifyCateName :''
            }
           
            

        }
    },
    methods:{
        /* 分类列表 */
        async getCategoriesList(){
            const {data:res} = await this.$http.get('categories',{params:this.querryInfor});
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.categoriesList = res.data.result;
            this.total = res.data.total;
        },
        /* 分页器 */
        handleSizeChange(newSize){
            this.querryInfor.pagesize = newSize;
            this.getCategoriesList()
        },
        handleCurrentChange(newPge){
            this.querryInfor.pagenum = newPge;
            this.getCategoriesList()
        },
        /* 父级分类列表 */
        async getParentCategoriesList(){
            const {data:res} = await this.$http.get('categories',{type:2});
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.parentCateList = res.data;
        },
        /* 添加分类 */
        addCate(){
            this.getParentCategoriesList();
            this.addDialogVisible = true
        },
        handleChange(){
            /* 判断是否添加了父级的子分类 */
            if(this.parentCateSeleteId.length >0){
                this.addCateForm.cat_pid = this.parentCateSeleteId[this.parentCateSeleteId.length-1];
                this.addCateForm.cat_level = this.parentCateSeleteId.length;
                return
            }else{
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
                return
            }
        },
        async confirmAdd(){
            this.$refs.addCaterRef.validate(async (valid) => {
                if(!valid) return;
                const {data:res} = await this.$http.post('categories',this.addCateForm);
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
                this.$message.success('添加成功');
                this.addDialogVisible=false;
                this.getCategoriesList()
            }) 
        },
        resetAdd(){
            this.$refs.addCaterRef.resetFields();
            this.parentCateSeleteId = []
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
            this.addDialogVisible = false;
        },
        /* 删除 */
        async deleteCate(id){
            const str =  await this.$confirm('确定删除此分类吗?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err=>err)
            if(str == 'cancel'){
                return this.$message.error('取消删除');
            }
            else if(str == 'confirm'){
                const {data:res} = await this.$http.delete('categories/'+id);
                if(res.meta.status !==200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.getCategoriesList(); 
            }
        },
        /* 修改 */
        modifyCate(cateInfor){
            this.modifyDialogVisible=true;
            this.modifyForm.cat_id = cateInfor.cat_id;
            this.modifyForm.cateName = cateInfor.cat_name;
        },
        async confirmModify(){
            const {data:res} = await this.$http.put('categories/'+this.modifyForm.cat_id,
            {cat_name:this.modifyForm.modifyCateName});
            if(res.meta.status !==200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.modifyDialogVisible=false;
            this.getCategoriesList(); 
        }
        
    }
}
</script>

<style lang="less" scope>
    .zk-table{
        margin-top: 20px!important;
    }
    .el-cascader-panel{
        height:250px!important;
    }
</style>
