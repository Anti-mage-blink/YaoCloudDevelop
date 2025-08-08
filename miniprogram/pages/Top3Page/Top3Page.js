const app = getApp()
Page({
  data: {
    unit: {},
  },

  onLoad() {
    // wx.navigateTo({ url: "/pages/Top2Page/Top2Page", });
    app.globalData.openidPromise.then(openid => {
      this.getSingleVideo();
    });
  },

  getSingleVideo() {
    const query_params = {
      openid: app.globalData.openid
    }
    app.callContainer("/api/v1/videos/random_single", "GET", query_params)
    .then(res => {
      console.log("获取随机单个视频：")
      console.log(res)
      this.setData({
        unit: res,
      })
      console.log("给unit赋返回值后：")
      console.log(this.data.unit)
    })
  },

  tapLike(event) {
    const item = event.currentTarget.dataset.item;
    console.log(item.is_liked);
    console.log(item);
    console.log(this.data.unit)
    // 先承诺，再执行（确保正确执行）
    // 先在前端响应
    this.setData({
      [`unit.is_liked`]: !this.data.unit.is_liked,
    })
    // 原来值变承诺值
    item.is_liked = !item.is_liked;
    // 再去尝试修改后端，按承诺方向执行
    // 共同参数
    const common_params = {
      openid: app.globalData.openid,
      fileid: item.video_fileid,
    };
    if (item.is_liked) {
      app.callContainer("/api/v1/likes", "POST", common_params)
    }
    else {
      app.callContainer("/api/v1/likes", "DELETE", common_params)
    }
  },

  tapCollect(event) {
    const item = event.currentTarget.dataset.item;
    console.log(item);
    // 先承诺，再执行（确保正确执行）
    // 先在前端响应
    this.setData({
      [`unit.is_collected`]: !this.data.unit.is_collected,
    })
    // 原来值变承诺值
    item.is_collected = !item.is_collected;
    // 再去尝试修改后端，按承诺方向执行
    // 共同参数
    const common_params = {
      openid: app.globalData.openid,
      fileid: item.video_fileid,
    };
    if (item.is_collected) {
      app.callContainer("/api/v1/collects", "POST", common_params)
    }
    else {
      app.callContainer("/api/v1/collects", "DELETE", common_params)
    }
  },

  onShareAppMessage() {
    return {
      title: "乐龄智汇坊",
      path: "/pages/mainPage/mainPage",
    }
  }
})