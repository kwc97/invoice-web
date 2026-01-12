'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { Copy, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface PublicLinkSectionProps {
  quoteId: string
  initialPublicLinkId: string | null
}

/**
 * 공개 링크 생성 및 관리 컴포넌트
 * nanoid로 고유 링크 ID 생성
 */
export function PublicLinkSection({
  initialPublicLinkId,
}: Omit<PublicLinkSectionProps, 'quoteId'>) {
  const [publicLinkId, setPublicLinkId] = useState(initialPublicLinkId)
  const [isGenerating, setIsGenerating] = useState(false)

  const publicUrl = publicLinkId
    ? `${window.location.origin}/quote/${publicLinkId}`
    : null

  const handleGenerateLink = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newLinkId = nanoid(10)
    setPublicLinkId(newLinkId)
    toast.success('공개 링크가 생성되었습니다')
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
            <p className="text-sm text-muted-foreground">
              이 링크를 고객에게 공유하여 견적서를 확인하고 승인/거부할 수
              있습니다.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              공개 링크를 생성하면 고객이 로그인 없이 견적서를 확인할 수
              있습니다.
            </p>
            <Button onClick={handleGenerateLink} disabled={isGenerating}>
              {isGenerating ? '생성 중...' : '공개 링크 생성'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
