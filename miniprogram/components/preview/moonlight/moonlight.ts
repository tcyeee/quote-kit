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
      const formatAmount = (value: number) => value.toFixed(2)
      this.setData({
        totalAmount,
        finalTotalAmount,
        discountAmount,
        payNodes,
        totalAmountDisplay: formatAmount(totalAmount),
        discountAmountDisplay: formatAmount(discountAmount),
        finalTotalAmountDisplay: formatAmount(finalTotalAmount),
      })
    },
  },
  data: {
    totalAmount: 0,
    finalTotalAmount: 0,
    discountAmount: 0,
    totalAmountDisplay: '',
    discountAmountDisplay: '',
    finalTotalAmountDisplay: '',
    payNodes: [] as Array<QuotePayNode & { amount: number }>,
  },
})
