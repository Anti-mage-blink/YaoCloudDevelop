const app = getApp()

Page({
  data: {
    nickname: "",
    avatar_fileid: "",
  },

  onShow() {
    this.setData({
      nickname: app.globalData.nickname,
      avatar_fileid: app.globalData.avatar_fileid,
    })
  },

  tapUploadAvatar() {
    // const that = this;
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
          cloudPath: "usersFiles/" + app.globalData.openid
                    + "/avatar" + "/my_avatar-image",
          filePath: tempFile.tempFilePath,
          success: res => {
            console.log("头像上传成功");
            const avatar_fileid = res.fileID;
            const data_updateUserInfo = {
              "openid": app.globalData.openid,
              "nickname": app.globalData.nickname,
              "avatar_fileid": avatar_fileid,
            };
            app.callContainer("/api/v1/users", "PUT", data_updateUserInfo)
              .then(res => {
                console.log("用户信息更新成功");
                console.log(avatar_fileid);
                app.globalData.avatar_fileid = avatar_fileid;
                this.setData({
                  avatar_fileid: avatar_fileid,
                });
              })
          }
        })
      },
      fail: res => {
        console.log("头像选择失败");
      }
    })

  }
})