const app = getApp()

Page({
  data: {
    nickname: "",
    avatar_fileid: "",
    unitList_works: [],
    unitList_collects: [],

    showSlideMenu: false,
  },

  onLoad() {
    app.globalData.openidPromise.then(openid => {
      console.log("[myPage:onLoad]openid:" + openid)
      this.getVideoList();
      this.getCollectVideoList();
    })
  },

  onShow() {
    app.globalData.openidPromise.then(openid => {
      this.getVideoList();
      this.getCollectVideoList();
      this.setData({
        nickname: app.globalData.nickname,
        avatar_fileid: app.globalData.avatar_fileid,
      })
    })
  },

  tapSettingsButton() {
    this.setData({ showSlideMenu: true });
  },
  hideSlideMenu() {
    this.setData({ showSlideMenu: false });
  },

  tapEditProfile() {
    wx.navigateTo({ url: '/pages/myPage/profileEdit/profileEdit' })
  },

  tapMyProfit() {
    wx.navigateTo({ url: '/pages/myPage/profitPage/profitPage' })
  },

  tapHelpAndFeedback() {
    wx.navigateTo({ url: '/pages/myPage/helpPage/helpPage' })
  },

  tapTopShareButton() {
    
  },

  getVideoList() {
    const query_params = {
      openid: app.globalData.openid,
    }
    app.callContainer("/api/v1/videos", "GET", query_params)
    .then(res => {
      console.log(res);
      this.setData({
        unitList_works: res.unit_list,
      })
    })
  },

  switchToCollect() {
    console.log("事件触发：切换到收藏");
    this.getCollectVideoList();
  },

  getCollectVideoList() {
    const query_params = {
      openid: app.globalData.openid,
    }
    app.callContainer("/api/v1/collects", "GET", query_params)
   .then(res => {
      console.log(res);
      this.setData({
        unitList_collects: res.unit_list,
      })
    })
  },

  tapUploadAvatar() {
    // 弹出上传头像的底部菜单栏
    // 选择上传后，选择文件然后上传
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"],
      success: res => {
        console.log("选择头像成功");
        const tempFile = res.tempFiles[0];
        // 上传头像
        wx.cloud.uploadFile({
          // 会覆盖掉同名文件，为了只保留一个最新的头像文件
          cloudPath: "usersFiles/" + app.globalData.openid + "/avatar"
                    + "/my_avatar-" 
                    + new Date().toISOString().replace(/[:.]/g, '_') +"-image",
          filePath: tempFile.tempFilePath,
          success: res => {
            console.log("头像上传云存储成功");

            // 提前拿到旧头像fileid，最后执行：若不是默认头像，则最后删除
            const old_avatar_fileid = app.globalData.avatar_fileid
            
            // 数据库更新用户信息
            const new_avatar_fileid = res.fileID;
            const data_updateUserInfo = {
              "openid": app.globalData.openid,
              "nickname": app.globalData.nickname,
              "avatar_fileid": new_avatar_fileid,
            };
            app.callContainer("/api/v1/users", "PUT", data_updateUserInfo)
              .then(res => {
                console.log("用户信息更新成功");
                app.globalData.avatar_fileid = new_avatar_fileid;
                this.setData({
                  avatar_fileid: new_avatar_fileid,
                });
                // 最后删除旧的头像文件（若是用户自上传的文件）
                if ( old_avatar_fileid && !old_avatar_fileid.includes("默认") ) {
                  wx.cloud.deleteFile({
                    fileList: [old_avatar_fileid],
                    success: res => {
                      console.log("旧头像云存储删除成功");
                    },
                    fail: res => {
                      console.log("旧头像云存储删除失败");
                    }
                  })
                } else {
                  console.log("旧头像不存在或为默认头像，不删除");
                }
              })
          },
          fail: res => {
            console.log("头像上传云存储失败");
          }
        })
      },
      fail: res => {
        console.log("头像选择失败");
      }
    })

  },

  onShareAppMessage() {
    return {
      title: "乐龄智汇坊",
      path: "/pages/mainPage/mainPage",
    }
  },
})