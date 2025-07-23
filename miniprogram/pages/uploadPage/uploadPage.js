const app = getApp();
Page({
  data: {

  },

  handleTapLeft() {
    // 上传高清视频 ~ 选择消息文件
    wx.chooseMessageFile({
      count: 1,
      type: "video",
      success: res => {
        console.log("选择视频成功");
        const tempFile = res.tempFiles[0];
        // app.uploadVideo_chooseMessageFile(tempFile);
        wx.cloud.uploadFile({
          cloudPath: "usersFiles/" + app.globalData.openid + "/"
                    + new Date().toISOString().replace(/[:.]/g, '_') + "-video",
          filePath: tempFile.path,
          success: res => {
            console.log("视频上传成功");
            const data = {
              "openid": app.globalData.openid,
              "fileid": res.fileID,
            };
            app.callContainer("/api/v1/videos", "POST", data);
          },
          fail: res => {
            console.log("上传失败");
          }
        });
      },
      fail: res => {
        console.log("选择视频失败");
      }
    });
  },

  handleTapRight() {
    // 上传短视频 ~ 选择媒体文件-相册
    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ["album"],
      success: (res) => {
        console.log("选择视频成功");
        const tempFile = res.tempFiles[0];
        // app.uploadVideo_chooseMedia(tempFile);
        wx.cloud.uploadFile({
          cloudPath: "usersFiles/" + app.globalData.openid + "/"
                    + new Date().toISOString().replace(/[:.]/g, '_') + "-video",
          filePath: tempFile.tempFilePath,
          success: res => {
            console.log("视频上传成功");
            const data = {
              "openid": app.globalData.openid,
              "fileid": res.fileID,
            };
            app.callContainer("/api/v1/videos", "POST", data);
          },
          fail: res => {
            console.log("视频上传失败");
          }
        })
      },
      fail: err => { 
        console.log("选择视频失败") 
      },
    });
  },

  handleTapBottom() {
    // 录制上传 ~ 选择媒体文件-相机
    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ['camera'],
      camera: "back",

      success: res => {
        console.log("选择视频成功")
        const tempFile = res.tempFiles[0];
        // app.uploadVideo_chooseMedia(tempFile);
        wx.cloud.uploadFile({
          cloudPath: "usersFiles/" + app.globalData.openid + "/"
                    + new Date().toISOString().replace(/[:.]/g, '_') + "-video",
          filePath: tempFile.tempFilePath,
          success: res => {
            console.log("视频上传成功");
            const data = {
              "openid": app.globalData.openid,
              "fileid": res.fileID,
            };
            app.callContainer("/api/v1/videos", "POST", data);
          },
          fail: res => {
            console.log("视频上传失败");
          },
        })
      },
      fail: err => { 
        console.log('选择视频失败');
      },
    });
  },
})