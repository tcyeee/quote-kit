import { createQuoteDetail, saveAsPic, saveAsExcel } from "../../service/api"

let bottomDialogHeaderTouchStartY = 0
const app = getApp<IAppOption>()
Page({
  data: {
    options: {
      bottomDialogCollapsedHeight: 20,
      bottomDialogExpandedHeight: 85,
    },
    bottomDialogExpanded: false,
    showEditEnd: false,
    currentTheme: 'amber',
    quoteDetail: {} as QuoteDetail,
  },
  showSavingToast() {
    const toast = this.selectComponent("#savingToast") as any
    if (toast && typeof toast.show === "function") {
      toast.show()
    }
  },
  onBottomDialogMaskTouchMove() {
    this.showSavingToast()
  },
  onBottomDialogHeaderTouchStart(e: WechatMiniprogram.TouchEvent) {
    const touch = e.touches[0]
    if (!touch) return
    bottomDialogHeaderTouchStartY = touch.clientY
  },
  onBottomDialogHeaderTouchEnd(e: WechatMiniprogram.TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return
    const deltaY = touch.clientY - bottomDialogHeaderTouchStartY
    const threshold = 30
    if (deltaY < -threshold && !this.data.bottomDialogExpanded) {
      this.setData({
        bottomDialogExpanded: true,
      })
    } else if (deltaY > threshold && this.data.bottomDialogExpanded) {
      this.setData({
        bottomDialogExpanded: false,
      })
    }
  },
  toggleBottomDialog() {
    this.setData({
      bottomDialogExpanded: !this.data.bottomDialogExpanded,
    })
  },
  onLoad() {
    const quoteDetail = app.globalData.quoteDetail
    this.setData({
      quoteDetail,
      currentTheme: quoteDetail.theme || 'amber',
    })
  },

  // 报价单更新时调用
  onQuoteDetailUpdate() {
    this.showSavingToast()
    const quoteDetail = app.globalData.quoteDetail
    this.setData({
      quoteDetail,
      currentTheme: quoteDetail.theme || 'amber',
    })
  },
  toggleConfirmDialog(event: any) {
    this.setData({
      bottomDialogExpanded: true,
      showEditEnd: event.detail
    })
  },

  async onSaveImage() {
    try {
      var quoteDetail = await this.saveQuote()
      const downloadUrl = await saveAsPic(quoteDetail.id)

      // 下载图片文件
      const downloadRes = await new Promise<WechatMiniprogram.DownloadFileSuccessCallbackResult>((resolve, reject) => {
        wx.downloadFile({
          url: downloadUrl.imageUrl,
          success: resolve,
          fail: reject,
        })
      })

      // 保存图片到相册
      await new Promise<void>((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath: downloadRes.tempFilePath,
          success: () => {
            wx.showToast({
              title: '图片已保存到相册',
              icon: 'success',
            })
            resolve()
          },
          fail: (err) => {
            if (err.errMsg.includes('auth deny')) {
              wx.showModal({
                title: '提示',
                content: '需要授权保存图片到相册',
                showCancel: false,
              })
            } else {
              wx.showToast({
                title: '保存失败',
                icon: 'error',
              })
            }
            reject(err)
          },
        })
      })
    } catch (error) {
      console.error('保存图片失败:', error)
      wx.showToast({
        title: '保存失败',
        icon: 'error',
      })
    }
  },

  async onSaveExcel() {
    try {
      var quoteDetail = await this.saveQuote()
      const downloadUrl = await saveAsExcel(quoteDetail.id)

      // 下载Excel文件
      const downloadRes = await new Promise<WechatMiniprogram.DownloadFileSuccessCallbackResult>((resolve, reject) => {
        wx.downloadFile({
          url: downloadUrl.excelUrl,
          success: resolve,
          fail: reject,
        })
      })

      // 打开文档，用户可以选择保存
      wx.openDocument({
        filePath: downloadRes.tempFilePath,
        fileType: 'xlsx',
        success: () => {
          wx.showToast({
            title: '文件已打开',
            icon: 'success',
          })
        },
        fail: (err) => {
          console.error('打开文件失败:', err)
          wx.showToast({
            title: '打开失败',
            icon: 'error',
          })
        },
      })
    } catch (error) {
      console.error('下载Excel失败:', error)
      wx.showToast({
        title: '下载失败',
        icon: 'error',
      })
    }
  },

  async onShareAppMessage(options: WechatMiniprogram.Page.IShareAppMessageOption) {
    if (options.from === 'button') {
      var quoteDetail = await this.saveQuote()
      console.log("quote-kit: 报价单分享完成,ID:" + quoteDetail.id)
      const title = app.globalData.quoteDetail.projectName || "报价单"
      const content: WechatMiniprogram.Page.ICustomShareContent = {
        title,
        path: "/pages/view/view?id=" + quoteDetail.id + "&entry=share",
        imageUrl: "/assets/share.png",
      }
      return content
    }

    // 右上角菜单分享
    return {
      title: "Quote Kit - 报价单工具",
      path: "/pages/index/index",
      imageUrl: "/assets/share.png",
    }
  },

  async saveQuote(): Promise<QuoteDetailWithId> {
    const app = getApp<IAppOption>()

    // 如果已经有ID,则直接返回 
    if (app.globalData.quoteDetail.id) {
      return app.globalData.quoteDetail as QuoteDetailWithId
    }

    var quote = app.globalData.quoteDetail
    quote.uid = app.globalData.uid
    var quoteDetailWithId = await createQuoteDetail(quote)
    // 保存到全局应用数据
    app.globalData.quoteDetail.id = quoteDetailWithId.id
    return quoteDetailWithId
  }
})
