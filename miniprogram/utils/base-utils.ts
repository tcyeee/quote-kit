function randomHexDigit() {
    const num = Math.floor(Math.random() * 16)
    if (num < 10) return String(num)
    return String.fromCharCode(87 + num)
}

export function generateUuidV4() {
    const chars: string[] = []
    for (let i = 0; i < 36; i++) {
        chars[i] = randomHexDigit()
    }
    chars[14] = "4"
    chars[19] = "8"
    chars[8] = "-"
    chars[13] = "-"
    chars[18] = "-"
    chars[23] = "-"
    return chars.join("")
}

