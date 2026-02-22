'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Undo2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { recallQuoteAction } from '@/app/actions/quote'

interface RecallQuoteDialogProps {
  quoteId: string
}

export function RecallQuoteDialog({ quoteId }: RecallQuoteDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleRecall() {
    startTransition(async () => {
      const result = await recallQuoteAction(quoteId)
      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        alert(result.error || '회수에 실패했습니다')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Undo2 className="mr-2 h-4 w-4" />
          회수
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>발송된 견적서를 회수하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            견적서가 작성중 상태로 되돌아가며, 공개 링크가 비활성화됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleRecall} disabled={isPending}>
            {isPending ? '회수 중...' : '회수'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
