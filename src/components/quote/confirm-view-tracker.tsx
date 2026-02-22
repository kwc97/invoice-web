'use client'

import { useEffect } from 'react'
import { confirmQuoteView } from '@/app/actions/quote'

/**
 * 견적서 열람 확인 트래커 (클라이언트 사이드)
 *
 * 브라우저에서만 실행되어 실제 사용자 열람만 감지합니다.
 * 카카오톡 등 메신저 봇의 링크 미리보기 크롤링으로 인한
 * 잘못된 상태 전환을 방지합니다.
 */
export function ConfirmViewTracker({ quoteId }: { quoteId: string }) {
  useEffect(() => {
    confirmQuoteView(quoteId)
  }, [quoteId])

  return null
}
