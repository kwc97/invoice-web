/**
 * 인증 관련 Zod 검증 스키마
 * 로그인 폼 등의 유효성 검사
 */

import { z } from 'zod'

/**
 * 로그인 폼 검증 스키마
 */
export const loginSchema = z.object({
  /** 이메일 */
  email: z
    .string({ message: '이메일을 입력해주세요' })
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .toLowerCase()
    .trim(),

  /** 비밀번호 */
  password: z
    .string({ message: '비밀번호를 입력해주세요' })
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(100, '비밀번호는 100자를 초과할 수 없습니다'),
})

/**
 * 로그인 폼 데이터 타입 (Zod 스키마에서 추론)
 */
export type LoginFormData = z.infer<typeof loginSchema>

/**
 * 비밀번호 변경 폼 검증 스키마 (MVP 이후)
 */
export const changePasswordSchema = z
  .object({
    /** 현재 비밀번호 */
    currentPassword: z
      .string({ message: '현재 비밀번호를 입력해주세요' })
      .min(1, '현재 비밀번호를 입력해주세요'),

    /** 새 비밀번호 */
    newPassword: z
      .string({ message: '새 비밀번호를 입력해주세요' })
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .max(100, '비밀번호는 100자를 초과할 수 없습니다'),

    /** 새 비밀번호 확인 */
    confirmPassword: z
      .string({ message: '비밀번호 확인을 입력해주세요' })
      .min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
    path: ['newPassword'],
  })

/**
 * 비밀번호 변경 폼 데이터 타입 (Zod 스키마에서 추론)
 */
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
