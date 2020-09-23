<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="querryInfor.query" clearable @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addFormdialogVisible= true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表 -->
            <el-table border style="width: 100%" :data="userList" stripe >
                <el-table-column type="index" label="#" ></el-table-column>
                <el-table-column prop="username" label="姓名" ></el-table-column>
                <el-table-column prop="email" label="邮箱"  width="200"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
                 <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#409EFF" inactive-color="#DCDFE6" @change="changeState(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="200">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyInfor(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteInfor(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="light" content="分配角色" placement="top" :enterable='false'>
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="deliverRoles(scope.row)"></el-button>   
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querryInfor.pagenum"
            :page-sizes="[1, 5, 10]"
            :page-size="querryInfor.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户弹框 -->
        <el-dialog
        title="添加用户信息"
        :visible.sync="addFormdialogVisible"
        width="35%"
        @close="addFormClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="15">
                            <el-form-item label="用户名" prop="username">
                            <el-input v-model="addForm.username"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addForm.password" type="password" show-password></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="确认密码" prop="password2">
                            <el-input v-model="addForm.password2" type="password" show-password></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addForm.email"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="addForm.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormdialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改区域 -->
        <el-dialog
        title="修改用户信息"
        :visible.sync="modifydialogVisible"
        width="35%"
        @close="modifyClose"
        >
            <el-form :model="userInfor" 
            :rules="addFormRules" 
            ref="modifyRef" 
            label-width="100px" 
            class="demo-ruleForm"
            >
                <el-row>
                    <el-col :span="15">
                            <el-form-item label="用户名" prop="username">
                            <el-input v-model="userInfor.username" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="userInfor.email"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="userInfor.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmModify(userInfor.id)">确 定</el-button>
                <el-button @click="modifydialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色 -->
        <el-dialog
            title="分配用户角色"
            :visible.sync="deliverDialogVisible"
            width="50%"
        > 
            <el-form ref="deliverRolesRef" :model="userInfor" label-width="100px">
                <el-form-item label="用户名：">
                    <el-input v-model="userInfor.username" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称：">
                    <el-input v-model="userInfor.role_name" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色更改为：">
                    <el-select v-model="selectedId" placeholder="请选择" >
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetDeliverRoles">取 消</el-button>
                <el-button type="primary" @click="confirmDeliverRole">确 定</el-button>
            </span>
            
        </el-dialog>
    </div>
</template>

<script>
export default {
    created(){
        this.getUsersList()
    },
    data(){
        /* 密码验证规则 */
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.addForm.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        /* 邮箱验证规则 */
        var validateEmail = (rule, value, callback) => {
            const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (regEmail.test(value)) {
                return callback();
            }
            callback(new Error('邮箱不合法'));
        };
        /* 手机验证规则 */
        var validateMobile = (rule, value, callback) => {
            const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
            if (regMobile.test(value)) {
                return callback();
            }
            callback(new Error('手机号不合法'));
        };

        return{
            querryInfor:{
                query:'',/* 查询参数 */
                pagenum:1, /* 当前页码 */
                pagesize:1, /* 每页显示条数 */
            },
            userList:[],
            rolesList:[],
            total:0,
            addFormdialogVisible:false,
            modifydialogVisible:false,
            deliverDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                password2:'',
                email:'',
                mobile:''
            },
            addFormRules:{
                username:[
                    {required:true,message:'用户名不能为空',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'密码不能为空',trigger:'blur'}
                ],
                password2:[
                    {required:true,message:'密码不能为空',trigger:'blur'},
                    { validator: validatePass2, trigger: 'blur'}
                ],
                email:[
                    {required:true,message:'邮箱不能为空',trigger:'blur'},
                    { validator: validateEmail, trigger: 'blur'}
                ],
                mobile:[
                    {required:true,message:'手机号不能为空',trigger:'blur'},
                    { validator: validateMobile, trigger: 'blur'}
                ]
            },
            userInfor:{},
            selectedId:''
        }
    },
    methods:{
        /* 获取用户列表 */
        async getUsersList(){
            const {data:res} = await this.$http.get('users',{params:this.querryInfor});
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.userList = res.data.users;
            this.total = res.data.total;
            console.log(this.userList)
        },
        /* 获取角色列表 */
        async getRolesList(){
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status!==200) return this.$message.error('获取角色信息失败');
            this.rolesList = res.data;
            this.total= res.totalpage
        },
        /* 改变显示页面数量 */
        handleSizeChange(newSize){
            this.querryInfor.pagesize = newSize;
            this.getUsersList()
        },
        /* 改变当前页码 */
        handleCurrentChange(newPge){
            this.querryInfor.pagenum = newPge;
            this.getUsersList()
        },
        /* 改变状态 */
        async changeState(userInfor){
            const {data:res} = await this.$http.put(`users/${userInfor.id}/state/${userInfor.mg_state}`);
            if(res.meta.status != 200) {
                userInfor.mg_state = !userInfor.mg_state;/* 页面的按钮重置 */
                return this.$message.error('更改失败')
            }
            return this.$message.success('更改成功')
        },
        /* 添加用户 */
        confirm(){
            this.$refs.addFormRef.validate(async value=>{
                if(!value) return 
                const {data:res} = await this.$http.post('users',this.addForm);
                console.log(res)
                if(res.meta.status!==201) return this.$message.error(res.meta.msg);
                this.$message.success('添加用户成功')
                this.addFormdialogVisible = false
                this.getUsersList()
            })
        },
        addFormClose(){
            this.$refs.addFormRef.resetFields() 
        },
        /* 修改用户 */
        async modifyInfor(id){
            this.modifydialogVisible = true;
            const {data:res} = await this.$http.get('users/'+id);
            if(res.meta.status !=200) return this.$message.error(res.meta.msg);
            this.userInfor = res.data;
        },
        modifyClose(){
            this.$refs.modifyRef.resetFields() 
        },
        async confirmModify(id){
            this.$refs.modifyRef.validate(async value=>{
                if(!value) return 
                const {data:res} = await this.$http.put('users/'+id,this.userInfor);
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.modifydialogVisible = false;
                this.getUsersList();
            })
        },
        /* 删除 */
        async deleteInfor(id){
            const str =  await this.$confirm('确定删除此用户吗?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err=>err)
            if(str == 'cancel'){
                return this.$message.error('取消删除');
            }
            else if(str == 'confirm'){
                const {data:res} = await this.$http.delete('users/'+id);
                if(res.meta.status !==200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.getUsersList(); 
            }
        }
    ,
    /* 分配角色 */
        async deliverRoles(scope){
            this.getRolesList();
            this.userInfor = scope;
            this.deliverDialogVisible = true
        },
        resetDeliverRoles(){
            this.$refs.deliverRolesRef.resetFields();
            this.selectedId = ''
            this.deliverDialogVisible = false;
        },
        async confirmDeliverRole(){
            if(!this.selectedId) return this.deliverDialogVisible=false;
            const {data:res} = await this.$http.put(`users/${this.userInfor.id}/role`,{rid:this.selectedId});
            if(res.meta.status!==200) return this.$message.error(res.meta.message);
            this.$message.success('修改成功');
            this.deliverDialogVisible=false;
            this.getUsersList();
           
        },
    }
}
</script>

<style lang="less" scope>
    .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.1)!important;
  }
  .el-table {
      margin: 40px 0!important;
  }
  
</style>
