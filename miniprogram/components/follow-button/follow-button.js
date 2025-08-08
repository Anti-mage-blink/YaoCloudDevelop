const app = getApp();

Component({
  properties: {
    isFollowed: {
      type: Boolean,
      value: false,
    },
    followed_openid: {
      type: String,
      value: "o35VCvibdy2CO5EOaHJjoA4f-yRw",
    }
  },

  externalClasses: ["custom-style"],

  methods: {
    tapFollowButton() {
      const isFollowed = this.properties.isFollowed;
      // console.log("组件内获取当前状态:");
      // console.log(isFollowed);
      const targetState = !isFollowed;
      // console.log("目标状态:");
      // console.log(targetState);
      // 先承诺，再执行
      this.triggerEvent("toggle")
      // 外部引用处toggle执行：setData({ creator.IsFollowed取反 })，会更新isFollowed
      const common_data = {
        follower_openid: app.globalData.openid,
        followed_openid: this.properties.followed_openid,
      }
      if(targetState) {
        console.log("调用关注API")
        console.log(common_data)
        app.callContainer("/api/v1/follows", "POST", common_data)
      } else {
        console.log("调用取关API")
        console.log(common_data)
        app.callContainer("/api/v1/follows", "DELETE", common_data)
      }
      
    }
  }
})