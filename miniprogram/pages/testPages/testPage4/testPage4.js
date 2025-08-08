const app = getApp()
Page({
  data: {
    videoSrc: app.globalData.No20_video_fileid, // 替换为实际视频源
    isLiked: false,
    isCollected: false,
    likeCount: 100,
    collectCount: 100,
    
    showVideoCommentPopup: false,
    videoFirstLevelCommentList: [],

    unit: {},
  },

  onLoad() {
    app.globalData.openidPromise.then(openid => {
      const query_params = {
        video_fileid: app.globalData.No20_video_fileid,
        openid: app.globalData.openid,
      }
      app.callContainer("/api/v1/videos/specific_single", "GET", 
      query_params )
      .then(res => {
        console.log("GetSingle res:")
        console.log(res)
        this.setData({
          unit: res,
        })
      })
    })
  },

  publishComment() {
    const data = {
      openid: app.globalData.openid,
      video_fileid: this.data.unit.video.video_fileid,
      // content: 
    }
    app.callContainer("/api/v1/comments", "POST", data)
  },

  tapComment() {
    this.setData({
      showVideoCommentPopup: true,
    })
  },

  closeVideoCommentPopup() {
    this.setData({
      showVideoCommentPopup: false,
    })
  },

  tapLike() {
    const isLiked = this.data.unit.current_user.is_liked;
    const targetState = !isLiked;
    // 先承诺，后成功执行
    this.setData({ 
      [`unit.current_user.is_liked`]: targetState,
      [`unit.video.like_count`]: targetState ? this.data.unit.video.like_count+1:this.data.unit.video.like_count-1
     })
    const common_data = {
      openid: app.globalData.openid,
      fileid: this.data.unit.video.video_fileid,
    }
    if(targetState) {
      console.log("调用点赞API")
      app.callContainer("/api/v1/likes", "POST", common_data)
    } else {
      console.log("调用取消点赞API")
      app.callContainer("/api/v1/likes", "DELETE", common_data)
    }
  },

  tapCollect() {
    const isCollected = this.data.unit.current_user.is_collected;
    const targetState = !isCollected;
    // 先承诺，后成功执行
    this.setData({ 
      [`unit.current_user.is_collected`]: targetState,
      [`unit.video.collect_count`]: targetState ? this.data.unit.current_user.is_collected+1:this.data.unit.current_user.is_collected-1
     })
    const common_data = {
      openid: app.globalData.openid,
      fileid: this.data.unit.video.video_fileid,
    }
    if(targetState) {
      console.log("调用收藏API")
      app.callContainer("/api/v1/collects", "POST", common_data)
    } else {
      console.log("调用取消收藏API")
      app.callContainer("/api/v1/collects", "DELETE", common_data)
    }
  },
  
  onShareAppMessage() {

  },
})