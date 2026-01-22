import { calculateExpiresAt } from "./base-utils"

let db: DB.Database | undefined

function getDbInstance() {
    return db || (db = wx.cloud.database())
}

class DB_LIST {
    static readonly UserEditQuote = "UserEditQuote"
    static readonly ShareQuoteViewLog = "ShareQuoteViewLog"
    static readonly UserShareQuote = "UserShareQuote"
}

/* 用户正在编辑的报价单数据 GET */
export async function getDefaultQuoteDetail(): Promise<QuoteDetail> {
    const db = getDbInstance()
    const info = await db.collection(DB_LIST.UserEditQuote).get()
    return info.data[0] as QuoteDetail || appDefaultQuote()
}

/* 用户正在编辑的报价单数据 SET */
export async function setDefaultQuoteDetail() {
    const db = getDbInstance()
    const info = appDefaultQuote()
    db.collection(DB_LIST.UserEditQuote).add({ data: info })
}

/* 分享信息查看日志 GET（批量，根据多个 quoteId 一次查询） */
export async function getShareQuoteLog(quoteIdList: string[]): Promise<QuoteViewLog[]> {
    const db = getDbInstance()
    const command = db.command
    const res = await db
        .collection(DB_LIST.ShareQuoteViewLog)
        .where({ quoteId: command.in(quoteIdList) })
        .orderBy("viewTime", "desc")
        .get()
    return res.data as QuoteViewLog[]
}

/* 分享信息查看日志 SET */
export async function setShareQuoteLog(quoteId: string) {
    const db = getDbInstance()
    const systemInfo = wx.getSystemInfoSync()
    const app = getApp<IAppOption>()
    var globalData = app.globalData
    const info = {
        quoteId: quoteId,
        viewerId: globalData.uid || "unknown",
        viewerDevice: systemInfo.platform,
        viewerSystem: systemInfo.system,
        viewTime: new Date(),
    }
    db.collection(DB_LIST.ShareQuoteViewLog).add({ data: info })
}

/* 分享信息 UPDATE(下架) */
export async function offlineShareQuote(quoteId: string) {
    const db = getDbInstance()
    db.collection(DB_LIST.UserShareQuote).doc(quoteId).update({
        data: { shareDate: { isManuallyOfflined: true } }
    })
}

/* 分享信息 UPDATE(重新上架) */
export async function onlineShareQuote(quoteId: string, expiresDays: number) {
    const db = getDbInstance()
    const base = new Date()
    const shareDate = {
        createdAt: base,
        expiresAt: calculateExpiresAt(base, expiresDays),
    }
    await db.collection(DB_LIST.UserShareQuote).doc(quoteId).update({
        data: { shareDate }
    })
    return shareDate
}

/* 分享信息 DELETE */
export async function delShareQuote(quoteId: string) {
    const db = getDbInstance()
    db.collection(DB_LIST.UserShareQuote).doc(quoteId).remove()
}

/* 分享信息 GET */
export async function getMyShareQuoteList(): Promise<QuoteDetail[]> {
    const db = getDbInstance()
    const res = await db.collection(DB_LIST.UserShareQuote)
        .where({ _openid: getApp<IAppOption>().globalData.uid || "unknown" })
        .get()
    return res.data as QuoteDetail[]
}

export async function getShareQuoteById(quoteId: string): Promise<QuoteDetail> {
    const db = getDbInstance()
    const res = await db.collection(DB_LIST.UserShareQuote)
        .doc(quoteId)
        .get()
    return res.data as QuoteDetail
}

/* 分享信息 SET */
export async function setShareQuote(): Promise<string> {
    const db = getDbInstance()
    const app = getApp<IAppOption>()
    var data = app.globalData.quoteDetail
    // 添加上shareData
    data.shareDate = {
        createdAt: new Date(),
        expiresAt: calculateExpiresAt(new Date(), data.computeData?.expiresDays || 7),
    }
    return db.collection("UserShareQuote").add({ data: data }).then((res) => {
        return res._id as string
    })
}

export function appDefaultQuote(): QuoteDetail {
    return {
        theme: "amber",
        projectName: "某公司UI设计项目",
        computeData: {
            expiresDays: 7,
        },
        domain: {
            name: "一家设计工作室",
            logoUrl: "https://example.com/assets/logo.png",
        },
        PayNodes: [{
            nodeName: "定金",
            nodeRatio: 0.3,
        }, {
            nodeName: "尾款",
            nodeRatio: 0.7,
        }],
        pricingItems: [{
            name: "品牌设计",
            items: [
                { name: "标志(LOGO)设计", description: null, unit: "项", unitPrice: 600, quantity: 1, deliveryPeriodDays: 5 },
                { name: "品牌视觉识别(VI)设计", description: null, unit: "项", unitPrice: 4000, quantity: 1, deliveryPeriodDays: -1 },
            ]
        }, {
            name: "平面设计",
            items: [
                { name: "海报设计", description: null, unit: "张", unitPrice: 200, quantity: 5, deliveryPeriodDays: 2 },
                { name: "名片/会员卡设计", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "DM/宣传单", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "画册/手册/宣传册", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "展架/易拉宝设计", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "主KV画面设计", description: null, unit: "项", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "文化墙", description: null, unit: "平方米", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
            ],
        }],
    }
}
