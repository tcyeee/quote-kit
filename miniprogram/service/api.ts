import { del, get, post, put } from './http'

export const pingBackend = () => get("/ping")
export const login = (code: string) => post<LoginResponse>("/quote-kit/login", { code })

// 报价单
export const getQuoteAction = () => get<QuoteAnalyze>("/quote-kit/analyze")
export const getQuoteDetail = (quoteId: string) => get<QuoteDetailWithId>(`/quote-kit/quotes/${quoteId}`)
export const createQuoteDetail = (quoteDetail: QuoteDetail) => post<QuoteDetailWithId>(`/quote-kit/quotes`, quoteDetail)
export const delQuoteDetail = (quoteId: string) => del<QuoteDetailWithId>(`/quote-kit/quotes/${quoteId}`)
export const updateQuoteDetail = (quoteId: string, quoteDetail: QuoteDetail) => put<QuoteDetailWithId>(`/quote-kit/quotes/${quoteId}`, quoteDetail)
export const offlineQuoteDetail = (quoteId: string) => put<QuoteDetailWithId>(`/quote-kit/quotes/${quoteId}/remove`)

// 阅读记录
export const addViewLog = (viewLog: QuoteViewLog) => post<QuoteViewLog>("/quote-kit/view-logs", viewLog)
