import { get, post } from './http'

export const pingBackend = () => get("/ping")
export const login = (code: string) => post<LoginResponse>("/quote-kit/login", { code })

// 报价单
export const getQuoteAction = () => get<QuoteAnalyze>("/quote-kit/analyze")
export const getQuoteDetail = (quoteId: string) => get<QuoteDetailWithId>(`/quote-kit/quotes/${quoteId}`)
export const createQuoteDetail = (quoteDetail: QuoteDetail) => post<QuoteDetailWithId>(`/quote-kit/quotes`, quoteDetail)
