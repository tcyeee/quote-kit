import { get, post } from './http'

export const pingBackend = () => get("/ping")
export const login = (code: string) => post<LoginResponse>("/quote-kit/login", { code })

