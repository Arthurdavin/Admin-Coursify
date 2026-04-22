"use client";

import React, { useState, useMemo } from "react";
import {
  useGetStudentsQuery,
  useDeleteStudentMutation,
} from "@/src/store/services/studentsApi";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  setCurrentPage,
  setSearchQuery,
  openModal,
  closeModal,
} from "@/src/store/slices/uiSlice";
import { DataTable, Column } from "@/src/components/admin/DataTable";
import { Modal, ConfirmDialog } from "@/src/components/admin/Modal";
import { StudentForm } from "@/src/components/admin/forms/StudentForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit2 } from "lucide-react";
import type { Student } from "@/src/types";

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const {
    currentPage,
    pageSize,
    searchQuery,
    modalOpen,
    modalType,
    modalData,
  } = useAppSelector((state) => state.ui);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const {
    data: studentsData,
    isLoading,
    isFetching,
  } = useGetStudentsQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const students = studentsData?.data || [];
  const totalPages = studentsData?.totalPages || 1;

  const columns = useMemo<Column<Student>[]>(
    () => [
      {
        key: "imageUrl",
        label: "",
        render: (value) => (
          <img
            src={value ?? "/default-avatar.png"}
            alt="avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        ),
      },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "gender", label: "Gender" },
      {
        key: "role",
        label: "Role",
        render: (value) => (
          <Badge variant="default" className="capitalize">
            {value}
          </Badge>
        ),
      },
      {
        key: "id",
        label: "Actions",
        render: (_, row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal({ type: "edit", data: row }))}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setStudentToDelete(row);
                setDeleteConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [dispatch],
  );

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent(studentToDelete.id).unwrap();
      toast.success("Student deleted successfully");
      setDeleteConfirmOpen(false);
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground mt-1">
          Manage student accounts and permissions
        </p>
      </div>

      <DataTable<Student & { id: any }>
        columns={columns}
        data={students}
        isLoading={isLoading || isFetching}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onAddClick={() => dispatch(openModal({ type: "create" }))}
        searchPlaceholder="Search students..."
        addButtonLabel="Add Student"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />

      <Modal
        isOpen={modalOpen && (modalType === "create" || modalType === "edit")}
        title={modalType === "create" ? "Add Student" : "Edit Student"}
        onOpenChange={() => dispatch(closeModal())}
      >
        <StudentForm
          // Cast modalData to Student so it matches the expected prop type
          initialData={
            modalType === "edit" ? (modalData as Student) : undefined
          }
          onSuccess={() => dispatch(closeModal())}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Student"
        description={`Are you sure you want to delete ${studentToDelete?.firstName}? This cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
