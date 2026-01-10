import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  // Notion API 설정
  NOTION_API_KEY: z.string().optional(),
  NOTION_DATABASE_QUOTES_ID: z.string().optional(),
  NOTION_DATABASE_QUOTE_ITEMS_ID: z.string().optional(),
  NOTION_DATABASE_CUSTOMERS_ID: z.string().optional(),
  // NextAuth.js 설정
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  // 관리자 계정
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  // 애플리케이션 설정
  APP_URL: z.string().url().optional(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_QUOTES_ID: process.env.NOTION_DATABASE_QUOTES_ID,
  NOTION_DATABASE_QUOTE_ITEMS_ID: process.env.NOTION_DATABASE_QUOTE_ITEMS_ID,
  NOTION_DATABASE_CUSTOMERS_ID: process.env.NOTION_DATABASE_CUSTOMERS_ID,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  APP_URL: process.env.APP_URL,
})

export type Env = z.infer<typeof envSchema>

// 필수 환경 변수 목록
const requiredEnvVars = [
  'NOTION_API_KEY',
  'NOTION_DATABASE_QUOTES_ID',
  'NOTION_DATABASE_QUOTE_ITEMS_ID',
  'NOTION_DATABASE_CUSTOMERS_ID',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const

// 개발 환경에서 환경 변수 검증
export function validateEnv() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])

  if (missing.length > 0) {
    console.error('⚠️  다음 환경 변수가 설정되지 않았습니다:')
    missing.forEach(envVar => console.error(`   - ${envVar}`))
    console.error('\n📝 .env.local 파일을 확인해주세요.')

    if (process.env.NODE_ENV === 'production') {
      throw new Error('필수 환경 변수가 누락되었습니다.')
    }
  }
}
