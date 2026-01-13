Component({
  data: {
    clientName: "",
    depositRatioPercent: 0,
    finalPaymentRatioPercent: 0,
    overallDeliveryPeriodDays: 0,
    serviceTerms: "",
    currentTheme: "",
    isThemeCollapsed: false,
    isCompanyCollapsed: false,
    isServiceCollapsed: false,
    isPaymentCollapsed: false,
    isRemarkCollapsed: false,
  },
  lifetimes: {
    attached() {
      const {
        client,
        serviceProcess,
        overallDeliveryPeriodDays,
        serviceTerms,
        theme,
      } = getApp<IAppOption>().globalData.quoteDetail

      this.setData({
        clientName: client.name,
        depositRatioPercent: serviceProcess.depositRatio * 100,
        finalPaymentRatioPercent: serviceProcess.finalPaymentRatio * 100,
        overallDeliveryPeriodDays,
        serviceTerms,
        currentTheme: theme,
      })
    },
  },
  methods: {
    onSaveImageTap() {
      wx.showToast({
        title: "当前版本不支持",
        icon: "none",
      })
    },
    onClientNameInput(e: any) {
      const value = e.detail.value
      this.setData({
        clientName: value,
      })
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.client.name = value
    },
    onOverallDeliveryPeriodInput(e: any) {
      const value = parseInt(e.detail.value, 10)
      const days = Number.isNaN(value) ? 0 : value
      this.setData({
        overallDeliveryPeriodDays: days,
      })
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.overallDeliveryPeriodDays = days
    },
    onDepositRatioInput(e: any) {
      const value = parseFloat(e.detail.value)
      const ratioPercent = Number.isNaN(value) ? 0 : value
      this.setData({
        depositRatioPercent: ratioPercent,
      })
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.serviceProcess.depositRatio =
        ratioPercent / 100
    },
    onFinalPaymentRatioInput(e: any) {
      const value = parseFloat(e.detail.value)
      const ratioPercent = Number.isNaN(value) ? 0 : value
      this.setData({
        finalPaymentRatioPercent: ratioPercent,
      })
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.serviceProcess.finalPaymentRatio =
        ratioPercent / 100
    },
    onServiceTermsInput(e: any) {
      const value = e.detail.value
      this.setData({
        serviceTerms: value,
      })
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.serviceTerms = value
    },
    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      this.setData({ currentTheme: theme })
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.theme = theme
    },
    onToggleThemeSection() {
      this.setData({
        isThemeCollapsed: !this.data.isThemeCollapsed,
      })
    },
    onToggleCompanySection() {
      this.setData({
        isCompanyCollapsed: !this.data.isCompanyCollapsed,
      })
    },
    onToggleServiceSection() {
      this.setData({
        isServiceCollapsed: !this.data.isServiceCollapsed,
      })
    },
    onTogglePaymentSection() {
      this.setData({
        isPaymentCollapsed: !this.data.isPaymentCollapsed,
      })
    },
    onToggleRemarkSection() {
      this.setData({
        isRemarkCollapsed: !this.data.isRemarkCollapsed,
      })
    },
  },
})
