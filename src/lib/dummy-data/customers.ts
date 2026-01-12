import type { Customer } from '@/types/quote'

/**
 * 더미 Customer 데이터
 * Phase 3에서 Notion API로 교체 예정
 */
export const dummyCustomers: Customer[] = [
  {
    id: 'customer-1',
    name: '김철수',
    company: '(주)테크코리아',
    email: 'kim@techkorea.com',
    phone: '02-1234-5678',
    address: '서울시 강남구 테헤란로 123',
  },
  {
    id: 'customer-2',
    name: '이영희',
    company: '글로벌솔루션',
    email: 'lee@globalsolution.com',
    phone: '02-2345-6789',
    address: '서울시 서초구 서초대로 456',
  },
  {
    id: 'customer-3',
    name: '박민수',
    company: '스타트업랩',
    email: 'park@startuplab.io',
    phone: '010-3456-7890',
    address: '서울시 마포구 월드컵북로 789',
  },
  {
    id: 'customer-4',
    name: '최지영',
    company: '디자인스튜디오',
    email: 'choi@designstudio.kr',
    phone: '02-4567-8901',
    address: '서울시 용산구 한강대로 321',
  },
  {
    id: 'customer-5',
    name: '정현우',
    company: '비즈니스파트너스',
    email: 'jung@bizpartners.co.kr',
    phone: '02-5678-9012',
    address: '서울시 종로구 종로 654',
  },
  {
    id: 'customer-6',
    name: '강수진',
    company: '혁신기업',
    email: 'kang@innovation.com',
    phone: '010-6789-0123',
    address: '서울시 성동구 왕십리로 987',
  },
]
