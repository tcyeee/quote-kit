export function calculateExpiresAt(base: Date, expiresDays: number) {
    return new Date(base.getTime() + expiresDays * 24 * 60 * 60 * 1000)
}

export function formatDateTime(value?: any) {
    if (!value) return ""
    const date = value instanceof Date ? value : new Date(value)
    if (!date || typeof date.getTime !== "function" || Number.isNaN(date.getTime())) return ""
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    const hours = `${date.getHours()}`.padStart(2, "0")
    const minutes = `${date.getMinutes()}`.padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}`
}