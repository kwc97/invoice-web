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
    companyName: 'Ragione Sociale',
    address: 'Indirizzo',
    businessType: 'Attività',
    telFax: 'TEL / FAX',
    representativeLabel: 'Rapp.',
    values: {
      companyName: 'KPROTEK Co., Ltd.',
      representative: 'Shin Chang-gun',
      address: '5-67, Oseong-seo-ro, Pyeongtaek-si, Gyeonggi-do, Corea del Sud',
      businessType: 'Costruzione, Produzione, Commercio',
      businessCategory: 'Installazione macchine, Macchinari, Attrezzature',
      tel: '+82-31-704-2989',
      fax: '+82-31-704-2985',
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
  },
  koreanAmount: {
    prefix: null,
    suffix: null,
  },
}
