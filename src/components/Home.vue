<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="menushow?'65px':'200px'">
        <div
          style="background-color:rgb(74,80,100);color:rgb(255,255,255);height:25px;text-align:center;line-height:25px;
         font-size:12px;letter-spacing:0.4em;user-select:none;cursor:pointer;"
          @click="menushow=!menushow"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="menushow"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.id+''"
            v-for="(item,k) in menulist"
            :key="item.id"
            :style="menushow?'width:65px':'width:200px'"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      menulist: [],
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    //实现退出功能
    logout() {
      this.$confirm('确定退出账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //  清除token
          window.sessionStorage.removeItem('token')
          // 将页面返回登录页面
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    width: 100%;
    background-color: rgb(55, 61, 67);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    #logo-box {
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      img {
        margin-right: 10px;
        width: 50px;
        height: 50px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
