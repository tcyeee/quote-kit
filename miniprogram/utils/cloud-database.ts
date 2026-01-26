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
        data: {
            shareDate: { isManuallyOfflined: true },
            removeFlag: true,
        }
    })
}

/* 分享信息 UPDATE(重新上架) */
export async function onlineShareQuote(quoteId: string, expiresDays: number) {
    const db = getDbInstance()
    const base = new Date()
    const expiresAt = calculateExpiresAt(base, expiresDays)
    const shareDate = {
        createdAt: base,
        expiresAt,
    }
    await db.collection(DB_LIST.UserShareQuote).doc(quoteId).update({
        data: {
            shareDate,
            expiresAt,
            removeFlag: false,
            deleteFlag: false,
        }
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

export function appDefaultQuote(): QuoteDetail {
    return {
        theme: "sky",
        projectName: "某公司UI设计项目",
        businessDiscountAmount: 500,
        deleteFlag: false,
        removeFlag: false,
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
        serviceTerms: "1.以上价格不包含第三方产生的额外费用\n2.服务内容变更需重新评估周期与成本。\n3.所有交付物在尾款支付完成后正式移交。",
        pricingItems: [{
            name: "品牌设计",
            items: [
                { name: "标志(LOGO)设计", description: null, unit: "个", unitPrice: 600, quantity: 1, deliveryPeriodDays: 5 },
                { name: "品牌视觉识别(VI)设计", description: null, unit: "项", unitPrice: 4000, quantity: 1, deliveryPeriodDays: -1 },
            ]
        }, {
            name: "平面设计",
            items: [
                { name: "海报设计", description: null, unit: "张", unitPrice: 200, quantity: 5, deliveryPeriodDays: 2 },
                { name: "名片/会员卡设计", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "DM/宣传单", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "画册/手册/宣传册", description: null, unit: "张", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
                { name: "文化墙", description: null, unit: "平方米", unitPrice: 150, quantity: 1, deliveryPeriodDays: 15 },
            ],
        }],
    }
}
