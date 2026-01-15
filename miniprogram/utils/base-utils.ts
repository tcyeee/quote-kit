export function calculateExpiresAt(base: Date, expiresDays: number) {
    return new Date(base.getTime() + expiresDays * 24 * 60 * 60 * 1000)
}
