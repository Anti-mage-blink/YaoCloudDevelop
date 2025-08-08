Page({
  data: {
    showVideoActionSheet: false,
    actionsOfVideoActionSheet: [
      {
        name: "删除视频"
      },
    ],

    showVideoCommentPopup: false,

    video: {},
    videoFirstLevelCommentList: [],


  },

  tapCommentButton() {
    this.setData({
      showVideoCommentPopup: true,
    })
  }, 

  closeVideoCommentPopup() {
    this.setData({
      showVideoCommentPopup: false,
    })
  },

  tapMoreButton() {
    this.setData({
      showVideoActionSheet: true,
    })
  },

  selectVideoActionSheetAction(event) {
    const actionName = event.detail.name;
    if(actionName === "删除视频") {
      wx.showToast({
        title: '选择了删除视频',
      })
    }
  },

  closeVideoActionSheet() {this.setData({showVideoActionSheet: false})},
})