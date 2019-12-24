<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
export default {
  created() {
    document.addEventListener("plusready", () => {
      const world = plus.webview.currentWebview() // 获取当前 webview 对象
      const mainActivity = plus.android.runtimeMainActivity() // 你 Android 程序的 mainActivity

      // 应用加载完成时，调用此函数来显示 webview 隐藏加载状态
      // 不调用的话你的应用会永远加载喔，一开始就调用的话会显示白屏和加载部分，体验不好
      setTimeout(() => {
        world.show();
      }, 233);

      // 处理 android 机器上的返回键
      if ("Android" == plus.os.name) {
        plus.key.addEventListener("backbutton", () => {
          // 监听用户返回键
          world.canBack(e => {
            if (e.canBack) this.$router.go(-1) // 如果可以返回就返回上一页 (这里是vue写法)
            // if (e.canBack) history.back() // 原生的返回上一页
            else mainActivity.moveTaskToBack(false) // 如果不能返回，就回保留后台回到桌面（而不是销毁）
            // else plus.runtime.quit() // 如果想销毁而不是保留后台，则使用此代码
          })
        })
      }
    })
  }
};
</script>