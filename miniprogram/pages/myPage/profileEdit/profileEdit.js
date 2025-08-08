const app = getApp()
const defaultAvatarUrl = "/images/icons/默认头像-个人信息页面.png"

Page({
  data: {
    nickname: '',
    avatar_fileid: defaultAvatarUrl,
    signature: '',
    // gender: '1', // 默认为男性
    ageRange: '',
    interest_category_list: [],

    genderOptions: [{value: '1', name: '男'}, {value: '2', name: '女'}],
    ageOptions: [
      { name: '17岁以下', value: '17岁以下' },
      { name: '18~24岁', value: '18~24岁' },
      { name: '25~29岁', value: '25~29岁' },
      { name: '30~39岁', value: '30~39岁' },
      { name: '40~49岁', value: '40~49岁' },
      { name: '50~59岁', value: '50~59岁' },
      { name: '60~69岁', value: '60~69岁' },
      { name: '70~79岁', value: '70~79岁' },
      { name: '80岁以上', value: '80岁以上' },
    ],
    interestOptions: [
      {value: '音乐', name: '音乐'}, {value: '搞笑', name: '搞笑'},
      {value: '健康', name: '健康'}, {value: '舞蹈', name: '舞蹈'},
      {value: '旅行', name: '旅行'}, {value: '综艺', name: '综艺'},
      {value: '妙招', name: '妙招'}, {value: '百态', name: '百态'},
      {value: '科技', name: '科技'}, {value: '影视', name: '影视'},
      {value: '美食', name: '美食'}, {value: '时尚', name: '时尚'},
    ],
    tempAvatarPath: '' // 临时存储头像路径
  },

  onLoad(options) {
    app.globalData.openidPromise.then(() => {
      this.getUserProfile()
    });
  },

  getUserProfile() {
    const data = { openid: app.globalData.openid };

    app.callContainer("/api/v1/users/profile", "GET", data)
      .then(res => {
        console.log("初始获取的form初始值");
        console.log(res);
        this.setData({
          nickname: res.nickname,
          avatar_fileid: res.avatar_fileid ? res.avatar_fileid : defaultAvatarUrl,
          signature: res.signature,
          // gender: String(res.gender),
          // ageRange: res.age_range,
          genderOptions: this.data.genderOptions.map(opt => ({
            ...opt,
            checked: String(res.gender) === opt.value
          })),
          ageOptions: this.data.ageOptions.map(opt => ({
            ...opt,
            checked: String(res.age_range) === opt.value
          })),
          interestOptions: this.data.interestOptions.map(opt => ({
            ...opt,
            // 第一个判断存在性，null或undefined则为false，其余（包括空数组[""]）
            checked: res.interest_category_list && res.interest_category_list.includes(opt.value)
          }))
        });
        console.log("初始获取的genderOptions初始值");
        console.log(this.data.genderOptions);
        console.log("初始获取的interestOptions初始值");
        console.log(this.data.interestOptions);
      })
      .catch(err => {
        console.error("Failed to load user profile", err);
        wx.showToast({title: '加载信息失败', icon: 'none'});
      });
  },

  tapUploadAvatar() {
    // 选择文件
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"]
    })
    // 上传云存储
    .then(chooseRes => {
      console.log("选择头像成功");
      const tempFile = chooseRes.tempFiles[0];
      // 上传头像
      return wx.cloud.uploadFile({
        // 由于时间，会创建
        cloudPath: "usersFiles/" + app.globalData.openid + "/avatar"
                  + "/my_avatar-" 
                  + new Date().toISOString().replace(/[:.]/g, '_') +"-image",
        filePath: tempFile.tempFilePath,
      })
    })
    // 更新数据库
    .then(uploadRes => {
      console.log("头像上传云存储成功");
      
      // 数据库更新用户信息
      const data_updateUserInfo = {
        "openid": app.globalData.openid,
        "avatar_fileid": uploadRes.fileID,
      };
      return app.callContainer("/api/v1/users", "PUT", data_updateUserInfo)
      .then(() => ({
        new_avatar_fileid: uploadRes.fileID,
      }))
    })
    // 更新页面和全局变量，删除旧头像
    .then(updateDbRes => {
      console.log("用户信息更新成功");
      const old_avatar_fileid = app.globalData.avatar_fileid;
      app.globalData.avatar_fileid = updateDbRes.new_avatar_fileid;
      this.setData({
        avatar_fileid: updateDbRes.new_avatar_fileid,
      });
      // 最后删除旧的头像文件（若是用户自上传的文件）
      if ( old_avatar_fileid && !old_avatar_fileid.includes("默认") ) {
        return wx.cloud.deleteFile({
          fileList: [old_avatar_fileid],
        })
      }
    })
    .then(() => {
      console.log("头像上传成功");
    })
    .catch(err => {
      console.log("头像上传失败:");
      console.log(err);
    })
  },

  onFormSubmit(e) {
    const formData = e.detail.value;
    console.log("formData:")
    console.log(formData)

    wx.showLoading({ title: '保存中...' });

    const data = {
      openid: app.globalData.openid,
      nickname: formData.nickname,
      signature: formData.signature,
      gender: parseInt(formData.gender, 10),
      age_range: formData.ageRange,
      interest_category_list: formData.interest_category_list,
    };

    app.callContainer("/api/v1/users", "PUT", data)
    .then(res => {
      app.globalData.nickname = formData.nickname;
      wx.hideLoading();
      wx.showToast({ 
        title: '保存成功', 
        icon: 'success', 
        duration: '2000'})
      .then(() => {
        wx.navigateBack()
      })
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
      console.error("Update user info failed", err);
    });
  },
});