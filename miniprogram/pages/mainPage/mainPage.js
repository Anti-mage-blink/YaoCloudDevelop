const app = getApp()
Page({
  data: {
    videoList: [],
    unitList: [],
    loadingMtx: false,
    refreshing: false, // 刷新状态
  },

  onLoad(options) {
  //   // wx.navigateTo({ url: "/pages/Top3Page/Top3Page", });
  //   console.log("[mainPage]页面加载");
    app.globalData.openidPromise.then(openid => {
      this.getUnitList();
    });
  },

  tapLike(event) {
    const item = event.currentTarget.dataset.item;
    console.log(item.is_liked);
    console.log(item.index);
    console.log(item);
    console.log(this.data.unitList)
    // 先承诺，再执行（确保正确执行）
    // 先在前端响应
    this.setData({
      [`unitList[${item.index}].is_liked`]: !item.is_liked,
    })
    // 原来值变承诺值
    item.flag = !item.is_liked;
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
      [`unitList[${item.index}].is_collected`]: !item.is_collected,
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

  getUnitList(isRefresh = false) {
    if (this.data.loadingMtx) return
    this.setData({ loadingMtx: true }); // 上锁

    // GET.Query参数，若想写数组：原本只能分开写
    // JavaScript会合并同名键，wx.cloud.callContainer允许"键-数组"
    const query_params = {
      fileid_list: this.data.videoList,
      need_count: 3,
      openid: app.globalData.openid,
    };
    console.log("videoList传参:");
    console.log(this.data.videoList);
    app.callContainer("/api/v1/videos/random_n_with_userInfo", "GET", query_params)
    .then(res => {
      this.setData({
        videoList: this.data.videoList.concat(res.fileid_list),
        unitList: this.data.unitList.concat(res.unit_list)
      });
      console.log("获取视频后videoList:");
      console.log(this.data.videoList);
      console.log("获取视频后unitList:");
      console.log(this.data.unitList);
    })
    .finally(() => {
      this.setData({ loadingMtx: false });
      if(isRefresh) { this.setData({ refreshing: false, }); }
    })
  },

  onReachBottom() {
    console.log("[mainPage]触底了");
    this.getUnitList();
  },

  onRefresh() {
    this.setData({ 
      refreshing: true,
      videoList: [], 
      unitList: []
    });
    this.getUnitList(true);
  },

  // onShareAppMessage() {
    
  // }
})