import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 숫자를 한글 금액 표현으로 변환
 * 예: 450000 → "사십오만"
 * 예: 12500000 → "일천이백오십만"
 */
export function numberToKoreanCurrency(num: number): string {
  if (num === 0) return '영'

  const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
  const smallUnits = ['', '십', '백', '천']
  const bigUnits = ['', '만', '억', '조']

  // 4자리씩 분할
  const groups: number[] = []
  let remaining = Math.abs(num)
  while (remaining > 0) {
    groups.push(remaining % 10000)
    remaining = Math.floor(remaining / 10000)
  }

  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i]
    if (group === 0) continue

    let groupStr = ''
    let g = group
    for (let j = 3; j >= 0; j--) {
      const divisor = Math.pow(10, j)
      const d = Math.floor(g / divisor)
      g = g % divisor
      if (d === 0) continue
      // '일'은 십/백/천 앞에서 생략 (단, 일의 자리는 표기)
      if (d === 1 && j > 0) {
        groupStr += smallUnits[j]
      } else {
        groupStr += digits[d] + smallUnits[j]
      }
    }
    parts.push(groupStr + bigUnits[i])
  }

  return parts.join('')
}

/**
 * 한국 전화번호를 국제 형식으로 변환
 * 예: "010-3307-9943" → "+82-10-3307-9943"
 * 예: "031-704-2989" → "+82-31-704-2989"
 * 문자열 내 모든 한국 전화번호 패턴을 자동 감지하여 변환
 */
export function formatKoreanPhoneToInternational(text: string): string {
  // 0으로 시작하는 한국 전화번호 패턴 (예: 010-1234-5678, 031-704-2989, 02-1234-5678)
  return text.replace(/\b0(\d{1,2})-(\d{3,4})-(\d{4})\b/g, '+82-$1-$2-$3')
}
