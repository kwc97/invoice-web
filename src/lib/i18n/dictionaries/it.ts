import type { Dictionary } from '../types'

/** 이탈리아어 사전 */
export const it: Dictionary = {
  quote: {
    title: 'PREVENTIVO',
    no: 'N.',
    issueDate: 'Data',
    projectName: 'Progetto',
    recipient: 'Destinatario',
    quoteAmount: 'Importo',
    vatExcluded: 'IVA esclusa',
    contactPerson: 'Referente',
    termsAndConditions: '* Termini e condizioni',
    total: 'Totale',
  },
  supplier: {
    label: 'Fornitore',
    businessNumber: 'P.IVA',
    companyName: 'Rag.\nSociale',
    representativeLabel: 'Rapp.',
    address: 'Indirizzo',
    businessTypeLabel: 'Attività',
    businessCategoryLabel: 'Categoria',
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
    partNo: 'N.',
    description: 'Descrizione',
    unit: 'Unità',
    qty: 'Qtà',
    unitPrice: 'Prezzo Unit.',
    totalPrice: 'Prezzo Tot.',
    remarks: 'Note',
  },
  actions: {
    downloadPdf: 'Scarica PDF',
    approve: 'Approva',
    reject: 'Rifiuta',
    confirmApproveTitle: 'Approvare questo preventivo?',
    confirmApproveDescription:
      'Questa azione non può essere annullata. Vuoi continuare?',
    confirmRejectTitle: 'Rifiutare questo preventivo?',
    confirmRejectDescription:
      'Questa azione non può essere annullata. Vuoi continuare?',
    cancel: 'Annulla',
  },
  messages: {
    approved: 'Questo preventivo è stato approvato.',
    rejected: 'Questo preventivo è stato rifiutato.',
    approveSuccess:
      'Preventivo approvato. Il nostro referente vi contatterà a breve.',
    rejectSuccess: 'Preventivo rifiutato.',
    pdfDownloaded: 'Download PDF completato',
    pdfFailed: 'Download PDF non riuscito',
    expiredTitle: 'Questo preventivo è scaduto',
    expiredDescription:
      'Il periodo di validità di questo preventivo è scaduto e non è più valido. Se necessita di un preventivo aggiornato, contatti il nostro referente per richiederne uno nuovo.',
    expiredContact: 'Richiedi nuovo preventivo',
    unavailableTitle: 'Questo preventivo non è attualmente disponibile',
    unavailableDescription:
      'Il preventivo richiesto non è attualmente disponibile per la consultazione. Per ulteriori dettagli, contatti il nostro referente.',
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
