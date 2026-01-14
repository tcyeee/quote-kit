let savingToastTimer: any = null

Component({
  data: {
    visible: false,
  },
  methods: {
    show() {
      if (savingToastTimer) {
        clearTimeout(savingToastTimer)
        savingToastTimer = null
      }
      this.setData({
        visible: true,
      })
      savingToastTimer = setTimeout(() => {
        this.setData({
          visible: false,
        })
        savingToastTimer = null
      }, 500)
    },
  },
})

