App({
  globalData: { 
    env: "", 
    openid: "", 
    cloudrun_env: "prod-0gl5viji734183b5",

    avatar_fileID: "cloud://cloud1-5gbsnpgt113642bc.636c-cloud1-5gbsnpgt113642bc-1368918426/通用图像文件/默认头像.png",
  },

  onLaunch() {

    // env：决定后面小程序的云开发调用（wx.cloud.xxx）会默认请求哪个云环境的资源
    this.globalData.env = "cloud1-5gbsnpgt113642bc";

    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }

    // 获取openid
    wx.cloud.callFunction({
      name: "getOpenId",

      success: res => {
        const openid = res.result;
        console.log("openid: " + openid);
        this.globalData.openid = openid;
      },
      fail: err => {
        console.log(err);
      }
    });

  },

  callContainer(path, method, data) {
    wx.cloud.callContainer({
      config: {
        env: this.globalData.cloudrun_env,
      },
      header: {
        'X-WX-SERVICE': "test",
      },

      path: path,
      method: method,
      data: data,

      complete: res => {
        console.log("容器调用返回状态码: " + res.statusCode.toString());
      },
    })
  },

});
