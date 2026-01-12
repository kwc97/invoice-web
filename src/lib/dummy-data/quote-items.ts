import type { QuoteItem } from '@/types/quote'

/**
 * 더미 QuoteItem 데이터
 * Phase 3에서 Notion API로 교체 예정
 */
export const dummyQuoteItems: QuoteItem[] = [
  // Quote 1 items
  {
    id: 'item-1-1',
    quoteId: 'quote-1',
    name: '웹사이트 디자인',
    description: '반응형 웹사이트 UI/UX 디자인',
    quantity: 1,
    unitPrice: 3000000,
    amount: 3000000,
  },
  {
    id: 'item-1-2',
    quoteId: 'quote-1',
    name: '프론트엔드 개발',
    description: 'React 기반 프론트엔드 구현',
    quantity: 1,
    unitPrice: 5000000,
    amount: 5000000,
  },
  {
    id: 'item-1-3',
    quoteId: 'quote-1',
    name: '백엔드 API 개발',
    description: 'RESTful API 서버 구축',
    quantity: 1,
    unitPrice: 4000000,
    amount: 4000000,
  },

  // Quote 2 items
  {
    id: 'item-2-1',
    quoteId: 'quote-2',
    name: '모바일 앱 디자인',
    description: 'iOS/Android 앱 UI/UX',
    quantity: 2,
    unitPrice: 2500000,
    amount: 5000000,
  },
  {
    id: 'item-2-2',
    quoteId: 'quote-2',
    name: '앱 개발',
    description: 'React Native 기반 개발',
    quantity: 1,
    unitPrice: 8000000,
    amount: 8000000,
  },

  // Quote 3 items
  {
    id: 'item-3-1',
    quoteId: 'quote-3',
    name: '브랜드 아이덴티티 디자인',
    description: '로고 및 브랜드 가이드',
    quantity: 1,
    unitPrice: 1500000,
    amount: 1500000,
  },
  {
    id: 'item-3-2',
    quoteId: 'quote-3',
    name: '마케팅 자료 제작',
    description: '브로슈어, 명함, 포스터',
    quantity: 3,
    unitPrice: 500000,
    amount: 1500000,
  },

  // Quote 4 items
  {
    id: 'item-4-1',
    quoteId: 'quote-4',
    name: 'SEO 최적화',
    description: '검색엔진 최적화 컨설팅',
    quantity: 1,
    unitPrice: 2000000,
    amount: 2000000,
  },
  {
    id: 'item-4-2',
    quoteId: 'quote-4',
    name: '콘텐츠 마케팅',
    description: '블로그 콘텐츠 제작 (월 10개)',
    quantity: 3,
    unitPrice: 1000000,
    amount: 3000000,
  },
  {
    id: 'item-4-3',
    quoteId: 'quote-4',
    name: '소셜 미디어 관리',
    description: 'SNS 계정 운영 대행',
    quantity: 1,
    unitPrice: 1500000,
    amount: 1500000,
  },

  // Quote 5 items
  {
    id: 'item-5-1',
    quoteId: 'quote-5',
    name: '데이터베이스 설계',
    description: 'PostgreSQL 스키마 설계',
    quantity: 1,
    unitPrice: 2000000,
    amount: 2000000,
  },
  {
    id: 'item-5-2',
    quoteId: 'quote-5',
    name: 'API 문서화',
    description: 'Swagger/OpenAPI 문서 작성',
    quantity: 1,
    unitPrice: 800000,
    amount: 800000,
  },

  // Quote 6 items
  {
    id: 'item-6-1',
    quoteId: 'quote-6',
    name: 'UI/UX 리서치',
    description: '사용자 인터뷰 및 분석',
    quantity: 1,
    unitPrice: 3000000,
    amount: 3000000,
  },

  // Quote 7 items
  {
    id: 'item-7-1',
    quoteId: 'quote-7',
    name: '클라우드 인프라 구축',
    description: 'AWS 서버 설정 및 배포',
    quantity: 1,
    unitPrice: 4000000,
    amount: 4000000,
  },
  {
    id: 'item-7-2',
    quoteId: 'quote-7',
    name: 'CI/CD 파이프라인',
    description: 'GitHub Actions 자동화',
    quantity: 1,
    unitPrice: 2000000,
    amount: 2000000,
  },

  // Quote 8 items
  {
    id: 'item-8-1',
    quoteId: 'quote-8',
    name: '보안 감사',
    description: '웹사이트 보안 취약점 점검',
    quantity: 1,
    unitPrice: 2500000,
    amount: 2500000,
  },
  {
    id: 'item-8-2',
    quoteId: 'quote-8',
    name: '보안 패치',
    description: '발견된 취약점 수정',
    quantity: 1,
    unitPrice: 1500000,
    amount: 1500000,
  },

  // Quote 9 items
  {
    id: 'item-9-1',
    quoteId: 'quote-9',
    name: 'e-커머스 플랫폼 구축',
    description: '쇼핑몰 웹사이트 전체 개발',
    quantity: 1,
    unitPrice: 15000000,
    amount: 15000000,
  },
  {
    id: 'item-9-2',
    quoteId: 'quote-9',
    name: '결제 시스템 연동',
    description: 'PG사 API 통합',
    quantity: 1,
    unitPrice: 3000000,
    amount: 3000000,
  },

  // Quote 10 items
  {
    id: 'item-10-1',
    quoteId: 'quote-10',
    name: '유지보수 계약',
    description: '월간 유지보수 서비스',
    quantity: 12,
    unitPrice: 500000,
    amount: 6000000,
  },

  // Quote 11 items
  {
    id: 'item-11-1',
    quoteId: 'quote-11',
    name: '랜딩페이지 제작',
    description: '프로모션용 원페이지 웹사이트',
    quantity: 1,
    unitPrice: 1200000,
    amount: 1200000,
  },

  // Quote 12 items
  {
    id: 'item-12-1',
    quoteId: 'quote-12',
    name: 'CRM 시스템 개발',
    description: '고객 관리 시스템 구축',
    quantity: 1,
    unitPrice: 10000000,
    amount: 10000000,
  },
  {
    id: 'item-12-2',
    quoteId: 'quote-12',
    name: '직원 교육',
    description: 'CRM 사용법 교육',
    quantity: 2,
    unitPrice: 500000,
    amount: 1000000,
  },
]
