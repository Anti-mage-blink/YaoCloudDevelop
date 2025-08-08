Component({

  properties: {
    src: {
      type: String,
      value: "/images/icons/关注图标-选中.png",
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