'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Category } from '@/src/types'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/src/store/services/categoriesApi'


const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  initialData?: Partial<Category>
  onSuccess?: () => void
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (initialData?.id) {
        await updateCategory({
          id: Number(initialData.id),
          data,
        }).unwrap()
        toast.success('Category updated successfully')
      } else {
        await createCategory(data).unwrap()
        toast.success('Category created successfully')
      }
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input placeholder="Category name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          placeholder="Category description"
          className="w-full px-3 py-2 border border-input rounded-md text-sm"
          rows={3}
          {...register('description')}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  )
}
