"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Teacher } from "@/src/types";
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "@/src/store/services/teachersApi";

const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  specialization: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  initialData?: Partial<Teacher>;
  onSuccess?: () => void;
}

export function TeacherForm({ initialData, onSuccess }: TeacherFormProps) {
  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      // Cast initialData to any to bypass the missing property check
      name: (initialData as any)?.name || "",
      email: initialData?.email || "",
      specialization: (initialData as any)?.specialization || "",
      status: (initialData?.status as any) || "active",
    },
  });

  const status = watch("status");

  const onSubmit = async (formData: TeacherFormData) => {
  try {
    // 1. Split the name (assuming "First Last" format)
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // 2. Construct the request object to match 'CreateTeacherRequest'
    const requestData = {
      username: formData.email, // Often username is set to email by default
      firstName: firstName,
      lastName: lastName,
      email: formData.email,
      status: formData.status,
      specialization: formData.specialization,
    };

    if (initialData?.id) {
      await updateTeacher({
        id: Number(initialData.id),
        data: requestData,
      }).unwrap();
      toast.success('Teacher updated successfully');
    } else {
      await createTeacher(requestData).unwrap();
      toast.success('Teacher created successfully');
    }
    onSuccess?.();
  } catch (error) {
    toast.error('Failed to save teacher');
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input placeholder="Teacher name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input placeholder="teacher@example.com" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Specialization</label>
        <Input
          placeholder="e.g., Mathematics"
          {...register("specialization")}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={status}
          onValueChange={(value) => setValue("status", value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : "Save Teacher"}
        </Button>
      </div>
    </form>
  );
}
