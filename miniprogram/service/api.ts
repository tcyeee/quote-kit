import { get, post } from './http'

export const pingBackend = () => get("/ping")
export const login = (code: string) => post<LoginResponse>("/quote-kit/login", { code })

// 报价单
export const getQuoteDetail = (quoteId: string) => get<QuoteDetail>(`/quote-kit/quotes/${quoteId}`)
export const createQuoteDetail = (quoteDetail: QuoteDetail) => post<QuoteDetail>(`/quote-kit/quotes`, quoteDetail)
