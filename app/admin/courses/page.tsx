"use client";

import React, { useState } from "react";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
} from "@/src/store/services/coursesApi";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  setCurrentPage,
  setSearchQuery,
  openModal,
  closeModal,
} from "@/src/store/slices/uiSlice";
import { DataTable, Column } from "@/src/components/admin/DataTable";
import { Modal, ConfirmDialog } from "@/src/components/admin/Modal";
// import { CourseForm } from "@/src/components/admin/forms/CourseForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit2, BookOpen } from "lucide-react";
import type { Course } from "@/src/types";

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { currentPage, pageSize, searchQuery, modalOpen, modalType } =
    useAppSelector((state) => state.ui);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: coursesData, isLoading } = useGetCoursesQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const courses = coursesData?.data || [];
  const totalPages = coursesData?.totalPages || 1;

  const columns: Column<Course>[] = [
    {
      key: "thumbnail",
      label: "",
      render: (value, row) =>
        value ? (
          <img
            src={value}
            alt={row.title}
            className="h-10 w-16 rounded-md object-cover shrink-0"
          />
        ) : (
          <div className="h-10 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
        ),
    },
    {
      key: "title",
      label: "Title",
      render: (value, row) => (
        <div className="min-w-[160px]">
          <p className="font-medium line-clamp-1">{value}</p>
          <p className="text-xs text-muted-foreground">{row.teacherName}</p>
        </div>
      ),
    },
    {
      key: "categoryName",
      label: "Category",
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (value) => (
        <span className="font-medium">
          {value === 0 ? (
            <Badge variant="secondary">Free</Badge>
          ) : (
            `$${Number(value).toFixed(2)}`
          )}
        </span>
      ),
    },
    {
      key: "lessons",
      label: "Lessons",
      render: (value) => <span className="text-sm">{value?.length ?? 0}</span>,
    },
    {
      key: "tags",
      label: "Tags",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Published" : "Draft"}
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
              setSelectedCourse(row);
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
              setSelectedCourse(row);
              setDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse.id).unwrap();
      toast.success(`"${selectedCourse.title}" deleted successfully`);
      setDeleteConfirmOpen(false);
      setSelectedCourse(null);
    } catch {
      toast.error("Failed to delete course");
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setSelectedCourse(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground mt-1">
          Manage all courses in the platform
        </p>
      </div>

      <DataTable<Course & { id: any }>
        columns={columns}
        data={courses}
        isLoading={isLoading}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onAddClick={() => {
          setSelectedCourse(null);
          dispatch(openModal({ type: "create" }));
        }}
        searchPlaceholder="Search courses..."
        addButtonLabel="Add Course"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />

      <Modal
        isOpen={modalOpen && (modalType === "create" || modalType === "edit")}
        title={modalType === "edit" ? "Edit Course" : "Add New Course"}
        onOpenChange={handleCloseModal}
      >
        {/* <CourseForm
          initialData={
            modalType === "edit" ? (selectedCourse ?? undefined) : undefined
          }
          onSuccess={handleCloseModal}
        /> */}
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleDeleteCourse}
      />
    </div>
  );
}
