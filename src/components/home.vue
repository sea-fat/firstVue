<template>
 
      <!-- <el-button type="info" @click="logingOut">退出</el-button> -->
        <el-container class="home_container">
            <!-- 头部 -->
            <el-header>
                <h2>电商管理系统</h2>
                  <el-button type="info" @click="loginOut">退出</el-button>
            </el-header>
            <el-container>
                <!--侧边  -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle-btn" @click="toggleCollapse">|||</div>
                    <el-menu 
                    background-color=#333744 
                    text-color="#fff" 
                    active-text-color="#409bff" 
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition=false
                    :router=true
                    :default-active="activePath"
                    >
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                            <template slot="title">
                            <i :class=iconsObj[item.id]></i>
                            <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item-group>
                                <el-menu-item :index="'/'+cItem.path" v-for="cItem in item.children" :key="cItem.id" @click="saveNavPath('/'+cItem.path)">
                                    <template slot="title">
                                        <i class="el-icon-menu"></i>
                                        <span>{{cItem.authName}}</span>
                                    </template>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 主体 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    
</template>

<script>
export default {
    created(){
        this.getMenuList()
    },
    data(){
        return{
            menuList:[],
            iconsObj:{
                "125":'iconfont icon-users',
                "103":'iconfont icon-tijikongjian',
                "101":'iconfont icon-shangpin',
                "102":'iconfont icon-danju',
                "145":'iconfont icon-baobiao'
            },
            isCollapse:false,
            activePath: window.sessionStorage.getItem('activePath')
        }
    },
    methods:{
        loginOut(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data:res} = await this.$http.get('menus');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menuList = res.data;
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        saveNavPath(activePath) {
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scope>
    .home_container {
        height: 100%;
    }
    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #373d41;
        color: #ffffff;
    }
    .el-aside {
        background-color: #333744;
        .el-menu {
        border-right:none
        }
        .toggle-btn {
        padding: 5px 0;
        background-color: #4A5064;
        text-align: center;
        letter-spacing: 0.2em;
        color: #fff;
        cursor: pointer;
        }
        .iconfont{
        margin-right: 10px;
        font-size: 20px;
    }
    }
    .el-main {
        background-color: #eaedf1;
    }
    
    
    
</style>
