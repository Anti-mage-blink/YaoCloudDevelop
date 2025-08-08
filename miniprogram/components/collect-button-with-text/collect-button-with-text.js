const app = getApp();
Component({
  properties: {
    isCollected: {
      type: Boolean,
      value:false,
    },
    collectCount: {
      type: Number,
      value: 666,
    },
    videoFileID: {
      type: String,
      value: "custom-component-default-value",
    }
  },

  methods: {
    tapCollectButton() {
      const isCollected = this.properties.isCollected;
      const targetState = !isCollected;
      // 引用处catch:toggle {
      //   this.setData{ isCollected: !this.data.isCollected}
      // }
      this.triggerEvent("toggle")
      const common_data = {
        openid: app.globalData.openid,
        fileid: this.properties.videoFileID,
      }
      if(targetState) {
        console.log("调用收藏API")
        console.log(common_data)
        app.callContainer("/api/v1/collects", "POST", common_data)
      } else {
        console.log("调用取消收藏API")
        console.log(common_data)
        app.callContainer("/api/v1/collects", "DELETE", common_data)
      }
    }
  }
})