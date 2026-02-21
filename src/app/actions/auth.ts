'use server'

/**
 * 인증 관련 Server Actions
 * NextAuth.js v5와 연동된 로그인/로그아웃 처리
 */

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

/**
 * 로그인 Server Action
 * @param prevState - 이전 상태 (React useFormState 호환)
 * @param formData - 폼 데이터 (email, password)
 * @returns 인증 결과
 */
export async function authenticate(
  prevState: { success: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return {
        success: false,
        error: '이메일과 비밀번호를 입력해주세요.',
      }
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: '이메일 또는 비밀번호가 올바르지 않습니다.',
          }
        default:
          return {
            success: false,
            error: '인증 중 오류가 발생했습니다.',
          }
      }
    }

    // NEXT_REDIRECT 에러는 성공적인 리다이렉트를 의미
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return { success: true }
    }

    console.error('인증 오류:', error)
    return {
      success: false,
      error: '알 수 없는 오류가 발생했습니다.',
    }
  }
}

/**
 * 로그인 Server Action (직접 호출용)
 * @param email - 이메일
 * @param password - 비밀번호
 * @returns 인증 결과
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: '이메일 또는 비밀번호가 올바르지 않습니다.',
          }
        default:
          return {
            success: false,
            error: '인증 중 오류가 발생했습니다.',
          }
      }
    }

    // NEXT_REDIRECT 에러는 성공적인 리다이렉트를 의미
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return { success: true }
    }

    console.error('로그인 오류:', error)
    return {
      success: false,
      error: '알 수 없는 오류가 발생했습니다.',
    }
  }
}

/**
 * 로그아웃 Server Action
 * @returns 로그아웃 결과
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut({ redirect: false })
    return { success: true }
  } catch (error) {
    // NEXT_REDIRECT 에러는 성공적인 리다이렉트를 의미
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return { success: true }
    }

    console.error('로그아웃 오류:', error)
    return {
      success: false,
      error: '로그아웃 중 오류가 발생했습니다.',
    }
  }
}
