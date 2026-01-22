import { calculateTotalAmount } from '../../../utils/quote-utils'

Component({
  properties: {
    quoteDetail: { type: Object, value: {} as QuoteDetail },
  },
  observers: {
    quoteDetail(quoteDetail: QuoteDetail) {
      if (!quoteDetail) return
      const totalAmount = calculateTotalAmount(quoteDetail)
      const payNodes = (quoteDetail.PayNodes || []).map((node) => ({
        ...node,
        amount: Math.round(totalAmount * (node.nodeRatio || 0)),
      }))
      this.setData({ totalAmount, payNodes })
    },
  },
  data: {
    totalAmount: 0,
    payNodes: [] as Array<QuotePayNode & { amount: number }>,
  },
})
