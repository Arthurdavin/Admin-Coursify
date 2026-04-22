"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/src/components/admin/DataTable";
import { Modal, ConfirmDialog } from "@/src/components/admin/Modal";
import { TeacherForm } from "@/src/components/admin/forms/TeacherForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Trash2, Edit2 } from "lucide-react";
import type { Teacher } from "@/src/types";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  useGetTeachersQuery,
  useDeleteTeacherMutation,
} from "@/src/store/services/teachersApi";
import {
  closeModal,
  openModal,
  setCurrentPage,
  setSearchQuery,
} from "@/src/store/slices/uiSlice";

export default function TeachersPage() {
  const dispatch = useAppDispatch();
  const { currentPage, pageSize, searchQuery, modalOpen, modalType } =
    useAppSelector((state) => state.ui);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const {
    data: teachersData,
    isLoading,
    isError,
  } = useGetTeachersQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const teachers = teachersData?.data || [];
  const totalPages = teachersData?.totalPages || 1;

  const columns: Column<Teacher>[] = [
    {
      key: "imageUrl",
      label: "",
      render: (_, row) => (
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.imageUrl ?? undefined} alt={row.firstName} />
          <AvatarFallback className="text-xs font-semibold">
            {row.firstName[0]}
            {row.lastName[0]}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: "firstName",
      label: "Name",
      render: (_, row) => (
        <div>
          <p className="font-medium">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-muted-foreground">@{row.username}</p>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "gender",
      label: "Gender",
      render: (value) => (
        <span className="capitalize text-sm">
          {value?.toLowerCase() ?? "—"}
        </span>
      ),
    },
    {
      key: "bio",
      label: "Bio",
      render: (value) =>
        value ? (
          <span className="text-sm line-clamp-1 max-w-[200px]">{value}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <Badge variant="secondary" className="capitalize">
          {value?.toLowerCase() ?? "teacher"}
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
            onClick={() => {
              setSelectedTeacher(row);
              dispatch(openModal({ type: "edit", data: row }));
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedTeacher(row);
              setDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    try {
      await deleteTeacher(selectedTeacher.id).unwrap();
      toast.success(`${selectedTeacher.firstName} has been deleted`);
      setDeleteConfirmOpen(false);
      setSelectedTeacher(null);
    } catch {
      toast.error("Failed to delete teacher. Check permissions.");
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setSelectedTeacher(null);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
        <h2 className="text-xl font-semibold text-destructive">
          Access Denied
        </h2>
        <p className="text-muted-foreground text-sm">
          You do not have permission to view this page or your session has
          expired.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground mt-1">
          Manage all teachers in the platform
        </p>
      </div>

      <DataTable<Teacher & { id: any }>
        columns={columns}
        data={teachers}
        isLoading={isLoading}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onAddClick={() => {
          setSelectedTeacher(null);
          dispatch(openModal({ type: "create" }));
        }}
        searchPlaceholder="Search teachers..."
        addButtonLabel="Add Teacher"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen && (modalType === "create" || modalType === "edit")}
        title={modalType === "edit" ? "Edit Teacher" : "Add New Teacher"}
        onOpenChange={handleCloseModal}
      >
        <TeacherForm
          initialData={
            modalType === "edit" ? (selectedTeacher ?? undefined) : undefined
          }
          onSuccess={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Teacher"
        description={`Are you sure you want to delete ${selectedTeacher?.firstName} ${selectedTeacher?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setSelectedTeacher(null);
        }}
        onConfirm={handleDeleteTeacher}
      />
    </div>
  );
}
