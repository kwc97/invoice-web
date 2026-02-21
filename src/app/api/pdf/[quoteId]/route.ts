/**
 * PDF 생성 API Route
 * 견적서 ID를 받아 서버사이드에서 PDF를 생성하여 반환 (다국어 지원)
 */

import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { getQuoteById } from '@/lib/notion/quotes'
import { QuoteDocument } from '@/lib/pdf/document'
import { getDictionary, translateQuoteContent } from '@/lib/i18n'
import { formatDateByLanguage } from '@/lib/i18n/format'

interface RouteContext {
  params: Promise<{ quoteId: string }>
}

/** Notion 페이지 ID 형식 검증 (UUID v4 또는 32자리 hex) */
const NOTION_ID_REGEX =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { quoteId } = await context.params

    // 입력 검증: Notion 페이지 ID 형식 확인
    if (!NOTION_ID_REGEX.test(quoteId)) {
      return NextResponse.json(
        { error: '유효하지 않은 견적서 ID입니다' },
        { status: 400 }
      )
    }

    // Notion에서 견적서 데이터 조회 (고객, 항목 포함)
    const quote = await getQuoteById(quoteId)

    if (!quote) {
      return NextResponse.json(
        { error: '견적서를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const lang = quote.language ?? 'ko'
    const dict = getDictionary(lang)

    // 동적 콘텐츠 번역 (한국어 외)
    const translatedQuote =
      lang !== 'ko' ? await translateQuoteContent(quote, lang) : quote

    // 날짜 포맷 변환
    const formattedQuote = {
      ...translatedQuote,
      issueDate: formatDateByLanguage(translatedQuote.issueDate, lang),
      validUntil: formatDateByLanguage(translatedQuote.validUntil, lang),
    }

    // PDF 생성 (서버사이드 렌더링)
    const pdfBuffer = await renderToBuffer(
      QuoteDocument({
        quote: formattedQuote,
        dictionary: dict,
      }) as React.JSX.Element
    )

    // Buffer → Uint8Array 변환 (Response 호환)
    const pdfBytes = new Uint8Array(pdfBuffer)

    // PDF 파일명 (언어별 + 한글 인코딩 처리)
    const titleForFile = dict.quote.title.replace(/\s+/g, '')
    const filename = `${titleForFile}_${quote.quoteNumber}.pdf`
    const encodedFilename = encodeURIComponent(filename)

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    })
  } catch (error) {
    console.error('PDF 생성 실패:', error)
    return NextResponse.json(
      { error: 'PDF 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
