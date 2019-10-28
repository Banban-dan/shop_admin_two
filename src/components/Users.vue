<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select" @keyup.enter.native="search">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <!-- 添加用户按钮 -->
     <el-button plain type="success" @click="showAddDialog">添加用户</el-button>
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
          <el-button plain size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(row)"></el-button>
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
    <!-- 添加对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%" @close="closeDialog">
        <!-- 添加表单 -->
        <el-form ref="addform" :model="addform" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" v-model="addform.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="addform.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="addform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input placeholder="请输入手机" v-model="addform.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="editDialogVisible"
        width="40%">
        <!-- 添加表单 -->
        <el-form ref="editform" :model="editform" :rules="rules" label-width="80px">
          <el-form-item label="用户名">
            <el-tag type="info">{{ editform.username }}
            </el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="editform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input placeholder="请输入手机" v-model="editform.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
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
      total: 0,
      addDialogVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机', trigger: ['blur', 'change'] }
        ]
      },
      editDialogVisible: false,
      editform: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      }
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
            pagesize: this.pagesize,
            query: this.query
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
    },
    // 搜索功能
    search () {
      this.getUserList()
    },
    // 显示添加对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加用户
    async addUser () {
      try {
        await this.$refs.addform.validate()
        const { meta } = await this.$axios.post('users', this.addform)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.addDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msgf)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭对话框时清空form
    closeDialog () {
      this.$refs.addform.resetFields()
    },
    // 显示编辑对话框
    showEditDialog (row) {
      console.log(row)
      this.editDialogVisible = true
      this.editform.username = row.username
      this.editform.mobile = row.mobile
      this.editform.email = row.email
      this.editform.id = row.id
    },
    // 修改用户
    async editUser () {
      try {
        await this.$refs.editform.validate()
        const { meta } = await this.$axios.put(`users/${this.editform.id}`, this.editform)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.message.error(meta.msg)
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
