import type { Dictionary } from '../types'

/** 스페인어 사전 */
export const es: Dictionary = {
  quote: {
    title: 'COTIZACIÓN',
    no: 'N.°',
    issueDate: 'Fecha',
    projectName: 'Proyecto',
    recipient: 'Destinatario',
    quoteAmount: 'Monto',
    vatExcluded: 'IVA no incluido',
    contactPerson: 'Contacto',
    termsAndConditions: '* Términos y condiciones',
    total: 'Total',
  },
  supplier: {
    label: 'Proveedor',
    businessNumber: 'NIF',
    companyName: 'Empresa',
    address: 'Dirección',
    businessType: 'Actividad',
    telFax: 'TEL / FAX',
    representativeLabel: 'Rep.',
    values: {
      companyName: 'KPROTEK Co., Ltd.',
      representative: 'Shin Chang-gun',
      address: '5-67, Oseong-seo-ro, Pyeongtaek-si, Gyeonggi-do, Corea del Sur',
      businessType: 'Construcción, Manufactura, Comercio',
      businessCategory: 'Instalación de maquinaria, Maquinaria, Equipos',
    },
  },
  table: {
    partNo: 'N.°',
    description: 'Descripción',
    unit: 'Unidad',
    qty: 'Cant.',
    unitPrice: 'Precio Unit.',
    totalPrice: 'Precio Total',
    remarks: 'Observaciones',
  },
  actions: {
    downloadPdf: 'Descargar PDF',
    approve: 'Aprobar',
    reject: 'Rechazar',
  },
  messages: {
    approved: 'Esta cotización ha sido aprobada.',
    rejected: 'Esta cotización ha sido rechazada.',
    approveSuccess:
      'Cotización aprobada. Nuestro representante se pondrá en contacto pronto.',
    rejectSuccess: 'Cotización rechazada.',
    pdfDownloaded: 'Descarga de PDF completada',
    pdfFailed: 'Error al descargar el PDF',
    expiredTitle: 'Esta cotización ha expirado',
    expiredDescription:
      'El período de validez de esta cotización ha pasado y ya no es válida. Si necesita una cotización actualizada, comuníquese con nuestro representante para solicitar una nueva.',
    expiredContact: 'Solicitar nueva cotización',
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
