"use client";

import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import {
  setCurrentPage,
  setSearchQuery,
  openModal,
  closeModal,
} from "@/src/store/slices/uiSlice";
import { DataTable, Column } from "@/src/components/admin/DataTable";
import { Modal, ConfirmDialog } from "@/src/components/admin/Modal";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit2, BookOpen } from "lucide-react";
import type { Book } from "@/src/types";
import BookForm from "@/src/components/admin/forms/BookForm";
import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from "@/src/store/services/bookApi";

export default function BooksPage() {
  const dispatch = useAppDispatch();
  const { currentPage, pageSize, searchQuery, modalOpen, modalType } =
    useAppSelector((state) => state.ui);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: booksData, isLoading } = useGetBooksQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
  });

  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const books = booksData?.data ?? [];
  const totalPages = booksData?.totalPages ?? 1;

  const columns: Column<Book>[] = [
    {
      // ✅ was "coverImage" — real API field is "thumbnail"
      key: "thumbnail",
      label: "",
      render: (value, row) =>
        value ? (
          <img
            src={value}
            alt={row.title}
            className="h-14 w-10 rounded-md object-cover shrink-0"
          />
        ) : (
          <div className="h-14 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
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
          {/* ✅ was "row.author" — real API field is "uploadedByName" */}
          <p className="text-xs text-muted-foreground">{row.uploadedByName}</p>
        </div>
      ),
    },
    {
      // ✅ was "categoryName" (string) — real API field is "categories" (string[])
      key: "categories",
      label: "Category",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.map((cat) => (
            <Badge key={cat} variant="outline" className="capitalize">
              {cat}
            </Badge>
          ))}
        </div>
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
              setSelectedBook(row);
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
              setSelectedBook(row);
              setDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      // ✅ id is number — matches deleteBook(id: number) mutation
      await deleteBook(selectedBook.id).unwrap();
      toast.success(`"${selectedBook.title}" deleted successfully`);
      setDeleteConfirmOpen(false);
      setSelectedBook(null);
    } catch {
      toast.error("Failed to delete book");
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setSelectedBook(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Books</h1>
        <p className="text-muted-foreground mt-1">
          Manage all books in the platform
        </p>
      </div>

      <DataTable<Book & { id: any }>
        columns={columns}
        data={books}
        isLoading={isLoading}
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onAddClick={() => {
          setSelectedBook(null);
          dispatch(openModal({ type: "create" }));
        }}
        searchPlaceholder="Search books..."
        addButtonLabel="Add Book"
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />

      <Modal
        isOpen={modalOpen && (modalType === "create" || modalType === "edit")}
        title={modalType === "edit" ? "Edit Book" : "Add New Book"}
        onOpenChange={handleCloseModal}
      >
        <BookForm
          initialData={
            modalType === "edit" ? (selectedBook ?? undefined) : undefined
          }
          onSuccess={handleCloseModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Book"
        description={`Are you sure you want to delete "${selectedBook?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setSelectedBook(null);
        }}
        onConfirm={handleDeleteBook}
      />
    </div>
  );
}
