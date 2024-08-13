<template>
  <div>
    <div class="form">
      <el-input v-model="input1" placeholder="请输入网卡，如:eth0" ref="cardid" style="width: 500px; margin-bottom: 10px; margin-top: 10px"></el-input>
      <el-button type="primary" @click="knowcard()">点击获取本机网卡</el-button>
      <el-input v-model="input2" placeholder="请输入网段、主机，如:192.168.0.0/24、127.0.0.1" ref="ip" style="width: 500px; margin-bottom: 10px"></el-input>
      <el-button type="primary" style="margin-bottom: 10px" @click="searchall()">点击扫描</el-button>
      <el-button type="primary" style="margin-bottom: 10px; margin-left: 20px" @click="history()">历史记录</el-button>
      <el-table :data="tableData1" id="educe-table1" border style="width: 100%; margin-bottom: 10px">
        <el-table-column prop="dev" label="DEV"> </el-table-column>
        <el-table-column prop="short" label="SHORT"></el-table-column>
        <el-table-column prop="ip" label="IP/MASK"> </el-table-column>
        <el-table-column prop="type" label="TYPE"> </el-table-column>
        <el-table-column prop="up" label="UP"> </el-table-column>
        <el-table-column prop="mtu" label="MTU"> </el-table-column>
        <el-table-column prop="mac" label="MAC"> </el-table-column>
      </el-table>
      <el-button type="primary" @click="out1" style="margin-top: 10px; margin-bottom: 10px">导出表格</el-button>
      <el-table :data="tableData2" ref="table" id="educe-table2" border style="width: 100%">
        <el-table-column prop="ipv4" label="ipv4"></el-table-column>
        <el-table-column prop="mac" label="MAC"> </el-table-column>
        <el-table-column prop="port_num" label="端口号"> </el-table-column>
        <el-table-column prop="pc_proto" label="协议"> </el-table-column>
        <el-table-column prop="pc_service" label="服务"> </el-table-column>
        <el-table-column prop="pc_state" label="端口状态"> </el-table-column>
        <el-table-column prop="pc_vendor" label="vendor"> </el-table-column>
      </el-table>
    </div>
    <el-button type="primary" @click="out2" style="margin-top: 10px">导出表格</el-button>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  data() {
    return {
      input1: '',
      input2: '',
      tableData1: [],
      tableData2: []
    }
  },
  methods: {
    history: function () {
      //从数据库调用历史记录
      const self = this
      let username = sessionStorage.getItem('ms_username')
      self.$http
        .post('/api/card/history', { username }, { emulateJSON: true }) //调用后台接口cardApi的history函数，向后台传ip
        .then(function (res) {
          if (res == []) self.$message.err('没有记录')
          //返回为空，失败
          else self.$message.success('调用成功')
          self.tableData2 = []
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            res.data[i] = {
              //将接收的数据重新封装成表格的字段格式
              ipv4: res.data[i].ip,
              mac: res.data[i].mac,
              port_num: res.data[i].port,
              pc_proto: res.data[i].protocol,
              pc_service: res.data[i].service,
              pc_state: res.data[i].state,
              pc_vendor: res.data[i].vendor
            }
            self.tableData2.push(res.data[i]) //将数据输入表格
          }
        })
    },
    knowcard: function () {
      //查看本机网卡
      const that = this
      that.$http
        .post('/api/card/knowcard', { emulateJSON: true }) //调用后台接口cardApi的knowcard函数
        .then(function (res) {
          that.tableData1 = []
          for (var i = 0; i < res.data.length; i++) {
            that.tableData1.push(res.data[i]) //将数据输入表格
          }
        })
    },
    searchall: function () {
      //用指定网卡扫描ip
      const self = this
      var cardid = self.$refs.cardid.value
      var ip = self.$refs.ip.value
      let username = sessionStorage.getItem('ms_username')
      console.log(cardid)
      console.log(ip)
      self.$http
        .post(
          '/api/card/searchall',
          { cardid, ip, username },
          { emulateJSON: true }
        ) //调用后台接口cardApi的searchlive函数，向后台传ip和网卡号
        .then(function (res) {
          self.tableData2 = []
          for (var i = 0; i < res.data.length; i++) {
            self.tableData2.push(res.data[i]) //将数据输入表格
          }
        })
    },
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
          '主机网卡列表.xlsx'
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
          '网卡扫描结果.xlsx'
        )
      } catch (e) {
        if (typeof console != 'undefined') console.log(e, wbout)
      }
      // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
      return wbout
    }
  }
}
</script>

<style scoped>
</style>