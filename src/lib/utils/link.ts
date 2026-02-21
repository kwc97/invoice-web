/**
 * 링크 생성 유틸리티
 */

import { nanoid } from 'nanoid'

/**
 * 공개 링크 ID 생성
 * @param length - ID 길이 (기본: 12)
 * @returns URL-safe한 고유 ID
 */
export function generatePublicLinkId(length: number = 12): string {
  return nanoid(length)
}
