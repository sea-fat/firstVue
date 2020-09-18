<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar">
                <img src="../assets/images/logo.png" alt="">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password" >
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item>
                    <div class="btn">
                        <el-button type="primary" class="l" @click="login">登录</el-button>
                        <el-button type="info" class="r" @click="reset">重置</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{
                username:'admin',
                password:'123456'
            },
            loginFormRules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        reset(){
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            this.$refs.loginFormRef.validate(async val=>{
                if(!val) return;
                const {data:res} = await this.$http.post('login',this.loginForm);
                if(res.meta.status!=200) return this.$message.error('登录失败');
                
                window.sessionStorage.setItem('token',res.data.token);
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scope>
    .login_container {
        width: 100%;
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        .avatar{
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 130px;
            height: 130px;
            padding: 10px;
            background-color: #fff;
            border: 1px solid #eee;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    .form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
     
       .btn {
           position: relative;
           width: 100%;
           height: 41px;
           .l,.r {
               position: absolute;
               left: 50%;
           }
           .l {
               transform: translateX(-150%);
           }
           .r{
               transform:translateX(30%);
           }
       }
    }
    .el-input__prefix {
           left: 10px!important;
       }
</style>
