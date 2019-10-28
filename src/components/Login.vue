<template>
  <div class="login">
    <el-form :model="form" label-width="80px" :rules="rules" ref="form" status-icon>
      <img src="../assets/timg.gif" alt="" class="img">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      this.$refs.form.validate(isvalid => {
        if (!isvalid) return
        this.$axios({
          method: 'post',
          url: 'login',
          data: this.form
        }).then(res => {
          const { meta, data } = res
          // console.log(res)
          localStorage.setItem('token', data.token)
          if (meta.status === 200) {
            this.$message({
              message: '恭喜你，登录成功',
              type: 'success'
            })
            this.$router.push('index')
          } else {
            this.$message.error(meta.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .login {
    background-color: #2d434c;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .el-form {
      background-color: #fff;
      width: 400px;
      padding: 20px;
      padding-top: 70px;
      margin: 0 auto;
      margin-top: 200px;
      border-radius: 20px;
      position: relative;
      .img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -75px;
      }
      .loginBtn {
        margin-right: 50px;
      }
    }
  }
</style>
