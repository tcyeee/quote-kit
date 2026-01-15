// 计算当前报价单的总体交付周期（天）
export function calculateOverallDeliveryPeriodDays(quoteDetail: QuoteDetail) {
    const pricingItems = quoteDetail.pricingItems || []
    let total = 0
    pricingItems.forEach(category => {
        const items = category.items || []
        items.forEach(item => {
            const days = typeof item.deliveryPeriodDays === "number" ? item.deliveryPeriodDays : 0
            const quantity = typeof item.quantity === "number" ? item.quantity : 0
            if (days > 0 && quantity > 0) {
                total += days * quantity
            }
        })
    })
    return total
}

// 计算当前报价单的总金额
export function calculateTotalAmount(quoteDetail: QuoteDetail) {
    const pricingItems = quoteDetail.pricingItems || []
    let totalAmount = 0
    pricingItems.forEach(category => {
        const items = category.items || []
        items.forEach(item => {
            totalAmount += item.unitPrice * item.quantity
        })
    })
    return totalAmount
}