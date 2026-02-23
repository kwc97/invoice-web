/**
 * Notion 페이지 본문 블록 조작 (부속 내역서 JSON 저장/조회)
 * Code Block에 JSON을 저장하여 2000자 제한 회피
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { notion } from './client'
import type { AppendixTable } from '@/types/appendix'
import { ensureTotalFlags } from '@/lib/appendix/utils'

/** 부속 내역서 마커 텍스트 */
const APPENDIX_MARKER = 'APPENDIX_DATA'

/** Notion rich_text 최대 길이 */
const MAX_RICH_TEXT_LENGTH = 2000

/**
 * 페이지 본문에서 부속 내역서 데이터 조회 (복수 지원)
 * APPENDIX_DATA 마커 heading 뒤의 code block에서 JSON 파싱
 * 배열 또는 단일 객체(하위 호환) 모두 처리
 */
export async function getAppendixData(
  pageId: string
): Promise<AppendixTable[]> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    const blocks = response.results as any[]
    let foundMarker = false

    for (const block of blocks) {
      // 마커 heading 찾기
      if (
        block.type === 'heading_3' &&
        block.heading_3?.rich_text?.[0]?.plain_text === APPENDIX_MARKER
      ) {
        foundMarker = true
        continue
      }

      // 마커 뒤의 code block에서 JSON 추출
      if (foundMarker && block.type === 'code') {
        const richTextArray = block.code?.rich_text ?? []
        const json = richTextArray.map((rt: any) => rt.plain_text).join('')

        try {
          const parsed = JSON.parse(json)
          // 하위 호환: 단일 객체면 배열로 감싸기
          const tables = Array.isArray(parsed)
            ? (parsed as AppendixTable[])
            : [parsed as AppendixTable]
          // 합계 행 자동 감지 (isTotal 미설정 데이터 보정)
          return ensureTotalFlags(tables)
        } catch {
          console.error('[getAppendixData] JSON 파싱 실패')
          return []
        }
      }

      // 마커 뒤에 code block이 아닌 다른 블록이 오면 중단
      if (foundMarker) {
        break
      }
    }

    return []
  } catch (error) {
    console.error('[getAppendixData] 블록 조회 실패:', error)
    return []
  }
}

/**
 * 페이지 본문에 부속 내역서 데이터 저장 (복수 지원)
 * 기존 appendix 블록 삭제 후 마커 heading + code block(JSON) 생성
 * 빈 배열 전달 시 기존 블록만 삭제
 */
export async function saveAppendixData(
  pageId: string,
  tables: AppendixTable[]
): Promise<void> {
  // 1. 기존 appendix 블록 삭제
  await deleteAppendixBlocks(pageId)

  // 2. 데이터가 없으면 삭제만 하고 종료
  if (tables.length === 0) return

  // 3. JSON 직렬화 및 2000자 청크 분할
  const json = JSON.stringify(tables)
  const richTextChunks = splitToRichText(json)

  // 4. 마커 heading + code block 생성
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: 'block' as const,
        type: 'heading_3' as const,
        heading_3: {
          rich_text: [
            { type: 'text' as const, text: { content: APPENDIX_MARKER } },
          ],
        },
      },
      {
        object: 'block' as const,
        type: 'code' as const,
        code: {
          language: 'json' as any,
          rich_text: richTextChunks,
        },
      },
    ] as any,
  })
}

/**
 * 기존 appendix 관련 블록(마커 heading + code block) 삭제
 */
async function deleteAppendixBlocks(pageId: string): Promise<void> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    const blocks = response.results as any[]
    const toDelete: string[] = []
    let foundMarker = false

    for (const block of blocks) {
      if (
        block.type === 'heading_3' &&
        block.heading_3?.rich_text?.[0]?.plain_text === APPENDIX_MARKER
      ) {
        foundMarker = true
        toDelete.push(block.id)
        continue
      }

      if (foundMarker && block.type === 'code') {
        toDelete.push(block.id)
        break // 마커 + code 한 쌍만 삭제
      }

      if (foundMarker) {
        break
      }
    }

    // 블록 삭제 (병렬)
    await Promise.all(
      toDelete.map(id => notion.blocks.delete({ block_id: id }))
    )
  } catch (error) {
    console.error('[deleteAppendixBlocks] 블록 삭제 실패:', error)
  }
}

/**
 * 긴 문자열을 Notion rich_text 배열로 2000자씩 분할
 */
function splitToRichText(
  content: string
): Array<{ type: 'text'; text: { content: string } }> {
  const chunks: Array<{ type: 'text'; text: { content: string } }> = []

  for (let i = 0; i < content.length; i += MAX_RICH_TEXT_LENGTH) {
    chunks.push({
      type: 'text',
      text: { content: content.slice(i, i + MAX_RICH_TEXT_LENGTH) },
    })
  }

  return chunks
}
