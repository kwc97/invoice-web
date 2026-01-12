'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Download, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { QuoteStatus } from '@/lib/constants'
import { QUOTE_STATUS } from '@/lib/constants'

interface QuoteActionsProps {
  quoteId: string
  currentStatus: QuoteStatus
}

/**
 * 견적서 액션 버튼 컴포넌트
 * PDF 다운로드, 승인, 거부 기능
 */
export function QuoteActions({
  currentStatus,
}: Omit<QuoteActionsProps, 'quoteId'>) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const isApproved = status === QUOTE_STATUS.APPROVED
  const isRejected = status === QUOTE_STATUS.REJECTED
  const isCompleted = isApproved || isRejected

  const handlePdfDownload = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.info('PDF 다운로드는 다음 단계에서 구현됩니다')
    setIsLoading(false)
  }

  const handleApprove = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatus(QUOTE_STATUS.APPROVED)
    toast.success('견적서가 승인되었습니다. 담당자가 곧 연락드리겠습니다.')
    setIsLoading(false)
  }

  const handleReject = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatus(QUOTE_STATUS.REJECTED)
    toast.error('견적서가 거부되었습니다.')
    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* 완료 메시지 */}
      {isCompleted && (
        <Card
          className={
            isApproved
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
          }
        >
          <CardContent className="flex items-center gap-3 p-4">
            {isApproved ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <p
              className={
                isApproved
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }
            >
              {isApproved
                ? '이 견적서는 승인되었습니다.'
                : '이 견적서는 거부되었습니다.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePdfDownload}
          disabled={isLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          PDF 다운로드
        </Button>

        {!isCompleted && (
          <>
            <Button className="flex-1" onClick={handleApprove} disabled={isLoading}>
              <CheckCircle className="mr-2 h-4 w-4" />
              승인
            </Button>

            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
              disabled={isLoading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              거부
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
