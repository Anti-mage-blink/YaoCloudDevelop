App({
  globalData: { 
    env: "", 
    openid: "", 
    cloudrun_env: "prod-0gl5viji734183b5",

    No20_video_fileid: "cloud://cloud1-5gbsnpgt113642bc.636c-cloud1-5gbsnpgt113642bc-1368918426/usersFiles/o35VCvvYpoRPxO_Q1GZufwJTWSQU/2025-07-26T10_40_42_671Z-video",

    // 用户信息，先采用默认值，后续查询传入
    nickname: "默认昵称",
    avatar_fileid: "cloud://cloud1-5gbsnpgt113642bc.636c-cloud1-5gbsnpgt113642bc-1368918426/通用图像文件/默认头像.png",
    openidPromise: null,
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

    // 获取openid-创建用户-查询用户信息
    this.globalData.openidPromise = new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getOpenId",

        success: res => {
          const openid = res.result;
          console.log("openid: " + openid);
          this.globalData.openid = openid;
                // 创建用户（保证用户已创建）
          const data_createUser = {
            "openid": openid,
          };
          this.callContainer("/api/v1/users", "POST", data_createUser)
            .then( () => {
              // console.log("用户创建成功");
              // 查询用户信息
              const data_getUserInfo = {
                "openid": this.globalData.openid,
              };
              this.callContainer("/api/v1/users", "GET", data_getUserInfo)
                .then(data => {
                  // console.log("用户信息查询成功");
                  // console.log(data);
                  // 获取后，若有效，更新用户信息（全局变量）
                  // （后续迭代：尽量从本地获取，减少请求量）
                  if (data.nickname != "") {
                    this.globalData.nickname = data.nickname;
                  }
                  if (data.avatar_fileid != "") {
                    this.globalData.avatar_fileid = data.avatar_fileid;
                  }
                  resolve(openid);
                  // console.log(this.globalData.nickname);
                  // console.log(this.globalData.avatar_fileid);
                })
            })
        },
        fail: err => {
          console.log("openid获取失败");
        },
      });
    });
  },

  callContainer(path, method, data) {
    return new Promise((resolve, reject) => {
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
        
        success: res => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },

        fail: err => {
          reject(err);
        },

        complete: res => {
          if(res.statusCode) {
            console.log("容器调用" + method + path 
                      + "返回状态码: " + res.statusCode.toString()); 
            // 经测试，toString将number转化为字符串
          }
        },
      })
    })
  },

  deleteVideo(video_fileid, cover_fileid) {
    // 传入视频fileid
    wx.showLoading({title: "删除中"})

    const openid = app.globalData.openid;
    // const openid = "test-creator";
    // 这里好像能一次直接删除两个
    // 删除视频封面和视频文件
    // 异步上传视频封面
    wx.cloud.deleteFile({ 
      fileList: [video_fileid, cover_fileid] 
    })
    .then(res => {
      const data = {
        fileid: video_fileid,
        cover_fileid: cover_fileid,
      }
      return app.callContainer("/api/v1/videos", "DELETE", data)
    })
    .then(res => {
      wx.hideLoading()
      wx.showToast({
        title: "上传成功",
        icon: "success",
        duration: 1000,
      });
    })
    .catch(err => {
      console.err(err)
      wx.hideLoading();
      wx.showToast({
        title: "删除失败",
        icon: "error",
        duration: 1000
      });
    })
  }
});
