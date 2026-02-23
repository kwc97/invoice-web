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
    businessNumber: '事業者\n番号',
    companyName: '商号',
    representativeLabel: '代表',
    address: '所在地',
    businessTypeLabel: '業態',
    businessCategoryLabel: '種目',
    telLabel: 'TEL',
    faxLabel: 'FAX',
    values: {
      companyName: '',
      representative: '',
      address: '',
      businessType: '',
      businessCategory: '',
      tel: '',
      fax: '',
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
    confirmApproveTitle: 'この見積書を承認しますか？',
    confirmApproveDescription: '承認後は変更できません。続行しますか？',
    confirmRejectTitle: 'この見積書を却下しますか？',
    confirmRejectDescription: '却下後は変更できません。続行しますか？',
    cancel: 'キャンセル',
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
    unavailableTitle: 'この見積書は現在確認できません',
    unavailableDescription:
      'ご依頼の見積書は現在閲覧できない状態です。詳細については担当者までお問い合わせください。',
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
