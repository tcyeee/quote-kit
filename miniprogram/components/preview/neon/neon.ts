import { calculateTotalAmount } from '../../../utils/quote-utils'

Component({
  properties: {
    quoteDetail: { type: Object, value: {} as QuoteDetail },
    parentViewMode: { type: String, value: 'real' },
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
      const formatAmount = (value: number) => value.toFixed(2)
      this.setData({
        totalAmount,
        discountAmount,
        finalTotalAmount,
        totalAmountDisplay: formatAmount(totalAmount),
        discountAmountDisplay: formatAmount(discountAmount),
        finalTotalAmountDisplay: formatAmount(finalTotalAmount),
      })
    },
  },
  data: {
    totalAmount: 0,
    discountAmount: 0,
    finalTotalAmount: 0,
    totalAmountDisplay: '',
    discountAmountDisplay: '',
    finalTotalAmountDisplay: '',
  },
})
