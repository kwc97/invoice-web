/**
 * 컴포넌트 Props 타입 정의
 * 재사용 가능한 컴포넌트의 Props 인터페이스
 */

import type { ReactNode } from 'react'
import type { QuoteStatus } from '@/lib/constants'
import type { Quote } from './quote'

/**
 * 기본 컴포넌트 Props
 * 모든 컴포넌트가 공통으로 사용할 수 있는 기본 Props
 */
export interface BaseComponentProps {
  /** 추가 CSS 클래스 (선택) */
  className?: string
  /** 자식 컴포넌트 (선택) */
  children?: ReactNode
}

/**
 * 견적서 상태 배지 Props
 * 견적서 상태를 시각적으로 표시하는 배지 컴포넌트
 */
export interface StatusBadgeProps {
  /** 견적서 상태 */
  status: QuoteStatus
  /** 추가 CSS 클래스 (선택) */
  className?: string
}

/**
 * 로딩 스피너 Props
 * 데이터 로딩 중 표시되는 스피너 컴포넌트
 */
export interface LoadingSpinnerProps {
  /** 스피너 크기 (선택, 기본값: md) */
  size?: 'sm' | 'md' | 'lg'
  /** 추가 CSS 클래스 (선택) */
  className?: string
  /** 로딩 메시지 (선택) */
  message?: string
}

/**
 * 빈 상태 Props
 * 데이터가 없을 때 표시되는 컴포넌트
 */
export interface EmptyStateProps {
  /** 제목 */
  title: string
  /** 설명 (선택) */
  description?: string
  /** 액션 버튼 또는 링크 (선택) */
  action?: ReactNode
  /** 아이콘 (선택) */
  icon?: ReactNode
  /** 추가 CSS 클래스 (선택) */
  className?: string
}

/**
 * 견적서 카드 Props
 * 견적서 목록에서 사용되는 카드 컴포넌트
 */
export interface QuoteCardProps {
  /** 견적서 데이터 */
  quote: Quote
  /** 클릭 핸들러 (선택) */
  onClick?: (quote: Quote) => void
  /** 추가 CSS 클래스 (선택) */
  className?: string
  /** 고객 정보 표시 여부 (선택, 기본값: true) */
  showCustomer?: boolean
  /** 금액 표시 여부 (선택, 기본값: true) */
  showAmount?: boolean
}

/**
 * 견적서 테이블 Props
 * 견적서 목록을 테이블 형태로 표시하는 컴포넌트
 */
export interface QuoteTableProps {
  /** 견적서 목록 */
  quotes: Quote[]
  /** 로딩 상태 (선택) */
  loading?: boolean
  /** 행 클릭 핸들러 (선택) */
  onRowClick?: (quote: Quote) => void
  /** 추가 CSS 클래스 (선택) */
  className?: string
}

/**
 * 페이지네이션 Props
 * 목록 페이지네이션 컴포넌트
 */
export interface PaginationProps {
  /** 현재 페이지 번호 */
  currentPage: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void
  /** 추가 CSS 클래스 (선택) */
  className?: string
}

/**
 * 검색 입력 Props
 * 검색 기능이 있는 입력 컴포넌트
 */
export interface SearchInputProps {
  /** 현재 검색어 */
  value: string
  /** 검색어 변경 핸들러 */
  onChange: (value: string) => void
  /** Placeholder 텍스트 (선택) */
  placeholder?: string
  /** 디바운스 시간 (ms, 선택, 기본값: 300) */
  debounceMs?: number
  /** 추가 CSS 클래스 (선택) */
  className?: string
}

/**
 * 필터 드롭다운 Props
 * 견적서 상태 필터링 드롭다운
 */
export interface FilterDropdownProps {
  /** 현재 선택된 상태 (선택) */
  value?: QuoteStatus
  /** 상태 변경 핸들러 */
  onChange: (status?: QuoteStatus) => void
  /** 추가 CSS 클래스 (선택) */
  className?: string
}

/**
 * 날짜 범위 선택기 Props
 * 날짜 범위를 선택하는 컴포넌트
 */
export interface DateRangePickerProps {
  /** 시작 날짜 (선택) */
  startDate?: string
  /** 종료 날짜 (선택) */
  endDate?: string
  /** 날짜 변경 핸들러 */
  onChange: (startDate?: string, endDate?: string) => void
  /** 추가 CSS 클래스 (선택) */
  className?: string
}
