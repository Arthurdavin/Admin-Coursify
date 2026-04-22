'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Student } from '@/src/types'
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from '@/src/store/services/studentsApi'

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email'),
  status:    z.enum(['active', 'inactive']).default('active'),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormProps {
  initialData?: Partial<Student>
  onSuccess?: () => void
}

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation()
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',  // ✅ was 'name'
      lastName:  initialData?.lastName  ?? '',  // ✅ was missing
      email:     initialData?.email     ?? '',
      status:    (initialData?.status as StudentFormData['status']) ?? 'active',
    },
  })

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (initialData?.id) {
        await updateStudent({ id: initialData.id, data }).unwrap()
        toast.success('Student updated successfully')
      } else {
        await createStudent(data).unwrap()
        toast.success('Student created successfully')
      }
      onSuccess?.()
    } catch {
      toast.error('Failed to save student')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* ✅ was a single 'name' field */}
      <div className="space-y-2">
        <label className="text-sm font-medium">First name</label>
        <Input placeholder="First name" {...register('firstName')} />
        {errors.firstName && (
          <p className="text-sm text-destructive">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Last name</label>
        <Input placeholder="Last name" {...register('lastName')} />
        {errors.lastName && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input placeholder="student@example.com" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* ✅ Controller instead of watch + setValue, removed 'suspended' (not in schema) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? 'Saving...' : 'Save student'}
        </Button>
      </div>

    </form>
  )
}