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
// import { Material } from '@/src/types'
// import { useCreateMaterialMutation, useUpdateMaterialMutation } from '@/src/store/services/materialsApi'
// import { useGetCoursesQuery } from '@/src/store/services/coursesApi'


// const materialSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().optional(),
//   courseId: z.string().min(1, 'Course is required'),
//   fileUrl: z.string().url('Invalid URL'),
//   fileType: z.string().min(1, 'File type is required'),
//   fileSize: z.number().positive('File size must be positive'),
// })

// type MaterialFormData = z.infer<typeof materialSchema>

// interface MaterialFormProps {
//   initialData?: Partial<Material>
//   onSuccess?: () => void
// }

// export function MaterialForm({ initialData, onSuccess }: MaterialFormProps) {
//   const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation()
//   const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation()
//   const { data: coursesData } = useGetCoursesQuery({ pageSize: 100 })

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm<MaterialFormData>({
//     resolver: zodResolver(materialSchema),
//     defaultValues: {
//       title: initialData?.title || '',
//       description: initialData?.description || '',
//       courseId: initialData?.course?.id || '',
//       fileUrl: initialData?.fileUrl || '',
//       fileType: initialData?.fileType || '',
//       fileSize: initialData?.fileSize || 0,
//     },
//   })

//   const courseId = watch('courseId')

//   const onSubmit = async (data: MaterialFormData) => {
//     try {
//       if (initialData?.id) {
//         await updateMaterial({
//           id: initialData.id,
//           data,
//         }).unwrap()
//         toast.success('Material updated successfully')
//       } else {
//         await createMaterial(data).unwrap()
//         toast.success('Material created successfully')
//       }
//       onSuccess?.()
//     } catch (error) {
//       toast.error('Failed to save material')
//     }
//   }

//   const courses = coursesData?.data || []

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-96 overflow-y-auto">
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Title</label>
//         <Input placeholder="Material title" {...register('title')} />
//         {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">Description</label>
//         <textarea
//           placeholder="Material description"
//           className="w-full px-3 py-2 border border-input rounded-md text-sm"
//           rows={2}
//           {...register('description')}
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">Course</label>
//         <Select value={courseId} onValueChange={(value) => setValue('courseId', value)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select a course" />
//           </SelectTrigger>
//           <SelectContent>
//             {courses.map((course) => (
//               <SelectItem key={course.id} value={course.id}>
//                 {course.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.courseId && <p className="text-sm text-destructive">{errors.courseId.message}</p>}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">File URL</label>
//         <Input placeholder="https://example.com/file.pdf" {...register('fileUrl')} />
//         {errors.fileUrl && <p className="text-sm text-destructive">{errors.fileUrl.message}</p>}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">File Type</label>
//         <Input placeholder="e.g., pdf, doc, ppt" {...register('fileType')} />
//         {errors.fileType && <p className="text-sm text-destructive">{errors.fileType.message}</p>}
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm font-medium">File Size (bytes)</label>
//         <Input
//           type="number"
//           placeholder="File size in bytes"
//           {...register('fileSize', { valueAsNumber: true })}
//         />
//         {errors.fileSize && <p className="text-sm text-destructive">{errors.fileSize.message}</p>}
//       </div>

//       <div className="flex gap-2 justify-end pt-4">
//         <Button type="submit" disabled={isCreating || isUpdating}>
//           {isCreating || isUpdating ? 'Saving...' : 'Save Material'}
//         </Button>
//       </div>
//     </form>
//   )
// }
