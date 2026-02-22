'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { quoteFormSchema, type QuoteFormData } from '@/lib/validations/quote'
import { createQuoteAction, updateQuoteAction } from '@/app/actions/quote'
import { CreateCustomerDialog } from '@/components/quote/create-customer-dialog'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '@/lib/i18n/types'
import type { Customer } from '@/types/quote'

/** 금액 포맷 (1000단위 콤마) */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value)
}

interface QuoteFormProps {
  mode: 'create' | 'edit'
  customers: Customer[]
  /** 수정 모드 시 기존 데이터 */
  defaultValues?: QuoteFormData
  /** 수정 모드 시 견적서 ID */
  quoteId?: string
}

export function QuoteForm({
  mode,
  customers: initialCustomers,
  defaultValues,
  quoteId,
}: QuoteFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: defaultValues ?? {
      customerId: '',
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      projectName: '',
      recipient: '',
      contactPerson: '',
      notes: '',
      language: 'ko',
      items: [
        {
          name: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          unit: '',
          remarks: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  // 실시간 금액 계산
  const watchedItems = form.watch('items')
  const totalAmount = watchedItems.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  )

  function onSubmit(data: QuoteFormData) {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createQuoteAction(data)
          : await updateQuoteAction(quoteId!, data)

      if (result.success) {
        router.push(
          result.quoteId ? `/admin/quote/${result.quoteId}` : '/admin/dashboard'
        )
      } else {
        alert(result.error || '저장에 실패했습니다')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 기본 정보 */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">기본 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* 고객 선택 */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      고객 <span className="text-destructive">*</span>
                    </FormLabel>
                    <CreateCustomerDialog
                      onCreated={customer => {
                        setCustomers(prev => [...prev, customer])
                        form.setValue('customerId', customer.id)
                      }}
                    />
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="고객을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                          {customer.company ? ` (${customer.company})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 프로젝트명 */}
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>프로젝트명</FormLabel>
                  <FormControl>
                    <Input placeholder="프로젝트명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 견적서 언어 */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>견적서 언어</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="언어 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {LANGUAGE_LABELS[lang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 발행일 */}
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    발행일 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 유효기간 */}
            <FormField
              control={form.control}
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    유효기간 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 수신처 */}
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수신처</FormLabel>
                  <FormControl>
                    <Input placeholder="수신처" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 견적 담당자 */}
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>견적 담당자</FormLabel>
                  <FormControl>
                    <Input placeholder="견적 담당자" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 비고 (전체 너비) */}
          <div className="mt-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비고</FormLabel>
                  <FormControl>
                    <textarea
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="비고사항을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 견적 항목 */}
        <div className="rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">견적 항목</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  name: '',
                  description: '',
                  quantity: 1,
                  unitPrice: 0,
                  unit: '',
                  remarks: '',
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              항목 추가
            </Button>
          </div>

          {form.formState.errors.items?.root && (
            <p className="text-destructive mb-4 text-sm">
              {form.formState.errors.items.root.message}
            </p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-muted/30 rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    항목 {index + 1}
                  </Label>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* 품목명 */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>
                          품목명 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="품목명" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 수량 */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          수량 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="1"
                            {...field}
                            onChange={e =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 단가 */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          단가 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                            onChange={e =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 단위 */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>단위</FormLabel>
                        <FormControl>
                          <Input placeholder="예: EA, 인, 식" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 설명 */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>설명</FormLabel>
                        <FormControl>
                          <Input placeholder="항목 설명" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 비고 */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.remarks`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비고</FormLabel>
                        <FormControl>
                          <Input placeholder="비고" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 항목 금액 표시 */}
                <div className="mt-3 text-right text-sm">
                  금액:{' '}
                  <span className="font-semibold">
                    ₩
                    {formatCurrency(
                      (Number(watchedItems[index]?.quantity) || 0) *
                        (Number(watchedItems[index]?.unitPrice) || 0)
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 합계 */}
          <div className="mt-6 flex justify-end border-t pt-4">
            <div className="text-right">
              <span className="text-muted-foreground text-sm">합계</span>
              <p className="text-2xl font-bold">
                ₩{formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? '견적서 생성' : '견적서 수정'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
