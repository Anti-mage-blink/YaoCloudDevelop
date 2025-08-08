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
      success: res => {
        console.log("选择视频成功");
        this.uploadCoverAndVideo(res);
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
        this.uploadCoverAndVideo(res)
      },
      fail: err => { 
        console.log('选择视频失败');
      },
    });
  },

  uploadCoverAndVideo(res) {
    wx.showLoading({title: "上传中"})
    const tempFile = res.tempFiles[0];

    const openid = app.globalData.openid;
    // const openid = "test-creator";

    // 异步执行：上传视频封面、上传视频文件
      // 确保同一时间
    const timeString = new Date().toISOString().replace(/[:.]/g, '_');
    // 异步上传视频封面
    const uploadCoverPromise = new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: "usersFiles/" + openid + "/"
              + timeString + "-cover",
        filePath: tempFile.thumbTempFilePath,
        success: res => {
          console.log("封面上传云存储成功")
          resolve(res);
        },
        fail: err => {
          console.log("封面上传云存储失败")
          reject(err);
        }
      })
    })

    // 异步上传视频本身
    const uploadVideoPromise = new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: "usersFiles/" + openid + "/"
                  + timeString + "-video",
        filePath: tempFile.tempFilePath,
        success: res => {
          console.log("视频上传云存储成功")
          resolve(res);
        },
        fail: err => {
          console.log("视频上传云存储失败")
          reject(err);
        }
      })
    })

    Promise.all([uploadCoverPromise, uploadVideoPromise])
    .then(([coverRes, videoRes]) => {
      const data = {
        "openid": openid,
        "fileid": videoRes.fileID,
        "cover_fileid": coverRes.fileID
      };
      // 使用 return 将 app.callContainer 连接到主链上
      return app.callContainer("/api/v1/videos", "POST", data);
    })
    .then(() => {
      // 这是 app.callContainer 成功后的回调
      wx.hideLoading();
      wx.showToast({
        title: "上传成功",
        icon: "success",
        duration: 1000,
      });
    })
    .catch(err => {
      // 这个 catch 现在可以捕获 Promise.all 和 app.callContainer 的所有错误
      console.error("上传过程失败", err);
      wx.hideLoading();
      wx.showToast({
        title: "上传失败",
        icon: "error",
        duration: 1000
      });
    })
  }
})