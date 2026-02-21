import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo.png"
              alt="케이프로텍"
              width={280}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            견적서 관리
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            견적서 관리 및 공유 시스템입니다.
            <br />
            관리자는 로그인하여 견적서를 관리하고 공개 링크를 생성할 수
            있습니다.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">관리자 로그인</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
