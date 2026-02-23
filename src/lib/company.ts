/**
 * 다중 법인(회사) 설정 모듈
 * 각 회사의 브랜딩, 공급자 정보, 견적서 설정을 중앙 관리
 */

import type { SupportedLanguage } from '@/lib/i18n/types'

/** 지원 회사 ID */
export type CompanyId = 'kprotek' | 'jungwon' | 'shinwoo'

/** 기본 회사 */
export const DEFAULT_COMPANY: CompanyId = 'kprotek'

/** 공급자 정보 값 (언어별 번역) */
export interface SupplierValues {
  companyName: string
  representative: string
  address: string
  businessType: string
  businessCategory: string
  tel: string
  fax: string
}

/** PDF 도장 위치 설정 */
export interface StampPosition {
  top: number
  right: number
  width?: number
  height?: number
}

/** 회사 설정 인터페이스 */
export interface CompanyConfig {
  id: CompanyId
  /** 화면 표시용 이름 */
  displayName: string
  /** 영문 이름 */
  displayNameEn: string
  /** 견적서 번호 접두사 (예: QFK, QFJ) */
  quotePrefix: string
  /** 로고 이미지 경로 (웹 뷰용) */
  logo: string
  /** 다크 모드 로고 (있을 경우) */
  logoDark?: string
  /** 도장 이미지 경로 (없으면 PDF에 도장 미표시) */
  stamp?: string
  /** PDF 도장 위치 (기본: 테이블 우상단) */
  stampPosition?: StampPosition
  /** 파비콘 경로 (미설정 시 기본 아이콘 사용) */
  icon?: string
  /** 사업자등록번호 */
  businessNumber: string
  /** 이메일 */
  email: string
  /** 언어별 공급자 정보 */
  supplierValues: Record<SupportedLanguage, SupplierValues>
}

/** 회사 설정 레지스트리 */
export const COMPANIES: Record<CompanyId, CompanyConfig> = {
  kprotek: {
    id: 'kprotek',
    displayName: '(주)케이프로텍',
    displayNameEn: 'KPROTEK Co.,Ltd.',
    quotePrefix: 'QFK',
    logo: '/logo.png',
    logoDark: '/logo-dark.png',
    stamp: '/stamp.png',
    stampPosition: { top: -18, right: 2 },
    businessNumber: '129-86-56148',
    email: 'info@kprotek.com',
    supplierValues: {
      ko: {
        companyName: '(주)케이프로텍',
        representative: '신창군',
        address: '경기도 평택시 오성서로 5-67',
        businessType: '건설업,제조업,도소매',
        businessCategory: '기계설치,기계장치,기계설비',
        tel: '031-704-2989',
        fax: '031-704-2985',
      },
      en: {
        companyName: 'KPROTEK Co., Ltd.',
        representative: 'Shin Chang-gun',
        address: '5-67, Oseong-seo-ro, Pyeongtaek-si, Gyeonggi-do, Korea',
        businessType: 'Construction, Manufacturing, Wholesale/Retail',
        businessCategory: 'Machine Installation, Machinery, Machine Equipment',
        tel: '+82-31-704-2989',
        fax: '+82-31-704-2985',
      },
      ja: {
        companyName: 'KPROTEK Co., Ltd.',
        representative: 'シン・チャングン',
        address: '韓国京畿道平沢市五城西路5-67',
        businessType: '建設業, 製造業, 卸売/小売',
        businessCategory: '機械設置, 機械装置, 機械設備',
        tel: '+82-31-704-2989',
        fax: '+82-31-704-2985',
      },
      zh: {
        companyName: 'KPROTEK Co., Ltd.',
        representative: '申昌君',
        address: '韩国京畿道平泽市五城西路5-67',
        businessType: '建筑业, 制造业, 批发/零售',
        businessCategory: '机械安装, 机械设备, 机械装备',
        tel: '+82-31-704-2989',
        fax: '+82-31-704-2985',
      },
      it: {
        companyName: 'KPROTEK Co., Ltd.',
        representative: 'Shin Chang-gun',
        address:
          '5-67, Oseong-seo-ro, Pyeongtaek-si, Gyeonggi-do, Corea del Sud',
        businessType: 'Costruzione, Produzione, Commercio',
        businessCategory: 'Installazione macchine, Macchinari, Attrezzature',
        tel: '+82-31-704-2989',
        fax: '+82-31-704-2985',
      },
      es: {
        companyName: 'KPROTEK Co., Ltd.',
        representative: 'Shin Chang-gun',
        address:
          '5-67, Oseong-seo-ro, Pyeongtaek-si, Gyeonggi-do, Corea del Sur',
        businessType: 'Construcción, Manufactura, Comercio',
        businessCategory: 'Instalación de maquinaria, Maquinaria, Equipos',
        tel: '+82-31-704-2989',
        fax: '+82-31-704-2985',
      },
    },
  },
  jungwon: {
    id: 'jungwon',
    displayName: '(주)정원디앤비',
    displayNameEn: 'Jungwon D&B',
    quotePrefix: 'QFJ',
    logo: '/logo-jungwon.jpg',
    stamp: '/stamp-jungwon.png',
    stampPosition: { top: -7, right: 5 },
    icon: '/icon-jungwon.svg',
    businessNumber: '129-86-02109',
    email: 'jnocorp@naver.com',
    supplierValues: {
      ko: {
        companyName: '(주)정원디앤비',
        representative: '신창군',
        address: '충청남도 천안시 서북구 직산읍 성진로 434-44',
        businessType: '건설업, 도소매업',
        businessCategory: '기계설비 공사업 외',
        tel: '070-4101-5262',
        fax: '',
      },
      en: {
        companyName: 'Jungwon D&B Co., Ltd.',
        representative: 'Shin Chang-gun',
        address:
          '434-44, Seongjin-ro, Jiksan-eup, Seobuk-gu, Cheonan-si, Chungcheongnam-do, Korea',
        businessType: 'Construction, Wholesale/Retail',
        businessCategory: 'Mechanical Equipment Construction, etc.',
        tel: '+82-70-4101-5262',
        fax: '',
      },
      ja: {
        companyName: 'Jungwon D&B Co., Ltd.',
        representative: 'シン・チャングン',
        address: '韓国忠清南道天安市西北区稷山邑聖進路434-44',
        businessType: '建設業, 卸売/小売',
        businessCategory: '機械設備工事業 他',
        tel: '+82-70-4101-5262',
        fax: '',
      },
      zh: {
        companyName: 'Jungwon D&B Co., Ltd.',
        representative: '申昌君',
        address: '韩国忠清南道天安市西北区稷山邑圣进路434-44',
        businessType: '建筑业, 批发/零售',
        businessCategory: '机械设备施工业 等',
        tel: '+82-70-4101-5262',
        fax: '',
      },
      it: {
        companyName: 'Jungwon D&B Co., Ltd.',
        representative: 'Shin Chang-gun',
        address:
          '434-44, Seongjin-ro, Jiksan-eup, Seobuk-gu, Cheonan-si, Chungcheongnam-do, Corea del Sud',
        businessType: 'Costruzione, Commercio',
        businessCategory: 'Costruzione impianti meccanici, ecc.',
        tel: '+82-70-4101-5262',
        fax: '',
      },
      es: {
        companyName: 'Jungwon D&B Co., Ltd.',
        representative: 'Shin Chang-gun',
        address:
          '434-44, Seongjin-ro, Jiksan-eup, Seobuk-gu, Cheonan-si, Chungcheongnam-do, Corea del Sur',
        businessType: 'Construcción, Comercio',
        businessCategory: 'Construcción de equipos mecánicos, etc.',
        tel: '+82-70-4101-5262',
        fax: '',
      },
    },
  },
  shinwoo: {
    id: 'shinwoo',
    displayName: '(주)신우테크',
    displayNameEn: 'SHINWOO TECH Co.,Ltd.',
    quotePrefix: 'QFS',
    logo: '/logo-shinwoo.png',
    icon: '/icon-shinwoo.png',
    businessNumber: '212-81-51533',
    email: '',
    supplierValues: {
      ko: {
        companyName: '(주)신우테크',
        representative: '이성재',
        address: '경기도 성남시 분당구 판교로 744, 시동 지하 102호 (야탑동)',
        businessType: '제조,도소매',
        businessCategory: '불티방지용품류',
        tel: '031-704-2986',
        fax: '031-704-2985',
      },
      en: {
        companyName: 'SHINWOO TECH Co., Ltd.',
        representative: 'Lee Sung-jae',
        address:
          '744, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea (B1-102, Sidong, Yatap-dong)',
        businessType: 'Manufacturing, Wholesale/Retail',
        businessCategory: 'Fire Prevention Products',
        tel: '+82-31-704-2986',
        fax: '+82-31-704-2985',
      },
      ja: {
        companyName: 'SHINWOO TECH Co., Ltd.',
        representative: 'イ・ソンジェ',
        address:
          '韓国京畿道城南市盆唐区板橋路744, 市棟 地下102号 (野塔洞)',
        businessType: '製造業, 卸売/小売',
        businessCategory: '防火用品類',
        tel: '+82-31-704-2986',
        fax: '+82-31-704-2985',
      },
      zh: {
        companyName: 'SHINWOO TECH Co., Ltd.',
        representative: '李成宰',
        address:
          '韩国京畿道城南市盆唐区板桥路744, 市栋 地下102号 (野塔洞)',
        businessType: '制造业, 批发/零售',
        businessCategory: '防火用品类',
        tel: '+82-31-704-2986',
        fax: '+82-31-704-2985',
      },
      it: {
        companyName: 'SHINWOO TECH Co., Ltd.',
        representative: 'Lee Sung-jae',
        address:
          '744, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Corea del Sud',
        businessType: 'Produzione, Commercio',
        businessCategory: 'Prodotti antincendio',
        tel: '+82-31-704-2986',
        fax: '+82-31-704-2985',
      },
      es: {
        companyName: 'SHINWOO TECH Co., Ltd.',
        representative: 'Lee Sung-jae',
        address:
          '744, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Corea del Sur',
        businessType: 'Manufactura, Comercio',
        businessCategory: 'Productos de prevención de incendios',
        tel: '+82-31-704-2986',
        fax: '+82-31-704-2985',
      },
    },
  },
}

/** 회사 ID 목록 */
export const COMPANY_IDS = Object.keys(COMPANIES) as CompanyId[]

/** 회사 설정 조회 */
export function getCompanyConfig(companyId: CompanyId): CompanyConfig {
  return COMPANIES[companyId] ?? COMPANIES[DEFAULT_COMPANY]
}

/** 특정 회사 + 언어의 공급자 정보 조회 */
export function getCompanySupplierValues(
  companyId: CompanyId,
  lang: SupportedLanguage = 'ko'
): SupplierValues {
  const config = getCompanyConfig(companyId)
  return config.supplierValues[lang] ?? config.supplierValues.ko
}

/** Notion Select 값에서 CompanyId로 변환 */
export function getCompanyIdByNotionValue(
  notionValue: string | null | undefined
): CompanyId {
  if (!notionValue) return DEFAULT_COMPANY
  const lower = notionValue.toLowerCase()
  if (lower === 'jungwon' || lower === '정원디앤비') return 'jungwon'
  if (lower === 'shinwoo' || lower === '신우테크') return 'shinwoo'
  return 'kprotek'
}
