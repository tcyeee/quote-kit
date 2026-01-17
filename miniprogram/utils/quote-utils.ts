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

// 计算分享状态
export function calculateShareStatus(shareDate: QuoteShareInfo): ShareStatus {
    let shareStatus: ShareStatus = "normal"

    if (shareDate?.isManuallyOfflined) {
        shareStatus = "offlined"
    } else if (shareDate?.expiresAt) {
        const expiresAt =
            shareDate.expiresAt instanceof Date
                ? shareDate.expiresAt
                : new Date(shareDate.expiresAt)
        if (expiresAt.getTime() < Date.now()) {
            shareStatus = "expired"
        }
    }
    return shareStatus
}

// 计算每个quoteDetail.items的总价,总时间, 并存入 quoteDetail.items[n].computeData中
export function calculateItemTotalAmountAndDeliveryPeriodDays(quoteDetail: QuotePricingCategory[]) {
    quoteDetail.forEach(category => {
        const items = category.items || []
        items.forEach(item => {
            const days = typeof item.deliveryPeriodDays === "number" ? item.deliveryPeriodDays : 0
            const quantity = typeof item.quantity === "number" ? item.quantity : 0
            const unitPrice = typeof item.unitPrice === "number" ? item.unitPrice : 0
            const amount = unitPrice * quantity
            item.computeData = {
                amount,
                deliveryPeriodDays: days * quantity,
            }
        })
    })
}