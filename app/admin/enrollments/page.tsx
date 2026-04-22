'use client'

import React, { useState } from 'react'
import { useGetEnrollmentsQuery, useDeleteEnrollmentMutation } from '@/src/store/services/enrollmentsApi'
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux'
import { setCurrentPage, setSearchQuery, openModal, closeModal } from '@/src/store/slices/uiSlice'
import { DataTable, Column } from '@/src/components/admin/DataTable'
import { Modal, ConfirmDialog } from '@/src/components/admin/Modal'
// import { EnrollmentForm } from '@/src/components/admin/forms/EnrollmentForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trash2, Edit2 } from 'lucide-react'
import type { Enrollment } from '@/src/types'

export default function EnrollmentsPage() {
  const dispatch = useAppDispatch()
  const { currentPage, pageSize, searchQuery, modalOpen } = useAppSelector(state => state.ui)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)

  const { data: enrollmentsData, isLoading } = useGetEnrollmentsQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
  })

  const [deleteEnrollment, { isLoading: isDeleting }] = useDeleteEnrollmentMutation()

  const enrollments = enrollmentsData?.data || []
  const totalPages = enrollmentsData?.totalPages || 1

  const columns: Column<Enrollment>[] = [
    {
      key: 'student',
      label: 'Student',
      render: (value) => value?.name || '-',
    },
    {
      key: 'course',
      label: 'Course',
      render: (value) => value?.title || '-',
    },
    { key: 'progress', label: 'Progress' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
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
              setSelectedEnrollment(row)
              dispatch(openModal({ type: 'edit', data: row }))
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedEnrollment(row)
              setDeleteConfirmOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleDeleteEnrollment = async () => {
    if (!selectedEnrollment) return
    try {
      await deleteEnrollment(selectedEnrollment.id).unwrap()
      toast.success('Enrollment deleted successfully')
      setDeleteConfirmOpen(false)
    } catch (error) {
      toast.error('Failed to delete enrollment')
    }
  }

  const handleCloseModal = () => {
    dispatch(closeModal())
    setSelectedEnrollment(null)
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground mt-1">Manage student course enrollments</p>
      </div>

      <DataTable
        columns={columns}
        data={enrollments}
        isLoading={isLoading}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onAddClick={() => {
          setSelectedEnrollment(null)
          dispatch(openModal({ type: 'create' }))
        }}
        searchPlaceholder="Search enrollments..."
        addButtonLabel="Add Enrollment"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />

      <Modal
        isOpen={modalOpen}
        title="Enrollment Details"
        onOpenChange={handleCloseModal}
      >
        {/* <EnrollmentForm
          initialData={selectedEnrollment || undefined}
          onSuccess={handleCloseModal}
        /> */}
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Enrollment"
        description="Are you sure you want to delete this enrollment?"
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteEnrollment}
      />
    </div>
  )
}
