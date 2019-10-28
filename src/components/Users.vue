<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加用户按钮 -->
     <el-button plain type="success">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList">
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="用户状态" prop="mg_state">
        <template v-slot:default="{row}">
          <el-switch
            @change="changeState(row.id,row.mg_state)"
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="small" type="danger" icon="el-icon-delete" @click="delUser(row.id)"></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取数据列表
    async getUserList () {
      try {
        const { data, meta } = await this.$axios.get('users', {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.userList = data.users
          this.total = data.total
          console.log(data)
          console.log(this.userList)
        } else {
          this.$message(meta.$message)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 修改用户状态
    async changeState (id, type) {
      try {
        const { meta } = await this.$axios.put(`users/${id}/state/${type}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.success(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分页功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 删除功能
    async delUser (id) {
      try {
        await this.$confirm('亲,你确定要删除么', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
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
  .users {
    .input-with-select {
      width: 300px;
      margin-bottom: 10px;
      margin-right: 20px;
    }
  }
</style>
