# pwa2app

渐进式 web 应用封装为移动应用的最佳实践。 [Demo (Android 版本)](https://raw.githubusercontent.com/akirarika/pwa2app/master/demo.apk)

## 选型

实现将 pwa 封装为 app，我的想法是，在原生应用首页放置一个全屏的 webview 控件，在这个控件中打开网络上的 pwa 应用 (就像一个全屏的浏览器那样)，同时，提供一些 api 来做一些 pwa 做不到的事情，代码尽可能地放在 pwa 端来编写。

接下来就是选择一款跨平台 App 开发框架，来实现这个想法了！但做出这个选择却并不轻松。

我起初想用 [Cordova](https://cordova.apache.org/) 来实现需求，遗憾的是，Cordova 在离线状态下会粗暴地弹出无法访问对话框。

接着尝试过用 [React Native](https://facebook.github.io/react-native/), [Weex](https://weex.apache.org/), [Flutter](https://flutter.dev/) 等跨平台框架，但他们的 webview 都有各种各样的问题 (其中 Weex 过于简洁而 Flutter bug 颇多)，而且实现一些偏底层的功能封装度不够。

最后我选择了 [Uni App](https://uniapp.dcloud.io/) 作为 pwa 应用的"壳"，它有以下优点：

1. 云打包功能可无需配置各平台的原生开发编译环境 (有人会担心代码安全性问题，这个见仁见智)

2. [plus api](https://www.html5plus.org/doc/) 和 [native.js](https://ask.dcloud.net.cn/article/88) 可以很轻松地实现许多原生应用才能实现的功能。

3. 能将代码尽可能多地放在 pwa 端，而不是塞在 app 的壳里。

## 入门

这个仓库不是一个拥有恐怖代码行数的二次封装的框架，而是一份在 uni-app 中运行 pwa 应用的最佳实践 (大概)。一份详尽的指北和对 pwa 应用友好的默认配置，以及一个开箱即用的脚手架，是这个仓库所提供的。

开始之前，由于 uni-app 需要使用 [HbuilderX 编辑器](https://www.dcloud.io/hbuilderx.html) 才能工作，所以请先下载和安装 (所以请下载 Alpha 版本，因为我们将要用到一些实验特性)

如果你是 linux 用户或讨厌不喜欢 HbuilderX，可参阅 [通过 cli 创建 uni-app](https://uniapp.dcloud.io/quickstart?id=_2-%e9%80%9a%e8%bf%87vue-cli%e5%91%bd%e4%bb%a4%e8%a1%8c) 和 [uni-app 离线打包](https://ask.dcloud.net.cn/article/35139) 两份文档。

```shellscript
git clone https://github.com/akirarika/pwa2app.git
```

1. 用 HBuilderX 打开 `pwa2app/src` 目录，下文中的路径均以此为根目录

2. 打开 `/app/main.nvue` 找到 `data` 部分，修改以下键的值为你想要的

```javascript
data: {
    url: '你的渐进式 web 应用的网址',
    loadingImage: '加载中的 loading 图，必须放在 static 目录下',
    loadingFirstText: '首次启动的提示文字',
    loadingText: '非首次启动的提示文字',
},
```

3. 打开一个 Android 模拟器或用手机连接电脑，之后状态栏单击 `运行` => `运行到手机或模拟器`

## 打包

打开 `/manifest.json`: `基础配置` => `uni-app应用标识(AppID)` => 点击 `重新获取`

在 `/manifest.json` 中修改应用名称、描述、图标等为你想要的。**但不要修改启动图片**，原因下文会解释。

单击 `发行` => `原生App-云打包`，修改 `包名` 和 `证书`，之后点确定，耐心等待云打包完成。

## pwa 端适配

### 显示 webview

为了避免白屏闪烁和 dom 绘制过程的布局变动~~导致被用户看穿你实际上是个网页~~，你需要在你 pwa 端的首页的合适时机运行以下代码：

```javascript
document.addEventListener("plusready", () => { // 当网页是在 app 中打开时此事件会被触发，在触发之后你才可以使用 plus api 和 native.js
    // 获取当前 webview 对象
    const world = plus.webview.currentWebview()
    // 应用加载完成时，调用此函数来显示 webview
    // 不调用的话你的应用会永远显示在加载喔，一开始就调用的话会显示白屏和 dom 加载过程，体验不好
    world.show()
})
```

### Android 端返回键适配 + 不退出改为保留后台

Android 端有返回键，但默认的返回键行为和浏览器的回退键不一致，所以需要在 pwa 端**全局**监听用户的返回键：

```javascript
document.addEventListener("plusready", () => { // 当网页是在 app 中打开时此事件会被触发，在触发之后你才可以使用 plus api 和 native.js
    if ("Android" == plus.os.name) {
    const mainActivity = plus.android.runtimeMainActivity() // 你 Android 程序的 mainActivity
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
```

## 常见问题

### plus.webview 的问题

plus.webview 中注入 css 和 js 的功能在无网状态下会失效，许多和生命周期相关的事件在无网状态下也不会触发或者错误触发。所以，最好不要使用它们。


### 为什么不直接在 `manifest.json` 里填写 pwa 网址？

一开始我也是这么做的，但直接在 `manifest.json` 将 uni-app 首页改为 pwa 的网址的话，冷启动速度会长达 6 秒。

web 本身就比原生速度慢很多，网络上的 web 页面也远比本地的 web 页面慢的多，两个原因导致了此情况。

因此我把首屏更换成 nvue 页面 (指 `/app/main.nvue`)，同时在 `manifest.json` 启用了 v3 版本的编译引擎，nvue 页面会被 uni-app 编译为 weex 的原生页面，冷启动速度降低到了不到 1 秒。

但这个页面只是一个本地的原生页面，并不是我们想要的 pwa 页面。所以需要在这个页面新建一个 webview 来显示我们的 pwa 页面。

注意，最好通过 plus api 来创建而不是使用 webview 控件，webview 控件会有转换损耗，降低启动速度。

最后冷启动速度：2 秒。

### 为什么不使用 uni-app 自带的 loading 界面？

因为 uni-app loading 结束时机是首屏的 nvue 页面加载完毕而不是 webview 中的网页加载完毕，所以，在结束 loading 图后会有一段时间的白屏闪烁，接着你会看到你的 pwa 界面开始慢吞吞地绘制 dom。

同时，在首屏 nvue 手工实现 loading 获得了一些好处，关闭 uni-app 自带的 loading 除了略微加快了启动速度外，我们同时也可以实现逻辑更复杂的 loading 页面，甚至包含动画（在 `/app/main.nvue` 中我用 [BindingX](https://alibaba.github.io/bindingx/) 实现了一个简单的图片与文字的过渡动画）并且帧数很高。