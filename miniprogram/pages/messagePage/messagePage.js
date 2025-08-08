Page({
  tapLike() {
    wx.navigateTo({url: "/pages/messagePage/likePage/likePage"});
  },

  tapFans() {
    wx.navigateTo({url: "/pages/messagePage/fansPage/fansPage"});
  },

  tapComment() {
    wx.navigateTo({url: "/pages/messagePage/commentPage/commentPage"});
  },

  tapSysmessage() {
    wx.navigateTo({url: "/pages/messagePage/sysmessagePage/sysmessagePage"});
  }
})