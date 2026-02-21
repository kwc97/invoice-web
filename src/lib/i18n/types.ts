/**
 * 다국어 지원 타입 정의
 */

export const SUPPORTED_LANGUAGES = ['ko', 'en', 'zh', 'ja', 'it', 'es'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  it: 'Italiano',
  es: 'Español',
}

/**
 * 정적 라벨 사전 인터페이스
 * 공개 페이지 및 PDF에 표시되는 모든 텍스트
 */
export interface Dictionary {
  quote: {
    title: string
    no: string
    issueDate: string
    projectName: string
    recipient: string
    quoteAmount: string
    vatExcluded: string
    contactPerson: string
    termsAndConditions: string
    total: string
  }
  supplier: {
    label: string
    businessNumber: string
    companyName: string
    address: string
    businessType: string
    telFax: string
    /** "대표:" 라벨 */
    representativeLabel: string
    /** 공급자 정보 값 (언어별 번역) */
    values: {
      companyName: string
      representative: string
      address: string
      businessType: string
      businessCategory: string
      tel: string
      fax: string
    }
  }
  table: {
    partNo: string
    description: string
    unit: string
    qty: string
    unitPrice: string
    totalPrice: string
    remarks: string
  }
  actions: {
    downloadPdf: string
    approve: string
    reject: string
    confirmApproveTitle: string
    confirmApproveDescription: string
    confirmRejectTitle: string
    confirmRejectDescription: string
    cancel: string
  }
  messages: {
    approved: string
    rejected: string
    approveSuccess: string
    rejectSuccess: string
    pdfDownloaded: string
    pdfFailed: string
    expiredTitle: string
    expiredDescription: string
    expiredContact: string
  }
  /** 한국어 금액 표기 (일금 XXX원) — null이면 미표시 */
  koreanAmount: {
    prefix: string | null
    suffix: string | null
  }
}
