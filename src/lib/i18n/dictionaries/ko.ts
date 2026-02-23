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
    vatExcluded: '부가세 별도',
    contactPerson: '견적담당자',
    termsAndConditions: '* 견적 조건',
    total: 'Total',
  },
  supplier: {
    label: '공급자',
    businessNumber: '사업자\n번호',
    companyName: '상호',
    representativeLabel: '성명',
    address: '사업장\n소재지',
    businessTypeLabel: '업태',
    businessCategoryLabel: '종목',
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
    confirmApproveTitle: '견적서를 승인하시겠습니까?',
    confirmApproveDescription:
      '승인 후에는 변경할 수 없습니다. 계속 진행하시겠습니까?',
    confirmRejectTitle: '견적서를 거부하시겠습니까?',
    confirmRejectDescription:
      '거부 후에는 변경할 수 없습니다. 계속 진행하시겠습니까?',
    cancel: '취소',
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
    unavailableTitle: '이 견적서는 현재 확인할 수 없습니다',
    unavailableDescription:
      '요청하신 견적서는 현재 열람이 불가능한 상태입니다. 자세한 사항은 담당자에게 문의해 주시기 바랍니다.',
  },
  koreanAmount: {
    prefix: '일금 ',
    suffix: '원',
  },
}
