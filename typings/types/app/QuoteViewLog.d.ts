interface QuoteViewLog {
    // 报价单ID
    quoteId: string,
    // 访客ID
    viewerId: string,
    // 访客所用设备
    viewerDevice: string,
    // 访客所用系统
    viewerSystem: string,
    // 查看时间
    viewTime: Date,
}