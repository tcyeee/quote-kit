import { calculateTotalAmount } from '../../../utils/quote-utils'

Component({
  properties: {
    quoteDetail: { type: Object, value: {} as QuoteDetail },
  },
  observers: {
    quoteDetail(quoteDetail: QuoteDetail) {
      if (!quoteDetail) return
      const totalAmount = calculateTotalAmount(quoteDetail)
      const discountAmount =
        typeof quoteDetail.businessDiscountAmount === "number"
          ? quoteDetail.businessDiscountAmount
          : 0
      const finalTotalAmount = Math.max(totalAmount - discountAmount, 0)
      const payNodes = (quoteDetail.PayNodes || []).map((node) => ({
        ...node,
        amount: Math.round(finalTotalAmount * (node.nodeRatio || 0)),
      }))
      this.setData({ totalAmount, finalTotalAmount, discountAmount, payNodes })
    },
  },
  data: {
    totalAmount: 0,
    finalTotalAmount: 0,
    discountAmount: 0,
    payNodes: [] as Array<QuotePayNode & { amount: number }>,
  },
})
