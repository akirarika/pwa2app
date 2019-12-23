<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      这是一个利用
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">Vue CLI</a> 生成的渐进式 Web 应用，
      <br />用来作为
      <a href="https://github.com/akirarika/pwa2app" target="_blank" rel="noopener">pwa2app</a> 的演示。
    </p>
    <h3>访问域控制</h3>
    <ul>
      <li>
        <router-link to="/about">跳转到 About 路由</router-link>
      </li>
      <li>
        <a href="https://akirarika.github.io/pwa2app/hello.html" target="_blank" rel="noopener">跳转到此域下的另一个网页</a>
      </li>
      <li>
        <a href="https://m.bilibili.com/index.html" target="_blank" rel="noopener">跳转到 Bilibili</a>
      </li>
      <li>
        <a href="https://www.google.com/" target="_blank" rel="noopener">跳转到 Google</a>
      </li>
    </ul>
    <p>模板中实现了访问域控制功能，当网页跳转到你 pwa 域名之外的网址时，Webview 将会拦截此次跳转，改用用户默认浏览器来打开它。</p>

    <h3>Plus API 测试</h3>
    <ul>
      <li>
        <a href="javascript:;" @click="fingerprint">plus api 实现指纹识别</a>
      </li>
      <li>
        <a href="javascript:;" @click="copy">native.js 控制剪切板</a>
      </li>
    </ul>
    <p>
      在你的 pwa 网页里，你可以随意地使用
      <a href="http://www.html5plus.org/doc/h5p.html" target="_blank" rel="noopener">plus api</a>
      来实现一些 pwa 不能实现的功能，或使用
      <a href="https://ask.dcloud.net.cn/article/88" target="_blank" rel="noopener">native.js</a>
      直接操作原生对象。
    </p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  methods: {
    fingerprint() {
      if (!plus.fingerprint.isSupport()) alert("此设备不支持指纹识别")
      if (!plus.fingerprint.isKeyguardSecure()) alert("此设备未设置密码锁屏，无法使用指纹识别")
      if (!plus.fingerprint.isEnrolledFingerprints()) alert("此设备未录入指纹，请到设置中开启")
      plus.nativeUI.toast('来识别指纹吧~')
      // 自动调用指纹识别
      plus.fingerprint.authenticate(() => {
        plus.nativeUI.toast('指纹识别成功')
      }, (e) => {
        plus.nativeUI.alert('指纹识别失败(' + e.code + ')')
      })
      // iOS平台指纹识别提示框会阻塞界面操作，这里设置 10 秒后自动取消
      if('iOS' == plus.os.name) {
        setTimeout(() => {
          plus.fingerprint.cancel()
        }, 10000)
      }
    },
    copy() {
      plus.android.invoke(plus.android.runtimeMainActivity().getSystemService(plus.android.importClass("android.content.Context").CLIPBOARD_SERVICE),"setText","I'm copy from Native.js")
        plus.nativeUI.toast('复制成功')
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
