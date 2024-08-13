<template>
  <div>
    <div class="ms-doc">
      <h3>README.md</h3>
      <article>
        <h1>设备指纹识别系统</h1>
        <p>基于Vue.js 2.x系列 + Element UI + Node.js + MySQL的设备指纹识别系统</p>
        <h2>项目背景与目的</h2>
        <p>随着互联网的发展，移动设备和应用程序已经成为必不可少的东西，且各大设备程序的应用，使得网络安全成为一个炙手可热的问题。本课题便是基于网络安全所提出的问题，即基于主动扫描的物联网设备指纹识别。本系统的应用为了解设备所在网络的安全状况，可以预见性的判断出当前及未来可能存在的网络风险。</p>
        <p>With the development of the Internet, mobile devices and applications have become indispensable, and the application of major device programs has made network security a hot issue. This topic is based on the question raised by network security, that is, fingerprinting of IoT devices based on active scanning. The application of this system is to understand the security status of the network where the device is located, and to predict the current and future possible network risks.</p>

        <h2>扫描方式</h2>
        <el-checkbox disabled checked>主机端口扫描</el-checkbox>
        <br>
        <el-checkbox disabled checked>网卡选择扫描</el-checkbox>
        <br>
        <el-checkbox disabled checked>网段存活主机扫描</el-checkbox>
        <br>
        <el-checkbox disabled checked>两主机扫描对比</el-checkbox>
        <br>
        <el-checkbox disabled checked>主机漏洞扫描</el-checkbox>
        <br>
        <h2>最终项目的目录结构</h2>
        <div>
          <img src="../../../static/img/tree.png" alt="">
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {}
  }
}
</script>

<style scoped>
.ms-doc {
  width: 100%;
  max-width: 980px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
}
.ms-doc h3 {
  padding: 9px 10px 10px;
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  background-color: #f5f5f5;
  border: 1px solid #d8d8d8;
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
}
.ms-doc article {
  padding: 45px;
  word-wrap: break-word;
  background-color: #fff;
  border: 1px solid #ddd;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}
.ms-doc article h1 {
  font-size: 32px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
}
.ms-doc article h2 {
  margin: 24px 0 16px;
  font-weight: 600;
  line-height: 1.25;
  padding-bottom: 7px;
  font-size: 24px;
  border-bottom: 1px solid #eee;
}
.ms-doc article p {
  margin-bottom: 15px;
  line-height: 1.5;
}
.ms-doc article .el-checkbox {
  margin-bottom: 5px;
}
</style>