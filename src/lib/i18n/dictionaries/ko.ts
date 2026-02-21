import type { Dictionary } from '../types'

/** 한국어 사전 */
export const ko: Dictionary = {
  quote: {
    title: '견 적 서',
    no: 'NO.',
    issueDate: '견적일자',
    projectName: 'Project명',
    recipient: '수 신',
    quoteAmount: '견적 금액',
    vatExcluded: '부가세별도',
    contactPerson: '견적담당자',
    termsAndConditions: '* 견적 조건',
    total: 'Total',
  },
  supplier: {
    label: '공급자',
    businessNumber: '사업자번호',
    companyName: '상호',
    address: '소재지',
    businessType: '업태/종목',
    telFax: 'TEL / FAX',
    representativeLabel: '대표',
    values: {
      companyName: '(주)케이프로텍',
      representative: '신창군',
      address: '경기도 평택시 오성서로 5-67',
      businessType: '건설업,제조업,도소매',
      businessCategory: '기계설치,기계장치,기계설비',
    },
  },
  table: {
    partNo: 'Part No',
    description: 'Description',
    unit: 'Unit',
    qty: "Q'ty",
    unitPrice: 'Unit Price',
    totalPrice: 'Total Price',
    remarks: 'Remarks',
  },
  actions: {
    downloadPdf: 'PDF 다운로드',
    approve: '승인',
    reject: '거부',
  },
  messages: {
    approved: '이 견적서는 승인되었습니다.',
    rejected: '이 견적서는 거부되었습니다.',
    approveSuccess: '견적서가 승인되었습니다. 담당자가 곧 연락드리겠습니다.',
    rejectSuccess: '견적서가 거부되었습니다.',
    pdfDownloaded: 'PDF 다운로드가 완료되었습니다',
    pdfFailed: 'PDF 다운로드에 실패했습니다',
    expiredTitle: '견적서 유효기간이 만료되었습니다',
    expiredDescription:
      '본 견적서의 유효기간이 경과하여 더 이상 유효하지 않습니다. 최신 견적이 필요하시면 담당자에게 새로운 견적서를 요청해 주시기 바랍니다.',
    expiredContact: '새 견적서 요청',
  },
  koreanAmount: {
    prefix: '일금 ',
    suffix: '원',
  },
}
