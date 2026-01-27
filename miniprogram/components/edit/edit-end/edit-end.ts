import { calculateOverallDeliveryPeriodDays, calculateTotalAmount } from '../../../utils/quote-utils'
import { calculateExpiresAt } from '../../../utils/base-utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    quoteDetail: {} as QuoteDetail,
    linkExpireDays: 7,
    sendEndFlag: false,
  },
  lifetimes: {
    // 组件挂载时初始化报价详情、总价和链接有效期
    attached() {
      const quoteDetail = getApp<IAppOption>().globalData.quoteDetail
      const totalAmount = calculateTotalAmount(quoteDetail)
      calculateOverallDeliveryPeriodDays(quoteDetail)
      const nextQuoteDetail: QuoteDetail = {
        ...quoteDetail,
        expiresAt: new Date(Date.now() + this.data.linkExpireDays * 24 * 60 * 60 * 1000),
        computeData: {
          ...quoteDetail.computeData,
          totalAmount,
        },
      }
      const linkExpireDays = this.getInitialLinkExpireDays(nextQuoteDetail)
      this.setData({ quoteDetail: nextQuoteDetail, linkExpireDays })
      this.updateGlobalQuoteDetail(nextQuoteDetail)
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

    // 点击有效期选项时更新报价详情和显示状态
    onExpireDaysTap(e: any) {
      const days = this.getExpireDaysFromEvent(e)
      if (!days) return
      const quoteDetail = this.data.quoteDetail

      // 同步更新报价详情中的过期时间
      quoteDetail.expiresAt = calculateExpiresAt(new Date(), days)

      const currentComputeData = quoteDetail.computeData || ({} as QuoteComputeData)
      currentComputeData.expiresDays = days
      quoteDetail.computeData = currentComputeData

      this.setData({ quoteDetail, linkExpireDays: days })

      this.updateGlobalQuoteDetail(quoteDetail)
    },

    onSaveImage() {
      this.setData({ sendEndFlag: true })
      this.triggerEvent("saveimage")
    },

    onSaveExcel() {
      this.setData({ sendEndFlag: true })
      this.triggerEvent("saveexcel")
    },

    onShare() {
      this.setData({ sendEndFlag: true })
    },

    // 切换“发送前确认”对话框的显示状态
    toggleConfirmDialog() {
      // 清除发送结束标志
      this.setData({ sendEndFlag: false })
      // 删除全部信息中的ID
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail.id = undefined
      this.triggerEvent("toggleConfirmDialog", false)
    },

    // 将最新报价详情写回全局应用数据
    updateGlobalQuoteDetail(quoteDetail: QuoteDetail) {
      const app = getApp<IAppOption>()
      app.globalData.quoteDetail = quoteDetail
    },
  },
})
