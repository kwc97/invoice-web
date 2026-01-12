import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuoteStats } from '@/types/quote'
import { FileText, Send, Eye, CheckCircle, XCircle } from 'lucide-react'

interface StatsCardsProps {
  stats: QuoteStats
}

/**
 * 대시보드 통계 카드 컴포넌트
 * 견적서 상태별 개수를 카드 형태로 표시
 */
export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: '총 견적서',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: '발송됨',
      value: stats.sent,
      icon: Send,
      color: 'text-blue-600',
    },
    {
      title: '확인됨',
      value: stats.confirmed,
      icon: Eye,
      color: 'text-yellow-600',
    },
    {
      title: '승인됨',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: '거부됨',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
