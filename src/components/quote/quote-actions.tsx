'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Printer, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { QuoteStatus } from '@/lib/constants'
import type { Dictionary } from '@/lib/i18n/types'
import { QUOTE_STATUS } from '@/lib/constants'
import { approveQuote, rejectQuote } from '@/app/actions/quote'

interface QuoteActionsProps {
  quoteId: string
  currentStatus: QuoteStatus
  dictionary: Dictionary
  /** 관리자 여부 — 관리자는 승인/거부 불가 (고객만 가능) */
  isAdmin?: boolean
}

/**
 * 견적서 액션 버튼 컴포넌트
 * PDF 인쇄/저장, 승인, 거부 기능 (다국어 지원)
 */
export function QuoteActions({
  quoteId,
  currentStatus,
  dictionary: dict,
  isAdmin = false,
}: QuoteActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const isApproved = status === QUOTE_STATUS.APPROVED
  const isRejected = status === QUOTE_STATUS.REJECTED
  const isExpired = status === QUOTE_STATUS.EXPIRED
  const isCompleted = isApproved || isRejected || isExpired

  const handlePrint = () => {
    window.print()
  }

  const handleApprove = async () => {
    setIsLoading(true)

    const result = await approveQuote(quoteId)

    if (result.success) {
      setStatus(QUOTE_STATUS.APPROVED)
      toast.success(dict.messages.approveSuccess)
      router.refresh()
    } else {
      toast.error(result.error || dict.messages.pdfFailed)
    }

    setIsLoading(false)
  }

  const handleReject = async () => {
    setIsLoading(true)

    const result = await rejectQuote(quoteId)

    if (result.success) {
      setStatus(QUOTE_STATUS.REJECTED)
      toast.error(dict.messages.rejectSuccess)
      router.refresh()
    } else {
      toast.error(result.error || dict.messages.pdfFailed)
    }

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
              {isApproved ? dict.messages.approved : dict.messages.rejected}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1 print:hidden"
          onClick={handlePrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          {dict.actions.downloadPdf}
        </Button>

        {!isCompleted && !isAdmin && (
          <>
            {/* 승인 확인 다이얼로그 */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" disabled={isLoading}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {dict.actions.approve}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {dict.actions.confirmApproveTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {dict.actions.confirmApproveDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{dict.actions.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApprove}>
                    {dict.actions.approve}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* 거부 확인 다이얼로그 */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {dict.actions.reject}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {dict.actions.confirmRejectTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {dict.actions.confirmRejectDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{dict.actions.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReject}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {dict.actions.reject}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  )
}
