type CollapseStatus = {
  theme: boolean,
  company: boolean,
  service: boolean,
  payment: boolean,
  remark: boolean,
}

Component({
  data: {
    quoteDetail: {} as QuoteDetail,
    CollapseStatus: {
      theme: false,
      company: false,
      service: false,
      payment: false,
      remark: false,
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        quoteDetail: getApp<IAppOption>().globalData.quoteDetail,
      })
    },
  },
  methods: {
    onSaveImageTap() {
      wx.showToast({ title: "当前版本不支持", icon: "none" })
    },

    onThemeTap(e: any) {
      const theme = e.currentTarget.dataset.theme as string
      this.setData({ quoteDetail: { ...this.data.quoteDetail, theme } })
      this.quoteDetailUpdate()
    },

    onDomainNameInput(e: any) {
      const name = e.detail.value as string
      this.setData({
        quoteDetail: {
          ...this.data.quoteDetail,
          domain: {
            ...this.data.quoteDetail.domain,
            name,
          },
        },
      })
    },

    onDomainNameBlur() {
      this.quoteDetailUpdate()
    },

    onToggleSection(e: any) {
      const section = e.currentTarget.dataset.section as keyof CollapseStatus
      const CollapseStatus = this.data.CollapseStatus
      this.setData({
        CollapseStatus: { ...CollapseStatus, [section]: !CollapseStatus[section] },
      })
    },

    quoteDetailUpdate() {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = this.data.quoteDetail
      this.triggerEvent("quoteDetailUpdate")
    },
  },
})
