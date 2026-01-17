Component({
  properties: {
    quoteDetail: {
      type: Object, value: {} as QuoteDetail, observer(newVal) {
        console.log("amber quoteDetail 更新：", newVal)
      },
    },
  },
})
