<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar">
                <img src="../assets/images/logo.png" alt="">
            </div>
            <el-form label-width="0" class="form">
                <!-- 用户名 -->
                <el-form-item >
                    <el-input></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item >
                    <el-input></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item >
                    <el-button type="primary" class="l">登录</el-button>
                    <el-button type="info" class="r">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    
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
        
        
    }
</style>
