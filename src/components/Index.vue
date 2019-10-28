<template>
  <el-container class="index">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
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
  methods: {
    async logout () {
      try {
        await this.$confirm('亲,你确定要退出系统吗?', '温馨提示', {
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
        this.$message('取消退出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  .el-header {
    height: 60px;
    background: #d8d8d8;
    display: flex;
    .logo {
      height: 60px;
      width: 200px;
      img {
        height: 40px;
        margin: 10px 0;
      }
    }
    .logout {
      height: 60px;
      width: 200px;
      text-align: right;
      font-weight: 700;
      line-height: 60px;
      a {
        color: orange;
        text-decoration: none;
      }
    }
    .title {
      flex: 1;
      line-height: 60px;
      text-align: center;
      color: #545c64;
    }
  }
  .el-aside {
    width: 200px;
    background: #545c64;
    .el-menu  {
      border: none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
