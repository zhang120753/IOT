<template>
  <div>
    <el-input v-model="input1" placeholder="请输入ip" ref="ip1" style="width: 200px; margin-top: 10px; margin-bottom: 10px"></el-input>
    <el-button type="primary" @click="search1()">点击扫描</el-button>
    <el-input v-model="input2" placeholder="请输入ip" ref="ip2" style="width: 200px; margin-left: 192px; margin-bottom: 10px"></el-input>
    <el-button type="primary" @click="search2()">点击扫描</el-button>
    <div class="table1">
      <el-table :data="tableData1" id="educe-table1" border style="width: 450px">
        <el-table-column prop="pc_status" label="主机状态"> </el-table-column>
        <el-table-column prop="port_num" label="端口号"> </el-table-column>
        <el-table-column prop="pc_proto" label="协议"> </el-table-column>
        <el-table-column prop="pc_state" label="状态"> </el-table-column>
        <el-table-column prop="pc_service" label="服务"></el-table-column>
        <el-table-column prop="pc_product" label="product"></el-table-column>
        <el-table-column prop="pc_cpe" label="cpe"></el-table-column>
        <el-table-column prop="pc_os" label="os"></el-table-column>
      </el-table>
    </div>
    <div class="table2">
      <el-table :data="tableData2" id="educe-table2" border style="width: 450px">
        <el-table-column prop="pc_status" label="主机状态"> </el-table-column>
        <el-table-column prop="port_num" label="端口号"> </el-table-column>
        <el-table-column prop="pc_proto" label="协议"> </el-table-column>
        <el-table-column prop="pc_state" label="状态"> </el-table-column>
        <el-table-column prop="pc_service" label="服务"></el-table-column>
        <el-table-column prop="pc_product" label="product"></el-table-column>
        <el-table-column prop="pc_cpe" label="cpe"></el-table-column>
        <el-table-column prop="pc_os" label="os"></el-table-column>
      </el-table>
    </div>
    <el-button type="primary" @click="out1" style="margin-top: 10px">导出表格</el-button>
    <el-button type="primary" @click="out2" style="margin-top: 10px; margin-left: 397px">导出表格</el-button>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  name: 'search',
  data() {
    return {
      input1: '',
      input2: '',
      tableData1: [],
      tableData2: []
    }
  },
  methods: {
    out1() {
      const XLSX = require('xlsx')
      // 1.生成Excel工作簿对象
      var wb = XLSX.utils.table_to_book(document.querySelector('#educe-table1'))
      // 2.手机号，身份证号等会默认使用科学计数法表示，则需要这样设置
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#educe-table1'),
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
          '主机1端口扫描结果.xlsx'
        )
      } catch (e) {
        if (typeof console != 'undefined') console.log(e, wbout)
      }
      // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
      return wbout
    },
    out2() {
      const XLSX = require('xlsx')
      // 1.生成Excel工作簿对象
      var wb = XLSX.utils.table_to_book(document.querySelector('#educe-table2'))
      // 2.手机号，身份证号等会默认使用科学计数法表示，则需要这样设置
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#educe-table2'),
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
          '主机2端口扫描结果.xlsx'
        )
      } catch (e) {
        if (typeof console != 'undefined') console.log(e, wbout)
      }
      // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
      return wbout
    },
    search1: function () {
      const self = this
      let username = sessionStorage.getItem('ms_username')
      var ip = self.$refs.ip1.value
      console.log(ip)
      self.$http
        .post('/api/nmap/search', { ip, username }, { emulateJSON: true })
        .then(function (res) {
          if (res == []) self.$message.err('扫描失败')
          else self.$message.success('扫描成功')
          self.tableData1 = []
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            self.tableData1.push(res.data[i])
          }
        })
    },
    search2: function () {
      const self = this
      var ip = self.$refs.ip2.value
      let username = sessionStorage.getItem('ms_username')
      console.log(ip)
      self.$http
        .post('/api/nmap/search', { ip, username }, { emulateJSON: true })
        .then(function (res) {
          if (res == []) self.$message.err('扫描失败')
          else self.$message.success('扫描成功')
          self.tableData2 = []
          console.log(res.data) //几个array  array(2)
          for (var i = 0; i < res.data.length; i++) {
            self.tableData2.push(res.data[i])
            // console.log(self.tableData);
          }
        })
    }
  }
}
</script>

<style scoped>
.table2 {
  position: absolute;
  left: 530px;
  /* bottom: 250px; */
  top: 95px;
}
</style>
