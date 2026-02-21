/**
 * PDF 언어별 폰트 등록
 * @react-pdf/renderer는 TTF 포맷만 지원
 */

import { Font } from '@react-pdf/renderer'
import type { SupportedLanguage } from '@/lib/i18n/types'

/** 한글 폰트: Nanum Gothic */
Font.register({
  family: 'NanumGothic',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf',
      fontWeight: 700,
    },
  ],
})

/** 일본어 폰트: Noto Sans JP */
Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v53/Nkg7-Y3_YqK-w5SQJM1EDkG1AHbGiSw.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v53/Nkg7-Y3_YqK-w5SQJM1EDkG1IH_GiSw.ttf',
      fontWeight: 700,
    },
  ],
})

/** 중국어 폰트: Noto Sans SC */
Font.register({
  family: 'NotoSansSC',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_EnYxNbPCJo4.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnIxNbPCJo4.ttf',
      fontWeight: 700,
    },
  ],
})

/** 라틴 폰트: Noto Sans (en, it, es) */
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0mIhZia3gIGGBbLp6btlRt.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosans/v36/o-0NIhZia3gIGGBbLp6gu7JhYQ.ttf',
      fontWeight: 700,
    },
  ],
})

/** 하이픈 콜백 비활성화 (CJK 언어는 하이픈 불필요) */
Font.registerHyphenationCallback(word => [word])

/** 언어별 폰트 패밀리 반환 */
export function getFontFamily(lang: SupportedLanguage): string {
  switch (lang) {
    case 'ko':
      return 'NanumGothic'
    case 'ja':
      return 'NotoSansJP'
    case 'zh':
      return 'NotoSansSC'
    case 'en':
    case 'it':
    case 'es':
      return 'NotoSans'
    default:
      return 'NanumGothic'
  }
}
