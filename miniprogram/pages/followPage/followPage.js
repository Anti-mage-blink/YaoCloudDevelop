const app = getApp()
Page({

  data: {
    activeTab: 0,
    categoryList: [
      {title: "推荐", creatorUnitList: []}, 
      {title: "已关注", creatorUnitList: []}, 
      {title: "音乐", creatorUnitList: []}, 
      {title: "搞笑", creatorUnitList: []}, 
      {title: "健康", creatorUnitList: []}, 
      {title: "舞蹈", creatorUnitList: []}, 
      {title: "旅行", creatorUnitList: []}, 
      {title: "综艺", creatorUnitList: []}, 
      {title: "妙招", creatorUnitList: []}, 
      {title: "百态", creatorUnitList: []},
      {title: "科技", creatorUnitList: []}, 
      {title: "影视", creatorUnitList: []}, 
      {title: "美食", creatorUnitList: []}, 
      {title: "时尚", creatorUnitList: []},
    ],
    recommendCreatorUnitList: [],

  },

  onLoad() {
    // 获取推荐创作者，返回给recommendCreaterUnitList
    this.getRecommendCreatorUnitList();
  },

  onToggle(event) {
    const { categoryIndex, creatorIndex } = event.currentTarget.dataset;
    this.setData({
      [`categoryList[${categoryIndex}].creatorUnitList[${creatorIndex}].is_followed`]: 
      !this.data.categoryList[categoryIndex].creatorUnitList[creatorIndex].is_followed,
    })
  },

  changeTab(event) {
    const tabIndex = event.detail.index;
    const tabTitle = event.detail.title;
    const currentCategory = this.data.categoryList[tabIndex];
    // this.data.categoryList[1].creatorUnitList.length === 0
    if (tabTitle === "推荐" ) {
      this.setData({activeTab: 0})
      if (currentCategory.creatorUnitList.length === 0) {
        this.getRecommendCreatorUnitList()
      }
    } else if (tabTitle === "已关注") {
      this.setData({activeTab: 1})
      if (currentCategory.creatorUnitList.length === 0) {
        this.getFollowedCreatorUnitList()
      }
    } else {
      this.setData({activeTab: tabIndex})
      if (currentCategory.creatorUnitList.length === 0) {
        this.getSpecificCategoryCreatorUnitList(tabIndex)
      }
    }
  },

  onReachBottom() {
    if (tabTitle === "推荐" ) {
      this.setData({activeTab: 0})
      if (currentCategory.creatorUnitList.length === 0) {
        this.getRecommendCreatorUnitList()
      }
    } else if (tabTitle === "已关注") {
      this.setData({activeTab: 1})
      if (currentCategory.creatorUnitList.length === 0) {
        this.getFollowedCreatorUnitList()
      }
    } else {
      this.setData({activeTab: tabIndex})
      if (currentCategory.creatorUnitList.length === 0) {
        this.getSpecificCategoryCreatorUnitList(tabIndex)
      }
    }
  },

  onRefresh() {

  },

  getRecommendCreatorUnitList() {
    const query_params = {
      openid_list: this.data.categoryList[0].creatorUnitList,
      need_count: 5,
      current_user_openid: app.globalData.openid,
    }
    app.callContainer("/api/v1/users/recommend_n", "GET", query_params)
    .then(res => {
      console.log("推荐n的返回:");
      console.log(res);
      this.setData({
        [`categoryList[0].creatorUnitList`]: this.data.categoryList[0].creatorUnitList.concat(res.creator_unit_list)
      })
      console.log("this.data.categoryList[0].creatorUnitList:");
      console.log(this.data.categoryList[0].creatorUnitList);
    })
  },

  getFollowedCreatorUnitList() {
    const query_params = {
      openid_list: this.data.categoryList[1].creatorUnitList,
      need_count: 5,
      current_user_openid: app.globalData.openid,
    }
    app.callContainer("/api/v1/users/followed_n", "GET", query_params)
    .then(res => {
      console.log("已关注n的返回:");
      console.log(res);
      this.setData({
        [`categoryList[1].creatorUnitList`]: this.data.categoryList[1].creatorUnitList.concat(res.creator_unit_list),
      })
      console.log("this.data.categoryList[1].creatorUnitList:");
      console.log(this.data.categoryList[1].creatorUnitList);
    })
  },

  getSpecificCategoryCreatorUnitList(tabIndex) {
    const query_params = {
      category: this.data.categoryList[tabIndex].title,
      openid_list: this.data.categoryList[tabIndex].creatorUnitList,
      need_count: 5,
      current_user_openid: app.globalData.openid,
    }
    app.callContainer("/api/v1/users/specific_category_random_n", "GET", query_params)
    .then(res => {
      console.log("已关注n的返回:");
      console.log(res);
      this.setData({
        [`categoryList[${tabIndex}].creatorUnitList`]: this.data.categoryList[tabIndex].creatorUnitList.concat(res.creator_unit_list)
      })
      console.log("this.data.categoryList[tabIndex].creatorUnitList:");
      console.log(this.data.categoryList[tabIndex].creatorUnitList);
    })
  },
})