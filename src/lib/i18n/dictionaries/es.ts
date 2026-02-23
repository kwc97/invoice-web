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
    representativeLabel: 'Rep.',
    address: 'Dirección',
    businessTypeLabel: 'Actividad',
    businessCategoryLabel: 'Categoría',
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
    confirmApproveTitle: '¿Aprobar esta cotización?',
    confirmApproveDescription:
      'Esta acción no se puede deshacer. ¿Desea continuar?',
    confirmRejectTitle: '¿Rechazar esta cotización?',
    confirmRejectDescription:
      'Esta acción no se puede deshacer. ¿Desea continuar?',
    cancel: 'Cancelar',
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
    unavailableTitle: 'Esta cotización no está disponible actualmente',
    unavailableDescription:
      'La cotización solicitada no está disponible para su visualización en este momento. Comuníquese con nuestro representante para más detalles.',
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
