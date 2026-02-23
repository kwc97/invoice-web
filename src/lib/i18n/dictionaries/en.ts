import type { Dictionary } from '../types'

/** 영어 사전 */
export const en: Dictionary = {
  quote: {
    title: 'QUOTATION',
    no: 'NO.',
    issueDate: 'Date',
    projectName: 'Project',
    recipient: 'To',
    quoteAmount: 'Amount',
    vatExcluded: 'VAT excluded',
    contactPerson: 'Contact Person',
    termsAndConditions: '* Terms & Conditions',
    total: 'Total',
  },
  supplier: {
    label: 'Supplier',
    businessNumber: 'Reg. No.',
    companyName: 'Company',
    representativeLabel: 'CEO',
    address: 'Address',
    businessTypeLabel: 'Business\nType',
    businessCategoryLabel: 'Category',
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
    downloadPdf: 'Download PDF',
    approve: 'Approve',
    reject: 'Reject',
    confirmApproveTitle: 'Approve this quotation?',
    confirmApproveDescription:
      'This action cannot be undone. Do you want to proceed?',
    confirmRejectTitle: 'Reject this quotation?',
    confirmRejectDescription:
      'This action cannot be undone. Do you want to proceed?',
    cancel: 'Cancel',
  },
  messages: {
    approved: 'This quotation has been approved.',
    rejected: 'This quotation has been rejected.',
    approveSuccess:
      'Quotation approved. Our representative will contact you shortly.',
    rejectSuccess: 'Quotation has been rejected.',
    pdfDownloaded: 'PDF download completed',
    pdfFailed: 'PDF download failed',
    expiredTitle: 'This quotation has expired',
    expiredDescription:
      'The validity period of this quotation has passed and it is no longer valid. If you need an updated quotation, please contact our representative to request a new one.',
    expiredContact: 'Request new quotation',
    unavailableTitle: 'This quotation is currently unavailable',
    unavailableDescription:
      'The requested quotation is not available for viewing at this time. Please contact our representative for further details.',
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
