/**
 * 견적서 관련 Server Actions
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { nanoid } from 'nanoid'
import { auth } from '@/auth'
import {
  getQuoteById,
  updateQuotePublicLink,
  updateQuoteStatus,
} from '@/lib/notion/quotes'
import { QUOTE_STATUS } from '@/lib/constants'

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

    const publicUrl = `${process.env.APP_URL}/quote/${publicLinkId}`

    // 캐시 무효화
    revalidateTag('quotes')
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
 * 견적서 승인
 */
export async function approveQuote(quoteId: string) {
  try {
    // 견적서 존재 및 만료 검증
    const quote = await getQuoteById(quoteId)
    if (!quote) {
      return { success: false, error: '견적서를 찾을 수 없습니다' }
    }
    if (new Date(quote.validUntil) < new Date()) {
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
    if (new Date(quote.validUntil) < new Date()) {
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
