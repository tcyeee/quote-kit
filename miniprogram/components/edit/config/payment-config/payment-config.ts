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
    updateQuoteDetail(partial: Partial<QuoteDetail>) {
      const quoteDetail = {
        ...this.data.quoteDetail,
        ...partial,
      }
      this.setData({
        quoteDetail,
      })
      this.triggerEvent("update", partial)
    },

    onPayNodesChange(e: any) {
      const PayNodes = e.detail.payNodes as QuotePayNode[]
      this.updateQuoteDetail({ PayNodes })
    },

    onPayNodesBlur() {
      const PayNodes = (this.data.quoteDetail.PayNodes || []) as QuotePayNode[]
      this.updateQuoteDetail({ PayNodes })
    },
  },
})
