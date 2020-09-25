<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" 
                    v-model="querryInfor.query" 
                    clearable
                    @clear="getProductList">
                        <el-button slot="append" icon="el-icon-search" @click="getProductList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addProduct">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 列表 -->
            <el-table
                :data="productList"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="#"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    width="450">
                </el-table-column>
                <el-table-column
                    prop="goods_price"
                    label="商品价格(元)"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="goods_weight"
                    label="商品重量"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="add_time"
                    label="创建时间"
                    width="150">
                    <template  v-slot="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProduct(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querryInfor.pagenum"
                :page-sizes="[5, 10, 30]"
                :page-size="querryInfor.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        
        

    </div>
</template>

<script>
export default {
    created(){
        this.getProductList();
    },
    data(){
        return{
            querryInfor:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            productList:[],
            total:0,
            
        }
    },
    methods:{
        /* 产品列表 */
        async getProductList(){
            const {data:res} = await this.$http.get('goods',{params:this.querryInfor});
            if(res.meta.status !== 200) return this.$message.error('列表加载失败');
            this.productList = res.data.goods;
            this.total = res.data.total;
        },
        /* 分页 */
        handleSizeChange(newSize){
            this.querryInfor.pagesize=newSize;
            this.getProductList();
        },
        handleCurrentChange(newSize){
            this.querryInfor.pagenum=newSize;
            this.getProductList();
        },
        /* 删除 */
        async deleteProduct(goodsId){
            const str =await this.$confirm('是否删除此商品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err); console.log(str)
            if(str == 'confirm') 
            {   const {data:res} = await this.$http.delete('goods/'+goodsId);
                if(res.meta.status !== 200) return this.$message.error('删除失败');
                this.$message.success('删除成功');
                this.getProductList();
                return;
            }else if(str == 'cancel') {
                return;
            }
        },
        /* 增加商品按钮 */
        addProduct(){
            this.$router.push('/goods/add')
        }
    }
}
</script>

<style lang="less" scope>
    
</style>
