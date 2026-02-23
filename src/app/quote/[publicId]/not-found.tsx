import { FileX, Mail } from 'lucide-react'
import { getCompanyConfig, DEFAULT_COMPANY } from '@/lib/company'

/**
 * 견적서 전용 404 페이지
 *
 * 회수되었거나 존재하지 않는 견적서 링크 접근 시 표시
 * 내부 시스템 링크를 노출하지 않고, 문의 이메일만 제공
 */
export default function QuoteNotFound() {
  const company = getCompanyConfig(DEFAULT_COMPANY)
  const subject = encodeURIComponent('견적서 문의')

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        <div className="bg-background rounded-lg border p-8 shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FileX className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h1 className="mb-3 text-2xl font-bold">
            이 견적서는 현재 확인할 수 없습니다
          </h1>
          <p className="text-muted-foreground mb-6">
            요청하신 견적서 링크가 더 이상 유효하지 않습니다. 새로운 견적서가
            필요하시면 아래로 문의해 주세요.
          </p>
          <a
            href={`mailto:${company.email}?subject=${subject}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors"
          >
            <Mail className="h-4 w-4" />
            문의하기
          </a>
        </div>
      </div>
    </div>
  )
}
