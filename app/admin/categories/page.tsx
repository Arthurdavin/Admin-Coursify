'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2, Edit2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux'
import { Category } from '@/src/types'
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from '@/src/store/services/categoriesApi'
import { Column, DataTable } from '@/src/components/admin/DataTable'
import { closeModal, openModal } from '@/src/store/slices/uiSlice'
import { ConfirmDialog, Modal } from '@/src/components/admin/Modal'
import { CategoryForm } from '@/src/components/admin/forms/CategoryForm'

export default function CategoriesPage() {
  const dispatch = useAppDispatch()
  const { modalOpen } = useAppSelector((state) => state.ui)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // ✅ No pagination params — backend returns plain List<CategoryResponse>
  const { data: categories = [], isLoading } = useGetCategoriesQuery()

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const columns: Column<Category>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'id',
      label: 'Actions',
      render: (_value, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedCategory(row)
              dispatch(openModal({ type: 'edit', data: row }))
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedCategory(row)
              setDeleteConfirmOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleDelete = async () => {
    if (!selectedCategory) return
    try {
      await deleteCategory(Number(selectedCategory.id)).unwrap()
      toast.success('Category deleted')
      setDeleteConfirmOpen(false)
      setSelectedCategory(null)
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
    setSelectedCategory(null)
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-1">Manage course categories</p>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        onAddClick={() => {
          setSelectedCategory(null)
          dispatch(openModal({ type: 'create' }))
        }}
        searchPlaceholder="Search categories..."
        addButtonLabel="Add category"
        // ✅ No currentPage / totalPages / onPageChange — not needed
      />

      <Modal
        isOpen={modalOpen}
        title={selectedCategory ? 'Edit category' : 'New category'}  // ✅ dynamic title
        onOpenChange={handleCloseModal}
      >
        <CategoryForm
          initialData={selectedCategory ?? undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"?`}
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}