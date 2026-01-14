Component({
  data: {
    visible: false,
    topPadding: 0,
    duration: 1800,
  },
  lifetimes: {
    attached() {
      const info = wx.getSystemInfoSync()
      const safeTop =
        (info as any).safeAreaInsets?.top ??
        (info as any).safeArea?.top ??
        info.statusBarHeight ??
        0
      this.setData({
        topPadding: safeTop,
      })
    },
  },
  methods: {
    show() {
      const self = this as any
      if (self._savingToastTimer) {
        clearTimeout(self._savingToastTimer)
        self._savingToastTimer = null
      }
      this.setData({
        visible: true,
      })
      self._savingToastTimer = setTimeout(() => {
        this.setData({
          visible: false,
        })
        self._savingToastTimer = null
      }, this.data.duration)
    },
  },
})
