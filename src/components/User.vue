<template>
  <!-- 盒子区域 -->
  <div>
    <!-- 上部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框键钮部位 :gutter="20"表示总共有多少   :span="8"表示占据多少份-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfo"
            @keyup.enter.native="getUserInfo"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 绘制table表格 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdiDialog(info.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>

            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>

      <!-- 添加用户哦弹出的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户弹出的对话框 -->
      <el-dialog title="修改用户" :visible.sync="ediDialogVisible" width="50%" @close="ediDialogClose">
        <el-form :rules="ediFormRules" ref="ediFormRef" :model="ediForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ediForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ediForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="ediForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ediDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ediUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfo()
  },
  data() {
    // 设置自定义校验规则
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      //设置修改用户弹窗出现的数据
      ediDialogVisible: false,
      // 设置增加用户弹窗出现的数据
      addDialogVisible: false,
      // 修改需要的数据
      ediForm: {
        username: '',
        email: '',
        mobile: ''
      },
      //增加用户需要的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 设置修改用户校验规则
      ediFormRules: {
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //设置增加用户校验规则
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      userInfos: [],
      querycdt: {
        // 查询关键字
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示条数
        pagesize: 3,
        //总页数
        tot: 0
      }
    }
  },
  methods: {
    // 修改数据的api接口及方法
    ediUser(){
      // 业务逻辑1.验证表单数据 2.发送请求 3.请求成功(关闭弹窗,刷新页面,显示成功信息)
          this.$refs.ediFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put('users', this.ediForm.id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          //    添加成功  关闭弹窗 ,成功提示,重新渲染页面
          this.ediDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfo()
        }
      })
    },
    // 获取修改数据的api接口及方法
    async showEdiDialog(id) {
      //思路:1.让对话框显示 2.请求数据 3.渲染到页面
      this.ediDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.ediForm = res.data
    },
    //删除数据的方法
    delUser(id) {
      this.$confirm('确定删除该用户吗?', '是否删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //   发送请求
          const { data: res } = await this.$http.delete('users/' + id)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          //   删除成功,消息提示  重新渲染页面
          this.$message.success(res.meta.msg)
          this.getUserInfo()
        })
        .catch(() => {})
    },
    //   增加用户数据方法
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          //    添加成功  关闭弹窗 ,成功提示,重新渲染页面
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfo()
        }
      })
    },
    //   重置修改用户表单后数据清空
    ediDialogClose() {
      this.$refs.ediFormRef.resetFields()
    },
    //   重置增加用户表单数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户状态
    async changeState(uid, state) {
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 每页信息条数变化的事件函数
    handleSizeChange(age) {
      this.querycdt.pagesize = age
      //重新根据条件获取数据
      this.getUserInfo()
    },
    //当前页码变化事件函数回调
    handleCurrentChange(age) {
      this.querycdt.pagenum = age
      // 根据条件重新获取数据
      this.getUserInfo()
    },
    async getUserInfo() {
      const { data: res } = await this.$http.get('users', {
        params: this.querycdt
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userInfos = res.data.users
      this.querycdt.tot = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
</style>
