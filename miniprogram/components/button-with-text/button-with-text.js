// components/button-with-text/button-with-text.js
Component({

  properties: {
    src: {
      type: String,
      value: "/images/icons/关注图标-选中.png",
    },
    text: {
      type: String,
      value: "待填写text"
    },
    
  },


  data: {

  },

  externalClass: ['custom-style'],

  methods: {
    tapButton() {
      this.triggerEvent("touch")
    }
  }
})