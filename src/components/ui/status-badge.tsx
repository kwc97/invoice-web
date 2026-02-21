import { Badge } from '@/components/ui/badge'
import { QUOTE_STATUS_COLORS, type QuoteStatus } from '@/lib/constants'

interface StatusBadgeProps {
  status: QuoteStatus
}

type ColorKey = 'gray' | 'blue' | 'yellow' | 'green' | 'red' | 'orange'

/**
 * 견적서 상태를 색상별 배지로 표시하는 컴포넌트
 * QUOTE_STATUS_COLORS 상수를 활용하여 일관된 색상 시스템 적용
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const colorMap: Record<ColorKey, string> = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    yellow:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    orange:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  }

  const color = QUOTE_STATUS_COLORS[status] as ColorKey
  return <Badge className={colorMap[color]}>{status}</Badge>
}
