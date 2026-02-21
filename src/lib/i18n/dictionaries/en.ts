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
    address: 'Address',
    businessType: 'Business Type',
    telFax: 'TEL / FAX',
    representativeLabel: 'CEO',
    values: {
      companyName: 'KPROTEK Co., Ltd.',
      representative: 'Shin Chang-gun',
      address: '5-67, Oseong-seo-ro, Pyeongtaek-si, Gyeonggi-do, Korea',
      businessType: 'Construction, Manufacturing, Wholesale/Retail',
      businessCategory: 'Machine Installation, Machinery, Machine Equipment',
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
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
