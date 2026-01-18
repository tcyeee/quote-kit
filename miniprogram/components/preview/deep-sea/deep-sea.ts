import { calculateTotalAmount } from '../../../utils/quote-utils'

Component({
  properties: {
    quoteDetail: {
      type: Object,
      value: {} as QuoteDetail,
    },
  },
  observers: {
    quoteDetail(quoteDetail: QuoteDetail) {
      if (!quoteDetail) return
      const totalAmount = calculateTotalAmount(quoteDetail)
      this.setData({ totalAmount })
    },
  },
  data: {
    totalAmount: 0,
  },
})
