<template>
  <div>
    <div class="single">常见端口扫描参数选择</div>
    <el-input v-model="input" placeholder="请输入ip" ref="ip" style="width: 300px; margin-top: 10px; margin-bottom: 10px"></el-input>
    <el-select v-model="value" placeholder="请选择" ref="op" style="width: 300px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" style="margin-bottom: 10px" @click="searchparam()">点击扫描</el-button>
    <el-button type="primary" style="margin-bottom: 10px" @click="history()">历史记录</el-button>
    <el-table :data="tableData" ref="table" id="educe-table" border style="width: 100%">
      <el-table-column prop="pc_status" label="主机状态"> </el-table-column>
      <el-table-column prop="port_num" label="端口号"> </el-table-column>
      <el-table-column prop="pc_proto" label="协议"> </el-table-column>
      <el-table-column prop="pc_state" label="状态"> </el-table-column>
      <el-table-column prop="pc_service" label="服务"> </el-table-column>
      <el-table-column prop="pc_product" label="product"> </el-table-column>
      <el-table-column prop="pc_cpe" label="cpe"> </el-table-column>
      <el-table-column prop="pc_os" label="os"> </el-table-column>
    </el-table>
    <el-button type="primary" @click="out" style="margin-top: 10px">导出表格</el-button>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  data() {
    return {
      input: '',
      options: [
        {
          value: '-sS',
          label: '-sS(使用TCP SYN scans半开连接扫描)'
        },
        {
          value: '-sU',
          label: '-sU(使用UDP数据包扫描)'
        },
        {
          value: '-sT',
          label: '-sT(使用TCP Connect扫描)'
        },
        {
          value: '-sA',
          label: '-sA(使用TCP ACK扫描)'
        },
        {
          value: '-sV',
          label: '-sV(扫描服务及版本)'
        },
        {
          value: '-v',
          label: '-v(扫描进程详细信息)'
        },
        {
          value: '-O',
          label: '-O(扫描操作系统、开放端口)'
        }
      ],
      value: '',
      tableData: []
    }
  },
  methods: {
    history: function () {
      const self = this
      var ip = self.$refs.ip.value
      var op = self.$refs.op.value
      let username = sessionStorage.getItem('ms_username')
      console.log(ip)
      console.log(op)
      self.$http
        .post(
          '/api/option/history',
          { ip, op, username },
          { emulateJSON: true }
        )
        .then(function (res) {
          if (res == []) self.$message.err('没有记录')
          else self.$message.success('调用成功')
          self.tableData = []
          console.log(res.data) //几个array  array(36)
          for (var i = 0; i < res.data.length; i++) {
            res.data[i] = {
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
          '参数选择扫描结果.xlsx'
        )
      } catch (e) {
        if (typeof console != 'undefined') console.log(e, wbout)
      }
      // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
      return wbout
    },
    searchparam: function () {
      const self = this
      var ip = self.$refs.ip.value
      var op = self.$refs.op.value
      let username = sessionStorage.getItem('ms_username')
      console.log(ip)
      console.log(op)
      self.$http
        .post(
          '/api/option/searchparam',
          { ip, op, username },
          { emulateJSON: true }
        )
        .then(function (res) {
          if (res == []) self.$message.err('扫描失败')
          else self.$message.success('扫描成功')
          self.tableData = []
          console.log(res.data)
          console.log(res.length)
          for (var i = 0; i < res.data.length; i++) {
            self.tableData.push(res.data[i])
          }
        })
    }
  }
}
</script>

<style>
.userContent {
  width: 400px;
  margin: 0 auto;
}
.single {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
  /* padding: 30px; */
}
</style>