'use client'

import React, { useState } from 'react'
import { useGetMaterialsQuery, useDeleteMaterialMutation } from '@/src/store/services/materialsApi'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux'
import { setCurrentPage, setSearchQuery, openModal, closeModal } from '@/src/store/slices/uiSlice'
import { DataTable, Column } from '@/src/components/admin/DataTable'
import { Modal, ConfirmDialog } from '@/src/components/admin/Modal'
// import { MaterialForm } from '@/src/components/admin/forms/MaterialForm'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2, Edit2, Download } from 'lucide-react'
import type { Material } from '@/src/types'

export default function MaterialsPage() {
  const dispatch = useAppDispatch()
  const { currentPage, pageSize, searchQuery, modalOpen } = useAppSelector(state => state.ui)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  const { data: materialsData, isLoading } = useGetMaterialsQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
  })

  const [deleteMaterial, { isLoading: isDeleting }] = useDeleteMaterialMutation()

  const materials = materialsData?.data || []
  const totalPages = materialsData?.totalPages || 1

  const columns: Column<Material>[] = [
    { key: 'title', label: 'Title' },
    {
      key: 'course',
      label: 'Course',
      render: (value) => value?.title || '-',
    },
    { key: 'fileType', label: 'Type' },
    {
      key: 'fileSize',
      label: 'Size',
      render: (value) => `${(value / 1024).toFixed(2)} KB`,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedMaterial(row)
              dispatch(openModal({ type: 'edit', data: row }))
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedMaterial(row)
              setDeleteConfirmOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return
    try {
      await deleteMaterial(selectedMaterial.id).unwrap()
      toast.success('Material deleted successfully')
      setDeleteConfirmOpen(false)
    } catch (error) {
      toast.error('Failed to delete material')
    }
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
    setSelectedMaterial(null)
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Materials</h1>
        <p className="text-muted-foreground mt-1">Manage course materials and resources</p>
      </div>

      <DataTable
        columns={columns}
        data={materials}
        isLoading={isLoading}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onAddClick={() => {
          setSelectedMaterial(null)
          dispatch(openModal({ type: 'create' }))
        }}
        searchPlaceholder="Search materials..."
        addButtonLabel="Add Material"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />

      <Modal
        isOpen={modalOpen}
        title="Material Details"
        onOpenChange={handleCloseModal}
      >
        {/* <MaterialForm
          initialData={selectedMaterial || undefined}
          onSuccess={handleCloseModal}
        /> */}
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Material"
        description="Are you sure you want to delete this material?"
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteMaterial}
      />
    </div>
  )
}
