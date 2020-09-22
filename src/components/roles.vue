<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary" class="addRloe-btn" @click="addRole">添加角色</el-button>
            <!-- 列表 -->
            <el-table
                :data="rolesList"
                border
                style="width: 100%"
                stripe
            >
                <el-table-column  width="50" type="expand">
                    <template v-slot="scope">
                        <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bb',i1 == 0?'bt' :'','rowMarign','tagvcenter']">
                            <el-col :span="5">
                                <el-tag  class="tag" closable @close="removeTag(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2==0? '':'bt','tagvcenter']">
                                    <el-col :span="6">
                                       <el-tag type="success" class="tag" closable @close="removeTag(scope.row,item2.id)">
                                           {{item2.authName}}
                                       </el-tag>
                                       <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag  
                                        type="warning" 
                                        closable v-for="(item3,i3) in item2.children" :key="item3.id" 
                                        class="tagRight"
                                        @close="removeTag(scope.row,item3.id)">
                                           {{item3.authName}}
                                       </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"  width="80"></el-table-column>
                <el-table-column prop="roleName"  label="角色名称" ></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
                <el-table-column  label="操作"  width="400">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="modify(scope.row.id)">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="deliverRoles(scope.row)">分配角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 新增角色对话框 -->
            <el-dialog
                title="提示"
                :visible.sync="addDialogVisible"
                width="35%"
            >
                <el-form ref="addRef" :model="addRoleInfor" label-width="80px">
                    <el-form-item label="角色名称">
                        <el-input v-model="addRoleInfor.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="addRoleInfor.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer"> 
                    <el-button type="primary" @click="confirmAdd">确 定</el-button>
                    <el-button @click="resetAdd">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 修改对话框 -->
            <el-dialog
                title="提示"
                :visible.sync="modifyDialogVisible"
                width="35%"
            >
                <el-form ref="modifyRef" :model="roleInfor" label-width="80px">
                    <el-form-item label="角色名称">
                        <el-input v-model="roleInfor.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="roleInfor.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer"> 
                    <el-button type="primary" @click="confirmModify">确 定</el-button>
                    <el-button @click="resetModify">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 分配权限对话框 -->
            <el-dialog
                title="提示"
                :visible.sync="deliverRolesDialogVisible"
                width="30%"
                @close="closeDeliverRolesDialo"
            >
                <el-tree :data="rightsList" :props="treeProps" 
                    show-checkbox 
                    node-key="id" 
                    default-expand-all
                    :default-checked-keys="defaultCheck"
                    ref="treeRef"
                ></el-tree>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmDeliverRoles">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        this.getrolesList();
    },
    data(){
        return {
            rolesList:[],
            rightsList:[],
            treeProps:{
                children: 'children',
                label: 'authName'
            },
            defaultCheck:[],
            roleId : '',
            roleInfor:{},
            addRoleInfor:{},
            addDialogVisible:false,
            deliverRolesDialogVisible:false,
            modifyDialogVisible:false
        }
    },
    methods:{
        /* 获取列表 */
        async getrolesList(){
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status != 200) return this.$message.error(res.meta.msg);
            this.rolesList = res.data;
        },
        /* 移除权限标签 */
        async removeTag(roleId,rightId) {
            const str = await this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            if(str !== 'confirm') return this.$message.error('删除取消');
            const {data:res} = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success('删除成功');
            this.getrolesList();
        },
        /* 分配权限列表 */
        async deliverRoles(scope){
            this.roleId = scope.id;
            const {data:res} = await this.$http.get('rights/tree');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.rightsList = res.data;
            this.getDefaultCheck(scope,this.defaultCheck);
            this.deliverRolesDialogVisible = true
        },
        async closeDeliverRolesDialo(){
            const key = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            const idStr = key.join(',');
            const {data :res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
            if(res.meta.status!== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.deliverRolesDialogVisible = false;
            this.getrolesList();
        },
        /* 确定分配权限 */
        confirmDeliverRoles(){
            this.deliverRolesDialogVisible = false;
        },
        /* 获取勾选的权限(递归) */
        getDefaultCheck(node,arr){
            if(!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(element => {
                this.getDefaultCheck(element,arr)
            });
        },
        /* 修改 */
        async modify(id){
            const {data:res} = await this.$http.get('roles/'+id);
            if(res.meta.status !==200) return this.$message.error('获取信息失败');
            this.roleInfor = res.data;
            this.modifyDialogVisible = true
        },
        async confirmModify(){
            const {data:res} = await this.$http.put('roles/' +this.roleInfor.roleId,this.roleInfor);
            if(res.meta.status !==200) return this.$message.error('修改信息失败');
            this.$message.success('修改信息成功');
            this.modifyDialogVisible = false;
            this.getrolesList();
        },
        resetModify(){
            this.$refs.modifyRef.resetFields();
            this.modifyDialogVisible = false;
        },
        /* 新增 */
        addRole(){
            this.addDialogVisible = true;
        },
        async confirmAdd(){
            const {data:res} = await this.$http.post('roles',this.addRoleInfor); 
            if(res.meta.status !==201) return this.$message.error('新增失败');
            this.$message.success('新增成功');
            this.addDialogVisible = false;
            this.getrolesList(); 
        },
        resetAdd(){
            this.$refs.addRef.resetFields();
            this.addDialogVisible = false;
        },
        /* 删除 */
        async deleteRole(id){
            const str =  await this.$confirm('确定删除此角色吗?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err=>err)
            if(str == 'cancel'){
                return this.$message.error('取消删除');
            }
            else if(str == 'confirm'){
                const {data:res} = await this.$http.delete('roles/'+id);
                if(res.meta.status !==200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.getrolesList(); 
            }
        }
    }
}
</script>

<style lang="less" scope>
    
    .el-table{
        margin-top: 20px!important;
    }
    .bb{
        border-bottom:1px solid #eee; 
    }
    .bt {
        border-top: 1px solid #eee;
    }
    .rowMarign{
        margin: 10px 0;
    }
    .tag {
        margin: 10px 0;
    }
    .tagRight {
        margin: 10px 8px 10px 0;
    }
    .el-icon-caret-right {
        margin-left:8px!important ;
    }
    .tagvcenter {
        display: flex;
        align-items: center;
    }
</style>
