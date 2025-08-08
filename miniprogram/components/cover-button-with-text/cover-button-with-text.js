// components/cover-button-with-text/cover-button-with-text.js
Component({
  properties: {
    iconPath: {
      type: String,
      value: "/images/icons/关注图标-选中.png",
    },
    text: {
      type: String,
      value: "888",
    }
  },

  externalClasses: ['custom-style', 'custom-style-text'],

  methods: {
    touchButton() {
      this.triggerEvent("touch")
    }
  }
})