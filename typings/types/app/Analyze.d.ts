interface QuoteAnalyze {
    quotes: QuoteAnalyzeItem[]
    total: number
}

interface QuoteAnalyzeItem extends QuoteDetailWithId {
    viewCount: number,
    viewLogs: QuoteViewLogWithId[]
}