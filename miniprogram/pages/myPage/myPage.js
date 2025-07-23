const app = getApp()

Page({
  data: {
    avatar_fileID: ""
  },

  onLoad() {
    this.setData({
      avatar_fileID: app.globalData.avatar_fileID,
    })
  },
})