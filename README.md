### 权限系统

> 基于Vue+Vue-router+Vuex


### 运行  

``` bash
# 安装依赖包
npm install

# 本地运行
npm run dev

# 测试环境打包
npm run build_test

# 迁移环境打包
npm run build_transfer

# UAT环境打包
npm run build_uat

# UAT环境(生产服务器)打包
npm run build_uat_prod

# 生产环境打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


#### 访问地址

* [测试环境](http://rbac3.erptest.pagoda.com.cn/admin)

* [迁移环境](http://transfer.rbac.erp-g3.staging.pagoda.com.cn/admin)

* [UAT环境](http://rbac.erp-g3.staging.pagoda.com.cn/admin)

* [UAT环境_生产服务器](http://rbac-g3-staging.pagoda.com.cn/)

* [生产环境](http://rbac-g3.pagoda.com.cn)  


#### 接口文档地址

* [swagger](http://rbac3.erptest.pagoda.com.cn/swagger-ui.html)

* [yapi](http://yapi.staging.pagoda.com.cn/project/15/interface/api)

#### 其他文档

* [Bug追踪](http://jira.pagoda.com.cn/browse/AUTH/?selectedTab=com.atlassian.jira.jira-projects-plugin:issues-panel)  

* [对接、配置等文档](http://wiki.pagoda.com.cn/pages/viewpage.action?pageId=6914575)


* [权限系统进度&需求管理](https://docs.qq.com/sheet/DSWR6SWVpSkJzb25y)  

* [产品原型](https://fznbfc.axshare.com/)

* [element-ui](https://element.faas.ele.me/#/zh-CN/component/installation)

* [pagoda-design](http://pagoda-design.test.pagoda.com.cn:8090)

#### 更新步骤  
　　  
1.测试环境、迁移环境、UAT环境在jenkins上构建;  （账号密码 pagoda pagoda2016）

2.登录[rancher](https://rancher.test.pagoda.com.cn/)进行升级 （账号密码 pagoda pagoda2016）

项目在jenkins地址：  

* [测试环境](http://a8-domain.pagoda.com.cn:10007/jenkins/job/rbac_web3_test/)

* [迁移环境](http://a8-domain.pagoda.com.cn:10007/jenkins/job/rbac_web3_transfer/)

* [UAT环境](http://a8-domain.pagoda.com.cn:10007/jenkins/job/rbac_web3_staging/)


项目在rancher上的位置： 

* 测试环境： TEST-ERP2.0/ERP-RBAC/rbac-web3

* 迁移环境： STAGING/ERP-RBAC-transfer/rbac3-web-transfer

* UAT环境：  STAGING/ERP-RBAC/rbac3-web-staging

UAT环境_生产服务器、生产环境在jenkins上构建即可（自动触发升级）

* [UAT环境_生产服务器](http://jenkins-bgy.1mxian.com/job/staging-rbac-frd-g3/)

* [生产环境](http://jenkins-bgy.1mxian.com/job/rbac-frd-g3/)






For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
