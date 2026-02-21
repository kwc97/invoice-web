import type { Dictionary } from '../types'

/** 일본어 사전 */
export const ja: Dictionary = {
  quote: {
    title: '見 積 書',
    no: 'NO.',
    issueDate: '見積日',
    projectName: 'プロジェクト名',
    recipient: '宛先',
    quoteAmount: '見積金額',
    vatExcluded: '税別',
    contactPerson: '担当者',
    termsAndConditions: '※ 見積条件',
    total: '合計',
  },
  supplier: {
    label: '供給者',
    businessNumber: '事業者番号',
    companyName: '商号',
    address: '所在地',
    businessType: '業態/種目',
    telFax: 'TEL / FAX',
    representativeLabel: '代表',
    values: {
      companyName: 'KPROTEK Co., Ltd.',
      representative: 'シン・チャングン',
      address: '韓国京畿道平沢市五城西路5-67',
      businessType: '建設業, 製造業, 卸売/小売',
      businessCategory: '機械設置, 機械装置, 機械設備',
    },
  },
  table: {
    partNo: 'Part No',
    description: '品名',
    unit: '単位',
    qty: '数量',
    unitPrice: '単価',
    totalPrice: '金額',
    remarks: '備考',
  },
  actions: {
    downloadPdf: 'PDF ダウンロード',
    approve: '承認',
    reject: '却下',
  },
  messages: {
    approved: 'この見積書は承認されました。',
    rejected: 'この見積書は却下されました。',
    approveSuccess:
      '見積書が承認されました。担当者より折り返しご連絡いたします。',
    rejectSuccess: '見積書が却下されました。',
    pdfDownloaded: 'PDFダウンロードが完了しました',
    pdfFailed: 'PDFダウンロードに失敗しました',
    expiredTitle: 'この見積書は有効期限が切れています',
    expiredDescription:
      'この見積書の有効期限が過ぎており、無効となっています。最新の見積書が必要な場合は、担当者に新しい見積書をご依頼ください。',
    expiredContact: '新しい見積書を依頼',
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
