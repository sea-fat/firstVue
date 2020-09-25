<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
             <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                show-icon>
            </el-alert>
            <!-- 级联选择器 -->
            <el-form ref="cateFormRef" label-width="100px" class="choose">
                <el-form-item label="选择商品分类" >
                    <el-cascader
                        v-model="cateSeleteId"
                        :options="categoriesList"
                        :props="cateProps"
                        :show-all-levels="false"
                        clearable
                        @change="cateChange"
                    >
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 添加按钮 -->
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <!-- 动态参数 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isDisabled" @click="add">添加动态</el-button>
                    <el-table
                        :data="manyTableList"
                        style="width: 100%"
                        stripe
                        border>
                        <el-table-column type="index"  label="#"  prop="attr_id"></el-table-column>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" 
                                    :key="i" 
                                    class="tag-margin"
                                    closable
                                    @close="handleClose(i,scope.row)">{{item}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="属性名称"
                            prop="attr_name">
                        </el-table-column>
                         <el-table-column
                            label="操作"
                            prop="attr_name">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyParam(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isDisabled" @click="add">添加属性</el-button>
                    <el-table
                        :data="onlyTableList"
                        style="width: 100%"
                        border>
                        <el-table-column type="index"  label="#"  prop="attr_id"></el-table-column>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" 
                                    :key="i" 
                                    class="tag-margin"
                                    closable
                                    @close="handleClose(i,scope.row)">{{item}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="属性名称"
                            prop="attr_name">
                        </el-table-column>
                         <el-table-column
                            label="操作"
                            prop="attr_name">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyParam(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteParam(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog
            :title="addTitle"
            :visible.sync="addDialogVisible"
            width="35%"
            @close="resetAdd">
            <el-form ref="addFormRef" :model="addForm" label-width="80px">
                <el-form-item :label="addFormLabel" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAdd">取 消</el-button>
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog
            :title="modifyTitle"
            :visible.sync="modifyDialogVisible"
            width="35%">
            <el-form ref="modifyFormRef" :model="modifyForm" label-width="80px">
                <el-form-item :label="addFormLabel" prop="attr_name">
                    <el-input v-model="modifyForm.attr_name"></el-input>
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
        this.getrolesList();
    },
    data(){
        return {
            /* 分类列表相关参数 */
            categoriesList:[],
            cateSeleteId:[],
            cateProps:{
                expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            /* tab栏参数 */
            activeName:'many',
            manyTableList:[],
            onlyTableList:[],
            addTitle:'',
            addFormLabel:'',
            addDialogVisible:false,
            addForm:{
                attr_name:''
            },
            modifyTitle:'',
            modifyDialogVisible:false,
            /* 选择的参数ID */
            modifyForm:{
                att_id:'',
                attr_name:''
            },
            
        }
    },
    computed:{
        isDisabled(){
            if(this.cateSeleteId.length==0) return true;
            return false;
        }
        
    },
    methods:{
        /* 获取分类列表 */
        async getrolesList(){
            const {data:res} = await this.$http.get('categories',{params:this.querryInfor});
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.categoriesList = res.data;
        },
        /* 选择分类 */
        cateChange(){
            if(this.cateSeleteId.length<3){
                this.cateSeleteId=[];
                this.manyTableList=[];
                this.onlyTableList=[]
            }
            this.getParams();
        },
        /* 导航改变 */
        tabClick(){
           this.getParams();
        },
        /* 获取参数列表 */
        async getParams(){
            if(this.cateSeleteId.length == 3){
                const id = this.cateSeleteId[2];
                const {data:res} = await this.$http.get('categories/'+id+'/attributes',{params:{sel:this.activeName}});
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                res.data.forEach(element => {
                    element.attr_vals = element.attr_vals ? element.attr_vals.split(' '):[];
                    element.inputVisible=false;
                    element.inputValue = ''
                });
                if(this.activeName == 'many') {
                    this.manyTableList = res.data;
                    console.log(res.data)
                }else if(this.activeName == 'only'){
                    this.onlyTableList = res.data
                }
            }
            return
        },
        /* 添加 */
        add(){
            if(this.activeName == 'many') {
                this.addTitle = '添加动态属性',
                this.addFormLabel = '动态属性'
            }else{
                this.addTitle = '添加静态属性'
                this.addFormLabel = '静态属性'

            }
            this.addDialogVisible=true;
        
        },
        async confirmAdd(){
            const id = this.cateSeleteId[2];
            const {data:res} = await this.$http.post('categories/'+id+'/attributes',{
                attr_name:this.addForm.attr_name,
                attr_sel:this.activeName,
            });
            if(res.meta.status !== 201) return this.$message.error('添加失败');
            this.addDialogVisible=false;
            this.getParams();
        },
        resetAdd(){
            this.addDialogVisible = false;
            this.$refs.addFormRef.resetFields();
        },
        /* 修改 */
        modifyParam(infor){
            if(this.activeName == 'many') {
                this.modifyTitle = '修改动态属性',
                this.addFormLabel = '动态属性'
            }else{
                this.modifyTitle = '修改静态属性'
                this.addFormLabel = '静态属性'

            }
            this.modifyForm.attr_name = infor.attr_name;
            this.modifyForm.att_id = infor.attr_id;
            this.modifyDialogVisible=true;
        },
        async confirmModify(){
            this.$refs.modifyFormRef.validate(async (valid) => {
                if (valid) {
                    const id = this.cateSeleteId[2];
                    const {data:res} = await this.$http.put('categories/'+id+'/attributes/'+this.modifyForm.att_id,{
                        attr_name:this.modifyForm.attr_name,
                        attr_sel:this.activeName
                    });
                    if(res.meta.status !== 200) return this.$message.error('修改失败');
                    this.$message.success('修改成功');
                    this.getParams();
                    this.modifyDialogVisible = false;
                }
                return 
            })
           
            
        },
        /* 删除 */
        async deleteParam(attr_id){
            const str = await this.$confirm('是否删除此属性?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err);
            if(str == 'cancel'){
                return;
            }
            else if(str == 'confirm'){
                const id = this.cateSeleteId[2];
                const {data:res} = await this.$http.delete('categories/'+id+'/attributes/'+attr_id);
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.getParams();
            }
        },
       
        /* 保存标签 */
        async saveAttr_vals(row,text){
            const id = this.cateSeleteId[2];
            const {data:res} = await this.$http.put('categories/'+id+'/attributes/'+row.attr_id,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            });
            if(res.meta.status !== 200) return this.$message.error(text+'失败');
            this.$message.success(text+'成功');
        },
        /* 确定提交标签 */
        async handleInputConfirm(row){
            const text = '添加';
            if(row.inputValue.trim().length===0) {
                row.inputValue='';
                row.inputVisible=false;
                return;
            }
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue='';
            row.inputVisible=false;
            this.saveAttr_vals(row,text);
            
        },
        /* 标签删除 */
        async handleClose(i,row){
            const text = '删除';
            const str = await this.$confirm('确定删除此标签?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err);
            if(str === 'confirm'){
                row.attr_vals.splice(i,1);
                this.saveAttr_vals(row,text);
            }
            return
        },
        /* 标签变输入框 */
        showInput(row){
            row.inputVisible=true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        
    }
}
</script>

<style lang="less" scope>
    .choose{
        margin-top: 20px!important;
    }
    .tag-margin{
        margin-right: 20px!important;
    }
    .input-new-tag{
        width: 120px!important;
    }
</style>
