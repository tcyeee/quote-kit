const PRICES = {
  type: {
    line: 300,
    illustration: 450,
    painterly: 650,
    realism: 900,
  },
  scene: {
    indoor: 1.0,
    outdoor: 1.2,
    ceiling: 1.2,
    ground: 1.3,
  },
}

const RULES = {
  minAreaThreshold: 10,
  minPrice: 5000,
}

const SCENE_PREVIEW_NAME: Record<string, string> = {
  indoor: "高品质室内",
  outdoor: "商业外墙",
  ceiling: "天顶艺术",
  ground: "创意地面",
}

function toNumber(value: string): number {
  const n = parseFloat(value)
  if (!Number.isFinite(n) || Number.isNaN(n)) return 0
  return n
}

function formatNumber(num: number): string {
  const s = Math.round(num).toString()
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function drawCoverImage(
  ctx: WechatMiniprogram.CanvasRenderingContext2D,
  canvas: WechatMiniprogram.Canvas,
  src: string,
  x: number,
  y: number,
  w: number,
  h: number,
): Promise<void> {
  return new Promise((resolve) => {
    const img = canvas.createImage()
    img.onload = () => {
      const iw = img.width || 1
      const ih = img.height || 1
      const scale = Math.max(w / iw, h / ih)
      const sw = Math.min(iw, w / scale)
      const sh = Math.min(ih, h / scale)
      const sx = Math.max(0, (iw - sw) / 2)
      const sy = Math.max(0, (ih - sh) / 2)
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
      resolve()
    }
    img.onerror = () => resolve()
    img.src = src
  })
}

Component({
  data: {
    customerName: "",
    area: "",
    selectedType: "illustration",
    selectedScene: "indoor",
    typePrices: {
      line: 300,
      illustration: 450,
      painterly: 650,
      realism: 900,
    } as Record<string, number>,
    discountFlat: 50,
    discountMaterial: 0,
    artTypes: [
      { key: "line", label: "简约线条", img: "/assets/type_1.png" },
      { key: "illustration", label: "插画设计", img: "/assets/type_2.jpg" },
      { key: "painterly", label: "创意涂鸦", img: "/assets/type_3.jpg" },
      { key: "realism", label: "写实/3D", img: "/assets/type_4.JPG" },
    ],
    scenes: [
      { key: "indoor", label: "普通室内墙面", coeff: 1.0 },
      { key: "outdoor", label: "户外/外墙施工", coeff: 1.2 },
      { key: "ceiling", label: "高空天顶绘制", coeff: 1.2 },
      { key: "ground", label: "创意地面/台阶", coeff: 1.3 },
    ],
    badges: [] as Array<{ type: string; text: string }>,
    finalPrice: 0,
    finalPriceText: "0",
    hasMinPriceRule: false,
    minPriceText: "5,000",
    previewDate: "",
    previewImage: "/assets/type_2.jpg",
    previewStyleName: "-",
    previewArea: "-",
    previewScene: "-",
    previewDiscountFee: "- ¥0",
    previewTotalPrice: "¥0",
    hasCustomerName: false,
    isSaving: false,
  },
  lifetimes: {
    attached() {
      const cachedArea = wx.getStorageSync("painting_area")
      if (cachedArea) {
        this.setData({ area: String(cachedArea) })
      }
      const today = new Date()
      const dateText = `Date: ${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
      this.setData({
        previewDate: dateText,
      })
      this.recalculate()
    },
  },
  methods: {
    onCustomerNameInput(e: WechatMiniprogram.Input) {
      const value = e.detail.value || ""
      this.setData(
        {
          customerName: value,
          hasCustomerName: !!value.trim(),
        },
        () => {
          this.updatePreview()
        },
      )
    },
    onAreaInput(e: WechatMiniprogram.Input) {
      const value = e.detail.value || ""
      this.setData(
        {
          area: value,
        },
        () => {
          wx.setStorageSync("painting_area", value)
          this.recalculate()
        },
      )
    },
    onTypeChange(e: WechatMiniprogram.RadioGroupChange) {
      const selected = e.detail.value || "illustration"
      this.setData(
        {
          selectedType: selected,
        },
        () => {
          this.recalculate()
        },
      )
    },
    onTypePriceInput(e: WechatMiniprogram.Input) {
      const key = e.currentTarget.dataset.key as string
      const value = toNumber(e.detail.value || "")
      const typePrices = this.data.typePrices
      typePrices[key] = value
      this.setData(
        {
          typePrices,
        },
        () => {
          this.recalculate()
        },
      )
    },
    onSceneChange(e: WechatMiniprogram.RadioGroupChange) {
      const selected = e.detail.value || "indoor"
      this.setData(
        {
          selectedScene: selected,
        },
        () => {
          this.recalculate()
        },
      )
    },
    onDiscountFlatInput(e: WechatMiniprogram.Input) {
      const value = toNumber(e.detail.value || "")
      this.setData(
        {
          discountFlat: value,
        },
        () => {
          this.recalculate()
        },
      )
    },
    onDiscountMaterialInput(e: WechatMiniprogram.Input) {
      const value = toNumber(e.detail.value || "")
      this.setData(
        {
          discountMaterial: value,
        },
        () => {
          this.recalculate()
        },
      )
    },
    recalculate() {
      const areaNum = toNumber(this.data.area)
      if (areaNum <= 0) {
        this.setData({
          finalPrice: 0,
          finalPriceText: "0",
          badges: [],
          hasMinPriceRule: false,
          previewArea: "-",
          previewDiscountFee: "- ¥0",
          previewTotalPrice: "¥0",
          previewScene: "-",
        })
        this.updatePreview()
        return
      }

      const typeKey = this.data.selectedType as keyof typeof PRICES.type
      const baseUnitDefault = PRICES.type[typeKey]
      const customUnit = this.data.typePrices[typeKey] || baseUnitDefault
      const unitPrice = customUnit > 0 ? customUnit : baseUnitDefault

      const discountPerSqm = this.data.discountFlat >= 0 ? this.data.discountFlat : 0
      const materialDiscount = this.data.discountMaterial >= 0 ? this.data.discountMaterial : 0

      const discountedUnit = unitPrice - discountPerSqm
      let subtotal = discountedUnit * areaNum

      const sceneKey = this.data.selectedScene as keyof typeof PRICES.scene
      const sceneCoeff = PRICES.scene[sceneKey] || 1.0
      let total = subtotal * sceneCoeff

      total -= materialDiscount
      if (total < 0) total = 0

      let appliedRule = false
      if (areaNum <= RULES.minAreaThreshold && total < RULES.minPrice) {
        total = RULES.minPrice
        appliedRule = true
      }

      const finalPrice = Math.round(total)
      const finalPriceText = formatNumber(finalPrice)

      const badges: Array<{ type: string; text: string }> = []
      if (discountPerSqm > 0) {
        badges.push({
          type: "discount",
          text: `大面积优惠 -${discountPerSqm}/㎡`,
        })
      }
      if (materialDiscount > 0) {
        badges.push({
          type: "discount",
          text: `材料减免 -¥${formatNumber(materialDiscount)}`,
        })
      }
      if (appliedRule) {
        badges.push({
          type: "boundary",
          text: `起步价保护 (¥${formatNumber(RULES.minPrice)})`,
        })
      }

      const discountFee = discountPerSqm * areaNum + materialDiscount
      const previewDiscountFee = `- ¥${formatNumber(discountFee)}`
      const previewTotalPrice = `¥${finalPriceText}`

      const previewArea = `${areaNum} ㎡`

      this.setData(
        {
          finalPrice,
          finalPriceText,
          badges,
          hasMinPriceRule: appliedRule,
          minPriceText: formatNumber(RULES.minPrice),
          previewDiscountFee,
          previewTotalPrice,
          previewArea,
        },
        () => {
          this.updatePreview()
        },
      )
    },
    updatePreview() {
      const typeKey = this.data.selectedType
      const areaNum = toNumber(this.data.area)
      const sceneKey = this.data.selectedScene

      const typeItem = this.data.artTypes.find((t) => t.key === typeKey) || this.data.artTypes[1]
      const sceneItem = this.data.scenes.find((s) => s.key === sceneKey) || this.data.scenes[0]

      const previewScene = sceneItem ? SCENE_PREVIEW_NAME[sceneItem.key] || sceneItem.label : "-"

      const img = typeItem.img
      const styleName = typeItem.label

      const previewArea = areaNum > 0 ? `${areaNum} ㎡` : "-"

      this.setData({
        previewImage: img,
        previewStyleName: styleName,
        previewScene,
        previewArea,
      })
    },
    async onSaveImage() {
      if (this.data.isSaving) return
      this.setData({ isSaving: true })
      wx.showLoading({ title: "生成中", mask: true })

      wx.createSelectorQuery()
        .in(this)
        .select("#quoteCanvas")
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const target = res && res[0]
          if (!target || !target.node) {
            wx.hideLoading()
            this.setData({ isSaving: false })
            wx.showToast({ title: "生成失败，请重试", icon: "none" })
            return
          }

          const canvas = target.node as WechatMiniprogram.Canvas
          const ctx = canvas.getContext("2d") as WechatMiniprogram.CanvasRenderingContext2D
          const dpr = wx.getSystemInfoSync().pixelRatio || 1
          const width = target.width
          const height = target.height
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)

          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, width, height)
          ctx.strokeStyle = "#e2e8f0"
          ctx.lineWidth = 1
          ctx.strokeRect(0.5, 0.5, width - 1, height - 1)
          ctx.fillStyle = "#1a1a1a"
          ctx.fillRect(0, 0, width, 4)

          const padding = 20
          let cursorY = padding + 10

          ctx.fillStyle = "#1a1a1a"
          ctx.font = "700 20px sans-serif"
          ctx.fillText("姐姐墙绘 报价单", padding, cursorY)
          cursorY += 22

          if (this.data.hasCustomerName) {
            ctx.font = "600 14px sans-serif"
            ctx.fillText(`尊敬的 ${this.data.customerName}`, padding, cursorY)
            cursorY += 18
          }

          ctx.font = "12px monospace"
          ctx.fillStyle = "#6c6863"
          ctx.fillText(this.data.previewDate, padding, cursorY)
          cursorY += 14

          const imgY = cursorY + 12
          const imgH = 180
          await drawCoverImage(ctx, canvas, this.data.previewImage, padding, imgY, width - padding * 2, imgH)
          ctx.strokeStyle = "#e2e8f0"
          ctx.strokeRect(padding, imgY, width - padding * 2, imgH)
          cursorY = imgY + imgH + 24

          const drawSectionTitle = (title: string) => {
            ctx.font = "11px sans-serif"
            ctx.fillStyle = "#6c6863"
            ctx.fillText(title.toUpperCase(), padding, cursorY)
            cursorY += 10
            ctx.beginPath()
            ctx.moveTo(padding, cursorY)
            ctx.lineTo(width - padding, cursorY)
            ctx.strokeStyle = "#e2e8f0"
            ctx.lineWidth = 1
            ctx.stroke()
            cursorY += 14
          }

          const drawInfoRow = (label: string, value: string) => {
            ctx.font = "12px sans-serif"
            ctx.fillStyle = "#6c6863"
            ctx.fillText(label, padding, cursorY)
            ctx.font = "14px serif"
            ctx.fillStyle = "#1a1a1a"
            const textWidth = ctx.measureText(value).width
            ctx.fillText(value, width - padding - textWidth, cursorY)
            cursorY += 18
          }

          drawSectionTitle("方案概览")
          drawInfoRow("墙绘类型", this.data.previewStyleName || "-")
          drawInfoRow("预估面积", this.data.previewArea || "-")
          drawInfoRow("环境方案", this.data.previewScene || "-")
          cursorY += 6
          ctx.setLineDash([3, 3])
          ctx.strokeStyle = "#e2e8f0"
          ctx.beginPath()
          ctx.moveTo(padding, cursorY)
          ctx.lineTo(width - padding, cursorY)
          ctx.stroke()
          ctx.setLineDash([])
          cursorY += 18

          drawSectionTitle("费用构成")
          drawInfoRow("规模减免", this.data.previewDiscountFee)
          drawInfoRow("预估折合总计", this.data.previewTotalPrice)
          cursorY += 16

          ctx.font = "12px sans-serif"
          ctx.fillStyle = "#6c6863"
          ctx.fillText("* 建议估算价，正式报价以合同为准", padding, cursorY)
          cursorY += 18

          ctx.font = "32px serif"
          ctx.fillStyle = "#1a1a1a"
          ctx.fillText(`¥${this.data.finalPriceText}`, padding, cursorY)
          if (this.data.hasMinPriceRule) {
            cursorY += 20
            ctx.font = "12px sans-serif"
            ctx.fillStyle = "#b00020"
            ctx.fillText(`已应用起步价保护，按 ¥${this.data.minPriceText} 计价`, padding, cursorY)
          }

          if (this.data.badges.length) {
            cursorY += 28
            let badgeX = padding
            const badgeY = cursorY
            this.data.badges.forEach((badge) => {
              const text = badge.text
              const textWidth = ctx.measureText(text).width + 16
              ctx.fillStyle = badge.type === "discount" ? "rgba(212,175,55,0.12)" : "rgba(26,26,26,0.06)"
              ctx.strokeStyle = badge.type === "discount" ? "rgba(212,175,55,0.3)" : "rgba(26,26,26,0.2)"
              ctx.lineWidth = 1
              ctx.fillRect(badgeX, badgeY - 12, textWidth, 24)
              ctx.strokeRect(badgeX, badgeY - 12, textWidth, 24)
              ctx.fillStyle = badge.type === "discount" ? "#b49425" : "#1a1a1a"
              ctx.font = "11px sans-serif"
              ctx.fillText(text, badgeX + 8, badgeY + 4)
              badgeX += textWidth + 8
              if (badgeX + textWidth > width - padding) {
                badgeX = padding
                cursorY += 28
              }
            })
          }

          wx.canvasToTempFilePath({
            canvas,
            success: (pathRes) => {
              wx.saveImageToPhotosAlbum({
                filePath: pathRes.tempFilePath,
                success: () => wx.showToast({ title: "已保存到相册", icon: "success" }),
                fail: () => wx.showToast({ title: "保存失败", icon: "none" }),
                complete: () => {
                  wx.hideLoading()
                  this.setData({ isSaving: false })
                },
              })
            },
            fail: () => {
              wx.hideLoading()
              this.setData({ isSaving: false })
              wx.showToast({ title: "生成失败，请重试", icon: "none" })
            },
          })
        })
    },
  },
})
