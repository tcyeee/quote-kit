Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    tabs: [
      { key: 'basic', label: '基础信息' },
      { key: 'service', label: '服务项' },
      { key: 'payment', label: '优惠 & 支付' },
      { key: 'remark', label: '备注' },
    ],
    activeKey: 'basic',
  },
  methods: {
    onTabTap(e: any) {
      const key = e.currentTarget.dataset.key as string
      if (!key || key === (this.data as any).activeKey) return
      this.setData({
        activeKey: key,
      })
      this.triggerEvent("change", { key })
    },
  },
})
