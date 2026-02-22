'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Link as LinkIcon, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { createPublicLink } from '@/app/actions/quote'

interface PublicLinkSectionProps {
  quoteId: string
  initialPublicLinkId: string | null
  quoteStatus: string
}

/**
 * 공개 링크 생성 및 관리 컴포넌트
 * Server Action으로 Notion에 저장
 */
export function PublicLinkSection({
  quoteId,
  initialPublicLinkId,
  quoteStatus,
}: PublicLinkSectionProps) {
  const [publicLinkId, setPublicLinkId] = useState(initialPublicLinkId)
  const [isGenerating, setIsGenerating] = useState(false)

  // DRAFT 상태(회수됨 포함)에서는 기존 링크를 숨기고 재생성 가능하도록 함
  const isDraft = quoteStatus === '작성중'
  const publicUrl =
    publicLinkId && !isDraft
      ? `${window.location.origin}/quote/${publicLinkId}`
      : null

  const handleGenerateLink = async () => {
    setIsGenerating(true)

    const result = await createPublicLink(quoteId)

    if (result.success && result.publicLinkId) {
      setPublicLinkId(result.publicLinkId)
      toast.success('공개 링크가 생성되었습니다')
    } else {
      toast.error(result.error || '링크 생성에 실패했습니다')
    }

    setIsGenerating(false)
  }

  const handleCopyLink = async () => {
    if (!publicUrl) return

    try {
      await navigator.clipboard.writeText(publicUrl)
      toast.success('링크가 클립보드에 복사되었습니다')
    } catch {
      toast.error('링크 복사에 실패했습니다')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          공개 링크
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {publicUrl ? (
          <>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              이 링크를 고객에게 공유하여 견적서를 확인하고 승인/거부할 수
              있습니다.
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">
              공개 링크를 생성하면 고객이 로그인 없이 견적서를 확인할 수
              있습니다.
            </p>
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                링크를 생성하면 견적서 상태가 &quot;발송됨&quot;으로 변경됩니다.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isGenerating}>
                  {isGenerating ? '생성 중...' : '공개 링크 생성'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>링크를 생성하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    공개 링크가 생성되며, 견적서 상태가 &quot;발송됨&quot;으로
                    변경됩니다. 고객은 이 링크를 통해 견적서를 확인하고
                    승인/거부할 수 있습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGenerateLink}>
                    링크 생성
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}
