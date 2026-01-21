Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    quoteDetail: {} as QuoteDetail,
  },
  lifetimes: {
    attached() {
      const app = getApp<IAppOption>()
      this.setData({
        quoteDetail: app.globalData.quoteDetail,
      })
    },
  },
  methods: {
    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      const quoteDetail = {
        ...this.data.quoteDetail,
        theme,
      }
      this.setData({
        quoteDetail,
      })
      this.triggerEvent("update", { theme })
    },
    onProjectNameInput(e: any) {
      const projectName = e.detail.value as string
      const quoteDetail = {
        ...this.data.quoteDetail,
        projectName,
      }
      this.setData({
        quoteDetail,
      })
    },
    onProjectNameBlur(e: any) {
      const projectName = e.detail.value as string
      const quoteDetail = {
        ...this.data.quoteDetail,
        projectName,
      }
      this.setData({
        quoteDetail,
      })
      this.triggerEvent("update", { projectName })
    },
  },
})
