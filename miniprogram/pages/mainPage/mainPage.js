const app = getApp()
Page({
  // data: {
  //   openid: "mainPage", // 测试用
  //   userInfo: {
  //     openid: null,
  //     nickname: null,
  //     avatarUrl: null,
  //   },

  //   videoList: [],
  //   endPoint: "/api/videos/url_list_by_user/",
  //   loadingMtx: false,
  //   refreshing: false, // 刷新状态
  // },

  // async onLoad(options) {
  //   // wx.navigateTo({ url: "/pages/Top3Page/Top3Page", });
  //   console.log("[mainPage]页面加载");
  //   this.getVideoList();
  //   const res = await app.getUserInfo(this.data.openid);
  //   this.setData({
  //     userInfo: {
  //       openid: res.openid,
  //       nickname: res.nickname,
  //       avatarUrl: res.avatar_url,
  //     },
  //   });
  //   console.log("[mainPage:onLoad]Page userInfo.nickname: " + this.data.userInfo.nickname);
  // },

  // getVideoList(isRefresh = false) {
  //   if (this.data.loadingMtx) return
  //   console.log("[mainPage]开始getVideoList...");
  //   this.setData({ loadingMtx: true }); // 上锁
  //   // wx.request({
  //   //   url: app.globalData.baseUrl + this.data.endPoint,
  //   //   method: "GET",
  //   //   data: {
  //   //     openid: this.data.openid,
  //   //   },

  //   //   success: (res) => {
  //   //     if(res.statusCode == 200) {
  //   //       console.log("[mainPage]请求成功");
  //   //       console.log(res);
  //   //       this.setData({
  //   //         videoList: this.data.videoList.concat(res.data.results),
  //   //       });
  //   //     }
  //   //   },
      
  //   //   complete: () => {
  //   //     this.setData({ loadingMtx: false });
  //   //     console.log("[mainPage]请求结束 loadingMtx: " + this.data.loadingMtx);
  //   //     console.log("[mainPage]videoList长度: " + this.data.videoList.length);
  //   //     if(isRefresh) { this.setData({ refreshing: false, }); }
  //   //   }
  //   // })
  // },

  // onReachBottom() {
  //   console.log("[mainPage]触底了");
  //   this.getVideoList();
  // },

  // onRefresh() {
  //   console.log("[mainPage]下拉刷新了");
  //   this.setData({ refreshing: true });
  //   this.setData({ videoList: [], });
  //   this.getVideoList(true);
    
  //   console.log("[mainPage]onRefresh处理完了");
  // },

  // onShareAppMessage() {
    
  // }
})