const app = getApp()
Page({
  data: {
    videoList: [],
    unitList: [],
    loadingMtx: false,
    refreshing: false, // 刷新状态
  },

  onLoad(options) {
    // wx.navigateTo({ url: "/pages/Top3Page/Top3Page", });
    app.globalData.openidPromise.then(openid => {
      this.getUnitList();
    });
  },

  tapVideoToNavigate() {
    // wx.navigateTo({
    //   url: "/pages/concreteVideoPage/concreteVideoPage",
    // })
  },

  tapLike(event) {
    const unit = event.currentTarget.dataset.unit;
    const targetState = !unit.current_user.is_liked;
    // 先承诺，后执行（确保正确执行）
    // 先在前端响应
    this.setData({
      [`unitList[${unit.other_info.index}].current_user.is_liked`]: targetState,
    })
    // 再去尝试修改后端，按承诺方向执行
    // 共同参数
    const common_params = {
      openid: app.globalData.openid,
      fileid: unit.video.video_fileid,
    };
    if (targetState) {
      app.callContainer("/api/v1/likes", "POST", common_params)
    }
    else {
      app.callContainer("/api/v1/likes", "DELETE", common_params)
    }
  },

  tapCollect(event) {
    const unit = event.currentTarget.dataset.unit;
    const targetState = !unit.current_user.is_collected;
    // 先承诺，后执行（确保正确执行）
    // 先在前端响应
    this.setData({
      [`unitList[${unit.other_info.index}].current_user.is_collected`]: targetState,
    })
    // 再去尝试修改后端，按承诺方向执行
    // 共同参数
    const common_params = {
      openid: app.globalData.openid,
      fileid: unit.video.video_fileid,
    };
    if (targetState) {
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
      need_count: 4,
      openid: app.globalData.openid,
    };
    // console.log("videoList传参:");
    // console.log(this.data.videoList);
    app.callContainer("/api/v1/videos/random_n", "GET", query_params)
    .then(res => {
      const new_video_fileid_list = res.unit_list.map(unit => unit.video.video_fileid)
      this.setData({
        videoList: this.data.videoList.concat(new_video_fileid_list),
        unitList: this.data.unitList.concat(res.unit_list)
      });
      // console.log("获取视频后videoList:");
      // console.log(this.data.videoList);
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

  onShareAppMessage() {
    return {
      title: "乐龄智汇坊",
      path: "/pages/mainPage/mainPage",
    }
  }
})