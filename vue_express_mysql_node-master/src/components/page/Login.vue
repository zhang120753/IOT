<template>
  <div class="login-wrap">
    <div class="ms-title">设备指纹识别系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <!-- ref的引用是相当于一个DOM节点 -->
        <!-- el-form 提供了表单校验功能，
        model 属性用来指定表单使用的数据， 
        rules 属性设置校验规则，并通过 el-form-item 的 prop 属性绑定校验规则。
        -->
        <div v-if="errorInfo">
          <span>{{ errInfo }}</span>
        </div>
        <el-form-item prop="name">
          <!-- el-from-item 的 prop 属性必须与 el-input 中需要校验的表单属性一致。 -->
          <el-input v-model="ruleForm.name" placeholder="账号"></el-input>
          <!-- v-model必须和model一样 ruleForm -->
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
          <!-- 如果用了封装组件的话，比如element，这个时候使用按键修饰符需要加上.native -->
          <!-- 在密码栏目按回车可以登录 -->
        </el-form-item>
        <el-form-item prop="validate">
          <el-input v-model="ruleForm.validate" class="validate-code" placeholder="验证码"></el-input>
          <div class="code" @click="refreshCode">
            <!-- 点击刷新验证码 -->
            <s-identify :identifyCode="identifyCode"></s-identify>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script>
export default {
  name: 'login',
  data() {
    return {
      identifyCodes: '1234567890',//这种验证码就是数字的 如果写的是字母 就是 字母的
      identifyCode: '',
      errorInfo: false,
      ruleForm: {
        name: '',
        password: '',
        validate: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        validate: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    //最先执行钩子函数
    //在html页面加载完成后再出现
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4) //验证码取四位随意组合
  },
  methods: {
    submitForm(formName) {//formName=ruleForm(name,password,validate)
      const self = this
      self.$refs[formName].validate((valid) => {
        //通过this.$refs 可以访问到此vue实例中的所有设置了ref属性的DOM元素，并对其进行操作。
        //$refs 是一个对象，持有已注册过 ref 的所有的子组件。
        if (valid) {
          self.$http
            .post('/api/user/login', self.ruleForm) //调用后台接口userApi的login函数
            .then((response) => {
              console.log(response)
              if (response.data == -1) {
                self.errorInfo = true
                self.errInfo = '该用户不存在'
                console.log('该用户不存在')
              } else if (response.data == 0) {
                console.log('密码错误')
                self.errorInfo = true
                self.errInfo = '密码错误'
              } else if (response.status == 200) {
                self.$router.push('/readme') //路由跳转readme界面
                sessionStorage.setItem('ms_username', self.ruleForm.name)
                sessionStorage.setItem('ms_user', self.ruleForm)
                console.log(self.ruleForm)
              }
            })
            .then((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    //这个方法是刷新验证码 一般在验证码后面再跟个button
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      console.log(this.identifyCode)
    },
    //只要在1000毫秒之内，用户再次击键，就会取消上一次的定时器，然后再新建一个定时器。
    //这样就保证了回调函数之间的调用间隔，至少是1000毫秒。
    debounce(func, delay) {
      return function (args) {
        var _this = this
        var _args = args
        clearTimeout(func.id)
        func.id = setTimeout(function () {
          func.call(_this, _args)
        }, delay)
      }
    },
    submitDebounce(formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          localStorage.setItem('ms_username', self.ruleForm.name)
          localStorage.setItem('ms_user', self.ruleForm)//本地网页存储账号密码
          self.$http
            .post('/api/user/login', self.ruleForm)
            .then((response) => {
              console.log(response)
              if (response.data == -1) {
                self.errorInfo = true
                self.errInfo = '该用户不存在'
                console.log('该用户不存在')
              } else if (response.data == 0) {
                console.log('密码错误')
                self.errorInfo = true
                self.errInfo = '密码错误'
              } else if (response.status == 200) {
                self.$router.push('/readme')
              }
            })
            .then((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //设置一个门槛值1000ms，表示两次 Ajax 通信的最小间隔时间。
    //如果在间隔时间内，发生新的keyup事件，则不触发 Ajax 通信，并且重新开始计时。
    //如果过了指定时间，没有发生新的keyup（回车）事件，再将数据发送出去。
    debounceAjax() {
      debounce(submitDebounce,1000)
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../../../static/img/login.png);
  background-size: 100% auto;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -200px;
  text-align: center;
  font-size: 30px;
  color: #fff;
  font-family: Tahoma;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 240px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background-color: #00000080;
}
.ms-login span {
  color: red;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 50%;
  height: 36px;
  background: rgba(0, 0, 0, 0);
}
.code {
  width: 112px;
  height: 35px;
  border: 1px solid #ccc;
  float: right;
  border-radius: 2px;
}
.validate-code {
  width: 136px;
  float: left;
}
</style>