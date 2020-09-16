<template>
    <div>
      <el-button type="info" @click="logingOut">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        logingOut:function(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scope>
    
</style>
