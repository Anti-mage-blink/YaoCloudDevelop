// pages/testPage2/testPage2.js
Page({
  data: {
    creator: {
      openid: "test-follow-toggle",
      isFollowed: false,

    },
    isLiked: false,
    isCollected: false,
  },

  toggleLikeButton() {
    console.log("引用处-翻转前");
    console.log(this.data.isLiked);
    this.setData({
      isLiked: !this.data.isLiked,
    })
    console.log("引用处-翻转后");
    console.log(this.data.isLiked);
  },

  toggleCollectButton() {
    console.log("引用处-翻转前");
    console.log(this.data.isCollected);
    this.setData({
      isCollected: !this.data.isCollected,
    })
    console.log("引用处-翻转后");
    console.log(this.data.isCollected);
  },

  onToggle() {
    console.log("引用处-翻转前");
    console.log(this.data.creator.isFollowed);
    this.setData({
      "creator.isFollowed": !this.data.creator.isFollowed,
    })
    console.log("引用处-翻转后");
    console.log(this.data.creator.isFollowed);
  },

  

  tapSettingsButton() {
    console.log("点击了设置");
  },

  tapFollowButton() {
    console.log("点击了关注");
  },

})