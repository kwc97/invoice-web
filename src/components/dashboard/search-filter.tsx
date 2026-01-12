'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QUOTE_STATUS } from '@/lib/constants'
import type { QuoteStatus } from '@/lib/constants'

interface SearchFilterProps {
  onSearchChange: (search: string) => void
  onStatusChange: (status: QuoteStatus | 'all') => void
}

/**
 * 검색 및 필터 컴포넌트
 * 견적서 번호, 고객명 검색 및 상태 필터링
 */
export function SearchFilter({
  onSearchChange,
  onStatusChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="견적서 번호 또는 고객명으로 검색..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="상태 필터" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value={QUOTE_STATUS.DRAFT}>작성중</SelectItem>
          <SelectItem value={QUOTE_STATUS.SENT}>발송됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.CONFIRMED}>확인됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.APPROVED}>승인됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.REJECTED}>거부됨</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
