const app = getApp();
Component({

  properties: {
    isLiked: {
      type: Boolean,
      value:false,
    },
    likeCount: {
      type: Number,
      value: 666,
    },
    videoFileID: {
      type: String,
      value: "custom-component-default-value",
    }
  },

  methods: {
    tapLikeButton() {
      const isLiked = this.properties.isLiked;
      const targetState = !isLiked;
      // 引用处catch:toggle {
      //   this.setData{ isLiked: !this.data.isLiked}
      // }
      this.triggerEvent("toggle")
      const common_data = {
        openid: app.globalData.openid,
        fileid: this.properties.videoFileID,
      }
      if(targetState) {
        console.log("调用点赞API")
        console.log(common_data)
        app.callContainer("/api/v1/likes", "POST", common_data)
      } else {
        console.log("调用取消点赞API")
        console.log(common_data)
        app.callContainer("/api/v1/likes", "DELETE", common_data)
      }
    }
  }
})