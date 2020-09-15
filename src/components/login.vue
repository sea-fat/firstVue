<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar">
                <img src="../assets/images/logo.png" alt="">
            </div>
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
</style>
