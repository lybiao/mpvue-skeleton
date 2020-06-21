
## Setup

``` bash
# 初始化项目
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
npm i

# 开发时构建
npm run dev

# 打包构建
npm run build


# 生成 bundle 分析报告
npm run build --report
```

参考： checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 模拟服务器
```base

# 进入serve文件夹，并且安装依赖
cd server && npm i

# 启动 node 服务
node index.js

```


## 角色账号

```
手机号：

//收银台： 18000000001: 'api/checkout/login',
//管理员： 18000000002: 'api/manager/login',
//部  长： 18000000003: 'api/minister/login',
//前台：   18000000004: 'api/reception/login'

验证码： 任意输入即可

```
