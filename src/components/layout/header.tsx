'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Container } from './container'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { logout } from '@/app/actions/auth'

/**
 * 관리자 전용 헤더 컴포넌트
 * 로고, 네비게이션, 로그아웃 버튼, 모바일 메뉴 포함
 */
export function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await logout()
      if (result.success) {
        toast.success('로그아웃되었습니다')
        router.push('/login')
        router.refresh() // 세션 상태 갱신
      } else {
        toast.error(result.error || '로그아웃에 실패했습니다.')
      }
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="케이프로텍"
              width={180}
              height={40}
              className="block h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="케이프로텍"
              width={180}
              height={40}
              className="hidden h-10 w-auto dark:block"
              priority
            />
            <span className="text-xl font-bold">견적서 관리</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                대시보드
              </Link>
            </nav>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </div>

          {/* 모바일 메뉴 */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4">
                  <Link
                    href="/admin/dashboard"
                    className="text-foreground text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    대시보드
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start"
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}
