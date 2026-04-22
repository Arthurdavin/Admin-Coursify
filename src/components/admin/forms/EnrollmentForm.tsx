// 'use client'

// import React from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'

// import { Button } from '@/components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { toast } from 'sonner'
// import { Enrollment } from '@/src/types'
// import { useCreateEnrollmentMutation, useUpdateEnrollmentMutation } from '@/src/store/services/enrollmentsApi'
// import { useGetStudentsQuery } from '@/src/store/services/studentsApi'
// import { useGetCoursesQuery } from '@/src/store/services/coursesApi'


// const enrollmentSchema = z.object({
//   studentId: z.string().min(1, 'Student is required'),
//   courseId: z.string().min(1, 'Course is required'),
//   status: z.enum(['active', 'completed', 'dropped']).default('active'),
// })

// type EnrollmentFormData = z.infer<typeof enrollmentSchema>

// interface EnrollmentFormProps {
//   initialData?: Partial<Enrollment>
//   onSuccess?: () => void
// }

// export function EnrollmentForm({ initialData, onSuccess }: EnrollmentFormProps) {
//   const [createEnrollment, { isLoading: isCreating }] = useCreateEnrollmentMutation()
//   const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation()
//   const { data: studentsData } = useGetStudentsQuery({ pageSize: 100 })
//   const { data: coursesData } = useGetCoursesQuery({ pageSize: 100 })

//   const {
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm<EnrollmentFormData>({
//     resolver: zodResolver(enrollmentSchema),
//     defaultValues: {
//       studentId: initialData?.student?.id || '',
//       courseId: initialData?.course?.id || '',
//       status: (initialData?.status as any) || 'active',
//     },
//   })

//   const studentId = watch('studentId')
//   const courseId = watch('courseId')
//   const status = watch('status')

//   const onSubmit = async (data: EnrollmentFormData) => {
//     try {
//       if (initialData?.id) {
//         await updateEnrollment({
//           id: initialData.id,
//           data,
//         }).unwrap()
//         toast.success('Enrollment updated successfully')
//       } else {
//         await createEnrollment(data).unwrap()
//         toast.success('Enrollment created successfully')
//       }
//       onSuccess?.()
//     } catch (error) {
//       toast.error('Failed to save enrollment')
//     }
//   }

//   const students = studentsData?.data || []
//   const courses = coursesData?.data || []

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Student</label>
//         <Select value={studentId} onValueChange={(value) => setValue('studentId', value)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select a student" />
//           </SelectTrigger>
//           <SelectContent>
//             {students.map((student) => (
//               <SelectItem key={student.id} value={student.id}>
//                 {student.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.studentId && <p className="text-sm text-destructive">{errors.studentId.message}</p>}
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
//         <label className="text-sm font-medium">Status</label>
//         <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="active">Active</SelectItem>
//             <SelectItem value="completed">Completed</SelectItem>
//             <SelectItem value="dropped">Dropped</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex gap-2 justify-end pt-4">
//         <Button type="submit" disabled={isCreating || isUpdating}>
//           {isCreating || isUpdating ? 'Saving...' : 'Save Enrollment'}
//         </Button>
//       </div>
//     </form>
//   )
// }
