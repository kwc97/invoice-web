/**
 * NextAuth.js v5 설정
 * Credentials Provider를 사용한 관리자 인증
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'

/**
 * 로그인 자격 증명 스키마
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

/**
 * 환경 변수에서 관리자 계정 정보 가져오기
 */
function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('관리자 계정 환경 변수가 설정되지 않았습니다.')
    return null
  }

  return { email, password }
}

/**
 * NextAuth.js v5 설정
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    /**
     * JWT 콜백: 토큰에 사용자 정보 추가
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = 'admin'
      }
      return token
    },

    /**
     * 세션 콜백: 세션에 사용자 정보 노출
     */
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        // @ts-expect-error role is custom property
        session.user.role = token.role as string
      }
      return session
    },

    /**
     * 인가 콜백: 보호된 경로 접근 제어
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnLogin = nextUrl.pathname === '/login'

      // 이미 로그인한 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      }

      // 관리자 페이지 접근 시 로그인 필요
      if (isOnAdmin && !isLoggedIn) {
        return false // 미인증 시 로그인 페이지로 리다이렉트
      }

      return true
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        // 자격 증명 유효성 검사
        const parsedCredentials = credentialsSchema.safeParse(credentials)
        if (!parsedCredentials.success) {
          console.error('잘못된 자격 증명 형식:', parsedCredentials.error)
          return null
        }

        const { email, password } = parsedCredentials.data

        // 관리자 계정 정보 확인
        const admin = getAdminCredentials()
        if (!admin) {
          return null
        }

        // 이메일 확인
        if (email !== admin.email) {
          console.log('인증 실패: 이메일 불일치')
          return null
        }

        // 비밀번호 확인 (bcryptjs 해시 비교)
        const passwordMatch = await bcryptjs.compare(password, admin.password)
        if (!passwordMatch) {
          console.log('인증 실패: 비밀번호 불일치')
          return null
        }

        // 인증 성공 - 사용자 정보 반환
        return {
          id: '1',
          email: admin.email,
          name: '관리자',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24시간
  },
  trustHost: true,
})
