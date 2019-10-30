<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain class="addBtn">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList">
       <el-table-column type="expand"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="small" icon="el-icon-edit"></el-button>
        <el-button type="danger" plain size="small" icon="el-icon-delete"></el-button>
        <el-button type="success" plain size="small" icon="el-icon-check">分配角色</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      try {
        const { meta, data } = await this.$axios.get('roles')
        if (meta.status === 200) {
          this.roleList = data
          console.log(this.roleList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .roles {
    .addBtn {
      margin-bottom: 10px;
    }
  }
</style>
