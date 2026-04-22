// 'use client'

// import React from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { toast } from 'sonner'
// import { Course } from '@/src/types'

// import { useGetCategoriesQuery } from '@/src/store/services/categoriesApi'
// import { useGetTeachersQuery } from '@/src/store/services/teachersApi'
// import { useCreateCourseMutation, useUpdateCourseMutation } from '@/src/store/services/coursesApi'


// const courseSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   categoryId: z.string().min(1, 'Category is required'),
//   instructorId: z.string().min(1, 'Instructor is required'),
//   status: z.enum(['active', 'inactive']).default('active'),
// })

// type CourseFormData = z.infer<typeof courseSchema>

// interface CourseFormProps {
//   initialData?: Partial<Course>
//   onSuccess?: () => void
// }

// export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
//   const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
//   const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()
//   const { data: categoriesData } = useGetCategoriesQuery({ pageSize: 100 })
//   const { data: teachersData } = useGetTeachersQuery({ pageSize: 100 })

//   // ... inside CourseForm component

// const {
//   register,
//   handleSubmit,
//   formState: { errors },
//   watch,
//   setValue,
// } = useForm<CourseFormData>({
//   resolver: zodResolver(courseSchema),
//   defaultValues: {
//     title: initialData?.title || '',
//     description: initialData?.description || '',
//     // Ensure IDs are strings for the Select components
//     categoryId: initialData?.categoryId?.toString() || '', 
//     instructorId: initialData?.instructor?.id?.toString() || '',
//     status: (initialData?.status as any) || 'active',
//   },
// })

// const onSubmit = async (data: CourseFormData) => {
//   try {
//     if (initialData?.id) {
//       await updateCourse({
//         // ✅ Fix: Convert id to number for the RTK Query mutation
//         id: Number(initialData.id), 
//         data,
//       }).unwrap()
//       toast.success('Course updated successfully')
//     } else {
//       await createCourse(data).unwrap()
//       toast.success('Course created successfully')
//     }
//     onSuccess?.()
//   } catch (error) {
//     toast.error('Failed to save course')
//   }
// }

//   const categories = categoriesData?.data || []
//   const teachers = teachersData?.data || []

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Title</label>
//         <Input
//           placeholder="Course title"
//           {...register('title')}
//         />
//         {errors.title && (
//           <p className="text-sm text-destructive">{errors.title.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">Description</label>
//         <textarea
//           placeholder="Course description"
//           className="w-full px-3 py-2 border border-input rounded-md text-sm"
//           rows={3}
//           {...register('description')}
//         />
//         {errors.description && (
//           <p className="text-sm text-destructive">{errors.description.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">Category</label>
//         <Select value={categoryId} onValueChange={(value) => setValue('categoryId', value)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select a category" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((category) => (
//               <SelectItem key={category.id} value={category.id}>
//                 {category.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.categoryId && (
//           <p className="text-sm text-destructive">{errors.categoryId.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">Instructor</label>
//         <Select value={instructorId} onValueChange={(value) => setValue('instructorId', value)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select an instructor" />
//           </SelectTrigger>
//           <SelectContent>
//             {teachers.map((teacher) => (
//               <SelectItem key={teacher.id} value={teacher.id}>
//                 {teacher.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.instructorId && (
//           <p className="text-sm text-destructive">{errors.instructorId.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">Status</label>
//         <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="active">Active</SelectItem>
//             <SelectItem value="inactive">Inactive</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex gap-2 justify-end pt-4">
//         <Button
//           type="submit"
//           disabled={isCreating || isUpdating}
//         >
//           {isCreating || isUpdating ? 'Saving...' : 'Save Course'}
//         </Button>
//       </div>
//     </form>
//   )
// }
