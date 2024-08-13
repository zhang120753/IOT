<template>
  <div>
    <el-input v-model="input" placeholder="请输入ip" ref="ip" style="width: 500px; margin-top: 10px; margin-bottom: 10px"></el-input>
    <el-button type="primary" @click="search()">点击扫描</el-button>
    <el-button type="primary" @click="history()">历史记录</el-button>
    <el-table :data="tableData" ref="table" id="educe-table" border style="width: 100%">
      <el-table-column prop="pc_status" label="主机状态"> </el-table-column>
      <el-table-column prop="port_num" label="端口号"> </el-table-column>
      <el-table-column prop="pc_proto" label="协议"> </el-table-column>
      <el-table-column prop="pc_state" label="状态"> </el-table-column>
      <el-table-column prop="pc_service" label="服务"></el-table-column>
      <el-table-column prop="pc_product" label="product"></el-table-column>
      <el-table-column prop="pc_cpe" label="cpe"></el-table-column>
      <el-table-column prop="pc_os" label="os"></el-table-column>
    </el-table>
    <el-button type="primary" @click="out" style="margin-top: 10px">导出表格</el-button>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  name: 'search',
  data() {
    return {
      input: '',
      tableData: []
    }
  },
  methods: {
    search: function () {
      let username = sessionStorage.getItem('ms_username')
      //主机端口扫描
      const self = this
      var ip = self.$refs.ip.value
      console.log(ip)
      self.$http
        .post('/api/nmap/search', { ip, username }, { emulateJSON: true }) //调用后台接口nmapApi的search函数，向后台传ip
        .then(function (res) {
          if (res == []) self.$message.err('扫描失败')
          else self.$message.success('扫描成功')
          self.tableData = []
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            self.tableData.push(res.data[i]) //将数据输入表格
          }
        })
    },
    history: function () {
      //查看数据库历史记录
      const self = this
      var ip = self.$refs.ip.value
      console.log(ip)
      let username = sessionStorage.getItem('ms_username')
      self.$http
        .post('/api/nmap/history', { ip, username }, { emulateJSON: true }) //调用后台接口nmapApi的history函数，向后台传ip
        .then(function (res) {
          if (res == []) self.$message.err('没有记录')
          else self.$message.success('调用成功')
          self.tableData = []
          console.log(res.data[0])
          for (var i = 0; i < res.data.length; i++) {
            res.data[i] = {
              //将接收的数据重新封装成表格的字段格式
              pc_status: res.data[i].status,
              port_num: res.data[i].port,
              pc_proto: res.data[i].protocol,
              pc_state: res.data[i].state,
              pc_service: res.data[i].service,
              pc_product: res.data[i].product,
              pc_cpe: res.data[i].cpe,
              pc_os: res.data[i].os
            }
            self.tableData.push(res.data[i])
          }
        })
    },
    out() {
      const XLSX = require('xlsx')
      // 1.生成Excel工作簿对象
      var wb = XLSX.utils.table_to_book(document.querySelector('#educe-table'))
      // 2.手机号，身份证号等会默认使用科学计数法表示，则需要这样设置
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#educe-table'),
        { raw: true }
      )
      // 获取二进制字符串作为输出
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        book: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob: 对象表示一个不可变 原始数据的类文件对象,不一定是JS原生格式的数据。
          // File: 基于Blob，继承了blob的功能并将其扩展使其支持用户系统上的文件。
          new Blob([wbout], { type: 'appliction/octet-stream' }),
          // 设置导出的文件名称可随意
          '主机端口扫描结果.xlsx'
        )
      } catch (e) {
        if (typeof console != 'undefined') console.log(e, wbout)
      }
      // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
      return wbout
    }
    // inmysql: function () {
    //   const self = this;
    //   var ip = self.$refs.ip.value;
    //   console.log(ip);
    //   var table = self.$refs.table.data;
    //   self.$http
    //     .post("/api/nmap/inmysql", { ip, table }, { emulateJSON: true }) //调用后台接口nmapApi的inmysql函数，向后台传table表格的数据
    //     .then(function (res) {
    //       if (res.data == 1) self.$message.success("导入成功");
    //       else self.$message.err("导入失败");
    //     });
    // },
  }
}
</script>


<style scoped>
.content-title {
  /* font-weight: 400; */
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>