<template>
    <div>
        <el-card class="box-card">
            <!-- 导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 表格 -->
            <el-table
                :data="rightsList"
                border
                style="width: 100%"
                stripe
            >
                <el-table-column type="index" label="#"  width="200"></el-table-column>
                <el-table-column prop="authName"  label="权限名称"  width="300"></el-table-column>
                <el-table-column prop="path" label="路径" width="300"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template v-slot="scope">
                        <el-tag  v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="success" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        this.getRightsList();
    },
    data(){
        return {
            rightsList:[],
        }
    },
    methods:{
        async getRightsList(){
            const {data:res} = await this.$http.get('rights/list');
            if(res.meta.status != 200) return this.$message.error(res.meta.msg);
            this.rightsList = res.data;
        }
    }
}
</script>

<style lang="less" scope>
    
</style>
