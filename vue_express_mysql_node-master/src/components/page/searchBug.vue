<template>
  <div>
    <div class="bug">
      <el-input v-model="input" placeholder="请输入ip" ref="ip" style="width:500px;margin-top:10px;"></el-input>
      <el-button type="primary" style="margin-bottom:10px;" @click="bug()">点击扫描</el-button>
      <el-button type="primary" @click="history()">历史记录</el-button>
      <el-table :data="tableData" ref="table" id="educe-table" style="width: 100%;">
        <el-table-column prop="name" label="漏洞名称">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
      </el-table>
    </div>
    <el-button type="primary" @click="out" style=" margin-top: 10px;">导出表格</el-button>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  data() {
    return {
      input: '',
      tableData: []
    }
  },
  methods: {
    history: function () {
      const self = this
      var ip = self.$refs.ip.value
      console.log(ip)
      let username = sessionStorage.getItem('ms_username')
      self.$http
        .post('/api/bug/history', { ip, username }, { emulateJSON: true })
        .then(function (res) {
          if (res == []) self.$message.err('没有记录')
          else self.$message.success('调用成功')
          self.tableData = []
          console.log(res.data[0]) //几个array  array(36)
          for (var i = 0; i < res.data.length; i++) {
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
          '主机漏洞扫描结果.xlsx'
        )
      } catch (e) {
        if (typeof console != 'undefined') console.log(e, wbout)
      }
      // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
      return wbout
    },
    bug: function () {
      const self = this
      var ip = self.$refs.ip.value
      let user = sessionStorage.getItem('ms_username')
      console.log(ip)
      self.$http
        .post('/api/bug/searchbug', { user, ip }, { emulateJSON: true })
        .then(function (res) {
          if (res == []) self.$message.err('扫描失败')
          else self.$message.success('扫描成功')
          self.tableData = []
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            self.tableData.push(res.data[i])
            console.log(self.tableData)
          }
        })
    }
  }
}
</script>

<style>
</style>