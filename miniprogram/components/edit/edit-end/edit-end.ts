import { calculateOverallDeliveryPeriodDays, calculateTotalAmount } from '../../../utils/quote-utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    quoteDetail: {} as QuoteDetail,
    linkExpireDays: 7,
  },
  lifetimes: {
    // 组件挂载时初始化报价详情、总价和链接有效期
    attached() {
      const quoteDetail = getApp<IAppOption>().globalData.quoteDetail
      const totalAmount = calculateTotalAmount(quoteDetail)
      calculateOverallDeliveryPeriodDays(quoteDetail)
      const nextQuoteDetail: QuoteDetail = {
        ...quoteDetail,
        computeData: {
          ...quoteDetail.computeData,
          totalAmount,
        },
      }
      const linkExpireDays = this.getInitialLinkExpireDays(nextQuoteDetail)
      this.setData({
        quoteDetail: nextQuoteDetail,
        linkExpireDays,
      })
    },
  },
  methods: {

    // 获取初始的链接有效期（天），带默认值兜底
    getInitialLinkExpireDays(quoteDetail: QuoteDetail) {
      const computeData = quoteDetail.computeData
      if (!computeData) return 7
      const expiresDays = computeData.expiresDays
      return typeof expiresDays === "number" ? expiresDays : 7
    },

    getExpireDaysFromEvent(e: any) {
      const rawDays = e.currentTarget.dataset.days
      const days = Number(rawDays)
      return Number.isNaN(days) ? 0 : days
    },

    // 基于当前报价详情构建更新后的 computeData（只更新 expiresDays）
    buildNextComputeData(quoteDetail: QuoteDetail, days: number): QuoteComputeData {
      const currentComputeData = quoteDetail.computeData || ({} as QuoteComputeData)
      return {
        ...currentComputeData,
        expiresDays: days,
      }
    },

    // 构建包含最新 expiresDays 的报价详情对象
    buildNextQuoteDetailWithExpiresDays(quoteDetail: QuoteDetail, days: number): QuoteDetail {
      const nextComputeData = this.buildNextComputeData(quoteDetail, days)
      return {
        ...quoteDetail,
        computeData: nextComputeData,
      }
    },

    // 同步组件内部状态并更新全局报价详情
    updateQuoteDetailAndState(nextQuoteDetail: QuoteDetail, days: number) {
      this.setData({
        quoteDetail: nextQuoteDetail,
        linkExpireDays: days,
      })
      this.updateGlobalQuoteDetail(nextQuoteDetail)
    },

    // 点击有效期选项时更新报价详情和显示状态
    onExpireDaysTap(e: any) {
      const days = this.getExpireDaysFromEvent(e)
      if (!days) return
      const quoteDetail = this.data.quoteDetail
      const nextQuoteDetail = this.buildNextQuoteDetailWithExpiresDays(quoteDetail, days)
      this.updateQuoteDetailAndState(nextQuoteDetail, days)
    },

    onSaveImage() {
      this.triggerEvent("saveimage")
    },


    // 切换“发送前确认”对话框的显示状态
    toggleConfirmDialog() {
      this.triggerEvent("toggleConfirmDialog", false)
    },

    // 将最新报价详情写回全局应用数据
    updateGlobalQuoteDetail(quoteDetail: QuoteDetail) {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = quoteDetail
    },
  },
})
