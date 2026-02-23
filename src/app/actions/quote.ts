/**
 * 견적서 관련 Server Actions
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { nanoid } from 'nanoid'
import { auth } from '@/auth'
import {
  getQuoteById,
  getQuoteItemsByQuoteId,
  updateQuotePublicLink,
  updateQuoteStatus,
  expireOverdueQuotesInDb,
  generateQuoteNumber,
  createQuote,
  createQuoteItem,
  updateQuote,
  updateQuoteItem,
  archiveQuote,
  archiveQuoteItem,
  createCustomer,
} from '@/lib/notion/quotes'
import { QUOTE_STATUS } from '@/lib/constants'
import { quoteFormSchema, createCustomerSchema } from '@/lib/validations/quote'
import { getCompanyConfig, type CompanyId } from '@/lib/company'
import { saveAppendixData } from '@/lib/notion/blocks'
import type { AppendixTable } from '@/types/appendix'

/**
 * 공개 견적서 열람 확인 (외부 고객 접근 시 자동 호출)
 * "발송됨" 상태일 때만 "확인됨"으로 전환
 */
export async function confirmQuoteView(quoteId: string): Promise<void> {
  try {
    const quote = await getQuoteById(quoteId)
    if (!quote || quote.status !== QUOTE_STATUS.SENT) return

    await updateQuoteStatus(quoteId, QUOTE_STATUS.CONFIRMED)

    revalidateTag('quotes')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/admin/quote/${quoteId}`)
    revalidatePath(`/quote/[publicId]`, 'page')
  } catch (error) {
    console.error('[confirmQuoteView] 상태 업데이트 실패:', error)
  }
}

/**
 * 공개 링크 생성
 */
export async function createPublicLink(quoteId: string) {
  // 관리자 인증 확인
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다' }
  }

  try {
    const publicLinkId = nanoid(12)
    await updateQuotePublicLink(quoteId, publicLinkId)

    // 링크 생성 = 발송으로 간주하여 상태 변경
    await updateQuoteStatus(quoteId, QUOTE_STATUS.SENT)

    const publicUrl = `${process.env.APP_URL}/quote/${publicLinkId}`

    // 캐시 무효화
    revalidateTag('quotes')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/admin/quote/${quoteId}`)

    return {
      success: true,
      publicUrl,
      publicLinkId,
    }
  } catch (error) {
    console.error('Failed to create public link:', error)
    return {
      success: false,
      error: '링크 생성에 실패했습니다',
    }
  }
}

/**
 * 유효기간이 지난 견적서를 만료 상태로 일괄 업데이트 (Server Action)
 * 클라이언트에서 호출 시 캐시 무효화 포함
 */
export async function expireOverdueQuotes(): Promise<number> {
  const count = await expireOverdueQuotesInDb()
  if (count > 0) {
    revalidateTag('quotes')
    revalidatePath('/admin/dashboard')
  }
  return count
}

/**
 * 견적서 승인
 */
export async function approveQuote(quoteId: string) {
  try {
    // 견적서 존재 및 만료 검증
    const quote = await getQuoteById(quoteId)
    if (!quote) {
      return { success: false, error: '견적서를 찾을 수 없습니다' }
    }
    if (quote.status === QUOTE_STATUS.EXPIRED) {
      return { success: false, error: '유효기간이 만료된 견적서입니다' }
    }

    await updateQuoteStatus(quoteId, QUOTE_STATUS.APPROVED)

    // 캐시 무효화
    revalidateTag('quotes')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/admin/quote/${quoteId}`)
    revalidatePath(`/quote/[publicId]`, 'page')

    return {
      success: true,
      message: '견적서가 승인되었습니다',
    }
  } catch (error) {
    console.error('Failed to approve quote:', error)
    return {
      success: false,
      error: '견적서 승인에 실패했습니다',
    }
  }
}

/**
 * 견적서 거부
 */
export async function rejectQuote(quoteId: string) {
  try {
    // 견적서 존재 및 만료 검증
    const quote = await getQuoteById(quoteId)
    if (!quote) {
      return { success: false, error: '견적서를 찾을 수 없습니다' }
    }
    if (quote.status === QUOTE_STATUS.EXPIRED) {
      return { success: false, error: '유효기간이 만료된 견적서입니다' }
    }

    await updateQuoteStatus(quoteId, QUOTE_STATUS.REJECTED)

    // 캐시 무효화
    revalidateTag('quotes')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/admin/quote/${quoteId}`)
    revalidatePath(`/quote/[publicId]`, 'page')

    return {
      success: true,
      message: '견적서가 거부되었습니다',
    }
  } catch (error) {
    console.error('Failed to reject quote:', error)
    return {
      success: false,
      error: '견적서 거부에 실패했습니다',
    }
  }
}

/**
 * 견적서 회수 (발송됨 → 작성중)
 * 관리자가 발송된 견적서를 회수하여 공개 링크를 비활성화
 */
export async function recallQuoteAction(quoteId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다' }
  }

  try {
    const quote = await getQuoteById(quoteId)
    if (!quote) {
      return { success: false, error: '견적서를 찾을 수 없습니다' }
    }
    if (quote.status !== QUOTE_STATUS.SENT) {
      return {
        success: false,
        error: `발송됨 상태의 견적서만 회수할 수 있습니다 (현재: ${quote.status || '알 수 없음'})`,
      }
    }

    await updateQuoteStatus(quoteId, QUOTE_STATUS.DRAFT)

    // 캐시 무효화
    revalidateTag('quotes')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/admin/quote/${quoteId}`)
    revalidatePath(`/quote/[publicId]`, 'page')

    return {
      success: true,
      message: '견적서가 회수되었습니다',
    }
  } catch (error) {
    console.error('Failed to recall quote:', error)
    return {
      success: false,
      error: '견적서 회수에 실패했습니다',
    }
  }
}

/**
 * 견적서 번호 자동 생성 (클라이언트에서 회사 변경 시 호출)
 */
export async function generateQuoteNumberAction(companyId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다', quoteNumber: '' }
  }

  try {
    const config = getCompanyConfig(companyId as CompanyId)
    const quoteNumber = await generateQuoteNumber(config.quotePrefix)
    return { success: true, quoteNumber }
  } catch (error) {
    console.error('Failed to generate quote number:', error)
    return {
      success: false,
      error: '견적서 번호 생성에 실패했습니다',
      quoteNumber: '',
    }
  }
}

/** 수정 가능한 상태 */
const EDITABLE_STATUSES = [QUOTE_STATUS.DRAFT, QUOTE_STATUS.REJECTED] as const

/** 삭제 가능한 상태 */
const DELETABLE_STATUSES = [
  QUOTE_STATUS.DRAFT,
  QUOTE_STATUS.REJECTED,
  QUOTE_STATUS.EXPIRED,
] as const

/** 캐시 무효화 헬퍼 */
function invalidateQuoteCaches(quoteId?: string) {
  revalidateTag('quotes')
  revalidatePath('/admin/dashboard')
  if (quoteId) {
    revalidatePath(`/admin/quote/${quoteId}`)
  }
}

/**
 * 견적서 생성
 */
export async function createQuoteAction(formData: unknown) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다' }
  }

  const parsed = quoteFormSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || '입력값이 올바르지 않습니다',
    }
  }

  const data = parsed.data

  try {
    // 견적서 생성 (번호는 폼에서 전달받음)
    const quoteId = await createQuote({
      quoteNumber: data.quoteNumber,
      customerId: data.customerId,
      issueDate: data.issueDate,
      validUntil: data.validUntil,
      projectName: data.projectName || undefined,
      recipient: data.recipient || undefined,
      contactPerson: data.contactPerson || undefined,
      notes: data.notes || undefined,
      language: data.language || undefined,
      company: data.company || undefined,
    })

    // 견적 항목들 병렬 생성
    await Promise.all(
      data.items.map(item =>
        createQuoteItem({
          name: item.name,
          description: item.description || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          unit: item.unit || undefined,
          remarks: item.remarks || undefined,
          quoteId,
        })
      )
    )

    // 부속 내역서 저장
    await saveAppendixData(
      quoteId,
      (data.appendixTables as AppendixTable[]) ?? []
    )

    invalidateQuoteCaches(quoteId)

    return { success: true, quoteId }
  } catch (error) {
    console.error('Failed to create quote:', error)
    return { success: false, error: '견적서 생성에 실패했습니다' }
  }
}

/**
 * 견적서 수정
 */
export async function updateQuoteAction(quoteId: string, formData: unknown) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다' }
  }

  // 상태 검증
  const quote = await getQuoteById(quoteId)
  if (!quote) {
    return { success: false, error: '견적서를 찾을 수 없습니다' }
  }
  if (
    !EDITABLE_STATUSES.includes(
      quote.status as (typeof EDITABLE_STATUSES)[number]
    )
  ) {
    return { success: false, error: '수정할 수 없는 상태입니다' }
  }

  const parsed = quoteFormSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || '입력값이 올바르지 않습니다',
    }
  }

  const data = parsed.data

  try {
    // 거부됨 → 작성중으로 리셋
    const newStatus =
      quote.status === QUOTE_STATUS.REJECTED ? QUOTE_STATUS.DRAFT : undefined

    // 견적서 업데이트
    await updateQuote(quoteId, {
      customerId: data.customerId,
      issueDate: data.issueDate,
      validUntil: data.validUntil,
      projectName: data.projectName,
      recipient: data.recipient,
      contactPerson: data.contactPerson,
      notes: data.notes,
      language: data.language || undefined,
      status: newStatus,
    })

    // 기존 항목 조회
    const existingItems = await getQuoteItemsByQuoteId(quoteId)
    const existingItemIds = new Set(existingItems.map(item => item.id))
    const formItemIds = new Set(
      data.items.filter(item => item.id).map(item => item.id!)
    )

    // 삭제된 항목 아카이브
    const deletedIds = [...existingItemIds].filter(id => !formItemIds.has(id))
    await Promise.all(deletedIds.map(id => archiveQuoteItem(id)))

    // 기존 항목 수정 / 새 항목 생성
    await Promise.all(
      data.items.map(item => {
        if (item.id && existingItemIds.has(item.id)) {
          // 기존 항목 수정
          return updateQuoteItem(item.id, {
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit,
            remarks: item.remarks,
          })
        } else {
          // 새 항목 생성
          return createQuoteItem({
            name: item.name,
            description: item.description || undefined,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit || undefined,
            remarks: item.remarks || undefined,
            quoteId,
          })
        }
      })
    )

    // 부속 내역서 저장
    await saveAppendixData(
      quoteId,
      (data.appendixTables as AppendixTable[]) ?? []
    )

    invalidateQuoteCaches(quoteId)

    return { success: true, quoteId }
  } catch (error) {
    console.error('Failed to update quote:', error)
    return { success: false, error: '견적서 수정에 실패했습니다' }
  }
}

/**
 * 견적서 삭제 (아카이브)
 */
export async function deleteQuoteAction(quoteId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다' }
  }

  // 상태 검증
  const quote = await getQuoteById(quoteId)
  if (!quote) {
    return { success: false, error: '견적서를 찾을 수 없습니다' }
  }
  if (
    !DELETABLE_STATUSES.includes(
      quote.status as (typeof DELETABLE_STATUSES)[number]
    )
  ) {
    return { success: false, error: '삭제할 수 없는 상태입니다' }
  }

  try {
    await archiveQuote(quoteId)
    invalidateQuoteCaches()

    return { success: true }
  } catch (error) {
    console.error('Failed to delete quote:', error)
    return { success: false, error: '견적서 삭제에 실패했습니다' }
  }
}

/**
 * 새 고객 등록
 */
export async function createCustomerAction(formData: unknown) {
  const session = await auth()
  if (!session?.user) {
    return { success: false as const, error: '인증이 필요합니다' }
  }

  const parsed = createCustomerSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message || '입력값이 올바르지 않습니다',
    }
  }

  const data = parsed.data

  try {
    const customer = await createCustomer({
      name: data.name,
      company: data.company || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
    })

    revalidateTag('customers')

    return { success: true as const, customer }
  } catch (error) {
    console.error('Failed to create customer:', error)
    return { success: false as const, error: '고객 등록에 실패했습니다' }
  }
}
