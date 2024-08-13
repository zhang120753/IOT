<template>
    <div class="header">
        <div class="logo">物联网设备指纹识别系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    welcome {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: ''
            }
        },
        computed:{
            username(){
                let username=sessionStorage.getItem('ms_username');
                // localStorage 和 sessionStorage 属性允许在浏览器中存储 key/value 对的数据。
                // sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
                //如果你想在浏览器窗口关闭后还保留数据，可以使用 localStorage 属性， 该数据对象没有过期时间，除非手动去删除。
                return username ? username:this.username;
                //没有登陆就显示zhang
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.removeItem('ms_username')//退出时删除保存的用户名
                    this.$router.push('/login');//跳转到登陆界面
                } 
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 30px;
        font-size: 20px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        right:110px;
        top:16px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
</style>
